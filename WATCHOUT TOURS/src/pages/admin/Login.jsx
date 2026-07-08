import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import '../../styles/admin.css'

export default function AdminLogin() {
  const { signIn }          = useAuth()
  const navigate            = useNavigate()
  const [email, setEmail]   = useState('')
  const [password, setPass] = useState('')
  const [error, setError]   = useState(null)
  const [loading, setLoad]  = useState(false)

  useEffect(() => { document.title = 'Iniciar sesión | WatchOut! Admin' }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoad(true)
    try {
      await signIn(email, password)
      navigate('/admin')
    } catch (err) {
      console.error('[login] error:', err)
      setError('Credenciales incorrectas. Inténtalo de nuevo.')
    } finally {
      setLoad(false)
    }
  }

  return (
    <main className="login-page" id="main-content" tabIndex={-1}>
      <div className="dots-texture" aria-hidden="true"></div>
      <div className="login-box">
        <div className="login-box__logo">
          <span className="login-box__badge">WatchOut! <em>Admin</em></span>
        </div>
        <h1>Iniciar sesión</h1>

        <form onSubmit={handleSubmit} noValidate aria-label="Formulario de inicio de sesión">
          <div className="form-field">
            <label htmlFor="login-email" className="form-label">
              Correo electrónico <span aria-hidden="true" className="required-marker">*</span>
            </label>
            <input id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" aria-required="true" className="form-control" />
          </div>

          <div className="form-field">
            <label htmlFor="login-password" className="form-label">
              Contraseña <span aria-hidden="true" className="required-marker">*</span>
            </label>
            <input id="login-password" type="password" value={password} onChange={e => setPass(e.target.value)} required autoComplete="current-password" aria-required="true" className="form-control" />
          </div>

          {error && (
            <p role="alert" aria-live="assertive" className="form-error" style={{ marginBottom: '1rem' }}>
              <span aria-hidden="true">⚠</span> {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn btn--primary btn--wide">
            {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </main>
  )
}
