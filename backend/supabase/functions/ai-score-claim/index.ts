import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { handleAIRequest } from '../_shared/ai-handler.ts';

serve((req: Request) => handleAIRequest(req, 'score_claim'));
