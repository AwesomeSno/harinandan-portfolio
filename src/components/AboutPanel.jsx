import { useConfig } from '../utils/ConfigContext'

export default function AboutPanel({ active }) {
  const { config } = useConfig()
  const a = config.about || {}

  const dob = new Date(a.dob || '2008-04-14')
  const now = new Date()
  let age = now.getFullYear() - dob.getFullYear()
  if (now < new Date(now.getFullYear(), dob.getMonth(), dob.getDate())) age--

  return (
    <section id="about-panel" className={`content-panel glass-card${active ? ' active' : ''}`}>
      <div className="panel-label">02 — Identity</div>
      <div className="age-badge">Age&nbsp;<strong>{age}</strong>&nbsp;· {a.location}</div>
      <h2 className="panel-heading" style={{ whiteSpace: 'pre-line' }}>{a.heading}</h2>
      <p className="panel-body" style={{ whiteSpace: 'pre-line' }}>
        {a.body}
      </p>
      <div className="stat-row">
        {(a.stats || []).map((s, i) => (
          <div key={i} className="stat">
            <div className="stat-num">{s.num}{s.plus && <span>+</span>}</div>
            <div className="stat-desc">{s.desc}</div>
          </div>
        ))}
      </div>
      <div className="chip-row">
        {(a.chips || []).map((c, i) => (
          <span key={i} className="chip">{c}</span>
        ))}
      </div>
    </section>
  )
}
