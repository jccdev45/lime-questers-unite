
import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WeaponProps {
  type: string;
  isReloading: boolean;
  isFiring: boolean;
}

const Weapon: React.FC<WeaponProps> = ({ type, isReloading, isFiring }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [recoil, setRecoil] = useState(false);
  
  // Weapon position and movement
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    // Idle weapon movement
    const time = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(time * 2) * 0.003;
    groupRef.current.rotation.z = Math.sin(time * 1.5) * 0.01;
    
    // Reloading animation
    if (isReloading) {
      groupRef.current.rotation.x = Math.sin(time * 5) * 0.2 - 0.3;
    } else {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.1);
    }
    
    // Recoil animation
    if (recoil) {
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 0.05, 0.3);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -0.02, 0.3);
    } else {
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 0, 0.1);
    }
  });
  
  // Handle firing effect
  useEffect(() => {
    if (isFiring) {
      setRecoil(true);
      setTimeout(() => setRecoil(false), 100);
    }
  }, [isFiring]);
  
  return (
    <group ref={groupRef} position={[0.3, -0.3, -0.5]}>
      {type === 'pistol' ? (
        // Pistol model
        <>
          <mesh castShadow>
            <boxGeometry args={[0.08, 0.15, 0.3]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          <mesh position={[0, 0.12, 0]} castShadow>
            <boxGeometry args={[0.07, 0.07, 0.4]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          <mesh position={[0, -0.05, -0.05]} castShadow>
            <boxGeometry args={[0.06, 0.12, 0.06]} />
            <meshStandardMaterial color="#444" />
          </mesh>
        </>
      ) : (
        // Rifle model
        <>
          <mesh castShadow>
            <boxGeometry args={[0.08, 0.15, 0.6]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          <mesh position={[0, 0.12, 0.1]} castShadow>
            <boxGeometry args={[0.07, 0.07, 0.8]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          <mesh position={[0, -0.05, -0.1]} castShadow>
            <boxGeometry args={[0.06, 0.2, 0.06]} />
            <meshStandardMaterial color="#444" />
          </mesh>
          <mesh position={[0, 0.22, 0.3]} castShadow>
            <boxGeometry args={[0.03, 0.03, 0.2]} />
            <meshStandardMaterial color="#666" />
          </mesh>
        </>
      )}
    </group>
  );
};

export default Weapon;
