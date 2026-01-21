'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function AuthExample() {
  const [user, setUser] = useState<User | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // 현재 사용자 확인
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(`회원가입 실패: ${error.message}`)
    } else {
      setMessage('회원가입 성공! 이메일을 확인해주세요.')
    }
    setLoading(false)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(`로그인 실패: ${error.message}`)
    } else {
      setMessage('로그인 성공!')
    }
    setLoading(false)
  }

  const handleSignOut = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      setMessage(`로그아웃 실패: ${error.message}`)
    } else {
      setMessage('로그아웃 성공!')
      setEmail('')
      setPassword('')
    }
    setLoading(false)
  }

  if (user) {
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
          인증 상태
        </h2>
        <p style={{ color: '#666', marginBottom: '12px' }}>
          로그인된 사용자: <strong>{user.email}</strong>
        </p>
        <p style={{ color: '#666', marginBottom: '16px', fontSize: '14px' }}>
          User ID: {user.id}
        </p>
        <button
          onClick={handleSignOut}
          disabled={loading}
          style={{
            backgroundColor: '#ff3b30',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            width: '100%'
          }}
        >
          {loading ? '처리 중...' : '로그아웃'}
        </button>
        {message && (
          <p style={{
            marginTop: '12px',
            padding: '8px',
            borderRadius: '6px',
            backgroundColor: message.includes('성공') ? '#d4edda' : '#f8d7da',
            color: message.includes('성공') ? '#155724' : '#721c24',
            fontSize: '13px'
          }}>
            {message}
          </p>
        )}
      </div>
    )
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
        인증 예제
      </h2>
      <form onSubmit={handleSignUp} style={{ marginBottom: '16px' }}>
        <div style={{ marginBottom: '12px' }}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              backgroundColor: '#007AFF',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? '처리 중...' : '회원가입'}
          </button>
          <button
            type="button"
            onClick={handleSignIn}
            disabled={loading}
            style={{
              flex: 1,
              backgroundColor: '#34C759',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? '처리 중...' : '로그인'}
          </button>
        </div>
      </form>
      {message && (
        <p style={{
          padding: '8px',
          borderRadius: '6px',
          backgroundColor: message.includes('성공') ? '#d4edda' : '#f8d7da',
          color: message.includes('성공') ? '#155724' : '#721c24',
          fontSize: '13px'
        }}>
          {message}
        </p>
      )}
    </div>
  )
}
