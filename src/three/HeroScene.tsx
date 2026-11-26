import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, PresentationControls, Sparkles } from '@react-three/drei'
import { Bottle } from './Bottle'
import { Studio } from './Studio'
import { MarbleFloor } from './MarbleFloor'
import { heroState } from './heroState'
import { signatureBottle } from '../data/products'
import { useUI } from '../store/shop'

/** Marble stage only in landscape framing — in portrait the camera sits too low and sees glare. */
function Stage() {
  const landscape = useThree((s) => s.size.width / s.size.height >= 0.9)
  return landscape ? <MarbleFloor y={-1.3} /> : null
}

function Rig() {
  const group = useRef<THREE.Group>(null)
  const intro = useRef(0)
  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    intro.current = Math.min(1, intro.current + dt * 0.45)
    const e = 1 - Math.pow(1 - intro.current, 3)
    const p = heroState.progress
    // mouse parallax
    const { x, y } = state.pointer
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -y * 0.12 + p * 0.25, 3, dt)
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, -x * 0.05, 3, dt)
    g.position.x = THREE.MathUtils.damp(g.position.x, x * 0.18, 3, dt)
    // intro + scroll choreography
    g.rotation.y += dt * 0.14
    const mobile = state.size.width / state.size.height < 0.9 // portrait framing (phones, tablets)
    g.position.y = THREE.MathUtils.lerp(-2.6, mobile ? 0.4 : -0.25, e) + p * 1.4
    const s = THREE.MathUtils.lerp(0.6, 1, e) * (1 - p * 0.25)
    g.scale.setScalar(s)
    // cinematic camera drift
    const cam = state.camera
    cam.position.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.35
    cam.position.z = THREE.MathUtils.damp(cam.position.z, (mobile ? (state.size.width < 600 ? 11.5 : 10) : 6.6) + p * 1.6, 2, dt)
    cam.position.y = THREE.MathUtils.damp(cam.position.y, mobile ? 0.2 : 1.35, 2, dt)
    cam.lookAt(0, (mobile ? -0.2 : -0.05) + p * 0.6, 0)
  })
  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.5}>
        <Bottle spec={signatureBottle} />
      </Float>
    </group>
  )
}

export default function HeroScene() {
  const wrap = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)
  const covered = useUI((s) => !!s.product || (s.panel !== null && s.panel !== 'cart' && s.panel !== 'wishlist'))
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const touch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  return (
    <div ref={wrap} className="h-full w-full">
    <Canvas
      frameloop={inView && !covered ? 'always' : 'never'}
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 1.35, 6.6], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <fog attach="fog" args={['#0a0908', 12, 24]} />
      <PresentationControls
        enabled={!touch}
        global
        cursor
        snap={false}
        speed={1.4}
        polar={[-0.25, 0.25]}
        azimuth={[-Infinity, Infinity]}
        config={{ mass: 1.2, tension: 170, friction: 26 }}
      >
        <Rig />
      </PresentationControls>
      <Sparkles count={140} scale={[9, 6, 6]} size={2.4} speed={0.25} opacity={0.7} color="#e3cc9a" />
      <Sparkles count={50} scale={[4, 4, 3]} size={4} speed={0.15} opacity={0.4} color="#fff1d6" />
      {!touch && <Stage />}
      <Studio bg={'#0a0908'} shadowY={-1.25} />
    </Canvas>
    </div>
  )
}
