import { useState, useEffect, useRef } from 'react'

export default function SectionLabel({ label }) {
  const [displayed, setDisplayed] = useState(label)
  const [visible, setVisible]     = useState(true)
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return }
    setVisible(false)
    const t = setTimeout(() => { setDisplayed(label); setVisible(true) }, 200)
    return () => clearTimeout(t)
  }, [label])

  return (
    <div id="section-label" style={{ opacity: visible ? 1 : 0 }}>
      {displayed}
    </div>
  )
}
