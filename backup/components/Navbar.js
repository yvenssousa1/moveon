import Link from 'next/link'

export default function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      gap: 16,
      padding: 16,
      background: '#1976d2',
      color: '#fff',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: 24
    }}>
      <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Dashboard</Link>
      <Link href="/tasks" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Tarefas</Link>
      <Link href="/profile" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Perfil</Link>
      <Link href="/settings" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Configurações</Link>
    </nav>
  )
}
