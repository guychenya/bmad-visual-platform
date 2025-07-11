'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Monitor, Smartphone, Tablet, Code, Download, ExternalLink, Play, Github, Globe, Sparkles } from 'lucide-react'

interface AppResult {
  appName: string
  framework: string
  features: string[]
  deploymentUrl: string
  codeRepository: string
}

interface AppShowcaseProps {
  result: AppResult
  onNewProject: () => void
}

export function AppShowcase({ result, onNewProject }: AppShowcaseProps) {
  const [selectedView, setSelectedView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [selectedTab, setSelectedTab] = useState<'preview' | 'code' | 'features'>('preview')

  const viewSizes = {
    desktop: { width: '100%', height: '600px' },
    tablet: { width: '768px', height: '600px' },
    mobile: { width: '375px', height: '600px' }
  }

  const mockAppScreens = {
    login: '/api/placeholder/800/600',
    dashboard: '/api/placeholder/800/600',
    profile: '/api/placeholder/800/600'
  }

  const [currentScreen, setCurrentScreen] = useState<keyof typeof mockAppScreens>('dashboard')

  const mockCode = `// Generated App Structure
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Dashboard } from './components/Dashboard'
import { Profile } from './components/Profile'
import { AuthProvider } from './contexts/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

// Auto-generated components with best practices
// - Responsive design with Tailwind CSS
// - TypeScript for type safety
// - Modern React hooks and patterns
// - Optimized performance with code splitting`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-viby rounded-full mb-4">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold gradient-text">Your App is Ready!</h2>
        <p className="text-slate-300 text-lg">
          <span className="text-white font-semibold">{result.appName}</span> has been successfully created and deployed
        </p>
      </div>

      {/* App Info */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text mb-1">{result.framework}</div>
              <div className="text-slate-400 text-sm">Framework</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text mb-1">{result.features.length}</div>
              <div className="text-slate-400 text-sm">Features</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text mb-1">100%</div>
              <div className="text-slate-400 text-sm">Responsive</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text mb-1">5min</div>
              <div className="text-slate-400 text-sm">Build Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex space-x-2">
        {[
          { id: 'preview', name: 'Live Preview', icon: Monitor },
          { id: 'code', name: 'Generated Code', icon: Code },
          { id: 'features', name: 'Features', icon: Sparkles }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={selectedTab === tab.id ? "default" : "outline"}
            onClick={() => setSelectedTab(tab.id as any)}
            className={selectedTab === tab.id ? "gradient-button" : "glass-button"}
          >
            <tab.icon className="h-4 w-4 mr-2" />
            {tab.name}
          </Button>
        ))}
      </div>

      {/* Preview Tab */}
      {selectedTab === 'preview' && (
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <Monitor className="h-5 w-5 mr-2" />
                Live Application Preview
              </CardTitle>
              <div className="flex space-x-2">
                {[
                  { id: 'desktop', icon: Monitor },
                  { id: 'tablet', icon: Tablet },
                  { id: 'mobile', icon: Smartphone }
                ].map((device) => (
                  <Button
                    key={device.id}
                    variant={selectedView === device.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedView(device.id as any)}
                    className={selectedView === device.id ? "gradient-button" : "glass-button"}
                  >
                    <device.icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Screen Navigation */}
            <div className="flex space-x-2 mb-4">
              {Object.keys(mockAppScreens).map((screen) => (
                <Button
                  key={screen}
                  variant={currentScreen === screen ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentScreen(screen as any)}
                  className={currentScreen === screen ? "gradient-button" : "glass-button"}
                >
                  {screen.charAt(0).toUpperCase() + screen.slice(1)}
                </Button>
              ))}
            </div>

            {/* App Preview */}
            <div className="flex justify-center">
              <div 
                className="bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
                style={{ 
                  width: viewSizes[selectedView].width,
                  maxWidth: '100%',
                  height: viewSizes[selectedView].height
                }}
              >
                {/* Mock App Content */}
                <div className="h-full bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
                  {/* App Header */}
                  <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-800">{result.appName}</h3>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* App Content */}
                  <div className="flex-1 p-6">
                    {currentScreen === 'dashboard' && (
                      <div className="space-y-6">
                        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white p-4 rounded-lg shadow border">
                              <div className="h-4 bg-slate-200 rounded mb-2"></div>
                              <div className="h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded"></div>
                            </div>
                          ))}
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow border">
                          <div className="h-4 bg-slate-200 rounded mb-4 w-1/3"></div>
                          <div className="space-y-2">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="h-3 bg-slate-100 rounded"></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {currentScreen === 'login' && (
                      <div className="flex items-center justify-center h-full">
                        <div className="bg-white p-8 rounded-lg shadow-lg border max-w-md w-full">
                          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Welcome Back</h2>
                          <div className="space-y-4">
                            <div className="h-10 bg-slate-100 rounded border"></div>
                            <div className="h-10 bg-slate-100 rounded border"></div>
                            <div className="h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {currentScreen === 'profile' && (
                      <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                          <div>
                            <div className="h-4 bg-slate-200 rounded mb-2 w-24"></div>
                            <div className="h-3 bg-slate-100 rounded w-32"></div>
                          </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow border">
                          <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="flex justify-between items-center">
                                <div className="h-3 bg-slate-200 rounded w-20"></div>
                                <div className="h-8 bg-slate-100 rounded w-32"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Code Tab */}
      {selectedTab === 'code' && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Code className="h-5 w-5 mr-2" />
              Generated Source Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-slate-300 text-sm">
                <code>{mockCode}</code>
              </pre>
            </div>
            <div className="mt-4 flex space-x-4">
              <Button className="gradient-button">
                <Download className="h-4 w-4 mr-2" />
                Download Full Code
              </Button>
              <Button variant="outline" className="glass-button">
                <Github className="h-4 w-4 mr-2" />
                View on GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Tab */}
      {selectedTab === 'features' && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              Implemented Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Play className="h-4 w-4 text-green-400" />
                  </div>
                  <span className="text-white">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <h4 className="text-white font-medium mb-2">Additional Features Included:</h4>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• SEO-optimized pages and meta tags</li>
                <li>• Performance optimizations and lazy loading</li>
                <li>• Accessibility (a11y) compliance</li>
                <li>• Error boundaries and error handling</li>
                <li>• Testing setup with Jest and Testing Library</li>
                <li>• CI/CD pipeline configuration</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button className="gradient-button flex-1">
          <ExternalLink className="h-4 w-4 mr-2" />
          Open Live App
        </Button>
        <Button variant="outline" className="glass-button flex-1">
          <Github className="h-4 w-4 mr-2" />
          View Repository
        </Button>
        <Button variant="outline" className="glass-button flex-1">
          <Download className="h-4 w-4 mr-2" />
          Download Project
        </Button>
        <Button 
          variant="outline" 
          className="glass-button flex-1"
          onClick={onNewProject}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Create New Project
        </Button>
      </div>
    </div>
  )
}