import { http, HttpResponse } from 'msw';
import {
  mockClaims,
  mockEvidence,
  mockTemplates,
  mockUser,
  mockSettings,
} from '@/testing/fixtures';

const BASE_URL = 'http://localhost:54321/functions/v1';

export const handlers = [
  // GET /claims - list all claims
  http.get(`${BASE_URL}/claims`, () => {
    return HttpResponse.json({
      data: mockClaims,
      total: mockClaims.length,
      page: 1,
      pageSize: 50,
      hasMore: false,
    });
  }),

  // GET /claims-by-id - get single claim
  http.get(`${BASE_URL}/claims-by-id`, ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const claim = mockClaims.find((c) => c.id === id);
    if (!claim) {
      return HttpResponse.json({ error: 'Claim not found' }, { status: 404 });
    }
    return HttpResponse.json(claim);
  }),

  // POST /claims - create new claim
  http.post(`${BASE_URL}/claims`, async ({ request }) => {
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
    return HttpResponse.json(newClaim, { status: 201 });
  }),

  // GET /claims-evidence - get evidence for a claim
  http.get(`${BASE_URL}/claims-evidence`, ({ request }) => {
    const url = new URL(request.url);
    const claimId = url.searchParams.get('claimId');
    const evidence = mockEvidence.filter((e) => e.claimId === claimId);
    return HttpResponse.json(evidence);
  }),

  // GET /templates - list all templates
  http.get(`${BASE_URL}/templates`, () => {
    return HttpResponse.json(mockTemplates);
  }),

  // GET /user-profile - get user profile
  http.get(`${BASE_URL}/user-profile`, () => {
    return HttpResponse.json(mockUser);
  }),

  // GET /user-settings - get user settings
  http.get(`${BASE_URL}/user-settings`, () => {
    return HttpResponse.json(mockSettings);
  }),
];
