import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import type { BottleSpec, Metal } from '../data/products'

/* ------------------------------------------------------------------ */
/* Materials                                                           */
/* ------------------------------------------------------------------ */

const METALS: Record<Metal, { color: string; metalness: number; roughness: number; clearcoat?: number }> = {
  gold: { color: '#d9b878', metalness: 1, roughness: 0.18 },
  silver: { color: '#e4e4e8', metalness: 1, roughness: 0.14 },
  black: { color: '#0d0d0e', metalness: 0.35, roughness: 0.22, clearcoat: 1 },
  gunmetal: { color: '#55585e', metalness: 1, roughness: 0.32 },
  bronze: { color: '#7a5434', metalness: 1, roughness: 0.3 },
}

function MetalMaterial({ metal, brushed }: { metal: Metal; brushed?: boolean }) {
  const m = METALS[metal]
  return (
    <meshPhysicalMaterial
      color={m.color}
      metalness={m.metalness}
      roughness={brushed ? 0.5 : m.roughness}
      clearcoat={brushed ? 0 : m.clearcoat ?? 0.4}
      clearcoatRoughness={0.1}
      envMapIntensity={1.6}
    />
  )
}

function GlassMaterial({ spec, quality }: { spec: BottleSpec; quality: 'high' | 'low' }) {
  const color = useMemo(
    () => new THREE.Color('#ffffff').lerp(new THREE.Color(spec.glass), Math.min(1, spec.tint + 0.15)),
    [spec.glass, spec.tint],
  )
  if (quality === 'low') {
    return (
      <meshPhysicalMaterial
        color={color}
        transparent
        opacity={0.25 + spec.tint * 0.6}
        roughness={0.05}
        metalness={0.1}
        clearcoat={1}
        envMapIntensity={2}
        depthWrite={false}
      />
    )
  }
  return (
    <meshPhysicalMaterial
      color={color}
      transmission={1 - spec.tint * 0.55}
      thickness={0.9}
      roughness={0.04}
      ior={1.5}
      attenuationColor={spec.glass}
      attenuationDistance={THREE.MathUtils.lerp(6, 0.35, spec.tint)}
      clearcoat={1}
      clearcoatRoughness={0.03}
      specularIntensity={1}
      envMapIntensity={1.8}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */

function useTorsoGeometry(w: number, h: number) {
  return useMemo(() => {
    const prof: [number, number][] = [
      [0, 0],
      [0.34, 0],
      [0.4, 0.03],
      [0.45, 0.2],
      [0.43, 0.33],
      [0.36, 0.5],
      [0.42, 0.66],
      [0.48, 0.79],
      [0.45, 0.9],
      [0.3, 0.97],
      [0.15, 1],
      [0, 1],
    ]
    const pts = prof.map(([r, y]) => new THREE.Vector2(r * w, y * h - h / 2))
    const g = new THREE.LatheGeometry(new THREE.SplineCurve(pts).getPoints(80), 96)
    g.computeVertexNormals()
    return g
  }, [w, h])
}

function BodyShape({
  spec,
  scale = [1, 1, 1],
  children,
}: {
  spec: BottleSpec
  scale?: [number, number, number]
  children: React.ReactNode
}) {
  const [w, h, d] = spec.size
  const torso = useTorsoGeometry(w, h)
  const [sx, sy, sz] = scale
  switch (spec.body) {
    case 'cylinder':
      return (
        <mesh scale={[sx, sy, sz]} castShadow>
          <cylinderGeometry args={[w / 2, w / 2, h, 96, 1]} />
          {children}
        </mesh>
      )
    case 'torso':
      return (
        <mesh geometry={torso} scale={[sx, sy, sz * (d / w)]} castShadow>
          {children}
        </mesh>
      )
    case 'stone':
    case 'box':
    default:
      return (
        <RoundedBox
          args={[w * sx, h * sy, d * sz]}
          radius={Math.min(spec.radius, (d * sz) / 2.05, (w * sx) / 2.05)}
          smoothness={6}
          castShadow
        >
          {children}
        </RoundedBox>
      )
  }
}

/* ------------------------------------------------------------------ */
/* Label texture                                                        */
/* ------------------------------------------------------------------ */

function useFontsReady() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let live = true
    const f = document.fonts
    if (!f) return setReady(true)
    Promise.all([f.load('500 120px "Cormorant Garamond"'), f.load('600 40px Manrope')])
      .catch(() => undefined)
      .finally(() => live && setReady(true))
    return () => {
      live = false
    }
  }, [])
  return ready
}

function useLabelTexture(text: string, sub: string, color: string, fontsReady: boolean) {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 1024
    c.height = 512
    const ctx = c.getContext('2d')!
    ctx.clearRect(0, 0, c.width, c.height)
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    // main title — auto-fit
    let size = text.length <= 2 ? 300 : 150
    const serif = (s: number) => `500 ${s}px "Cormorant Garamond", Georgia, serif`
    ;(ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = '6px'
    ctx.font = serif(size)
    while (ctx.measureText(text).width > 840 && size > 40) {
      size -= 6
      ctx.font = serif(size)
    }
    ;(ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = '6px'
    ctx.fillText(text, 512, sub ? 220 : 256)
    if (sub) {
      ctx.font = '600 38px Manrope, system-ui, sans-serif'
      ;(ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = '14px'
      ctx.fillText(sub, 512, 220 + size * 0.5 + 50)
    }
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    return tex
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, sub, color, fontsReady])
}

/* ------------------------------------------------------------------ */
/* Bottle                                                               */
/* ------------------------------------------------------------------ */

export interface BottleProps {
  spec: BottleSpec
  quality?: 'high' | 'low'
}

export function Bottle({ spec, quality = 'high' }: BottleProps) {
  const [w, h, d] = spec.size
  const fontsReady = useFontsReady()
  const tex = useLabelTexture(spec.label.text, spec.label.sub, spec.label.color, fontsReady)

  const wall = 0.07
  const liqH = spec.liquidLevel * 0.9
  const liquidY = -h / 2 + wall + (h * liqH) / 2

  // front face for label
  const frontZ = spec.body === 'torso' ? (d / w) * 0.46 * w + 0.006 : d / 2 + 0.004
  const labelY = spec.body === 'torso' ? h * 0.18 : spec.body === 'cylinder' ? 0 : h * 0.02
  const labelW =
    spec.body === 'torso' ? w * 0.5 : spec.body === 'stone' ? w * 0.6 : w * (spec.label.kind === 'plate' ? 0.64 : 0.72)
  const labelH = labelW * 0.5

  const collarR = Math.min(w, d) * 0.2
  const collarH = 0.12
  const [cw, ch, cd] = spec.cap.size
  const capY = h / 2 + collarH + ch / 2 - 0.01

  return (
    <group>
      {/* Liquid (opaque, seen through transmissive glass) */}
      <group position={[0, liquidY, 0]}>
        <BodyShape spec={spec} scale={[0.84, liqH, 0.76]}>
          <meshPhysicalMaterial
            color={spec.liquid}
            roughness={0.15}
            clearcoat={1}
            transmission={0}
            envMapIntensity={0.8}
          />
        </BodyShape>
      </group>

      {/* Glass body */}
      <BodyShape spec={spec}>
        <GlassMaterial spec={spec} quality={quality} />
      </BodyShape>

      {/* Label */}
      <group position={[0, labelY, frontZ]}>
        {spec.label.kind === 'plate' && spec.label.metal && (
          <RoundedBox args={[labelW, labelH * 0.72, 0.012]} radius={0.004} smoothness={2} position={[0, 0, -0.004]}>
            <MetalMaterial metal={spec.label.metal} brushed />
          </RoundedBox>
        )}
        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[labelW * 0.92, labelH * 0.92]} />
          <meshStandardMaterial
            map={tex}
            transparent
            roughness={0.4}
            metalness={spec.label.kind === 'plate' ? 0.4 : 0.1}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Collar / neck */}
      <mesh position={[0, h / 2 + collarH / 2 - 0.01, 0]} castShadow>
        <cylinderGeometry args={[collarR, collarR * 1.08, collarH, 48]} />
        <MetalMaterial metal={spec.collar} />
      </mesh>

      {/* Cap */}
      <group position={[0, capY, 0]}>
        {spec.cap.shape === 'cylinder' && (
          <mesh castShadow>
            <cylinderGeometry args={[cw, cw, ch, 64]} />
            <MetalMaterial metal={spec.cap.metal} />
          </mesh>
        )}
        {spec.cap.shape === 'box' && (
          <RoundedBox args={[cw, ch, cd]} radius={0.025} smoothness={4} castShadow>
            <MetalMaterial metal={spec.cap.metal} />
          </RoundedBox>
        )}
        {spec.cap.shape === 'dome' && (
          <RoundedBox args={[cw, ch, cd]} radius={Math.min(cw, ch) / 2.2} smoothness={8} castShadow>
            <MetalMaterial metal={spec.cap.metal} />
          </RoundedBox>
        )}
      </group>
    </group>
  )
}
