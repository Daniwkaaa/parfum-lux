import { Canvas } from '@react-three/fiber'
import { Bottle } from './Bottle'
import { Studio } from './Studio'
import { getProduct, signatureBottle } from '../data/products'

/** Dev-only: renders one bottle for thumbnail capture (see scripts/render-thumbs.mjs). */
export default function ThumbRenderer({ id }: { id: string }) {
  const spec = id === 'signature' ? signatureBottle : getProduct(id)?.bottle
  if (!spec) return null
  const top = spec.size[1] / 2 + 0.12 + spec.cap.size[1]
  const mid = (top - spec.size[1] / 2) / 2
  return (
    <div style={{ width: 800, height: 1000 }}>
      <Canvas
        id="thumb"
        shadows
        dpr={1}
        camera={{ position: [0.9, mid + 0.35, 5.4], fov: 32 }}
        gl={{ preserveDrawingBuffer: true, alpha: true, antialias: true }}
        onCreated={({ camera }) => camera.lookAt(0, 0.05, 0)}
      >
        <group position={[0, -mid, 0]} rotation={[0, -0.45, 0]}>
          <Bottle spec={spec} />
        </group>
        <Studio bg={'#15110e'} shadowY={-spec.size[1] / 2 - mid - 0.005} />
      </Canvas>
    </div>
  )
}
