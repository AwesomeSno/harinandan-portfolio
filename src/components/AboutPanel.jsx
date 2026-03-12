const dob = new Date(2008, 3, 14)
const now = new Date()
let age = now.getFullYear() - dob.getFullYear()
if (now < new Date(now.getFullYear(), 3, 14)) age--

export default function AboutPanel({ active }) {
  return (
    <div id="about-panel" className={`content-panel glass-card${active ? ' active' : ''}`}>
      <div className="panel-label">02 — Identity</div>
      <div className="age-badge">Age&nbsp;<strong>{age}</strong>&nbsp;· Thiruvananthapuram</div>
      <h2 className="panel-heading">Building the<br />impossible,<br />one system<br />at a time.</h2>
      <p className="panel-body">
        Systems developer from Kerala, India. I build across<br />
        OS architecture, AI infrastructure, cybersecurity,<br />
        robotics, and computer vision.
      </p>
      <div className="stat-row">
        <div className="stat">
          <div className="stat-num">6<span>+</span></div>
          <div className="stat-desc">Major projects</div>
        </div>
        <div className="stat">
          <div className="stat-num">4<span>+</span></div>
          <div className="stat-desc">Tech domains</div>
        </div>
        <div className="stat">
          <div className="stat-num">2<span /></div>
          <div className="stat-desc">Companies</div>
        </div>
      </div>
      <div className="chip-row">
        <span className="chip">Kerala Police · AI Intern</span>
        <span className="chip">AITEDUCONF 2024</span>
        <span className="chip">FOSS Fest 2023</span>
        <span className="chip">KITE Competition</span>
      </div>
    </div>
  )
}
