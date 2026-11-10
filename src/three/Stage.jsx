import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { stage } from '../motion/stage'
import { BeanModel } from './BeanModel'
import { Beans } from './Beans'

/**
 * The persistent WebGL stage behind the Hero.
 * One canvas, one roasted hero bean that lifts away as the Journey arrives.
 * Rendering pauses entirely once the stage is scrolled out of view.
 */
export default function Stage() {
  const [visible, setVisible] = useState(stage.visible)
  const [vw, setVw] = useState(() => window.innerWidth)

  useEffect(() => stage.onVisible(setVisible), [])
  useEffect(() => {
    let raf
    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setVw(window.innerWidth))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const mobile = vw < 768
  return (
    <>
    <Canvas
      frameloop={visible ? 'always' : 'never'}
      dpr={[1, mobile ? 1.5 : 2]}
      camera={{ position: [0, 0.35, 9.5], fov: 35, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.35} color="#ffe6cc" />
      <directionalLight position={[4, 6, 5]} intensity={2.6} color="#ffe2c2" />
      <directionalLight position={[-5, 2, -4]} intensity={2.2} color="#b87945" />
      <directionalLight position={[0, -4, 3]} intensity={0.4} color="#f2e9dc" />

      {/* Procedural studio reflections: no HDR download needed */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} color="#fff4e6" position={[0, 5, -3]} scale={[12, 2, 1]} />
        <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={2} color="#d69a63" position={[5, 0, 1]} rotation-y={-Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer form="ring" intensity={1.5} color="#ffffff" position={[0, 0, 6]} scale={3} />
      </Environment>

      <BeanModel />
      <Beans count={mobile ? 16 : 34} />
    </Canvas>

    </>
  )
}
