import { useState } from 'react'

export default function TrabalheConosco() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [area, setArea] = useState('')
  const [cv, setCV] = useState(null)
  const [mensagem, setMensagem] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!nome || !email || !telefone || !area || !cv) {
      setError('Preencha todos os campos e anexe seu CV.')
      return
    }
    // Aqui entraria a lógica real de envio seguro para backend/storage
    setSuccess('Candidatura enviada com sucesso!')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1976d2 0%, #43e97b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 32, minWidth: 340, maxWidth: 480, width: '100%' }}>
        <h2 style={{ color: '#1976d2', textAlign: 'center', marginBottom: 24 }}>Trabalhe Conosco</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input type="text" placeholder="Nome Completo" value={nome} onChange={e => setNome(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required />
          <input type="email" placeholder="E-mail Profissional" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required />
          <input type="tel" placeholder="Telefone (+55 11 99999-9999)" value={telefone} onChange={e => setTelefone(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required />
          <select value={area} onChange={e => setArea(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} required>
            <option value="">Área de Atuação</option>
            <option value="Fisioterapia">Fisioterapia</option>
            <option value="Medicina">Medicina</option>
            <option value="Tecnologia/Desenvolvimento">Tecnologia/Desenvolvimento</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Outro">Outro</option>
          </select>
          <input type="file" accept=".pdf" onChange={e => setCV(e.target.files[0])} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc', background: '#f9f9f9' }} required />
          <textarea placeholder="Mensagem (Motivação, experiência...)" value={mensagem} onChange={e => setMensagem(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc', minHeight: 80 }} required />
          <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Enviar Candidatura</button>
          {error && <span style={{ color: 'red', fontSize: 14 }}>{error}</span>}
          {success && <span style={{ color: 'green', fontSize: 14 }}>{success}</span>}
        </form>
      </div>
    </div>
  )
}
