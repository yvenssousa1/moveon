// Aqui ficará a integração com o backend ou Supabase futuramente
export async function getTasks() {
  // Exemplo de retorno estático
  return [
    { id: 1, title: 'Tarefa exemplo 1', done: false },
    { id: 2, title: 'Tarefa exemplo 2', done: true },
    { id: 3, title: 'Tarefa exemplo 3', done: false },
  ]
}
