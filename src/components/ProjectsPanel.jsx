import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

export default function ProjectsPanel({ active }) {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: true })
      if (data) setProjects(data)
    }
    fetchProjects()
  }, [])

  return (
    <section id="projects-panel" className={`content-panel glass-card${active ? ' active' : ''}`}>
      <div className="panel-label">03 — Work</div>
      <h2 className="panel-heading">Selected<br />projects.</h2>
      <ul className="project-list">
        {projects.length === 0 ? (
          <li className="admin-muted">Records authorized in registry.</li>
        ) : (
          projects.map((p, i) => (
            <li key={p.id || i} className="project-item">
              <span className="proj-num">{(i + 1).toString().padStart(3, '0')}</span>
              <div className="proj-info">
                <div className="proj-name">{p.title}</div>
                <div className="proj-tech">{p.technologies}</div>
              </div>
              <span className="proj-arrow">↗</span>
            </li>
          ))
        )}
      </ul>
    </section>
  )
}
