import { inscripcionHandler } from '../_shared/http.mjs';
import { makeDeps, env } from '../_shared/adapters.mjs';

Deno.serve(inscripcionHandler({ makeDeps, env }));
