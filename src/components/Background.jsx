import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Background({ sections, scrollProgRef, bootDone }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!bootDone || !containerRef.current) return
    console.log(">>> 3D SCENE INITIALIZING with", sections.length, "sections");

    const container = containerRef.current
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(window.innerWidth < 768 ? 75 : 60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 0, 22)
    
    // Safety Fog
    scene.fog = new THREE.FogExp2(0x020408, 0.016)

    // ── Lights ────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x0a101f, 1.2))
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0)
    sunLight.position.set(10, 10, 10)
    scene.add(sunLight)

    // ── Stars (Always Visible Fallback) ───────────────
    const sGeo = new THREE.BufferGeometry()
    const sPos = new Float32Array(5000 * 3)
    for (let i = 0; i < 5000; i++) {
      sPos[i*3]   = (Math.random() - .5) * 600
      sPos[i*3+1] = (Math.random() - .5) * 600
      sPos[i*3+2] = (Math.random() - .5) * 400
    }
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3))
    const stars = new THREE.Points(sGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 }))
    scene.add(stars)

    // ── The Holographic Globe ────────────────────────
    const globeGroup = new THREE.Group()
    scene.add(globeGroup)

    // Layer 1: Core Glow (Brighter)
    const coreMat = new THREE.MeshPhongMaterial({ 
      color: 0x00d4ff, 
      emissive: 0x00d4ff, 
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.9
    })
    const core = new THREE.Mesh(new THREE.SphereGeometry(5, 64, 64), coreMat)
    globeGroup.add(core)

    // Layer 2: Main Grid (More visible)
    const gridMat = new THREE.MeshBasicMaterial({ 
      color: 0xffffff, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.25 
    })
    const grid = new THREE.Mesh(new THREE.SphereGeometry(5.1, 40, 40), gridMat)
    globeGroup.add(grid)

    // Layer 3: Scanning Ring (Moving)
    const ringGeo = new THREE.TorusGeometry(7, 0.05, 2, 100)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.2 })
    const ring1 = new THREE.Mesh(ringGeo, ringMat)
    ring1.rotation.x = Math.PI / 2
    globeGroup.add(ring1)

    // Layer 4: Procedural Nebula
    const nGeo = new THREE.BufferGeometry()
    const nPos = new Float32Array(3000 * 3)
    const nCol = new Float32Array(3000 * 3)
    for (let i = 0; i < 3000; i++) {
       const r = 20 + Math.random() * 30
       const th = Math.random() * Math.PI * 2
       const ph = (Math.random() - 0.5) * Math.PI
       nPos[i*3] = r * Math.cos(ph) * Math.cos(th)
       nPos[i*3+1] = r * Math.sin(ph)
       nPos[i*3+2] = r * Math.cos(ph) * Math.sin(th)
       const isCyan = Math.random() > 0.4
       nCol[i*3] = isCyan ? 0 : 0.4
       nCol[i*3+1] = isCyan ? 0.8 : 0.2
       nCol[i*3+2] = isCyan ? 1.0 : 0.8
    }
    nGeo.setAttribute('position', new THREE.BufferAttribute(nPos, 3))
    nGeo.setAttribute('color', new THREE.BufferAttribute(nCol, 3))
    const nebula = new THREE.Points(nGeo, new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.6 }))
    scene.add(nebula)

    // ── Animation ─────────────────────────────────────
    let lp = 0, animId
    const camT = new THREE.Vector3()

    function animate() {
      animId = requestAnimationFrame(animate)
      const sp = scrollProgRef.current
      lp += (sp - lp) * 0.05
      
      const si = lp * (sections.length - 1)
      const idx0 = Math.floor(si)
      const idx1 = Math.min(idx0 + 1, sections.length - 1)
      const f = si - idx0
      const s0 = sections[idx0] || sections[0]
      const s1 = sections[idx1] || sections[0]

      if (s0 && s1) {
        camera.position.set(
          s0.cam.x + (s1.cam.x - s0.cam.x) * f,
          s0.cam.y + (s1.cam.y - s0.cam.y) * f,
          s0.cam.z + (s1.cam.z - s0.cam.z) * f
        )
        camT.set(
          s0.tgt.x + (s1.tgt.x - s0.tgt.x) * f,
          s0.tgt.y + (s1.tgt.y - s0.tgt.y) * f,
          0
        )
        camera.lookAt(camT)
        // scene.fog.density = s0.fog + (s1.fog - s0.fog) * f // Temporarily disabled for debugging
      }

      globeGroup.rotation.y += 0.002
      ring1.rotation.x += 0.01
      stars.rotation.y += 0.0001
      nebula.rotation.y += 0.0002
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [bootDone, sections, scrollProgRef])

  return <div id="canvas-container" ref={containerRef} />
}
