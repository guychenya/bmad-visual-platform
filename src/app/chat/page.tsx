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
      {/* Simple Header */}
      <div className="border-b border-border bg-slate-900/50 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">
                BMad Chat
              </h1>
              <p className="text-sm text-slate-400">
                {template} • Project: {project}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge 
              variant={hasApiKey ? "default" : "destructive"}
              className="px-3 py-1"
            >
              {hasApiKey ? 'AI Connected' : 'Simulation Mode'}
            </Badge>
            
            <Link href="/dashboard/workspace" className="text-blue-400 hover:text-blue-300 text-sm">
              <ExternalLink className="h-4 w-4 inline mr-1" />
              Full Workspace
            </Link>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-start space-x-3 max-w-[80%]">
                {msg.role === 'assistant' && (
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex-shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-slate-800/50 border border-slate-700 text-slate-100 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-[80%]">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl rounded-bl-md">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                    <span className="text-sm text-slate-300">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-6 border-t border-slate-700">
          <div className="space-y-3">
            {!hasApiKey && (
              <div className="text-center py-2">
                <div className="max-w-md mx-auto">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="p-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                      <Key className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm text-slate-400">
                      Using simulation mode - for full AI, configure API keys in settings
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Ask about your ${template} project...`}
                disabled={isLoading}
                className="flex-1 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 rounded-xl px-4 py-3"
              />
              <Button 
                type="submit" 
                disabled={isLoading || !message.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-6 py-3 rounded-xl"
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