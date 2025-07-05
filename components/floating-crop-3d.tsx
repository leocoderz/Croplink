"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, Box } from "@react-three/drei"
import type * as THREE from "three"

function FloatingCrop() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2
      meshRef.current.rotation.y += 0.01
    }
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main crop sphere */}
      <Sphere ref={meshRef} args={[0.8, 16, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#22c55e" roughness={0.3} metalness={0.1} />
      </Sphere>

      {/* Floating leaves */}
      {Array.from({ length: 6 }).map((_, i) => (
        <Box
          key={i}
          args={[0.2, 0.05, 0.1]}
          position={[
            Math.cos((i / 6) * Math.PI * 2) * 1.2,
            Math.sin((i / 6) * Math.PI * 2) * 0.3,
            Math.sin((i / 6) * Math.PI * 2) * 1.2,
          ]}
          rotation={[0, (i / 6) * Math.PI * 2, 0]}
        >
          <meshStandardMaterial color="#16a34a" />
        </Box>
      ))}
    </group>
  )
}

export function FloatingCrop3D() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#22c55e" />
        <FloatingCrop />
      </Canvas>
    </div>
  )
}
