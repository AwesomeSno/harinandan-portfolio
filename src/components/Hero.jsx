import { useConfig } from '../utils/ConfigContext'

export default function Hero({ heroFade }) {
  const { config } = useConfig()
  const h = config.hero || {}

  return (
    <div
      id="hero-text"
      style={{ opacity: heroFade.opacity, transform: `translateY(${heroFade.ty}px)` }}
    >
      <div className="eyebrow">{h.eyebrow}</div>
      <h1 className="hero-name">
        {h.name1}<br />
        <span className="line2">{h.name2}</span>
      </h1>
      <div className="hero-meta">
        <p className="hero-role" style={{ whiteSpace: 'pre-line' }}>
          {h.role}
        </p>
        <span className="hero-badge">{h.badge}</span>
      </div>
    </div>
  )
}
