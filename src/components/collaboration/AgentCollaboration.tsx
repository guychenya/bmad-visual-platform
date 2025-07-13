'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Bot, MessageCircle, CheckCircle, Clock, ArrowRight, Sparkles, Code, Palette, TestTube, Rocket } from 'lucide-react'

interface Agent {
  id: string
  name: string
  role: string
  icon: any
  status: 'waiting' | 'active' | 'completed'
  progress: number
  currentTask: string
  color: string
}

interface AgentCollaborationProps {
  projectName: string
  onComplete: (result: any) => void
}

export function AgentCollaboration({ projectName, onComplete }: AgentCollaborationProps) {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'analyst',
      name: 'Business Analyst',
      role: 'Requirements Analysis',
      icon: Bot,
      status: 'active',
      progress: 0,
      currentTask: 'Analyzing PRD and extracting core requirements...',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'architect',
      name: 'System Architect',
      role: 'Technical Architecture',
      icon: Code,
      status: 'waiting',
      progress: 0,
      currentTask: 'Waiting for requirements analysis...',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'designer',
      name: 'UI/UX Designer',
      role: 'Interface Design',
      icon: Palette,
      status: 'waiting',
      progress: 0,
      currentTask: 'Waiting for system architecture...',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'developer',
      name: 'Full-Stack Developer',
      role: 'Implementation',
      icon: Code,
      status: 'waiting',
      progress: 0,
      currentTask: 'Waiting for design specifications...',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'qa',
      name: 'QA Engineer',
      role: 'Quality Assurance',
      icon: TestTube,
      status: 'waiting',
      progress: 0,
      currentTask: 'Waiting for implementation...',
      color: 'from-indigo-500 to-purple-500'
    }
  ])

  const [currentPhase, setCurrentPhase] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [messages, setMessages] = useState<Array<{
    id: string
    agentId: string
    agentName: string
    message: string
    timestamp: string
    type: 'info' | 'success' | 'collaboration'
  }>>([])

  const phases = useMemo(() => [
    { name: 'Requirements Analysis', duration: 3000 },
    { name: 'System Architecture', duration: 4000 },
    { name: 'UI/UX Design', duration: 3500 },
    { name: 'Development', duration: 5000 },
    { name: 'Quality Assurance', duration: 2500 }
  ], [])

  const addMessage = useCallback((message: Omit<typeof messages[0], 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString()
    }])
  }, [setMessages])

  const getTaskForPhase = useCallback((phase: number): string => {
    const tasks = [
      'Extracting functional requirements and user stories...',
      'Designing system architecture and data models...',
      'Creating wireframes and visual design system...',
      'Implementing components and business logic...',
      'Running tests and validating functionality...'
    ]
    return tasks[phase] || 'Processing...'
  }, [])

  const processAgentPhase = useCallback(async (agentIndex: number) => {
    const agent = agents[agentIndex]
    const phase = phases[agentIndex]
    
    // Start agent work
    setAgents(prev => prev.map((a, i) => 
      i === agentIndex 
        ? { ...a, status: 'active', currentTask: getTaskForPhase(i) }
        : a
    ))

    addMessage({
      agentId: agent.id,
      agentName: agent.name,
      message: `Starting ${phase.name}...`,
      type: 'info'
    })

    // Simulate progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, phase.duration / 10))
      
      setAgents(prev => prev.map((a, i) => 
        i === agentIndex ? { ...a, progress } : a
      ))

      // Add collaboration messages
      if (progress === 50 && agentIndex > 0) {
        addMessage({
          agentId: agent.id,
          agentName: agent.name,
          message: `Collaborating with ${agents[agentIndex - 1].name} on interface requirements...`,
          type: 'collaboration'
        })
      }
    }

    // Complete agent work
    setAgents(prev => prev.map((a, i) => 
      i === agentIndex 
        ? { ...a, status: 'completed', currentTask: 'Phase completed successfully!' }
        : a
    ))

    addMessage({
      agentId: agent.id,
      agentName: agent.name,
      message: `${phase.name} completed successfully!`,
      type: 'success'
    })

    setCurrentPhase(agentIndex + 1)
  }, [agents, setAgents, addMessage, getTaskForPhase, setCurrentPhase, phases])

  const simulateAgentWork = useCallback(async () => {
    for (let i = 0; i < agents.length; i++) {
      await processAgentPhase(i)
    }
    setIsComplete(true)
    
    // Simulate final result
    setTimeout(() => {
      onComplete({
        appName: projectName,
        framework: 'React + Next.js',
        features: ['Authentication', 'Dashboard', 'API Integration', 'Responsive Design'],
        deploymentUrl: 'https://your-app.netlify.app',
        codeRepository: 'https://github.com/your-repo/project'
      })
    }, 1000)
  }, [agents, onComplete, processAgentPhase, projectName])

  useEffect(() => {
    simulateAgentWork()
  }, [simulateAgentWork])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-viby rounded-full mb-4 animate-pulse">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold gradient-text">AI Agents Collaborating</h2>
        <p className="text-slate-300 text-lg">
          Watch our specialized AI agents work together to build <span className="text-white font-semibold">{projectName}</span>
        </p>
      </div>

      {/* Agent Pipeline */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            Agent Pipeline Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agents.map((agent, index) => (
              <div key={agent.id} className="flex items-center space-x-4">
                {/* Agent Icon */}
                <div className={`p-3 bg-gradient-to-r ${agent.color} rounded-xl relative ${
                  agent.status === 'active' ? 'animate-pulse' : ''
                }`}>
                  <agent.icon className="h-6 w-6 text-white" />
                  {agent.status === 'completed' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  )}
                  {agent.status === 'active' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full animate-ping" />
                  )}
                </div>

                {/* Agent Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-white font-medium">{agent.name}</h3>
                      <p className="text-slate-400 text-sm">{agent.role}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-sm">{agent.progress}%</div>
                      <div className={`text-xs capitalize ${
                        agent.status === 'completed' ? 'text-green-400' :
                        agent.status === 'active' ? 'text-yellow-400' : 'text-slate-500'
                      }`}>
                        {agent.status}
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-viby h-2 rounded-full transition-all duration-500"
                      style={{ width: `${agent.progress}%` }}
                    />
                  </div>
                  
                  <p className="text-slate-300 text-sm">{agent.currentTask}</p>
                </div>

                {/* Connection Arrow */}
                {index < agents.length - 1 && (
                  <ArrowRight className={`h-5 w-5 ${
                    agent.status === 'completed' ? 'text-green-400' : 'text-slate-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Collaboration Feed */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Agent Collaboration Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                <div className={`p-2 rounded-lg ${
                  message.type === 'success' ? 'bg-green-500/20' :
                  message.type === 'collaboration' ? 'bg-purple-500/20' : 'bg-blue-500/20'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : message.type === 'collaboration' ? (
                    <ArrowRight className="h-4 w-4 text-purple-400" />
                  ) : (
                    <Clock className="h-4 w-4 text-blue-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-white font-medium text-sm">{message.agentName}</span>
                    <span className="text-slate-500 text-xs">{message.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-sm">{message.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completion Status */}
      {isComplete && (
        <Card className="glass-card border border-green-500/20">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
              <Rocket className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Application Created Successfully!
            </h3>
            <p className="text-slate-300 mb-6">
              All agents have completed their work. Your application is ready for review.
            </p>
            <div className="flex justify-center space-x-4">
              <Button className="gradient-button">
                <Rocket className="h-4 w-4 mr-2" />
                View Application
              </Button>
              <Button variant="outline" className="glass-button">
                Download Code
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}