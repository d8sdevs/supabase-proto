'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 헤더 */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderBottom: '1px solid #e0e0e0',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          zIndex: 998,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }}
      >
        {/* 햄버거 메뉴 버튼 */}
        <button
          className="menu-toggle"
          onClick={toggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s',
            color: '#333',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f0f0f0'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
          aria-label="메뉴 열기"
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>

        {/* 앱 제목 */}
        <h1
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#333',
            margin: 0,
            flex: 1,
          }}
        >
          YAM App
        </h1>
      </header>

      {/* 사이드바 */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* 메인 콘텐츠 */}
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '100%',
        }}
      >
        {children}
      </main>
    </div>
  )
}
