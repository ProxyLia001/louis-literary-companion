export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      bible_entries: {
        Row: {
          created_at: string
          details: Json
          id: string
          kind: string
          name: string
          notes: string | null
          project_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          details?: Json
          id?: string
          kind: string
          name: string
          notes?: string | null
          project_id: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          details?: Json
          id?: string
          kind?: string
          name?: string
          notes?: string | null
          project_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bible_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          content: string
          created_at: string
          id: string
          position: number
          project_id: string
          summary: string | null
          title: string
          updated_at: string
          user_id: string
          word_count: number
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          position?: number
          project_id: string
          summary?: string | null
          title: string
          updated_at?: string
          user_id?: string
          word_count?: number
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          position?: number
          project_id?: string
          summary?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          word_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "chapters_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      continuity_issues: {
        Row: {
          chapter_id: string | null
          created_at: string
          description: string
          evidence: string | null
          id: string
          issue_type: string
          project_id: string
          status: string
          user_id: string
        }
        Insert: {
          chapter_id?: string | null
          created_at?: string
          description: string
          evidence?: string | null
          id?: string
          issue_type: string
          project_id: string
          status?: string
          user_id?: string
        }
        Update: {
          chapter_id?: string | null
          created_at?: string
          description?: string
          evidence?: string | null
          id?: string
          issue_type?: string
          project_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "continuity_issues_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "continuity_issues_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          mode: string
          project_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mode?: string
          project_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          mode?: string
          project_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      edit_sessions: {
        Row: {
          analysis: string | null
          chapter_id: string | null
          created_at: string
          id: string
          mode: number
          original_text: string
          project_id: string | null
          user_id: string
        }
        Insert: {
          analysis?: string | null
          chapter_id?: string | null
          created_at?: string
          id?: string
          mode: number
          original_text: string
          project_id?: string | null
          user_id?: string
        }
        Update: {
          analysis?: string | null
          chapter_id?: string | null
          created_at?: string
          id?: string
          mode?: number
          original_text?: string
          project_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "edit_sessions_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edit_sessions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      edit_suggestions: {
        Row: {
          created_at: string
          id: string
          original: string
          rationale: string | null
          session_id: string
          significance: string
          status: string
          suggestion: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          original: string
          rationale?: string | null
          session_id: string
          significance?: string
          status?: string
          suggestion: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          original?: string
          rationale?: string | null
          session_id?: string
          significance?: string
          status?: string
          suggestion?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "edit_suggestions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "edit_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      memories: {
        Row: {
          category: string | null
          content: string
          created_at: string
          embedding: string | null
          id: string
          is_active: boolean
          layer: string
          project_id: string | null
          source_excerpt: string | null
          source_ref: string | null
          source_type: string | null
          supersedes: string | null
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          embedding?: string | null
          id?: string
          is_active?: boolean
          layer?: string
          project_id?: string | null
          source_excerpt?: string | null
          source_ref?: string | null
          source_type?: string | null
          supersedes?: string | null
          updated_at?: string
          user_id?: string
          version?: number
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          embedding?: string | null
          id?: string
          is_active?: boolean
          layer?: string
          project_id?: string | null
          source_excerpt?: string | null
          source_ref?: string | null
          source_type?: string | null
          supersedes?: string | null
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "memories_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memories_supersedes_fkey"
            columns: ["supersedes"]
            isOneToOne: false
            referencedRelation: "memories"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          parts: Json
          role: string
          saved: boolean
          user_id: string
        }
        Insert: {
          content?: string
          conversation_id: string
          created_at?: string
          id?: string
          parts?: Json
          role: string
          saved?: boolean
          user_id?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          parts?: Json
          role?: string
          saved?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          genre: string | null
          id: string
          narrative_perspective: string | null
          status: string
          synopsis: string | null
          themes: string[]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          genre?: string | null
          id?: string
          narrative_perspective?: string | null
          status?: string
          synopsis?: string | null
          themes?: string[]
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          genre?: string | null
          id?: string
          narrative_perspective?: string | null
          status?: string
          synopsis?: string | null
          themes?: string[]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      research_briefs: {
        Row: {
          brief: string | null
          category: string | null
          created_at: string
          id: string
          project_id: string | null
          question: string
          user_id: string
        }
        Insert: {
          brief?: string | null
          category?: string | null
          created_at?: string
          id?: string
          project_id?: string | null
          question: string
          user_id?: string
        }
        Update: {
          brief?: string | null
          category?: string | null
          created_at?: string
          id?: string
          project_id?: string | null
          question?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_briefs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      research_sources: {
        Row: {
          abstract: string | null
          authors: string | null
          brief_id: string
          created_at: string
          doi: string | null
          id: string
          provider: string | null
          title: string
          url: string | null
          user_id: string
          venue: string | null
          verified: boolean
          year: number | null
        }
        Insert: {
          abstract?: string | null
          authors?: string | null
          brief_id: string
          created_at?: string
          doi?: string | null
          id?: string
          provider?: string | null
          title: string
          url?: string | null
          user_id?: string
          venue?: string | null
          verified?: boolean
          year?: number | null
        }
        Update: {
          abstract?: string | null
          authors?: string | null
          brief_id?: string
          created_at?: string
          doi?: string | null
          id?: string
          provider?: string | null
          title?: string
          url?: string | null
          user_id?: string
          venue?: string | null
          verified?: boolean
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "research_sources_brief_id_fkey"
            columns: ["brief_id"]
            isOneToOne: false
            referencedRelation: "research_briefs"
            referencedColumns: ["id"]
          },
        ]
      }
      writer_profile_versions: {
        Row: {
          change_note: string | null
          created_at: string
          id: string
          profile: Json
          source: string | null
          user_id: string
          version: number
        }
        Insert: {
          change_note?: string | null
          created_at?: string
          id?: string
          profile?: Json
          source?: string | null
          user_id?: string
          version: number
        }
        Update: {
          change_note?: string | null
          created_at?: string
          id?: string
          profile?: Json
          source?: string | null
          user_id?: string
          version?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
