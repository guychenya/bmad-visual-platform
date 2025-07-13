'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Plus, Users, MessageSquare, FileText, BarChart3, Zap, Brain, Sparkles, ArrowRight, Rocket, Folder, Layers, Building } from 'lucide-react'
import Link from 'next/link'
import { useHierarchy } from '../../contexts/HierarchyContext'

export default function Dashboard() {
  const { state } = useHierarchy()
  
  const quickActions = [
    {
      title: 'Agent Workspace',
      description: 'GitHub Copilot-style tabbed interface with AI agents working together',
      icon: Users,
      href: '/dashboard/workspace',
      gradient: 'from-orange-500 to-red-500',
      buttonText: 'Open Workspace',
      buttonIcon: Users
    },
    {
      title: 'AI Agents Hub',
      description: 'Chat with specialized AI agents for every aspect of development',
      icon: Brain,
      href: '/dashboard/agents',
      gradient: 'from-purple-500 to-pink-500',
      buttonText: 'Start Chatting',
      buttonIcon: MessageSquare
    },
    {
      title: 'Manage Hierarchy',
      description: 'Navigate your organization structure and manage projects',
      icon: Layers,
      href: '/dashboard/hierarchy',
      gradient: 'from-indigo-500 to-purple-500',
      buttonText: 'View Hierarchy',
      buttonIcon: Building
    },
    {
      title: 'Create Project',
      description: 'Upload your PRD and watch AI agents build your app automatically',
      icon: Rocket,
      href: '/dashboard/create',
      gradient: 'from-blue-500 to-cyan-500',
      buttonText: 'Start Building',
      buttonIcon: Plus
    },
    {
      title: 'Templates',
      description: 'Browse pre-built templates for common project types',
      icon: FileText,
      href: '/dashboard/templates',
      gradient: 'from-green-500 to-emerald-500',
      buttonText: 'Browse Templates',
      buttonIcon: FileText
    }
  ]

  const features = [
    {
      title: 'Viby Coding Experience',
      description: 'Fluid, creative development that feels natural',
      icon: Zap,
      color: 'text-yellow-400',
      items: [
        'Beautiful agent personalities',
        'Smooth animations and transitions',
        'Intuitive chat interfaces',
        'Real-time collaboration'
      ]
    },
    {
      title: 'AI-Powered Development',
      description: 'Structured AI development methodology',
      icon: BarChart3,
      color: 'text-blue-400',
      items: [
        'Strategic planning with Analyst',
        'Architecture design with Architect',
        'Story management with Scrum Master',
        'Quality assurance with QA'
      ]
    }
  ]

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-viby rounded-full flex items-center justify-center animate-float">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-accent rounded-full animate-ping"></div>
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
          Welcome to Viby.ai
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Experience the power of AI-driven development with beautiful, intuitive interfaces. 
          Your intelligent agents are ready to transform your development workflow.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {quickActions.map((action, index) => (
          <Card key={action.title} className="agent-card group animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className={`p-3 bg-gradient-to-r ${action.gradient} rounded-xl group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-white">{action.title}</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                {action.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={action.href}>
                <Button className="w-full gradient-button group-hover:scale-105 transition-transform">
                  <action.buttonIcon className="h-4 w-4 mr-2" />
                  {action.buttonText}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <Card key={feature.title} className="glass-card animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
                <span className="text-white">{feature.title}</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                {feature.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {feature.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center space-x-3 group">
                  <div className="w-2 h-2 bg-gradient-viby rounded-full group-hover:scale-150 transition-transform"></div>
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current Context */}
      {state.currentOrganization && (
        <Card className="glass-card border-l-4 border-l-purple-400">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Building className="w-5 h-5 text-purple-400" />
              Current Context
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Organization:</span>
              <span className="text-white font-medium">{state.currentOrganization.name}</span>
            </div>
            {state.currentProject && (
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Project:</span>
                <span className="text-white font-medium">{state.currentProject.name}</span>
              </div>
            )}
            {state.currentWorkflow && (
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Workflow:</span>
                <span className="text-white font-medium">{state.currentWorkflow.name}</span>
              </div>
            )}
            <div className="pt-2">
              <Link href="/dashboard/hierarchy">
                <Button size="sm" className="gradient-button">
                  <Layers className="w-4 h-4 mr-2" />
                  Manage Hierarchy
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold gradient-text mb-2">7+</div>
            <div className="text-slate-400">AI Agents</div>
          </CardContent>
        </Card>
        <Card className="glass-card text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold gradient-text mb-2">100+</div>
            <div className="text-slate-400">Templates</div>
          </CardContent>
        </Card>
        <Card className="glass-card text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold gradient-text mb-2">{state.currentOrganization ? '1' : '0'}</div>
            <div className="text-slate-400">Organizations</div>
          </CardContent>
        </Card>
        <Card className="glass-card text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold gradient-text mb-2">∞</div>
            <div className="text-slate-400">Possibilities</div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card className="glass-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">Ready to Get Started?</CardTitle>
          <CardDescription className="text-slate-400">
            Your AI development team is ready to help you build amazing projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/hierarchy">
              <Button size="lg" className="w-full sm:w-auto gradient-button hover:scale-105 transition-transform">
                <Layers className="h-5 w-5 mr-2" />
                Explore Hierarchy
              </Button>
            </Link>
            <Link href="/dashboard/agents">
              <Button size="lg" className="w-full sm:w-auto gradient-button hover:scale-105 transition-transform">
                <Brain className="h-5 w-5 mr-2" />
                Meet Your Agents
              </Button>
            </Link>
            <Link href="/dashboard/workspace">
              <Button size="lg" className="w-full sm:w-auto gradient-button hover:scale-105 transition-transform">
                <Users className="h-5 w-5 mr-2" />
                Try Workspace
              </Button>
            </Link>
            <Link href="/dashboard/create">
              <Button variant="outline" size="lg" className="w-full sm:w-auto glass-button hover:scale-105 transition-transform">
                <Plus className="h-5 w-5 mr-2" />
                Create Project
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}