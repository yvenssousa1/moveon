import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'

export default function TaskList() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState('')
  const [error, setError] = useState('')

  async function fetchTasks() {
    setLoading(true)
    const { data, error } = await supabase.from('tasks').select('*').order('id', { ascending: false })
    if (!error) setTasks(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleAddTask = async (e) => {
    e.preventDefault()
    setError('')
    if (!newTask.trim()) return
    const { error } = await supabase.from('tasks').insert([{ title: newTask }])
    if (error) setError(error.message)
    setNewTask('')
    fetchTasks()
  }

  const handleDelete = async (id) => {
    await supabase.from('tasks').delete().eq('id', id)
    fetchTasks()
  }

  if (loading) return <p>Carregando tarefas...</p>

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <form onSubmit={handleAddTask} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Nova tarefa"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '8px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4 }}>Adicionar</button>
        {error && <span style={{ color: 'red' }}>{error}</span>}
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks && tasks.length > 0 ? (
          tasks.map(task => (
            <li key={task.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 8, borderBottom: '1px solid #eee' }}>
              <span>{task.title}</span>
              <button onClick={() => handleDelete(task.id)} style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px' }}>Excluir</button>
            </li>
          ))
        ) : (
          <li>Nenhuma tarefa encontrada.</li>
        )}
      </ul>
    </div>
  )
}
