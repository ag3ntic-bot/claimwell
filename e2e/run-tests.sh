#!/usr/bin/env bash
set -euo pipefail

# Maestro E2E Test Runner for Claimwell
# Usage:
#   ./e2e/run-tests.sh              # Run all flows
#   ./e2e/run-tests.sh --smoke      # Run smoke-tagged flows only
#   ./e2e/run-tests.sh --critical   # Run critical-tagged flows only
#   ./e2e/run-tests.sh <flow>       # Run a single flow file

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FLOWS_DIR="$SCRIPT_DIR/flows"

# Check maestro is installed
if ! command -v maestro &> /dev/null; then
  echo "Error: maestro CLI not found. Install it with:"
  echo "  curl -Ls 'https://get.maestro.mobile.dev' | bash"
  exit 1
fi

if [[ "${1:-}" == "--smoke" ]]; then
  echo "Running smoke tests..."
  maestro test --tags smoke "$FLOWS_DIR"
elif [[ "${1:-}" == "--critical" ]]; then
  echo "Running critical tests..."
  maestro test --tags critical "$FLOWS_DIR"
elif [[ -n "${1:-}" ]]; then
  echo "Running single flow: $1"
  maestro test "$1"
else
  echo "Running all E2E flows..."
  maestro test "$FLOWS_DIR"
fi
