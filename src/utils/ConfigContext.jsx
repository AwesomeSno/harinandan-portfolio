import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from './supabase'

const ConfigContext = createContext()

export const useConfig = () => useContext(ConfigContext)

const defaultSections = [
  { type: "Hero", lbl: "01 — Intro", cam: { x: 0, y: 0, z: 22 }, tgt: { x: 0, y: 0 }, fog: 0.016 },
  { type: "About", lbl: "02 — Identity", cam: { x: 13, y: 2, z: 15 }, tgt: { x: 0, y: 0 }, fog: 0.022 },
  { type: "Work", lbl: "03 — Work", cam: { x: -11, y: -3, z: 17 }, tgt: { x: -2, y: -1 }, fog: 0.02 },
  { type: "Stack", lbl: "04 — Stack", cam: { x: 5, y: 9, z: 15 }, tgt: { x: 0, y: 2 }, fog: 0.024 },
  { type: "Contact", lbl: "05 — Contact", cam: { x: 0, y: 0, z: 25 }, tgt: { x: 0, y: 0 }, fog: 0.013 }
]

const defaultConfig = {
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
  sections: defaultSections
}

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(defaultConfig)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchConfig() {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('config')
          .order('created_at', { ascending: false })
          .limit(1)

        if (data && data.length > 0) {
          setConfig(data[0].config)
        }
      } catch (err) {
        console.error('Config fetch failed:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [])

  return (
    <ConfigContext.Provider value={{ config, loading }}>
      {children}
    </ConfigContext.Provider>
  )
}
