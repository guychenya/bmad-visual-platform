'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Send, Loader2, ArrowLeft, Brain, Code, TestTube, Users, User, Palette, Settings, Key, ExternalLink, Plus, MessageSquare, ChevronLeft, Menu, History, MoreHorizontal, Crown } from 'lucide-react'
import Link from 'next/link'
import { routes } from '../../lib/routes'
import { useRouter } from 'next/navigation'
import { TypingIndicator } from './TypingIndicator'
import { aiService } from '../../lib/ai/aiService'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface AgentChatProps {
  agentId: string
}

interface Conversation {
  id: string
  title: string
  agentId: string
  agentName: string
  lastMessage: string
  timestamp: string
  messages: Message[]
}

const BUILT_IN_AGENTS = {
  'bmad-orchestrator': {
    id: 'bmad-orchestrator',
    name: 'BMad Orchestra',
    title: 'Master Project Coordinator',
    description: 'I coordinate the entire BMad methodology and can hand off tasks to specialized agents.',
    icon: Crown,
    color: 'from-yellow-500 to-orange-500',
    personality: 'Coordinating and strategic',
    greeting: "Welcome! I'm the BMad Orchestra, your master project coordinator. I oversee the entire BMad methodology and can connect you with any of our specialized agents. Tell me about your project, and I'll guide you through the best approach and coordinate with the right agents for your needs.",
    expertise: ['Project Coordination', 'BMad Methodology', 'Agent Management', 'Strategic Oversight', 'Workflow Orchestration']
  },
  '1': {
    id: '1',
    name: 'Analyst',
    title: 'Strategic Planning Expert',
    description: 'I help with project planning, requirements analysis, and strategic insights.',
    icon: Brain,
    color: 'from-blue-500 to-cyan-500',
    personality: 'Analytical and thorough',
    greeting: "Hello! I'm your Analyst agent. I specialize in strategic planning and requirements analysis. How can I help you plan your next project?",
    expertise: ['Project Planning', 'Requirements Analysis', 'Strategic Insights', 'Market Research']
  },
  '2': {
    id: '2',
    name: 'Architect',
    title: 'System Architecture Specialist',
    description: 'I design system architecture and technical solutions.',
    icon: Code,
    color: 'from-green-500 to-emerald-500',
    personality: 'Structured and visionary',
    greeting: "Greetings! I'm your Architect agent. I create scalable system designs and technical architectures. What system are we building today?",
    expertise: ['System Design', 'Architecture Patterns', 'Technical Strategy', 'Scalability']
  },
  '3': {
    id: '3',
    name: 'Developer',
    title: 'Full-Stack Implementation Expert',
    description: 'I handle development and implementation tasks.',
    icon: Code,
    color: 'from-purple-500 to-pink-500',
    personality: 'Pragmatic and efficient',
    greeting: "Hey there! I'm your Developer agent. I love turning ideas into working code. What are we building?",
    expertise: ['Frontend Development', 'Backend Development', 'DevOps', 'Code Quality']
  },
  '4': {
    id: '4',
    name: 'QA Engineer',
    title: 'Quality Assurance Specialist',
    description: 'I ensure quality through testing and validation.',
    icon: TestTube,
    color: 'from-yellow-500 to-orange-500',
    personality: 'Detail-oriented and methodical',
    greeting: "Hello! I'm your QA Engineer. I ensure everything works perfectly through comprehensive testing. What needs quality assurance?",
    expertise: ['Test Automation', 'Quality Assurance', 'Bug Detection', 'Performance Testing']
  },
  '5': {
    id: '5',
    name: 'Scrum Master',
    title: 'Agile Project Management',
    description: 'I manage projects using agile methodologies.',
    icon: Users,
    color: 'from-red-500 to-pink-500',
    personality: 'Organized and collaborative',
    greeting: "Hi! I'm your Scrum Master. I help teams work efficiently using agile practices. How can I help organize your project?",
    expertise: ['Agile Methodology', 'Sprint Planning', 'Team Coordination', 'Process Optimization']
  },
  '6': {
    id: '6',
    name: 'UX Designer',
    title: 'User Experience Expert',
    description: 'I create beautiful and intuitive user experiences.',
    icon: Palette,
    color: 'from-indigo-500 to-purple-500',
    personality: 'Creative and user-focused',
    greeting: "Hello! I'm your UX Designer. I create beautiful, user-centered designs that people love. What experience are we crafting?",
    expertise: ['User Research', 'UI/UX Design', 'Prototyping', 'User Testing']
  },
  '7': {
    id: '7',
    name: 'Product Owner',
    title: 'Product Strategy Expert',
    description: 'I define product vision and prioritize features.',
    icon: User,
    color: 'from-teal-500 to-blue-500',
    personality: 'Strategic and customer-oriented',
    greeting: "Hi there! I'm your Product Owner. I help define product vision and prioritize features based on user needs. What product are we building?",
    expertise: ['Product Strategy', 'Feature Planning', 'User Stories', 'Market Analysis']
  }
}

export function AgentChat({ agentId }: AgentChatProps) {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)
  const [isCheckingApiKey, setIsCheckingApiKey] = useState(true)
  const [allAgents, setAllAgents] = useState<Record<string, any>>({})
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  
  // Load all agents (built-in + custom)
  useEffect(() => {
    const loadAllAgents = () => {
      const agents: Record<string, any> = { ...BUILT_IN_AGENTS }
      
      // Load custom agents from localStorage
      const savedCustomAgents = localStorage.getItem('viby-custom-agents')
      if (savedCustomAgents) {
        try {
          const customAgents = JSON.parse(savedCustomAgents)
          customAgents.forEach((agent: any) => {
            agents[agent.id as string] = {
              ...agent,
              title: agent.description, // Use description as title for custom agents
              greeting: `Hello! I'm ${agent.name}. ${agent.description} How can I help you today?`
            }
          })
        } catch (error) {
          console.error('Failed to load custom agents:', error)
        }
      }
      
      setAllAgents(agents)
    }

    const loadConversations = () => {
      const savedConversations = localStorage.getItem('viby-conversations')
      if (savedConversations) {
        try {
          const parsed = JSON.parse(savedConversations)
          setConversations(parsed)
        } catch (error) {
          console.error('Failed to load conversations:', error)
        }
      }
    }

    loadAllAgents()
    loadConversations()
  }, [])
  
  const agent = allAgents[agentId]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Check for API key on component mount
  useEffect(() => {
    const checkApiKey = () => {
      const savedSettings = localStorage.getItem('viby-settings')
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings)
          const hasValidApiKey = settings.apiKeys?.openai?.trim() || 
                                 settings.apiKeys?.claude?.trim() || 
                                 settings.apiKeys?.gemini?.trim()
          setHasApiKey(!!hasValidApiKey)
        } catch (error) {
          console.error('Failed to parse settings:', error)
          setHasApiKey(false)
        }
      } else {
        setHasApiKey(false)
      }
      setIsCheckingApiKey(false)
    }

    checkApiKey()
  }, [])

  useEffect(() => {
    if (agent && hasApiKey) {
      // Check for existing conversation for this agent
      const existingConversation = conversations.find(conv => conv.agentId === agentId)
      
      if (existingConversation) {
        setCurrentConversationId(existingConversation.id)
        setMessages(existingConversation.messages)
      } else {
        // Create new conversation with greeting
        const greetingMessage: Message = {
          id: `greeting-${agentId}`,
          role: 'assistant',
          content: agent.greeting,
          timestamp: new Date().toISOString()
        }
        
        const newConversation: Conversation = {
          id: `conv-${Date.now()}`,
          title: `Chat with ${agent.name}`,
          agentId: agentId,
          agentName: agent.name,
          lastMessage: agent.greeting.substring(0, 50) + '...',
          timestamp: new Date().toISOString(),
          messages: [greetingMessage]
        }
        
        setCurrentConversationId(newConversation.id)
        setMessages([greetingMessage])
        setConversations(prev => [newConversation, ...prev])
        
        // Save to localStorage
        localStorage.setItem('viby-conversations', JSON.stringify([newConversation, ...conversations]))
      }
    }
  }, [agentId, agent, hasApiKey, conversations])

  const generateAgentResponse = (userMessage: string, agent: any): string => {
    const responses = {
      analyst: [
        "Let me analyze this from a strategic perspective. Based on market trends and user needs, I recommend...",
        "That's an excellent question! From my analysis experience, here's what we should consider...",
        "I see an opportunity here. Let me break down the requirements and potential solutions...",
        "This aligns with current industry best practices. Here's my strategic recommendation..."
      ],
      architect: [
        "From an architectural standpoint, we need to consider scalability and maintainability. I suggest...",
        "That's a complex system design challenge! Let me propose a scalable architecture...",
        "I love this technical challenge! Here's how I'd architect this solution...",
        "We need to think about the system holistically. Here's my architectural approach..."
      ],
      developer: [
        "Great! I can definitely help implement that. Here's how I'd approach the development...",
        "That's a fun coding challenge! Let me walk you through the implementation...",
        "I see exactly what you need. Here's the most efficient way to build this...",
        "Perfect! I have experience with this. Here's my development approach..."
      ],
      qa: [
        "From a quality perspective, we need to ensure this meets all requirements. Here's my testing strategy...",
        "Excellent! Let me outline the testing approach and quality checkpoints...",
        "Quality is crucial here. I recommend these testing methodologies...",
        "I'll make sure this works flawlessly. Here's my comprehensive QA plan..."
      ],
      scrum: [
        "Let's organize this into manageable sprints. Here's how I'd structure the project...",
        "Great initiative! Let me help break this down into user stories and tasks...",
        "I can help coordinate this efficiently. Here's my agile approach...",
        "Perfect for an agile workflow! Let me outline the sprint plan..."
      ],
      ux: [
        "From a user experience perspective, we need to focus on usability. Here's my design approach...",
        "I love creating delightful experiences! Here's how we can make this user-friendly...",
        "User-centered design is key here. Let me propose an intuitive solution...",
        "This is exciting! Here's how we can create an amazing user experience..."
      ],
      product: [
        "From a product strategy standpoint, this aligns well with user needs. Here's my recommendation...",
        "Excellent product idea! Let me help prioritize features based on user value...",
        "I see great market potential here. Here's how we should position this product...",
        "Strategic thinking is needed here. Let me outline the product roadmap..."
      ]
    }

    const agentType = agent.name.toLowerCase().replace(' ', '').includes('analyst') ? 'analyst' :
                     agent.name.toLowerCase().includes('architect') ? 'architect' :
                     agent.name.toLowerCase().includes('developer') ? 'developer' :
                     agent.name.toLowerCase().includes('qa') ? 'qa' :
                     agent.name.toLowerCase().includes('scrum') ? 'scrum' :
                     agent.name.toLowerCase().includes('ux') ? 'ux' : 'product'

    const agentResponses = responses[agentType as keyof typeof responses] || responses.analyst
    return agentResponses[Math.floor(Math.random() * agentResponses.length)]
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading || !agent || !hasApiKey) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsTyping(true)
    setIsLoading(true)

    try {
      console.log('Sending message to AI service:', { 
        agentId, 
        messageLength: userMessage.content.length,
        hasApiKey,
        isCustomAgent: !Object.keys(BUILT_IN_AGENTS).includes(agentId)
      })
      
      // Call the AI service chat method - it will auto-detect the available provider
      const responseContent = await aiService.chatWithAgent(
        agentId,
        userMessage.content,
        messages.map(m => ({ role: m.role, content: m.content }))
      )
      
      console.log('AI service response:', { 
        responseLength: responseContent?.length,
        isEmpty: !responseContent,
        willUseFallback: !responseContent
      })
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent || generateAgentResponse(userMessage.content, agent),
        timestamp: new Date().toISOString()
      }

      const updatedMessages = [...messages, userMessage, agentMessage]
      setMessages(updatedMessages)
      
      // Update conversation in localStorage
      updateConversation(updatedMessages, userMessage.content)
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Fallback to mock response if API fails
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAgentResponse(userMessage.content, agent),
        timestamp: new Date().toISOString()
      }
      const updatedMessages = [...messages, userMessage, agentMessage]
      setMessages(updatedMessages)
      
      // Update conversation in localStorage
      updateConversation(updatedMessages, userMessage.content)
    } finally {
      setIsTyping(false)
      setIsLoading(false)
    }
  }
  
  const updateConversation = (updatedMessages: Message[], lastUserMessage: string) => {
    if (!currentConversationId) return
    
    const updatedConversations = conversations.map(conv => {
      if (conv.id === currentConversationId) {
        return {
          ...conv,
          messages: updatedMessages,
          lastMessage: lastUserMessage.substring(0, 50) + (lastUserMessage.length > 50 ? '...' : ''),
          timestamp: new Date().toISOString()
        }
      }
      return conv
    })
    
    setConversations(updatedConversations)
    localStorage.setItem('viby-conversations', JSON.stringify(updatedConversations))
  }
  
  const createNewConversation = () => {
    if (!agent || !hasApiKey) return
    
    const greetingMessage: Message = {
      id: `greeting-${Date.now()}`,
      role: 'assistant',
      content: agent.greeting,
      timestamp: new Date().toISOString()
    }
    
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title: `New Chat with ${agent.name}`,
      agentId: agentId,
      agentName: agent.name,
      lastMessage: agent.greeting.substring(0, 50) + '...',
      timestamp: new Date().toISOString(),
      messages: [greetingMessage]
    }
    
    setCurrentConversationId(newConversation.id)
    setMessages([greetingMessage])
    setConversations(prev => [newConversation, ...prev])
    
    // Save to localStorage
    localStorage.setItem('viby-conversations', JSON.stringify([newConversation, ...conversations]))
  }
  
  const loadConversation = (conversationId: string) => {
    const conversation = conversations.find(conv => conv.id === conversationId)
    if (conversation) {
      setCurrentConversationId(conversationId)
      setMessages(conversation.messages)
      
      // If switching to different agent, update URL
      if (conversation.agentId !== agentId) {
        router.push(routes.dashboard.agentDetail(conversation.agentId))
      }
    }
  }
  
  const deleteConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updatedConversations = conversations.filter(conv => conv.id !== conversationId)
    setConversations(updatedConversations)
    localStorage.setItem('viby-conversations', JSON.stringify(updatedConversations))
    
    // If deleting current conversation, start a new one
    if (conversationId === currentConversationId) {
      createNewConversation()
    }
  }

  if (!agent) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="glass-card p-8 text-center">
          <CardContent>
            <h3 className="text-xl font-semibold text-white mb-2">Agent Not Found</h3>
            <p className="text-slate-400 mb-4">The requested agent doesn&apos;t exist.</p>
            <Link href={routes.dashboard.agents}>
              <Button className="gradient-button">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Agents
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show loading state while checking API key
  if (isCheckingApiKey) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="glass-card p-8 text-center">
          <CardContent>
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-slate-400" />
            <h3 className="text-xl font-semibold text-white mb-2">Checking Configuration</h3>
            <p className="text-slate-400">Validating your AI service settings...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show API key missing message
  if (!hasApiKey) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="glass-card p-8 text-center max-w-md">
          <CardContent>
            <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl mb-6">
              <Key className="h-8 w-8 text-white mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">AI Service Not Configured</h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              To chat with AI agents, you need to configure your AI service API keys. 
              We support OpenAI, Claude, and Gemini APIs.
            </p>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Settings className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h4 className="text-blue-300 font-medium mb-2">Quick Setup:</h4>
                  <ol className="text-sm text-slate-300 space-y-1">
                    <li>1. Go to Settings → API Keys</li>
                    <li>2. Add your OpenAI, Claude, or Gemini API key</li>
                    <li>3. Save changes</li>
                    <li>4. Return here to start chatting!</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <Link href={routes.dashboard.settings + '?tab=api'}>
                <Button className="gradient-button w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure API Keys
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              
              <Link href={routes.dashboard.agents}>
                <Button variant="outline" className="glass-button w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Agents
                </Button>
              </Link>
            </div>

            <div className="mt-6 p-4 glass-card rounded-lg">
              <p className="text-xs text-slate-400 mb-2">
                <strong>Need an API key?</strong>
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  OpenAI API Keys
                </a>
                <span className="text-slate-500">•</span>
                <a 
                  href="https://console.anthropic.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Claude API Keys
                </a>
                <span className="text-slate-500">•</span>
                <a 
                  href="https://makersuite.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Gemini API Keys
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-full bg-background overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-border glass-sidebar`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 bg-gradient-to-r ${agent.color} rounded-lg`}>
                  <agent.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">{agent.name}</h2>
                  <p className="text-xs text-slate-400">{agent.title}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  hasApiKey ? 'bg-green-400' : 'bg-slate-500'
                }`}></div>
                <span className="text-xs text-slate-400">
                  {hasApiKey ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            
            <Button 
              onClick={createNewConversation}
              className="w-full gradient-button text-sm"
              disabled={!hasApiKey}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
          
          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3 px-2">
                Recent Conversations
              </h3>
              <div className="space-y-1">
                {conversations
                  .filter(conv => conv.agentId === agentId)
                  .map((conversation: Conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => loadConversation(conversation.id)}
                      className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                        conversation.id === currentConversationId
                          ? 'bg-blue-500/20 border border-blue-500/30'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <MessageSquare className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-white font-medium truncate">
                            {conversation.title}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {conversation.lastMessage}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(conversation.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => deleteConversation(conversation.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 h-6 w-6 p-0"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-700/50">
            <Link href={routes.dashboard.agents}>
              <Button variant="outline" className="w-full glass-button text-sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Agents
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-border glass-nav">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-400 hover:text-white"
            >
              {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className={`p-2 bg-gradient-to-r ${agent.color} rounded-lg`}>
                <agent.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">{agent.name}</h1>
                <p className="text-sm text-slate-400">{agent.title}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Expertise Tags */}
            <div className="hidden md:flex flex-wrap gap-2">
              {agent.expertise?.slice(0, 3).map((skill: string, idx: number) => (
                <span key={idx} className="text-xs bg-white/10 text-slate-300 px-2 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
            
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
        
        {/* Chat Messages */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg: Message) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div className="flex items-start space-x-3 max-w-[80%]">
                  {msg.role === 'assistant' && (
                    <div className={`p-2 bg-gradient-to-r ${agent.color} rounded-lg flex-shrink-0 mt-1`}>
                      <agent.icon className="h-4 w-4 text-white" />
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
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex items-start space-x-3 max-w-[80%]">
                  <div className={`p-2 bg-gradient-to-r ${agent.color} rounded-lg flex-shrink-0`}>
                    <agent.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="glass-card p-4 rounded-2xl rounded-bl-md">
                    <TypingIndicator />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Debug Info Panel */}
          {process.env.NODE_ENV === 'development' && (
            <div className="p-4 bg-slate-800 border-t border-slate-700">
              <details className="text-xs text-slate-400">
                <summary className="cursor-pointer hover:text-white">🔧 Debug Info</summary>
                <div className="mt-2 space-y-1">
                  <div>Agent ID: {agentId}</div>
                  <div>Has API Key: {hasApiKey ? '✅' : '❌'}</div>
                  <div>Is Custom Agent: {!Object.keys(BUILT_IN_AGENTS).includes(agentId) ? '✅' : '❌'}</div>
                  <div>Agent Loaded: {agent ? '✅' : '❌'}</div>
                  <div>Conversations: {conversations.length}</div>
                </div>
              </details>
            </div>
          )}

          {/* Message Input */}
          <div className="p-4 border-t border-border glass-nav">
            {!hasApiKey ? (
              <div className="text-center py-8">
                <div className="max-w-md mx-auto">
                  <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl mb-4 inline-block">
                    <Key className="h-6 w-6 text-white" />
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
              <form onSubmit={handleSendMessage} className="flex space-x-3">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Message ${agent.name}...`}
                  disabled={isLoading}
                  className="flex-1 glass-input border-input text-foreground placeholder-muted-foreground rounded-xl px-4 py-3 focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}