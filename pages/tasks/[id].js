import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabaseClient'

export default function TaskDetail() {
  const router = useRouter()
  const { id } = router.query
  const [task, setTask] = useState(null)
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!id) return
    async function fetchTask() {
      setLoading(true)
      const { data, error } = await supabase.from('tasks').select('*').eq('id', id).single()
      if (!error) {
        setTask(data)
        setTitle(data.title)
      }
      setLoading(false)
    }
    fetchTask()
  }, [id])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setMsg('')
    const { error } = await supabase.from('tasks').update({ title }).eq('id', id)
    if (!error) setMsg('Tarefa atualizada!')
    else setMsg(error.message)
  }

  if (loading) return <p>Carregando...</p>
  if (!task) return <p>Tarefa não encontrada.</p>

  return (
    <main>
      <h1>Editar Tarefa</h1>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <button type="submit">Salvar</button>
        {msg && <span style={{marginLeft:8}}>{msg}</span>}
      </form>
    </main>
  )
}
