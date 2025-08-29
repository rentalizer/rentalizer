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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      agent_activity: {
        Row: {
          activity_type: string
          created_at: string
          description: string
          details: Json | null
          id: string
          status: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          description: string
          details?: Json | null
          id?: string
          status?: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string
          details?: Json | null
          id?: string
          status?: string
        }
        Relationships: []
      }
      agent_config: {
        Row: {
          config_key: string
          config_value: string
          description: string | null
          id: string
          updated_at: string
        }
        Insert: {
          config_key: string
          config_value: string
          description?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          config_key?: string
          config_value?: string
          description?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      card_templates: {
        Row: {
          button_color: string | null
          button_text: string | null
          card_subtype: string | null
          card_type: string
          category: string | null
          created_at: string
          description: string | null
          external_url: string | null
          id: string
          media_url: string | null
          template_category: string
          title: string
          updated_at: string
          user_id: string
          video_type: string | null
          video_url: string | null
        }
        Insert: {
          button_color?: string | null
          button_text?: string | null
          card_subtype?: string | null
          card_type?: string
          category?: string | null
          created_at?: string
          description?: string | null
          external_url?: string | null
          id?: string
          media_url?: string | null
          template_category: string
          title: string
          updated_at?: string
          user_id: string
          video_type?: string | null
          video_url?: string | null
        }
        Update: {
          button_color?: string | null
          button_text?: string | null
          card_subtype?: string | null
          card_type?: string
          category?: string | null
          created_at?: string
          description?: string | null
          external_url?: string | null
          id?: string
          media_url?: string | null
          template_category?: string
          title?: string
          updated_at?: string
          user_id?: string
          video_type?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string | null
        }
        Relationships: []
      }
      direct_messages: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read_at: string | null
          recipient_id: string
          sender_id: string
          sender_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
          sender_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
          sender_name?: string
        }
        Relationships: []
      }
      discussion_comments: {
        Row: {
          author_name: string
          content: string
          created_at: string | null
          discussion_id: string | null
          id: string
          user_id: string
        }
        Insert: {
          author_name: string
          content: string
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          user_id: string
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_comments_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_likes: {
        Row: {
          created_at: string | null
          discussion_id: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_likes_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      discussions: {
        Row: {
          author_avatar: string | null
          author_name: string
          category: string
          comments_count: number | null
          content: string
          created_at: string | null
          id: string
          is_pinned: boolean
          likes_count: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          author_avatar?: string | null
          author_name: string
          category?: string
          comments_count?: number | null
          content: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean
          likes_count?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          author_avatar?: string | null
          author_name?: string
          category?: string
          comments_count?: number | null
          content?: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean
          likes_count?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          attendees: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          duration: string | null
          event_date: string
          event_time: string
          event_type: string | null
          id: string
          is_recurring: boolean | null
          location: string | null
          remind_members: boolean | null
          title: string
          updated_at: string | null
          zoom_link: string | null
        }
        Insert: {
          attendees?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration?: string | null
          event_date: string
          event_time: string
          event_type?: string | null
          id?: string
          is_recurring?: boolean | null
          location?: string | null
          remind_members?: boolean | null
          title: string
          updated_at?: string | null
          zoom_link?: string | null
        }
        Update: {
          attendees?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration?: string | null
          event_date?: string
          event_time?: string
          event_type?: string | null
          id?: string
          is_recurring?: boolean | null
          location?: string | null
          remind_members?: boolean | null
          title?: string
          updated_at?: string | null
          zoom_link?: string | null
        }
        Relationships: []
      }
      guidebook_analytics: {
        Row: {
          action: string
          created_at: string
          guest_ip: string | null
          guidebook_id: string
          id: string
          metadata: Json | null
        }
        Insert: {
          action: string
          created_at?: string
          guest_ip?: string | null
          guidebook_id: string
          id?: string
          metadata?: Json | null
        }
        Update: {
          action?: string
          created_at?: string
          guest_ip?: string | null
          guidebook_id?: string
          id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "guidebook_analytics_guidebook_id_fkey"
            columns: ["guidebook_id"]
            isOneToOne: false
            referencedRelation: "guidebooks"
            referencedColumns: ["id"]
          },
        ]
      }
      guidebook_cards: {
        Row: {
          button_color: string | null
          button_text: string | null
          card_subtype: string | null
          card_type: string
          category: string | null
          content: string | null
          created_at: string
          currency: string | null
          display_order: number
          external_url: string | null
          id: string
          is_template: boolean | null
          link_url: string | null
          location_address: string | null
          location_distance: string | null
          media_url: string | null
          price_cents: number | null
          rating: number | null
          section_id: string
          stripe_price_id: string | null
          template_category: string | null
          template_type: string | null
          title: string | null
          updated_at: string
          video_type: string | null
          video_url: string | null
        }
        Insert: {
          button_color?: string | null
          button_text?: string | null
          card_subtype?: string | null
          card_type?: string
          category?: string | null
          content?: string | null
          created_at?: string
          currency?: string | null
          display_order?: number
          external_url?: string | null
          id?: string
          is_template?: boolean | null
          link_url?: string | null
          location_address?: string | null
          location_distance?: string | null
          media_url?: string | null
          price_cents?: number | null
          rating?: number | null
          section_id: string
          stripe_price_id?: string | null
          template_category?: string | null
          template_type?: string | null
          title?: string | null
          updated_at?: string
          video_type?: string | null
          video_url?: string | null
        }
        Update: {
          button_color?: string | null
          button_text?: string | null
          card_subtype?: string | null
          card_type?: string
          category?: string | null
          content?: string | null
          created_at?: string
          currency?: string | null
          display_order?: number
          external_url?: string | null
          id?: string
          is_template?: boolean | null
          link_url?: string | null
          location_address?: string | null
          location_distance?: string | null
          media_url?: string | null
          price_cents?: number | null
          rating?: number | null
          section_id?: string
          stripe_price_id?: string | null
          template_category?: string | null
          template_type?: string | null
          title?: string | null
          updated_at?: string
          video_type?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guidebook_cards_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "guidebook_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      guidebook_sections: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          guidebook_id: string
          icon: string | null
          id: string
          is_collapsible: boolean | null
          is_expanded_default: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          guidebook_id: string
          icon?: string | null
          id?: string
          is_collapsible?: boolean | null
          is_expanded_default?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          guidebook_id?: string
          icon?: string | null
          id?: string
          is_collapsible?: boolean | null
          is_expanded_default?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guidebook_sections_guidebook_id_fkey"
            columns: ["guidebook_id"]
            isOneToOne: false
            referencedRelation: "guidebooks"
            referencedColumns: ["id"]
          },
        ]
      }
      guidebooks: {
        Row: {
          check_in_time: string | null
          check_out_time: string | null
          cover_photo_url: string | null
          created_at: string
          description: string | null
          guest_link_slug: string | null
          id: string
          is_active: boolean | null
          is_published: boolean
          property_address: string | null
          property_name: string
          property_type: string | null
          shareable_link: string | null
          updated_at: string
          user_id: string
          wifi_name: string | null
          wifi_password: string | null
        }
        Insert: {
          check_in_time?: string | null
          check_out_time?: string | null
          cover_photo_url?: string | null
          created_at?: string
          description?: string | null
          guest_link_slug?: string | null
          id?: string
          is_active?: boolean | null
          is_published?: boolean
          property_address?: string | null
          property_name: string
          property_type?: string | null
          shareable_link?: string | null
          updated_at?: string
          user_id: string
          wifi_name?: string | null
          wifi_password?: string | null
        }
        Update: {
          check_in_time?: string | null
          check_out_time?: string | null
          cover_photo_url?: string | null
          created_at?: string
          description?: string | null
          guest_link_slug?: string | null
          id?: string
          is_active?: boolean | null
          is_published?: boolean
          property_address?: string | null
          property_name?: string
          property_type?: string | null
          shareable_link?: string | null
          updated_at?: string
          user_id?: string
          wifi_name?: string | null
          wifi_password?: string | null
        }
        Relationships: []
      }
      lead_captures: {
        Row: {
          created_at: string
          email: string
          id: string
          last_question_at: string | null
          name: string
          phone: string
          status: string
          total_questions_asked: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          last_question_at?: string | null
          name: string
          phone: string
          status?: string
          total_questions_asked?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          last_question_at?: string | null
          name?: string
          phone?: string
          status?: string
          total_questions_asked?: number
          updated_at?: string
        }
        Relationships: []
      }
      marketplace_orders: {
        Row: {
          amount_cents: number
          card_id: string
          created_at: string
          currency: string
          guest_email: string | null
          guest_name: string | null
          guidebook_id: string
          id: string
          status: string
          stripe_payment_intent_id: string | null
          updated_at: string
        }
        Insert: {
          amount_cents: number
          card_id: string
          created_at?: string
          currency?: string
          guest_email?: string | null
          guest_name?: string | null
          guidebook_id: string
          id?: string
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          card_id?: string
          created_at?: string
          currency?: string
          guest_email?: string | null
          guest_name?: string | null
          guidebook_id?: string
          id?: string
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_orders_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "guidebook_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_orders_guidebook_id_fkey"
            columns: ["guidebook_id"]
            isOneToOne: false
            referencedRelation: "guidebooks"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          joined_at: string
          last_activity: string | null
          last_name: string | null
          membership_status: string
          phone_number: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          joined_at?: string
          last_activity?: string | null
          last_name?: string | null
          membership_status?: string
          phone_number: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          joined_at?: string
          last_activity?: string | null
          last_name?: string | null
          membership_status?: string
          phone_number?: string
          updated_at?: string
        }
        Relationships: []
      }
      news_items: {
        Row: {
          admin_submitted: boolean
          click_count: number
          content: string | null
          created_at: string
          engagement_score: number
          featured_image_url: string | null
          id: string
          is_featured: boolean
          is_pinned: boolean
          published_at: string
          source: string
          status: string
          submitted_by: string | null
          summary: string | null
          tags: string[] | null
          title: string
          updated_at: string
          url: string
          view_count: number
        }
        Insert: {
          admin_submitted?: boolean
          click_count?: number
          content?: string | null
          created_at?: string
          engagement_score?: number
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean
          is_pinned?: boolean
          published_at: string
          source: string
          status?: string
          submitted_by?: string | null
          summary?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          url: string
          view_count?: number
        }
        Update: {
          admin_submitted?: boolean
          click_count?: number
          content?: string | null
          created_at?: string
          engagement_score?: number
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean
          is_pinned?: boolean
          published_at?: string
          source?: string
          status?: string
          submitted_by?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          url?: string
          view_count?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          first_name: string | null
          id: string
          last_name: string | null
          profile_complete: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          profile_complete?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          profile_complete?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      richie_chat_usage: {
        Row: {
          answer: string | null
          created_at: string
          id: string
          lead_capture_id: string | null
          question: string
          sources_used: Json | null
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          answer?: string | null
          created_at?: string
          id?: string
          lead_capture_id?: string | null
          question: string
          sources_used?: Json | null
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          answer?: string | null
          created_at?: string
          id?: string
          lead_capture_id?: string | null
          question?: string
          sources_used?: Json | null
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "richie_chat_usage_lead_capture_id_fkey"
            columns: ["lead_capture_id"]
            isOneToOne: false
            referencedRelation: "lead_captures"
            referencedColumns: ["id"]
          },
        ]
      }
      richie_docs: {
        Row: {
          created_at: string
          doc_type: string
          embedding: string | null
          file_size: number | null
          id: string
          metadata: Json | null
          text_content: string
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          doc_type?: string
          embedding?: string | null
          file_size?: number | null
          id?: string
          metadata?: Json | null
          text_content: string
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          doc_type?: string
          embedding?: string | null
          file_size?: number | null
          id?: string
          metadata?: Json | null
          text_content?: string
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      sms_requests: {
        Row: {
          created_at: string
          error_message: string | null
          expires_at: string | null
          id: string
          link_generated: string | null
          message_content: string | null
          phone_number: string
          processed_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          expires_at?: string | null
          id?: string
          link_generated?: string | null
          message_content?: string | null
          phone_number: string
          processed_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          expires_at?: string | null
          id?: string
          link_generated?: string | null
          message_content?: string | null
          phone_number?: string
          processed_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          subscription_status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          subscription_status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          subscription_status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      can_submit_contact_message: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      debug_auth_context: {
        Args: Record<PropertyKey, never>
        Returns: {
          auth_email: string
          auth_role: string
          auth_uid: string
        }[]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_authenticated: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      make_first_admin: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      match_richie_docs: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          doc_type: string
          id: string
          similarity: number
          text_content: string
          title: string
          url: string
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
