'use client'

import Link from 'next/link'
import { 
  BarChart3, 
  MessageSquare, 
  Users, 
  FileText, 
  Settings, 
  Workflow,
  Brain,
  Shield,
  Upload,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Database,
  Zap
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'

const FEATURES = [
  {
    title: "Quality Compliance Dashboard",
    description: "Comprehensive compliance monitoring with KPIs, CAPA tracking, audit management, and document control",
    icon: BarChart3,
    href: "/compliance",
    color: "from-orange-500 to-red-600",
    features: [
      "Real-time compliance metrics",
      "CAPA management system", 
      "Training completion tracking",
      "Audit findings visualization",
      "Document management"
    ]
  },
  {
    title: "AI Chat Interface",
    description: "Interactive AI-powered chat with multiple models and contextual assistance",
    icon: MessageSquare,
    href: "/chat",
    color: "from-blue-500 to-purple-600",
    features: [
      "Multi-model AI support",
      "Context-aware responses",
      "Code generation",
      "Natural language processing",
      "Chat history management"
    ]
  },
  {
    title: "Project Dashboard",
    description: "Visual project management with agent coordination and workflow automation",
    icon: Workflow,
    href: "/dashboard",
    color: "from-green-500 to-emerald-600",
    features: [
      "Agent management",
      "Project organization",
      "Team collaboration",
      "Workflow automation",
      "Performance analytics"
    ]
  },
  {
    title: "PRD Generator",
    description: "AI-powered Product Requirements Document generation and management",
    icon: FileText,
    href: "/prd-generator",
    color: "from-purple-500 to-pink-600",
    features: [
      "Document generation",
      "Template management",
      "Version control",
      "Collaboration tools",
      "Export capabilities"
    ]
  },
  {
    title: "Authentication System",
    description: "Secure user authentication with profile management and session control",
    icon: Shield,
    href: "/auth/login",
    color: "from-gray-500 to-slate-600",
    features: [
      "Email/password auth",
      "Social login support",
      "Profile management",
      "Session security",
      "Access control"
    ]
  },
  {
    title: "Settings & Configuration",
    description: "System settings, API key management, and application configuration",
    icon: Settings,
    href: "/dashboard/settings",
    color: "from-indigo-500 to-blue-600",
    features: [
      "API key management",
      "Theme customization",
      "User preferences",
      "System configuration",
      "Integration settings"
    ]
  }
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">VibeDev</h1>
                <p className="text-xs text-gray-400">AI-Powered Development</p>
              </div>
            </Link>
            
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-6">
            Application Features
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore all the powerful features available in the VibeDev platform. 
            From AI-powered development tools to comprehensive compliance management.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {FEATURES.map((feature, index) => (
            <Card key={index} className="p-6 bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <div className="flex items-start space-x-4 mb-4">
                <div className={`p-3 bg-gradient-to-r ${feature.color} rounded-xl`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {feature.description}
                  </p>
                </div>
              </div>
              
              <ul className="space-y-2 mb-6">
                {feature.features.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              
              <Link href={feature.href}>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  Launch Feature
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        {/* Quick Access Section */}
        <div className="bg-gray-900/30 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Quick Access
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/compliance" className="group">
              <div className="p-4 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-xl border border-orange-500/30 hover:border-orange-500/50 transition-all duration-200 group-hover:scale-105">
                <BarChart3 className="h-8 w-8 text-orange-400 mb-2" />
                <h3 className="text-white font-medium">Compliance</h3>
                <p className="text-gray-400 text-sm">Dashboard & Metrics</p>
              </div>
            </Link>
            
            <Link href="/chat" className="group">
              <div className="p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-500/30 hover:border-blue-500/50 transition-all duration-200 group-hover:scale-105">
                <MessageSquare className="h-8 w-8 text-blue-400 mb-2" />
                <h3 className="text-white font-medium">AI Chat</h3>
                <p className="text-gray-400 text-sm">Interactive Assistant</p>
              </div>
            </Link>
            
            <Link href="/dashboard" className="group">
              <div className="p-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl border border-green-500/30 hover:border-green-500/50 transition-all duration-200 group-hover:scale-105">
                <Workflow className="h-8 w-8 text-green-400 mb-2" />
                <h3 className="text-white font-medium">Dashboard</h3>
                <p className="text-gray-400 text-sm">Project Management</p>
              </div>
            </Link>
            
            <Link href="/prd-generator" className="group">
              <div className="p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition-all duration-200 group-hover:scale-105">
                <FileText className="h-8 w-8 text-purple-400 mb-2" />
                <h3 className="text-white font-medium">PRD Generator</h3>
                <p className="text-gray-400 text-sm">Document Creation</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}