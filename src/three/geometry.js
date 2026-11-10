// Procedural geometry shared by the WebGL stage.
import * as THREE from 'three'

export function beanGeometry() {
  const g = new THREE.SphereGeometry(1, 28, 20)
  const p = g.attributes.position
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i)
    const y = p.getY(i)
    let z = p.getZ(i)
    // flatten the back
    if (z < 0) z *= 0.55
    // crease
    const crease = Math.exp(-(x * x) / 0.012) * 0.28 * Math.max(0, z)
    z -= crease
    x += Math.sin(y * 3) * 0.06 * Math.max(0, z)
    p.setXYZ(i, x * 0.72, y, z * 0.62)
  }
  g.computeVertexNormals()
  return g
}

/** Kraft sleeve texture with the wordmark, drawn on a canvas. */
