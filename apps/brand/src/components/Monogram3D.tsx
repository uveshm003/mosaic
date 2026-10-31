'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { ExtrudeGeometry, Shape, type Mesh } from 'three'

// The brand's initial as a block letter, centred on the origin.
function mShape() {
  const s = new Shape()
  s.moveTo(-1.2, -1)
  const outline: [number, number][] = [
    [-1.2, 1],
    [-0.75, 1],
    [0, 0.15],
    [0.75, 1],
    [1.2, 1],
    [1.2, -1],
    [0.75, -1],
    [0.75, 0.3],
    [0, -0.55],
    [-0.75, 0.3],
    [-0.75, -1],
  ]
  for (const [x, y] of outline) s.lineTo(x, y)
  s.closePath()
  return s
}

function Mark({ color }: { color: string }) {
  const mesh = useRef<Mesh>(null)
  const geometry = useMemo(() => {
    const g = new ExtrudeGeometry(mShape(), {
      depth: 0.55,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.06,
      bevelSegments: 6,
    })
    g.center()
    return g
  }, [])

  // Follows the pointer, easing back to a slow drift.
  useFrame(({ pointer, clock }) => {
    const m = mesh.current
    if (!m) return
    const t = clock.getElapsedTime()
    m.rotation.y += (pointer.x * 0.9 + Math.sin(t * 0.4) * 0.25 - m.rotation.y) * 0.06
    m.rotation.x += (-pointer.y * 0.5 + Math.cos(t * 0.3) * 0.1 - m.rotation.x) * 0.06
  })

  return (
    <mesh ref={mesh} geometry={geometry} scale={1.12}>
      <meshPhysicalMaterial
        color={color}
        roughness={0.25}
        metalness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.15}
      />
    </mesh>
  )
}

export default function Monogram3D({ color }: { color: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 5.2], fov: 40 }} dpr={[1, 2]} aria-hidden>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <pointLight position={[-4, -2, 3]} intensity={30} color="#ffffff" />
      <Mark color={color} />
    </Canvas>
  )
}
