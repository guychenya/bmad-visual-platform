'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Input } from '../../../components/ui/input'
import { 
  Building2, 
  FolderOpen, 
  Workflow, 
  Plus, 
  Search, 
  ArrowRight,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Settings,
  Star,
  Filter
} from 'lucide-react'
import { Organization, Project, WorkflowInstance } from '../../../lib/hierarchy/types'
import { hierarchyService } from '../../../lib/hierarchy/hierarchyService'
import { useHierarchy, Breadcrumbs } from '../../../contexts/HierarchyContext'

export default function HierarchicalDashboard() {
  const { 
    state, 
    navigateToOrganization, 
    navigateToProject, 
    navigateToWorkflow,
    getCurrentContext,
    isInOrganization,
    isInProject 
  } = useHierarchy()
  
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [workflows, setWorkflows] = useState<WorkflowInstance[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createType, setCreateType] = useState<'organization' | 'project' | 'workflow'>('organization')

  const currentContext = getCurrentContext()

  // Load data based on current context
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        if (!isInOrganization()) {
          // Load organizations
          const orgs = await hierarchyService.getOrganizations('current-user') // TODO: Get actual user ID
          setOrganizations(orgs)
        } else if (isInOrganization() && !isInProject()) {
          // Load projects for current organization
          const projs = await hierarchyService.getProjectsByOrganization(state.currentOrganization!.id)
          setProjects(projs)
        } else if (state.currentProject) {
          // Load workflows for current project
          const wfs = await hierarchyService.getWorkflowsByProject(state.currentProject.id)
          setWorkflows(wfs)
        }
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [state.currentOrganization, state.currentProject, isInOrganization, isInProject, setOrganizations, setProjects, setWorkflows, setIsLoading])

  const handleCreate = async (name: string) => {
    try {
      if (createType === 'organization') {
        const org = await hierarchyService.createOrganization({ name }, 'current-user')
        setOrganizations(prev => [...prev, org])
      } else if (createType === 'project' && state.currentOrganization) {
        const project = await hierarchyService.createProject(state.currentOrganization.id, { name }, 'current-user')
        setProjects(prev => [...prev, project])
      } else if (createType === 'workflow' && state.currentProject) {
        const workflow = await hierarchyService.createWorkflow(state.currentProject.id, { name }, 'current-user')
        setWorkflows(prev => [...prev, workflow])
      }
      setShowCreateModal(false)
    } catch (error) {
      console.error('Failed to create:', error)
    }
  }

  const filteredData = () => {
    const query = searchQuery.toLowerCase()
    if (currentContext === 'organization') {
      return projects.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      )
    } else if (currentContext === 'project') {
      return workflows.filter(w => 
        w.name.toLowerCase().includes(query) || 
        w.description.toLowerCase().includes(query)
      )
    } else {
      return organizations.filter(o => 
        o.name.toLowerCase().includes(query) || 
        o.description.toLowerCase().includes(query)
      )
    }
  }

  const getCreateButtonText = () => {
    switch (currentContext) {
      case 'organization': return 'Create Project'
      case 'project': return 'Create Workflow'
      default: return 'Create Organization'
    }
  }

  const getHeaderTitle = () => {
    switch (currentContext) {
      case 'organization': return `Projects in ${state.currentOrganization?.name}`
      case 'project': return `Workflows in ${state.currentProject?.name}`
      default: return 'Your Organizations'
    }
  }

  const getEmptyStateText = () => {
    switch (currentContext) {
      case 'organization': return 'No projects yet. Create your first project to get started.'
      case 'project': return 'No workflows yet. Create your first workflow to begin working.'
      default: return 'No organizations yet. Create your first organization to get started.'
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">{getHeaderTitle()}</h1>
          <p className="text-slate-400 mt-1">
            {currentContext === null && 'Manage your organizations and navigate to projects and workflows'}
            {currentContext === 'organization' && 'Manage projects within this organization'}
            {currentContext === 'project' && 'Manage workflows within this project'}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            className="gradient-button"
            onClick={() => {
              setCreateType(currentContext === 'organization' ? 'project' : 
                          currentContext === 'project' ? 'workflow' : 'organization')
              setShowCreateModal(true)
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            {getCreateButtonText()}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {currentContext === null && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Organizations</p>
                  <p className="text-2xl font-bold text-white">{organizations.length}</p>
                </div>
                <Building2 className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Projects</p>
                  <p className="text-2xl font-bold text-white">
                    {organizations.reduce((sum, org) => sum + org.metadata.totalProjects, 0)}
                  </p>
                </div>
                <FolderOpen className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Workflows</p>
                  <p className="text-2xl font-bold text-white">
                    {organizations.reduce((sum, org) => sum + org.metadata.activeWorkflows, 0)}
                  </p>
                </div>
                <Workflow className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Team Members</p>
                  <p className="text-2xl font-bold text-white">
                    {organizations.reduce((sum, org) => sum + org.metadata.teamSize, 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder={`Search ${currentContext === 'organization' ? 'projects' : 
                        currentContext === 'project' ? 'workflows' : 'organizations'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-input"
          />
        </div>
        <Button variant="outline" className="glass-button">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      ) : filteredData().length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            {currentContext === null && <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />}
            {currentContext === 'organization' && <FolderOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />}
            {currentContext === 'project' && <Workflow className="w-16 h-16 text-slate-400 mx-auto mb-4" />}
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? 'No results found' : getEmptyStateText()}
            </h3>
            {!searchQuery && (
              <Button 
                className="gradient-button mt-4"
                onClick={() => {
                  setCreateType(currentContext === 'organization' ? 'project' : 
                              currentContext === 'project' ? 'workflow' : 'organization')
                  setShowCreateModal(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                {getCreateButtonText()}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentContext === null && 
            (filteredData() as Organization[]).map((org, index) => (
              <OrganizationCard
                key={org.id}
                organization={org}
                onClick={() => navigateToOrganization(org)}
                animationDelay={index * 0.1}
              />
            ))
          }
          
          {currentContext === 'organization' && 
            (filteredData() as Project[]).map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => navigateToProject(project)}
                animationDelay={index * 0.1}
              />
            ))
          }
          
          {currentContext === 'project' && 
            (filteredData() as WorkflowInstance[]).map((workflow, index) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                onClick={() => navigateToWorkflow(workflow)}
                animationDelay={index * 0.1}
              />
            ))
          }
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateModal
          type={createType}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  )
}

// Organization Card Component
function OrganizationCard({ 
  organization, 
  onClick, 
  animationDelay 
}: { 
  organization: Organization
  onClick: () => void
  animationDelay: number 
}) {
  return (
    <Card 
      className="agent-card group cursor-pointer animate-slide-up"
      style={{ animationDelay: `${animationDelay}s` }}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl group-hover:scale-110 transition-transform">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <Badge variant="outline" className="text-xs border-slate-600 text-slate-300 capitalize">
            {organization.type}
          </Badge>
        </div>
        <CardTitle className="text-lg text-white">{organization.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-400 mb-4 text-sm line-clamp-2">{organization.description}</p>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-white">{organization.metadata.totalProjects}</div>
            <div className="text-xs text-slate-400">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">{organization.metadata.activeWorkflows}</div>
            <div className="text-xs text-slate-400">Workflows</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">{organization.metadata.teamSize}</div>
            <div className="text-xs text-slate-400">Members</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge 
            variant={organization.status === 'active' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {organization.status}
          </Badge>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
        </div>
      </CardContent>
    </Card>
  )
}

// Project Card Component
function ProjectCard({ 
  project, 
  onClick, 
  animationDelay 
}: { 
  project: Project
  onClick: () => void
  animationDelay: number 
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'from-green-500 to-emerald-500'
      case 'planning': return 'from-blue-500 to-indigo-500'
      case 'completed': return 'from-purple-500 to-violet-500'
      case 'on-hold': return 'from-yellow-500 to-orange-500'
      default: return 'from-slate-500 to-slate-600'
    }
  }

  return (
    <Card 
      className="agent-card group cursor-pointer animate-slide-up"
      style={{ animationDelay: `${animationDelay}s` }}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-3 bg-gradient-to-r ${getStatusColor(project.status)} rounded-xl group-hover:scale-110 transition-transform`}>
            <FolderOpen className="w-6 h-6 text-white" />
          </div>
          <Badge variant="outline" className="text-xs border-slate-600 text-slate-300 capitalize">
            {project.priority}
          </Badge>
        </div>
        <CardTitle className="text-lg text-white">{project.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-400 mb-4 text-sm line-clamp-2">{project.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-white">{project.workflows.length}</div>
            <div className="text-xs text-slate-400">Workflows</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">{Math.round(project.progress.overall)}%</div>
            <div className="text-xs text-slate-400">Progress</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge 
            variant={project.status === 'active' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {project.status}
          </Badge>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
        </div>
      </CardContent>
    </Card>
  )
}

// Workflow Card Component
function WorkflowCard({ 
  workflow, 
  onClick, 
  animationDelay 
}: { 
  workflow: WorkflowInstance
  onClick: () => void
  animationDelay: number 
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'from-green-500 to-emerald-500'
      case 'draft': return 'from-slate-500 to-slate-600'
      case 'completed': return 'from-purple-500 to-violet-500'
      case 'paused': return 'from-yellow-500 to-orange-500'
      default: return 'from-slate-500 to-slate-600'
    }
  }

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'on-track': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'at-risk': return <AlertCircle className="w-4 h-4 text-yellow-400" />
      case 'delayed': return <Clock className="w-4 h-4 text-red-400" />
      default: return <CheckCircle className="w-4 h-4 text-slate-400" />
    }
  }

  return (
    <Card 
      className="agent-card group cursor-pointer animate-slide-up"
      style={{ animationDelay: `${animationDelay}s` }}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-3 bg-gradient-to-r ${getStatusColor(workflow.status)} rounded-xl group-hover:scale-110 transition-transform`}>
            <Workflow className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-1">
            {getHealthIcon(workflow.progress.health)}
          </div>
        </div>
        <CardTitle className="text-lg text-white">{workflow.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-400 mb-4 text-sm line-clamp-2">{workflow.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-white">{workflow.deliverables.length}</div>
            <div className="text-xs text-slate-400">Deliverables</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">{Math.round(workflow.progress.overall)}%</div>
            <div className="text-xs text-slate-400">Progress</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge 
            variant={workflow.status === 'active' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {workflow.status}
          </Badge>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
        </div>
      </CardContent>
    </Card>
  )
}

// Create Modal Component
function CreateModal({ 
  type, 
  onClose, 
  onCreate 
}: { 
  type: 'organization' | 'project' | 'workflow'
  onClose: () => void
  onCreate: (name: string) => void 
}) {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onCreate(name.trim())
      setName('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="glass-card max-w-md w-full mx-4">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            Create New {type.charAt(0).toUpperCase() + type.slice(1)}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`Enter ${type} name`}
                className="glass-input"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="gradient-button flex-1">
                Create {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
              <Button 
                type="button"
                variant="outline" 
                onClick={onClose}
                className="glass-button"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}