import AuthExample from '@/components/AuthExample'
import DataExample from '@/components/DataExample'

export default function Home() {
  return (
    <div style={{
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#333'
      }}>
        홈
      </h1>
      
      <AuthExample />
      <DataExample />
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '16px'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '12px',
          color: '#333'
        }}>
          Supabase 연동 완료
        </h2>
        <p style={{
          color: '#666',
          lineHeight: '1.6',
          fontSize: '14px',
          marginBottom: '8px'
        }}>
          위의 예제들을 통해 Supabase의 인증 및 데이터베이스 기능을 테스트할 수 있습니다.
        </p>
        <p style={{
          color: '#999',
          lineHeight: '1.6',
          fontSize: '12px'
        }}>
          데이터베이스 예제를 사용하려면 Supabase에서 'todos' 테이블을 생성해야 합니다.
        </p>
      </div>
    </div>
  )
}
