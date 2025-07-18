'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { 
  Send, 
  Loader2, 
  Brain, 
  Code, 
  TestTube, 
  Users, 
  User, 
  Palette, 
  Settings, 
  Key, 
  ExternalLink, 
  Plus, 
  MessageSquare, 
  ChevronLeft, 
  Menu, 
  History, 
  MoreHorizontal, 
  Crown,
  X,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Target,
  Building,
  Briefcase
} from 'lucide-react'
import Link from 'next/link'
import { routes } from '../../lib/routes'
import { useRouter } from 'next/navigation'
import { TypingIndicator } from '../agents/TypingIndicator'
import { aiService } from '../../lib/ai/aiService'
import { BMAD_AGENTS, BMadAgent } from '../../lib/bmad/agents'
import { BMAD_WORKFLOWS, Workflow, WorkflowStep } from '../../lib/bmad/workflows'
import { PROJECT_TEMPLATES, ProjectTemplate, getTemplateById, getAllCategories, getTemplatesByCategory } from '../../lib/workflow/templates'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  agentId?: string
  phase?: string
  deliverable?: string
}

interface AgentTab {
  id: string
  agentId: string
  name: string
  icon: any
  color: string
  status: 'pending' | 'active' | 'working' | 'completed' | 'blocked'
  messages: Message[]
  currentTask?: string
  deliverables: string[]
  dependencies: string[]
  isEnabled: boolean
}


interface AgentTabWorkspaceProps {
  projectId?: string
  templateId?: string
  onWorkflowComplete?: () => void
}

export function AgentTabWorkspace({ projectId, templateId, onWorkflowComplete }: AgentTabWorkspaceProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null)
  const [showTemplateSelector, setShowTemplateSelector] = useState(!templateId && !projectId)
  const [agentTabs, setAgentTabs] = useState<AgentTab[]>([])
  const [activeTabId, setActiveTabId] = useState<string>('')
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)
  const [workflowStatus, setWorkflowStatus] = useState<'setup' | 'running' | 'paused' | 'completed'>('setup')
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null)
  const [globalMessages, setGlobalMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Memoize API key check to prevent unnecessary localStorage reads
  const apiKeyStatus = useMemo(() => {
    if (typeof window === 'undefined') return false
    const savedSettings = localStorage.getItem('viby-settings')
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        return !!(settings.apiKeys?.openai?.trim() || 
                 settings.apiKeys?.claude?.trim() || 
                 settings.apiKeys?.gemini?.trim())
      } catch (error) {
        return false
      }
    }
    return false
  }, [])

  useEffect(() => {
    setHasApiKey(apiKeyStatus)
  }, [apiKeyStatus])

  const generateContextualResponse = useCallback((userMessage: string, tab: AgentTab, agent?: BMadAgent): string => {
    if (!agent) return "I'm working on your request..."

    const taskResponses = {
      analyst: `Based on my analysis of your requirements for "${selectedTemplate?.name}", I recommend focusing on user needs and market positioning. Let me break down the key business requirements...`,
      pm: `From a product management perspective, I'll help prioritize the features for "${selectedTemplate?.name}". Let's define the MVP scope and user stories...`,
      'ux-expert': `For the user experience design of "${selectedTemplate?.name}", I suggest we start with user journey mapping and wireframes. The design should be intuitive and accessible...`,
      architect: `Looking at the technical architecture for "${selectedTemplate?.name}", I recommend a scalable design using ${selectedTemplate?.techStack.join(', ')}. Here's my proposed system structure...`,
      dev: `I'm ready to implement the code for "${selectedTemplate?.name}". Based on the architecture and requirements, I'll start with the core functionality and follow best practices...`,
      qa: `For quality assurance of "${selectedTemplate?.name}", I'll create a comprehensive testing strategy covering functional, performance, and security aspects...`
    }

    const agentType = agent.id.includes('analyst') ? 'analyst' :
                     agent.id.includes('pm') ? 'pm' :
                     agent.id.includes('ux') ? 'ux-expert' :
                     agent.id.includes('architect') ? 'architect' :
                     agent.id.includes('dev') ? 'dev' : 'qa'

    return taskResponses[agentType as keyof typeof taskResponses] || 
           `As ${agent.name}, I'm working on the ${tab.currentTask} for "${selectedTemplate?.name}". ${agent.persona}`
  }, [selectedTemplate])

  const checkTaskCompletion = useCallback((tab: AgentTab, lastMessage: Message) => {
    // Simple completion detection - in a real app, this would be more sophisticated
    const completionKeywords = ['completed', 'finished', 'done', 'ready', 'delivered', 'complete']
    const hasCompletionIndicator = completionKeywords.some(keyword => 
      lastMessage.content.toLowerCase().includes(keyword)
    )

    if (hasCompletionIndicator && tab.status === 'active') {
      console.log('Task completion detected for:', tab.name)
      
      // Mark current tab as completed and enable next agent
      setAgentTabs(prev => {
        const currentIndex = prev.findIndex(t => t.id === tab.id)
        const updatedTabs = prev.map((t, index) => {
          if (t.id === tab.id) {
            return { ...t, status: 'completed' as const }
          }
          // Enable next agent
          if (index === currentIndex + 1) {
            return { ...t, status: 'active' as const, isEnabled: true }
          }
          return t
        })
        
        // Switch to next tab if available
        if (currentIndex < prev.length - 1) {
          const nextTab = updatedTabs[currentIndex + 1]
          setTimeout(() => setActiveTabId(nextTab.id), 500)
        } else {
          // All agents completed
          setTimeout(() => {
            setWorkflowStatus('completed')
            onWorkflowComplete?.()
          }, 1000)
        }
        
        return updatedTabs
      })
    }
  }, [setAgentTabs, setActiveTabId, setWorkflowStatus, onWorkflowComplete])

  const initializeAgentTabs = useCallback((workflow: Workflow, template: ProjectTemplate) => {
    console.log('Initializing agent tabs for workflow:', workflow.id)
    
    const urlParams = new URLSearchParams(window.location.search);
    const selectedAgentIdsParam = urlParams.get('agents');
    const selectedAgentIds = selectedAgentIdsParam ? selectedAgentIdsParam.split(',') : [];

    const filteredSteps = selectedAgentIds.length > 0
      ? workflow.steps.filter(step => selectedAgentIds.includes(step.agentId))
      : workflow.steps;

    // Ensure orchestrator is always first if not already
    const orchestratorStep = filteredSteps.find(step => step.agentId === 'bmad-orchestrator')
    const otherSteps = filteredSteps.filter(step => step.agentId !== 'bmad-orchestrator')
    const orderedSteps = orchestratorStep ? [orchestratorStep, ...otherSteps] : filteredSteps

    const tabs: AgentTab[] = orderedSteps.map((step, index) => {
      const agent = BMAD_AGENTS.find(a => a.id === step.agentId)
      if (!agent) {
        console.warn('Agent not found:', step.agentId)
        return null
      }

      return {
        id: `tab-${step.agentId}`,
        agentId: step.agentId,
        name: agent.name,
        icon: getAgentIcon(agent.id),
        color: agent.color,
        status: index === 0 ? 'active' : 'pending',
        messages: [{
          id: `greeting-${step.agentId}`,
          role: 'assistant',
          content: `Hello! I'm ${agent.name}. ${agent.persona}. I'm ready to work on "${template.name}" for you. My role in this workflow is: ${agent.role}`,
          timestamp: new Date().toISOString(),
          agentId: step.agentId
        }],
        currentTask: step.tasks[0]?.name || step.description,
        deliverables: step.outputs,
        dependencies: step.dependencies,
        isEnabled: index === 0
      } as AgentTab
    }).filter(Boolean) as AgentTab[]

    setAgentTabs(tabs)
    if (tabs.length > 0) {
      setActiveTabId(tabs[0].id)
    }
  }, [])

  // Memoize template initialization
  const initializeWorkflowFromTemplate = useCallback((template: ProjectTemplate) => {
    setSelectedTemplate(template)
    setShowTemplateSelector(false)
    
    // Find the workflow definition
    const workflow = BMAD_WORKFLOWS.find(w => w.id === template.workflow.id)
    if (workflow) {
      setCurrentWorkflow(workflow)
      initializeAgentTabs(workflow, template)
    }
  }, [])

  useEffect(() => {
    // Load template if provided
    if (templateId) {
      const template = PROJECT_TEMPLATES.find(t => t.id === templateId)
      if (template) {
        console.log('Loading template:', template.name)
        initializeWorkflowFromTemplate(template)
      } else {
        console.error('Template not found:', templateId)
      }
    }
  }, [templateId, initializeWorkflowFromTemplate])

  const getAgentIcon = (agentId: string) => {
    const iconMap: Record<string, any> = {
      'bmad-orchestrator': Crown,
      'analyst': Brain,
      'pm': Target,
      'ux-expert': Palette,
      'architect': Building,
      'po': CheckCircle,
      'sm': Users,
      'dev': Code,
      'qa': TestTube
    }
    return iconMap[agentId] || User
  }

  const handleTemplateSelect = (template: ProjectTemplate) => {
    initializeWorkflowFromTemplate(template)
  }

  const handleStartWorkflow = () => {
    setWorkflowStatus('running')
    // Enable the first agent
    if (agentTabs.length > 0) {
      setAgentTabs(prev => prev.map((tab, index) => ({
        ...tab,
        status: index === 0 ? 'active' : 'pending',
        isEnabled: index === 0
      })))
    }
  }

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading || !hasApiKey) return

    const activeTab = agentTabs.find(tab => tab.id === activeTabId)
    if (!activeTab) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString(),
      agentId: activeTab.agentId
    }

    // Update the active tab's messages
    setAgentTabs(prev => prev.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, messages: [...tab.messages, userMessage] }
        : tab
    ))

    setMessage('')
    setIsTyping(true)
    setIsLoading(true)

    try {
      // Get agent context for better responses
      const agent = BMAD_AGENTS.find(a => a.id === activeTab.agentId)
      const contextMessages = activeTab.messages.map(m => ({ role: m.role, content: m.content }))
      
      // Add context to the message for better responses
      const contextualMessage = `Project: "${selectedTemplate?.name}" (Template: ${templateId}, Project: ${projectId})
Current Task: ${activeTab.currentTask}
Expected Deliverables: ${activeTab.deliverables.join(', ')}
Agent Role: ${agent?.role || 'Assistant'}

User Message: ${userMessage.content}

Please provide detailed, actionable guidance specific to this ${selectedTemplate?.name} project.`
      
      console.log('Sending message to agent:', {
        agentId: activeTab.agentId,
        agentName: agent?.name,
        messageLength: contextualMessage.length,
        hasApiKey
      })
      
      const responseContent = await aiService.chatWithAgent(
        activeTab.agentId,
        contextualMessage,
        contextMessages
      )
      
      console.log('Agent response received:', {
        agentId: activeTab.agentId,
        responseLength: responseContent?.length || 0
      })

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent || generateContextualResponse(userMessage.content, activeTab, agent),
        timestamp: new Date().toISOString(),
        agentId: activeTab.agentId
      }

      // Update the active tab's messages
      setAgentTabs(prev => prev.map(tab => 
        tab.id === activeTabId 
          ? { ...tab, messages: [...tab.messages, agentMessage] }
          : tab
      ))

      // Check if task is complete and enable next agent
      checkTaskCompletion(activeTab, agentMessage)

    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsTyping(false)
      setIsLoading(false)
    }
  }, [message, isLoading, hasApiKey, agentTabs, activeTabId, selectedTemplate, projectId, templateId, generateContextualResponse, checkTaskCompletion])

  const getStatusIcon = (status: AgentTab['status']) => {
    switch (status) {
      case 'pending': return Clock
      case 'active': return Play
      case 'working': return Loader2
      case 'completed': return CheckCircle
      case 'blocked': return AlertCircle
      default: return Clock
    }
  }

  const getStatusColor = (status: AgentTab['status']) => {
    switch (status) {
      case 'pending': return 'text-slate-400'
      case 'active': return 'text-blue-400'
      case 'working': return 'text-yellow-400'
      case 'completed': return 'text-green-400'
      case 'blocked': return 'text-red-400'
      default: return 'text-slate-400'
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [agentTabs, activeTabId])

  // Memoize template categories to prevent recalculation
  const templateCategories = useMemo(() => {
    if (!showTemplateSelector) return []
    return getAllCategories()
  }, [showTemplateSelector])

  // Memoize category templates
  const categorizedTemplates = useMemo(() => {
    return templateCategories.reduce((acc, category) => {
      acc[category] = getTemplatesByCategory(category)
      return acc
    }, {} as Record<string, typeof PROJECT_TEMPLATES>)
  }, [templateCategories])

  // Template selector view
  if (showTemplateSelector) {
    return (
      <div className="h-full bg-background overflow-y-auto">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="responsive-text-4xl font-bold gradient-text mb-4">Choose Your Project Template</h1>
              <p className="text-slate-300 responsive-text-lg">
                Select a template to get started with a predefined workflow and agent team
              </p>
            </div>

            {templateCategories.map((category, categoryIndex) => {
              const categoryTemplates = categorizedTemplates[category]
              return (
                <div key={category} className="mb-12">
                  <div className="flex items-center space-x-3 mb-6">
                    <h2 className="responsive-text-2xl font-bold text-white">{category}</h2>
                    <Badge variant="outline" className="text-slate-400 border-slate-600">
                      {categoryTemplates.length} templates
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryTemplates.slice(0, 6).map((template, index) => {
                      const IconComponent = template.icon
                      return (
                        <Card 
                          key={template.id}
                          className="agent-card group cursor-pointer hover:scale-102 transition-all duration-200"
                          onClick={() => handleTemplateSelect(template)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className={`p-3 bg-gradient-to-r ${template.color} rounded-xl group-hover:scale-110 transition-transform`}>
                                <IconComponent className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-white">{template.name}</h3>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs border-slate-600 text-slate-300 capitalize mt-1 ${
                                    template.complexity === 'simple' ? 'border-green-400 text-green-400' :
                                    template.complexity === 'medium' ? 'border-yellow-400 text-yellow-400' :
                                    'border-red-400 text-red-400'
                                  }`}
                                >
                                  {template.complexity}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-slate-400 text-sm mb-4">{template.description}</p>
                            
                            <div className="space-y-3 mb-4">
                              <div>
                                <h4 className="text-sm font-medium text-white mb-2">Features:</h4>
                                <div className="flex flex-wrap gap-1">
                                  {template.features.slice(0, 3).map((feature, idx) => (
                                    <Badge 
                                      key={idx}
                                      variant="secondary" 
                                      className="text-xs px-2 py-0.5 bg-white/10 text-slate-300 border-0"
                                    >
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium text-white mb-2">Tech Stack:</h4>
                                <div className="flex flex-wrap gap-1">
                                  {template.techStack.slice(0, 3).map((tech, idx) => (
                                    <Badge 
                                      key={idx}
                                      variant="secondary" 
                                      className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-300 border-0"
                                    >
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400">Agents:</span>
                                <span className="text-white font-medium">{template.workflow.agents.length}</span>
                              </div>
                            </div>
                            
                            <Button className="w-full gradient-button">
                              <Play className="h-4 w-4 mr-2" />
                              Start Project
                            </Button>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            <div className="mt-8 text-center">
              <Button 
                variant="outline" 
                className="glass-button"
                onClick={() => {
                  // Allow custom setup
                  setShowTemplateSelector(false)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Custom Workflow
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main workspace view
  return (
    <div className="h-full bg-background flex flex-col overflow-hidden">
      {/* Workflow Header */}
      <div className="border-b border-border glass-nav p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {selectedTemplate && (
                <div className={`p-2 bg-gradient-to-r ${selectedTemplate.color} rounded-lg`}>
                  <selectedTemplate.icon className="h-6 w-6 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-semibold text-white">
                  {selectedTemplate?.name || 'Custom Workflow'}
                </h1>
                <p className="text-sm text-slate-400">
                  {workflowStatus === 'setup' && 'Ready to start'}
                  {workflowStatus === 'running' && 'Workflow in progress'}
                  {workflowStatus === 'paused' && 'Workflow paused'}
                  {workflowStatus === 'completed' && 'Workflow completed'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {workflowStatus === 'setup' && (
              <Button 
                className="gradient-button"
                onClick={handleStartWorkflow}
                disabled={agentTabs.length === 0}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Workflow
              </Button>
            )}
            
            {workflowStatus === 'running' && (
              <Button 
                variant="outline" 
                className="glass-button"
                onClick={() => setWorkflowStatus('paused')}
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}

            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                hasApiKey ? 'bg-green-400 animate-pulse' : 'bg-slate-500'
              }`}></div>
              <span className="text-sm text-slate-400">
                {hasApiKey ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Tabs - Vertical Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar with Agent List */}
        <div className="w-80 border-r border-border bg-slate-900/50 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              BMad Agents
            </h3>
            <div className="space-y-2">
              {agentTabs.map((tab) => {
                const IconComponent = tab.icon
                const StatusIcon = getStatusIcon(tab.status)
                const isActive = activeTabId === tab.id
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => tab.isEnabled && setActiveTabId(tab.id)}
                    disabled={!tab.isEnabled}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-blue-600/20 border border-blue-400/50 text-white' 
                        : tab.isEnabled 
                          ? 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10' 
                          : 'text-slate-600 cursor-not-allowed opacity-50 border border-transparent'
                    }`}
                  >
                    <div className={`p-2 bg-gradient-to-r ${tab.color} rounded-lg ${
                      !tab.isEnabled ? 'opacity-50' : ''
                    }`}>
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{tab.name}</div>
                      <div className="text-xs opacity-75">{tab.currentTask || 'Ready'}</div>
                    </div>
                    <StatusIcon className={`h-4 w-4 ${getStatusColor(tab.status)} ${
                      tab.status === 'working' ? 'animate-spin' : ''
                    }`} />
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
        {agentTabs.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Building className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Workflow Configured</h3>
              <p className="text-slate-400 mb-6">
                Select a template or configure agents to start your workflow
              </p>
              <Button 
                className="gradient-button"
                onClick={() => setShowTemplateSelector(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Choose Template
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {(() => {
                const activeTab = agentTabs.find(tab => tab.id === activeTabId)
                if (!activeTab) return null
                
                return activeTab.messages.map((msg: Message) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div className="flex items-start space-x-3 max-w-[80%]">
                      {msg.role === 'assistant' && (
                        <div className={`p-2 bg-gradient-to-r ${activeTab.color} rounded-lg flex-shrink-0 mt-1`}>
                          <activeTab.icon className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`p-4 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white rounded-br-md'
                            : 'glass-card text-foreground rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        <span className="text-xs opacity-70 mt-2 block">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              })()}
              
              {/* Typing Indicator */}
              {isTyping && (() => {
                const activeTab = agentTabs.find(tab => tab.id === activeTabId)
                return activeTab && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="flex items-start space-x-3 max-w-[80%]">
                      <div className={`p-2 bg-gradient-to-r ${activeTab.color} rounded-lg flex-shrink-0`}>
                        <activeTab.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="glass-card p-4 rounded-2xl rounded-bl-md">
                        <TypingIndicator />
                      </div>
                    </div>
                  </div>
                )
              })()}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border glass-nav">
              {!hasApiKey ? (
                <div className="text-center py-4">
                  <div className="max-w-md mx-auto">
                    <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl mb-3 inline-block">
                      <Key className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">AI Service Not Configured</h3>
                    <p className="text-slate-400 mb-4 text-sm">
                      Configure your API keys to start chatting with AI agents.
                    </p>
                    <Link href={routes.dashboard.settings + '?tab=api'}>
                      <Button className="gradient-button">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure API Keys
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Task Completion Button */}
                  {(() => {
                    const activeTab = agentTabs.find(tab => tab.id === activeTabId)
                    return activeTab?.isEnabled && activeTab.status === 'active' && (
                      <div className="flex justify-center">
                        <Button 
                          onClick={() => {
                            const dummyMessage: Message = {
                              id: Date.now().toString(),
                              role: 'assistant',
                              content: 'Task completed! Moving to the next agent...',
                              timestamp: new Date().toISOString(),
                              agentId: activeTab.agentId
                            }
                            checkTaskCompletion(activeTab, dummyMessage)
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Task as Complete
                        </Button>
                      </div>
                    )
                  })()}

                  {/* Message Form */}
                  <form onSubmit={handleSendMessage} className="flex space-x-3">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={(() => {
                        const activeTab = agentTabs.find(tab => tab.id === activeTabId)
                        return activeTab?.isEnabled 
                          ? `Message ${activeTab.name}...`
                          : 'Complete previous tasks to continue...'
                      })()}
                      disabled={isLoading || !agentTabs.find(tab => tab.id === activeTabId)?.isEnabled}
                      className="flex-1 glass-input border-input text-foreground placeholder-muted-foreground rounded-xl px-4 py-3"
                    />
                    <Button 
                      type="submit" 
                      disabled={isLoading || !message.trim() || !agentTabs.find(tab => tab.id === activeTabId)?.isEnabled}
                      className="gradient-button px-6 py-3 rounded-xl"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  )
}