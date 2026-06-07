-- IDM Webinários — Schema completo
-- Execute no Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- WEBINARS
-- ============================================================
CREATE TABLE webinars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  presenter_name TEXT,
  presenter_bio TEXT,
  presenter_photo_url TEXT,
  thumbnail_url TEXT,
  video_url TEXT NOT NULL DEFAULT '',
  video_duration_seconds INTEGER NOT NULL DEFAULT 3600,
  session_interval_minutes INTEGER NOT NULL DEFAULT 30,
  offer_appears_at_seconds INTEGER,
  offer_title TEXT,
  offer_cta_text TEXT DEFAULT 'QUERO GARANTIR MINHA VAGA',
  payment_config JSONB DEFAULT '[]',
  wpp_group_url TEXT,
  evolution_api_url TEXT,
  evolution_api_key TEXT,
  min_fake_viewers INTEGER DEFAULT 50,
  max_fake_viewers INTEGER DEFAULT 180,
  pixel_id TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- SESSIONS (grade de 30 em 30 min, 06h-23h BRT)
-- ============================================================
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webinar_id UUID REFERENCES webinars(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'live', 'ended')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_sessions_webinar_start ON sessions(webinar_id, start_time);
CREATE INDEX idx_sessions_status ON sessions(status);

-- ============================================================
-- REGISTRATIONS (leads)
-- ============================================================
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  webinar_id UUID REFERENCES webinars(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  -- UTM tracking
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  -- Device info
  device TEXT,
  browser TEXT,
  os TEXT,
  ip TEXT,
  country TEXT,
  city TEXT,
  -- Behavioral tracking
  watch_stage TEXT NOT NULL DEFAULT 'registered'
    CHECK (watch_stage IN ('registered','entered','watched_25','watched_50','watched_75','completed','cta_seen','offer_clicked')),
  room_entered_at TIMESTAMPTZ,
  max_watched_pct INTEGER DEFAULT 0,
  cta_seen_at TIMESTAMPTZ,
  offer_clicked_at TIMESTAMPTZ,
  -- Automations
  email_sent BOOLEAN DEFAULT false,
  wpp_sent BOOLEAN DEFAULT false,
  whatsapp_instance_id UUID,
  -- Repeat lead tracking
  is_repeat BOOLEAN DEFAULT false,
  repeat_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_registrations_email_webinar ON registrations(email, webinar_id);
CREATE INDEX idx_registrations_session ON registrations(session_id);
CREATE INDEX idx_registrations_watch_stage ON registrations(watch_stage);
CREATE INDEX idx_registrations_created_at ON registrations(created_at DESC);

-- ============================================================
-- SCRIPTED COMMENTS (fake/pre-programmed)
-- ============================================================
CREATE TABLE scripted_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webinar_id UUID REFERENCES webinars(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_initials TEXT,
  message TEXT NOT NULL,
  appears_at_seconds INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_scripted_webinar ON scripted_comments(webinar_id, appears_at_seconds);

-- ============================================================
-- LIVE MESSAGES (real chat)
-- ============================================================
CREATE TABLE live_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_live_messages_session ON live_messages(session_id, created_at);

-- ============================================================
-- WHATSAPP INSTANCES (Evolution API multi-instance)
-- ============================================================
CREATE TABLE whatsapp_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_name TEXT UNIQUE NOT NULL,
  evolution_url TEXT NOT NULL,
  api_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'disconnected'
    CHECK (status IN ('connected', 'disconnected', 'connecting')),
  phone_number TEXT,
  messages_sent_today INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- SALES
-- ============================================================
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webinar_id UUID REFERENCES webinars(id),
  registration_id UUID REFERENCES registrations(id),
  platform TEXT NOT NULL CHECK (platform IN ('mercado_pago','vega','hotmart','kiwify','manual')),
  product_name TEXT NOT NULL,
  gross_amount NUMERIC(10,2) NOT NULL,
  platform_fee_pct NUMERIC(5,2) DEFAULT 0,
  platform_fee_fixed NUMERIC(10,2) DEFAULT 0,
  net_amount NUMERIC(10,2) GENERATED ALWAYS AS (
    gross_amount - (gross_amount * platform_fee_pct / 100) - platform_fee_fixed
  ) STORED,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('approved','refunded','pending','cancelled')),
  payment_method TEXT,
  customer_name TEXT,
  customer_email TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  platform_transaction_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_sales_webinar ON sales(webinar_id);
CREATE INDEX idx_sales_status ON sales(status);
CREATE INDEX idx_sales_paid_at ON sales(paid_at DESC);
CREATE INDEX idx_sales_platform_tx ON sales(platform_transaction_id);

-- ============================================================
-- META ADS RULES
-- ============================================================
CREATE TABLE meta_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('campaign','adset','ad')),
  target_id TEXT NOT NULL,
  condition_metric TEXT NOT NULL CHECK (condition_metric IN ('cpl','roas','spend','leads','ctr')),
  condition_operator TEXT NOT NULL CHECK (condition_operator IN ('gt','lt','eq')),
  condition_value NUMERIC NOT NULL,
  condition_period_days INTEGER NOT NULL DEFAULT 1,
  action TEXT NOT NULL CHECK (action IN ('pause','resume','increase_budget','decrease_budget','notify')),
  action_value TEXT,
  active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- PERFORMANCE SNAPSHOTS (daily analytics)
-- ============================================================
CREATE TABLE performance_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webinar_id UUID REFERENCES webinars(id),
  date DATE NOT NULL,
  registrations_count INTEGER DEFAULT 0,
  room_entered_count INTEGER DEFAULT 0,
  watched_50_count INTEGER DEFAULT 0,
  cta_seen_count INTEGER DEFAULT 0,
  offer_clicked_count INTEGER DEFAULT 0,
  conversion_rate NUMERIC(5,2) DEFAULT 0,
  avg_watch_pct NUMERIC(5,2) DEFAULT 0,
  top_utm_source TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(webinar_id, date)
);

-- ============================================================
-- AI SUGGESTIONS
-- ============================================================
CREATE TABLE ai_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webinar_id UUID REFERENCES webinars(id),
  type TEXT NOT NULL CHECK (type IN ('copy','comment','email','wpp')),
  suggestion TEXT NOT NULL,
  reasoning TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','applied','rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  applied_at TIMESTAMPTZ
);

-- ============================================================
-- ENABLE REALTIME (for viewer count and live chat)
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE live_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripted_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;

-- Public read for webinars and sessions (needed for capture pages)
CREATE POLICY "public_read_webinars" ON webinars FOR SELECT USING (active = true);
CREATE POLICY "public_read_sessions" ON sessions FOR SELECT USING (true);

-- Public insert for registrations and live messages
CREATE POLICY "public_insert_registrations" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_live_messages" ON live_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_live_messages" ON live_messages FOR SELECT USING (true);
CREATE POLICY "public_read_scripted_comments" ON scripted_comments FOR SELECT USING (true);

-- Service role has full access (used by API routes with SUPABASE_SERVICE_ROLE_KEY)
CREATE POLICY "service_all_webinars" ON webinars FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_sessions" ON sessions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_registrations" ON registrations FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_scripted" ON scripted_comments FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_live_messages" ON live_messages FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_whatsapp" ON whatsapp_instances FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_sales" ON sales FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_meta_rules" ON meta_rules FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_snapshots" ON performance_snapshots FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_ai_suggestions" ON ai_suggestions FOR ALL USING (auth.role() = 'service_role');

-- Authenticated users (admin) can read everything
CREATE POLICY "auth_read_all_registrations" ON registrations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "auth_read_all_sales" ON sales FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "auth_read_whatsapp" ON whatsapp_instances FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "auth_read_meta_rules" ON meta_rules FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_scripted" ON scripted_comments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_webinars" ON webinars FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_read_snapshots" ON performance_snapshots FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "auth_read_ai_suggestions" ON ai_suggestions FOR ALL USING (auth.role() = 'authenticated');
