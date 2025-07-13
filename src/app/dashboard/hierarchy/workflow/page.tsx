'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { Progress } from '../../../../components/ui/progress'
import { 
  ArrowLeft,
  Play,
  Pause, 
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  FileText,
  BarChart3,
  Calendar,
  Target,
  Settings,
  MessageSquare,
  Download,
  Upload,
  RefreshCw,
  Workflow as WorkflowIcon,
  Layers,
  Shield
} from 'lucide-react'
import { useHierarchy, Breadcrumbs } from '../../../../contexts/HierarchyContext'
import { WorkflowInstance, DeliverableInstance, Authorization } from '../../../../lib/hierarchy/types'
import { hierarchyService } from '../../../../lib/hierarchy/hierarchyService'

export default function WorkflowScreen() {
  const { state, navigateUp } = useHierarchy()
  const [workflow, setWorkflow] = useState<WorkflowInstance | null>(null)
  const [deliverables, setDeliverables] = useState<DeliverableInstance[]>([])
  const [authorizations, setAuthorizations] = useState<Authorization[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'deliverables' | 'progress' | 'team' | 'authorization'>('overview')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (state.currentWorkflow) {
      loadWorkflowData()
    }
  }, [state.currentWorkflow])

  const loadWorkflowData = async () => {
    if (!state.currentWorkflow) return
    
    setIsLoading(true)
    try {
      const workflowData = await hierarchyService.getWorkflow(state.currentWorkflow.id)
      if (workflowData) {
        setWorkflow(workflowData)
        setDeliverables(workflowData.deliverables)
        setAuthorizations(workflowData.authorizations)
      }
    } catch (error) {
      console.error('Failed to load workflow data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateWorkflowStatus = async (status: 'active' | 'paused' | 'completed') => {
    if (!workflow) return
    
    await hierarchyService.updateWorkflow(workflow.id, { status })
    setWorkflow({ ...workflow, status })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4 text-green-400" />
      case 'paused': return <Pause className="w-4 h-4 text-yellow-400" />
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-400" />
      case 'blocked': return <AlertCircle className="w-4 h-4 text-red-400" />
      default: return <Clock className="w-4 h-4 text-slate-400" />
    }
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'on-track': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'at-risk': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'delayed': return 'text-red-400 bg-red-400/10 border-red-400/20'
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!workflow || !state.currentWorkflow) {
    return (
      <div className="text-center py-12">
        <WorkflowIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Workflow Selected</h3>
        <p className="text-slate-400 mb-4">Please select a workflow to view its details.</p>
        <Button onClick={() => navigateUp('project')} className="gradient-button">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Project
        </Button>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'deliverables', label: 'Deliverables', icon: FileText },
    { id: 'progress', label: 'Progress', icon: Target },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'authorization', label: 'Authorization', icon: Shield }
  ]

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigateUp('project')}
            className="glass-button"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Project
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{workflow.name}</h1>
              <div className="flex items-center gap-2">
                {getStatusIcon(workflow.status)}
                <Badge variant="outline" className="capitalize">
                  {workflow.status}
                </Badge>
              </div>
            </div>
            <p className="text-slate-400">{workflow.description}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          {workflow.status === 'draft' && (
            <Button 
              onClick={() => updateWorkflowStatus('active')}
              className="gradient-button"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Workflow
            </Button>
          )}
          {workflow.status === 'active' && (
            <Button 
              onClick={() => updateWorkflowStatus('paused')}
              variant="outline"
              className="glass-button"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          <Button variant="outline" className="glass-button">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Progress</p>
                <p className="text-2xl font-bold text-white">{Math.round(workflow.progress.overall)}%</p>
              </div>
              <Target className="w-8 h-8 text-blue-400" />
            </div>
            <Progress value={workflow.progress.overall} className="mt-3" />
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Health</p>
                <Badge className={`mt-1 ${getHealthColor(workflow.progress.health)}`}>
                  {workflow.progress.health}
                </Badge>
              </div>
              <BarChart3 className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Deliverables</p>
                <p className="text-2xl font-bold text-white">{deliverables.length}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Team</p>
                <p className="text-2xl font-bold text-white">{workflow.assignedAgents.length + workflow.humanCollaborators.length}</p>
              </div>
              <Users className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-400 text-purple-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Phase */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Current Phase
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <h4 className="font-semibold text-white">{workflow.progress.currentPhase || 'Planning'}</h4>
                    <p className="text-slate-400 text-sm mt-1">Active phase of the workflow</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Estimated Hours</p>
                      <p className="text-lg font-semibold text-white">{workflow.progress.estimatedHours}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Actual Hours</p>
                      <p className="text-lg font-semibold text-white">{workflow.progress.actualHours}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Started</span>
                    <span className="text-white">{new Date(workflow.timeline.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Planned End</span>
                    <span className="text-white">{new Date(workflow.timeline.plannedEndDate).toLocaleDateString()}</span>
                  </div>
                  {workflow.timeline.actualEndDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Actual End</span>
                      <span className="text-white">{new Date(workflow.timeline.actualEndDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'deliverables' && (
          <div className="space-y-4">
            {deliverables.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Deliverables Yet</h3>
                  <p className="text-slate-400">Deliverables will appear here as the workflow progresses.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deliverables.map((deliverable) => (
                  <Card key={deliverable.id} className="glass-card">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {deliverable.type}
                        </Badge>
                        <Badge 
                          variant="outline"
                          className={`text-xs ${
                            deliverable.status === 'delivered' ? 'border-green-400 text-green-400' :
                            deliverable.status === 'in-progress' ? 'border-blue-400 text-blue-400' :
                            'border-slate-400 text-slate-400'
                          }`}
                        >
                          {deliverable.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg text-white">{deliverable.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-400 text-sm mb-3">{deliverable.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-white">{deliverable.progress}%</span>
                        </div>
                        <Progress value={deliverable.progress} className="h-2" />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Due Date</span>
                          <span className="text-white">{new Date(deliverable.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Progress Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {workflow.progress.metrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">{metric.name}</span>
                      <span className="text-white font-semibold">{metric.value} {metric.unit}</span>
                    </div>
                    <p className="text-sm text-slate-400">{metric.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Phase Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {workflow.progress.completedPhases.map((phase, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">{phase}</span>
                    <Badge variant="outline" className="ml-auto text-green-400 border-green-400">
                      Completed
                    </Badge>
                  </div>
                ))}
                {workflow.progress.currentPhase && (
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5 text-blue-400" />
                    <span className="text-white">{workflow.progress.currentPhase}</span>
                    <Badge variant="outline" className="ml-auto text-blue-400 border-blue-400">
                      In Progress
                    </Badge>
                  </div>
                )}
                {workflow.progress.remainingPhases.map((phase, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-400">{phase}</span>
                    <Badge variant="outline" className="ml-auto">
                      Pending
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">AI Agents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {workflow.assignedAgents.length === 0 ? (
                  <p className="text-slate-400">No AI agents assigned yet.</p>
                ) : (
                  workflow.assignedAgents.map((agent, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{agent.agentId}</p>
                        <p className="text-slate-400 text-sm">{agent.role}</p>
                      </div>
                      <Badge variant="outline" className={`${
                        agent.status === 'active' ? 'border-green-400 text-green-400' : 
                        'border-slate-400 text-slate-400'
                      }`}>
                        {agent.status}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Human Collaborators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {workflow.humanCollaborators.length === 0 ? (
                  <p className="text-slate-400">No human collaborators assigned yet.</p>
                ) : (
                  workflow.humanCollaborators.map((collaborator, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-viby rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {collaborator.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{collaborator}</p>
                        <p className="text-slate-400 text-sm">Collaborator</p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'authorization' && (
          <div className="space-y-4">
            {authorizations.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="p-12 text-center">
                  <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Authorizations Required</h3>
                  <p className="text-slate-400">This workflow doesn't require any special authorizations.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {authorizations.map((auth) => (
                  <Card key={auth.id} className="glass-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          {auth.name}
                        </CardTitle>
                        <Badge 
                          variant="outline"
                          className={`${
                            auth.status === 'approved' ? 'border-green-400 text-green-400' :
                            auth.status === 'rejected' ? 'border-red-400 text-red-400' :
                            'border-yellow-400 text-yellow-400'
                          }`}
                        >
                          {auth.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-400 mb-4">{auth.description}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-400">Type</p>
                          <p className="text-white capitalize">{auth.type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Required</p>
                          <p className="text-white">{auth.required ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                      {auth.deadline && (
                        <div className="mt-4">
                          <p className="text-sm text-slate-400">Deadline</p>
                          <p className="text-white">{new Date(auth.deadline).toLocaleDateString()}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}