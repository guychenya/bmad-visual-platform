'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Plus, Folder, Clock, Users, Star, MoreHorizontal, Play, Pause, Archive, Settings } from 'lucide-react'
import { useState, useEffect } from 'react'
import { CreateProjectModal } from '../../../components/projects/CreateProjectModal'

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
  template?: string
  tags?: string[]
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])

  // Load projects from localStorage on mount
  useEffect(() => {
    const loadProjects = () => {
      try {
        const savedProjects = localStorage.getItem('viby-projects')
        if (savedProjects) {
          const parsed = JSON.parse(savedProjects)
          setProjects(parsed)
        } else {
          // Initialize with default projects if none exist
          const defaultProjects = [
            {
              id: 1,
              name: 'Viby.ai Platform',
              description: 'AI-powered development platform with glassmorphism design',
              status: 'active',
              progress: 75,
              lastActivity: '2 hours ago',
              team: ['Alice', 'Bob', 'Charlie'],
              priority: 'high',
              dueDate: '2024-02-15',
              category: 'Web App',
              color: 'from-purple-500 to-pink-500'
            },
            {
              id: 2,
              name: 'E-commerce Dashboard',
              description: 'Modern admin dashboard for online store management',
              status: 'active',
              progress: 45,
              lastActivity: '1 day ago',
              team: ['David', 'Eve'],
              priority: 'medium',
              dueDate: '2024-03-01',
              category: 'Dashboard',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              id: 3,
              name: 'Mobile Banking App',
              description: 'Secure mobile banking application with biometric authentication',
              status: 'paused',
              progress: 30,
              lastActivity: '5 days ago',
              team: ['Frank', 'Grace', 'Henry'],
              priority: 'high',
              dueDate: '2024-04-10',
              category: 'Mobile',
              color: 'from-green-500 to-emerald-500'
            },
            {
              id: 4,
              name: 'Portfolio Website',
              description: 'Personal portfolio with animated components and contact form',
              status: 'completed',
              progress: 100,
              lastActivity: '1 week ago',
              team: ['Ivy'],
              priority: 'low',
              dueDate: '2024-01-20',
              category: 'Portfolio',
              color: 'from-orange-500 to-red-500'
            },
            {
              id: 5,
              name: 'API Gateway',
              description: 'Microservices API gateway with rate limiting and monitoring',
              status: 'active',
              progress: 60,
              lastActivity: '3 hours ago',
              team: ['Jack', 'Kelly'],
              priority: 'high',
              dueDate: '2024-02-28',
              category: 'Backend',
              color: 'from-indigo-500 to-purple-500'
            },
            {
              id: 6,
              name: 'Blog Platform',
              description: 'Content management system with markdown support and SEO',
              status: 'planning',
              progress: 10,
              lastActivity: '2 days ago',
              team: ['Liam', 'Maya'],
              priority: 'medium',
              dueDate: '2024-03-15',
              category: 'Content',
              color: 'from-teal-500 to-blue-500'
            }
          ]
          setProjects(defaultProjects)
          localStorage.setItem('viby-projects', JSON.stringify(defaultProjects))
        }
      } catch (error) {
        console.error('Failed to load projects:', error)
      }
    }

    loadProjects()
  }, [])

  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const statuses = ['All', 'Active', 'Paused', 'Completed', 'Planning']

  const filteredProjects = selectedStatus === 'All' 
    ? projects 
    : projects.filter(project => project.status === selectedStatus.toLowerCase())

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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Projects</h1>
          <p className="text-slate-300 text-lg">
            Manage and track your development projects
          </p>
        </div>
        <Button 
          className="gradient-button hover:scale-105 transition-transform"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <Button
            key={status}
            variant={selectedStatus === status ? "default" : "outline"}
            onClick={() => setSelectedStatus(status)}
            className={selectedStatus === status ? "gradient-button" : "glass-button"}
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <Card 
            key={project.id} 
            className="agent-card group cursor-pointer animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setSelectedProject(project)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 bg-gradient-to-r ${project.color} rounded-xl group-hover:scale-110 transition-transform`}>
                  <Folder className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`} />
                  <span className="text-sm text-slate-400 capitalize">
                    {project.status}
                  </span>
                </div>
              </div>
              <CardTitle className="text-lg text-white">{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 mb-4 text-sm">{project.description}</p>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-400">Progress</span>
                  <span className="text-sm text-slate-300">{project.progress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-viby h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{project.lastActivity}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{project.team.length}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className={`h-4 w-4 ${getPriorityColor(project.priority)}`} />
                  <span className={`text-sm capitalize ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                </div>
                <span className="text-xs bg-white/10 text-slate-300 px-2 py-1 rounded-full">
                  {project.category}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold gradient-text mb-2">
              {projects.filter(p => p.status === 'active').length}
            </div>
            <div className="text-slate-400">Active Projects</div>
          </CardContent>
        </Card>
        <Card className="glass-card text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold gradient-text mb-2">
              {projects.filter(p => p.status === 'completed').length}
            </div>
            <div className="text-slate-400">Completed</div>
          </CardContent>
        </Card>
        <Card className="glass-card text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold gradient-text mb-2">
              {Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)}%
            </div>
            <div className="text-slate-400">Avg Progress</div>
          </CardContent>
        </Card>
        <Card className="glass-card text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold gradient-text mb-2">
              {projects.reduce((acc, p) => acc + p.team.length, 0)}
            </div>
            <div className="text-slate-400">Team Members</div>
          </CardContent>
        </Card>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedProject(null)}>
          <Card className="glass-card max-w-4xl w-full mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 bg-gradient-to-r ${selectedProject.color} rounded-xl`}>
                    <Folder className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">{selectedProject.name}</CardTitle>
                    <p className="text-slate-400">{selectedProject.description}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setSelectedProject(null)} className="glass-button">
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Project Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status:</span>
                        <span className="text-white capitalize">{selectedProject.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Priority:</span>
                        <span className={`capitalize ${getPriorityColor(selectedProject.priority)}`}>
                          {selectedProject.priority}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Due Date:</span>
                        <span className="text-white">{selectedProject.dueDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Category:</span>
                        <span className="text-white">{selectedProject.category}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Team</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.team.map((member: string, idx: number) => (
                        <span key={idx} className="bg-white/10 text-slate-300 px-3 py-1 rounded-full text-sm">
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Progress</h3>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div 
                      className="bg-gradient-viby h-3 rounded-full transition-all duration-300"
                      style={{ width: `${selectedProject.progress}%` }}
                    />
                  </div>
                  <div className="text-right text-sm text-slate-400 mt-1">
                    {selectedProject.progress}% complete
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button className="gradient-button flex-1">
                    <Play className="h-4 w-4 mr-2" />
                    Open Project
                  </Button>
                  <Button variant="outline" className="glass-button">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onProjectCreated={(project: Project) => {
          const updatedProjects = [...projects, project]
          setProjects(updatedProjects)
          localStorage.setItem('viby-projects', JSON.stringify(updatedProjects))
        }}
      />
    </div>
  )
}