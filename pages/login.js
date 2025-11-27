import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '../services/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Preencha todos os campos.')
      return
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else window.location.href = '/dashboard-paciente'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1976d2 0%, #43e97b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 32, minWidth: 340, maxWidth: 380, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src="/icons/icon-192x192.png" alt="Logo" style={{ width: 48, height: 48, marginBottom: 8 }} />
          <h2 style={{ margin: 0, color: '#1976d2', fontWeight: 700 }}>MoveOn Scheduler</h2>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
            required
          />
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16, width: '100%' }}
              required
            />
            <span onClick={() => setShowPassword(s => !s)} style={{ position: 'absolute', right: 12, top: 12, cursor: 'pointer', color: '#1976d2', fontSize: 18 }} title="Mostrar/ocultar senha">
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
          <button type="submit" style={{ background: 'linear-gradient(90deg, #1976d2 60%, #43e97b 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
            Entrar
          </button>
          {error && <span style={{ color: 'red', fontSize: 14 }}>{error}</span>}
        </form>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16, fontSize: 14 }}>
          <Link href="/recuperar-senha" style={{ color: '#1976d2', textDecoration: 'underline', textAlign: 'center' }}>Esqueci minha Senha</Link>
          <Link href="/cadastro" style={{
            background: 'linear-gradient(90deg, #1976d2 60%, #43e97b 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 0',
            fontWeight: 700,
            fontSize: 16,
            textAlign: 'center',
            textDecoration: 'none',
            marginTop: 8,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(25,118,210,0.08)'
          }}>Criar uma nova conta</Link>
        </div>
        <div style={{ borderTop: '1px solid #eee', marginTop: 24, paddingTop: 16, textAlign: 'center', fontSize: 13 }}>
          <Link href="/trabalhe-conosco" style={{ color: '#1976d2', marginRight: 12 }}>Trabalhe Conosco</Link>
          <a href="/termos" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', marginRight: 12 }}>Termos</a>
          <a href="/privacidade" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>Privacidade</a>
        </div>
      </div>
    </div>
  )
}
