'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { Database } from '../types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if authentication is bypassed
    const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true'
    
    if (bypassAuth) {
      // Create mock user data for development
      const mockUser = {
        id: 'mock-user-id',
        email: 'demo@bmad.dev',
        user_metadata: { full_name: 'Demo User' },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        role: 'authenticated'
      } as User

      const mockSession = {
        user: mockUser,
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        expires_at: Date.now() + 3600 * 1000,
        token_type: 'bearer'
      } as Session

      const mockProfile = {
        id: 'mock-profile-id',
        user_id: 'mock-user-id',
        username: 'demo-user',
        full_name: 'Demo User',
        avatar_url: null,
        bio: 'Demo user for development',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Profile

      setUser(mockUser)
      setSession(mockSession)
      setProfile(mockProfile)
      setLoading(false)
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      profile, 
      loading, 
      signOut, 
      refreshProfile 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}