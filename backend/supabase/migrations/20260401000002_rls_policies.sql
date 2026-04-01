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
