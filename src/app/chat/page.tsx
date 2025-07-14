'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '../../components/ui/button'
import { 
  Send, 
  Bot, 
  User, 
  Loader2,
  Settings,
  Home,
  Sparkles,
  ArrowLeft,
  ChevronDown
} from 'lucide-react'
import Link from 'next/link'
import { aiService } from '../../lib/ai/aiService'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

// Agent configurations
const AGENTS = {
  'bmad-orchestrator': {
    name: 'BMad Orchestra',
    description: 'Master coordinator',
    icon: '🎯',
    color: 'from-blue-500 to-purple-600',
    bgColor: 'bg-blue-50'
  },
  '1': {
    name: 'Mary',
    description: 'Business Analyst',
    icon: '📊',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50'
  },
  '2': {
    name: 'Winston',
    description: 'System Architect',
    icon: '🏗️',
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-50'
  },
  '3': {
    name: 'James',
    description: 'Developer',
    icon: '👨‍💻',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50'
  },
  '4': {
    name: 'Quinn',
    description: 'QA Engineer',
    icon: '🔍',
    color: 'from-red-500 to-rose-600',
    bgColor: 'bg-red-50'
  },
  '5': {
    name: 'Bob',
    description: 'Scrum Master',
    icon: '📋',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50'
  }
}

function ChatContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const template = searchParams?.get('template') || 'Custom Project'
  const project = searchParams?.get('project') || 'New Project'
  const agentId = searchParams?.get('agent') || 'bmad-orchestrator'
  const initialPrompt = searchParams?.get('prompt')
  
  const currentAgent = AGENTS[agentId as keyof typeof AGENTS] || AGENTS['bmad-orchestrator']
  
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

    // Initialize with agent greeting
    const greeting: Message = {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm ${currentAgent.name}, your ${currentAgent.description.toLowerCase()}. I'm here to help you with your "${template}" project.

What would you like to work on today?`,
      timestamp: new Date().toISOString()
    }
    setMessages([greeting])

    // If there's an initial prompt, send it
    if (initialPrompt && initialPrompt.trim()) {
      setTimeout(() => {
        setMessage(initialPrompt)
        // Auto-send the initial prompt after a delay
        setTimeout(() => {
          const sendInitialMessage = async () => {
            const userMessage: Message = {
              id: Date.now().toString(),
              role: 'user',
              content: initialPrompt,
              timestamp: new Date().toISOString()
            }

            setMessages(prev => [...prev, userMessage])
            setMessage('')
            setIsLoading(true)

            try {
              const conversationHistory = [greeting].map(msg => ({
                role: msg.role,
                content: msg.content
              }))

              const contextualMessage = `Project: "${template}" (Project ID: ${project})
User Request: ${initialPrompt}

Please provide helpful, actionable guidance for this ${template} project. Be specific and practical in your recommendations.`

              const aiResponse = await aiService.chatWithAgent(
                agentId,
                contextualMessage,
                conversationHistory
              )

              const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiResponse || 'I apologize, but I encountered an issue processing your request. Please try again.',
                timestamp: new Date().toISOString()
              }
              
              setMessages(prev => [...prev, aiMessage])
            } catch (error) {
              console.error('Error getting AI response:', error)
              
              const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `I encountered an issue processing your request, but I'm still here to help with your ${template} project! Please try asking again or let me know how else I can assist you.`,
                timestamp: new Date().toISOString()
              }
              setMessages(prev => [...prev, errorMessage])
            } finally {
              setIsLoading(false)
            }
          }
          sendInitialMessage()
        }, 100)
      }, 1000)
    }
  }, [agentId, template, currentAgent, initialPrompt, project])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    // Auto-focus input when component loads
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
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsLoading(true)

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const contextualMessage = `Project: "${template}" (Project ID: ${project})
User Request: ${messageToSend}

Please provide helpful, actionable guidance for this ${template} project. Be specific and practical in your recommendations.`

      const aiResponse = await aiService.chatWithAgent(
        agentId,
        contextualMessage,
        conversationHistory
      )

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse || 'I apologize, but I encountered an issue processing your request. Please try again.',
        timestamp: new Date().toISOString()
      }
      
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I encountered an issue processing your request, but I'm still here to help with your ${template} project! Please try asking again or let me know how else I can assist you.`,
        timestamp: new Date().toISOString()
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
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex flex-col">
      {/* Header */}
      <div className="border-b border-purple-700/50 bg-purple-900/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link 
                href="/"
                className="p-2 hover:bg-purple-800/50 rounded-lg transition-colors"
                aria-label="Back to home"
              >
                <ArrowLeft className="h-5 w-5 text-purple-200" />
              </Link>
              
              <div 
                className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-purple-800/30 rounded-lg transition-colors"
                onClick={() => setShowAgentSelector(!showAgentSelector)}
              >
                <div className={`p-2 bg-gradient-to-r ${currentAgent.color} rounded-lg text-lg`}>
                  {currentAgent.icon}
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <h1 className="font-semibold text-white">{currentAgent.name}</h1>
                    <ChevronDown className="h-4 w-4 text-purple-300" />
                  </div>
                  <p className="text-sm text-purple-200">{currentAgent.description}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                hasApiKey 
                  ? 'bg-green-900/50 text-green-200 border border-green-700/50' 
                  : 'bg-yellow-900/50 text-yellow-200 border border-yellow-700/50'
              }`}>
                {hasApiKey ? 'AI Ready' : 'Demo Mode'}
              </div>
            </div>
          </div>

          {/* Agent Selector Dropdown */}
          {showAgentSelector && (
            <div className="absolute top-full left-4 right-4 max-w-md mt-2 bg-purple-900/95 border border-purple-700/50 rounded-xl shadow-lg backdrop-blur-sm z-20">
              <div className="p-2">
                <h3 className="text-sm font-medium text-white mb-2 px-2">Switch Agent</h3>
                {Object.entries(AGENTS).map(([id, agent]) => (
                  <div
                    key={id}
                    onClick={() => handleAgentSwitch(id)}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      id === agentId 
                        ? 'bg-purple-700/50 text-purple-200' 
                        : 'hover:bg-purple-800/30'
                    }`}
                  >
                    <div className={`p-2 bg-gradient-to-r ${agent.color} rounded-lg text-sm`}>
                      {agent.icon}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-white">{agent.name}</div>
                      <div className="text-xs text-purple-300">{agent.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[80%] ${
                msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 ${
                  msg.role === 'user' 
                    ? 'w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center'
                    : `p-2 bg-gradient-to-r ${currentAgent.color} rounded-lg`
                }`}>
                  {msg.role === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <span className="text-sm">{currentAgent.icon}</span>
                  )}
                </div>
                
                {/* Message */}
                <div className={`p-4 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white rounded-br-md'
                    : 'bg-purple-900/50 border border-purple-700/50 rounded-bl-md shadow-sm backdrop-blur-sm'
                }`}>
                  <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user' ? 'text-white' : 'text-gray-100'
                  }`}>
                    {msg.content}
                  </p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-[80%]">
                <div className={`p-2 bg-gradient-to-r ${currentAgent.color} rounded-lg`}>
                  <span className="text-sm">{currentAgent.icon}</span>
                </div>
                <div className="bg-purple-900/50 border border-purple-700/50 rounded-2xl rounded-bl-md shadow-sm backdrop-blur-sm p-4">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-300" />
                    <span className="text-sm text-gray-200">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-purple-700/50 bg-purple-900/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${currentAgent.name}...`}
                disabled={isLoading}
                rows={1}
                className="w-full resize-none border border-purple-600/50 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-purple-800/30 text-white placeholder-purple-300 disabled:bg-purple-900/50 disabled:text-purple-400 backdrop-blur-sm"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || !message.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl shadow-sm transition-all duration-200 disabled:opacity-50"
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
              <p className="text-xs text-yellow-200">
                Running in demo mode. 
                <Link 
                  href="/dashboard/settings?tab=api" 
                  className="underline hover:no-underline ml-1 text-yellow-100"
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

export default function ChatPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-white mb-2">Loading BMad Chat</h3>
            <p className="text-purple-200">Setting up your AI workspace...</p>
          </div>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  )
}