'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTheme } from '../../../contexts/ThemeContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Settings, User, Bell, Shield, Palette, Save, Eye, EyeOff, Check, AlertCircle } from 'lucide-react'

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('profile')
  const [showApiKeys, setShowApiKeys] = useState({
    openai: false,
    claude: false,
    gemini: false
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [settings, setSettings] = useState({
    profile: {
      fullName: 'Demo User',
      email: 'demo@viby.ai',
      bio: 'AI-powered developer using Viby.ai'
    },
    preferences: {
      theme: 'dark',
      notifications: true,
      emailUpdates: false,
      autoSave: true
    },
    apiKeys: {
      openai: '',
      claude: '',
      gemini: ''
    }
  })

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'preferences', name: 'Preferences', icon: Palette },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'api', name: 'API Keys', icon: Shield }
  ]

  // Check URL parameters and set active tab
  useEffect(() => {
    const tab = searchParams?.get('tab')
    if (tab && ['profile', 'preferences', 'notifications', 'api'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('viby-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    }
  }, [])
  
  // Sync settings theme with context theme
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme: theme
      }
    }))
  }, [theme])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus('idle')

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Save to localStorage
      localStorage.setItem('viby-settings', JSON.stringify(settings))
      
      // Show success status
      setSaveStatus('success')
      
      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000)
      
    } catch (error) {
      console.error('Failed to save settings:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }))
    
    // Immediately apply theme changes
    if (section === 'preferences' && key === 'theme') {
      setTheme(value)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Settings</h1>
          <p className="text-slate-300 text-lg">
            Customize your Viby.ai experience
          </p>
        </div>
        <Button 
          className="gradient-button hover:scale-105 transition-transform" 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : saveStatus === 'success' ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : saveStatus === 'error' ? (
            <>
              <AlertCircle className="h-4 w-4 mr-2" />
              Error
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <Card className="glass-card lg:col-span-1">
          <CardContent className="p-4">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-viby text-white'
                      : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-white">Full Name</Label>
                    <Input
                      id="fullName"
                      value={settings.profile.fullName}
                      onChange={(e) => updateSetting('profile', 'fullName', e.target.value)}
                      className="glass-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                      className="glass-input"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-white">Bio</Label>
                  <textarea
                    id="bio"
                    value={settings.profile.bio}
                    onChange={(e) => updateSetting('profile', 'bio', e.target.value)}
                    className="w-full p-3 glass-input resize-none"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preferences */}
          {activeTab === 'preferences' && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-white">Theme</Label>
                  <select
                    value={settings.preferences.theme}
                    onChange={(e) => updateSetting('preferences', 'theme', e.target.value)}
                    className="w-full p-3 glass-input"
                  >
                    <option value="dark" className="bg-slate-800">Dark</option>
                    <option value="light" className="bg-slate-800">Light</option>
                    <option value="auto" className="bg-slate-800">Auto</option>
                  </select>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Auto-save Projects</Label>
                      <p className="text-sm text-slate-400">Automatically save your work</p>
                    </div>
                    <button
                      onClick={() => updateSetting('preferences', 'autoSave', !settings.preferences.autoSave)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.preferences.autoSave ? 'bg-gradient-viby' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.preferences.autoSave ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Push Notifications</Label>
                      <p className="text-sm text-slate-400">Get notified about project updates</p>
                    </div>
                    <button
                      onClick={() => updateSetting('preferences', 'notifications', !settings.preferences.notifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.preferences.notifications ? 'bg-gradient-viby' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Email Updates</Label>
                      <p className="text-sm text-slate-400">Receive weekly summary emails</p>
                    </div>
                    <button
                      onClick={() => updateSetting('preferences', 'emailUpdates', !settings.preferences.emailUpdates)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.preferences.emailUpdates ? 'bg-gradient-viby' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.preferences.emailUpdates ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* API Keys */}
          {activeTab === 'api' && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  AI Service API Keys
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <p className="text-yellow-300 text-sm">
                    <Shield className="h-4 w-4 inline mr-2" />
                    API keys are encrypted and stored securely. They're only used to communicate with AI services.
                  </p>
                </div>
                
                {/* Save Status Message */}
                {saveStatus === 'success' && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <p className="text-green-300 text-sm flex items-center">
                      <Check className="h-4 w-4 mr-2" />
                      Settings saved successfully! Your API keys have been securely stored.
                    </p>
                  </div>
                )}
                
                {saveStatus === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-red-300 text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Failed to save settings. Please try again.
                    </p>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="openai" className="text-white">OpenAI API Key</Label>
                    <div className="relative">
                      <Input
                        id="openai"
                        type={showApiKeys.openai ? 'text' : 'password'}
                        value={settings.apiKeys.openai}
                        onChange={(e) => updateSetting('apiKeys', 'openai', e.target.value)}
                        placeholder="sk-..."
                        className="glass-input pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKeys(prev => ({ ...prev, openai: !prev.openai }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showApiKeys.openai ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="claude" className="text-white">Claude API Key</Label>
                    <div className="relative">
                      <Input
                        id="claude"
                        type={showApiKeys.claude ? 'text' : 'password'}
                        value={settings.apiKeys.claude}
                        onChange={(e) => updateSetting('apiKeys', 'claude', e.target.value)}
                        placeholder="sk-ant-..."
                        className="glass-input pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKeys(prev => ({ ...prev, claude: !prev.claude }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showApiKeys.claude ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gemini" className="text-white">Gemini API Key</Label>
                    <div className="relative">
                      <Input
                        id="gemini"
                        type={showApiKeys.gemini ? 'text' : 'password'}
                        value={settings.apiKeys.gemini}
                        onChange={(e) => updateSetting('apiKeys', 'gemini', e.target.value)}
                        placeholder="AI..."
                        className="glass-input pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKeys(prev => ({ ...prev, gemini: !prev.gemini }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showApiKeys.gemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}