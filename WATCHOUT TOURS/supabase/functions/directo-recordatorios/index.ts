import { recordatoriosHandler } from '../_shared/http.mjs';
import { makeDeps, env } from '../_shared/adapters.mjs';

Deno.serve(recordatoriosHandler({ makeDeps, env }));
