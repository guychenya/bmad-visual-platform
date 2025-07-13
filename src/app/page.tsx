'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '../components/auth/LoginForm'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if auth bypass is enabled
    const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true'
    
    if (bypassAuth) {
      // Redirect to simplified chat interface
      router.push('/chat?template=Custom%20Project&project=new')
    }
  }, [router])

  // If auth is bypassed, show loading while redirecting
  if (process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true') {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading BMad Chat...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            BMad Visual Platform
          </h1>
          <p className="text-lg text-gray-600">
            Where AI meets beautiful development
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}