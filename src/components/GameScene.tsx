
import React, { useRef, Suspense } from 'react';
import { 
  PerspectiveCamera, 
  PointerLockControls, 
  Sky, 
  Environment, 
  Stats
} from '@react-three/drei';
import * as THREE from 'three';

import Player from '@/components/Player';
import Weapon from '@/components/Weapon';
import Map from '@/components/Map';

interface GameSceneProps {
  controlsRef: React.RefObject<any>;
  playerRef: React.RefObject<THREE.Group>;
  players: Record<string, any>;
  localPlayerId: string | null;
  selectedWeapon: string;
  isReloading: boolean;
  isFiring: boolean;
  mapType: string;
  onLock: () => void;
  onUnlock: () => void;
}

const GameScene: React.FC<GameSceneProps> = ({
  controlsRef,
  playerRef,
  players,
  localPlayerId,
  selectedWeapon,
  isReloading,
  isFiring,
  mapType,
  onLock,
  onUnlock,
}) => {
  return (
    <Suspense fallback={null}>
      <PerspectiveCamera makeDefault position={[0, 1.8, 0]} fov={75} near={0.1} far={1000} />
      
      {/* Controls */}
      <PointerLockControls ref={controlsRef} onLock={onLock} onUnlock={onUnlock} />
      
      {/* Player body */}
      <group ref={playerRef} position={[0, 1.8, 0]}>
        {/* First-person weapon */}
        {controlsRef.current?.isLocked && (
          <Weapon type={selectedWeapon} isReloading={isReloading} isFiring={isFiring} />
        )}
      </group>
      
      {/* Players */}
      {Object.values(players).map(player => (
        <Player 
          key={player.id} 
          player={player} 
          isLocal={player.id === localPlayerId} 
        />
      ))}
      
      {/* Map */}
      <Map mapType={mapType} />
      
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize={2048}
        shadow-bias={-0.0001}
      />
      
      {/* Atmospheric effects */}
      <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0.1} azimuth={0.25} />
      <Environment preset="night" />
      
      {/* Performance stats in development */}
      {import.meta.env.DEV && <Stats />}
    </Suspense>
  );
};

export default GameScene;
