import { useState } from 'react';
import axios from 'axios';

const scanMessages = [
  'INITIALIZING HEURISTIC SCAN',
  'PARSING SEMANTIC PAYLOAD',
  'RUNNING NLP RISK ANALYSIS',
  'COMPUTING TRANSPARENCY INDEX',
  'GENERATING AUDIT REPORT',
];

export default function ScannerPage({ addToHistory }) {
  const [company, setCompany] = useState('');
  const [jobText, setJobText] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanMsg, setScanMsg] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const runAudit = async () => {
    if (!company || !jobText) { setError('Fill in all fields'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    let i = 0;
    setScanMsg(scanMessages[0]);
    const interval = setInterval(() => {
      i = (i + 1) % scanMessages.length;
      setScanMsg(scanMessages[i]);
    }, 1500);

    try {
      const res = await axios.post('http://localhost:5000/api/audit', { company, jobText });
      const data = res.data;
      setResult(data);
      addToHistory({ company, ...data, timestamp: new Date().toISOString() });
    } catch {
      setError('Audit failed. Is the backend running?');
    }

    clearInterval(interval);
    setLoading(false);
  };

  const scoreColor = result
    ? result.score >= 70 ? 'var(--accent)'
    : result.score >= 50 ? 'var(--warn)'
    : 'var(--accent3)'
    : 'var(--accent)';

  const circumference = 276.46;
  const offset = result ? circumference - (result.score / 100) * circumference : circumference;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 128px)' }}>

      {/* LEFT */}
      <div style={{ padding: 48, borderRight: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, lineHeight: 1.1, marginBottom: 12 }}>
          Truth Audit<br />Engine
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 32 }}>
          Paste any job description. Our AI strips the corporate varnish and reveals the transparency score underneath.
        </div>

        <label style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 2, display: 'block', marginBottom: 8 }}>
          Company Name
        </label>
        <input
          value={company}
          onChange={e => setCompany(e.target.value)}
          placeholder="e.g. InnovateTech Solutions Pvt Ltd"
          style={{
            width: '100%', background: 'var(--surface)',
            border: '1px solid var(--border)', color: 'var(--text)',
            fontFamily: 'var(--font-mono)', fontSize: 13,
            padding: '14px 16px', outline: 'none', marginBottom: 20,
          }}
        />

        <label style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 2, display: 'block', marginBottom: 8 }}>
          Job Description
        </label>
        <textarea
          value={jobText}
          onChange={e => setJobText(e.target.value)}
          placeholder="Paste the full job description here..."
          style={{
            width: '100%', height: 220,
            background: 'var(--surface)', border: '1px solid var(--border)',
            color: 'var(--text)', fontFamily: 'var(--font-mono)',
            fontSize: 13, padding: '14px 16px', outline: 'none',
            resize: 'none', lineHeight: 1.7, marginBottom: 8,
          }}
        />

        {error && (
          <div style={{ color: 'var(--accent3)', fontSize: 11, marginBottom: 8 }}>
            {error}
          </div>
        )}

        <button
          onClick={runAudit}
          disabled={loading}
          style={{
            width: '100%', padding: 18,
            background: loading ? 'var(--muted)' : 'var(--accent)',
            color: 'var(--bg)', border: 'none',
            fontFamily: 'var(--font-display)', fontSize: 13,
            fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: 3, cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? scanMsg + '...' : 'INITIATE TRUTH AUDIT'}
        </button>
      </div>

      {/* RIGHT */}
      <div style={{ padding: 48 }}>
        {!result && !loading && (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            height: '100%', gap: 16, opacity: 0.3,
          }}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <polygon points="40,5 75,22.5 75,57.5 40,75 5,57.5 5,22.5" stroke="#00ffc3" strokeWidth="1" fill="none" />
              <circle cx="40" cy="40" r="4" fill="#00ffc3" opacity="0.5" />
            </svg>
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 3, textAlign: 'center' }}>
              AWAITING INTERCEPT
            </div>
          </div>
        )}

        {loading && (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            height: '100%', gap: 32,
          }}>
            <div style={{ position: 'relative', width: 120, height: 120 }}>
              <div style={{
                width: 120, height: 120,
                border: '2px solid var(--border)',
                borderTopColor: 'var(--accent)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
              <div style={{
                position: 'absolute', width: 80, height: 80,
                border: '1px solid var(--border)',
                borderBottomColor: 'var(--accent2)',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite reverse',
                top: 20, left: 20,
              }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center' }}>
              {scanMsg}...
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {result && (
          <div style={{ animation: 'slideIn 0.4s ease-out' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>{company}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>ANALYSIS COMPLETE</div>
              </div>
              <div style={{ position: 'relative', width: 100, height: 100 }}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="var(--border)" strokeWidth="4" />
                  <circle
                    cx="50" cy="50" r="44" fill="none"
                    stroke={scoreColor} strokeWidth="4"
                    strokeDasharray="276.46"
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
                  />
                </svg>
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: scoreColor }}>
                    {result.score}
                  </span>
                  <span style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>/ 100</span>
                </div>
              </div>
            </div>

            <div style={{ fontSize: 12, color: scoreColor, marginBottom: 20 }}>● {result.verdict}</div>

            <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
              Detected Risk Signals
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {result.flags && result.flags.length > 0
                ? result.flags.map((flag, i) => (
                  <span key={i} style={{
                    padding: '6px 14px', fontSize: 10,
                    textTransform: 'uppercase', letterSpacing: 1.5,
                    background: 'rgba(255,51,102,0.1)',
                    border: '1px solid rgba(255,51,102,0.4)',
                    color: '#ff6680',
                  }}>
                    ⚑ {flag}
                  </span>
                ))
                : (
                  <span style={{
                    padding: '6px 14px', fontSize: 10,
                    background: 'rgba(0,255,195,0.08)',
                    border: '1px solid rgba(0,255,195,0.3)',
                    color: 'var(--accent)',
                  }}>
                    ✓ NO CRITICAL FLAGS
                  </span>
                )}
            </div>

            <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
              Analysis
            </div>
            <div style={{
              fontSize: 12, color: 'var(--muted)', lineHeight: 1.8,
              padding: 16, borderLeft: '2px solid var(--border)',
              background: 'var(--surface)',
            }}>
              {result.analysis}
            </div>

            <div style={{
              marginTop: 20, paddingTop: 16,
              borderTop: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between',
              fontSize: 10, color: 'var(--muted)',
              textTransform: 'uppercase', letterSpacing: 1,
            }}>
              <span>Confidence: <span style={{ color: 'var(--text)' }}>{result.confidence}</span></span>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>

            <style>{`@keyframes slideIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }`}</style>
          </div>
        )}
      </div>
    </div>
  );
}