import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Background({ sections, scrollProgRef, bootDone }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!bootDone) return

    const container = containerRef.current

    // ── Renderer ──────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x020408, 1)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // ── Scene ─────────────────────────────────────────
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(window.innerWidth < 768 ? 75 : 60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 0, window.innerWidth < 768 ? 26 : 22)
    scene.fog = new THREE.FogExp2(0x020408, 0.016)

    // ── Lights ────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x0a101f, 0.8))
    
    // Primary Sun Light
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5)
    sunLight.position.set(20, 15, 20)
    scene.add(sunLight)

    // Subtle Cyan Rim/Fill
    const fillLight = new THREE.PointLight(0x00d4ff, 15, 100)
    fillLight.position.set(-20, -10, -10)
    scene.add(fillLight)

    // Deep Purple Secondary Fill
    const fillLight2 = new THREE.PointLight(0x7b61ff, 8, 80)
    fillLight2.position.set(0, -20, 5)
    scene.add(fillLight2)

    // ── Stars ─────────────────────────────────────────
    const sGeo = new THREE.BufferGeometry()
    const sPos = new Float32Array(5000 * 3)
    for (let i = 0; i < 5000; i++) {
      sPos[i*3]   = (Math.random() - .5) * 400
      sPos[i*3+1] = (Math.random() - .5) * 400
      sPos[i*3+2] = (Math.random() - .5) * 200
    }
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3))
    const stars = new THREE.Points(sGeo, new THREE.PointsMaterial({
      color: 0xffffff, size: .04, sizeAttenuation: true, transparent: true, opacity: .4,
    }))
    scene.add(stars)

    // ── Nebula ────────────────────────────────────────
    const nGeo = new THREE.BufferGeometry()
    const nPos = new Float32Array(4000 * 3)
    const nCol = new Float32Array(4000 * 3)
    const pal  = [
      new THREE.Color(0x00d4ff), new THREE.Color(0x1a2a4a),
      new THREE.Color(0x321a4a), new THREE.Color(0x020408),
    ]
    for (let i = 0; i < 4000; i++) {
      const r  = Math.random() * 45 + 10
      const th = Math.random() * Math.PI * 2
      const ph = (Math.random() - .5) * Math.PI * .6
      nPos[i*3]   = r * Math.cos(ph) * Math.cos(th)
      nPos[i*3+1] = r * Math.cos(ph) * Math.sin(th) * .4
      nPos[i*3+2] = r * Math.sin(ph) * .5
      const c = pal[Math.floor(Math.random() * 4)]
      nCol[i*3] = c.r; nCol[i*3+1] = c.g; nCol[i*3+2] = c.b
    }
    nGeo.setAttribute('position', new THREE.BufferAttribute(nPos, 3))
    nGeo.setAttribute('color',    new THREE.BufferAttribute(nCol, 3))
    const nebula = new THREE.Points(nGeo, new THREE.PointsMaterial({
      size: .12, vertexColors: true, transparent: true, opacity: .25, sizeAttenuation: true,
    }))
    scene.add(nebula)
    // ── Earth Globe ──────────────────────────────────
    const texLoader = new THREE.TextureLoader()
    const earthGroup = new THREE.Group()
    scene.add(earthGroup)

    // Load textures from a reliable CDN
    const earthDayTex = texLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    const earthBumpTex = texLoader.load('https://unpkg.com/three-globe/example/img/earth-topology.png')
    const earthSpecTex = texLoader.load('https://unpkg.com/three-globe/example/img/earth-waterbodies.png')

    const earthGeo = new THREE.SphereGeometry(5, 64, 64)
    const earthMat = new THREE.MeshPhongMaterial({
      map: earthDayTex,
      bumpMap: earthBumpTex,
      bumpScale: 0.15,
      specularMap: earthSpecTex,
      specular: new THREE.Color('grey'),
      shininess: 15
    })
    const earth = new THREE.Mesh(earthGeo, earthMat)
    earthGroup.add(earth)

    // Clouds
    const cloudTex = texLoader.load('https://unpkg.com/three-globe/example/img/earth-clouds.png')
    const cloudGeo = new THREE.SphereGeometry(5.1, 64, 64)
    const cloudMat = new THREE.MeshPhongMaterial({
      map: cloudTex,
      transparent: true,
      opacity: 0.4,
      depthWrite: false
    })
    const clouds = new THREE.Mesh(cloudGeo, cloudMat)
    earthGroup.add(clouds)

    // Atmosphere Glow (Fresnel)
    const atmosphereGeo = new THREE.SphereGeometry(5.15, 64, 64)
    const atmosphereMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      uniforms: {
        glowColor: { value: new THREE.Color(0x00d4ff) },
        viewVector: { value: camera.position }
      },
      vertexShader: `
        varying float intensity;
        void main() {
          vec3 vNormal = normalize(normalMatrix * normal);
          vec3 vNormel = normalize(normalMatrix * vec3(0.0, 0.0, 1.0));
          intensity = pow(0.7 - dot(vNormal, vNormel), 2.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          gl_FragColor = vec4(glowColor, intensity * 0.4);
        }
      `
    })
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat)
    earthGroup.add(atmosphere)

    // ── Surveillance Orbit Paths ──────────────────────
    const orbitData = [
      { r: 8,  tilt: 0.4,   color: 0x00d4ff, op: 0.12 },
      { r: 10, tilt: -0.6,  color: 0x7b61ff, op: 0.08 },
      { r: 12, tilt: 1.1,   color: 0xff6b35, op: 0.06 },
      { r: 9,  tilt: -1.2,  color: 0x00ffc3, op: 0.1 },
    ]

    orbitData.forEach(d => {
      const orbitGeo = new THREE.TorusGeometry(d.r, 0.012, 2, 120)
      const orbitMat = new THREE.MeshBasicMaterial({ color: d.color, transparent: true, opacity: d.op })
      const orbit = new THREE.Mesh(orbitGeo, orbitMat)
      orbit.rotation.x = Math.PI/2 + d.tilt
      scene.add(orbit)
    })

    // ── Scanning Grid/Rays ────────────────────────────
    const scanMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00d4ff, 
      transparent: true, 
      opacity: 0.05, 
      side: THREE.BackSide 
    })
    const scanSphere = new THREE.Mesh(new THREE.SphereGeometry(5.3, 32, 32), scanMaterial)
    const scanWire = new THREE.Mesh(new THREE.SphereGeometry(5.31, 32, 24), new THREE.MeshBasicMaterial({ 
      color: 0x00d4ff, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.03 
    }))
    earthGroup.add(scanSphere)
    earthGroup.add(scanWire)

    // ── Orbital Rings (Large) ─────────────────────────
    const mkR = (r, t, c, o, rx, ry, rz) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(r, t, 2, 120),
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o }),
      )
      m.rotation.set(rx || 0, ry || 0, rz || 0)
      scene.add(m)
      return m
    }
    const ring1 = mkR(14, .006, 0x00d4ff, .1, Math.PI / 3)
    const ring2 = mkR(18, .004, 0x7b61ff, .05, -Math.PI / 4, 0, Math.PI / 5)

    // ── Mouse/Touch parallax ──────────────────────────
    let mx = window.innerWidth / 2, my = window.innerHeight / 2
    const onMouseMove = e => { mx = e.clientX; my = e.clientY }
    const onTouchMove = e => { if (e.touches.length > 0) { mx = e.touches[0].clientX; my = e.touches[0].clientY } }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('touchmove', onTouchMove, { passive: true })

    // ── Animation loop ────────────────────────────────
    const camP  = new THREE.Vector3(0, 0, 22)
    const camT  = new THREE.Vector3()
    const L     = (a, b, t) => a + (b - a) * t
    const clock = new THREE.Clock()
    let lp = 0, animId

    function animate() {
      animId = requestAnimationFrame(animate)
      const sp = scrollProgRef.current
      const t  = clock.getElapsedTime()

      lp += (sp - lp) * .055
      const si = lp * (sections.length - 1)
      const s0 = sections[Math.floor(si)]
      const s1 = sections[Math.min(Math.ceil(si), sections.length - 1)]
      const f  = si - Math.floor(si)

      const mnx = ((mx / window.innerWidth)  - .5) * 2
      const mny = ((my / window.innerHeight) - .5) * -2

      camP.x += (L(s0.cam.x, s1.cam.x, f) + mnx * 1.4 - camP.x) * .04
      camP.y += (L(s0.cam.y, s1.cam.y, f) + mny * .9  - camP.y) * .04
      camP.z += (L(s0.cam.z, s1.cam.z, f) - camP.z)             * .04
      camT.x += (L(s0.tgt.x, s1.tgt.x, f) - camT.x)            * .04
      camT.y += (L(s0.tgt.y, s1.tgt.y, f) - camT.y)            * .04
      camera.position.copy(camP)
      camera.lookAt(camT)

      // Update atmosphere view vector
      atmosphereMat.uniforms.viewVector.value = camera.position

      scene.fog.density += (L(s0.fog, s1.fog, f) - scene.fog.density) * .05

      // Globe rotation
      earth.rotation.y += 0.001
      clouds.rotation.y += 0.0015
      earthGroup.rotation.z = Math.PI * 0.05 // Axial tilt simulate

      ring1.rotation.z += .0008
      ring2.rotation.y += .0005

      // Scanning grid effect
      scanWire.material.opacity = 0.02 + (Math.sin(t * 1.5) + 1) * 0.04
      scanSphere.scale.setScalar(1 + Math.sin(t * 0.8) * 0.02)

      stars.rotation.y  = t * 0.0005
      nebula.rotation.y = t * 0.0008
      sunLight.intensity = 2.4 + Math.sin(t * 0.5) * 0.2
      fillLight.intensity = 12 + Math.sin(t * 1.2) * 3
      fillLight2.intensity = 6 + Math.sin(t * 1.5 + 1) * 2

      renderer.render(scene, camera)
    }
    animate()

    // ── Resize ────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.fov = window.innerWidth < 768 ? 75 : 60
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    // ── Cleanup ───────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('resize', onResize)
      scene.clear()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [bootDone, sections, scrollProgRef])

  return <div id="canvas-container" ref={containerRef} />
}
