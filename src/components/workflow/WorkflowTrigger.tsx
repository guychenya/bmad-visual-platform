'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { 
  Play, 
  Sparkles, 
  Brain, 
  Code, 
  TestTube, 
  Users, 
  User, 
  Palette, 
  FileText,
  ArrowRight,
  GitBranch,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { routes } from '../../lib/routes'

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  agents: string[]
  estimatedTime: string
  complexity: 'Simple' | 'Medium' | 'Complex'
  icon: any
  color: string
}

const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'fullstack-webapp',
    name: 'Full-Stack Web Application',
    description: 'Complete web application development from requirements to deployment',
    agents: ['orchestrator', 'analyst', 'architect', 'ux', 'developer', 'qa'],
    estimatedTime: '15-20 min',
    complexity: 'Complex',
    icon: Code,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'mobile-app',
    name: 'Mobile Application',
    description: 'Native or cross-platform mobile app development workflow',
    agents: ['orchestrator', 'analyst', 'ux', 'developer', 'qa'],
    estimatedTime: '12-15 min',
    complexity: 'Medium',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'api-service',
    name: 'API Service Development',
    description: 'Backend API service development with documentation and testing',
    agents: ['orchestrator', 'analyst', 'architect', 'developer', 'qa'],
    estimatedTime: '8-12 min',
    complexity: 'Medium',
    icon: GitBranch,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'landing-page',
    name: 'Marketing Landing Page',
    description: 'High-converting landing page with UX optimization',
    agents: ['orchestrator', 'analyst', 'ux', 'developer'],
    estimatedTime: '5-8 min',
    complexity: 'Simple',
    icon: FileText,
    color: 'from-orange-500 to-red-500'
  }
]

interface WorkflowTriggerProps {
  onStartWorkflow?: (workflowId: string, projectName: string) => void
  className?: string
}

export function WorkflowTrigger({ onStartWorkflow, className = '' }: WorkflowTriggerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [projectName, setProjectName] = useState('')
  const [showQuickStart, setShowQuickStart] = useState(false)

  const handleStartWorkflow = (templateId: string) => {
    if (!projectName.trim()) {
      setShowQuickStart(true)
      setSelectedTemplate(templateId)
      return
    }
    
    if (onStartWorkflow) {
      onStartWorkflow(templateId, projectName)
    } else {
      // Navigate to workflow page with parameters
      window.location.href = `${routes.dashboard.workflow}?template=${templateId}&project=${encodeURIComponent(projectName)}`
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'bg-green-500/20 text-green-300'
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300'
      case 'Complex': return 'bg-red-500/20 text-red-300'
      default: return 'bg-slate-500/20 text-slate-300'
    }
  }

  const getAgentIcon = (agentId: string) => {
    const icons = {
      'orchestrator': Brain,
      'analyst': FileText,
      'architect': Code,
      'ux': Palette,
      'developer': Code,
      'qa': TestTube,
      'pm': Users,
      'po': User
    }
    return icons[agentId as keyof typeof icons] || Brain
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Quick Start Modal */}
      {showQuickStart && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="glass-card max-w-md w-full animate-scale-in">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Start AI Workflow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectName" className="text-white">Project Name</Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., My Awesome Project"
                  className="glass-input"
                  autoFocus
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowQuickStart(false)}
                  className="flex-1 glass-button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (projectName.trim()) {
                      handleStartWorkflow(selectedTemplate)
                      setShowQuickStart(false)
                    }
                  }}
                  disabled={!projectName.trim()}
                  className="flex-1 gradient-button"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-2">AI Workflow Engine</h2>
        <p className="text-slate-300">
          Watch AI agents collaborate in real-time to build your project
        </p>
      </div>

      {/* Workflow Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {WORKFLOW_TEMPLATES.map((template) => {
          const Icon = template.icon
          
          return (
            <Card key={template.id} className="glass-card group hover:scale-105 transition-transform">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 bg-gradient-to-r ${template.color} rounded-xl group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${getComplexityColor(template.complexity)}`}>
                      {template.complexity}
                    </span>
                    <span className="text-sm text-slate-400">{template.estimatedTime}</span>
                  </div>
                </div>
                <CardTitle className="text-xl text-white">{template.name}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-slate-400 text-sm">{template.description}</p>
                
                {/* Agent Pipeline Preview */}
                <div>
                  <h4 className="text-white text-sm font-medium mb-2">Agent Pipeline:</h4>
                  <div className="flex items-center space-x-2 overflow-x-auto">
                    {template.agents.map((agentId, index) => {
                      const AgentIcon = getAgentIcon(agentId)
                      return (
                        <div key={agentId} className="flex items-center space-x-2 flex-shrink-0">
                          <div className="flex items-center space-x-1">
                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                              <AgentIcon className="h-4 w-4 text-slate-300" />
                            </div>
                            <span className="text-xs text-slate-400 capitalize">
                              {agentId.replace('-', ' ')}
                            </span>
                          </div>
                          {index < template.agents.length - 1 && (
                            <ArrowRight className="h-3 w-3 text-slate-600" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    onClick={() => handleStartWorkflow(template.id)}
                    className="flex-1 gradient-button group-hover:scale-105 transition-transform"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Workflow
                  </Button>
                  <Link href={`${routes.dashboard.workflow}?template=${template.id}`}>
                    <Button variant="outline" size="sm" className="glass-button">
                      <GitBranch className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Access */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Quick Start</h3>
              <p className="text-slate-400 text-sm">Enter a project name and let AI agents handle the rest</p>
            </div>
            <div className="flex items-center space-x-3">
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Project name..."
                className="glass-input w-48"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && projectName.trim()) {
                    handleStartWorkflow('fullstack-webapp')
                  }
                }}
              />
              <Button
                onClick={() => handleStartWorkflow('fullstack-webapp')}
                disabled={!projectName.trim()}
                className="gradient-button"
              >
                <Zap className="h-4 w-4 mr-2" />
                Quick Start
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}