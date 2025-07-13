'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Github, Chrome, MessageSquare, Loader2, Sparkles } from 'lucide-react'

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{email?: string, password?: string}>({})
  const [touched, setTouched] = useState<{email?: boolean, password?: boolean}>({})

  // Form validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return 'Email is required'
    if (!emailRegex.test(email)) return 'Please enter a valid email address'
    return ''
  }

  const validatePassword = (password: string) => {
    if (!password) return 'Password is required'
    if (password.length < 6) return 'Password must be at least 6 characters'
    return ''
  }

  // Real-time validation
  useEffect(() => {
    if (touched.email) {
      const emailError = validateEmail(email)
      setFieldErrors(prev => ({ ...prev, email: emailError }))
    }
  }, [email, touched.email])

  useEffect(() => {
    if (touched.password) {
      const passwordError = validatePassword(password)
      setFieldErrors(prev => ({ ...prev, password: passwordError }))
    }
  }, [password, touched.password])

  const handleBlur = (field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleSocialLogin = async (provider: 'google' | 'github' | 'discord') => {
    setIsLoading(true)
    setError('')
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      
      if (error) throw error
    } catch (error: any) {
      setError('Failed to sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all fields as touched for validation
    setTouched({ email: true, password: true })
    
    // Validate all fields
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    
    setFieldErrors({ email: emailError, password: passwordError })
    
    // Don't submit if there are validation errors
    if (emailError || passwordError) {
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
    } catch (error: any) {
      setError('Invalid credentials. Please check your email and password.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJhIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNMjAgMjBtLTEwIDBoMjBhMTAgMTAgMCAwIDEgMCAyMGgtMjBhMTAgMTAgMCAwIDEgMC0yMFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjEiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPgo8L3N2Zz4=')] opacity-20"></div>
      
      <Card className="glass-card w-full max-w-md animate-scale-in">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-purple-400 animate-pulse-slow" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-viby rounded-full animate-ping"></div>
            </div>
          </div>
          <CardTitle className="text-3xl gradient-text font-bold">
            Welcome to Viby.ai
          </CardTitle>
          <CardDescription className="text-slate-300">
            Where AI meets beautiful development
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div 
              role="alert"
              aria-live="assertive"
              className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md glass-blur"
            >
              {error}
            </div>
          )}

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full glass-button hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              aria-label="Sign in with Google"
            >
              <Chrome className="mr-2 h-4 w-4" aria-hidden="true" />
              Continue with Google
            </Button>
            
            <Button
              variant="outline"
              className="w-full glass-button hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading}
              aria-label="Sign in with GitHub"
            >
              <Github className="mr-2 h-4 w-4" aria-hidden="true" />
              Continue with GitHub
            </Button>
            
            <Button
              variant="outline"
              className="w-full glass-button hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              onClick={() => handleSocialLogin('discord')}
              disabled={isLoading}
              aria-label="Sign in with Discord"
            >
              <MessageSquare className="mr-2 h-4 w-4" aria-hidden="true" />
              Continue with Discord
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-slate-400">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                required
                disabled={isLoading}
                className={`glass-input focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  fieldErrors.email 
                    ? 'border-red-400 focus:ring-red-400' 
                    : touched.email && !fieldErrors.email 
                      ? 'border-green-400 focus:ring-green-400'
                      : 'focus:ring-purple-500'
                }`}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? 'email-error' : 'email-help'}
              />
              {fieldErrors.email && (
                <p id="email-error" role="alert" className="text-red-400 text-sm">
                  {fieldErrors.email}
                </p>
              )}
              {!fieldErrors.email && (
                <p id="email-help" className="text-slate-400 text-xs">
                  Enter your email address
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur('password')}
                required
                disabled={isLoading}
                className={`glass-input focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  fieldErrors.password 
                    ? 'border-red-400 focus:ring-red-400' 
                    : touched.password && !fieldErrors.password 
                      ? 'border-green-400 focus:ring-green-400'
                      : 'focus:ring-purple-500'
                }`}
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? 'password-error' : 'password-help'}
              />
              {fieldErrors.password && (
                <p id="password-error" role="alert" className="text-red-400 text-sm">
                  {fieldErrors.password}
                </p>
              )}
              {!fieldErrors.password && (
                <p id="password-help" className="text-slate-400 text-xs">
                  Enter your password (minimum 6 characters)
                </p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full gradient-button hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2" 
              disabled={isLoading || !!fieldErrors.email || !!fieldErrors.password}
              aria-describedby={isLoading ? "signing-in-status" : undefined}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  <span id="signing-in-status">Signing in...</span>
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                  Sign In
                </>
              )}
            </Button>
          </form>
          
          <div className="text-center text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <a href="/auth/signup" className="text-purple-400 hover:text-purple-300 transition-colors">
              Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}