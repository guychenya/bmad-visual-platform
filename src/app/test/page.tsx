'use client'

import { useAuth } from '../../contexts/AuthContext'

export default function TestPage() {
  const { user, session, loading } = useAuth()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Authentication Test Page</h1>
        
        <div className="space-y-4">
          <div className="bg-slate-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-2">Environment Variables</h2>
            <div className="space-y-2 text-sm">
              <div className="text-slate-300">
                <strong>NEXT_PUBLIC_BYPASS_AUTH:</strong> {process.env.NEXT_PUBLIC_BYPASS_AUTH || 'undefined'}
              </div>
              <div className="text-slate-300">
                <strong>NODE_ENV:</strong> {process.env.NODE_ENV}
              </div>
              <div className="text-slate-300">
                <strong>Bypass Active:</strong> {process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true' ? 'YES' : 'NO'}
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-2">Authentication Status</h2>
            <div className="space-y-2 text-sm">
              <div className="text-slate-300">
                <strong>Loading:</strong> {loading ? 'YES' : 'NO'}
              </div>
              <div className="text-slate-300">
                <strong>User:</strong> {user ? 'Authenticated' : 'Not authenticated'}
              </div>
              <div className="text-slate-300">
                <strong>Session:</strong> {session ? 'Active' : 'None'}
              </div>
              {user && (
                <div className="text-slate-300">
                  <strong>User Email:</strong> {user.email}
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-2">Quick Links</h2>
            <div className="space-y-2">
              <a href="/chat" className="block text-blue-400 hover:text-blue-300">→ Chat Interface</a>
              <a href="/dashboard" className="block text-blue-400 hover:text-blue-300">→ Dashboard</a>
              <a href="/dashboard/workspace" className="block text-blue-400 hover:text-blue-300">→ Workspace</a>
              <a href="/dashboard/workspace/simple" className="block text-blue-400 hover:text-blue-300">→ Simple Workspace</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}