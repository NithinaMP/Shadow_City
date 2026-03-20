export default function Header() {
  return (
    <header style={{
      position: 'relative', zIndex: 10,
      borderBottom: '1px solid var(--border)',
      padding: '0 48px', height: '64px',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(5,8,16,0.95)',
      backdropFilter: 'blur(20px)',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: '20px',
        fontWeight: 800, color: 'var(--accent)',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{
          width: 28, height: 28,
          background: 'var(--accent)',
          clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
          animation: 'pulse 3s ease-in-out infinite',
        }} />
        SHADOW_CITY
      </div>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.7;transform:scale(.95)} }
      `}</style>
    </header>
  );
}