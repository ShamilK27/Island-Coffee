import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { stage } from '../motion/stage'

const { damp } = THREE.MathUtils

/** A single high-detail roasted bean: flattened front with a winding centre crease. */
function heroBeanGeometry() {
  const geo = new THREE.SphereGeometry(1, 96, 64)
  const p = geo.attributes.position
  const shade = []
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i)
    let z = p.getZ(i)
    let k = 1
    if (z > 0) {
      z *= 0.62
      const d = x - 0.07 * Math.sin(y * 3)
      const crease = Math.exp(-(d * d) / 0.008) * Math.min(1, (1 - Math.abs(y)) * 4)
      z -= 0.45 * crease
      k = 1 - crease * 0.55 // darken inside the crease
    }
    p.setXYZ(i, x * 0.8, y * 1.15, z * 0.62)
    shade.push(k, k, k)
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(shade, 3))
  geo.computeVertexNormals()
  return geo
}

export function BeanModel() {
  const root = useRef()
  const bean = useRef()
  const sm = useRef({ intro: 0, hero: 0, outro: 0, px: 0, py: 0 })
  const { size } = useThree()

  const assets = useMemo(
    () => ({
      geometry: heroBeanGeometry(),
      material: new THREE.MeshPhysicalMaterial({
        color: '#3a1c0d',
        vertexColors: true,
        roughness: 0.4,
        clearcoat: 0.6,
        clearcoatRoughness: 0.35,
        sheen: 0.3,
        sheenColor: new THREE.Color('#b87945'),
      }),
    }),
    [],
  )
  useEffect(() => () => Object.values(assets).forEach((a) => a.dispose()), [assets])

  useFrame((state, dt) => {
    const s = sm.current
    const d = Math.min(dt, 0.05)
    s.intro = damp(s.intro, stage.intro, 2.6, d)
    s.hero = damp(s.hero, stage.hero, 6, d)
    s.outro = damp(s.outro, stage.outro, 6, d)
    s.px = damp(s.px, stage.pointer.x, 3, d)
    s.py = damp(s.py, stage.pointer.y, 3, d)

    const t = state.clock.elapsedTime
    const desk = size.width >= 900
    const intro = s.intro

    let y = (desk ? 0 : -0.35) + s.hero * 0.25
    let sc = (desk ? 1 : 0.75) * (1 + s.hero * 0.06)
    // Intro: rise from below
    y += (1 - intro) * -5.5
    sc *= 0.55 + intro * 0.45
    // Outro: lift away as the Journey arrives
    y += s.outro * 6.5
    sc *= 1 - s.outro * 0.35

    const g = root.current
    g.position.set(0, y + Math.sin(t * 0.9) * 0.06, 0)
    g.scale.setScalar(sc)
    g.rotation.x = -s.py * 0.08 + (1 - intro) * 0.6
    g.rotation.y = s.px * 0.2

    // Slow tumble that keeps the crease on show; scroll adds a turn
    const b = bean.current
    b.rotation.x = 0.2 + Math.sin(t * 0.6) * 0.15
    b.rotation.y = -0.35 + Math.sin(t * 0.4) * 0.5 + s.hero * Math.PI * 0.9 + (1 - intro) * -2
    b.rotation.z = -0.4 + s.outro * 0.3
  })

  return (
    <group ref={root}>
      <mesh ref={bean} geometry={assets.geometry} material={assets.material} scale={0.75} />
    </group>
  )
}
