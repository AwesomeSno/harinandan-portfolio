export default function ContactPanel({ active }) {
  return (
    <section id="contact-panel" className={`content-panel glass-card${active ? ' active' : ''}`}>
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
        <a href="mailto:harinandanjv2008@gmail.com" className="contact-link primary" aria-label="Email Harinandan J V" rel="me"><span>Get in touch</span></a>
        <a href="https://github.com/AwesomeSno" className="contact-link" target="_blank" rel="me noopener noreferrer" aria-label="Harinandan J V's GitHub Profile"><span>GitHub</span></a>
        <a href="https://linkedin.com/in/harinandanjv" className="contact-link" target="_blank" rel="me noopener noreferrer" aria-label="Harinandan J V's LinkedIn Profile"><span>LinkedIn</span></a>
      </div>
    </section>
  )
}
