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
  const [activeTab, setActiveTab] = useState('hero') // 'hero', 'about', 'tech', 'sections', 'json'
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
      
      const config = (data && data.length > 0) ? data[0].config : {
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
      
      setSiteConfig(config)
      setConfigText(JSON.stringify(config, null, 2))
      if (data) setHistoryList(data)
    } catch(err) {
      console.log('Ensure site_config table exists.', err)
    }
  }

  const updateConfigField = (path, value) => {
    const newConfig = { ...siteConfig }
    const keys = path.split('.')
    let current = newConfig
    for (let i = 0; i < keys.length - 1; i++) {
       current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value
    setSiteConfig(newConfig)
    setConfigText(JSON.stringify(newConfig, null, 2))
  }

  const handleSaveConfig = async () => {
    setLoading(true)
    try {
      // Use the live siteConfig state which is kept in sync with the GUI
      const { error } = await supabase.from('site_config').insert([{ config: siteConfig, version_name: 'GUI Update' }])
      if (error) throw error
      setMessage('Configuration deployed successfully!')
      fetchConfig()
    } catch(err) {
      setMessage('Error: ' + err.message)
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

  const handleResetConfig = () => {
    if (!window.confirm("This will wipe your current GUI settings and restore the original cinematic defaults. Are you sure?")) return;
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
    setMessage('Dashboard reset to factory values. Click PUBLISH to apply to live site.')
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
          <div className="admin-tabs">
            <button className={`tab-btn ${activeTab === 'hero' ? 'active' : ''}`} onClick={() => setActiveTab('hero')}>HERO</button>
            <button className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>ABOUT</button>
            <button className={`tab-btn ${activeTab === 'tech' ? 'active' : ''}`} onClick={() => setActiveTab('tech')}>TECH</button>
            <button className={`tab-btn ${activeTab === 'sections' ? 'active' : ''}`} onClick={() => setActiveTab('sections')}>SECTIONS</button>
            <button className={`tab-btn ${activeTab === 'json' ? 'active' : ''}`} onClick={() => setActiveTab('json')}>RAW JSON</button>
          </div>

          <div className="tab-content" style={{ marginTop: '2rem' }}>
            {siteConfig && activeTab === 'hero' && (
              <div className="admin-form">
                <div className="form-row">
                  <div className="form-group"><label>Eyebrow</label><input className="admin-input" value={siteConfig.hero?.eyebrow || ''} onChange={e => updateConfigField('hero.eyebrow', e.target.value)} /></div>
                  <div className="form-group"><label>Badge</label><input className="admin-input" value={siteConfig.hero?.badge || ''} onChange={e => updateConfigField('hero.badge', e.target.value)} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Name Line 1</label><input className="admin-input" value={siteConfig.hero?.name1 || ''} onChange={e => updateConfigField('hero.name1', e.target.value)} /></div>
                  <div className="form-group"><label>Name Line 2</label><input className="admin-input" value={siteConfig.hero?.name2 || ''} onChange={e => updateConfigField('hero.name2', e.target.value)} /></div>
                </div>
                <div className="form-group">
                  <label>Role Description</label>
                  <textarea className="admin-input textarea" value={siteConfig.hero?.role || ''} onChange={e => updateConfigField('hero.role', e.target.value)} />
                </div>
              </div>
            )}

            {siteConfig && activeTab === 'about' && (
              <div className="admin-form">
                <div className="form-row">
                  <div className="form-group"><label>Date of Birth</label><input type="date" className="admin-input" value={siteConfig.about?.dob || ''} onChange={e => updateConfigField('about.dob', e.target.value)} /></div>
                  <div className="form-group"><label>Location</label><input className="admin-input" value={siteConfig.about?.location || ''} onChange={e => updateConfigField('about.location', e.target.value)} /></div>
                </div>
                <div className="form-group"><label>Heading</label><textarea className="admin-input textarea" value={siteConfig.about?.heading || ''} onChange={e => updateConfigField('about.heading', e.target.value)} /></div>
                <div className="form-group"><label>Body Text</label><textarea className="admin-input textarea" value={siteConfig.about?.body || ''} onChange={e => updateConfigField('about.body', e.target.value)} /></div>
              </div>
            )}

            {siteConfig && activeTab === 'tech' && (
              <div className="admin-list">
                {(siteConfig.tech || []).map((t, idx) => (
                  <div key={idx} className="admin-item" style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.03)' }}>
                    <div className="item-info" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', width: '100%', marginBottom: '0.5rem' }}>
                      <input className="admin-input" placeholder="Name" value={t.name || ''} onChange={e => {
                        const newTech = [...siteConfig.tech]; newTech[idx].name = e.target.value; updateConfigField('tech', newTech)
                      }} />
                      <input className="admin-input" placeholder="Level" value={t.level || ''} onChange={e => {
                        const newTech = [...siteConfig.tech]; newTech[idx].level = e.target.value; updateConfigField('tech', newTech)
                      }} />
                      <input className="admin-input" placeholder="Icon ID" value={t.icon || ''} onChange={e => {
                        const newTech = [...siteConfig.tech]; newTech[idx].icon = e.target.value; updateConfigField('tech', newTech)
                      }} />
                    </div>
                    <button className="admin-btn delete-btn" onClick={() => {
                       const newTech = siteConfig.tech.filter((_, i) => i !== idx); updateConfigField('tech', newTech)
                    }}>REMOVE</button>
                  </div>
                ))}
                <button className="admin-btn active-btn" onClick={() => {
                  const newTech = [...(siteConfig.tech || []), { name: "New Tool", level: "Beginner", icon: "Code2" }];
                  updateConfigField('tech', newTech)
                }}>+ ADD TECH</button>
              </div>
            )}

            {siteConfig && activeTab === 'sections' && (
              <div className="admin-list">
                {(siteConfig.sections || []).map((s, idx) => (
                  <div key={idx} className="admin-item" style={{ marginBottom: '1rem' }}>
                    <div className="item-info">
                      <input className="admin-input" style={{ width: '200px' }} value={s.lbl || ''} onChange={e => {
                        const newSec = [...siteConfig.sections]; newSec[idx].lbl = e.target.value; updateConfigField('sections', newSec)
                      }} />
                      <span className="admin-item-meta">{s.type} Section</span>
                    </div>
                    <button className="admin-btn logout-btn" style={{ marginLeft: '1rem' }} onClick={() => {
                        const newSec = siteConfig.sections.filter((_, i) => i !== idx); updateConfigField('sections', newSec)
                    }} disabled={s.type === 'Hero'}>DELETE</button>
                  </div>
                ))}
                <button onClick={handleAddDynamicSection} className="admin-btn active-btn">+ AUTO-ALLOCATE NEW 3D SECTION</button>
              </div>
            )}

            {activeTab === 'json' && (
              <textarea 
                className="admin-input textarea" 
                style={{ width: '100%', height: '400px', fontFamily: 'monospace', fontSize: '11px' }}
                value={configText} 
                onChange={(e) => {
                  setConfigText(e.target.value);
                  try { setSiteConfig(JSON.parse(e.target.value)); } catch(e){}
                }}
              />
            )}
          </div>

          <div className="admin-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button onClick={handleSaveConfig} disabled={loading} className="admin-btn active-btn" style={{ flex: 1, padding: '1.2rem' }}>
              {loading ? 'UPLOADING ARCHITECTURE...' : 'PUBLISH ALL CHANGES TO LIVE SITE'}
            </button>
            <button onClick={handleResetConfig} className="admin-btn logout-btn" style={{ padding: '0 1.5rem' }}>
              EMERGENCY RESET
            </button>
          </div>
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
