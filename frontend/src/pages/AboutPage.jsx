export default function AboutPage() {
  const layers = [
    { label: 'React Frontend (Vite + Tailwind)', color: 'var(--accent)' },
    { label: 'Node.js API Server (Express)', color: 'var(--text)' },
    { label: 'Claude AI Processing Layer', color: 'var(--accent2)' },
    { label: 'MySQL Relational Database', color: 'var(--text)' },
    { label: 'City Transparency Dashboard', color: 'var(--accent)' },
  ];

  return (
    <div style={{ padding: 48, maxWidth: 800, position: 'relative', zIndex: 1 }}>
      <div style={{ fontSize: 10, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 8 }}>// System Blueprint</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Shadow-City Architecture</div>

      {[
        {
          title: 'Abstract',
          content: `Shadow-City is a full-stack "Truth Engine" designed to bridge the information asymmetry gap in urban labor markets. Corporate job descriptions often mask toxic environments or misleading roles, leading to brain drain and inefficient talent allocation within the city. By integrating Smart Economy and Smart People pillars, Shadow-City moves beyond passive monitoring to active intervention.`
        },
        {
          title: 'Key Features',
          content: null,
          features: [
            { name: 'Decipher Engine', desc: 'Leverages Claude LLM to scan job descriptions for red-flag sentiment and hidden corporate jargon. Produces a Transparency Score from 0–100.' },
            { name: 'Agentic Interviewer', desc: 'Generates precision "trap questions" empowering candidates to audit city-based employers during the recruitment process.' },
            { name: 'City Dashboard', desc: 'Aggregates all audit data into a real-time urban intelligence feed — the first open transparency index for a city\'s labor market.' },
          ]
        },
      ].map(section => (
        <div key={section.title} style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--accent)', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>{section.title}</div>
          {section.content && <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 2 }}>{section.content}</div>}
          {section.features && section.features.map(f => (
            <div key={f.name} style={{ marginBottom: 16 }}>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{f.name}</span>
              <span style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 2 }}> — {f.desc}</span>
            </div>
          ))}
        </div>
      ))}

      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--accent)', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>System Architecture</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {layers.map((layer, i) => (
            <div key={layer.label}>
              <div style={{ padding: '10px 20px', border: '1px solid var(--border)', background: 'var(--surface)', color: layer.color, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, textAlign: 'center', borderColor: layer.color === 'var(--text)' ? 'var(--border)' : layer.color }}>
                {layer.label}
              </div>
              {i < layers.length - 1 && <div style={{ textAlign: 'center', color: 'var(--accent)', fontSize: 16, padding: '2px 0' }}>↓</div>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--accent)', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>Team</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 2 }}>
          <strong style={{ color: 'var(--text)' }}>Adithya P Ganesh</strong> &nbsp;·&nbsp; <strong style={{ color: 'var(--text)' }}>Nithina M P</strong><br/>
          Built for the Smart Cities Hackathon — Smart Economy and Smart People pillars.
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--accent)', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>Transparency Score Formula</div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 20, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', lineHeight: 2 }}>
          Score = 100<br/>
          &nbsp;&nbsp;− (N_red_flags × 15) &nbsp;// "wear multiple hats" = −15<br/>
          &nbsp;&nbsp;− (AI_risk_level × 25) // semantic severity from Claude<br/>
          &nbsp;&nbsp;+ (clarity_bonus)&nbsp;&nbsp;&nbsp;&nbsp; // explicit salary = +10<br/>
          <br/>
          <span style={{ color: 'var(--muted)' }}>// Score clamped to [0, 100]</span>
        </div>
      </div>
    </div>
  );
}