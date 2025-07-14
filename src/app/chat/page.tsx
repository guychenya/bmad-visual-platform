'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../../components/ui/button'
import { 
  Send, 
  Bot, 
  User, 
  Loader2,
  ArrowLeft,
  ChevronDown,
  Zap,
  Brain,
  Code,
  GitBranch,
  FileCode,
  Settings,
  Sparkles
} from 'lucide-react'
import { aiService } from '../../lib/ai/aiService'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  type?: 'code' | 'text' | 'workflow'
}

// Enhanced agent configurations for VibeDev
const VIBE_AGENTS = {
  'bmad-orchestrator': {
    name: 'Vibe Orchestrator',
    description: 'AI Project Coordinator',
    icon: '🎯',
    color: 'from-blue-500 to-purple-600',
    specialty: 'Project coordination and workflow optimization'
  },
  '1': {
    name: 'Vibe Analyst',
    description: 'Requirements & Strategy',
    icon: '📊',
    color: 'from-green-500 to-emerald-600',
    specialty: 'Business analysis and project planning'
  },
  '2': {
    name: 'Vibe Architect',
    description: 'System Design',
    icon: '🏗️',
    color: 'from-orange-500 to-red-600',
    specialty: 'Technical architecture and system design'
  },
  '3': {
    name: 'Vibe Developer',
    description: 'Code Generation',
    icon: '👨‍💻',
    color: 'from-purple-500 to-pink-600',
    specialty: 'Full-stack development and coding'
  },
  '4': {
    name: 'Vibe QA',
    description: 'Quality Assurance',
    icon: '🔍',
    color: 'from-red-500 to-rose-600',
    specialty: 'Testing and quality validation'
  },
  '5': {
    name: 'Vibe Scrum',
    description: 'Agile Management',
    icon: '📋',
    color: 'from-blue-500 to-cyan-600',
    specialty: 'Sprint planning and team coordination'
  }
}

function VibeChatContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const template = searchParams?.get('template') || 'VibeDev Project'
  const project = searchParams?.get('project') || 'New Project'
  const agentId = searchParams?.get('agent') || 'bmad-orchestrator'
  const initialPrompt = searchParams?.get('prompt')
  
  const currentAgent = VIBE_AGENTS[agentId as keyof typeof VIBE_AGENTS] || VIBE_AGENTS['bmad-orchestrator']
  
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)
  const [showAgentSelector, setShowAgentSelector] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

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
                   settings.apiKeys?.gemini?.trim() ||
                   settings.apiKeys?.groq?.trim())
        } catch (error) {
          return false
        }
      }
      return false
    }
    
    setHasApiKey(checkApiKey())

    // Initialize with enhanced agent greeting
    const greeting: Message = {
      id: '1',
      role: 'assistant',
      content: `🚀 Welcome to **VibeDev**! I'm ${currentAgent.name}, your ${currentAgent.description.toLowerCase()}.

I specialize in: *${currentAgent.specialty}*

I'm here to help you build amazing software with AI-powered assistance. Whether you need:
• **Code generation** and optimization
• **Project planning** and architecture
• **Workflow automation** and team coordination
• **Quality assurance** and testing strategies

What would you like to work on today? Let's start vibing! ✨`,
      timestamp: new Date().toISOString(),
      type: 'text'
    }
    setMessages([greeting])
  }, [agentId, template, currentAgent])

  // Separate effect for initial prompt to avoid dependency issues
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() && messages.length > 0) {
      setTimeout(() => {
        // Send the initial prompt
        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: initialPrompt,
          timestamp: new Date().toISOString(),
          type: 'text'
        }

        setMessages(prev => [...prev, userMessage])
        setIsLoading(true)

        // Send to AI service
        const sendToAI = async () => {
          try {
            const contextualMessage = `VibeDev Project: "${template}" (ID: ${project})
Agent Role: ${currentAgent.name} - ${currentAgent.specialty}
User Request: ${initialPrompt}

As a VibeDev AI agent, provide comprehensive, actionable guidance with:
1. Clear next steps and recommendations
2. Code examples when relevant
3. Best practices and optimization tips
4. Integration with modern development workflows

Focus on practical, implementable solutions for professional development teams.`

            const aiResponse = await aiService.chatWithAgent(
              agentId,
              contextualMessage,
              []
            )

            const aiMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: aiResponse || `I apologize, but I encountered an issue processing your request. As ${currentAgent.name}, I'm still here to help with your ${template} project! Please try asking again or let me know how else I can assist you with development workflows.`,
              timestamp: new Date().toISOString(),
              type: aiResponse?.includes('```') ? 'code' : 'text'
            }
            
            setMessages(prev => [...prev, aiMessage])
          } catch (error) {
            console.error('Error getting AI response:', error)
            
            const errorMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: `🚧 I encountered a technical issue, but I'm still here to help with your ${template} project! 

As ${currentAgent.name}, I can assist you with:
• ${currentAgent.specialty}
• Code examples and best practices
• Project planning and optimization
• Development workflow recommendations

Please try your request again, or let me know how else I can help! 💪`,
              timestamp: new Date().toISOString(),
              type: 'text'
            }
            setMessages(prev => [...prev, errorMessage])
          } finally {
            setIsLoading(false)
          }
        }

        sendToAI()
      }, 1000)
    }
  }, [initialPrompt, messages.length, template, project, currentAgent, agentId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSendMessage = async (e: React.FormEvent | null, customMessage?: string) => {
    if (e) e.preventDefault()
    const messageToSend = customMessage || message.trim()
    if (!messageToSend || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageToSend,
      timestamp: new Date().toISOString(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsLoading(true)

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const contextualMessage = `VibeDev Project: "${template}" (ID: ${project})
Agent Role: ${currentAgent.name} - ${currentAgent.specialty}
User Request: ${messageToSend}

As a VibeDev AI agent, provide comprehensive, actionable guidance with:
1. Clear next steps and recommendations
2. Code examples when relevant
3. Best practices and optimization tips
4. Integration with modern development workflows

Focus on practical, implementable solutions for professional development teams.`

      const aiResponse = await aiService.chatWithAgent(
        agentId,
        contextualMessage,
        conversationHistory
      )

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse || `I apologize, but I encountered an issue processing your request. As ${currentAgent.name}, I'm still here to help with your ${template} project! Please try asking again or let me know how else I can assist you with development workflows.`,
        timestamp: new Date().toISOString(),
        type: aiResponse?.includes('```') ? 'code' : 'text'
      }
      
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `🚧 I encountered a technical issue, but I'm still here to help with your ${template} project! 

As ${currentAgent.name}, I can assist you with:
• ${currentAgent.specialty}
• Code examples and best practices
• Project planning and optimization
• Development workflow recommendations

Please try your request again, or let me know how else I can help! 💪`,
        timestamp: new Date().toISOString(),
        type: 'text'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAgentSwitch = (newAgentId: string) => {
    router.push(`/chat?agent=${newAgentId}&template=${encodeURIComponent(template)}&project=${encodeURIComponent(project)}`)
    setShowAgentSelector(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e as any)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex flex-col">
      {/* Enhanced Header */}
      <div className="border-b border-gray-800 bg-black/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors group"
                aria-label="Back to VibeDev home"
              >
                <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-white" />
              </Link>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">VibeDev</h1>
                  <p className="text-xs text-gray-400">Vibe Coding Session</p>
                </div>
              </div>
              
              <div className="h-6 w-px bg-gray-700" />
              
              <div 
                className="flex items-center space-x-3 cursor-pointer p-3 hover:bg-gray-800/30 rounded-lg transition-colors"
                onClick={() => setShowAgentSelector(!showAgentSelector)}
              >
                <div className={`p-2 bg-gradient-to-r ${currentAgent.color} rounded-lg text-base`}>
                  {currentAgent.icon}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="font-semibold text-white">{currentAgent.name}</h2>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-400">{currentAgent.description}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                hasApiKey 
                  ? 'bg-green-900/50 text-green-300 border border-green-700/50' 
                  : 'bg-amber-900/50 text-amber-300 border border-amber-700/50'
              }`}>
                {hasApiKey ? '🚀 AI Ready' : '✨ Demo Mode'}
              </div>
              
              <Link 
                href="/dashboard"
                className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors group"
              >
                <Settings className="h-5 w-5 text-gray-400 group-hover:text-white" />
              </Link>
            </div>
          </div>

          {/* Agent Selector Dropdown */}
          {showAgentSelector && (
            <div className="absolute top-full left-4 right-4 max-w-md mt-2 bg-gray-900/95 border border-gray-700/50 rounded-xl shadow-2xl backdrop-blur-xl z-20">
              <div className="p-3">
                <h3 className="text-sm font-medium text-white mb-3 px-2">Switch Vibe Agent</h3>
                <div className="space-y-1">
                  {Object.entries(VIBE_AGENTS).map(([id, agent]) => (
                    <div
                      key={id}
                      onClick={() => handleAgentSwitch(id)}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        id === agentId 
                          ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' 
                          : 'hover:bg-gray-800/50 text-gray-300 hover:text-white'
                      }`}
                    >
                      <div className={`p-2 bg-gradient-to-r ${agent.color} rounded-lg text-sm`}>
                        {agent.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{agent.name}</div>
                        <div className="text-xs opacity-75">{agent.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Messages */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-4 max-w-[85%] ${
                msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                {/* Enhanced Avatar */}
                <div className={`flex-shrink-0 ${
                  msg.role === 'user' 
                    ? 'w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center'
                    : `p-2 bg-gradient-to-r ${currentAgent.color} rounded-xl shadow-lg`
                }`}>
                  {msg.role === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <span className="text-sm">{currentAgent.icon}</span>
                  )}
                </div>
                
                {/* Enhanced Message */}
                <div className={`p-4 rounded-2xl shadow-lg ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md'
                    : 'bg-gray-900/80 border border-gray-700/50 rounded-bl-md backdrop-blur-sm'
                }`}>
                  <div className={`text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user' ? 'text-white' : 'text-gray-100'
                  }`}>
                    {msg.content.split('```').map((part, index) => {
                      if (index % 2 === 1) {
                        // Code block
                        return (
                          <div key={index} className="my-3 p-3 bg-black/50 rounded-lg border border-gray-600/30 font-mono text-sm overflow-x-auto">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Code className="h-3 w-3 text-green-400" />
                                <span className="text-green-400 text-xs">Code</span>
                              </div>
                            </div>
                            <pre className="text-gray-300">{part}</pre>
                          </div>
                        )
                      }
                      return <span key={index}>{part}</span>
                    })}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-600/30">
                    <span className="text-xs opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center space-x-1 text-xs opacity-70">
                        <Brain className="h-3 w-3" />
                        <span>{currentAgent.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Enhanced Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-4 max-w-[85%]">
                <div className={`p-2 bg-gradient-to-r ${currentAgent.color} rounded-xl shadow-lg animate-pulse`}>
                  <span className="text-sm">{currentAgent.icon}</span>
                </div>
                <div className="bg-gray-900/80 border border-gray-700/50 rounded-2xl rounded-bl-md shadow-lg backdrop-blur-sm p-4">
                  <div className="flex items-center space-x-3">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                    <span className="text-sm text-gray-300">
                      {currentAgent.name} is thinking...
                    </span>
                  </div>
                  <div className="flex space-x-1 mt-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Enhanced Input */}
      <div className="border-t border-gray-800 bg-black/95 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${currentAgent.name}... (Shift+Enter for new line)`}
                disabled={isLoading}
                rows={1}
                className="w-full resize-none border border-gray-600/50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-800/50 text-white placeholder-gray-400 disabled:bg-gray-900/50 disabled:text-gray-500 backdrop-blur-sm"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                <Sparkles className="h-3 w-3 inline mr-1" />
                Vibe Mode
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || !message.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 hover:shadow-xl"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>
          
          {!hasApiKey && (
            <div className="mt-3 text-center">
              <p className="text-xs text-amber-300">
                🚀 Running in demo mode. 
                <Link 
                  href="/dashboard/settings?tab=api" 
                  className="underline hover:no-underline ml-1 text-amber-200 font-medium"
                >
                  Add API keys
                </Link> for full AI capabilities.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VibeChatPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
          <div className="text-center">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4 inline-block">
              <Zap className="h-8 w-8 text-white animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Loading VibeDev</h3>
            <p className="text-gray-400">Initializing your AI-powered development workspace...</p>
          </div>
        </div>
      }
    >
      <VibeChatContent />
    </Suspense>
  )
}