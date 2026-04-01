import { corsHeaders } from './cors.ts';

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export function errorResponse(
  status: number,
  message: string,
  code = 'ERROR',
  details?: Record<string, unknown>,
): Response {
  return new Response(
    JSON.stringify({ message, code, statusCode: status, details }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  );
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number,
): Response {
  return jsonResponse({
    data,
    total,
    page,
    pageSize,
    hasMore: page * pageSize < total,
  });
}
