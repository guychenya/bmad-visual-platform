'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../components/ui/button'
import { 
  Play,
  ArrowRight,
  Zap,
  Users,
  BarChart3,
  GitBranch,
  Brain,
  Sparkles,
  CheckCircle,
  Clock,
  TrendingUp,
  Code,
  MessageSquare,
  Workflow,
  Shield,
  FileText
} from 'lucide-react'

const FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Development Assistant",
    description: "Contextual code intelligence and natural language to code conversion",
    color: "from-blue-500 to-purple-600"
  },
  {
    icon: Workflow,
    title: "Visual Workflow Management",
    description: "Interactive project canvas with drag-and-drop functionality",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: Users,
    title: "Collaborative Environment",
    description: "Real-time code collaboration with AI-moderated reviews",
    color: "from-orange-500 to-red-600"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Predictive insights and development velocity tracking",
    color: "from-purple-500 to-pink-600"
  }
]

const STATS = [
  { label: "Productivity Increase", value: "40%", icon: TrendingUp },
  { label: "Bug Reduction", value: "60%", icon: Shield },
  { label: "Faster Delivery", value: "3x", icon: Clock },
  { label: "Team Satisfaction", value: "95%", icon: CheckCircle }
]

export default function VibeDev() {
  const router = useRouter()
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
                   settings.apiKeys?.gemini?.trim() ||
                   settings.apiKeys?.groq?.trim())
        } catch (error) {
          return false
        }
      }
      return false
    }
    
    setHasApiKey(checkApiKey())
  }, [])

  const handleGetStarted = () => {
    router.push('/dashboard')
  }

  const handleStartVibing = () => {
    router.push('/chat?agent=bmad-orchestrator&template=VibeDev%20Project&project=new')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">VibeDev</h1>
                <p className="text-xs text-gray-400">AI-Powered Development</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                hasApiKey 
                  ? 'bg-green-900/50 text-green-300 border border-green-700/50' 
                  : 'bg-amber-900/50 text-amber-300 border border-amber-700/50'
              }`}>
                {hasApiKey ? '🚀 AI Ready' : '✨ Demo Mode'}
              </div>
              
              <Button 
                onClick={handleGetStarted}
                className="bg-white text-black hover:bg-gray-100 font-medium"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-900/20 text-blue-300 px-4 py-2 rounded-full text-sm mb-8 border border-blue-700/30">
              <Sparkles className="h-4 w-4" />
              <span>The Future of Software Development</span>
            </div>
            
            <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
              AI-Powered
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Development</span>
              <br />Management Platform
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your development workflow with intelligent AI assistance, visual project management, 
              and real-time collaboration. Experience the next generation of software development.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Building
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              
              <Button 
                onClick={handleStartVibing}
                variant="outline"
                size="lg"
                className="border-gray-600 text-white hover:bg-gray-800 px-8 py-4 text-lg"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Start Vibe Coding
              </Button>
              
              <Link 
                href="/chat"
                className="inline-flex items-center px-8 py-4 border border-purple-600 text-purple-300 hover:text-white hover:border-purple-500 rounded-lg text-lg transition-colors hover:bg-purple-600/10"
              >
                <Brain className="h-5 w-5 mr-2" />
                Try AI Chat
              </Link>
              
              <Link 
                href="/prd-generator"
                className="inline-flex items-center px-8 py-4 border border-green-600 text-green-300 hover:text-white hover:border-green-500 rounded-lg text-lg transition-colors hover:bg-green-600/10"
              >
                <FileText className="h-5 w-5 mr-2" />
                Generate PRD
              </Link>
              
              <Link 
                href="/compliance"
                className="inline-flex items-center px-8 py-4 border border-orange-600 text-orange-300 hover:text-white hover:border-orange-500 rounded-lg text-lg transition-colors hover:bg-orange-600/10"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                Compliance Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <stat.icon className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Everything You Need for Modern Development
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive tools and AI assistance to streamline your entire development lifecycle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((feature, index) => (
              <div 
                key={index}
                className="group p-8 bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 bg-gradient-to-r ${feature.color} rounded-xl group-hover:scale-110 transition-transform duration-200`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Development Workflow?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of developers already using VibeDev to build faster, smarter, and better.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-medium"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            {!hasApiKey && (
              <Link 
                href="/dashboard/settings?tab=api"
                className="inline-flex items-center px-8 py-4 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 rounded-lg text-lg transition-colors"
              >
                <Shield className="h-5 w-5 mr-2" />
                Configure AI Keys
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold">VibeDev</div>
                <div className="text-gray-400 text-sm">AI-Powered Development Platform</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Code className="h-4 w-4" />
                <span>Built with Next.js & AI</span>
              </div>
              <div className="flex items-center space-x-2">
                <GitBranch className="h-4 w-4" />
                <span>Open Source Ready</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}