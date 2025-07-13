'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Badge } from '../../../../components/ui/badge'
import { LoadingSpinner } from '../../../../components/ui/loading-spinner'
import { 
  Send, 
  Bot, 
  User, 
  Play,
  Settings,
  Key,
  ExternalLink,
  MessageSquare,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { routes } from '../../../../lib/routes'
import { aiService } from '../../../../lib/ai/aiService'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

function SimpleWorkspaceContent() {
  const searchParams = useSearchParams()
  const templateId = searchParams?.get('template') || 'API Backend'
  const projectId = searchParams?.get('project') || '1752417803205'
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm the BMad Orchestra, your AI project coordinator. I'm ready to help you build your ${templateId} project (ID: ${projectId}). I can help with:

• Project planning and requirements analysis
• Technical architecture design  
• Development coordination
• Quality assurance planning
• Team organization and workflows

What aspect of your ${templateId} project would you like to work on first?`,
      timestamp: new Date().toISOString()
    }
  ])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)

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

      // Use the BMad Orchestra agent for coordination
      const contextualMessage = `Project: ${templateId} (ID: ${projectId})
User Request: ${userMessage.content}

Please provide helpful, actionable guidance for this ${templateId} project.`

      console.log('Sending message to AI service:', {
        agentId: 'bmad-orchestrator',
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
        content: aiResponse || `I understand you want to work on "${userMessage.content}" for your ${templateId} project. Let me help you with that!

As the BMad Orchestra, I recommend we start by breaking this down into phases:

1. **Analysis Phase**: Let's clarify your requirements and goals
2. **Architecture Phase**: Design the technical structure  
3. **Development Phase**: Implement the solution
4. **Quality Assurance**: Test and validate everything

Would you like me to connect you with specific BMad agents for any of these phases, or shall we continue discussing your specific needs?`,
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
        content: `I encountered an issue processing your request, but I'm still here to help! For your ${templateId} project, I can assist with:

• **Requirements Analysis**: What features do you need?
• **Technical Architecture**: How should we structure the system?
• **Development Planning**: What's the implementation roadmap?
• **Quality Assurance**: How do we ensure it works perfectly?

Please try asking again, or let me know which aspect you'd like to focus on first.`,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-border glass-nav p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="responsive-text-xl font-semibold text-white">
                {templateId} Project
              </h1>
              <p className="text-sm text-slate-400">
                Simple Workspace - Project ID: {projectId}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge 
              variant={hasApiKey ? "default" : "destructive"}
              className="px-3 py-1"
            >
              {hasApiKey ? 'API Connected' : 'API Not Configured'}
            </Badge>
            
            <Button variant="outline" size="sm" className="glass-button">
              <ExternalLink className="h-4 w-4 mr-2" />
              Full Workspace
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
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
                      : 'glass-card text-foreground rounded-bl-md'
                  }`}
                >
                  <p className="responsive-text-sm leading-relaxed">{msg.content}</p>
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
                <div className="glass-card p-4 rounded-2xl rounded-bl-md">
                  <LoadingSpinner size="sm" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border glass-nav">
          <div className="space-y-3">
            {!hasApiKey && (
              <div className="text-center py-2">
                <div className="max-w-md mx-auto">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="p-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                      <Key className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm text-slate-400">
                      Using simulation mode - 
                      <Link href={routes.dashboard.settings + '?tab=api'} className="text-blue-400 hover:text-blue-300 ml-1">
                        add API key for full AI
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Ask about your ${templateId} project...`}
                disabled={isLoading}
                className="flex-1 glass-input border-input text-foreground placeholder-muted-foreground rounded-xl px-4 py-3"
              />
              <Button 
                type="submit" 
                disabled={isLoading || !message.trim()}
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
        </div>
      </div>
      
      {/* Quick Info Panel */}
      <div className="border-t border-border p-4 bg-slate-900/50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">Template:</span>
            <Badge variant="outline">{templateId}</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">Project:</span>
            <Badge variant="outline">{projectId}</Badge>
          </div>
          <Link href="/dashboard/workspace" className="text-blue-400 hover:text-blue-300 transition-colors">
            Switch to Full Workspace →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SimpleWorkspacePage() {
  return (
    <Suspense 
      fallback={
        <div className="h-full flex items-center justify-center">
          <Card className="glass-card p-8 text-center">
            <CardContent>
              <LoadingSpinner size="lg" className="mx-auto mb-4 text-slate-400" />
              <h3 className="responsive-text-xl font-semibold text-white mb-2">Loading Simple Workspace</h3>
              <p className="text-slate-400">Setting up your optimized workspace...</p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <SimpleWorkspaceContent />
    </Suspense>
  )
}