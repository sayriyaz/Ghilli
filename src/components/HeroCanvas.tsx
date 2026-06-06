'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture, Float, Sparkles } from '@react-three/drei'
import { useRef, useMemo, Suspense } from 'react'
import * as THREE from 'three'

function BottleMesh() {
  const texture = useTexture('/nobg/new_blueberry.png')
  texture.colorSpace = THREE.SRGBColorSpace

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
      <mesh>
        <planeGeometry args={[2.2, 5]} />
        <meshStandardMaterial
          map={texture}
          transparent
          alphaTest={0.05}
          roughness={0.15}
          metalness={0.3}
          envMapIntensity={1.5}
        />
      </mesh>
    </Float>
  )
}

function BubbleParticles() {
  const count = 250
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 7
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3 - 0.5
      speeds[i] = 0.004 + Math.random() * 0.008
    }
    return { positions, speeds }
  }, [])

  useFrame(() => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < count; i++) {
      const y = pos.getY(i)
      if (y > 6) {
        pos.setY(i, -6)
        pos.setX(i, (Math.random() - 0.5) * 7)
      } else {
        pos.setY(i, y + speeds[i])
      }
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#88aaff"
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  )
}

function AtmosphericRings() {
  const ringRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ringRef.current) return
    ringRef.current.rotation.z = state.clock.getElapsedTime() * 0.08
  })
  return (
    <mesh ref={ringRef} position={[0, 0, -1]}>
      <ringGeometry args={[2.5, 3, 64]} />
      <meshBasicMaterial color="#1a3a7c" transparent opacity={0.12} side={THREE.DoubleSide} />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 5, 4]} intensity={3} color="#4488ff" />
      <pointLight position={[-4, -2, 2]} intensity={1.5} color="#d4af37" />
      <pointLight position={[0, -5, 3]} intensity={0.8} color="#001166" />
      <BubbleParticles />
      <AtmosphericRings />
      <Suspense fallback={null}>
        <BottleMesh />
      </Suspense>
      <Sparkles count={60} scale={7} size={1.5} speed={0.25} color="#88aaff" opacity={0.5} />
    </>
  )
}

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 42 }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <Scene />
    </Canvas>
  )
}
