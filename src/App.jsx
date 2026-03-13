import { useState, useEffect, useRef, useCallback } from 'react'
import Boot from './components/Boot'
import Background from './components/Background'
import Header from './components/Header'
import Hero from './components/Hero'
import SectionLabel from './components/SectionLabel'
import Progress from './components/Progress'
import ScrollHint from './components/ScrollHint'
import AboutPanel from './components/AboutPanel'
import ProjectsPanel from './components/ProjectsPanel'
import TechPanel from './components/TechPanel'
import ContactPanel from './components/ContactPanel'
import { soundEngine } from './utils/sounds'

export const SECTIONS = [
  { cam: { x: 0,   y: 0,  z: 22 }, tgt: { x: 0,  y: 0  }, fog: 0.016, lbl: '01 — Intro' },
  { cam: { x: 13,  y: 2,  z: 15 }, tgt: { x: 0,  y: 0  }, fog: 0.022, lbl: '02 — Identity' },
  { cam: { x: -11, y: -3, z: 17 }, tgt: { x: -2, y: -1 }, fog: 0.02,  lbl: '03 — Work' },
  { cam: { x: 5,   y: 9,  z: 15 }, tgt: { x: 0,  y: 2  }, fog: 0.024, lbl: '04 — Stack' },
  { cam: { x: 0,   y: 0,  z: 25 }, tgt: { x: 0,  y: 0  }, fog: 0.013, lbl: '05 — Contact' },
]

export default function App() {
  const [bootDone, setBootDone]           = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [heroFade, setHeroFade]           = useState({ opacity: 0, ty: 30 })
  const [barsVisible, setBarsVisible]     = useState(false)
  const [scrollProg, setScrollProg]       = useState(0)

  const scrollProgRef = useRef(0)
  const curSecRef     = useRef(0)
  const flashRef      = useRef(null)

  const flashTransition = useCallback(() => {
    const el = flashRef.current
    if (!el) return
    el.style.transition = 'opacity .06s'
    el.style.opacity = '.14'
    setTimeout(() => {
      el.style.transition = 'opacity .35s'
      el.style.opacity = '0'
    }, 60)
  }, [])

  // Show hero after boot completes
  useEffect(() => {
    if (!bootDone) return
    const t = setTimeout(() => {
      setHeroFade({ opacity: 1, ty: 0 })
      soundEngine.playAmbient()
    }, 400)
    return () => clearTimeout(t)
  }, [bootDone])

  useEffect(() => {
    const handleScroll = () => {
      const max  = document.documentElement.scrollHeight - window.innerHeight
      const prog = Math.min(1, window.scrollY / max)
      scrollProgRef.current = prog
      setScrollProg(prog)

      const sec = Math.round(prog * (SECTIONS.length - 1))
      if (sec !== curSecRef.current) {
        flashTransition()
        curSecRef.current = sec
        setCurrentSection(sec)
      }

      const fade = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.35))
      if (sec === 0) {
        setHeroFade({ opacity: fade, ty: (1 - fade) * 24 })
      } else {
        setHeroFade({ opacity: 0, ty: 20 })
      }

      setBarsVisible(prog > 0.06)
    }

    const handleGlobalClick = () => {
      soundEngine.init()
      soundEngine.playClick()
    }

    const handleHover = (e) => {
      const tgt = e.target.closest('a, button, .tech-cell, .project-item')
      if (!tgt) return
      
      // Prevent trigger when moving between children of the same parent
      if (e.relatedTarget && tgt.contains(e.relatedTarget)) return
      
      soundEngine.playHover()
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        soundEngine.suspend()
      } else {
        soundEngine.resume()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('click', handleGlobalClick)
    document.addEventListener('mouseover', handleHover)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('click', handleGlobalClick)
      document.removeEventListener('mouseover', handleHover)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [flashTransition])

  const handleBootDone = useCallback(() => {
    soundEngine.init()
    setBootDone(true)
  }, [])

  return (
    <>
      <Boot onComplete={handleBootDone} />

      <div className={`cbar cbar-t${barsVisible ? ' show' : ''}`} />
      <div className={`cbar cbar-b${barsVisible ? ' show' : ''}`} />

      <div id="noise" />
      <div id="vignette" />
      <div id="scroll-progress" style={{ width: `${scrollProg * 100}%` }} />
      <div id="flash" ref={flashRef} />

      <Background sections={SECTIONS} scrollProgRef={scrollProgRef} bootDone={bootDone} />

      <div id="scroll-container">
        <main id="sticky-view">
          <div id="ui">
            <Header />
            <SectionLabel label={SECTIONS[currentSection].lbl} />
            <Hero heroFade={heroFade} />
            <AboutPanel active={currentSection === 1} />
            <ProjectsPanel active={currentSection === 2} />
            <TechPanel active={currentSection === 3} />
            <ContactPanel active={currentSection === 4} />
            <ScrollHint visible={bootDone && currentSection === 0 && heroFade.opacity > 0.05} />
            <Progress currentSection={currentSection} total={SECTIONS.length} />
          </div>
        </main>
      </div>
    </>
  )
}
