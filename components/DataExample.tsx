'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

interface Todo {
  id: number
  title: string
  completed: boolean
  created_at: string
}

export default function DataExample() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTodos(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('todos')
        .insert([{ title: newTodo, completed: false }])
        .select()

      if (error) throw error
      if (data) {
        setTodos([...data, ...todos])
        setNewTodo('')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !completed })
        .eq('id', id)

      if (error) throw error
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: !completed } : todo
      ))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)

      if (error) throw error
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '16px'
    }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '16px',
        color: '#333'
      }}>
        데이터베이스 예제 (Todos)
      </h2>
      
      <form onSubmit={addTodo} style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="할 일을 입력하세요..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '14px'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#007AFF',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            추가
          </button>
        </div>
      </form>

      {error && (
        <div style={{
          padding: '10px',
          borderRadius: '6px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          fontSize: '13px',
          marginBottom: '12px'
        }}>
          오류: {error}
          <br />
          <small style={{ fontSize: '11px', opacity: 0.8 }}>
            Supabase에서 'todos' 테이블을 생성해야 합니다.
          </small>
        </div>
      )}

      {loading && todos.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
          로딩 중...
        </p>
      ) : todos.length === 0 ? (
        <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
          할 일이 없습니다. 새로운 할 일을 추가해보세요!
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map((todo) => (
            <li
              key={todo.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                marginBottom: '8px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                gap: '12px'
              }}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, todo.completed)}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer'
                }}
              />
              <span
                style={{
                  flex: 1,
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#999' : '#333',
                  fontSize: '14px'
                }}
              >
                {todo.title}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{
                  backgroundColor: '#ff3b30',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
