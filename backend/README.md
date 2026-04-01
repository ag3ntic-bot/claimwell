# Claimwell Backend

Supabase-powered backend for the Claimwell mobile app. Provides authentication, database, file storage, and AI-powered claim analysis via Edge Functions.

## Architecture

```
Mobile App (Axios + Bearer JWT)
    |
    v
Supabase Edge Functions (Deno TypeScript)
    |--- Supabase Auth (email/password, JWT tokens)
    |--- PostgreSQL (11 tables, RLS policies, triggers)
    |--- Supabase Storage (evidence file uploads, signed URLs)
    |--- Anthropic API (tiered AI: Haiku / Sonnet / Opus)
```

## Directory Structure

```
backend/
  supabase/
    config.toml                    # Supabase project config
    seed.sql                       # Template seed data (5 templates)
    migrations/
      001_initial_schema.sql       # Tables, enums, indexes, triggers
      002_rls_policies.sql         # Row Level Security policies
      003_storage_setup.sql        # Evidence storage bucket
    functions/
      _shared/                     # Shared modules (imported by all functions)
        auth.ts                    # JWT verification
        cors.ts                    # CORS headers
        db.ts                      # Supabase client factory
        mappers.ts                 # snake_case <-> camelCase mappers
        response.ts                # JSON response helpers
        ai-client.ts               # Anthropic API wrapper with retry
        ai-budget.ts               # Token budget tracking
        ai-cache.ts                # 5-minute result cache
        ai-handler.ts              # Shared AI request handler
        ai-prompts.ts              # Prompt templates (8 tasks)
        ai-validation.ts           # Output validation
      auth-login/                  # POST - email/password login
      auth-signup/                 # POST - user registration
      auth-logout/                 # POST - sign out
      claims/                      # GET (list) + POST (create)
      claims-by-id/                # GET + PATCH by claim ID
      claims-summary/              # GET aggregate stats
      claims-evidence/             # GET (list) + POST (upload)
      evidence-delete/             # DELETE by evidence ID
      templates/                   # GET (list + by ID)
      templates-search/            # GET with ?q= full-text search
      user-profile/                # GET + PATCH
      user-settings/               # GET + PATCH
      ai-summarize/                # Tier 1 (Haiku) - evidence summary
      ai-extract/                  # Tier 1 - structured data extraction
      ai-detect-missing/           # Tier 1 - missing evidence detection
      ai-score-claim/              # Tier 2 (Sonnet) - claim strength scoring
      ai-analyze-response/         # Tier 2 - company response analysis
      ai-personalize-template/     # Tier 2 - template personalization
      ai-generate-strategy/        # Tier 3 (Opus) - escalation strategy
      ai-generate-draft/           # Tier 3 - appeal letter generation
  scripts/
    deploy-functions.sh            # Deploy all Edge Functions
  combined_migration.sql           # All migrations in one file (for SQL Editor)
  DEPLOY.md                        # Step-by-step deployment guide
```

## Database

11 tables with full RLS, triggers, and indexes:

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (extends auth.users via trigger) |
| `user_settings` | App preferences per user |
| `claims` | Core claims with status, strength, amounts |
| `evidence` | Uploaded files linked to claims |
| `timeline_events` | Claim status change history |
| `strategies` | Cached AI-generated escalation strategies |
| `drafts` | AI-generated appeal letters |
| `templates` | System-wide claim letter templates |
| `notifications` | User notifications |
| `ai_cache` | Server-side AI result cache (5-min TTL) |
| `ai_usage_log` | Per-user token budget tracking |

## AI Model Routing

| Task | Tier | Model | Max Tokens |
|------|------|-------|------------|
| summarize | 1 | Claude Haiku 4.5 | 500 |
| extract | 1 | Claude Haiku 4.5 | 800 |
| detect_missing | 1 | Claude Haiku 4.5 | 500 |
| score_claim | 2 | Claude Sonnet 4.6 | 1000 |
| analyze_response | 2 | Claude Sonnet 4.6 | 1500 |
| personalize_template | 2 | Claude Sonnet 4.6 | 2000 |
| generate_strategy | 3 | Claude Opus 4.6 | 2000 |
| generate_draft | 3 | Claude Opus 4.6 | 3000 |

## Deployment

See [DEPLOY.md](DEPLOY.md) for full instructions.

Quick start:
```bash
# 1. Run migrations in Supabase Dashboard SQL Editor
#    (paste combined_migration.sql)

# 2. Deploy Edge Functions
export SUPABASE_ACCESS_TOKEN="<your-token>"
./scripts/deploy-functions.sh
```

## Environment Variables

| Variable | Required | Where |
|----------|----------|-------|
| `SUPABASE_URL` | Auto-injected | Edge Functions runtime |
| `SUPABASE_ANON_KEY` | Auto-injected | Edge Functions runtime |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-injected | Edge Functions runtime |
| `ANTHROPIC_API_KEY` | Yes | Supabase Secrets (Dashboard or CLI) |
