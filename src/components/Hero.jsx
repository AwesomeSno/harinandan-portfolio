export default function Hero({ heroFade }) {
  return (
    <div
      id="hero-text"
      style={{ opacity: heroFade.opacity, transform: `translateY(${heroFade.ty}px)` }}
    >
      <div className="eyebrow">Systems Developer</div>
      <h1 className="hero-name">
        Hari<br />
        <span className="line2">nandan</span>
      </h1>
      <div className="hero-meta">
        <p className="hero-role">
          Building at the edge of AI,<br />
          OS architecture &amp; hardware.
        </p>
        <span className="hero-badge">Co-Founder · AxeomLabs</span>
      </div>
    </div>
  )
}
