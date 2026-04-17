export default function PageLoading({ label = 'Loading…' }) {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 180px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        color: '#ffffff',
      }}
      aria-live="polite"
      aria-busy="true"
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 46,
            height: 46,
            border: '3px solid rgba(255,255,255,0.12)',
            borderTopColor: '#ffffff',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'pageSpinner 0.9s linear infinite',
          }}
        />
        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, opacity: 0.9 }}>{label}</p>
      </div>
      <style>{`@keyframes pageSpinner { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

