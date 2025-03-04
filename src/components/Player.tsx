
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Player as PlayerType } from '@/lib/supabase';

interface PlayerProps {
  player: PlayerType;
  isLocal: boolean;
}

const Player: React.FC<PlayerProps> = ({ player, isLocal }) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const nameRef = useRef<THREE.Sprite>(null);
  
  // Update position
  useEffect(() => {
    if (!isLocal && groupRef.current) {
      groupRef.current.position.x = player.x;
      groupRef.current.position.y = player.y;
      groupRef.current.position.z = player.z;
      groupRef.current.rotation.y = player.rotationY;
    }
  }, [player.x, player.y, player.z, player.rotationY, isLocal]);
  
  // Update name tag to face camera
  useFrame(({ camera }) => {
    if (nameRef.current) {
      nameRef.current.lookAt(camera.position);
    }
    
    // Add slight animation for other players
    if (!isLocal && meshRef.current) {
      meshRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.05 + 0;
    }
  });
  
  // Don't render local player (camera will be in its position)
  if (isLocal) return null;
  
  // Don't render dead players
  if (!player.isAlive) return null;
  
  return (
    <group ref={groupRef} position={[player.x, player.y, player.z]} rotation={[0, player.rotationY, 0]}>
      {/* Player body */}
      <mesh ref={meshRef} castShadow>
        <capsuleGeometry args={[0.3, 1, 4, 8]} />
        <meshStandardMaterial color={player.id.startsWith('bot') ? "#ff4d4d" : "#4d4dff"} />
      </mesh>
      
      {/* Weapon */}
      <group position={[0.4, 0, -0.2]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.1, 0.1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>
      
      {/* Name tag */}
      <sprite ref={nameRef} position={[0, 1.5, 0]} scale={[2, 0.5, 1]}>
        <spriteMaterial
          transparent
          depthTest={false}
          onBeforeCompile={(shader) => {
            shader.fragmentShader = shader.fragmentShader.replace(
              'void main() {',
              `
              uniform vec3 color;
              uniform float opacity;
              void main() {
              `
            );
          }}
        >
          <canvasTexture
            attach="map"
            args={[(() => {
              const canvas = document.createElement('canvas');
              canvas.width = 256;
              canvas.height = 64;
              const context = canvas.getContext('2d');
              if (context) {
                context.fillStyle = '#000000aa';
                context.fillRect(0, 0, 256, 64);
                context.font = '32px Arial';
                context.textAlign = 'center';
                context.fillStyle = '#ffffff';
                context.fillText(player.name, 128, 40);
              }
              return canvas;
            })()]}
          />
        </spriteMaterial>
      </sprite>
    </group>
  );
};

export default Player;
