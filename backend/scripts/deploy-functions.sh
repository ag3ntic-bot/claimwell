#!/bin/bash
# Deploy all Claimwell Edge Functions to Supabase
# Prerequisite: SUPABASE_ACCESS_TOKEN must be set
# Usage: ./scripts/deploy-functions.sh

set -e

cd "$(dirname "$0")/.."

if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
  echo "Error: SUPABASE_ACCESS_TOKEN is not set."
  echo "Generate one at https://supabase.com/dashboard/account/tokens"
  echo "Then run: export SUPABASE_ACCESS_TOKEN=<your-token>"
  exit 1
fi

PROJECT_REF="${SUPABASE_PROJECT_REF:-ygblbpfkteqqfbzfhbgb}"

echo "Linking project $PROJECT_REF..."
supabase link --project-ref "$PROJECT_REF" 2>/dev/null || true

if [ -n "$ANTHROPIC_API_KEY" ]; then
  echo ""
  echo "Setting ANTHROPIC_API_KEY secret..."
  supabase secrets set ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY"
fi

echo ""
echo "Deploying Edge Functions..."

# All functions use --no-verify-jwt because Supabase Auth issues ES256 tokens
# but the Edge Functions gateway only verifies HS256. Our code handles auth
# via supabase.auth.getUser() in _shared/auth.ts.
FUNCTIONS=(
  auth-login auth-signup auth-logout
  claims claims-by-id claims-summary claims-evidence evidence-delete
  templates templates-search
  user-profile user-settings
  ai-summarize ai-extract ai-detect-missing ai-score-claim
  ai-analyze-response ai-personalize-template
  ai-generate-strategy ai-generate-draft
)

for fn in "${FUNCTIONS[@]}"; do
  echo "  Deploying $fn..."
  supabase functions deploy "$fn" --no-verify-jwt
done

echo ""
echo "All functions deployed successfully!"
echo ""
echo "Test with:"
echo "  curl -X POST https://$PROJECT_REF.supabase.co/functions/v1/auth-signup \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -H 'apikey: <anon-key>' \\"
echo "    -d '{\"email\":\"test@test.com\",\"password\":\"Test1234!\",\"name\":\"Test\"}'"
