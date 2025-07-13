'use client'

import { useEffect } from 'react'

export function EnvChecker() {
  useEffect(() => {
    // Log all environment variables that start with NEXT_PUBLIC_
    console.log('=== Environment Variables Debug ===')
    console.log('NEXT_PUBLIC_BYPASS_AUTH:', process.env.NEXT_PUBLIC_BYPASS_AUTH)
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('All NEXT_PUBLIC_ vars:', 
      Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_'))
        .reduce((acc, key) => {
          acc[key] = process.env[key]
          return acc
        }, {} as Record<string, string | undefined>)
    )
    console.log('=== End Environment Debug ===')
  }, [])

  // Only show in development or when bypass is enabled
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_BYPASS_AUTH !== 'true') {
    return null
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      right: 0, 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <div><strong>Debug Info:</strong></div>
      <div>BYPASS_AUTH: {process.env.NEXT_PUBLIC_BYPASS_AUTH || 'undefined'}</div>
      <div>NODE_ENV: {process.env.NODE_ENV}</div>
      <div>Bypass Active: {process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true' ? 'YES' : 'NO'}</div>
    </div>
  )
}