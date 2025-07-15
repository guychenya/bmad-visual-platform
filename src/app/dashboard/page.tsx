'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Sparkles, MessageSquare, Settings, Send, Zap, Brain, Code, TestTube, FileText, Plus, Lightbulb, Rocket, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DashboardAccordion } from '../../components/dashboard/dashboard-accordion'

const CONVERSATION_STARTERS = [
  {
    icon: Lightbulb,
    title: "Create a SaaS App",
    description: "Build a subscription-based web application with user management",
    prompt: "I want to build a SaaS application that helps small businesses manage their inventory. It should have user authentication, subscription management, real-time inventory tracking, and reporting features."
  },
  {
    icon: Rocket,
    title: "Mobile App MVP",
    description: "Design and plan a mobile application minimum viable product",
    prompt: "Help me create an MVP for a fitness tracking mobile app. Users should be able to log workouts, track progress, set goals, and share achievements with friends."
  },
  {
    icon: Code,
    title: "API Design", 
    description: "Architect a RESTful API with documentation and testing",
    prompt: "I need to design a RESTful API for an e-commerce platform. It should handle products, orders, payments, and user management with proper authentication and rate limiting."
  },
  {
    icon: Users,
    title: "Team Workflow",
    description: "Optimize development processes and team collaboration",
    prompt: "Our development team needs better workflows. Help us design a process that includes code reviews, automated testing, deployment pipelines, and project management integration."
  }
]

export default function OpenAIStyleDashboard() {
  const router = useRouter()
  const [hasApiKey, setHasApiKey] = useState(false)
  const [inputValue, setInputValue] = useState('')

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

  const handleStartConversation = (prompt?: string) => {
    const message = prompt || inputValue.trim()
    if (message) {
      // Store the initial message and navigate to workspace
      sessionStorage.setItem('initial-message', message)
      router.push('/dashboard/workspace')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleStartConversation()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mr-6 shadow-2xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-5xl font-bold gradient-text mb-2">
                BMad AI Builder
              </h1>
              <p className="text-slate-300 text-xl font-medium">
                Your AI development team
              </p>
            </div>
          </div>
          
          {/* API Status */}
          {!hasApiKey && (
            <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl inline-block">
              <p className="text-amber-300 text-sm flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Demo mode • <Link href="/dashboard/settings" className="underline hover:text-amber-200 ml-1">Add API keys</Link> for full functionality
              </p>
            </div>
          )}
        </div>

        {/* Main Chat Input - OpenAI Style */}
        <div className="mb-12">
          <Card className="glass-card-premium border border-slate-600/50">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe your project idea, upload requirements, or ask how to get started..."
                    className="w-full bg-transparent border-0 text-white placeholder-slate-400 text-lg py-4 px-4 pr-12 focus:ring-0 focus:outline-none"
                  />
                  <Button
                    onClick={() => handleStartConversation()}
                    disabled={!inputValue.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 gradient-button-premium"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-center space-x-6 text-sm text-slate-400">
                  <div className="flex items-center">
                    <Brain className="h-4 w-4 mr-1" />
                    <span>AI Team Available</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-1" />
                    <span>Instant Analysis</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    <span>Professional Output</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversation Starters */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-white mb-8 text-center">
            Popular project types
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {CONVERSATION_STARTERS.map((starter, index) => {
              const Icon = starter.icon
              return (
                <Card 
                  key={index}
                  className="glass-card hover:glass-card-premium transition-all cursor-pointer group border-2 border-transparent hover:border-blue-400/30 rounded-2xl"
                  onClick={() => handleStartConversation(starter.prompt)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg mb-2 group-hover:text-blue-300 transition-colors">
                          {starter.title}
                        </h3>
                        <p className="text-base text-slate-300 leading-relaxed">
                          {starter.description}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* AI Team Preview */}
        <div className="mb-12">
          <Card className="glass-card border border-slate-600/50">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Meet Your AI Development Team
                </h3>
                <p className="text-slate-400">
                  Specialized agents that collaborate to build your project
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Orchestrator', icon: Sparkles, color: 'from-yellow-500 to-orange-500', role: 'Project Lead' },
                  { name: 'Analyst', icon: Brain, color: 'from-blue-500 to-cyan-500', role: 'Requirements' },
                  { name: 'Architect', icon: Code, color: 'from-indigo-500 to-purple-500', role: 'Technical Design' },
                  { name: 'QA Engineer', icon: TestTube, color: 'from-red-500 to-pink-500', role: 'Quality Assurance' }
                ].map((agent, index) => {
                  const Icon = agent.icon
                  return (
                    <div key={index} className="text-center">
                      <div className={`w-12 h-12 bg-gradient-to-r ${agent.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="text-sm font-medium text-white">{agent.name}</h4>
                      <p className="text-xs text-slate-400">{agent.role}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Accordion */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-white mb-3">
              Dashboard Overview
            </h2>
            <p className="text-slate-300 text-lg">
              Manage your projects, settings, and team collaboration
            </p>
          </div>
          <DashboardAccordion 
            defaultOpen={["navigation"]}
            currentPath="/dashboard"
            onNavigate={(path) => router.push(path)}
          />
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button
              onClick={() => router.push('/dashboard/workspace')}
              className="gradient-button-premium text-lg px-8 py-3"
            >
              <Plus className="h-5 w-5 mr-2" />
              Start New Project
            </Button>
            
            <Link href="/dashboard/settings">
              <Button variant="outline" className="glass-button px-6 py-3">
                <Settings className="h-5 w-5 mr-2" />
                Configure API Keys
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}