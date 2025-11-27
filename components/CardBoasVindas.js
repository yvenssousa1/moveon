export default function CardBoasVindas({ nome, proximoAgendamento, progresso }) {
  return (
    <div style={{ background: 'linear-gradient(90deg, #1976d2 60%, #43e97b 100%)', color: '#fff', borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: '0 2px 8px rgba(25,118,210,0.08)' }}>
      <h2 style={{ margin: 0, fontWeight: 700 }}>Olá, {nome || 'Paciente'}!</h2>
      <p style={{ margin: '8px 0 16px 0', fontSize: 16 }}>Bem-vindo(a) ao MoveOn! Continue com seus exercícios e acompanhe sua evolução.</p>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 180 }}>
          <span style={{ fontWeight: 500 }}>Próximo Agendamento:</span>
          <div style={{ fontSize: 15, marginTop: 4 }}>{proximoAgendamento || 'Nenhum agendamento futuro.'}</div>
        </div>
        <div style={{ minWidth: 180 }}>
          <span style={{ fontWeight: 500 }}>Progresso Geral:</span>
          <div style={{ fontSize: 15, marginTop: 4 }}>{progresso || '0% do Plano Concluído'}</div>
        </div>
      </div>
    </div>
  )
}
