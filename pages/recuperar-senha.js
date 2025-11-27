import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '../services/supabaseClient'

export default function RecuperarSenha() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email) {
      setError('Informe o e-mail.')
      return
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) setError(error.message)
    else setEnviado(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1976d2 0%, #43e97b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 32, minWidth: 340, maxWidth: 420, width: '100%' }}>
        <h2 style={{ color: '#1976d2', textAlign: 'center', marginBottom: 24 }}>Recuperação de Senha</h2>
        {!enviado ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input
              type="email"
              placeholder="E-mail cadastrado"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
              required
            />
            <button type="submit" style={{ background: 'linear-gradient(90deg, #1976d2 60%, #43e97b 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
              Enviar Link
            </button>
            {error && <span style={{ color: 'red', fontSize: 14 }}>{error}</span>}
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#1976d2', fontWeight: 500 }}>Se o e-mail existir, um link seguro foi enviado.<br />Verifique sua caixa de entrada.</p>
            <Link href="/login" style={{ color: '#1976d2', textDecoration: 'underline' }}>Voltar ao Login</Link>
          </div>
        )}
      </div>
    </div>
  )
}
