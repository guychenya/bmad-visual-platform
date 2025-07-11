'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Plus, Settings, Activity, Users, Brain, Code, Database, Palette, TestTube, User, FileText, MessageSquare, Sparkles } from 'lucide-react'

export function AgentHub() {
  const [agents] = useState([
    {
      id: 1,
      name: 'Analyst',
      description: 'Strategic planning and requirements analysis expert',
      status: 'active',
      lastUsed: '2 hours ago',
      icon: Brain,
      color: 'from-blue-500 to-cyan-500',
      expertise: ['Project Planning', 'Requirements Analysis', 'Strategic Insights'],
      personality: 'Analytical and thorough'
    },
    {
      id: 2,
      name: 'Architect',
      description: 'System architecture and technical design specialist',
      status: 'active',
      lastUsed: '1 hour ago',
      icon: Code,
      color: 'from-green-500 to-emerald-500',
      expertise: ['System Design', 'Architecture Patterns', 'Technical Strategy'],
      personality: 'Structured and visionary'
    },
    {
      id: 3,
      name: 'Developer',
      description: 'Full-stack development and implementation expert',
      status: 'active',
      lastUsed: '30 minutes ago',
      icon: Code,
      color: 'from-purple-500 to-pink-500',
      expertise: ['Frontend', 'Backend', 'DevOps', 'Code Quality'],
      personality: 'Pragmatic and efficient'
    },
    {
      id: 4,
      name: 'QA Engineer',
      description: 'Quality assurance and testing specialist',
      status: 'idle',
      lastUsed: '3 hours ago',
      icon: TestTube,
      color: 'from-yellow-500 to-orange-500',
      expertise: ['Test Automation', 'Quality Assurance', 'Bug Detection'],
      personality: 'Detail-oriented and methodical'
    },
    {
      id: 5,
      name: 'Scrum Master',
      description: 'Agile project management and story coordination',
      status: 'active',
      lastUsed: '45 minutes ago',
      icon: Users,
      color: 'from-red-500 to-pink-500',
      expertise: ['Agile Methodology', 'Sprint Planning', 'Team Coordination'],
      personality: 'Organized and collaborative'
    },
    {
      id: 6,
      name: 'UX Designer',
      description: 'User experience and interface design expert',
      status: 'idle',
      lastUsed: '2 days ago',
      icon: Palette,
      color: 'from-indigo-500 to-purple-500',
      expertise: ['User Research', 'UI/UX Design', 'Prototyping'],
      personality: 'Creative and user-focused'
    },
    {
      id: 7,
      name: 'Product Owner',
      description: 'Product strategy and feature prioritization',
      status: 'active',
      lastUsed: '1 day ago',
      icon: User,
      color: 'from-teal-500 to-blue-500',
      expertise: ['Product Strategy', 'Feature Planning', 'User Stories'],
      personality: 'Strategic and customer-oriented'
    }
  ])

  const [selectedAgent, setSelectedAgent] = useState(null)

  const activeAgents = agents.filter(agent => agent.status === 'active').length
  const totalTasks = 247
  const successRate = 98

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">AI Agents Hub</h1>
          <p className="text-slate-300 text-lg">
            Your intelligent development team, ready to transform your workflow
          </p>
        </div>
        <Button className="gradient-button hover:scale-105 transition-transform">
          <Plus className="h-4 w-4 mr-2" />
          Create Agent
        </Button>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {agents.map((agent, index) => (
          <Card 
            key={agent.id} 
            className="agent-card group cursor-pointer animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setSelectedAgent(agent)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 bg-gradient-to-r ${agent.color} rounded-xl group-hover:scale-110 transition-transform`}>
                  <agent.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    agent.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-slate-500'
                  }`} />
                  <span className="text-sm text-slate-400 capitalize">
                    {agent.status}
                  </span>
                </div>
              </div>
              <CardTitle className="text-lg text-white">{agent.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 mb-4 text-sm">{agent.description}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {agent.expertise.slice(0, 2).map((skill, idx) => (
                  <span key={idx} className="text-xs bg-white/10 text-slate-300 px-2 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
                {agent.expertise.length > 2 && (
                  <span className="text-xs bg-white/10 text-slate-300 px-2 py-1 rounded-full">
                    +{agent.expertise.length - 2}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                <span>Last used: {agent.lastUsed}</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1 glass-button">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Chat
                </Button>
                <Button variant="outline" size="sm" className="glass-button">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card text-center">
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold gradient-text mb-2">{activeAgents}</div>
            <div className="text-slate-400">Active Agents</div>
          </CardContent>
        </Card>
        <Card className="glass-card text-center">
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold gradient-text mb-2">{totalTasks}</div>
            <div className="text-slate-400">Tasks Completed</div>
          </CardContent>
        </Card>
        <Card className="glass-card text-center">
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold gradient-text mb-2">{successRate}%</div>
            <div className="text-slate-400">Success Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedAgent(null)}>
          <Card className="glass-card max-w-2xl w-full mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 bg-gradient-to-r ${selectedAgent.color} rounded-xl`}>
                    <selectedAgent.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">{selectedAgent.name}</CardTitle>
                    <p className="text-slate-400">{selectedAgent.description}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setSelectedAgent(null)} className="glass-button">
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent.expertise.map((skill, idx) => (
                      <span key={idx} className="bg-white/10 text-slate-300 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Personality</h3>
                  <p className="text-slate-400">{selectedAgent.personality}</p>
                </div>
                <div className="flex space-x-4">
                  <Button className="gradient-button flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Start Conversation
                  </Button>
                  <Button variant="outline" className="glass-button">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}