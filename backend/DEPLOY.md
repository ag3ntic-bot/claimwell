# Claimwell Backend Deployment Guide

## Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) installed
- A Supabase project created at [supabase.com](https://supabase.com)
- An [Anthropic API key](https://console.anthropic.com)

## Step 1: Run Database Migrations

1. Go to your Supabase Dashboard
2. Open **SQL Editor**
3. Paste the contents of `combined_migration.sql` and click **Run**
4. All tables, RLS policies, storage bucket, and seed templates will be created

## Step 2: Generate a Supabase Access Token

1. Go to **Account > Access Tokens** in the Supabase Dashboard
2. Generate a new token
3. Export it in your terminal:

```bash
export SUPABASE_ACCESS_TOKEN="<your-token>"
```

## Step 3: Deploy Edge Functions

```bash
cd backend
./scripts/deploy-functions.sh
```

The script will:
- Link to your Supabase project
- Set the `ANTHROPIC_API_KEY` secret
- Deploy all 20 Edge Functions

> Note: Update the project ref and API key in `scripts/deploy-functions.sh` before running.

## Step 4: Verify

```bash
# Test signup
curl -X POST "https://<project-ref>.supabase.co/functions/v1/auth-signup" \
  -H "Content-Type: application/json" \
  -H "apikey: <your-anon-key>" \
  -d '{"email":"test@example.com","password":"TestPass1234","name":"Test User"}'

# Test claims (use the token from signup response)
curl "https://<project-ref>.supabase.co/functions/v1/claims" \
  -H "apikey: <your-anon-key>" \
  -H "Authorization: Bearer <token-from-signup>"
```

## Step 5: Run the Mobile App

```bash
npx expo start
```

Scan the QR code with Expo Go. The app connects to the Supabase backend.

## Environment Variables

Set these as Supabase secrets via the Dashboard or CLI:

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Anthropic API key for AI features |

The following are auto-injected by Supabase into Edge Functions:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
