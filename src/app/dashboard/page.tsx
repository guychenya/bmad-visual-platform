'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Sparkles, MessageSquare, Settings, ArrowRight, Zap, Users, FileText, Download } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SimplifiedDashboard() {
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
                   settings.apiKeys?.gemini?.trim())
        } catch (error) {
          return false
        }
      }
      return false
    }
    
    setHasApiKey(checkApiKey())
  }, [])

  const handleStartBuilding = () => {
    // Go directly to workspace - no complex navigation
    router.push('/dashboard/workspace')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Hero Section - Clear Value Prop */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-viby rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-6xl font-bold gradient-text mb-4">
              BMad AI Builder
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Upload your PRD. AI agents build your app. Download professional deliverables.
            </p>
          </div>

          {/* API Status Banner */}
          {!hasApiKey && (
            <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-amber-300 text-sm">
                <Settings className="h-4 w-4 inline mr-2" />
                Demo mode active. <Link href="/dashboard/settings" className="underline hover:text-amber-200">Add API keys</Link> for full AI functionality.
              </p>
            </div>
          )}
        </div>

        {/* Main Action Flow - Simple 3-Step Process */}
        <div className="space-y-8">
          
          {/* Step 1: Start Building */}
          <Card className="glass-card-premium border-l-4 border-l-blue-400">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">1</div>
                Start Building Your Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <p className="text-slate-300 mb-4">
                    Launch the BMad workspace where AI agents collaborate to build your project from requirements to deployment.
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-slate-400">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      8 AI Specialists
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Real-time Chat
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      Professional Docs
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={handleStartBuilding}
                  size="lg" 
                  className="gradient-button-premium text-lg px-8 py-4 hover:scale-105 transition-all"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Launch Workspace
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: What You Get */}
          <Card className="glass-card border-l-4 border-l-green-400">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4">2</div>
                What You&apos;ll Get
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Professional Documents</h3>
                  <p className="text-sm text-slate-400">Business requirements, user stories, technical architecture, and system design.</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">AI Collaboration</h3>
                  <p className="text-sm text-slate-400">Orchestrator, Analyst, Architect, Developer, QA and more working together.</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Download className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Ready Downloads</h3>
                  <p className="text-sm text-slate-400">Download all deliverables as professional markdown documents.</p>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Step 3: Configure (Optional) */}
          <Card className="glass-card border-l-4 border-l-purple-400">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">3</div>
                Configure Settings (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <p className="text-slate-300 mb-2">
                    Add your API keys for full AI functionality, or continue in demo mode.
                  </p>
                  <p className="text-sm text-slate-400">
                    Supports OpenAI GPT-4, Anthropic Claude, and Google Gemini.
                  </p>
                </div>
                <Link href="/dashboard/settings">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="glass-button px-6 py-3 hover:scale-105 transition-all"
                  >
                    <Settings className="h-5 w-5 mr-2" />
                    Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">8+</div>
            <div className="text-slate-400 text-sm">AI Specialists</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">5min</div>
            <div className="text-slate-400 text-sm">Setup Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">100%</div>
            <div className="text-slate-400 text-sm">Professional Output</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">∞</div>
            <div className="text-slate-400 text-sm">Project Types</div>
          </div>
        </div>

      </div>
    </div>
  )
}