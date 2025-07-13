// Virtual AI Organization Service
// Manages organization creation, agent delegation, and workflow coordination

import { 
  Organization, 
  OrganizationNode, 
  TaskDelegation, 
  DelegationRule,
  WorkflowRule,
  OrganizationTemplate 
} from './types'
import { ORGANIZATION_TEMPLATES, createOrganizationFromTemplate } from './templates'

export class OrganizationService {
  private organizations: Map<string, Organization> = new Map()
  private activeDelegations: Map<string, TaskDelegation> = new Map()

  constructor() {
    this.loadOrganizations()
  }

  // Organization Management
  createOrganization(templateId: string, customName?: string): Organization | null {
    const organization = createOrganizationFromTemplate(templateId, customName)
    if (!organization) return null

    this.organizations.set(organization.id, organization)
    this.saveOrganizations()
    return organization
  }

  getOrganization(orgId: string): Organization | null {
    return this.organizations.get(orgId) || null
  }

  getAllOrganizations(): Organization[] {
    return Array.from(this.organizations.values())
  }

  updateOrganization(orgId: string, updates: Partial<Organization>): boolean {
    const org = this.organizations.get(orgId)
    if (!org) return false

    const updatedOrg = { ...org, ...updates, modified: new Date().toISOString() }
    this.organizations.set(orgId, updatedOrg)
    this.saveOrganizations()
    return true
  }

  deleteOrganization(orgId: string): boolean {
    const deleted = this.organizations.delete(orgId)
    if (deleted) {
      this.saveOrganizations()
    }
    return deleted
  }

  // Agent Hierarchy Management
  getAgentReportingChain(orgId: string, agentId: string): string[] {
    const org = this.getOrganization(orgId)
    if (!org) return []

    const chain: string[] = []
    let currentAgent = org.agents[agentId]

    while (currentAgent && currentAgent.reportsTo) {
      chain.push(currentAgent.reportsTo)
      currentAgent = org.agents[currentAgent.reportsTo]
    }

    return chain
  }

  getAgentDirectReports(orgId: string, agentId: string): OrganizationNode[] {
    const org = this.getOrganization(orgId)
    if (!org) return []

    const agent = org.agents[agentId]
    if (!agent) return []

    return agent.directReports
      .map(reportId => org.agents[reportId])
      .filter(Boolean)
  }

  getAllReports(orgId: string, agentId: string): string[] {
    const org = this.getOrganization(orgId)
    if (!org) return []

    const allReports: string[] = []
    const directReports = org.agents[agentId]?.directReports || []

    for (const reportId of directReports) {
      allReports.push(reportId)
      // Recursively get all nested reports
      const nestedReports = this.getAllReports(orgId, reportId)
      allReports.push(...nestedReports)
    }

    return allReports
  }

  // Task Delegation System
  delegateTask(
    orgId: string,
    fromAgent: string,
    task: string,
    context: string,
    priority: 'urgent' | 'high' | 'medium' | 'low' = 'medium',
    deadline?: string
  ): TaskDelegation | null {
    const org = this.getOrganization(orgId)
    if (!org) return null

    const targetAgent = this.findBestAgentForTask(orgId, fromAgent, task, context)
    if (!targetAgent) return null

    const delegation: TaskDelegation = {
      id: `delegation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      task,
      context,
      fromAgent,
      toAgent: targetAgent,
      priority,
      deadline,
      requirements: this.extractRequirements(task, context),
      expectedOutputs: this.generateExpectedOutputs(task, context),
      status: 'pending',
      delegatedAt: new Date().toISOString()
    }

    this.activeDelegations.set(delegation.id, delegation)
    this.saveDelegations()
    
    return delegation
  }

  private findBestAgentForTask(
    orgId: string, 
    fromAgent: string, 
    task: string, 
    context: string
  ): string | null {
    const org = this.getOrganization(orgId)
    if (!org) return null

    const fromAgentNode = org.agents[fromAgent]
    if (!fromAgentNode) return null

    // Check delegation rules first
    for (const rule of fromAgentNode.delegationRules) {
      if (this.matchesDelegationCondition(rule.condition, task, context)) {
        if (rule.targetAgent && org.agents[rule.targetAgent]) {
          return rule.targetAgent
        }
        if (rule.targetDepartment) {
          const departmentAgent = this.findAgentInDepartment(org, rule.targetDepartment, task)
          if (departmentAgent) return departmentAgent
        }
      }
    }

    // Check workflow rules
    for (const workflowRule of org.workflowRules) {
      if (this.matchesWorkflowCondition(workflowRule.condition, task, context)) {
        for (const action of workflowRule.actions) {
          if (action.type === 'delegate' && org.agents[action.target]) {
            return action.target
          }
        }
      }
    }

    // Fallback: delegate to direct reports if available
    const directReports = fromAgentNode.directReports
    if (directReports.length > 0) {
      return this.selectBestDirectReport(org, directReports, task, context)
    }

    // Final fallback: escalate to manager
    if (fromAgentNode.reportsTo && org.agents[fromAgentNode.reportsTo]) {
      return fromAgentNode.reportsTo
    }

    return null
  }

  private matchesDelegationCondition(condition: string, task: string, context: string): boolean {
    const taskLower = task.toLowerCase()
    const contextLower = context.toLowerCase()
    const conditionLower = condition.toLowerCase()

    // Simple keyword matching - can be enhanced with more sophisticated NLP
    return taskLower.includes(conditionLower) || contextLower.includes(conditionLower)
  }

  private matchesWorkflowCondition(condition: string, task: string, context: string): boolean {
    // Parse workflow conditions (can be enhanced with more complex logic)
    const taskLower = task.toLowerCase()
    const contextLower = context.toLowerCase()

    if (condition.includes('complexity')) {
      const complexKeywords = ['complex', 'advanced', 'enterprise', 'scalable', 'integration']
      return complexKeywords.some(keyword => 
        taskLower.includes(keyword) || contextLower.includes(keyword)
      )
    }

    return this.matchesDelegationCondition(condition, task, context)
  }

  private findAgentInDepartment(org: Organization, departmentId: string, task: string): string | null {
    const department = org.departments[departmentId]
    if (!department) return null

    // Find VP/head of department first
    if (org.agents[department.vpAgent]) {
      return department.vpAgent
    }

    // Find any agent in the department
    for (const [agentId, agent] of Object.entries(org.agents)) {
      if (agent.department === departmentId) {
        return agentId
      }
    }

    return null
  }

  private selectBestDirectReport(
    org: Organization, 
    directReports: string[], 
    task: string, 
    context: string
  ): string {
    // Simple selection based on agent specialization
    const taskLower = task.toLowerCase()
    
    for (const reportId of directReports) {
      const agent = org.agents[reportId]
      if (!agent) continue

      // Check if agent's role specialization matches the task
      const specializations = agent.role.specialization.map(s => s.toLowerCase())
      if (specializations.some(spec => taskLower.includes(spec))) {
        return reportId
      }
    }

    // Default to first available direct report
    return directReports[0]
  }

  private extractRequirements(task: string, context: string): string[] {
    // Extract requirements from task description
    const requirements: string[] = []
    
    // Simple keyword-based extraction
    if (task.toLowerCase().includes('design')) {
      requirements.push('UI/UX mockups', 'Design specifications', 'User journey mapping')
    }
    if (task.toLowerCase().includes('develop')) {
      requirements.push('Technical implementation', 'Code review', 'Testing')
    }
    if (task.toLowerCase().includes('analysis')) {
      requirements.push('Requirements document', 'Stakeholder assessment', 'Risk analysis')
    }
    if (task.toLowerCase().includes('test')) {
      requirements.push('Test cases', 'Quality metrics', 'Bug reports')
    }

    return requirements.length > 0 ? requirements : ['Detailed analysis', 'Recommendations', 'Documentation']
  }

  private generateExpectedOutputs(task: string, context: string): string[] {
    // Generate expected outputs based on task type
    const outputs: string[] = []
    const taskLower = task.toLowerCase()

    if (taskLower.includes('analysis')) {
      outputs.push('Analysis Report', 'Recommendations Document', 'Action Items')
    } else if (taskLower.includes('design')) {
      outputs.push('Design Mockups', 'Style Guide', 'Component Library')
    } else if (taskLower.includes('develop')) {
      outputs.push('Code Implementation', 'Documentation', 'Test Suite')
    } else if (taskLower.includes('plan')) {
      outputs.push('Project Plan', 'Timeline', 'Resource Allocation')
    } else {
      outputs.push('Deliverable Document', 'Status Report', 'Next Steps')
    }

    return outputs
  }

  // Delegation Management
  updateDelegationStatus(
    delegationId: string, 
    status: TaskDelegation['status'], 
    completedAt?: string
  ): boolean {
    const delegation = this.activeDelegations.get(delegationId)
    if (!delegation) return false

    delegation.status = status
    if (completedAt) {
      delegation.completedAt = completedAt
    }

    this.saveDelegations()
    return true
  }

  getDelegation(delegationId: string): TaskDelegation | null {
    return this.activeDelegations.get(delegationId) || null
  }

  getActiveDelegationsForAgent(agentId: string): TaskDelegation[] {
    return Array.from(this.activeDelegations.values())
      .filter(d => d.toAgent === agentId && d.status !== 'completed')
  }

  getDelegationsByAgent(agentId: string): TaskDelegation[] {
    return Array.from(this.activeDelegations.values())
      .filter(d => d.fromAgent === agentId || d.toAgent === agentId)
  }

  // Smart Routing
  routeTaskToOrganization(
    orgId: string,
    task: string,
    context: string,
    priority: 'urgent' | 'high' | 'medium' | 'low' = 'medium'
  ): TaskDelegation | null {
    const org = this.getOrganization(orgId)
    if (!org) return null

    // Start with CEO/top-level agent
    const ceoAgent = org.ceo
    if (!ceoAgent || !org.agents[ceoAgent]) return null

    return this.delegateTask(orgId, ceoAgent, task, context, priority)
  }

  // Persistence
  private loadOrganizations(): void {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('viby-organizations')
        if (saved) {
          const data = JSON.parse(saved)
          this.organizations = new Map(Object.entries(data))
        }

        const savedDelegations = localStorage.getItem('viby-delegations')
        if (savedDelegations) {
          const delegations = JSON.parse(savedDelegations)
          this.activeDelegations = new Map(Object.entries(delegations))
        }
      }
    } catch (error) {
      console.error('Failed to load organizations:', error)
    }
  }

  private saveOrganizations(): void {
    try {
      if (typeof window !== 'undefined') {
        const data = Object.fromEntries(this.organizations)
        localStorage.setItem('viby-organizations', JSON.stringify(data))
      }
    } catch (error) {
      console.error('Failed to save organizations:', error)
    }
  }

  private saveDelegations(): void {
    try {
      if (typeof window !== 'undefined') {
        const data = Object.fromEntries(this.activeDelegations)
        localStorage.setItem('viby-delegations', JSON.stringify(data))
      }
    } catch (error) {
      console.error('Failed to save delegations:', error)
    }
  }

  // Analytics and Insights
  getOrganizationAnalytics(orgId: string) {
    const org = this.getOrganization(orgId)
    if (!org) return null

    const agentCount = Object.keys(org.agents).length
    const departmentCount = Object.keys(org.departments).length
    const activeDelegations = this.getActiveDelegationsForOrganization(orgId)
    
    return {
      agentCount,
      departmentCount,
      activeDelegations: activeDelegations.length,
      structure: org.structure,
      workflowRules: org.workflowRules.length,
      communicationChannels: org.communicationChannels.length
    }
  }

  private getActiveDelegationsForOrganization(orgId: string): TaskDelegation[] {
    const org = this.getOrganization(orgId)
    if (!org) return []

    const orgAgents = Object.keys(org.agents)
    return Array.from(this.activeDelegations.values())
      .filter(d => orgAgents.includes(d.fromAgent) || orgAgents.includes(d.toAgent))
  }
}

// Export singleton instance
export const organizationService = new OrganizationService()