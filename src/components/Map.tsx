
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MapProps {
  type?: string;
  timeOfDay?: 'day' | 'night';
}

const Map: React.FC<MapProps> = ({ type = 'arena', timeOfDay = 'day' }) => {
  const groundRef = useRef<THREE.Mesh>(null);
  const gridHelperRef = useRef<THREE.GridHelper>(null);
  
  // Lights
  const lightRef1 = useRef<THREE.PointLight>(null);
  const lightRef2 = useRef<THREE.PointLight>(null);
  const lightRef3 = useRef<THREE.PointLight>(null);
  
  // Animate lights
  useFrame(({ clock }) => {
    if (lightRef1.current) {
      lightRef1.current.position.x = Math.sin(clock.getElapsedTime() * 0.3) * 15;
      lightRef1.current.position.z = Math.cos(clock.getElapsedTime() * 0.3) * 15;
    }
    
    if (lightRef2.current) {
      lightRef2.current.intensity = 1 + Math.sin(clock.getElapsedTime()) * 0.2;
    }
  });

  const isDark = timeOfDay === 'night';
  
  return (
    <group>
      {/* Ground plane */}
      <mesh 
        ref={groundRef}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color={isDark ? '#0a0a0a' : '#1a1a1a'} 
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Grid helper */}
      <gridHelper 
        args={[100, 100, '#333333', '#222222']} 
        position={[0, 0.01, 0]} 
      />
      
      {/* Main building */}
      <mesh 
        position={[0, 5, -20]} 
        castShadow
        receiveShadow
      >
        <boxGeometry args={[30, 10, 30]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.2} />
      </mesh>
      
      {/* Main building entrance */}
      <mesh 
        position={[0, 2, -5]} 
        castShadow
        receiveShadow
      >
        <boxGeometry args={[10, 4, 1]} />
        <meshStandardMaterial color="#171717" roughness={0.7} metalness={0.3} />
      </mesh>
      
      {/* Barriers */}
      <mesh 
        position={[-8, 1, 0]} 
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2, 2, 10]} />
        <meshStandardMaterial color={isDark ? "#1e2a1e" : "#253425"} roughness={0.8} />
      </mesh>
      
      <mesh 
        position={[8, 1, 0]} 
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2, 2, 10]} />
        <meshStandardMaterial color={isDark ? "#1e2a1e" : "#253425"} roughness={0.8} />
      </mesh>
      
      <mesh 
        position={[0, 1, 5]} 
        castShadow
        receiveShadow
      >
        <boxGeometry args={[16, 2, 2]} />
        <meshStandardMaterial color={isDark ? "#1e2a1e" : "#253425"} roughness={0.8} />
      </mesh>
      
      <mesh 
        position={[0, 1, -10]} 
        castShadow
        receiveShadow
      >
        <boxGeometry args={[16, 2, 2]} />
        <meshStandardMaterial color={isDark ? "#1e2a1e" : "#253425"} roughness={0.8} />
      </mesh>
      
      {/* Spawn points - Left side team */}
      <group position={[-20, 0, 0]}>
        {[...Array(5)].map((_, index) => {
          const position: [number, number, number] = [
            -5 + index * 2, 
            0.5, 
            -5 + Math.random() * 10
          ];
          return (
            <mesh 
              key={`spawn-left-${index}`}
              position={position}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={0.2} />
            </mesh>
          );
        })}
      </group>
      
      {/* Spawn points - Right side team */}
      <group position={[20, 0, 0]}>
        {[...Array(5)].map((_, index) => {
          const position: [number, number, number] = [
            5 - index * 2, 
            0.5, 
            -5 + Math.random() * 10
          ];
          return (
            <mesh 
              key={`spawn-right-${index}`}
              position={position}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.2} />
            </mesh>
          );
        })}
      </group>
      
      {/* Center health pickup */}
      <mesh 
        position={[0, 1, 0]} 
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[1, 1, 0.5, 16]} />
        <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Small platforms */}
      <group position={[-15, 0, -15]}>
        <mesh 
          position={[0, 2, 0]} 
          castShadow
          receiveShadow
        >
          {/* Platform base */}
          <boxGeometry args={[6, 4, 6]} />
          <meshStandardMaterial color="#1f1f1f" roughness={0.6} />
        </mesh>
        
        {/* Platform top with ammo */}
        <mesh 
          position={[0, 5, 0]} 
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
        </mesh>
      </group>
      
      {/* Small platforms */}
      <group position={[15, 0, -15]}>
        <mesh 
          position={[0, 2, 0]} 
          castShadow
          receiveShadow
        >
          {/* Platform base */}
          <boxGeometry args={[6, 4, 6]} />
          <meshStandardMaterial color="#1f1f1f" roughness={0.6} />
        </mesh>
        
        {/* Platform top with ammo */}
        <mesh 
          position={[0, 5, 0]} 
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
        </mesh>
      </group>
      
      {/* Sniper position */}
      <mesh 
        position={[0, 10, -30]} 
        castShadow
        receiveShadow
      >
        <boxGeometry args={[10, 0.5, 5]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.7} />
      </mesh>
      
      {/* Light sources */}
      <pointLight 
        ref={lightRef1}
        position={[10, 15, 10]} 
        intensity={isDark ? 2 : 0.2}
        distance={50}
        castShadow
        color={isDark ? "#4ade80" : "#ffffff"}
      />
      
      {/* Left team light */}
      <group position={[-20, 0, 0]}>
        <pointLight 
          position={[0, 8, 0]} 
          intensity={isDark ? 2 : 0.5}
          distance={20}
          color="#4ade80"
        />
      </group>
      
      {/* Right team light */}
      <group position={[20, 0, 0]}>
        <pointLight 
          ref={lightRef2}
          position={[0, 8, 0]} 
          intensity={isDark ? 2 : 0.5}
          distance={20}
          color="#ef4444"
        />
      </group>
      
      {/* Environment fog */}
      <fog attach="fog" args={[isDark ? '#030303' : '#e5e5e5', 30, 100]} />
      
      {/* Additional decorative elements */}
      {isDark && (
        <group>
          <pointLight 
            ref={lightRef3}
            position={[0, 2, 0]} 
            intensity={0.8}
            distance={5}
            color="#4ade80"
          />
        </group>
      )}
      
      {/* Ambient light */}
      <pointLight 
        position={[0, 20, 0]} 
        intensity={isDark ? 0.1 : 0.5}
        distance={100}
      />
    </group>
  );
};

export default Map;
