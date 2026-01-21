'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface NavItem {
  label: string
  path: string
  icon: string
}

const navItems: NavItem[] = [
  { label: '홈', path: '/', icon: '🏠' },
  { label: '검색', path: '/search', icon: '🔍' },
  { label: '알림', path: '/notifications', icon: '🔔' },
  { label: '프로필', path: '/profile', icon: '👤' },
]

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '12px 0',
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
        zIndex: 1000,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
      }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.path
        return (
          <Link
            key={item.path}
            href={item.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              textDecoration: 'none',
              color: isActive ? '#007AFF' : '#666',
              backgroundColor: isActive ? 'rgba(0, 122, 255, 0.1)' : 'transparent',
            }}
          >
            <span style={{ fontSize: '24px' }}>{item.icon}</span>
            <span
              style={{
                fontSize: '12px',
                fontWeight: isActive ? '600' : '400',
              }}
            >
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
