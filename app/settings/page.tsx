export default function SettingsPage() {
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
        설정
      </h1>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <p style={{
          color: '#666',
          lineHeight: '1.6'
        }}>
          설정 페이지입니다.
        </p>
      </div>
    </div>
  )
}
