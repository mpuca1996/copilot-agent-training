import { useEffect, useMemo, useState } from 'react'
import './App.css'

const TOKEN_KEY = 'sessionToken'
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

const getInitialPath = () => (window.location.pathname === '/welcome' ? '/welcome' : '/login')

function App() {
  const [path, setPath] = useState(getInitialPath)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY))

  const isAuthenticated = useMemo(() => Boolean(token), [token])

  useEffect(() => {
    const onPopState = () => setPath(getInitialPath())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (path === '/welcome' && !isAuthenticated) {
      window.history.replaceState({}, '', '/login')
    }
  }, [isAuthenticated, path])

  const navigate = (nextPath, replace = false) => {
    const method = replace ? 'replaceState' : 'pushState'
    window.history[method]({}, '', nextPath)
    setPath(nextPath)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const formData = new URLSearchParams({ username, password })
      const response = await fetch(`${API_BASE_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.detail || 'No se pudo iniciar sesión')
      }

      const data = await response.json()
      sessionStorage.setItem(TOKEN_KEY, data.access_token)
      setToken(data.access_token)
      navigate('/welcome', true)
      setPassword('')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_KEY)
    setToken(null)
    navigate('/login', true)
  }

  const activePath = path === '/welcome' && !isAuthenticated ? '/login' : path

  if (activePath === '/welcome' && isAuthenticated) {
    return (
      <main className="app app--welcome">
        <section className="card">
          <p className="eyebrow">JWT AUTH</p>
          <h1>Bienvenido</h1>
          <p className="description">Tu sesión está activa y protegida.</p>
          <button type="button" className="button-primary" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="app app--login">
      <section className="card">
        <p className="eyebrow">AI LAB</p>
        <h1>Iniciar sesión</h1>
        <p className="description">Ingresa tus credenciales para continuar.</p>

        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="username">Usuario</label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" className="button-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Validando...' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default App
