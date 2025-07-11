'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Users, MessageSquare, FileText, BarChart3, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to BMad Visual Platform
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Experience the power of AI-driven development with beautiful, intuitive interfaces. 
          Your BMad Method agents are ready to transform your development workflow.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <span>Meet Your Agents</span>
            </CardTitle>
            <CardDescription>
              Chat with specialized AI agents for every aspect of development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/agents">
              <Button className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Start Chatting
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Plus className="h-6 w-6 text-green-600" />
              </div>
              <span>New Project</span>
            </CardTitle>
            <CardDescription>
              Start a new project with AI-guided planning and architecture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <span>Templates</span>
            </CardTitle>
            <CardDescription>
              Browse pre-built templates for common project types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Browse Templates
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Features Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>Vibe Coding Experience</span>
            </CardTitle>
            <CardDescription>
              Fluid, creative development that feels natural
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Beautiful agent personalities</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Smooth animations and transitions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Intuitive chat interfaces</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Real-time collaboration</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <span>BMad Method Power</span>
            </CardTitle>
            <CardDescription>
              Structured AI development methodology
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Strategic planning with Analyst</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Architecture design with Architect</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Story management with Scrum Master</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Quality assurance with QA</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Ready to Get Started?</CardTitle>
          <CardDescription>
            Your AI development team is ready to help you build amazing projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard/agents">
              <Button size="lg" className="w-full sm:w-auto">
                <Users className="h-5 w-5 mr-2" />
                Meet Your Agents
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <FileText className="h-5 w-5 mr-2" />
              View Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}