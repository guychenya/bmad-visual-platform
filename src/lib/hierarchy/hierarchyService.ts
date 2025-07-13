// Hierarchical Project Management Service
// Manages the three-tier structure: Organization → Project → Workflow

import { 
  Organization, 
  Project, 
  WorkflowInstance, 
  ProjectWorkflow,
  Deliverable,
  Authorization,
  User,
  WorkflowProgress,
  ProjectProgress
} from './types'

export class HierarchyService {
  private organizations: Map<string, Organization> = new Map()
  private projects: Map<string, Project> = new Map()
  private workflows: Map<string, WorkflowInstance> = new Map()
  private users: Map<string, User> = new Map()

  constructor() {
    this.loadData()
    this.initializeDefaultData()
  }

  // ========== ORGANIZATION MANAGEMENT ==========
  
  async createOrganization(data: Partial<Organization>, createdBy: string): Promise<Organization> {
    const organization: Organization = {
      id: `org-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: data.name || 'New Organization',
      description: data.description || '',
      type: data.type || 'custom',
      logo: data.logo,
      settings: {
        timezone: 'UTC',
        workingHours: { start: '09:00', end: '17:00', timezone: 'UTC', workdays: [1, 2, 3, 4, 5] },
        defaultProjectTemplate: 'bmad-methodology',
        approvalWorkflow: true,
        notifications: { email: true, slack: false, inApp: true, frequency: 'daily' },
        integrations: [],
        branding: {
          primaryColor: '#3b82f6',
          secondaryColor: '#64748b',
          logo: '',
          favicon: ''
        },
        ...data.settings
      },
      members: [{
        userId: createdBy,
        role: 'owner',
        permissions: [],
        joinedAt: new Date().toISOString(),
        department: 'leadership',
        title: 'Organization Owner'
      }],
      projects: [],
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      createdBy,
      status: 'active',
      metadata: {
        totalProjects: 0,
        activeWorkflows: 0,
        teamSize: 1
      }
    }

    this.organizations.set(organization.id, organization)
    this.saveData()
    return organization
  }

  async getOrganization(id: string): Promise<Organization | null> {
    return this.organizations.get(id) || null
  }

  async getOrganizations(userId: string): Promise<Organization[]> {
    return Array.from(this.organizations.values()).filter(org =>
      org.members.some(member => member.userId === userId)
    )
  }

  async updateOrganization(id: string, updates: Partial<Organization>): Promise<boolean> {
    const org = this.organizations.get(id)
    if (!org) return false

    const updatedOrg = {
      ...org,
      ...updates,
      modified: new Date().toISOString()
    }

    this.organizations.set(id, updatedOrg)
    this.saveData()
    return true
  }

  async deleteOrganization(id: string): Promise<boolean> {
    // Cascade delete projects and workflows
    const org = this.organizations.get(id)
    if (!org) return false

    // Delete all projects in this organization
    for (const projectId of org.projects) {
      await this.deleteProject(projectId)
    }

    this.organizations.delete(id)
    this.saveData()
    return true
  }

  // ========== PROJECT MANAGEMENT ==========

  async createProject(organizationId: string, data: Partial<Project>, createdBy: string): Promise<Project> {
    const organization = this.organizations.get(organizationId)
    if (!organization) throw new Error('Organization not found')

    const project: Project = {
      id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: data.name || 'New Project',
      description: data.description || '',
      organizationId,
      type: data.type || 'custom',
      status: 'planning',
      priority: data.priority || 'medium',
      workflows: [],
      teams: [],
      deliverables: [],
      milestones: [],
      progress: {
        overall: 0,
        byPhase: {},
        byDeliverable: {},
        timeline: [],
        velocity: 0,
        burndown: [],
        health: 'green',
        risks: [],
        blockers: [],
        lastUpdated: new Date().toISOString()
      },
      timeline: {
        startDate: new Date().toISOString(),
        plannedEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        milestones: [],
        phases: []
      },
      stakeholders: [],
      requirements: [],
      risks: [],
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      createdBy,
      assignedTo: [createdBy],
      tags: [],
      settings: {
        visibility: 'internal',
        allowExternalCollaborators: false,
        requireApprovals: true,
        autoArchive: false,
        notifications: { email: true, slack: false, inApp: true, frequency: 'daily' },
        integrations: []
      }
    }

    this.projects.set(project.id, project)
    
    // Add project to organization
    organization.projects.push(project.id)
    organization.metadata.totalProjects++
    organization.modified = new Date().toISOString()
    this.organizations.set(organizationId, organization)

    this.saveData()
    return project
  }

  async getProject(id: string): Promise<Project | null> {
    return this.projects.get(id) || null
  }

  async getProjectsByOrganization(organizationId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project =>
      project.organizationId === organizationId
    )
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<boolean> {
    const project = this.projects.get(id)
    if (!project) return false

    const updatedProject = {
      ...project,
      ...updates,
      modified: new Date().toISOString()
    }

    this.projects.set(id, updatedProject)
    this.saveData()
    return true
  }

  async deleteProject(id: string): Promise<boolean> {
    const project = this.projects.get(id)
    if (!project) return false

    // Delete all workflows in this project
    const projectWorkflows = Array.from(this.workflows.values()).filter(
      workflow => workflow.projectId === id
    )
    
    for (const workflow of projectWorkflows) {
      this.workflows.delete(workflow.id)
    }

    // Remove from organization
    const organization = this.organizations.get(project.organizationId)
    if (organization) {
      organization.projects = organization.projects.filter(pid => pid !== id)
      organization.metadata.totalProjects--
      organization.modified = new Date().toISOString()
      this.organizations.set(project.organizationId, organization)
    }

    this.projects.delete(id)
    this.saveData()
    return true
  }

  // ========== WORKFLOW MANAGEMENT ==========

  async createWorkflow(projectId: string, data: Partial<WorkflowInstance>, createdBy: string): Promise<WorkflowInstance> {
    const project = this.projects.get(projectId)
    if (!project) throw new Error('Project not found')

    const workflow: WorkflowInstance = {
      id: `wf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      projectId,
      workflowId: data.workflowId || 'custom',
      name: data.name || 'New Workflow',
      description: data.description || '',
      type: data.type || 'custom',
      status: 'draft',
      phases: [],
      currentPhase: '',
      progress: {
        overall: 0,
        currentPhase: '',
        completedPhases: [],
        remainingPhases: [],
        estimatedCompletion: '',
        actualHours: 0,
        estimatedHours: 0,
        efficiency: 1.0,
        quality: 0,
        health: 'on-track',
        metrics: []
      },
      deliverables: [],
      artifacts: [],
      reports: [],
      assignedAgents: [],
      humanCollaborators: [createdBy],
      timeline: {
        startDate: new Date().toISOString(),
        plannedEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
        phases: [],
        milestones: []
      },
      authorizations: [],
      inputs: [],
      context: {
        organizationId: project.organizationId,
        projectId,
        projectType: project.type,
        stakeholders: project.stakeholders,
        requirements: project.requirements,
        constraints: [],
        assumptions: [],
        environment: 'development',
        chatHistory: []
      },
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      createdBy
    }

    this.workflows.set(workflow.id, workflow)

    // Add workflow to project
    const projectWorkflow: ProjectWorkflow = {
      id: workflow.id,
      name: workflow.name,
      type: workflow.type,
      status: 'draft',
      phases: [],
      currentPhase: '',
      assignedAgents: [],
      startDate: workflow.timeline.startDate,
      expectedEndDate: workflow.timeline.plannedEndDate,
      progress: 0,
      deliverables: [],
      dependencies: []
    }

    project.workflows.push(projectWorkflow)
    project.modified = new Date().toISOString()
    this.projects.set(projectId, project)

    // Update organization metadata
    const organization = this.organizations.get(project.organizationId)
    if (organization) {
      organization.metadata.activeWorkflows++
      organization.modified = new Date().toISOString()
      this.organizations.set(project.organizationId, organization)
    }

    this.saveData()
    return workflow
  }

  async getWorkflow(id: string): Promise<WorkflowInstance | null> {
    return this.workflows.get(id) || null
  }

  async getWorkflowsByProject(projectId: string): Promise<WorkflowInstance[]> {
    return Array.from(this.workflows.values()).filter(workflow =>
      workflow.projectId === projectId
    )
  }

  async updateWorkflow(id: string, updates: Partial<WorkflowInstance>): Promise<boolean> {
    const workflow = this.workflows.get(id)
    if (!workflow) return false

    const updatedWorkflow = {
      ...workflow,
      ...updates,
      modified: new Date().toISOString()
    }

    this.workflows.set(id, updatedWorkflow)

    // Update project workflow reference
    const project = this.projects.get(workflow.projectId)
    if (project) {
      const workflowIndex = project.workflows.findIndex(pw => pw.id === id)
      if (workflowIndex !== -1) {
        project.workflows[workflowIndex] = {
          ...project.workflows[workflowIndex],
          name: updatedWorkflow.name,
          status: updatedWorkflow.status,
          progress: updatedWorkflow.progress.overall
        }
        project.modified = new Date().toISOString()
        this.projects.set(workflow.projectId, project)
      }
    }

    this.saveData()
    return true
  }

  async deleteWorkflow(id: string): Promise<boolean> {
    const workflow = this.workflows.get(id)
    if (!workflow) return false

    // Remove from project
    const project = this.projects.get(workflow.projectId)
    if (project) {
      project.workflows = project.workflows.filter(pw => pw.id !== id)
      project.modified = new Date().toISOString()
      this.projects.set(workflow.projectId, project)

      // Update organization metadata
      const organization = this.organizations.get(project.organizationId)
      if (organization) {
        organization.metadata.activeWorkflows--
        organization.modified = new Date().toISOString()
        this.organizations.set(project.organizationId, organization)
      }
    }

    this.workflows.delete(id)
    this.saveData()
    return true
  }

  // ========== AUTHORIZATION MANAGEMENT ==========

  async createAuthorization(
    resourceType: 'project' | 'workflow' | 'deliverable',
    resourceId: string,
    authData: Partial<Authorization>
  ): Promise<Authorization> {
    const authorization: Authorization = {
      id: `auth-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: authData.type || 'approval',
      name: authData.name || 'Authorization Required',
      description: authData.description || '',
      required: authData.required || true,
      status: 'pending',
      approvers: authData.approvers || [],
      conditions: authData.conditions || [],
      deadline: authData.deadline,
      comments: [],
      resourceType,
      resourceId,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    }

    // Add authorization to the appropriate resource
    if (resourceType === 'workflow') {
      const workflow = this.workflows.get(resourceId)
      if (workflow) {
        workflow.authorizations.push(authorization)
        this.workflows.set(resourceId, workflow)
      }
    }
    // TODO: Add for projects and deliverables

    this.saveData()
    return authorization
  }

  async updateAuthorizationStatus(
    authId: string,
    status: 'approved' | 'rejected',
    decidedBy: string,
    comments?: string
  ): Promise<boolean> {
    // Find the authorization across all resources
    for (const workflow of this.workflows.values()) {
      const authIndex = workflow.authorizations.findIndex(auth => auth.id === authId)
      if (authIndex !== -1) {
        workflow.authorizations[authIndex].status = status
        workflow.authorizations[authIndex].decidedBy = decidedBy
        workflow.authorizations[authIndex].decidedAt = new Date().toISOString()
        workflow.authorizations[authIndex].decision = status
        
        if (comments) {
          workflow.authorizations[authIndex].comments.push({
            author: decidedBy,
            comment: comments,
            timestamp: new Date().toISOString(),
            type: 'general'
          })
        }

        this.workflows.set(workflow.id, workflow)
        this.saveData()
        return true
      }
    }

    return false
  }

  // ========== ANALYTICS AND REPORTING ==========

  async getOrganizationAnalytics(organizationId: string) {
    const organization = this.organizations.get(organizationId)
    if (!organization) return null

    const projects = await this.getProjectsByOrganization(organizationId)
    const allWorkflows = projects.flatMap(project => 
      Array.from(this.workflows.values()).filter(wf => wf.projectId === project.id)
    )

    return {
      organization: {
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'active').length,
        completedProjects: projects.filter(p => p.status === 'completed').length,
        totalWorkflows: allWorkflows.length,
        activeWorkflows: allWorkflows.filter(wf => wf.status === 'active').length,
        teamSize: organization.members.length
      },
      projects: projects.map(project => ({
        id: project.id,
        name: project.name,
        status: project.status,
        progress: project.progress.overall,
        health: project.progress.health,
        workflowCount: project.workflows.length
      })),
      workflows: allWorkflows.map(workflow => ({
        id: workflow.id,
        name: workflow.name,
        projectId: workflow.projectId,
        status: workflow.status,
        progress: workflow.progress.overall,
        health: workflow.progress.health
      }))
    }
  }

  async getProjectAnalytics(projectId: string) {
    const project = this.projects.get(projectId)
    if (!project) return null

    const workflows = await this.getWorkflowsByProject(projectId)

    return {
      project: {
        id: project.id,
        name: project.name,
        status: project.status,
        progress: project.progress,
        timeline: project.timeline,
        workflowCount: workflows.length,
        deliverableCount: project.deliverables.length,
        riskCount: project.risks.length
      },
      workflows: workflows.map(workflow => ({
        id: workflow.id,
        name: workflow.name,
        status: workflow.status,
        progress: workflow.progress,
        health: workflow.progress.health,
        deliverableCount: workflow.deliverables.length
      })),
      timeline: project.timeline,
      risks: project.risks,
      stakeholders: project.stakeholders
    }
  }

  // ========== SEARCH AND FILTERING ==========

  async searchProjects(organizationId: string, query: string): Promise<Project[]> {
    const projects = await this.getProjectsByOrganization(organizationId)
    const lowerQuery = query.toLowerCase()

    return projects.filter(project =>
      project.name.toLowerCase().includes(lowerQuery) ||
      project.description.toLowerCase().includes(lowerQuery) ||
      project.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  async searchWorkflows(projectId: string, query: string): Promise<WorkflowInstance[]> {
    const workflows = await this.getWorkflowsByProject(projectId)
    const lowerQuery = query.toLowerCase()

    return workflows.filter(workflow =>
      workflow.name.toLowerCase().includes(lowerQuery) ||
      workflow.description.toLowerCase().includes(lowerQuery)
    )
  }

  // ========== DATA PERSISTENCE ==========

  private loadData(): void {
    try {
      if (typeof window !== 'undefined') {
        // Load organizations
        const savedOrgs = localStorage.getItem('bmad-organizations')
        if (savedOrgs) {
          const orgsData = JSON.parse(savedOrgs)
          this.organizations = new Map(Object.entries(orgsData))
        }

        // Load projects
        const savedProjects = localStorage.getItem('bmad-projects')
        if (savedProjects) {
          const projectsData = JSON.parse(savedProjects)
          this.projects = new Map(Object.entries(projectsData))
        }

        // Load workflows
        const savedWorkflows = localStorage.getItem('bmad-workflows')
        if (savedWorkflows) {
          const workflowsData = JSON.parse(savedWorkflows)
          this.workflows = new Map(Object.entries(workflowsData))
        }
      }
    } catch (error) {
      console.error('Failed to load hierarchy data:', error)
    }
  }

  private saveData(): void {
    try {
      if (typeof window !== 'undefined') {
        // Save organizations
        const orgsData = Object.fromEntries(this.organizations)
        localStorage.setItem('bmad-organizations', JSON.stringify(orgsData))

        // Save projects
        const projectsData = Object.fromEntries(this.projects)
        localStorage.setItem('bmad-projects', JSON.stringify(projectsData))

        // Save workflows
        const workflowsData = Object.fromEntries(this.workflows)
        localStorage.setItem('bmad-workflows', JSON.stringify(workflowsData))
      }
    } catch (error) {
      console.error('Failed to save hierarchy data:', error)
    }
  }

  // ========== INITIALIZATION ==========

  private initializeDefaultData(): void {
    // Only initialize if no organizations exist
    if (this.organizations.size === 0) {
      this.createDefaultOrganization()
    }
  }

  private async createDefaultOrganization(): Promise<void> {
    const defaultOrg: Organization = {
      id: 'org-default-001',
      name: 'BMad Solutions',
      description: 'AI-powered development organization using BMad methodology',
      type: 'startup',
      settings: {
        timezone: 'UTC',
        workingHours: { start: '09:00', end: '17:00', timezone: 'UTC', workdays: [1, 2, 3, 4, 5] },
        defaultProjectTemplate: 'bmad-methodology',
        approvalWorkflow: true,
        notifications: { email: true, slack: false, inApp: true, frequency: 'daily' },
        integrations: [],
        branding: {
          primaryColor: '#8b5cf6',
          secondaryColor: '#64748b',
          logo: '',
          favicon: ''
        }
      },
      members: [{
        userId: 'current-user',
        role: 'owner',
        permissions: [],
        joinedAt: new Date().toISOString(),
        department: 'leadership',
        title: 'Organization Owner'
      }],
      projects: [],
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      createdBy: 'current-user',
      status: 'active',
      metadata: {
        totalProjects: 0,
        activeWorkflows: 0,
        teamSize: 1
      }
    }

    this.organizations.set(defaultOrg.id, defaultOrg)

    // Create sample projects
    const project1 = await this.createProject(defaultOrg.id, {
      name: 'E-commerce Platform',
      description: 'Modern e-commerce platform with AI-powered recommendations',
      type: 'greenfield',
      priority: 'high'
    }, 'current-user')

    const project2 = await this.createProject(defaultOrg.id, {
      name: 'Mobile Banking App',
      description: 'Secure mobile banking application with biometric authentication',
      type: 'greenfield',
      priority: 'medium'
    }, 'current-user')

    // Create sample workflows
    await this.createWorkflow(project1.id, {
      name: 'MVP Development',
      description: 'Build the minimum viable product for the e-commerce platform',
      type: 'bmad-methodology'
    }, 'current-user')

    await this.createWorkflow(project1.id, {
      name: 'User Testing & Feedback',
      description: 'Conduct user testing and incorporate feedback',
      type: 'agile-scrum'
    }, 'current-user')

    await this.createWorkflow(project2.id, {
      name: 'Security Architecture',
      description: 'Design and implement security architecture for banking app',
      type: 'bmad-methodology'
    }, 'current-user')

    this.saveData()
  }

  // ========== UTILITY METHODS ==========

  async validateHierarchy(): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = []

    // Validate organization-project relationships
    for (const [orgId, org] of this.organizations) {
      for (const projectId of org.projects) {
        const project = this.projects.get(projectId)
        if (!project) {
          errors.push(`Organization ${orgId} references non-existent project ${projectId}`)
        } else if (project.organizationId !== orgId) {
          errors.push(`Project ${projectId} organization mismatch`)
        }
      }
    }

    // Validate project-workflow relationships
    for (const [projectId, project] of this.projects) {
      for (const projectWorkflow of project.workflows) {
        const workflow = this.workflows.get(projectWorkflow.id)
        if (!workflow) {
          errors.push(`Project ${projectId} references non-existent workflow ${projectWorkflow.id}`)
        } else if (workflow.projectId !== projectId) {
          errors.push(`Workflow ${projectWorkflow.id} project mismatch`)
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }
}

// Export singleton instance
export const hierarchyService = new HierarchyService()