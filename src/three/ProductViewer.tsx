import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Bottle } from './Bottle'
import { Studio } from './Studio'
import type { BottleSpec } from '../data/products'

export default function ProductViewer({ spec, bg = '#110e0c' }: { spec: BottleSpec; bg?: string }) {
  const top = spec.size[1] / 2 + 0.12 + spec.cap.size[1]
  const mid = (top - spec.size[1] / 2) / 2
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0.8, mid + 0.4, 6.6], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
    >
      <group position={[0, -mid, 0]}>
        <Bottle spec={spec} />
      </group>
      <Studio bg={bg} shadowY={-spec.size[1] / 2 - mid - 0.005} />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.8}
        minDistance={2.6}
        maxDistance={7.5}
        minPolarAngle={Math.PI * 0.18}
        maxPolarAngle={Math.PI * 0.62}
        autoRotate
        autoRotateSpeed={0.9}
      />
    </Canvas>
  )
}
