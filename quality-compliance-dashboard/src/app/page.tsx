'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BarChart3, ArrowRight, CheckCircle, TrendingUp, FileText, Users } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect to compliance dashboard after 2 seconds
    const timer = setTimeout(() => {
      router.push('/compliance')
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Quality Compliance Dashboard</h1>
                <p className="text-xs text-gray-400">Comprehensive Compliance Monitoring</p>
              </div>
            </div>
            
            <Link 
              href="/compliance"
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-orange-900/20 text-orange-300 px-4 py-2 rounded-full text-sm mb-8 border border-orange-700/30">
            <BarChart3 className="h-4 w-4" />
            <span>Quality Compliance Management System</span>
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Quality Compliance
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent"> Dashboard</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Comprehensive compliance monitoring with real-time KPIs, CAPA tracking, audit management, 
            and document control. Built with Next.js and Supabase for modern organizations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link 
              href="/compliance"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Launch Dashboard
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>

          {/* Auto-redirect notice */}
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 max-w-md mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
            </div>
            <p className="text-gray-300 text-sm">
              Redirecting to compliance dashboard in 2 seconds...
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-green-900/50 rounded-xl border border-green-700/50">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-2">92.5%</div>
            <div className="text-gray-400 text-sm">Compliance Rate</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-orange-900/50 rounded-xl border border-orange-700/50">
                <FileText className="h-6 w-6 text-orange-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-2">18</div>
            <div className="text-gray-400 text-sm">Open CAPAs</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-blue-900/50 rounded-xl border border-blue-700/50">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-2">85%</div>
            <div className="text-gray-400 text-sm">Training Complete</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-purple-900/50 rounded-xl border border-purple-700/50">
                <CheckCircle className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-2">15</div>
            <div className="text-gray-400 text-sm">Audit Findings</div>
          </div>
        </div>
      </main>
    </div>
  )
}