const TECH = [
  { icon: '🐍', name: 'Python',     level: 'Expert'   },
  { icon: '⚙️', name: 'C / C++',   level: 'Advanced' },
  { icon: '🌐', name: 'JavaScript', level: 'Advanced' },
  { icon: '👁️', name: 'OpenCV',    level: 'Advanced' },
  { icon: '🔐', name: 'Encryption', level: 'Advanced' },
  { icon: '🐧', name: 'Linux',      level: 'Expert'   },
  { icon: '🤖', name: 'Arduino',    level: 'Advanced' },
  { icon: '🧠', name: 'AI / ML',    level: 'Advanced' },
  { icon: '🔩', name: 'Embedded',   level: 'Advanced' },
]

export default function TechPanel({ active }) {
  return (
    <section id="tech-panel" className={`content-panel glass-card${active ? ' active' : ''}`}>
      <div className="panel-label">04 — Stack</div>
      <h2 className="panel-heading">Tools &amp;<br />systems.</h2>
      <div className="tech-grid">
        {TECH.map(t => (
          <div key={t.name} className="tech-cell">
            <div className="tech-icon">{t.icon}</div>
            <div className="tech-name">{t.name}</div>
            <div className="tech-level">{t.level}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
