'use client'

import { useAuth } from '../../contexts/AuthContext'
import { HierarchyProvider } from '../../contexts/HierarchyContext'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Settings, LogOut, Sparkles, Zap, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile, signOut, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // Check if auth is bypassed
  const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true'
  
  // Show loading while auth context is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Card className="glass-card animate-scale-in">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-purple-400 animate-pulse-slow" />
            </div>
            <h2 className="text-2xl font-bold mb-4 gradient-text">Loading...</h2>
            <p className="text-slate-400">Setting up your dashboard</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Only show login prompt if auth is not bypassed and no user
  if (!user && !bypassAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Card className="glass-card animate-scale-in">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-purple-400 animate-pulse-slow" />
            </div>
            <h2 className="text-2xl font-bold mb-4 gradient-text">Please sign in</h2>
            <Link href="/auth/login">
              <Button className="gradient-button">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Simplified navigation - only 3 core items
  const isInWorkspace = pathname.includes('/dashboard/workspace')
  const isInSettings = pathname.includes('/dashboard/settings')

  return (
    <HierarchyProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        
        {/* Simplified Header - Only show when needed */}
        {(isInWorkspace || isInSettings) && (
          <header className="glass-nav sticky top-0 z-50 animate-slide-up border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-3">
                
                {/* Back to Dashboard */}
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/dashboard')}
                    className="text-slate-300 hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  
                  <div className="hidden sm:flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span className="text-lg font-semibold gradient-text">
                      BMad AI Builder
                    </span>
                  </div>
                </div>
                
                {/* User Actions */}
                <div className="flex items-center space-x-3">
                  {/* Settings */}
                  {!isInSettings && (
                    <Link href="/dashboard/settings">
                      <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                        <Settings className="h-4 w-4" />
                        <span className="hidden sm:inline ml-2">Settings</span>
                      </Button>
                    </Link>
                  )}
                  
                  {/* User Info */}
                  <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-300">
                    <div className="w-7 h-7 bg-gradient-viby rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-xs">
                        {(profile?.full_name || user?.email)?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="max-w-32 truncate">{profile?.full_name || user?.email}</span>
                  </div>
                  
                  {/* Sign Out */}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={signOut}
                    className="text-slate-300 hover:text-white"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Main Content */}
        <main className="relative">
          {children}
        </main>
        
      </div>
    </HierarchyProvider>
  )
}