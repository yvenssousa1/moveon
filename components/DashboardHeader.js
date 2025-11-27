import Link from 'next/link'

export default function DashboardHeader({ nome }) {
  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #eee', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontWeight: 700, color: '#1976d2', fontSize: 20 }}>MoveOn</span>
      </div>
      <nav style={{ display: 'flex', gap: 18 }}>
        <Link href="/dashboard-paciente" style={{ color: '#1976d2', fontWeight: 700, textDecoration: 'underline' }}>Dashboard</Link>
        <Link href="/tasks" style={{ color: '#444' }}>Tarefas</Link>
        <Link href="/profile" style={{ color: '#444' }}>Perfil</Link>
        <Link href="/settings" style={{ color: '#444' }}>Configurações</Link>
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontWeight: 500 }}>{nome || 'Paciente'}</span>
        <img src="https://ui-avatars.com/api/?name=Paciente&background=1976d2&color=fff&rounded=true&size=32" alt="Avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />
      </div>
    </header>
  )
}
