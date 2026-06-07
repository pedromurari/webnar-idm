export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type WatchStage =
  | 'registered'
  | 'entered'
  | 'watched_25'
  | 'watched_50'
  | 'watched_75'
  | 'completed'
  | 'cta_seen'
  | 'offer_clicked'

export type SessionStatus = 'scheduled' | 'live' | 'ended'
export type SaleStatus = 'approved' | 'refunded' | 'pending' | 'cancelled'
export type SalePlatform = 'mercado_pago' | 'vega' | 'hotmart' | 'kiwify' | 'manual'

export interface PaymentOption {
  type: 'vega' | 'mercado_pago' | 'hotmart' | 'kiwify' | 'wpp'
  label: string
  url: string
}

export interface Database {
  public: {
    Tables: {
      webinars: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          presenter_name: string | null
          presenter_bio: string | null
          presenter_photo_url: string | null
          thumbnail_url: string | null
          video_url: string
          video_duration_seconds: number
          session_interval_minutes: number
          offer_appears_at_seconds: number | null
          offer_title: string | null
          offer_cta_text: string | null
          payment_config: PaymentOption[] | null
          wpp_group_url: string | null
          evolution_api_url: string | null
          evolution_api_key: string | null
          min_fake_viewers: number
          max_fake_viewers: number
          pixel_id: string | null
          active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['webinars']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['webinars']['Insert']>
      }
      sessions: {
        Row: {
          id: string
          webinar_id: string
          start_time: string
          status: SessionStatus
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['sessions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['sessions']['Insert']>
      }
      registrations: {
        Row: {
          id: string
          session_id: string
          webinar_id: string
          name: string
          email: string
          phone: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_term: string | null
          device: string | null
          browser: string | null
          os: string | null
          ip: string | null
          country: string | null
          city: string | null
          watch_stage: WatchStage
          room_entered_at: string | null
          max_watched_pct: number
          cta_seen_at: string | null
          offer_clicked_at: string | null
          email_sent: boolean
          wpp_sent: boolean
          is_repeat: boolean
          repeat_count: number
          whatsapp_instance_id: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['registrations']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['registrations']['Insert']>
      }
      scripted_comments: {
        Row: {
          id: string
          webinar_id: string
          author_name: string
          author_initials: string | null
          message: string
          appears_at_seconds: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['scripted_comments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['scripted_comments']['Insert']>
      }
      live_messages: {
        Row: {
          id: string
          session_id: string
          user_name: string
          message: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['live_messages']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['live_messages']['Insert']>
      }
      whatsapp_instances: {
        Row: {
          id: string
          instance_name: string
          evolution_url: string
          api_key: string
          status: 'connected' | 'disconnected' | 'connecting'
          phone_number: string | null
          messages_sent_today: number
          last_used_at: string | null
          active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['whatsapp_instances']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['whatsapp_instances']['Insert']>
      }
      sales: {
        Row: {
          id: string
          webinar_id: string | null
          registration_id: string | null
          platform: SalePlatform
          product_name: string
          gross_amount: number
          platform_fee_pct: number
          platform_fee_fixed: number
          net_amount: number
          status: SaleStatus
          payment_method: string | null
          customer_name: string | null
          customer_email: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          platform_transaction_id: string | null
          paid_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['sales']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['sales']['Insert']>
      }
      meta_rules: {
        Row: {
          id: string
          name: string
          level: 'campaign' | 'adset' | 'ad'
          target_id: string
          condition_metric: 'cpl' | 'roas' | 'spend' | 'leads' | 'ctr'
          condition_operator: 'gt' | 'lt' | 'eq'
          condition_value: number
          condition_period_days: number
          action: 'pause' | 'resume' | 'increase_budget' | 'decrease_budget' | 'notify'
          action_value: string | null
          active: boolean
          last_triggered_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['meta_rules']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['meta_rules']['Insert']>
      }
      performance_snapshots: {
        Row: {
          id: string
          webinar_id: string
          date: string
          registrations_count: number
          room_entered_count: number
          watched_50_count: number
          cta_seen_count: number
          offer_clicked_count: number
          conversion_rate: number
          avg_watch_pct: number
          top_utm_source: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['performance_snapshots']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['performance_snapshots']['Insert']>
      }
      ai_suggestions: {
        Row: {
          id: string
          webinar_id: string
          type: 'copy' | 'comment' | 'email' | 'wpp'
          suggestion: string
          reasoning: string | null
          status: 'pending' | 'approved' | 'applied' | 'rejected'
          created_at: string
          applied_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['ai_suggestions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['ai_suggestions']['Insert']>
      }
    }
  }
}
