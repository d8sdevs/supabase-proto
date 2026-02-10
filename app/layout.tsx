import type { Metadata } from 'next'
import './globals.css'
import AppLayout from '@/components/AppLayout'

export const metadata: Metadata = {
  title: '얌YAM',
  description: 'YAM',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  )
}
