import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'

export default function Dashboard({ session }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [projects, setProjects] = useState([])
  const [newProject, setNewProject] = useState({
    title: '', technologies: '', description: '', github_url: '', live_url: ''
  })

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

  const handleAddProject = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const { error } = await supabase
        .from('projects')
        .insert([newProject])

      if (error) throw error
      
      setMessage('Project added successfully.')
      setNewProject({ title: '', technologies: '', description: '', github_url: '', live_url: '' })
      fetchProjects()
    } catch (error) {
      setMessage('Error: ' + error.message)
    }
    setLoading(false)
  }

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this record?")) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
      
      if (error) throw error;
      fetchProjects();
    } catch(err) {
      setMessage('Error: ' + err.message)
    }
    setLoading(false);
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
          
          <form className="admin-form add-form" onSubmit={handleAddProject}>
            <div className="form-row">
              <input type="text" placeholder="Project Title" className="admin-input" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} required />
              <input type="text" placeholder="Technologies (e.g. React, ThreeJS)" className="admin-input" value={newProject.technologies} onChange={e => setNewProject({...newProject, technologies: e.target.value})} required />
            </div>
            <textarea placeholder="Description" className="admin-input textarea" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} required />
            <div className="form-row">
              <input type="url" placeholder="GitHub URL" className="admin-input" value={newProject.github_url} onChange={e => setNewProject({...newProject, github_url: e.target.value})} />
              <input type="url" placeholder="Live URL" className="admin-input" value={newProject.live_url} onChange={e => setNewProject({...newProject, live_url: e.target.value})} />
            </div>
            <button type="submit" disabled={loading} className="admin-btn active-btn">
              {loading ? 'PROCESSING...' : 'ADD NEW ENTRY'}
            </button>
          </form>

          <div className="admin-list" style={{ marginTop: '2rem' }}>
            {projects.length === 0 ? (
              <p className="admin-muted">No projects found. Use the form above to add your first entry.</p>
            ) : (
              projects.map((p) => (
                <div key={p.id} className="admin-item">
                  <div className="item-info">
                    <span className="admin-item-title">{p.title}</span>
                    <span className="admin-item-meta">{p.technologies}</span>
                  </div>
                  <button onClick={() => handleDeleteProject(p.id)} className="admin-btn delete-btn">DELETE</button>
                </div>
              ))
            )}
          </div>
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
