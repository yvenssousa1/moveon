
import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { supabase } from '../services/supabaseClient'

const PhoneInput = dynamic(() => import('react-phone-input-2'), { ssr: false })
import 'react-phone-input-2/lib/style.css'

export default function Cadastro() {
  const [step, setStep] = useState(0)
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1976d2 0%, #43e97b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 32, minWidth: 340, maxWidth: 420, width: '100%' }}>
        {step === 0 && (
          <>
            <h2 style={{ color: '#1976d2', textAlign: 'center', marginBottom: 24 }}>Comece sua Jornada</h2>
            <button onClick={() => setStep(1)} style={{ width: '100%', padding: 16, borderRadius: 8, background: '#43e97b', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', marginBottom: 16, cursor: 'pointer' }}>Sou Paciente</button>
            <button onClick={() => setStep(2)} style={{ width: '100%', padding: 16, borderRadius: 8, background: '#1976d2', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer' }}>Sou Profissional</button>
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Link href="/login" style={{ color: '#1976d2', textDecoration: 'underline' }}>Já tenho uma conta</Link>
            </div>
          </>
        )}
        {step === 1 && <FormPaciente onBack={() => setStep(0)} />}
        {step === 2 && <FormProfissional onBack={() => setStep(0)} />}
      </div>
    </div>
  )
}

function FormPaciente({ onBack }) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [telefone, setTelefone] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!nome || !email || !senha || !confirmar || !telefone) {
      setError('Preencha todos os campos.')
      return
    }
    if (senha.length < 8 || !/[A-Z]/.test(senha) || !/\d/.test(senha)) {
      setError('A senha deve ter pelo menos 8 caracteres, uma maiúscula e um número.')
      return
    }
    if (senha !== confirmar) {
      setError('As senhas não coincidem.')
      return
    }
    // Cadastro real com Supabase Auth
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { nome, telefone, tipo: 'paciente' }
      }
    })
    if (error) {
      setError(error.message)
      return
    }
    setSuccess('Cadastro realizado! Verifique seu e-mail.')
    setTimeout(() => {
      window.location.href = '/login'
    }, 2500)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h3 style={{ color: '#1976d2', margin: 0 }}>Cadastro de Paciente</h3>
      <input type="text" placeholder="Nome Completo" value={nome} onChange={e => setNome(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required />
      <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required />
      <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required />
      <input type="password" placeholder="Confirmar Senha" value={confirmar} onChange={e => setConfirmar(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required />
      <PhoneInput
        country={'br'}
        value={telefone}
        onChange={setTelefone}
        inputStyle={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
        buttonStyle={{ borderRadius: 8, border: '1px solid #ccc' }}
        dropdownStyle={{ borderRadius: 8 }}
        placeholder="Telefone"
        enableSearch
        required
      />
      <button type="submit" style={{ background: '#43e97b', color: '#fff', border: 'none', borderRadius: 8, padding: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Criar Conta</button>
      <button type="button" onClick={onBack} style={{ background: 'none', color: '#1976d2', border: 'none', marginTop: 8, cursor: 'pointer' }}>Voltar</button>
      {error && <span style={{ color: 'red', fontSize: 14 }}>{error}</span>}
      {success && <span style={{ color: 'green', fontSize: 14 }}>{success}</span>}
    </form>
  )
}

function FormProfissional({ onBack }) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [telefone, setTelefone] = useState('')
  const [area, setArea] = useState('')
  const [registro, setRegistro] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!nome || !email || !senha || !confirmar || !telefone || !area) {
      setError('Preencha todos os campos.')
      return
    }
    if (senha.length < 8 || !/[A-Z]/.test(senha) || !/\d/.test(senha)) {
      setError('A senha deve ter pelo menos 8 caracteres, uma maiúscula e um número.')
      return
    }
    if (senha !== confirmar) {
      setError('As senhas não coincidem.')
      return
    }
    if ((area === 'Fisioterapeuta' || area === 'Médico') && !registro) {
      setError('Informe o registro profissional.')
      return
    }
    // Cadastro real com Supabase Auth
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { nome, telefone, area, registro, tipo: 'profissional' }
      }
    })
    if (error) {
      setError(error.message)
      return
    }
    setSuccess('Cadastro realizado! Verifique seu e-mail.')
    setTimeout(() => {
      window.location.href = '/login'
    }, 2500)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h3 style={{ color: '#1976d2', margin: 0 }}>Cadastro de Profissional</h3>
      <input type="text" placeholder="Nome Completo" value={nome} onChange={e => setNome(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required />
      <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required />
      <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required />
      <input type="password" placeholder="Confirmar Senha" value={confirmar} onChange={e => setConfirmar(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required />
      <PhoneInput
        country={'br'}
        value={telefone}
        onChange={setTelefone}
        inputStyle={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
        buttonStyle={{ borderRadius: 8, border: '1px solid #ccc' }}
        dropdownStyle={{ borderRadius: 8 }}
        placeholder="Telefone"
        enableSearch
        required
      />
      <select value={area} onChange={e => setArea(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required>
        <option value="">Área de Atuação</option>
        <option value="Fisioterapeuta">Fisioterapeuta</option>
        <option value="Médico">Médico</option>
        <option value="Outro">Outro</option>
      </select>
      {(area === 'Fisioterapeuta' || area === 'Médico') && (
        <input type="text" placeholder="Registro Profissional (CREFITO/CRM)" value={registro} onChange={e => setRegistro(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required />
      )}
      <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Cadastrar e Enviar Documentos</button>
      <button type="button" onClick={onBack} style={{ background: 'none', color: '#1976d2', border: 'none', marginTop: 8, cursor: 'pointer' }}>Voltar</button>
      {error && <span style={{ color: 'red', fontSize: 14 }}>{error}</span>}
      {success && <span style={{ color: 'green', fontSize: 14 }}>{success}</span>}
    </form>
  )
}
