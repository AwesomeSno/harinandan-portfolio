import { 
  Code2, 
  Cpu, 
  Globe, 
  Eye, 
  Lock, 
  Terminal, 
  Bot, 
  Brain, 
  CircuitBoard 
} from 'lucide-react'

const TECH = [
  { icon: Code2,        name: 'Python',     level: 'Expert'   },
  { icon: Cpu,          name: 'C / C++',   level: 'Advanced' },
  { icon: Globe,        name: 'JavaScript', level: 'Advanced' },
  { icon: Eye,          name: 'OpenCV',    level: 'Advanced' },
  { icon: Lock,         name: 'Encryption', level: 'Advanced' },
  { icon: Terminal,     name: 'Linux',      level: 'Expert'   },
  { icon: Bot,          name: 'Arduino',    level: 'Advanced' },
  { icon: Brain,        name: 'AI / ML',    level: 'Advanced' },
  { icon: CircuitBoard, name: 'Embedded',   level: 'Advanced' },
]

export default function TechPanel({ active }) {
  return (
    <section id="tech-panel" className={`content-panel glass-card${active ? ' active' : ''}`}>
      <div className="panel-label">04 — Stack</div>
      <h2 className="panel-heading">Tools &amp;<br />systems.</h2>
      <div className="tech-grid">
        {TECH.map(t => (
          <div key={t.name} className="tech-cell">
            <div className="tech-icon">
              <t.icon size={20} strokeWidth={1.5} />
            </div>
            <div className="tech-name">{t.name}</div>
            <div className="tech-level">{t.level}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
