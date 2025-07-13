'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { ArrowLeft, Edit, Download, FileText, Users, Calendar, Star, Folder, Play, Pause, Archive, Settings, Eye, MessageSquare, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Project {
  id: number
  name: string
  description: string
  status: string
  progress: number
  lastActivity: string
  team: string[]
  priority: string
  dueDate: string
  category: string
  color: string
  workflowResult?: any
  prdDocument?: any
  uploadedFile?: string
  uploadedContent?: string
}

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id
  const [project, setProject] = useState<Project | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProject = () => {
      try {
        const savedProjects = localStorage.getItem('viby-projects')
        if (savedProjects) {
          const projects = JSON.parse(savedProjects)
          const foundProject = projects.find((p: Project) => p.id.toString() === projectId)
          setProject(foundProject || null)
        }
      } catch (error) {
        console.error('Failed to load project:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (projectId) {
      loadProject()
    }
  }, [projectId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-400 animate-pulse'
      case 'paused': return 'bg-yellow-400'
      case 'completed': return 'bg-blue-400'
      case 'planning': return 'bg-purple-400'
      default: return 'bg-slate-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      default: return 'text-slate-400'
    }
  }

  const handleStatusUpdate = (newStatus: string) => {
    if (!project) return
    
    const updatedProject = { ...project, status: newStatus }
    setProject(updatedProject)
    
    // Update in localStorage
    const savedProjects = localStorage.getItem('viby-projects')
    if (savedProjects) {
      const projects = JSON.parse(savedProjects)
      const updatedProjects = projects.map((p: Project) => 
        p.id === project.id ? updatedProject : p
      )
      localStorage.setItem('viby-projects', JSON.stringify(updatedProjects))
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="glass-card p-8 text-center">
          <CardContent>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-slate-400">Loading project...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="glass-card p-8 text-center">
          <CardContent>
            <h3 className="text-xl font-semibold text-white mb-2">Project Not Found</h3>
            <p className="text-slate-400 mb-4">The requested project doesn't exist.</p>
            <Link href="/dashboard/projects">
              <Button className="gradient-button">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Eye },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'workflow', name: 'Workflow', icon: CheckCircle },
    { id: 'team', name: 'Team', icon: Users },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6">
            <Link href="/dashboard/projects">
              <Button variant="outline" className="glass-button">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            
            <div className="flex items-start space-x-4">
              <div className={`p-4 bg-gradient-to-r ${project.color} rounded-xl`}>
                <Folder className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
                <p className="text-slate-400 text-lg mb-4">{project.description}</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`} />
                    <span className="text-sm text-slate-300 capitalize">{project.status}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className={`h-4 w-4 ${getPriorityColor(project.priority)}`} />
                    <span className={`text-sm capitalize ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-400">{project.dueDate || 'No due date'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              className="glass-button"
              onClick={() => setActiveTab('settings')}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <div className="flex items-center space-x-2">
              <Button
                variant={project.status === 'active' ? 'outline' : 'default'}
                className={project.status === 'active' ? 'glass-button' : 'gradient-button'}
                onClick={() => handleStatusUpdate(project.status === 'active' ? 'paused' : 'active')}
              >
                {project.status === 'active' ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Project Progress</h3>
              <span className="text-2xl font-bold gradient-text">{project.progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <div 
                className="bg-gradient-viby h-3 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <div className="text-right text-sm text-slate-400 mt-2">
              Last activity: {project.lastActivity}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="border-b border-slate-700">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Project Stats */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-white">Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 text-sm">Category</span>
                        <p className="text-white font-medium">{project.category}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-sm">Status</span>
                        <p className="text-white font-medium capitalize">{project.status}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-sm">Priority</span>
                        <p className={`font-medium capitalize ${getPriorityColor(project.priority)}`}>
                          {project.priority}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-sm">Due Date</span>
                        <p className="text-white font-medium">{project.dueDate || 'Not set'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {project.workflowResult && (
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="text-white">BMad Workflow Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-white">Generated Documents</h4>
                          <div className="space-y-2">
                            <Button variant="outline" className="w-full glass-button text-sm">
                              <Download className="h-4 w-4 mr-2" />
                              Complete PRD
                            </Button>
                            <Button variant="outline" className="w-full glass-button text-sm">
                              <Download className="h-4 w-4 mr-2" />
                              Technical Specs
                            </Button>
                            <Button variant="outline" className="w-full glass-button text-sm">
                              <Download className="h-4 w-4 mr-2" />
                              User Stories
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-white">Workflow Status</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Requirements Analysis:</span>
                              <span className="text-green-400">✓ Complete</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Architecture Design:</span>
                              <span className="text-green-400">✓ Complete</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">PRD Generation:</span>
                              <span className="text-green-400">✓ Complete</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Team Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {project.team.map((member, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-medium">
                              {member.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-white">{member}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full gradient-button">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Start Chat Session
                    </Button>
                    <Button variant="outline" className="w-full glass-button">
                      <FileText className="h-4 w-4 mr-2" />
                      View Full PRD
                    </Button>
                    <Button variant="outline" className="w-full glass-button">
                      <Settings className="h-4 w-4 mr-2" />
                      Project Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Project Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.prdDocument && (
                    <div className="p-4 border border-slate-700 rounded-lg">
                      <FileText className="h-8 w-8 text-blue-400 mb-3" />
                      <h4 className="font-semibold text-white mb-2">Complete PRD</h4>
                      <p className="text-sm text-slate-400 mb-3">Comprehensive project requirements</p>
                      <Button className="w-full gradient-button">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                  
                  {project.uploadedFile && (
                    <div className="p-4 border border-slate-700 rounded-lg">
                      <FileText className="h-8 w-8 text-green-400 mb-3" />
                      <h4 className="font-semibold text-white mb-2">Original Upload</h4>
                      <p className="text-sm text-slate-400 mb-3">{project.uploadedFile}</p>
                      <Button variant="outline" className="w-full glass-button">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  )}

                  <div className="p-4 border border-slate-700 rounded-lg">
                    <FileText className="h-8 w-8 text-purple-400 mb-3" />
                    <h4 className="font-semibold text-white mb-2">Technical Specifications</h4>
                    <p className="text-sm text-slate-400 mb-3">Architecture and technical details</p>
                    <Button variant="outline" className="w-full glass-button">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>

                  <div className="p-4 border border-slate-700 rounded-lg">
                    <FileText className="h-8 w-8 text-orange-400 mb-3" />
                    <h4 className="font-semibold text-white mb-2">User Stories</h4>
                    <p className="text-sm text-slate-400 mb-3">Detailed user requirements</p>
                    <Button variant="outline" className="w-full glass-button">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'workflow' && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">BMad Workflow Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { phase: 'Requirements Analysis', status: 'completed', agent: 'Mary (Analyst)' },
                    { phase: 'Architecture Design', status: 'completed', agent: 'Winston (Architect)' },
                    { phase: 'Development Planning', status: 'completed', agent: 'James (Developer)' },
                    { phase: 'Quality Assurance', status: 'in-progress', agent: 'Quinn (QA)' },
                    { phase: 'Sprint Planning', status: 'pending', agent: 'Bob (Scrum Master)' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border border-slate-700 rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'completed' ? 'bg-green-400' :
                        item.status === 'in-progress' ? 'bg-yellow-400 animate-pulse' :
                        'bg-slate-500'
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{item.phase}</h4>
                        <p className="text-sm text-slate-400">{item.agent}</p>
                      </div>
                      <div className="text-sm text-slate-400 capitalize">
                        {item.status.replace('-', ' ')}
                      </div>
                      {item.status === 'completed' && (
                        <Button variant="outline" size="sm" className="glass-button">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'team' && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Team Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-white">Team Members</h3>
                    {project.team.map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-sm text-white font-medium">
                              {member.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{member}</p>
                            <p className="text-sm text-slate-400">Team Member</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="glass-button">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-white">Add Team Member</h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Enter email or name..."
                        className="w-full p-3 glass-input"
                      />
                      <Button className="w-full gradient-button">
                        Send Invitation
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'settings' && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Project Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Project Name</label>
                        <input
                          type="text"
                          value={project.name}
                          className="w-full p-3 glass-input"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Category</label>
                        <select className="w-full p-3 glass-input">
                          <option value={project.category}>{project.category}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Priority</label>
                        <select className="w-full p-3 glass-input">
                          <option value={project.priority}>{project.priority}</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Description</label>
                        <textarea
                          value={project.description}
                          rows={4}
                          className="w-full p-3 glass-input resize-none"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Due Date</label>
                        <input
                          type="date"
                          value={project.dueDate}
                          className="w-full p-3 glass-input"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-4 border-t border-slate-700">
                    <Button variant="outline" className="glass-button">
                      Cancel
                    </Button>
                    <Button className="gradient-button">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}