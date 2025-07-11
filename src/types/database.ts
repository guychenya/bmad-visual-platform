export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          owner_id: string
          config: any
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          owner_id: string
          config?: any
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          owner_id?: string
          config?: any
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: string
          permissions: any
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role?: string
          permissions?: any
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role?: string
          permissions?: any
          created_at?: string
        }
      }
      agents: {
        Row: {
          id: string
          project_id: string
          type: string
          name: string
          config: any
          state: any
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          type: string
          name: string
          config?: any
          state?: any
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          type?: string
          name?: string
          config?: any
          state?: any
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          project_id: string
          agent_id: string
          user_id: string
          messages: any[]
          metadata: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          agent_id: string
          user_id: string
          messages?: any[]
          metadata?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          agent_id?: string
          user_id?: string
          messages?: any[]
          metadata?: any
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          project_id: string
          type: string
          title: string
          content: string | null
          metadata: any
          version: number
          status: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          type: string
          title: string
          content?: string | null
          metadata?: any
          version?: number
          status?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          type?: string
          title?: string
          content?: string | null
          metadata?: any
          version?: number
          status?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      stories: {
        Row: {
          id: string
          project_id: string
          epic_id: string | null
          title: string
          description: string | null
          acceptance_criteria: string[] | null
          tasks: any[]
          status: string
          priority: number
          story_points: number | null
          assigned_to: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          epic_id?: string | null
          title: string
          description?: string | null
          acceptance_criteria?: string[] | null
          tasks?: any[]
          status?: string
          priority?: number
          story_points?: number | null
          assigned_to?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          epic_id?: string | null
          title?: string
          description?: string | null
          acceptance_criteria?: string[] | null
          tasks?: any[]
          status?: string
          priority?: number
          story_points?: number | null
          assigned_to?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workflows: {
        Row: {
          id: string
          project_id: string
          type: string
          name: string
          steps: any[]
          current_step: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          type: string
          name: string
          steps?: any[]
          current_step?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          type?: string
          name?: string
          steps?: any[]
          current_step?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      integrations: {
        Row: {
          id: string
          project_id: string
          type: string
          config: any
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          type: string
          config?: any
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          type?: string
          config?: any
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          project_id: string
          user_id: string
          action: string
          entity_type: string
          entity_id: string | null
          details: any
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          action: string
          entity_type: string
          entity_id?: string | null
          details?: any
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          action?: string
          entity_type?: string
          entity_id?: string | null
          details?: any
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          project_id: string
          type: string
          title: string
          message: string | null
          is_read: boolean
          metadata: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          type: string
          title: string
          message?: string | null
          is_read?: boolean
          metadata?: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          type?: string
          title?: string
          message?: string | null
          is_read?: boolean
          metadata?: any
          created_at?: string
        }
      }
    }
  }
}