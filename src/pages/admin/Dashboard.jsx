import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'

export default function Dashboard({ session }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // We will build out states referencing 'projects', 'tech_stack', etc.
  const [projects, setProjects] = useState([])

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: true })

      if (error) throw error
      if (data) setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error.message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/' // redirect to home
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>COMMAND CENTER</h1>
        <button onClick={handleLogout} className="admin-btn logout-btn">TERMINATE CONNECTION</button>
      </header>

      <main className="admin-main">
        {message && <div className="admin-alert">{message}</div>}

        <section className="admin-section">
          <h2>PROJECT REGISTRY</h2>
          <div className="admin-list">
            {projects.length === 0 ? (
              <p className="admin-muted">No projects found. Create table 'projects' in Supabase to start adding.</p>
            ) : (
              projects.map((p) => (
                <div key={p.id} className="admin-item">
                  <span className="admin-item-title">{p.title}</span>
                  <span className="admin-item-meta">{p.technologies}</span>
                </div>
              ))
            )}
          </div>
          <button className="admin-btn active-btn">ADD NEW ENTRY</button>
        </section>

        <section className="admin-section">
          <h2>SYSTEM DATA / TECH STACK</h2>
          <p className="admin-muted" style={{marginTop: '1rem'}}>
             Module under construction...
          </p>
        </section>
      </main>
    </div>
  )
}
