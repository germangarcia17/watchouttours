import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext(null)

/* Autenticación real con Supabase Auth.
   - La sesión es un JWT gestionado (y renovado) por supabase-js, no un JSON
     manipulable en localStorage.
   - Las políticas RLS "authenticated" de la base de datos aplican de verdad
     a las peticiones del panel de administración. */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined) // undefined = cargando
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !data.session) throw new Error('Credenciales incorrectas')
    return data.session
  }

  async function signOut() {
    await supabase.auth.signOut()
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
