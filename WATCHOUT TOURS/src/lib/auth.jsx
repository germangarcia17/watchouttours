import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext(null)
const SESSION_KEY = 'watchout_admin_session'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined) // undefined = loading
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY)
      setSession(stored ? JSON.parse(stored) : null)
    } catch {
      setSession(null)
    }
    setLoading(false)
  }, [])

  async function signIn(email, password) {
    const { data, error } = await supabase
      .rpc('check_admin_credentials', { p_email: email, p_password: password })

    console.log('[auth] rpc result → data:', data, '| error:', error)

    const row = Array.isArray(data) ? data[0] : data
    if (error || !row) throw new Error('Credenciales incorrectas')

    const adminSession = { id: row.id, email: row.admin_email }
    localStorage.setItem(SESSION_KEY, JSON.stringify(adminSession))
    setSession(adminSession)
    return adminSession
  }

  async function signOut() {
    localStorage.removeItem(SESSION_KEY)
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
