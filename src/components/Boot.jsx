import { useState, useEffect } from 'react'
import { soundEngine } from '../utils/sounds'

const BOOT_LINES = [
  ['NEURAL CORE ONLINE',              'OK'],
  ['PARTICLE ENGINE LOADED',          'OK'],
  ['SHADER COMPILATION',              'OK'],
  ['SECURE ENV MOUNTED',              'OK'],
  ['3D RENDERER READY',               'OK'],
  ['OPERATOR: HARINANDAN J V',        '--'],
  ['LOCATION: THIRUVANANTHAPURAM, INDIA', '--'],
  ['COMPANY: AXEOMLABS / SHADOW CO.', '--'],
]

export default function Boot({ onComplete }) {
  const [powerOn, setPowerOn]     = useState(false)
  const [lines, setLines]         = useState([])
  const [visibleSet, setVisible]  = useState(new Set())
  const [sep2, setSep2]           = useState(false)
  const [finalShow, setFinalShow] = useState(false)
  const [bgWhite, setBgWhite]     = useState(false)
  const [out, setOut]             = useState(false)

  const handlePowerOn = () => {
    soundEngine.init()
    soundEngine.playPowerOn()
    setPowerOn(true)
  }

  useEffect(() => {
    if (!powerOn) return

    const timers = []
    let idx = 0

    const addLine = () => {
      if (idx >= BOOT_LINES.length) {
        setSep2(true)
        timers.push(setTimeout(() => setFinalShow(true), 200))
        timers.push(setTimeout(() => {
          setBgWhite(true)
          timers.push(setTimeout(() => {
            setOut(true)
            timers.push(setTimeout(onComplete, 1000))
          }, 80))
        }, 1400))
        return
      }
      const i = idx
      setLines(prev => [...prev, BOOT_LINES[i]])
      timers.push(setTimeout(() => {
        setVisible(prev => new Set([...prev, i]))
        soundEngine.playBeep()
      }, 16))
      idx++
      timers.push(setTimeout(addLine, idx < 6 ? 160 : 100))
    }

    timers.push(setTimeout(addLine, 350))
    return () => timers.forEach(clearTimeout)
  }, [powerOn, onComplete])

  return (
    <div id="boot" className={out ? 'out' : ''} style={bgWhite ? { background: '#fff' } : {}}>
      {!powerOn && (
        <div className="power-overlay" onClick={handlePowerOn}>
          <div className="power-content">
            <h1 className="power-heading">Harinandan J V</h1>
            <p className="power-subheading">Systems Developer &bull; OS Architecture &bull; Computing</p>
            <div className="power-action">
              <span className="pulse-dot"></span>
              TAP TO ENTER 
            </div>
          </div>
        </div>
      )}
      <div className="boot-box" style={{ opacity: powerOn ? 1 : 0 }}>
        <div className="boot-title">HARINANDAN.SYS - SYSTEMS DEVELOPER v1.0</div>
        <div className="boot-sep" />
        <div>
          {lines.map(([key, val], i) => (
            <div key={i} className={`boot-line${visibleSet.has(i) ? ' show' : ''}`}>
              <span className="bl-key">{key}</span>
              <span className="bl-ok">{val}</span>
            </div>
          ))}
        </div>
        <div className="boot-sep" style={{ opacity: sep2 ? 1 : 0, transition: 'opacity .3s' }} />
        <div className={`boot-final${finalShow ? ' show' : ''}`}>
          ENVIRONMENT READY <span className="blink">█</span>
        </div>
      </div>
    </div>
  )
}
