import Link from 'next/link'

export default function DashboardProfissional() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1976d2 0%, #43e97b 100%)', padding: 32 }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 32, maxWidth: 700, margin: '0 auto' }}>
        <h2 style={{ color: '#1976d2', marginBottom: 24 }}>Painel do Profissional</h2>
        <ul style={{ fontSize: 18, lineHeight: 2 }}>
          <li>Agenda sincronizada (Google Sheets)</li>
          <li>Lista de pacientes</li>
          <li>Módulo de atendimento online</li>
        </ul>
        <Link href="/login" style={{ color: '#1976d2', textDecoration: 'underline' }}>Sair</Link>
      </div>
    </div>
  )
}
