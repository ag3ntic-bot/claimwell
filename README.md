# Claimwell

[![CI](https://github.com/ag3ntic-bot/claimwell/actions/workflows/ci.yml/badge.svg)](https://github.com/ag3ntic-bot/claimwell/actions/workflows/ci.yml)

Premium mobile app for insurance claims, disputes, reimbursements, warranty issues, appeals, and evidence-driven resolution workflows.

Built with the **"Serene Advocate"** design system — a calm, high-trust editorial aesthetic for guiding users through complex claims processes.

## Quick Start

```bash
cd claimwell

# Install dependencies
npm install --legacy-peer-deps

# Start Expo dev server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### iOS Setup

```bash
# Ensure Xcode + iOS simulator installed
xcode-select --install

# Install CocoaPods (if not installed)
sudo gem install cocoapods

# Start with iOS
npm run ios
```

### Android Setup

```bash
# Ensure Android Studio + emulator configured
# Set ANDROID_HOME environment variable
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools

# Start with Android
npm run android
```

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start Expo dev server |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm test` | Run test suite (256 tests) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run typecheck` | TypeScript strict type checking |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier format |
| `npm run format:check` | Prettier check |

## Architecture

### Stack

| Layer | Choice |
|---|---|
| Framework | React Native 0.81 + Expo SDK 54 (New Architecture) |
| Routing | Expo Router v6 (file-based, typed routes) |
| Client State | Zustand v5 |
| Server State | TanStack Query v5 |
| Forms | React Hook Form v7 + Zod v4 |
| Styling | Nativewind v4 + StyleSheet.create (design system primitives) |
| Animations | React Native Reanimated 4 |
| Storage | MMKV (local), expo-secure-store (sensitive) |
| Networking | Axios with retry interceptor + TanStack Query caching |
| Testing | Jest 29 + RNTL + MSW + Maestro (E2E) |

### Design System: "The Serene Advocate"

Premium, calm, high-trust editorial aesthetic.

- **Colors:** Trust Navy (#4B5F7E), muted off-whites, no harsh borders
- **Typography:** Manrope (headlines) + Inter (body), with system fallbacks
- **Icons:** Material Symbols via @expo/vector-icons mapping
- **Surfaces:** Layered system (Level 0/1/2) — structure via background shifts, never borders
- **Corners:** xl (24px) for containers and buttons
- **Shadows:** Ambient only (24px blur, 6% opacity), platform-aware (iOS shadow / Android elevation)
- **Glassmorphism:** Semi-transparent backgrounds on header and tab bar

### AI Architecture

3-tier model routing with cost controls:

| Tier | Models | Use Cases | Budget |
|---|---|---|---|
| Tier 1 (cheap) | Haiku / GPT-4o-mini | Extraction, summarization, classification | 500K tokens/day |
| Tier 2 (mid) | Sonnet / GPT-4o | Scoring, response analysis, template personalization | 300K tokens/day |
| Tier 3 (strong) | Opus / o1-pro | Strategy generation, appeal/draft writing | 100K tokens/day |

**Cost controls:**
- Tiered routing — cheapest sufficient model per task
- Response caching with 5-min TTL
- Token budget tracking with 80% warning threshold
- Automatic tier-3 → tier-2 fallback on failure
- Retry with exponential backoff (2 retries for T1/T2, 1 for T3)
- Zod validation on all AI outputs
- Observable: request start/end, retries, fallbacks, budget warnings, errors

**Provider abstraction:** `AIProvider` interface allows swapping models without changing feature code. Mock provider for testing returns fixture data with simulated latency.

## Project Structure

```
app/                        # Expo Router screens (31 files)
  _layout.tsx               # Root: fonts, QueryClient, SafeArea, ErrorBoundary
  (auth)/                   # Onboarding, sign-in, sign-up
  (tabs)/                   # Main tab navigator (5 tabs)
    claims/[id]/            # Claim detail with 5 internal tabs
    new-claim/              # 5-step claim wizard
    profile/                # Settings sub-screens
  templates/                # Template library + detail
  resolved/                 # Resolved claim celebration
  response-analyzer.tsx     # Response analysis tool

src/
  components/
    ui/                     # Design system primitives (16 components)
    claim/                  # Claim compound components (12)
    draft/                  # Draft editor components (4)
    analyzer/               # Response analyzer components (5)
    template/               # Template components (3)
    dashboard/              # Dashboard components (4)
    common/                 # Shared: ErrorBoundary, ClaimProgress, etc. (5)
  services/
    api/                    # Axios client (retry, auth), typed endpoints
    ai/                     # AI provider abstraction + task router
      providers/            # Mock (fixture-based), Anthropic (stub)
      tasks/                # 8 task functions with Zod-validated outputs
      prompts/              # Versioned prompt templates
      validation.ts         # Zod schemas for all AI output types
    storage/                # MMKV + SecureStore wrappers
  stores/                   # Zustand stores (auth, claims, draft, onboarding, ui)
  hooks/                    # TanStack Query hooks, useAuth, useClaimForm
  types/                    # Domain type definitions (9 files)
  theme/                    # Design tokens, typography, platform shadows, global CSS
  utils/                    # Formatters, validation schemas, constants
  testing/                  # Setup, render wrapper, fixtures, mocks (MSW, icons, gradient)

e2e/                        # Maestro E2E flows (14 YAML files)
```

## Screens (12)

| # | Screen | Route | Design Source |
|---|---|---|---|
| 1 | Onboarding | `/(auth)/onboarding` | code copy 5.html |
| 2 | Dashboard | `/(tabs)/` | code copy.html |
| 3 | Claims List | `/(tabs)/claims/` | — |
| 4 | Claim Detail (5 tabs) | `/(tabs)/claims/[id]/` | code.html |
| 5 | New Claim (5 steps) | `/(tabs)/new-claim/` | code copy 4.html |
| 6 | Strategy Hub | `/(tabs)/strategy` | — |
| 7 | Response Analyzer | `/response-analyzer` | code copy 8.html |
| 8 | Template Library | `/templates/` | code copy 10.html |
| 9 | Template Detail | `/templates/[id]` | — |
| 10 | Resolved Claim | `/resolved/[id]` | code copy 7.html |
| 11 | Profile & Settings | `/(tabs)/profile/` | code copy 6.html |
| 12 | Profile Sub-screens | `/(tabs)/profile/*` | — |

## Testing

### Unit + Integration Tests (Jest)

**29 suites, 256 tests — all passing**

| Category | Suites | Tests |
|---|---|---|
| Unit (utils) | 2 | 34 |
| Unit (stores) | 4 | 26 |
| Service (AI router, mock, validation) | 4 | 25 |
| Service (AI tasks) | 2 | 8 |
| Service (API) | 2 | 14 |
| Service (storage) | 1 | 7 |
| Component (UI primitives) | 6 | 47 |
| Component (domain) | 5 | 43 |
| Hooks (queries, mutations, auth, form) | 3 | 17 |

```bash
npm test                    # Run all 256 tests
npm run test:coverage       # With coverage report
npm run test:watch          # Watch mode
```

### E2E Tests (Maestro)

14 Maestro flows covering all critical user journeys.

```bash
# Install Maestro CLI
curl -Ls 'https://get.maestro.mobile.dev' | bash

# Run all flows
./e2e/run-tests.sh

# Smoke tests only
./e2e/run-tests.sh --smoke

# Single flow
./e2e/run-tests.sh e2e/flows/04-new-claim.yaml
```

| Flow | Description | Tag |
|---|---|---|
| 01-launch | App launch, onboarding visible | smoke |
| 02-onboarding | Full sign-in flow | critical |
| 03-dashboard | Dashboard stats and claims | critical |
| 04-new-claim | 5-step claim wizard | critical |
| 05-claim-detail | All 5 detail tabs | critical |
| 06-evidence | Evidence tab and upload | critical |
| 07-strategy | Strategy Hub | critical |
| 08-response-analyzer | Paste reply, analyze | critical |
| 09-draft-generator | Tone selection, draft | critical |
| 10-templates | Template library | critical |
| 11-profile | Profile and settings | critical |
| 12-resolved-claim | Resolution celebration | critical |
| smoke-test | Full critical path | smoke |

### CI Pipeline

```yaml
# .github/workflows/ci.yml
jobs:
  lint:     npx eslint 'src/**/*.{ts,tsx}' 'app/**/*.{ts,tsx}'
  typecheck: npx tsc --noEmit
  test:     npx jest --no-coverage
  build-ios: eas build --platform ios --profile preview
  build-android: eas build --platform android --profile preview
  e2e:     ./e2e/run-tests.sh --smoke  # nightly
```

## Mocked vs Production-Ready

### Production-Ready

- Full navigation structure with Expo Router (typed routes)
- Design system primitives (all follow DESIGN.md spec)
- Domain type system with Zod validation
- AI service architecture (provider abstraction, tiered routing, caching, retry, budget tracking, output validation, prompt versioning)
- State management (Zustand stores, TanStack Query hooks)
- Form validation (Zod schemas, multi-step wizard with auto-save)
- All 12 screens with loading/empty/error states
- ErrorBoundary for runtime error recovery
- KeyboardAvoidingView on all form screens
- API client with retry interceptor and typed errors
- Platform-aware shadows (iOS/Android)
- Font loading with system fallbacks
- 256 passing tests + 14 E2E flows
- TypeScript strict mode, zero errors

### Mocked (requires backend for production)

| Feature | Current State | What's Needed |
|---|---|---|
| **API calls** | Fall back to fixture data when API unreachable in dev | Real backend API endpoints |
| **AI providers** | MockAIProvider returns fixtures; AnthropicProvider stub ready | API keys in environment config |
| **Authentication** | Dev mode auto-succeeds login | OAuth/email auth endpoints |
| **Image upload** | Picker UI built, upload mock | S3/R2 presigned URL endpoint |
| **OCR pipeline** | Service boundary defined | Google Cloud Vision API key |
| **Push notifications** | Not implemented | expo-notifications + backend |
| **Error tracking** | Console logging, Sentry hooks defined | Sentry DSN configuration |
| **OTA updates** | expo-updates installed | EAS Update channel config |

## Environment Configuration

```
eas.json defines 3 profiles:
  development → localhost:3000, dev client
  preview     → api-preview.claimwell.app
  production  → api.claimwell.app
```

## Recommended Next Steps

1. **Backend API** — Implement REST endpoints matching `src/services/api/` contracts
2. **Authentication** — Add OAuth provider (Google/Apple) + email/password flow
3. **AI providers** — Configure Anthropic API key, enable real model calls
4. **Image upload** — Add S3 presigned URL endpoint for evidence photos
5. **Push notifications** — Add expo-notifications + backend trigger service
6. **Sentry** — Configure sentry-expo with DSN for crash reporting
7. **EAS Build** — Run `eas build` for iOS/Android preview builds
8. **App Store** — Prepare screenshots, metadata, privacy policy
