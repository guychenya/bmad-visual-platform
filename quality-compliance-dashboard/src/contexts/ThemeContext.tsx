'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'auto'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  effectiveTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('dark')

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('viby-settings')
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        const savedTheme = settings.preferences?.theme || 'dark'
        setTheme(savedTheme)
      }
    } catch (error) {
      console.error('Failed to load theme:', error)
    }
  }, [])

  // Update effective theme based on theme setting and system preference
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      setEffectiveTheme(mediaQuery.matches ? 'dark' : 'light')
      
      const handleChange = (e: MediaQueryListEvent) => {
        setEffectiveTheme(e.matches ? 'dark' : 'light')
      }
      
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      setEffectiveTheme(theme)
    }
  }, [theme])

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    
    if (effectiveTheme === 'light') {
      root.classList.add('light-theme')
      root.classList.remove('dark-theme')
    } else {
      root.classList.add('dark-theme')
      root.classList.remove('light-theme')
    }
  }, [effectiveTheme])

  // Listen for theme changes from settings page
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedSettings = localStorage.getItem('viby-settings')
        if (savedSettings) {
          const settings = JSON.parse(savedSettings)
          const savedTheme = settings.preferences?.theme || 'dark'
          setTheme(savedTheme)
        }
      } catch (error) {
        console.error('Failed to load theme from storage change:', error)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}