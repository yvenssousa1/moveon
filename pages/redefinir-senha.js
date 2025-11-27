
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../services/supabaseClient'

export default function RedefinirSenha() {
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (senha.length < 8 || !/[A-Z]/.test(senha) || !/\d/.test(senha)) {
      setError('A senha deve ter pelo menos 8 caracteres, uma maiúscula e um número.')
      return
    }
    if (senha !== confirmar) {
      setError('As senhas não coincidem.')
      return
    }
    // Redefinição real com Supabase Auth
    const { error } = await supabase.auth.updateUser({ password: senha })
    if (error) {
      setError(error.message)
      return
    }
    setSuccess('Senha redefinida com sucesso!')
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1976d2 0%, #43e97b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 32, minWidth: 340, maxWidth: 420, width: '100%' }}>
        <h2 style={{ color: '#1976d2', textAlign: 'center', marginBottom: 24 }}>Redefinir Senha</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            type="password"
            placeholder="Nova Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            style={{ padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
            required
          />
          <input
            type="password"
            placeholder="Confirmar Nova Senha"
            value={confirmar}
            onChange={e => setConfirmar(e.target.value)}
            style={{ padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
            required
          />
          <button type="submit" style={{ background: 'linear-gradient(90deg, #1976d2 60%, #43e97b 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
            Redefinir Senha
          </button>
          {error && <span style={{ color: 'red', fontSize: 14 }}>{error}</span>}
          {success && <span style={{ color: 'green', fontSize: 14 }}>{success} <Link href="/login" style={{ color: '#1976d2', textDecoration: 'underline' }}>Ir para Login</Link></span>}
        </form>
      </div>
    </div>
  )
}
