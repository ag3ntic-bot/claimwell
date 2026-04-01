-- ============================================================================
-- Claimwell: Initial Database Schema
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- Enum Types
-- ============================================================================

CREATE TYPE claim_status AS ENUM (
  'draft', 'submitted', 'in_progress', 'reviewing', 'appealing', 'resolved', 'archived'
);

CREATE TYPE claim_category AS ENUM (
  'refund', 'warranty', 'subscription', 'delivery', 'other'
);

CREATE TYPE claim_strength_label AS ENUM ('low', 'medium', 'high');

CREATE TYPE evidence_type AS ENUM (
  'photo', 'receipt', 'email', 'chat_log', 'document', 'pdf', 'other'
);

CREATE TYPE evidence_flag AS ENUM (
  'key_evidence', 'contradiction', 'missing_info', 'ai_verified'
);

CREATE TYPE draft_tone AS ENUM ('calm', 'assertive', 'formal');

CREATE TYPE template_category AS ENUM (
  'refunds', 'warranty', 'subscription', 'delivery', 'appeals'
);

CREATE TYPE timeline_event_type AS ENUM (
  'claim_created', 'evidence_uploaded', 'email_sent', 'response_received',
  'denial_received', 'appeal_sent', 'follow_up', 'support_contact', 'resolved'
);

CREATE TYPE escalation_step_status AS ENUM ('completed', 'active', 'pending');

CREATE TYPE subscription_tier AS ENUM ('free', 'pro');

CREATE TYPE ai_task_type AS ENUM (
  'summarize', 'extract', 'score_claim', 'detect_missing',
  'generate_strategy', 'analyze_response', 'generate_draft', 'personalize_template'
);

-- ============================================================================
-- Tables
-- ============================================================================

-- profiles: extends Supabase auth.users
CREATE TABLE profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name              TEXT NOT NULL DEFAULT '',
  email             TEXT NOT NULL,
  avatar_uri        TEXT,
  subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_email ON profiles(email);

-- user_settings
CREATE TABLE user_settings (
  user_id             UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  notifications       BOOLEAN NOT NULL DEFAULT true,
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  biometric_lock      BOOLEAN NOT NULL DEFAULT false,
  dark_mode           BOOLEAN NOT NULL DEFAULT false,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- case_id sequence
CREATE SEQUENCE case_id_seq START 10001;

-- claims
CREATE TABLE claims (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  category            claim_category NOT NULL,
  company_name        TEXT NOT NULL,
  status              claim_status NOT NULL DEFAULT 'draft',
  strength            INTEGER NOT NULL DEFAULT 0 CHECK (strength >= 0 AND strength <= 100),
  strength_label      claim_strength_label NOT NULL DEFAULT 'low',
  amount_claimed      NUMERIC(12,2) NOT NULL CHECK (amount_claimed >= 0),
  amount_recovered    NUMERIC(12,2),
  resolution_progress NUMERIC(3,2) NOT NULL DEFAULT 0 CHECK (resolution_progress >= 0 AND resolution_progress <= 1),
  case_id             TEXT NOT NULL DEFAULT '',
  description         TEXT NOT NULL DEFAULT '',
  policy_number       TEXT,
  serial_number       TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at         TIMESTAMPTZ
);

CREATE INDEX idx_claims_user_id ON claims(user_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_claims_user_status ON claims(user_id, status);
CREATE INDEX idx_claims_created_at ON claims(created_at DESC);

-- evidence
CREATE TABLE evidence (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id        UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  type            evidence_type NOT NULL DEFAULT 'document',
  title           TEXT NOT NULL,
  file_name       TEXT NOT NULL,
  storage_path    TEXT NOT NULL,
  thumbnail_path  TEXT,
  flags           evidence_flag[] NOT NULL DEFAULT '{}',
  ai_summary      TEXT,
  extracted_data  JSONB,
  uploaded_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  file_size       BIGINT NOT NULL DEFAULT 0,
  mime_type       TEXT NOT NULL
);

CREATE INDEX idx_evidence_claim_id ON evidence(claim_id);

-- timeline_events
CREATE TABLE timeline_events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id    UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  type        timeline_event_type NOT NULL,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  date        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_timeline_claim_id ON timeline_events(claim_id);
CREATE INDEX idx_timeline_date ON timeline_events(claim_id, date DESC);

-- strategies (cached AI output, one per claim)
CREATE TABLE strategies (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id            UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  recommended_action  TEXT NOT NULL,
  action_description  TEXT NOT NULL,
  claim_strength      INTEGER NOT NULL,
  win_probability     NUMERIC(3,2) NOT NULL,
  attention_items     JSONB NOT NULL DEFAULT '[]',
  escalation_ladder   JSONB NOT NULL DEFAULT '[]',
  days_left_to_appeal INTEGER,
  ai_summary          TEXT NOT NULL,
  generated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(claim_id)
);

CREATE INDEX idx_strategies_claim_id ON strategies(claim_id);

-- drafts
CREATE TABLE drafts (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id         UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  tone             draft_tone NOT NULL,
  version          TEXT NOT NULL DEFAULT '1.0',
  content          TEXT NOT NULL,
  ai_reasoning     TEXT NOT NULL DEFAULT '',
  recipient_name   TEXT NOT NULL DEFAULT '',
  recipient_title  TEXT NOT NULL DEFAULT '',
  subject          TEXT NOT NULL DEFAULT '',
  generated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_drafts_claim_id ON drafts(claim_id);

-- templates (system-wide, public read)
CREATE TABLE templates (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  category      template_category NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  tags          TEXT[] NOT NULL DEFAULT '{}',
  content       TEXT NOT NULL,
  usage_count   INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_tags ON templates USING GIN(tags);
CREATE INDEX idx_templates_search ON templates USING GIN(
  (to_tsvector('english', title) || to_tsvector('english', description))
);

-- notifications
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  read        BOOLEAN NOT NULL DEFAULT false,
  claim_id    UUID REFERENCES claims(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read = false;

-- ai_cache (server-side result cache)
CREATE TABLE ai_cache (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cache_key     TEXT NOT NULL UNIQUE,
  task_type     ai_task_type NOT NULL,
  result        JSONB NOT NULL,
  tokens_used   INTEGER NOT NULL,
  model         TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at    TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_ai_cache_key ON ai_cache(cache_key);
CREATE INDEX idx_ai_cache_expires ON ai_cache(expires_at);

-- ai_usage_log (token budget tracking)
CREATE TABLE ai_usage_log (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  task_type     ai_task_type NOT NULL,
  tier          SMALLINT NOT NULL CHECK (tier IN (1, 2, 3)),
  tokens_used   INTEGER NOT NULL,
  model         TEXT NOT NULL,
  latency_ms    INTEGER NOT NULL,
  claim_id      UUID REFERENCES claims(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_usage_user_day ON ai_usage_log(user_id, created_at);
CREATE INDEX idx_ai_usage_tier ON ai_usage_log(user_id, tier, created_at);

-- ============================================================================
-- Triggers & Functions
-- ============================================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON claims
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Auto-generate case_id on claim insert
CREATE OR REPLACE FUNCTION generate_case_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.case_id IS NULL OR NEW.case_id = '' THEN
    NEW.case_id = '#CLW-' || LPAD(nextval('case_id_seq')::TEXT, 5, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_case_id BEFORE INSERT ON claims
  FOR EACH ROW EXECUTE FUNCTION generate_case_id();

-- Auto-create profile + settings on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  INSERT INTO user_settings (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Helper: get daily AI usage for budget checks
CREATE OR REPLACE FUNCTION get_daily_ai_usage(p_user_id UUID, p_tier SMALLINT)
RETURNS INTEGER AS $$
  SELECT COALESCE(SUM(tokens_used), 0)::INTEGER
  FROM ai_usage_log
  WHERE user_id = p_user_id
    AND tier = p_tier
    AND created_at >= date_trunc('day', now());
$$ LANGUAGE sql STABLE;

-- Auto-create timeline event when claim status changes
CREATE OR REPLACE FUNCTION handle_claim_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO timeline_events (claim_id, type, title, description)
    VALUES (
      NEW.id,
      CASE NEW.status
        WHEN 'submitted' THEN 'claim_created'
        WHEN 'resolved' THEN 'resolved'
        WHEN 'appealing' THEN 'appeal_sent'
        ELSE 'follow_up'
      END,
      'Status changed to ' || NEW.status,
      'Claim status updated from ' || OLD.status || ' to ' || NEW.status
    );

    -- Auto-set resolved_at
    IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
      NEW.resolved_at = now();
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_claim_status_change BEFORE UPDATE ON claims
  FOR EACH ROW EXECUTE FUNCTION handle_claim_status_change();
