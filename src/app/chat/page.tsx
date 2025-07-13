'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { 
  Send, 
  Bot, 
  User, 
  Loader2,
  Key,
  MessageSquare,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { aiService } from '../../lib/ai/aiService'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

function DirectChatContent() {
  const searchParams = useSearchParams()
  const template = searchParams?.get('template') || 'Custom Project'
  const project = searchParams?.get('project') || 'New Project'
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm the BMad Orchestra, your AI project coordinator. I'm ready to help you build your "${template}" project. 

I can assist you with:
• 📋 Project planning and requirements analysis
• 🏗️ Technical architecture design  
• 👨‍💻 Development coordination
• ✅ Quality assurance planning
• 📊 Team organization and workflows

What would you like to work on today?`,
      timestamp: new Date().toISOString()
    }
  ])
  
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)
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
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString()
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

      // Create contextual message for better responses
      const contextualMessage = `Project: "${template}" (Project ID: ${project})
User Request: ${userMessage.content}

Please provide helpful, actionable guidance for this ${template} project. Be specific and practical in your recommendations.`

      console.log('Sending message to AI service:', {
        template,
        project,
        messageLength: contextualMessage.length,
        hasApiKey
      })

      const aiResponse = await aiService.chatWithAgent(
        'bmad-orchestrator',
        contextualMessage,
        conversationHistory
      )

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse || `I understand you want to work on "${userMessage.content}" for your ${template} project. Here's how I can help:

🎯 **Immediate Next Steps:**
1. **Requirements Clarification**: Let's define exactly what you need
2. **Technical Planning**: Choose the right architecture and tools
3. **Implementation Strategy**: Break down the work into manageable phases
4. **Quality Assurance**: Ensure everything works perfectly

Would you like me to dive deeper into any of these areas? I can also connect you with specific BMad specialists if you need detailed expertise in:
• Business Analysis (Mary)
• System Architecture (Winston) 
• Development (James)
• Quality Assurance (Quinn)
• Project Management (Bob)

What's your biggest priority right now?`,
        timestamp: new Date().toISOString()
      }
      
      console.log('AI response received:', {
        responseLength: aiMessage.content.length,
        timestamp: aiMessage.timestamp
      })
      
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I encountered an issue processing your request, but I'm still here to help with your ${template} project!

Here's what I can help you with right now:

🚀 **Project Kickoff:**
• Define project scope and requirements
• Choose technology stack and architecture
• Plan development phases and timelines

💡 **Technical Guidance:**
• Best practices for ${template} development
• Architecture recommendations
• Integration strategies

📈 **Project Management:**
• Task breakdown and prioritization
• Team coordination and workflows
• Quality assurance planning

Please try asking again, or let me know which area you'd like to focus on first!`,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header - Mobile Optimized */}
      <div className="border-b border-border glass-nav p-4 safe-area-pt animate-slide-up">
        <div className="max-w-4xl mx-auto">
          {/* Mobile-first layout */}
          <div className="flex items-center justify-between mb-3 sm:mb-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg interactive-glow animate-pulse-glow">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="responsive-text-lg font-semibold text-white">
                  BMad Chat
                </h1>
                <p className="responsive-text-xs text-slate-400 truncate max-w-[200px] sm:max-w-none">
                  {template} • {project}
                </p>
              </div>
            </div>
            
            {/* Status indicator - always visible */}
            <Badge 
              variant={hasApiKey ? "default" : "destructive"}
              className="px-2 py-1 responsive-text-xs shrink-0"
              aria-label={hasApiKey ? 'AI service connected' : 'Running in simulation mode'}
            >
              {hasApiKey ? 'AI' : 'Demo'}
            </Badge>
          </div>
          
          {/* Secondary actions - mobile responsive */}
          <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4">
            <div className="text-xs text-slate-500 sm:hidden">
              {hasApiKey ? 'AI Connected' : 'Simulation Mode'}
            </div>
            <Link 
              href="/dashboard/workspace" 
              className="text-blue-400 hover:text-blue-300 responsive-text-xs flex items-center touch-target"
              aria-label="Open full workspace interface"
            >
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
              <span className="hidden sm:inline">Full Workspace</span>
              <span className="sm:hidden">Workspace</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Chat Container - Mobile Optimized */}
      <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] sm:h-[calc(100vh-140px)] flex flex-col">
        {/* Enhanced Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`flex items-start space-x-2 sm:space-x-3 ${
                msg.role === 'user' ? 'max-w-[85%] sm:max-w-[80%]' : 'max-w-[90%] sm:max-w-[80%]'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex-shrink-0 mt-1 interactive-lift animate-bounce-gentle">
                    <Bot className="h-4 w-4 text-white" aria-hidden="true" />
                  </div>
                )}
                <div
                  className={`p-3 sm:p-4 rounded-2xl transition-all duration-300 interactive-lift ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md shadow-lg'
                      : 'glass-card-premium text-slate-100 rounded-bl-md'
                  }`}
                  role={msg.role === 'assistant' ? 'log' : undefined}
                  aria-label={msg.role === 'assistant' ? 'Assistant message' : 'Your message'}
                >
                  <p className="responsive-text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                  <span className="text-xs opacity-70 mt-2 block" aria-label={`Sent at ${new Date(msg.timestamp).toLocaleTimeString()}`}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 interactive-glow">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" aria-hidden="true" />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Enhanced Loading indicator - Accessible */}
          {isLoading && (
            <div className="flex justify-start animate-fade-in" role="status" aria-live="polite">
              <div className="flex items-start space-x-2 sm:space-x-3 max-w-[90%] sm:max-w-[80%]">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex-shrink-0 animate-pulse-glow">
                  <Bot className="h-4 w-4 text-white animate-bounce-gentle" aria-hidden="true" />
                </div>
                <div className="glass-card-premium p-3 sm:p-4 rounded-2xl rounded-bl-md animate-shimmer">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-400" aria-hidden="true" />
                    <span className="responsive-text-sm text-slate-300">
                      BMad is thinking...
                    </span>
                  </div>
                  <div className="flex space-x-1 mt-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="sr-only">Assistant is processing your message</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input - Mobile Optimized */}
        <div className="p-4 sm:p-6 border-t border-slate-700 safe-area-pb">
          <div className="space-y-3">
            {!hasApiKey && (
              <div className="text-center py-2">
                <div className="max-w-md mx-auto">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="p-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                      <Key className="h-4 w-4 text-white" />
                    </div>
                    <span className="responsive-text-xs text-slate-400 text-center">
                      <span className="hidden sm:inline">Using simulation mode - for full AI, configure API keys in settings</span>
                      <span className="sm:hidden">Demo mode - add API keys for full AI</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSendMessage} className="flex space-x-2 sm:space-x-3">
              <div className="flex-1 relative">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Ask about your ${template} project...`}
                  disabled={isLoading}
                  className="w-full glass-card border-slate-600/50 text-white placeholder-slate-400 rounded-xl px-3 sm:px-4 py-3 min-h-[48px] responsive-text-sm focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                  aria-label="Type your message about the project"
                />
                {message.trim() && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
              <Button 
                type="submit" 
                disabled={isLoading || !message.trim()}
                className="gradient-button-premium px-4 sm:px-6 py-3 rounded-xl btn-accessible shrink-0 interactive-lift relative overflow-hidden"
                aria-label={isLoading ? 'Sending message...' : 'Send message'}
              >
                <div className="relative z-10 flex items-center">
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Send className="h-5 w-5" aria-hidden="true" />
                  )}
                </div>
                <span className="sr-only">
                  {isLoading ? 'Sending your message' : 'Send message'}
                </span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DirectChatPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Loading BMad Chat</h3>
            <p className="text-slate-400">Setting up your AI workspace...</p>
          </div>
        </div>
      }
    >
      <DirectChatContent />
    </Suspense>
  )
}