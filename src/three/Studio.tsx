import { ContactShadows, Environment, Lightformer } from '@react-three/drei'

/** Network-free studio lighting: reflections come from custom light formers. */
export function Studio({
  shadowY = -0.9,
  warm = true,
  bg,
}: {
  shadowY?: number
  warm?: boolean
  /** Solid scene background — required for correct glass transmission. */
  bg: string
}) {
  return (
    <>
      <color attach="background" args={[bg]} />
      <ambientLight intensity={0.25} />
      <spotLight
        position={[3, 6, 4]}
        angle={0.35}
        penumbra={1}
        intensity={60}
        color={warm ? '#ffe2b0' : '#ffffff'}
        castShadow
      />
      <pointLight position={[-4, 2, -3]} intensity={18} color="#c9a96e" />
      <pointLight position={[0, -1, 3]} intensity={4} color="#fff1d6" />
      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#0b0a09']} />
        <Lightformer form="rect" intensity={3} color="#fff4e0" position={[0, 4, 3]} scale={[8, 1.4, 1]} rotation-x={Math.PI / 3} />
        <Lightformer form="rect" intensity={4} color="#ffe6bd" position={[-4, 0.5, 1]} rotation-y={Math.PI / 2} scale={[1.2, 7, 1]} />
        <Lightformer form="rect" intensity={2.5} color="#ffffff" position={[4, 0.5, 1]} rotation-y={-Math.PI / 2} scale={[0.8, 7, 1]} />
        <Lightformer form="ring" intensity={2} color="#c9a96e" position={[0, 1, -5]} scale={4} />
        <Lightformer form="rect" intensity={1} color="#8a6a3a" position={[0, -3, 0]} rotation-x={-Math.PI / 2} scale={[10, 10, 1]} />
      </Environment>
      <ContactShadows position={[0, shadowY, 0]} opacity={0.65} scale={6} blur={2.6} far={3} color="#000000" />
    </>
  )
}
