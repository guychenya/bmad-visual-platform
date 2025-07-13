'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import OrganizationChart from '../../../components/organization/OrganizationChart'
import CanvasOrganizationChart from '../../../components/organization/CanvasOrganizationChart'
import { 
  Plus, 
  Building, 
  Users, 
  Settings, 
  Eye, 
  Trash2, 
  Copy, 
  Crown,
  Target,
  Briefcase,
  Lightbulb,
  ArrowRight,
  Folder,
  Calendar,
  CheckCircle,
  Play
} from 'lucide-react'
import { Organization, OrganizationTemplate } from '../../../lib/organization/types'
import { organizationService } from '../../../lib/organization/organizationService'
import { ORGANIZATION_TEMPLATES, getAllTemplates } from '../../../lib/organization/templates'
import { Project } from '../../../lib/hierarchy/types'

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState<'organizations' | 'projects' | 'agents' | 'workflow'>('organizations')
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])
  const [isGeneratingWorkflow, setIsGeneratingWorkflow] = useState(false)

  useEffect(() => {
    loadOrganizations()
  }, [])

  const loadOrganizations = () => {
    setIsLoading(true)
    try {
      const orgs = organizationService.getAllOrganizations()
      setOrganizations(orgs)
    } catch (error) {
      console.error('Failed to load organizations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateOrganization = (templateId: string, customName?: string) => {
    const org = organizationService.createOrganization(templateId, customName)
    if (org) {
      setOrganizations(prev => [...prev, org])
      setShowTemplateModal(false)
    }
  }

  const handleDeleteOrganization = (orgId: string) => {
    if (confirm('Are you sure you want to delete this organization?')) {
      organizationService.deleteOrganization(orgId)
      setOrganizations(prev => prev.filter(org => org.id !== orgId))
      if (selectedOrg?.id === orgId) {
        handleBackToOrganizations()
      }
    }
  }

  const handleCloneOrganization = (org: Organization) => {
    const cloneName = `${org.name} (Copy)`
    const template = Object.values(ORGANIZATION_TEMPLATES).find(t => 
      t.structure.structure === org.structure
    )
    
    if (template) {
      handleCreateOrganization(template.id, cloneName)
    }
  }

  // Navigation functions
  const handleSelectOrganization = (org: Organization) => {
    setSelectedOrg(org)
    setCurrentView('projects')
    loadProjectsForOrganization(org.id)
  }

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project)
    setCurrentView('agents')
    setSelectedAgents([])
  }

  const handleBackToOrganizations = () => {
    setSelectedOrg(null)
    setSelectedProject(null)
    setCurrentView('organizations')
    setSelectedAgents([])
  }

  const handleBackToProjects = () => {
    setSelectedProject(null)
    setCurrentView('projects')
    setSelectedAgents([])
  }

  const getMockProjectsForOrg = (orgId: string): Project[] => {
    // Mock projects data for now - in real app, load from hierarchy service
    return [
      {
        id: 'proj-1',
        name: 'Customer Portal Redesign',
        description: 'Modernize the customer-facing portal with new UI/UX',
        organizationId: orgId,
        type: 'brownfield',
        status: 'planning',
        priority: 'high',
        workflows: [],
        teams: [],
        deliverables: [],
        milestones: [],
        progress: { overall: 0, byPhase: {}, byDeliverable: {}, timeline: [], velocity: 0, burndown: [], health: 'green', risks: [], blockers: [], lastUpdated: new Date().toISOString() },
        timeline: { startDate: '2024-01-15', plannedEndDate: '2024-04-15', milestones: [], phases: [] },
        stakeholders: [],
        requirements: [],
        risks: [],
        created: '2024-01-01',
        modified: '2024-01-01',
        createdBy: 'user-1',
        assignedTo: [],
        tags: ['web', 'frontend'],
        settings: { visibility: 'internal', allowExternalCollaborators: false, requireApprovals: true, autoArchive: false, notifications: { email: true, slack: false, inApp: true, frequency: 'daily' }, integrations: [] }
      },
      {
        id: 'proj-2',
        name: 'Data Analytics Platform',
        description: 'Build comprehensive analytics dashboard for business insights',
        organizationId: orgId,
        type: 'greenfield',
        status: 'active',
        priority: 'medium',
        workflows: [],
        teams: [],
        deliverables: [],
        milestones: [],
        progress: { overall: 25, byPhase: {}, byDeliverable: {}, timeline: [], velocity: 0, burndown: [], health: 'green', risks: [], blockers: [], lastUpdated: new Date().toISOString() },
        timeline: { startDate: '2024-02-01', plannedEndDate: '2024-06-01', milestones: [], phases: [] },
        stakeholders: [],
        requirements: [],
        risks: [],
        created: '2024-01-15',
        modified: '2024-01-15',
        createdBy: 'user-1',
        assignedTo: [],
        tags: ['analytics', 'backend'],
        settings: { visibility: 'internal', allowExternalCollaborators: false, requireApprovals: true, autoArchive: false, notifications: { email: true, slack: false, inApp: true, frequency: 'daily' }, integrations: [] }
      },
      {
        id: 'proj-3',
        name: 'Mobile App',
        description: 'Cross-platform mobile application',
        organizationId: orgId,
        type: 'greenfield',
        status: 'completed',
        priority: 'low',
        workflows: [],
        teams: [],
        deliverables: [],
        milestones: [],
        progress: { overall: 100, byPhase: {}, byDeliverable: {}, timeline: [], velocity: 0, burndown: [], health: 'green', risks: [], blockers: [], lastUpdated: new Date().toISOString() },
        timeline: { startDate: '2023-09-01', plannedEndDate: '2023-12-01', milestones: [], phases: [] },
        stakeholders: [],
        requirements: [],
        risks: [],
        created: '2023-09-01',
        modified: '2023-12-01',
        createdBy: 'user-1',
        assignedTo: [],
        tags: ['mobile', 'react-native'],
        settings: { visibility: 'internal', allowExternalCollaborators: false, requireApprovals: true, autoArchive: false, notifications: { email: true, slack: false, inApp: true, frequency: 'daily' }, integrations: [] }
      }
    ]
  }

  const loadProjectsForOrganization = (orgId: string) => {
    const mockProjects = getMockProjectsForOrg(orgId)
    setProjects(mockProjects)
  }

  const handleGenerateWorkflow = () => {
    if (selectedAgents.length === 0) {
      alert('Please select at least one agent for the team')
      return
    }
    
    setIsGeneratingWorkflow(true)
    // Simulate workflow generation
    setTimeout(() => {
      setCurrentView('workflow')
      setIsGeneratingWorkflow(false)
    }, 2000)
  }

  const handleStartWorkflow = () => {
    // Navigate to the new workspace with project context
    const projectData = encodeURIComponent(JSON.stringify({
      projectId: selectedProject?.id,
      projectName: selectedProject?.name,
      organizationId: selectedOrg?.id,
      selectedAgents: selectedAgents
    }))
    
    window.location.href = `/dashboard/workspace?project=${selectedProject?.id}&agents=${selectedAgents.join(',')}`
  }

  const getOrganizationIcon = (structure: string) => {
    switch (structure) {
      case 'flat': return Target
      case 'hierarchical': return Building
      case 'matrix': return Briefcase
      case 'network': return Users
      default: return Building
    }
  }

  const getStructureColor = (structure: string) => {
    switch (structure) {
      case 'flat': return 'from-green-500 to-emerald-500'
      case 'hierarchical': return 'from-blue-500 to-indigo-500'
      case 'matrix': return 'from-purple-500 to-pink-500'
      case 'network': return 'from-orange-500 to-red-500'
      default: return 'from-slate-500 to-slate-600'
    }
  }

  // Breadcrumb component
  const renderBreadcrumb = () => (
    <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6">
      <button 
        onClick={handleBackToOrganizations}
        className="hover:text-white transition-colors"
      >
        Organizations
      </button>
      {selectedOrg && (
        <>
          <ArrowRight className="w-4 h-4" />
          <button 
            onClick={() => currentView !== 'projects' ? handleBackToProjects() : undefined}
            className={`${currentView === 'projects' ? 'text-white' : 'hover:text-white'} transition-colors`}
          >
            {selectedOrg.name}
          </button>
        </>
      )}
      {selectedProject && (
        <>
          <ArrowRight className="w-4 h-4" />
          <span className={currentView === 'agents' ? 'text-white' : 'text-slate-400'}>
            {selectedProject.name}
          </span>
        </>
      )}
      {currentView === 'workflow' && (
        <>
          <ArrowRight className="w-4 h-4" />
          <span className="text-white">Workflow</span>
        </>
      )}
    </div>
  )

  // Projects view
  const renderProjectsView = () => (
    <div className="space-y-6">
      {renderBreadcrumb()}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">{selectedOrg?.name} Projects</h1>
          <p className="text-slate-300 text-lg">Select a project to assemble your team</p>
        </div>
        <Button className="gradient-button">
          <Plus className="h-4 w-4 mr-2" />
          Create Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <Folder className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Create your first project to start building with AI agents.
            </p>
            <Button className="gradient-button">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card 
              key={project.id}
              className="agent-card group cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleSelectProject(project)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 bg-gradient-to-r ${
                    project.priority === 'high' ? 'from-red-500 to-red-600' :
                    project.priority === 'medium' ? 'from-yellow-500 to-yellow-600' :
                    'from-green-500 to-green-600'
                  } rounded-xl group-hover:scale-110 transition-transform`}>
                    <Folder className="h-6 w-6 text-white" />
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs border-slate-600 text-slate-300 capitalize ${
                      project.status === 'active' ? 'border-green-400 text-green-400' :
                      project.status === 'planning' ? 'border-yellow-400 text-yellow-400' :
                      'border-slate-400'
                    }`}
                  >
                    {project.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg text-white">{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-4 text-sm">{project.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-white font-medium">{project.progress.overall}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress.overall}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center space-x-1 text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(project.timeline.plannedEndDate).toLocaleDateString()}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-white/10 text-slate-300 border-0 capitalize">
                    {project.type}
                  </Badge>
                </div>

                <Button size="sm" className="w-full gradient-button">
                  <ArrowRight className="h-3 w-3 mr-1" />
                  Select Project
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  // Agents view  
  const renderAgentsView = () => (
    <div className="space-y-6">
      {renderBreadcrumb()}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Assemble Your Team</h1>
          <p className="text-slate-300 text-lg">Select agents for {selectedProject?.name}</p>
        </div>
        <Button 
          className="gradient-button" 
          onClick={handleGenerateWorkflow}
          disabled={selectedAgents.length === 0 || isGeneratingWorkflow}
        >
          {isGeneratingWorkflow ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Generate Workflow ({selectedAgents.length})
            </>
          )}
        </Button>
      </div>

      {selectedOrg && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(selectedOrg.agents).map(([agentId, agent]) => {
            const isSelected = selectedAgents.includes(agentId)
            
            return (
              <Card 
                key={agentId}
                className={`agent-card group cursor-pointer transition-all ${
                  isSelected ? 'ring-2 ring-blue-400 bg-blue-500/10' : ''
                }`}
                onClick={() => {
                  setSelectedAgents(prev => 
                    prev.includes(agentId) 
                      ? prev.filter(id => id !== agentId)
                      : [...prev, agentId]
                  )
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-3 bg-gradient-to-r ${
                      selectedOrg.departments[agent.department]?.color || 'from-slate-500 to-slate-600'
                    } rounded-xl group-hover:scale-110 transition-transform`}>
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-6 h-6 text-blue-400" />
                    )}
                  </div>
                  <CardTitle className="text-lg text-white">{agent.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 mb-4 text-sm">{agent.role.title}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-sm">
                      <span className="text-slate-400">Department: </span>
                      <span className="text-white">{selectedOrg.departments[agent.department]?.name || 'Unknown'}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-slate-400">Status: </span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs border-slate-600 ${
                          agent.availability === 'available' ? 'text-green-400 border-green-400' :
                          agent.availability === 'busy' ? 'text-yellow-400 border-yellow-400' :
                          'text-red-400 border-red-400'
                        }`}
                      >
                        {agent.availability}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {agent.role.specialization.slice(0, 2).map((spec, idx) => (
                      <Badge 
                        key={idx}
                        variant="secondary" 
                        className="text-xs px-2 py-0.5 bg-white/10 text-slate-300 border-0"
                      >
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )

  // Workflow view (placeholder for now)
  const renderWorkflowView = () => (
    <div className="space-y-6">
      {renderBreadcrumb()}
      
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold gradient-text mb-4">Workflow Generated!</h1>
          <p className="text-slate-300 mb-6">
            Your team of {selectedAgents.length} agents is ready to work on {selectedProject?.name}
          </p>
          <div className="space-y-2">
            <Button 
              className="gradient-button w-full" 
              onClick={handleStartWorkflow}
            >
              <Play className="h-4 w-4 mr-2" />
              Start Workflow
            </Button>
            <Button 
              variant="outline" 
              className="glass-button w-full" 
              onClick={handleBackToProjects}
            >
              ← Back to Projects
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  // Main view router
  if (currentView === 'projects') {
    return renderProjectsView()
  }
  
  if (currentView === 'agents') {
    return renderAgentsView()
  }
  
  if (currentView === 'workflow') {
    return renderWorkflowView()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Virtual AI Organizations</h1>
          <p className="text-slate-300 text-lg">
            Create and manage your virtual AI organization structures
          </p>
        </div>
        <Button 
          className="gradient-button hover:scale-105 transition-transform"
          onClick={() => setShowTemplateModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Organization
        </Button>
      </div>

      {/* Organizations Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      ) : organizations.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <Building className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Organizations Yet</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Create your first virtual AI organization to start coordinating agents and managing complex workflows.
            </p>
            <Button 
              className="gradient-button"
              onClick={() => setShowTemplateModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Organization
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org, index) => {
            const IconComponent = getOrganizationIcon(org.structure)
            const structureColor = getStructureColor(org.structure)
            const agentCount = Object.keys(org.agents).length
            const departmentCount = Object.keys(org.departments).length
            
            return (
              <Card 
                key={org.id}
                className="agent-card group cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-3 bg-gradient-to-r ${structureColor} rounded-xl group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <Badge 
                      variant="outline" 
                      className="text-xs border-slate-600 text-slate-300 capitalize"
                    >
                      {org.structure}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-white">{org.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 mb-4 text-sm">{org.description}</p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{agentCount}</div>
                      <div className="text-xs text-slate-400">Agents</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{departmentCount}</div>
                      <div className="text-xs text-slate-400">Departments</div>
                    </div>
                  </div>

                  {/* CEO Info */}
                  {org.agents[org.ceo] && (
                    <div className="flex items-center space-x-2 mb-4 p-2 bg-white/5 rounded-lg">
                      <Crown className="h-4 w-4 text-yellow-400" />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {org.agents[org.ceo].role.name}
                        </p>
                        <p className="text-xs text-slate-400">Organization Leader</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1 gradient-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectOrganization(org)
                      }}
                    >
                      <ArrowRight className="h-3 w-3 mr-1" />
                      Enter
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="glass-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCloneOrganization(org)
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="glass-button text-red-400 hover:text-red-300"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteOrganization(org.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="glass-card max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-white">Choose Organization Template</CardTitle>
                  <p className="text-slate-400 mt-1">Select a pre-built template to get started quickly</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowTemplateModal(false)}
                  className="glass-button"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getAllTemplates().map((template) => {
                  const IconComponent = getOrganizationIcon(template.structure.structure)
                  const structureColor = getStructureColor(template.structure.structure)
                  
                  return (
                    <Card 
                      key={template.id}
                      className="agent-card group cursor-pointer"
                      onClick={() => handleCreateOrganization(template.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`p-3 bg-gradient-to-r ${structureColor} rounded-xl group-hover:scale-110 transition-transform`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{template.name}</h3>
                            <Badge 
                              variant="outline" 
                              className="text-xs border-slate-600 text-slate-300 capitalize mt-1"
                            >
                              {template.type}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-400 text-sm mb-4">{template.description}</p>
                        
                        {/* Use Cases */}
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium text-white mb-2">Best For:</h4>
                            <div className="flex flex-wrap gap-1">
                              {template.useCase.slice(0, 2).map((useCase, idx) => (
                                <Badge 
                                  key={idx}
                                  variant="secondary" 
                                  className="text-xs px-2 py-0.5 bg-white/10 text-slate-300 border-0"
                                >
                                  {useCase}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          {/* Benefits */}
                          <div>
                            <h4 className="text-sm font-medium text-white mb-2">Benefits:</h4>
                            <ul className="text-xs text-slate-400 space-y-1">
                              {template.benefits.slice(0, 2).map((benefit, idx) => (
                                <li key={idx}>• {benefit}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <Button className="w-full gradient-button mt-4">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Organization
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}