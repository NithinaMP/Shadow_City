import { useState } from 'react';
import axios from 'axios';

export default function InterviewPage() {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [flags, setFlags] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');

  const generateQuestions = async () => {
    if (!company || !role) { setError('Company and role are required'); return; }
    setError('');
    setLoading(true);
    setQuestions([]);
    try {
      const res = await axios.post('http://localhost:5000/api/questions', { company, role, flags });
      setQuestions(res.data);
    } catch {
      setError('Failed. Is the backend running?');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 128px)' }}>

      {/* LEFT */}
      <div style={{ padding: 48, borderRight: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, lineHeight: 1.1, marginBottom: 12 }}>
          Agentic<br />Interviewer
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 32 }}>
          Don't just answer their questions. Ask the right ones. Generate precision trap questions to expose corporate hypocrisy during your interview.
        </div>

        <label style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 2, display: 'block', marginBottom: 8 }}>
          Company Name
        </label>
        <input
          value={company}
          onChange={e => setCompany(e.target.value)}
          placeholder="Company name"
          style={{
            width: '100%', background: 'var(--surface)',
            border: '1px solid var(--border)', color: 'var(--text)',
            fontFamily: 'var(--font-mono)', fontSize: 13,
            padding: '14px 16px', outline: 'none', marginBottom: 20,
          }}
        />

        <label style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 2, display: 'block', marginBottom: 8 }}>
          Role
        </label>
        <input
          value={role}
          onChange={e => setRole(e.target.value)}
          placeholder="e.g. Software Engineer"
          style={{
            width: '100%', background: 'var(--surface)',
            border: '1px solid var(--border)', color: 'var(--text)',
            fontFamily: 'var(--font-mono)', fontSize: 13,
            padding: '14px 16px', outline: 'none', marginBottom: 20,
          }}
        />

        <label style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 2, display: 'block', marginBottom: 8 }}>
          Red Flags Noticed (optional)
        </label>
        <textarea
          value={flags}
          onChange={e => setFlags(e.target.value)}
          placeholder="e.g. They said fast-paced, salary not mentioned..."
          style={{
            width: '100%', height: 120,
            background: 'var(--surface)', border: '1px solid var(--border)',
            color: 'var(--text)', fontFamily: 'var(--font-mono)',
            fontSize: 13, padding: '14px 16px', outline: 'none',
            resize: 'none', lineHeight: 1.7, marginBottom: 8,
          }}
        />

        {error && (
          <div style={{ color: 'var(--accent3)', fontSize: 11, marginBottom: 8 }}>{error}</div>
        )}

        <button
          onClick={generateQuestions}
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
          {loading ? 'GENERATING...' : 'GENERATE TRAP QUESTIONS'}
        </button>
      </div>

      {/* RIGHT */}
      <div style={{ padding: 48 }}>
        {questions.length === 0 && !loading && (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            height: '100%', gap: 16, opacity: 0.3,
          }}>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <rect x="5" y="5" width="50" height="38" rx="4" stroke="#00ffc3" strokeWidth="1" fill="none" />
              <line x1="15" y1="18" x2="45" y2="18" stroke="#00ffc3" strokeWidth="0.5" opacity="0.5" />
              <line x1="15" y1="26" x2="35" y2="26" stroke="#00ffc3" strokeWidth="0.5" opacity="0.5" />
            </svg>
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center' }}>
              AWAITING INPUT
            </div>
          </div>
        )}

        {loading && (
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', height: '100%',
            fontSize: 12, color: 'var(--accent)',
            textTransform: 'uppercase', letterSpacing: 2,
          }}>
            GENERATING QUESTIONS...
          </div>
        )}

        {questions.length > 0 && (
          <div>
            <div style={{ fontSize: 10, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 24 }}>
              AI-Generated Trap Questions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {questions.map((q, i) => (
                <div key={i} style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderLeft: '3px solid var(--accent2)',
                  padding: 20,
                  animation: 'slideIn 0.4s ease-out',
                  animationDelay: i * 0.1 + 's',
                  animationFillMode: 'both',
                }}>
                  <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
                    Trap Question {i + 1}
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.7 }}>"{q.question}"</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)', fontStyle: 'italic' }}>
                    → {q.why}
                  </div>
                </div>
              ))}
            </div>
            <style>{`@keyframes slideIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }`}</style>
          </div>
        )}
      </div>
    </div>
  );
}