const PROJECTS = [
  { num: '001', name: 'ObscuraOS',                 tech: 'OS Architecture · Encryption · Secure Computing' },
  { num: '002', name: 'Obscura Engine',             tech: 'AI Research · Multi-Platform Discovery · NLP' },
  { num: '003', name: 'ZeroVault',                  tech: 'Python · Tkinter · Fernet Encryption' },
  { num: '004', name: 'Hand Gesture Control System',tech: 'OpenCV · Arduino · Computer Vision' },
  { num: '005', name: 'Smart Home Automation',      tech: 'IoT · IP Camera Surveillance · Arduino' },
  { num: '006', name: 'Robotic Arm System',         tech: 'Arduino · 3D Printing · Embedded Control' },
]

export default function ProjectsPanel({ active }) {
  return (
    <section id="projects-panel" className={`content-panel glass-card${active ? ' active' : ''}`}>
      <div className="panel-label">03 — Work</div>
      <h2 className="panel-heading">Selected<br />projects.</h2>
      <ul className="project-list">
        {PROJECTS.map(p => (
          <li key={p.num} className="project-item">
            <span className="proj-num">{p.num}</span>
            <div className="proj-info">
              <div className="proj-name">{p.name}</div>
              <div className="proj-tech">{p.tech}</div>
            </div>
            <span className="proj-arrow">↗</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
