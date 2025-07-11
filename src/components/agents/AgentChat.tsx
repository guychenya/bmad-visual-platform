'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Send, Loader2, ArrowLeft, Brain, Code, TestTube, Users, User, Palette } from 'lucide-react'
import Link from 'next/link'
import { TypingIndicator } from './TypingIndicator'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface AgentChatProps {
  agentId: string
}

const AGENTS = {
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const agent = AGENTS[agentId as keyof typeof AGENTS]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (agent) {
      // Add greeting message when agent changes
      const greetingMessage: Message = {
        id: `greeting-${agentId}`,
        role: 'assistant',
        content: agent.greeting,
        timestamp: new Date().toISOString()
      }
      setMessages([greetingMessage])
    }
  }, [agentId, agent])

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
    if (!message.trim() || isLoading || !agent) return

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
      // Simulate AI thinking time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAgentResponse(userMessage.content, agent),
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, agentMessage])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsTyping(false)
      setIsLoading(false)
    }
  }

  if (!agent) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="glass-card p-8 text-center">
          <CardContent>
            <h3 className="text-xl font-semibold text-white mb-2">Agent Not Found</h3>
            <p className="text-slate-400 mb-4">The requested agent doesn't exist.</p>
            <Link href="/dashboard/agents">
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

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Agent Header */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/agents">
                <Button variant="outline" size="sm" className="glass-button">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className={`p-3 bg-gradient-to-r ${agent.color} rounded-xl`}>
                <agent.icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-white">{agent.name}</CardTitle>
                <p className="text-slate-400">{agent.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-400">Online</span>
            </div>
          </div>
          
          {/* Expertise Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {agent.expertise.map((skill, idx) => (
              <span key={idx} className="text-xs bg-white/10 text-slate-300 px-2 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Chat Messages */}
      <Card className="glass-card flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col p-4">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-gradient-viby text-white'
                      : 'bg-white/10 text-slate-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white/10 p-3 rounded-lg">
                  <TypingIndicator />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="flex space-x-2 mt-4">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message ${agent.name}...`}
              disabled={isLoading}
              className="flex-1 glass-input"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !message.trim()}
              className="gradient-button"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}