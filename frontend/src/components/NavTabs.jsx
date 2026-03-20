const tabs = [
  { id: 'scanner', label: '⬡ DECIPHER ENGINE' },
  { id: 'interview', label: '⬡ AGENTIC INTERVIEWER' },
  { id: 'dashboard', label: '⬡ CITY DASHBOARD' },
];

export default function NavTabs({ activePage, setActivePage }) {
  return (
    <nav style={{
      display: 'flex', borderBottom: '1px solid var(--border)',
      padding: '0 48px', background: 'rgba(5,8,16,0.7)',
      position: 'relative', zIndex: 10,
    }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => setActivePage(tab.id)} style={{
          padding: '14px 24px',
          fontSize: 11, fontFamily: 'var(--font-mono)',
          color: activePage === tab.id ? 'var(--accent)' : 'var(--muted)',
          cursor: 'pointer',
          borderBottom: activePage === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
          background: 'none',
          border: 'none',
          borderBottom: activePage === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
          textTransform: 'uppercase', letterSpacing: '1.5px',
          transition: 'color 0.2s',
        }}>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}