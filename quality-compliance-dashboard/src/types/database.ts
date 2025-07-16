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
      // Quality Compliance Dashboard Tables
      compliance_metrics: {
        Row: {
          id: string
          project_id: string
          metric_type: string
          value: number
          target_value: number | null
          unit: string
          period: string
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          metric_type: string
          value: number
          target_value?: number | null
          unit: string
          period: string
          date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          metric_type?: string
          value?: number
          target_value?: number | null
          unit?: string
          period?: string
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
      capas: {
        Row: {
          id: string
          project_id: string
          capa_number: string
          title: string
          description: string | null
          type: string
          status: string
          priority: string
          due_date: string | null
          assigned_to: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          capa_number: string
          title: string
          description?: string | null
          type: string
          status?: string
          priority?: string
          due_date?: string | null
          assigned_to?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          capa_number?: string
          title?: string
          description?: string | null
          type?: string
          status?: string
          priority?: string
          due_date?: string | null
          assigned_to?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      training_records: {
        Row: {
          id: string
          project_id: string
          user_id: string
          training_name: string
          training_type: string
          status: string
          completion_date: string | null
          due_date: string | null
          score: number | null
          certificate_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          training_name: string
          training_type: string
          status?: string
          completion_date?: string | null
          due_date?: string | null
          score?: number | null
          certificate_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          training_name?: string
          training_type?: string
          status?: string
          completion_date?: string | null
          due_date?: string | null
          score?: number | null
          certificate_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      audits: {
        Row: {
          id: string
          project_id: string
          audit_number: string
          area: string
          type: string
          status: string
          auditor: string
          start_date: string
          end_date: string | null
          findings_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          audit_number: string
          area: string
          type: string
          status?: string
          auditor: string
          start_date: string
          end_date?: string | null
          findings_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          audit_number?: string
          area?: string
          type?: string
          status?: string
          auditor?: string
          start_date?: string
          end_date?: string | null
          findings_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      audit_findings: {
        Row: {
          id: string
          audit_id: string
          finding_type: string
          severity: string
          title: string
          description: string
          requirement: string | null
          corrective_action: string | null
          status: string
          due_date: string | null
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          finding_type: string
          severity: string
          title: string
          description: string
          requirement?: string | null
          corrective_action?: string | null
          status?: string
          due_date?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          finding_type?: string
          severity?: string
          title?: string
          description?: string
          requirement?: string | null
          corrective_action?: string | null
          status?: string
          due_date?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      compliance_areas: {
        Row: {
          id: string
          project_id: string
          area_name: string
          description: string | null
          score: number
          max_score: number
          last_assessment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          area_name: string
          description?: string | null
          score: number
          max_score: number
          last_assessment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          area_name?: string
          description?: string | null
          score?: number
          max_score?: number
          last_assessment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      compliance_documents: {
        Row: {
          id: string
          project_id: string
          document_name: string
          document_type: string
          file_url: string
          file_size: number
          mime_type: string
          uploaded_by: string
          category: string | null
          version: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          document_name: string
          document_type: string
          file_url: string
          file_size: number
          mime_type: string
          uploaded_by: string
          category?: string | null
          version?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          document_name?: string
          document_type?: string
          file_url?: string
          file_size?: number
          mime_type?: string
          uploaded_by?: string
          category?: string | null
          version?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}