export default function ContactPanel({ active }) {
  return (
    <div id="contact-panel" className={`content-panel glass-card${active ? ' active' : ''}`}>
      <div className="panel-label" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
        05 — Contact
      </div>
      <h2 className="contact-heading">Let's build<br /><em>the future.</em></h2>
      <p className="contact-sub">
        Open to collaborations, research projects,<br />
        and conversations worth having.
      </p>
      <span className="contact-org">Co-Founder @ AxeomLabs · Founder @ The Shadow Company</span>
      <div className="contact-links">
        <a href="mailto:harinandan@example.com" className="contact-link primary"><span>Get in touch</span></a>
        <a href="#" className="contact-link"><span>GitHub</span></a>
        <a href="#" className="contact-link"><span>LinkedIn</span></a>
      </div>
    </div>
  )
}
