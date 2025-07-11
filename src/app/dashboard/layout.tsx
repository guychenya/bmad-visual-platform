'use client'

import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Users, Home, FileText, Settings, LogOut, Sparkles, Brain, Folder } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile, signOut } = useAuth()
  const pathname = usePathname()

  if (!user) {
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

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'AI Agents', href: '/dashboard/agents', icon: Brain },
    { name: 'Projects', href: '/dashboard/projects', icon: Folder },
    { name: 'Templates', href: '/dashboard/templates', icon: FileText },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Header */}
      <header className="glass-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="flex items-center space-x-3">
                <div className="relative">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-viby rounded-full animate-ping"></div>
                </div>
                <div className="text-2xl font-bold gradient-text">
                  Viby.ai
                </div>
              </Link>
              
              <nav className="hidden md:flex space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-viby text-white shadow-lg'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
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
                    {(profile?.full_name || user.email)?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <span>{profile?.full_name || user.email}</span>
              </div>
              <Button 
                variant="outline" 
                onClick={signOut}
                className="glass-button hover:scale-105 transition-transform"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
      
      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-nav border-t">
        <div className="flex justify-around py-2">
          {navigation.slice(0, 4).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center space-y-1 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-purple-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}