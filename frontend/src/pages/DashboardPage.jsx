import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DashboardPage({ localHistory }) {
  const [dbData, setDbData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/dashboard')
      .then(res => setDbData(res.data))
      .catch(() => {});
  }, []);

  const combined = localHistory.length > 0
    ? localHistory
    : dbData.map(r => ({
        company: r.company,
        score: r.score,
        verdict: r.verdict,
        flags: typeof r.flags === 'string' ? JSON.parse(r.flags) : r.flags || [],
        timestamp: r.created_at,
      }));

  const total = combined.length;
  const avg = total > 0 ? Math.round(combined.reduce((s, a) => s + a.score, 0) / total) : null;
  const flagged = combined.filter(a => a.score < 60).length;
  const avgColor = avg
    ? avg >= 70 ? 'var(--accent)'
    : avg >= 50 ? 'var(--warn)'
    : 'var(--accent3)'
    : 'var(--text)';

  return (
    <div style={{ padding: 48, position: 'relative', zIndex: 1 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
        City Intelligence Feed
      </div>
      <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 32 }}>
        Real-time transparency scores aggregated into urban intelligence.
      </div>

      {/* STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 40 }}>
        {[
          { value: total, label: 'Total Audits', color: 'var(--accent)' },
          { value: avg ?? '—', label: 'City Transparency Index', color: avgColor, showBar: true },
          { value: flagged, label: 'High Risk Entities', color: 'var(--accent3)' },
        ].map(({ value, label, color, showBar }) => (
          <div key={label} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            padding: 24, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
            }} />
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 40,
              fontWeight: 800, color, lineHeight: 1, marginBottom: 8,
            }}>
              {value}
            </div>
            <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 2 }}>
              {label}
            </div>
            {showBar && avg && (
              <div style={{ marginTop: 16, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: avg + '%',
                  background: 'linear-gradient(90deg,var(--accent3),var(--warn),var(--accent))',
                  transition: 'width 1s ease-out', borderRadius: 2,
                }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div style={{ border: '1px solid var(--border)' }}>
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--accent)' }}>
            Audit Registry
          </div>
          <div style={{ fontSize: 10, color: 'var(--muted)' }}>
            {total > 0 ? `${total} records` : 'No audits yet'}
          </div>
        </div>

        {total === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
            No audits yet. Run a Truth Audit to populate the city registry.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['#', 'Entity', 'Score', 'Risk Signals', 'Verdict', 'Time'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', fontSize: 10, color: 'var(--muted)',
                    textTransform: 'uppercase', letterSpacing: 2,
                    padding: '12px 16px', borderBottom: '1px solid var(--border)',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {combined.map((item, i) => {
                const cls = item.score >= 70
                  ? { bg: 'rgba(0,255,195,0.1)', border: 'rgba(0,255,195,0.3)', color: 'var(--accent)' }
                  : item.score >= 50
                  ? { bg: 'rgba(255,179,71,0.1)', border: 'rgba(255,179,71,0.3)', color: 'var(--warn)' }
                  : { bg: 'rgba(255,51,102,0.1)', border: 'rgba(255,51,102,0.3)', color: 'var(--accent3)' };
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: 16, fontSize: 10, color: 'var(--muted)' }}>{i + 1}</td>
                    <td style={{ padding: 16, fontFamily: 'var(--font-display)', fontWeight: 600 }}>{item.company}</td>
                    <td style={{ padding: 16 }}>
                      <span style={{
                        padding: '4px 12px', fontSize: 11, fontWeight: 700,
                        background: cls.bg, border: `1px solid ${cls.border}`, color: cls.color,
                      }}>
                        {item.score} / 100
                      </span>
                    </td>
                    <td style={{ padding: 16, fontSize: 10, color: 'var(--accent3)', lineHeight: 1.8 }}>
                      {item.flags && item.flags.length > 0
                        ? item.flags.slice(0, 2).map((f, j) => <div key={j}>⚑ {f}</div>)
                        : <span style={{ color: 'var(--accent)' }}>✓ Clean</span>}
                    </td>
                    <td style={{ padding: 16, fontSize: 11, color: cls.color }}>{item.verdict}</td>
                    <td style={{ padding: 16, fontSize: 10, color: 'var(--muted)' }}>
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}