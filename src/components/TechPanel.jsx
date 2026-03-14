import { 
  Code2, 
  Cpu, 
  Globe, 
  Eye, 
  Lock, 
  Terminal, 
  Bot, 
  Brain, 
  CircuitBoard,
  FileCode
} from 'lucide-react'
import { useConfig } from '../utils/ConfigContext'

const ICON_MAP = {
  Code2, Cpu, Globe, Eye, Lock, Terminal, Bot, Brain, CircuitBoard, FileCode
}

export default function TechPanel({ active }) {
  const { config } = useConfig()
  const tech = config.tech || []

  return (
    <section id="tech-panel" className={`content-panel glass-card${active ? ' active' : ''}`}>
      <div className="panel-label">04 — Stack</div>
      <h2 className="panel-heading">Tools &amp;<br />systems.</h2>
      <div className="tech-grid">
        {tech.map(t => {
          const Icon = ICON_MAP[t.icon] || FileCode
          return (
            <div key={t.name} className="tech-cell">
              <div className="tech-icon">
                <Icon size={20} strokeWidth={1.5} />
              </div>
              <div className="tech-name">{t.name}</div>
              <div className="tech-level">{t.level}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
