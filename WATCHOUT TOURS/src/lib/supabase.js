import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnon) {
  console.warn(
    '[supabase] Las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY no están definidas. ' +
    'Copia .env.local.example como .env.local y rellena los valores.'
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnon ?? '')
