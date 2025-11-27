import Navbar from '../components/Navbar'

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
        <h1 style={{ color: '#1976d2' }}>Bem-vindo ao MoveOn</h1>
        <p>Seu painel de atividades e tarefas.</p>
      </main>
    </>
  )
}
