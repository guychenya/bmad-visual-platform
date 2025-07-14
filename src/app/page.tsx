'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { 
  MessageSquare, 
  Bot, 
  Sparkles, 
  ArrowRight,
  Star,
  Zap,
  Code,
  Brain
} from 'lucide-react'

// Sample agents for quick start
const FEATURED_AGENTS = [
  {
    id: 'bmad-orchestrator',
    name: 'BMad Orchestra',
    description: 'Master coordinator for all your projects',
    icon: '🎯',
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: '1',
    name: 'Mary (Analyst)',
    description: 'Business analysis and requirements',
    icon: '📊',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: '2',
    name: 'Winston (Architect)',
    description: 'System architecture and design',
    icon: '🏗️',
    color: 'from-orange-500 to-red-600'
  },
  {
    id: '3',
    name: 'James (Developer)',
    description: 'Full-stack development',
    icon: '👨‍💻',
    color: 'from-purple-500 to-pink-600'
  }
]

const EXAMPLE_PROMPTS = [
  "Help me plan a new web application",
  "Design a microservices architecture", 
  "Create a project requirements document",
  "Set up agile development workflow"
]

export default function Home() {
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

  const handleAgentSelect = (agentId: string) => {
    router.push(`/chat?agent=${agentId}&template=Custom%20Project&project=new`)
  }

  const handleExamplePrompt = (prompt: string) => {
    router.push(`/chat?prompt=${encodeURIComponent(prompt)}&template=Custom%20Project&project=new`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">BMad AI</h1>
                <p className="text-sm text-gray-500">AI-powered development assistant</p>
              </div>
            </div>
            <Badge 
              variant={hasApiKey ? "default" : "secondary"}
              className="px-3 py-1"
            >
              {hasApiKey ? (
                <><Zap className="h-3 w-3 mr-1" /> AI Ready</>
              ) : (
                <><Star className="h-3 w-3 mr-1" /> Demo Mode</>
              )}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Powered by advanced AI agents</span>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Build with
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> AI Agents</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your development workflow with specialized AI agents. From planning to deployment, 
            get expert guidance at every step.
          </p>

          {/* Quick Start Button */}
          <Button 
            onClick={() => handleAgentSelect('bmad-orchestrator')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Start Building
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>

        {/* Agent Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Choose Your AI Agent</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURED_AGENTS.map((agent) => (
              <div
                key={agent.id}
                onClick={() => handleAgentSelect(agent.id)}
                className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 bg-gradient-to-r ${agent.color} rounded-xl text-2xl group-hover:scale-110 transition-transform duration-200`}>
                    {agent.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {agent.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {agent.description}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Example Prompts */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Try These Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EXAMPLE_PROMPTS.map((prompt, index) => (
              <div
                key={index}
                onClick={() => handleExamplePrompt(prompt)}
                className="group p-4 bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-200 hover:border-blue-200 cursor-pointer transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <Bot className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <span className="text-gray-700 group-hover:text-blue-700 transition-colors">
                    &ldquo;{prompt}&rdquo;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Message */}
        {!hasApiKey && (
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-700 px-6 py-3 rounded-xl border border-amber-200">
              <Star className="h-4 w-4" />
              <span>Running in demo mode. </span>
              <Link 
                href="/dashboard/settings?tab=api" 
                className="underline hover:no-underline font-medium"
              >
                Add API keys
              </Link>
              <span> for full AI capabilities.</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span>Built with BMad Method</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Development</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}