"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, Ring } from "@react-three/drei"
import type * as THREE from "three"

function WeatherGlobe() {
  const globeRef = useRef<THREE.Mesh>(null!)
  const ringsRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.005
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      ringsRef.current.rotation.z += 0.01
    }
  })

  return (
    <group>
      {/* Main globe */}
      <Sphere ref={globeRef} args={[0.6, 32, 32]}>
        <meshStandardMaterial color="#0ea5e9" roughness={0.2} metalness={0.3} transparent opacity={0.8} />
      </Sphere>

      {/* Weather rings */}
      <group ref={ringsRef}>
        <Ring args={[0.8, 0.85, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.6} />
        </Ring>
        <Ring args={[1.0, 1.05, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#7dd3fc" transparent opacity={0.4} />
        </Ring>
      </group>

      {/* Floating weather particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Sphere
          key={i}
          args={[0.05, 8, 8]}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 1.5,
            Math.sin((i / 8) * Math.PI * 2) * 0.5,
            Math.sin((i / 8) * Math.PI * 2) * 1.5,
          ]}
        >
          <meshStandardMaterial color="#f0f9ff" emissive="#0ea5e9" emissiveIntensity={0.2} />
        </Sphere>
      ))}
    </group>
  )
}

export function WeatherGlobe3D() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.6} />
        <pointLight position={[-5, -5, -5]} intensity={0.3} color="#0ea5e9" />
        <WeatherGlobe />
      </Canvas>
    </div>
  )
}
