
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MapProps {
  type: string;
}

const Map: React.FC<MapProps> = ({ type }) => {
  const floorRef = useRef<THREE.Mesh>(null);
  
  // Simple lighting effect for the floor
  useFrame(({ clock }) => {
    if (floorRef.current && floorRef.current.material instanceof THREE.MeshStandardMaterial) {
      const time = clock.getElapsedTime();
      const intensity = (Math.sin(time * 0.5) * 0.05) + 0.95;
      floorRef.current.material.emissiveIntensity = intensity;
    }
  });

  return (
    <group>
      {/* Floor with grid texture */}
      <mesh 
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]} 
        receiveShadow
      >
        <planeGeometry args={[100, 100, 100, 100]} />
        <meshStandardMaterial 
          color="#151617" 
          wireframe={false}
          emissive="#84cc16"
          emissiveIntensity={0.05}
        >
          <gridTexture
            args={[100, 100]}
            colorCenterLine="#84cc16"
            colorGrid="#171717"
            attach="map"
          />
        </meshStandardMaterial>
      </mesh>

      {/* Environment walls and features based on map type */}
      {type === 'arena' && (
        <>
          {/* Center platform */}
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[10, 1, 10]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          
          {/* Ramps to center platform */}
          <mesh position={[7, 0.25, 0]} rotation={[0, 0, Math.PI * 0.05]} castShadow receiveShadow>
            <boxGeometry args={[4, 0.5, 6]} />
            <meshStandardMaterial color="#252525" />
          </mesh>
          
          <mesh position={[-7, 0.25, 0]} rotation={[0, 0, -Math.PI * 0.05]} castShadow receiveShadow>
            <boxGeometry args={[4, 0.5, 6]} />
            <meshStandardMaterial color="#252525" />
          </mesh>
          
          <mesh position={[0, 0.25, 7]} rotation={[Math.PI * 0.05, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[6, 0.5, 4]} />
            <meshStandardMaterial color="#252525" />
          </mesh>
          
          <mesh position={[0, 0.25, -7]} rotation={[-Math.PI * 0.05, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[6, 0.5, 4]} />
            <meshStandardMaterial color="#252525" />
          </mesh>
          
          {/* Corner pillars */}
          {[
            [15, 5, 15],
            [15, 5, -15],
            [-15, 5, 15],
            [-15, 5, -15],
          ].map((pos, index) => (
            <mesh key={index} position={pos} castShadow receiveShadow>
              <boxGeometry args={[2, 10, 2]} />
              <meshStandardMaterial color="#202020" />
            </mesh>
          ))}
          
          {/* Outer walls */}
          {[
            [0, 3, 20, 40, 6, 1],  // North wall
            [0, 3, -20, 40, 6, 1], // South wall
            [20, 3, 0, 1, 6, 40],  // East wall
            [-20, 3, 0, 1, 6, 40], // West wall
          ].map((item, index) => (
            <mesh key={`wall-${index}`} position={[item[0], item[1], item[2]]} castShadow receiveShadow>
              <boxGeometry args={[item[3], item[4], item[5]]} />
              <meshStandardMaterial color="#101010" />
            </mesh>
          ))}
          
          {/* Central lime-colored light column */}
          <mesh position={[0, 8, 0]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 16, 16]} />
            <meshStandardMaterial color="#333" emissive="#84cc16" emissiveIntensity={1} />
          </mesh>
          
          {/* Floating light orbs */}
          {Array.from({ length: 8 }).map((_, index) => {
            const angle = (index / 8) * Math.PI * 2;
            const radius = 12;
            return (
              <mesh 
                key={`orb-${index}`} 
                position={[
                  Math.cos(angle) * radius, 
                  2 + Math.sin(index * 0.5) * 0.5, 
                  Math.sin(angle) * radius
                ]}
              >
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial color="#84cc16" emissive="#84cc16" emissiveIntensity={1} />
              </mesh>
            );
          })}
        </>
      )}
      
      {type === 'tactical' && (
        <>
          {/* Buildings and cover */}
          {[
            [5, 2, 0, 4, 4, 8],    // Center building
            [-7, 1.5, 5, 6, 3, 3],  // Left building
            [0, 1, -8, 8, 2, 4],    // Back cover
            [8, 1, 8, 4, 2, 4],     // Right cover
          ].map((item, index) => (
            <mesh key={`building-${index}`} position={[item[0], item[1], item[2]]} castShadow receiveShadow>
              <boxGeometry args={[item[3], item[4], item[5]]} />
              <meshStandardMaterial color="#202020" />
            </mesh>
          ))}
          
          {/* Barriers for cover */}
          {[
            [-3, 0.5, 0],
            [0, 0.5, 3],
            [3, 0.5, -3],
            [-5, 0.5, -5],
            [8, 0.5, 0],
          ].map((pos, index) => (
            <mesh key={`barrier-${index}`} position={pos} castShadow receiveShadow>
              <boxGeometry args={[1.5, 1, 0.3]} />
              <meshStandardMaterial color="#333" />
            </mesh>
          ))}
          
          {/* Perimeter wall with openings */}
          {[
            [0, 2, 15, 30, 4, 1],  // North wall
            [0, 2, -15, 30, 4, 1], // South wall
            [15, 2, 5, 1, 4, 20],  // East wall partial
            [15, 2, -8, 1, 4, 14], // East wall partial
            [-15, 2, 0, 1, 4, 30], // West wall
          ].map((item, index) => (
            <mesh key={`wall-${index}`} position={[item[0], item[1], item[2]]} castShadow receiveShadow>
              <boxGeometry args={[item[3], item[4], item[5]]} />
              <meshStandardMaterial color="#101010" />
            </mesh>
          ))}
          
          {/* Bridge between buildings */}
          <mesh position={[-1, 3, 2.5]} castShadow receiveShadow>
            <boxGeometry args={[6, 0.5, 2]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          
          {/* Lime accent lights */}
          {[
            [5, 4.1, 0],    // Center building
            [-7, 3.1, 5],   // Left building
            [15, 4.1, -1],  // Wall
            [-15, 4.1, 0],  // Wall
          ].map((pos, index) => (
            <pointLight
              key={`light-${index}`}
              position={pos}
              intensity={15}
              distance={10}
              color="#84cc16"
              castShadow
            />
          ))}
        </>
      )}
      
      {type === 'battlefield' && (
        <>
          {/* Center crater */}
          <mesh position={[0, -1, 0]} receiveShadow>
            <cylinderGeometry args={[10, 15, 2, 32]} />
            <meshStandardMaterial color="#0a0a0a" />
          </mesh>
          
          {/* Scattered rocks */}
          {Array.from({ length: 20 }).map((_, index) => {
            const angle = Math.random() * Math.PI * 2;
            const radius = 5 + Math.random() * 10;
            const size = 0.5 + Math.random() * 1.5;
            return (
              <mesh 
                key={`rock-${index}`} 
                position={[
                  Math.cos(angle) * radius, 
                  size / 2, 
                  Math.sin(angle) * radius
                ]}
                rotation={[
                  Math.random() * Math.PI,
                  Math.random() * Math.PI,
                  Math.random() * Math.PI
                ]}
                castShadow 
                receiveShadow
              >
                <boxGeometry args={[size, size, size]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
              </mesh>
            );
          })}
          
          {/* Large cover structures */}
          {[
            [8, 2, 8],
            [-8, 2, -8],
            [12, 3, -5],
            [-12, 3, 5],
            [0, 1.5, 12],
            [0, 1.5, -12],
          ].map((pos, index) => {
            const width = 3 + Math.random() * 2;
            const height = 2 + Math.random() * 3;
            const depth = 3 + Math.random() * 2;
            return (
              <mesh 
                key={`structure-${index}`} 
                position={[pos[0], pos[1], pos[2]]} 
                rotation={[0, Math.random() * Math.PI, 0]}
                castShadow 
                receiveShadow
              >
                <boxGeometry args={[width, height, depth]} />
                <meshStandardMaterial color="#171717" />
              </mesh>
            );
          })}
          
          {/* Ambient fog */}
          <fog attach="fog" args={['#000000', 30, 50]} />
          
          {/* Eerie lime lights in the battlefield */}
          {Array.from({ length: 6 }).map((_, index) => {
            const angle = (index / 6) * Math.PI * 2;
            const radius = 15;
            return (
              <pointLight
                key={`eerie-light-${index}`}
                position={[
                  Math.cos(angle) * radius, 
                  0.5, 
                  Math.sin(angle) * radius
                ]}
                intensity={10}
                distance={15}
                color="#84cc16"
              />
            );
          })}
          
          {/* Central ominous light */}
          <pointLight
            position={[0, 5, 0]}
            intensity={20}
            distance={30}
            color="#84cc16"
          />
        </>
      )}
    </group>
  );
};

export default Map;
