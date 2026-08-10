import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnon) {
  console.warn(
    '[supabase] Las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY no están definidas. ' +
    'Copia .env.local.example como .env.local y rellena los valores. ' +
    'Se usa un cliente de relleno; las llamadas a Supabase fallarán en tiempo de ejecución.'
  )
}

// createClient exige una URL no vacía: sin credenciales reales usamos un
// placeholder para que el build (y el SSR/prerender que importa este módulo)
// no revienten al arrancar sin .env.local.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnon || 'placeholder-anon-key'
)
