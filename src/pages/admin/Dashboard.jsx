import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'

export default function Dashboard({ session }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [projects, setProjects] = useState([])
  const [newProject, setNewProject] = useState({
    title: '', technologies: '', description: '', github_url: '', live_url: ''
  })

  // Site Config States
  const [siteConfig, setSiteConfig] = useState(null)
  const [historyList, setHistoryList] = useState([])
  const [configText, setConfigText] = useState('')

  useEffect(() => {
    fetchProjects()
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (!error && data && data.length > 0) {
        setSiteConfig(data[0].config)
        setConfigText(JSON.stringify(data[0].config, null, 2))
        setHistoryList(data)
      } else {
        // Default boilerplate if none exists
        const def = {
          hero: {
            eyebrow: "Systems Developer",
            name1: "Hari",
            name2: "nandan",
            role: "Building at the edge of AI,\nOS architecture & hardware.",
            badge: "Co-Founder · AxeomLabs"
          },
          about: {
            dob: "2008-04-14",
            location: "Thiruvananthapuram",
            heading: "Building the\nimpossible,\none system\nat a time.",
            body: "Systems developer from Kerala, India. I build across\nOS architecture, AI infrastructure, cybersecurity,\nrobotics, and computer vision.",
            stats: [
              { num: "6", plus: true, desc: "Major projects" },
              { num: "4", plus: true, desc: "Tech domains" },
              { num: "2", plus: false, desc: "Companies" }
            ],
            chips: ["Kerala Police · AI Intern", "AITEDUCONF 2024", "FOSS Fest 2023", "KITE Competition"]
          },
          tech: [
            { name: "Python", level: "Expert", icon: "Code2" },
            { name: "C / C++", level: "Advanced", icon: "Cpu" },
            { name: "JavaScript", level: "Advanced", icon: "Globe" },
            { name: "OpenCV", level: "Advanced", icon: "Eye" },
            { name: "Encryption", level: "Advanced", icon: "Lock" },
            { name: "Linux", level: "Expert", icon: "Terminal" },
            { name: "Arduino", level: "Advanced", icon: "Bot" },
            { name: "AI / ML", level: "Advanced", icon: "Brain" },
            { name: "Embedded", level: "Advanced", icon: "CircuitBoard" }
          ],
          sections: [
            { type: "Hero", lbl: "01 — Intro", cam: { x: 0, y: 0, z: 22 }, tgt: { x: 0, y: 0 }, fog: 0.016 },
            { type: "About", lbl: "02 — Identity", cam: { x: 13, y: 2, z: 15 }, tgt: { x: 0, y: 0 }, fog: 0.022 },
            { type: "Work", lbl: "03 — Work", cam: { x: -11, y: -3, z: 17 }, tgt: { x: -2, y: -1 }, fog: 0.02 },
            { type: "Stack", lbl: "04 — Stack", cam: { x: 5, y: 9, z: 15 }, tgt: { x: 0, y: 2 }, fog: 0.024 },
            { type: "Contact", lbl: "05 — Contact", cam: { x: 0, y: 0, z: 25 }, tgt: { x: 0, y: 0 }, fog: 0.013 }
          ]
        }
        setSiteConfig(def)
        setConfigText(JSON.stringify(def, null, 2))
      }
    } catch(err) {
      console.log('Ensure site_config table exists.', err)
    }
  }

  const handleSaveConfig = async () => {
    setLoading(true)
    try {
      const parsed = JSON.parse(configText)
      const { error } = await supabase.from('site_config').insert([{ config: parsed, version_name: 'Manual Update' }])
      if (error) throw error
      setMessage('Site configuration saved! A new version history point was created.')
      fetchConfig()
    } catch(err) {
      setMessage('Invalid JSON or Database Error: ' + err.message)
    }
    setLoading(false)
  }

  const handleRevert = async (historyRow) => {
    if(!window.confirm("Undo current changes and revert to this previous version?")) return;
    setLoading(true)
    try {
      const { error } = await supabase.from('site_config').insert([{ config: historyRow.config, version_name: 'Reverted Version' }])
      if (error) throw error
      setMessage('Successfully reverted to historical version.')
      fetchConfig()
    } catch(err) {
      setMessage('Error reverting: ' + err.message)
    }
    setLoading(false)
  }

  const handleAddDynamicSection = () => {
    try {
      const current = JSON.parse(configText);
      const newId = current.sections ? current.sections.length + 1 : 1;
      // Auto-assign random 3D space vectors for globe movement
      current.sections.push({
        type: "Custom",
        lbl: `0${newId} — Custom Area`,
        cam: { 
          x: Math.floor(Math.random() * 30 - 15), 
          y: Math.floor(Math.random() * 20 - 10), 
          z: Math.floor(Math.random() * 10 + 15) 
        },
        tgt: { x: 0, y: 0 },
        fog: 0.02
      });
      setConfigText(JSON.stringify(current, null, 2));
      setMessage('New section added to JSON structure. Press Save to publish and generate globe animation.');
    } catch(e) {
      setMessage('Fix JSON formatting before adding section.');
    }
  }

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
          <h2>TOTAL ARCHITECTURE CONTROL</h2>
          <p className="admin-muted">Modify the raw configuration of the website below. Use the button to automatically generate new sections with assigned 3D globe scrolling variables.</p>
          
          <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
            <button onClick={handleAddDynamicSection} className="admin-btn active-btn" style={{ marginRight: '1rem' }}>+ ADD NEW SECTION (AUTO 3D)</button>
          </div>

          <textarea 
            className="admin-input textarea" 
            style={{ width: '100%', height: '300px', fontFamily: 'monospace', fontSize: '12px' }}
            value={configText} 
            onChange={(e) => setConfigText(e.target.value)}
          />

          <button onClick={handleSaveConfig} disabled={loading} className="admin-btn active-btn" style={{ marginTop: '1rem' }}>
            {loading ? 'SAVING...' : 'PUBLISH CONFIGURATION'}
          </button>
        </section>

        <section className="admin-section">
          <h2>VERSION HISTORY (UNDO)</h2>
          <p className="admin-muted" style={{marginBottom: '1rem'}}>
             Every time you save, a snapshot of your site's codebase architecture is taken. Revert backwards in time instantly below.
          </p>
          <div className="admin-list">
            {historyList.length === 0 ? (
              <p className="admin-muted">No history stored yet. Create the 'site_config' table to track versions.</p>
            ) : (
              historyList.map((h, i) => (
                <div key={h.id} className="admin-item" style={{ borderColor: i === 0 ? '#00d4ff' : 'rgba(255,255,255,0.1)' }}>
                  <div className="item-info">
                    <span className="admin-item-title" style={{ color: i === 0 ? '#00d4ff' : '#8899ac' }}>
                      {i === 0 ? 'CURRENT LIVE VERSION' : `RESTORE POINT - ${new Date(h.created_at).toLocaleString()}`}
                    </span>
                    <span className="admin-item-meta">{h.version_name || 'System Snapshot'}</span>
                  </div>
                  {i !== 0 && (
                    <button onClick={() => handleRevert(h)} className="admin-btn logout-btn">REVERT TO THIS</button>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
