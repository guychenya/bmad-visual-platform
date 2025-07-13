'use client'

import { useAuth } from '../../contexts/AuthContext'
import { HierarchyProvider } from '../../contexts/HierarchyContext'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Users, Home, FileText, Settings, LogOut, Sparkles, Brain, Folder, Plus, GitBranch, Building, Layers } from 'lucide-react'
import Link from 'next/link'
import { routes } from '../../lib/routes'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile, signOut, loading } = useAuth()
  const pathname = usePathname()

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
            <Link href={routes.auth.login}>
              <Button className="gradient-button">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const navigation = [
    { name: 'Dashboard', href: routes.dashboard.home, icon: Home },
    { name: 'Organizations', href: routes.dashboard.organizations, icon: Building },
    { name: 'Templates', href: routes.dashboard.templates, icon: FileText },
    { name: 'Settings', href: routes.dashboard.settings, icon: Settings },
  ]

  return (
    <HierarchyProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Skip Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      
      {/* Navigation Header */}
      <header className="glass-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <Link href={routes.dashboard.home} className="flex items-center space-x-3">
                <div className="relative">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-viby rounded-full animate-ping"></div>
                </div>
                <div className="text-2xl font-bold gradient-text">
                  Viby.ai
                </div>
              </Link>
              
              <nav className="hidden md:flex space-x-1" role="navigation" aria-label="Main navigation">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                        isActive
                          ? 'bg-gradient-viby text-white shadow-lg'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-300">
                <div className="w-8 h-8 bg-gradient-viby rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {(profile?.full_name || user?.email)?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <span>{profile?.full_name || user?.email}</span>
              </div>
              <Button 
                variant="outline" 
                onClick={signOut}
                className="glass-button hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                aria-label="Sign out of your account"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline ml-2">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
      
      {/* Mobile Navigation */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 glass-nav border-t safe-area-pb"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex justify-around py-3">
          {navigation.slice(0, 5).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center space-y-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 min-h-[48px] min-w-[48px] ${
                  isActive
                    ? 'text-purple-400'
                    : 'text-slate-400 hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
      </div>
    </HierarchyProvider>
  )
}