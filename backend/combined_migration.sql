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
-- ============================================================================
-- Claimwell: Row Level Security Policies
-- ============================================================================

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- user_settings
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- claims
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own claims"
  ON claims FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own claims"
  ON claims FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own claims"
  ON claims FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- evidence (access through claim ownership)
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view evidence for own claims"
  ON evidence FOR SELECT
  USING (claim_id IN (SELECT id FROM claims WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert evidence for own claims"
  ON evidence FOR INSERT
  WITH CHECK (claim_id IN (SELECT id FROM claims WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete evidence for own claims"
  ON evidence FOR DELETE
  USING (claim_id IN (SELECT id FROM claims WHERE user_id = auth.uid()));

-- timeline_events
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view timeline for own claims"
  ON timeline_events FOR SELECT
  USING (claim_id IN (SELECT id FROM claims WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert timeline for own claims"
  ON timeline_events FOR INSERT
  WITH CHECK (claim_id IN (SELECT id FROM claims WHERE user_id = auth.uid()));

-- strategies
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view strategies for own claims"
  ON strategies FOR SELECT
  USING (claim_id IN (SELECT id FROM claims WHERE user_id = auth.uid()));

CREATE POLICY "Users can upsert strategies for own claims"
  ON strategies FOR INSERT
  WITH CHECK (claim_id IN (SELECT id FROM claims WHERE user_id = auth.uid()));

CREATE POLICY "Users can update strategies for own claims"
  ON strategies FOR UPDATE
  USING (claim_id IN (SELECT id FROM claims WHERE user_id = auth.uid()));

-- drafts
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view drafts for own claims"
  ON drafts FOR SELECT
  USING (claim_id IN (SELECT id FROM claims WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert drafts for own claims"
  ON drafts FOR INSERT
  WITH CHECK (claim_id IN (SELECT id FROM claims WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own drafts"
  ON drafts FOR DELETE
  USING (claim_id IN (SELECT id FROM claims WHERE user_id = auth.uid()));

-- templates (public read)
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view templates"
  ON templates FOR SELECT USING (true);

-- notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ai_cache (service role only - no user RLS)
ALTER TABLE ai_cache ENABLE ROW LEVEL SECURITY;

-- ai_usage_log (users can read their own)
ALTER TABLE ai_usage_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI usage"
  ON ai_usage_log FOR SELECT USING (user_id = auth.uid());
-- ============================================================================
-- Claimwell: Storage Bucket Setup
-- ============================================================================

-- Create evidence bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'evidence',
  'evidence',
  false,
  52428800,  -- 50MB
  ARRAY[
    'image/jpeg', 'image/png', 'image/webp', 'image/heic',
    'application/pdf',
    'text/plain', 'text/html',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
);

-- Storage RLS: users can upload to their own folder
CREATE POLICY "Users can upload evidence"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'evidence'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- Storage RLS: users can read from their own folder
CREATE POLICY "Users can read own evidence"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'evidence'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- Storage RLS: users can delete from their own folder
CREATE POLICY "Users can delete own evidence"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'evidence'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );
-- ============================================================================
-- Claimwell: Seed Data (Templates)
-- ============================================================================

INSERT INTO templates (id, title, category, description, tags, content, usage_count) VALUES
(
  'a0000000-0000-4000-8000-000000000001',
  'Product Refund Request',
  'refunds',
  'Standard template for requesting a refund on a defective or unsatisfactory product. Covers consumer protection rights and warranty claims.',
  ARRAY['refund', 'product', 'defective', 'warranty'],
  E'Dear [Company Name] Customer Support,\n\nI am writing to request a full refund for [Product Name] purchased on [Purchase Date] for [Amount].\n\n**Issue Description:**\n[Describe the issue with the product]\n\n**Supporting Evidence:**\n- Purchase receipt (attached)\n- Photos of the defect (attached)\n\nUnder [applicable consumer protection law], I am entitled to a refund for products that are not fit for purpose. I have attempted to resolve this through [previous steps taken], but the issue remains unresolved.\n\nI request a full refund of [Amount] to my original payment method within 14 business days.\n\nPlease confirm receipt of this request and provide a timeline for resolution.\n\nSincerely,\n[Your Name]',
  342
),
(
  'a0000000-0000-4000-8000-000000000002',
  'Warranty Claim Letter',
  'warranty',
  'Formal warranty claim template for products within warranty period. Includes references to warranty terms and manufacturer obligations.',
  ARRAY['warranty', 'manufacturer', 'repair', 'replacement'],
  E'Dear [Manufacturer/Retailer],\n\nI am writing to submit a warranty claim for my [Product Name], serial number [Serial Number], purchased on [Purchase Date].\n\n**Product Information:**\n- Product: [Product Name]\n- Serial Number: [Serial Number]\n- Purchase Date: [Purchase Date]\n- Warranty Expiration: [Warranty End Date]\n\n**Issue Description:**\n[Describe the defect or malfunction in detail]\n\nThis issue falls within the scope of the manufacturer''s warranty, which covers [relevant warranty terms]. I have not modified the product or used it outside of its intended purpose.\n\n**Requested Resolution:**\nI request [repair/replacement/refund] as provided under the warranty terms.\n\nI have attached the following documentation:\n1. Proof of purchase\n2. Photos/videos of the defect\n3. Copy of warranty documentation\n\nPlease respond within 10 business days with next steps.\n\nThank you,\n[Your Name]',
  278
),
(
  'a0000000-0000-4000-8000-000000000003',
  'Subscription Cancellation & Refund',
  'subscription',
  'Template for disputing unauthorized subscription charges, requesting cancellation, and demanding refund for services not rendered.',
  ARRAY['subscription', 'cancellation', 'unauthorized', 'recurring charge'],
  E'Dear [Company Name] Billing Department,\n\nI am writing regarding unauthorized/unwanted charges on my account [Account Number/Email].\n\n**Charge Details:**\n- Amount: [Amount]\n- Date(s): [Charge Dates]\n- Description: [Charge Description]\n\n**Issue:**\n[Explain why the charges are disputed - e.g., service was cancelled, never authorized, terms changed without notice]\n\n**Actions Requested:**\n1. Immediate cancellation of my subscription\n2. Full refund of [Amount] for charges dating back to [Date]\n3. Written confirmation that no future charges will be made\n\nI have previously attempted to resolve this by [previous steps]. If this matter is not resolved within 14 days, I will file a complaint with [relevant consumer agency] and dispute the charges with my financial institution.\n\nPlease confirm receipt and provide a case number.\n\nRegards,\n[Your Name]',
  456
),
(
  'a0000000-0000-4000-8000-000000000004',
  'Missing/Damaged Delivery Claim',
  'delivery',
  'Template for filing claims about packages that were never delivered, arrived damaged, or contained wrong items.',
  ARRAY['delivery', 'shipping', 'damaged', 'missing package', 'wrong item'],
  E'Dear [Company Name/Carrier] Customer Service,\n\nI am writing to report an issue with my recent order.\n\n**Order Information:**\n- Order Number: [Order Number]\n- Order Date: [Order Date]\n- Expected Delivery: [Expected Date]\n- Tracking Number: [Tracking Number]\n\n**Issue:**\n[Select one: Package never delivered / Package arrived damaged / Wrong item received]\n\n[Detailed description of the issue]\n\n**Evidence:**\n- Photos of [damaged package/wrong item] (attached)\n- Screenshot of tracking information (attached)\n- Communication with delivery driver/carrier (if applicable)\n\n**Requested Resolution:**\nI request [full refund / replacement shipment / store credit] for this order.\n\nPlease investigate this matter and respond within 5 business days.\n\nThank you,\n[Your Name]',
  189
),
(
  'a0000000-0000-4000-8000-000000000005',
  'Formal Appeal Letter',
  'appeals',
  'Comprehensive appeal template for when an initial claim has been denied. Structured to address denial reasons and present additional evidence.',
  ARRAY['appeal', 'denial', 'escalation', 'formal', 'reconsideration'],
  E'Dear [Company Name] Appeals Department,\n\nRe: Appeal of Claim Denial - Case Number [Case Number]\n\nI am writing to formally appeal the denial of my claim dated [Denial Date]. After careful review of the denial letter and the applicable policies, I believe the denial was made in error.\n\n**Original Claim Summary:**\n- Claim Date: [Original Claim Date]\n- Claim Amount: [Amount]\n- Category: [Category]\n- Denial Reason: [Stated reason for denial]\n\n**Grounds for Appeal:**\n\n1. **[First Ground]:** [Explain why the denial reason is incorrect or insufficient, citing specific policy language, consumer protection laws, or precedent]\n\n2. **[Second Ground]:** [Present additional evidence or context not considered in the original review]\n\n3. **[Third Ground]:** [Reference any applicable regulations, warranty terms, or contractual obligations]\n\n**Additional Evidence:**\n[List new supporting documents being submitted with this appeal]\n\n**Requested Action:**\nI respectfully request that you overturn the denial and [approve the claim / issue a refund of Amount / provide replacement]. If this appeal is denied, please provide a detailed written explanation of the reasons and information about further escalation options.\n\nI expect a response within [timeframe per applicable regulations]. If I do not receive a satisfactory response, I will escalate this matter to [regulatory body/BBB/attorney general].\n\nSincerely,\n[Your Name]\n\nEnclosures:\n- Original claim documentation\n- Denial letter dated [Date]\n- [Additional evidence items]',
  523
);
