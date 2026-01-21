'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'

interface NavItem {
  label: string
  path: string
  icon: string
}

const navItems: NavItem[] = [
  { label: '홈', path: '/', icon: '🏠' },
  { label: '일정', path: '/schedule', icon: '📅' },
  { label: '분석', path: '/analytics', icon: '📊' },
  { label: '설정', path: '/settings', icon: '⚙️' },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  // 사이드바 외부 클릭 시 닫기
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement
        if (!target.closest('.sidebar') && !target.closest('.menu-toggle')) {
          onClose()
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // 경로 변경 시 사이드바 닫기
  useEffect(() => {
    onClose()
  }, [pathname])

  const handleLinkClick = (path: string) => {
    router.push(path)
    onClose()
  }

  return (
    <>
      {/* 오버레이 (사이드바 열릴 때 배경 어둡게) */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      {/* 사이드바 */}
      <nav
        className="sidebar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '280px',
          backgroundColor: 'white',
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          zIndex: 1000,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 사이드바 헤더 */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333',
              margin: 0,
            }}
          >
            메뉴
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px 8px',
              color: '#666',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            ✕
          </button>
        </div>

        {/* 네비게이션 아이템들 */}
        <div
          style={{
            padding: '16px 0',
            flex: 1,
          }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault()
                  handleLinkClick(item.path)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  textDecoration: 'none',
                  color: isActive ? '#007AFF' : '#333',
                  backgroundColor: isActive ? 'rgba(0, 122, 255, 0.1)' : 'transparent',
                  borderLeft: isActive ? '3px solid #007AFF' : '3px solid transparent',
                  transition: 'all 0.2s',
                  fontWeight: isActive ? '600' : '400',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#f5f5f5'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                <span style={{ fontSize: '16px' }}>{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* 사이드바 푸터 (선택사항) */}
        <div
          style={{
            padding: '20px',
            borderTop: '1px solid #e0e0e0',
            fontSize: '12px',
            color: '#999',
            textAlign: 'center',
          }}
        >
          YAM App © 2024
        </div>
      </nav>
    </>
  )
}
