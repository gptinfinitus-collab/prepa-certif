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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      ai_messages: {
        Row: {
          certification_id: string | null
          content: string
          created_at: string
          id: string
          role: string
          sources: Json
          thread_id: string | null
          user_id: string
        }
        Insert: {
          certification_id?: string | null
          content: string
          created_at?: string
          id?: string
          role: string
          sources?: Json
          thread_id?: string | null
          user_id: string
        }
        Update: {
          certification_id?: string | null
          content?: string
          created_at?: string
          id?: string
          role?: string
          sources?: Json
          thread_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "certifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          chapters: Json
          code: string
          created_at: string
          description: string | null
          family: string | null
          has_curriculum: boolean
          id: string
          is_custom: boolean
          name: string
          owner_id: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          chapters?: Json
          code: string
          created_at?: string
          description?: string | null
          family?: string | null
          has_curriculum?: boolean
          id?: string
          is_custom?: boolean
          name: string
          owner_id?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          chapters?: Json
          code?: string
          created_at?: string
          description?: string | null
          family?: string | null
          has_curriculum?: boolean
          id?: string
          is_custom?: boolean
          name?: string
          owner_id?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      chat_threads: {
        Row: {
          certification_id: string | null
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          certification_id?: string | null
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          certification_id?: string | null
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_threads_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "certifications"
            referencedColumns: ["id"]
          },
        ]
      }
      document_chunks: {
        Row: {
          chunk_index: number
          content: string
          created_at: string
          document_id: string
          embedding: string | null
          id: string
          user_id: string
        }
        Insert: {
          chunk_index: number
          content: string
          created_at?: string
          document_id: string
          embedding?: string | null
          id?: string
          user_id: string
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string
          document_id?: string
          embedding?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "library_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      library_documents: {
        Row: {
          certification_id: string | null
          chunk_count: number
          created_at: string
          error: string | null
          id: string
          is_partial: boolean
          kind: string
          name: string
          status: string
          storage_path: string
          user_id: string
        }
        Insert: {
          certification_id?: string | null
          chunk_count?: number
          created_at?: string
          error?: string | null
          id?: string
          is_partial?: boolean
          kind?: string
          name: string
          status?: string
          storage_path: string
          user_id: string
        }
        Update: {
          certification_id?: string | null
          chunk_count?: number
          created_at?: string
          error?: string | null
          id?: string
          is_partial?: boolean
          kind?: string
          name?: string
          status?: string
          storage_path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_documents_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "certifications"
            referencedColumns: ["id"]
          },
        ]
      }
      module_progress: {
        Row: {
          certification_id: string
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          module_id: number
          self_score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          certification_id: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          module_id: number
          self_score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          certification_id?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          module_id?: number
          self_score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_progress_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "certifications"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active_track: string
          avatar_url: string | null
          created_at: string
          disabled_at: string | null
          display_name: string | null
          exam_body: string | null
          first_name: string | null
          id: string
          last_name: string | null
          onboarded_at: string | null
          updated_at: string
        }
        Insert: {
          active_track?: string
          avatar_url?: string | null
          created_at?: string
          disabled_at?: string | null
          display_name?: string | null
          exam_body?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          onboarded_at?: string | null
          updated_at?: string
        }
        Update: {
          active_track?: string
          avatar_url?: string | null
          created_at?: string
          disabled_at?: string | null
          display_name?: string | null
          exam_body?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          onboarded_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quiz_answers: {
        Row: {
          chapter: string | null
          choices: Json | null
          clause: string | null
          created_at: string
          expected: string | null
          explanation: string | null
          feedback: string | null
          id: string
          is_correct: boolean
          position: number
          question: string
          score: number
          session_id: string
          user_answer: string | null
          user_id: string
        }
        Insert: {
          chapter?: string | null
          choices?: Json | null
          clause?: string | null
          created_at?: string
          expected?: string | null
          explanation?: string | null
          feedback?: string | null
          id?: string
          is_correct?: boolean
          position?: number
          question: string
          score?: number
          session_id: string
          user_answer?: string | null
          user_id: string
        }
        Update: {
          chapter?: string | null
          choices?: Json | null
          clause?: string | null
          created_at?: string
          expected?: string | null
          explanation?: string | null
          feedback?: string | null
          id?: string
          is_correct?: boolean
          position?: number
          question?: string
          score?: number
          session_id?: string
          user_answer?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_answers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "quiz_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_sessions: {
        Row: {
          certification_id: string | null
          correct: number
          created_at: string
          difficulty: string
          id: string
          mode: string
          scope: string
          score: number
          source_count: number
          topic: string | null
          total: number
          user_id: string
        }
        Insert: {
          certification_id?: string | null
          correct?: number
          created_at?: string
          difficulty?: string
          id?: string
          mode?: string
          scope?: string
          score?: number
          source_count?: number
          topic?: string | null
          total?: number
          user_id: string
        }
        Update: {
          certification_id?: string | null
          correct?: number
          created_at?: string
          difficulty?: string
          id?: string
          mode?: string
          scope?: string
          score?: number
          source_count?: number
          topic?: string | null
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_sessions_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "certifications"
            referencedColumns: ["id"]
          },
        ]
      }
      study_plans: {
        Row: {
          certification_id: string
          created_at: string
          exam_date: string | null
          modules_per_day: number
          start_date: string
          study_days: number[]
          updated_at: string
          user_id: string
        }
        Insert: {
          certification_id: string
          created_at?: string
          exam_date?: string | null
          modules_per_day?: number
          start_date?: string
          study_days?: number[]
          updated_at?: string
          user_id: string
        }
        Update: {
          certification_id?: string
          created_at?: string
          exam_date?: string | null
          modules_per_day?: number
          start_date?: string
          study_days?: number[]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_plans_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "certifications"
            referencedColumns: ["id"]
          },
        ]
      }
      user_certifications: {
        Row: {
          certification_id: string
          created_at: string
          id: string
          is_active: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          certification_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          certification_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_certifications_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "certifications"
            referencedColumns: ["id"]
          },
        ]
      }
      user_flashcard_progress: {
        Row: {
          card_key: string
          certification_id: string | null
          created_at: string
          id: string
          module_id: number
          review_count: number
          reviewed_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          card_key: string
          certification_id?: string | null
          created_at?: string
          id?: string
          module_id: number
          review_count?: number
          reviewed_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          card_key?: string
          certification_id?: string | null
          created_at?: string
          id?: string
          module_id?: number
          review_count?: number
          reviewed_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_flashcard_progress_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "certifications"
            referencedColumns: ["id"]
          },
        ]
      }
      user_lesson_progress: {
        Row: {
          certification_id: string
          completed: boolean
          completed_at: string | null
          created_at: string
          current_section: string | null
          id: string
          last_activity_at: string
          module_id: number
          quiz_submitted: boolean
          sections_read: string[]
          time_spent_seconds: number
          track: string
          updated_at: string
          user_id: string
        }
        Insert: {
          certification_id: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          current_section?: string | null
          id?: string
          last_activity_at?: string
          module_id: number
          quiz_submitted?: boolean
          sections_read?: string[]
          time_spent_seconds?: number
          track?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          certification_id?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          current_section?: string | null
          id?: string
          last_activity_at?: string
          module_id?: number
          quiz_submitted?: boolean
          sections_read?: string[]
          time_spent_seconds?: number
          track?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "certifications"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notes: {
        Row: {
          certification_id: string | null
          content: string
          created_at: string
          id: string
          module_id: number
          section_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          certification_id?: string | null
          content?: string
          created_at?: string
          id?: string
          module_id: number
          section_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          certification_id?: string | null
          content?: string
          created_at?: string
          id?: string
          module_id?: number
          section_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notes_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "certifications"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_topic_mastery: {
        Row: {
          attempts: number
          certification_id: string | null
          correct: number
          created_at: string
          id: string
          last_seen_at: string
          topic: string
          track: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attempts?: number
          certification_id?: string | null
          correct?: number
          created_at?: string
          id?: string
          last_seen_at?: string
          topic: string
          track?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attempts?: number
          certification_id?: string | null
          correct?: number
          created_at?: string
          id?: string
          last_seen_at?: string
          topic?: string
          track?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_topic_mastery_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "certifications"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      match_document_chunks: {
        Args: { match_count?: number; query_embedding: string }
        Returns: {
          content: string
          document_id: string
          id: string
          similarity: number
        }[]
      }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "user"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "admin", "user"],
    },
  },
} as const
