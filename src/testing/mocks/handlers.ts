import { http, HttpResponse } from 'msw';
import {
  mockClaims,
  mockEvidence,
  mockStrategy,
  mockTemplates,
  mockUser,
  mockSettings,
} from '@/testing/fixtures';

const BASE_URL = 'http://localhost:3000';

export const handlers = [
  // GET /api/claims - list all claims
  http.get(`${BASE_URL}/api/claims`, () => {
    return HttpResponse.json({ data: mockClaims });
  }),

  // GET /api/claims/:id - get single claim
  http.get(`${BASE_URL}/api/claims/:id`, ({ params }) => {
    const { id } = params;
    const claim = mockClaims.find((c) => c.id === id);
    if (!claim) {
      return HttpResponse.json({ error: 'Claim not found' }, { status: 404 });
    }
    return HttpResponse.json({ data: claim });
  }),

  // POST /api/claims - create new claim
  http.post(`${BASE_URL}/api/claims`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const newClaim = {
      id: 'clm_new',
      userId: 'usr_01',
      status: 'draft',
      strength: 0,
      strengthLabel: 'low',
      amountRecovered: null,
      resolutionProgress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resolvedAt: null,
      caseId: '#NEW-00001',
      ...body,
    };
    return HttpResponse.json({ data: newClaim }, { status: 201 });
  }),

  // GET /api/claims/:id/evidence - get evidence for a claim
  http.get(`${BASE_URL}/api/claims/:id/evidence`, ({ params }) => {
    const { id } = params;
    const evidence = mockEvidence.filter((e) => e.claimId === id);
    return HttpResponse.json({ data: evidence });
  }),

  // GET /api/claims/:id/strategy - get strategy for a claim
  http.get(`${BASE_URL}/api/claims/:id/strategy`, ({ params }) => {
    const { id } = params;
    if (mockStrategy.claimId === id) {
      return HttpResponse.json({ data: mockStrategy });
    }
    return HttpResponse.json({ error: 'Strategy not found' }, { status: 404 });
  }),

  // GET /api/templates - list all templates
  http.get(`${BASE_URL}/api/templates`, () => {
    return HttpResponse.json({ data: mockTemplates });
  }),

  // GET /api/user/profile - get user profile
  http.get(`${BASE_URL}/api/user/profile`, () => {
    return HttpResponse.json({ data: mockUser });
  }),

  // GET /api/user/settings - get user settings
  http.get(`${BASE_URL}/api/user/settings`, () => {
    return HttpResponse.json({ data: mockSettings });
  }),
];
