import { eventoHandler } from '../_shared/http.mjs';
import { makeDeps, env } from '../_shared/adapters.mjs';

Deno.serve(eventoHandler({ makeDeps, env }));
