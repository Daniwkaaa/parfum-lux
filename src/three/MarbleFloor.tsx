import { useMemo } from 'react'
import * as THREE from 'three'
import { MeshReflectorMaterial } from '@react-three/drei'

/** Procedural black marble with warm gold veins (no external textures). */
function useMarbleTexture() {
  return useMemo(() => {
    const s = 1024
    const c = document.createElement('canvas')
    c.width = c.height = s
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#0c0a09'
    ctx.fillRect(0, 0, s, s)
    // soft clouds
    for (let i = 0; i < 40; i++) {
      const g = ctx.createRadialGradient(Math.random() * s, Math.random() * s, 0, Math.random() * s, Math.random() * s, 80 + Math.random() * 220)
      g.addColorStop(0, 'rgba(60,48,36,0.10)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, s, s)
    }
    // seeded random for stable veins
    let seed = 7
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    const vein = (width: number, alpha: number, color: string) => {
      let x = rnd() * s
      let y = rnd() < 0.5 ? 0 : rnd() * s
      let a = rnd() * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(x, y)
      for (let i = 0; i < 140; i++) {
        a += (rnd() - 0.5) * 0.6
        x += Math.cos(a) * 9
        y += Math.sin(a) * 9 + 3
        ctx.lineTo(x, y)
      }
      ctx.strokeStyle = color
      ctx.globalAlpha = alpha
      ctx.lineWidth = width
      ctx.shadowColor = color
      ctx.shadowBlur = width * 4
      ctx.stroke()
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
    }
    for (let i = 0; i < 9; i++) vein(1.2 + rnd() * 2.4, 0.75, '#c9984f')
    for (let i = 0; i < 14; i++) vein(0.7 + rnd(), 0.5, '#efe2c8')
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(3, 3)
    tex.anisotropy = 8
    return tex
  }, [])
}

export function MarbleFloor({ y }: { y: number }) {
  const map = useMarbleTexture()
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <MeshReflectorMaterial
        map={map}
        color="#c4b08f"
        blur={[400, 120]}
        resolution={512}
        mixBlur={0.9}
        mixStrength={3}
        mirror={0.6}
        roughness={0.85}
        metalness={0.3}
        depthScale={1}
        minDepthThreshold={0.85}
        maxDepthThreshold={1.2}
      />
    </mesh>
  )
}
