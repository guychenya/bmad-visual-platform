'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Badge } from '../../../components/ui/badge'
import { 
  Send, 
  Bot, 
  User, 
  Loader2,
  Crown,
  Brain,
  Building,
  Code,
  TestTube,
  Target,
  Palette,
  List,
  CheckCircle,
  Settings,
  FileText,
  Download,
  Upload,
  Zap,
  MessageSquare,
  Play
} from 'lucide-react'
import { aiService } from '../../../lib/ai/aiService'
import { BMAD_AGENTS } from '../../../lib/bmad/agents'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  agentId: string
  agentName: string
}

interface ProjectState {
  name: string
  phase: 'setup' | 'requirements' | 'architecture' | 'development' | 'qa' | 'completed'
  deliverables: string[]
  currentAgent: string
}

const AGENT_ICONS = {
  'bmad-orchestrator': Crown,
  'analyst': Brain,
  'architect': Building,
  'dev': Code,
  'qa': TestTube,
  'pm': Target,
  'ux-expert': Palette,
  'sm': List,
  'po': CheckCircle
}

const AGENT_COLORS = {
  'bmad-orchestrator': 'from-yellow-500 to-orange-500',
  'analyst': 'from-blue-500 to-cyan-500',
  'architect': 'from-indigo-500 to-purple-500',
  'dev': 'from-green-500 to-teal-500',
  'qa': 'from-red-500 to-pink-500',
  'pm': 'from-green-500 to-emerald-500',
  'ux-expert': 'from-purple-500 to-pink-500',
  'sm': 'from-orange-500 to-red-500',
  'po': 'from-teal-500 to-blue-500'
}

export default function UnifiedWorkspace() {
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)
  const [projectState, setProjectState] = useState<ProjectState>({
    name: 'New Project',
    phase: 'setup',
    deliverables: [],
    currentAgent: 'bmad-orchestrator'
  })
  const [selectedAgents, setSelectedAgents] = useState(['bmad-orchestrator'])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check for API key
    const checkApiKey = () => {
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
    }
    
    setHasApiKey(checkApiKey())

    // Initialize with orchestrator welcome message
    setMessages([{
      id: '1',
      role: 'assistant',
      content: `Welcome to BMad AI Builder! I'm the Orchestrator, and I'll coordinate our team of AI specialists to build your project.

🎯 **How it works:**
1. **Tell me about your project** - Share your idea, upload a PRD, or describe what you want to build
2. **I'll assemble the team** - I'll bring in the right specialists (Analyst, Architect, Developer, QA, etc.)
3. **We collaborate** - Watch as our AI team works together to plan and build your project
4. **Get deliverables** - Download professional documents, code, and architecture

What project would you like to build today?`,
      timestamp: new Date().toISOString(),
      agentId: 'bmad-orchestrator',
      agentName: 'BMad Orchestrator'
    }])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    const currentAgent = BMAD_AGENTS.find(a => a.id === projectState.currentAgent)
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString(),
      agentId: 'user',
      agentName: 'You'
    }

    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsLoading(true)

    try {
      // Get conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      // Enhanced context for orchestrator
      const contextualMessage = `Project: "${projectState.name}"
Phase: ${projectState.phase}
Current deliverables: ${projectState.deliverables.join(', ') || 'None yet'}
User request: ${userMessage.content}

As the BMad Orchestrator, coordinate the team and provide clear next steps. If this is a new project, help define requirements and suggest which agents to involve. Always be specific about what each agent will do.`

      const aiResponse = await aiService.chatWithAgent(
        projectState.currentAgent,
        contextualMessage,
        conversationHistory
      )

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse || generateFallbackResponse(userMessage.content, projectState),
        timestamp: new Date().toISOString(),
        agentId: projectState.currentAgent,
        agentName: currentAgent?.name || 'AI Assistant'
      }
      
      setMessages(prev => [...prev, aiMessage])

      // Auto-advance project if needed
      updateProjectProgress(aiMessage.content)

    } catch (error) {
      console.error('Error getting AI response:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateFallbackResponse(userMessage.content, projectState),
        timestamp: new Date().toISOString(),
        agentId: projectState.currentAgent,
        agentName: currentAgent?.name || 'AI Assistant'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateFallbackResponse = (userMessage: string, state: ProjectState): string => {
    if (state.phase === 'setup') {
      return `Great! I understand you want to work on "${userMessage}". Let me help you get started:

🔍 **Next Steps:**
1. **Requirements Analysis** - I'll bring in Mary (Business Analyst) to extract detailed requirements
2. **Technical Planning** - Winston (System Architect) will design the technical architecture  
3. **Development Strategy** - James (Developer) will plan the implementation
4. **Quality Assurance** - Quinn (QA) will ensure everything works perfectly

Would you like me to start with requirements analysis, or do you have specific documents to share first?

**Available team members:**
• Mary - Business Analyst
• Winston - System Architect  
• James - Full-Stack Developer
• Quinn - QA Engineer
• Sally - UX Expert

What would you like to focus on first?`
    }

    return `I'm coordinating the team to help with "${userMessage}". Based on our current project phase (${state.phase}), here's what I recommend:

🎯 **Immediate Actions:**
1. Analyze your requirements in detail
2. Create technical specifications
3. Plan development approach
4. Set up quality checkpoints

Let me know which area you'd like to dive deeper into, or if you have specific questions about the project!`
  }

  const updateProjectProgress = (response: string) => {
    // Simple logic to advance project state based on AI response
    if (response.includes('requirements') && projectState.phase === 'setup') {
      setProjectState(prev => ({
        ...prev,
        phase: 'requirements',
        deliverables: [...prev.deliverables, 'project-brief']
      }))
    }
  }

  const addAgent = (agentId: string) => {
    if (!selectedAgents.includes(agentId)) {
      setSelectedAgents(prev => [...prev, agentId])
    }
    setProjectState(prev => ({ ...prev, currentAgent: agentId }))
  }

  const downloadDeliverable = (deliverable: string) => {
    const content = generateDeliverableContent(deliverable, projectState.name)
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${projectState.name.toLowerCase().replace(/\s+/g, '-')}-${deliverable}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateDeliverableContent = (deliverable: string, projectName: string): string => {
    const templates = {
      'project-brief': `# Project Brief: ${projectName}

## Executive Summary
This document outlines the strategic vision and implementation approach for ${projectName}.

## Business Objectives
- Define clear project scope and deliverables
- Establish stakeholder requirements
- Create foundation for technical decisions

## Key Requirements
- Functional requirements analysis
- Technical architecture planning
- User experience design
- Quality assurance strategy

---
*Generated by BMad AI Builder*`,

      'user-stories': `# User Stories: ${projectName}

## Core Features

### Authentication & Access
**As a** user  
**I want to** securely access the application  
**So that** my data is protected  

**Acceptance Criteria:**
- [ ] User can register with email
- [ ] User can login securely
- [ ] Session management works properly

### Main Functionality
**As a** user  
**I want to** use the core features  
**So that** I can achieve my goals  

**Acceptance Criteria:**
- [ ] Core functionality works as expected
- [ ] User interface is intuitive
- [ ] Performance meets requirements

---
*Generated by BMad AI Builder*`,

      'technical-architecture': `# Technical Architecture: ${projectName}

## System Overview
Technical design and architecture decisions for ${projectName}.

## Technology Stack
- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Deployment**: Docker containers

## Architecture Components
- API Gateway
- Business Logic Layer
- Data Access Layer
- User Interface Components

---
*Generated by BMad AI Builder*`
    }

    return templates[deliverable as keyof typeof templates] || `# ${deliverable}: ${projectName}\n\nGenerated by BMad AI Builder`
  }

  const currentAgent = BMAD_AGENTS.find(a => a.id === projectState.currentAgent)
  const AgentIcon = AGENT_ICONS[projectState.currentAgent as keyof typeof AGENT_ICONS] || Crown

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      
      {/* Project Header */}
      <div className="p-4 border-b border-white/10 glass-nav">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Project Info */}
          <div className="flex items-center space-x-4">
            <div className={`p-3 bg-gradient-to-r ${AGENT_COLORS[projectState.currentAgent as keyof typeof AGENT_COLORS]} rounded-xl`}>
              <AgentIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">{projectState.name}</h1>
              <div className="flex items-center space-x-3 text-sm text-slate-400">
                <span>Phase: {projectState.phase}</span>
                <span>•</span>
                <span>Agent: {currentAgent?.name}</span>
                <Badge variant={hasApiKey ? "default" : "destructive"} className="text-xs">
                  {hasApiKey ? 'AI Connected' : 'Demo Mode'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            {projectState.deliverables.length > 0 && (
              <div className="flex items-center space-x-1">
                {projectState.deliverables.map(deliverable => (
                  <Button
                    key={deliverable}
                    size="sm"
                    variant="outline"
                    onClick={() => downloadDeliverable(deliverable)}
                    className="glass-button text-xs"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    {deliverable.replace('-', ' ')}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className={`flex items-start space-x-3 max-w-[85%] ${
                    msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    
                    {/* Agent Avatar */}
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                        : `bg-gradient-to-r ${AGENT_COLORS[msg.agentId as keyof typeof AGENT_COLORS] || 'from-gray-500 to-gray-600'}`
                    }`}>
                      {msg.role === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        (() => {
                          const Icon = AGENT_ICONS[msg.agentId as keyof typeof AGENT_ICONS] || Bot
                          return <Icon className="h-4 w-4 text-white" />
                        })()
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`p-4 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'glass-card-premium text-slate-100 rounded-bl-md'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium opacity-75">
                          {msg.agentName}
                        </span>
                        <span className="text-xs opacity-50">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex items-start space-x-3 max-w-[85%]">
                    <div className={`p-2 bg-gradient-to-r ${AGENT_COLORS[projectState.currentAgent as keyof typeof AGENT_COLORS]} rounded-lg animate-pulse`}>
                      <AgentIcon className="h-4 w-4 text-white" />
                    </div>
                    <div className="glass-card-premium p-4 rounded-2xl rounded-bl-md">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                        <span className="text-sm text-slate-300">
                          {currentAgent?.name} is thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-white/10 glass-nav">
            <div className="max-w-4xl mx-auto space-y-3">
              
              {/* API Key Warning */}
              {!hasApiKey && (
                <div className="text-center py-2">
                  <p className="text-xs text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full inline-block">
                    Demo mode - Add API keys in Settings for full AI functionality
                  </p>
                </div>
              )}
              
              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="flex space-x-3">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your project, ask questions, or upload requirements..."
                  disabled={isLoading}
                  className="flex-1 glass-card border-slate-600/50 text-white placeholder-slate-400 rounded-xl px-4 py-3 min-h-[48px] text-sm"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || !message.trim()}
                  className="gradient-button-premium px-6 py-3 rounded-xl shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Team Panel - Mobile Hidden, Desktop Sidebar */}
        <div className="hidden lg:block w-72 border-l border-white/10 glass-nav p-4">
          <div className="space-y-4">
            
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">AI Team</h3>
              <div className="space-y-2">
                {BMAD_AGENTS.slice(0, 6).map(agent => {
                  const Icon = AGENT_ICONS[agent.id as keyof typeof AGENT_ICONS] || Bot
                  const isActive = agent.id === projectState.currentAgent
                  const isSelected = selectedAgents.includes(agent.id)
                  
                  return (
                    <button
                      key={agent.id}
                      onClick={() => addAgent(agent.id)}
                      className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors ${
                        isActive 
                          ? 'bg-white/10 border border-white/20' 
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className={`p-1.5 bg-gradient-to-r ${AGENT_COLORS[agent.id as keyof typeof AGENT_COLORS]} rounded-lg`}>
                        <Icon className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white truncate">{agent.name}</div>
                        <div className="text-xs text-slate-400 truncate">{agent.role}</div>
                      </div>
                      {isSelected && (
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {projectState.deliverables.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Deliverables</h3>
                <div className="space-y-2">
                  {projectState.deliverables.map(deliverable => (
                    <button
                      key={deliverable}
                      onClick={() => downloadDeliverable(deliverable)}
                      className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5 text-left"
                    >
                      <FileText className="h-4 w-4 text-blue-400 flex-shrink-0" />
                      <span className="text-xs text-slate-300 truncate">
                        {deliverable.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}