import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  PointerLockControls, 
  Sky, 
  Environment, 
  useHelper, 
  Stats,
  Loader
} from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from '@tanstack/react-router';
import { motion } from 'framer-motion';

import GameUI from '@/components/GameUI';
import useGameState from '@/hooks/useGameState';
import Player from '@/components/Player';
import Weapon from '@/components/Weapon';
import Map from '@/components/Map';

const Game = () => {
  const router = useRouter();
  const search = router.state.location.search;
  const roomId = search.room || 'room-1';
  const playerId = `player-${Math.floor(Math.random() * 1000)}`;
  const mapType = 'arena';
  
  const {
    gameState,
    selectedWeapon,
    ammo,
    isReloading,
    health,
    initGame,
    updatePosition,
    fire,
    reload,
    changeWeapon,
  } = useGameState(roomId, playerId);
  
  const [isFiring, setIsFiring] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  
  const controlsRef = useRef<any>(null);
  const playerRef = useRef<THREE.Group>(null);
  const movementRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    running: false,
  });
  
  // Initialize game on first mount
  useEffect(() => {
    if (!isGameStarted) {
      initGame(roomId, playerId);
      setIsGameStarted(true);
    }
  }, [roomId, playerId, initGame, isGameStarted]);
  
  // Set up controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
          movementRef.current.forward = true;
          break;
        case 'KeyS':
          movementRef.current.backward = true;
          break;
        case 'KeyA':
          movementRef.current.left = true;
          break;
        case 'KeyD':
          movementRef.current.right = true;
          break;
        case 'ShiftLeft':
          movementRef.current.running = true;
          break;
        case 'KeyR':
          reload();
          break;
        case 'Digit1':
          changeWeapon('pistol');
          break;
        case 'Digit2':
          changeWeapon('rifle');
          break;
        case 'Escape':
          if (controlsRef.current) {
            controlsRef.current.unlock();
          }
          break;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
          movementRef.current.forward = false;
          break;
        case 'KeyS':
          movementRef.current.backward = false;
          break;
        case 'KeyA':
          movementRef.current.left = false;
          break;
        case 'KeyD':
          movementRef.current.right = false;
          break;
        case 'ShiftLeft':
          movementRef.current.running = false;
          break;
      }
    };
    
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0 && isLocked) {
        setIsFiring(true);
        fire();
        const fireInterval = setInterval(() => {
          if (isFiring) {
            fire();
          } else {
            clearInterval(fireInterval);
          }
        }, selectedWeapon === 'rifle' ? 100 : 300);
        
        return () => clearInterval(fireInterval);
      }
    };
    
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        setIsFiring(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isLocked, isFiring, fire, reload, changeWeapon, selectedWeapon]);
  
  // Handle player movement
  useEffect(() => {
    if (!playerRef.current || !controlsRef.current) return;
    
    const movementSpeed = 0.15;
    const runningMultiplier = 1.5;
    
    const updatePlayerMovement = () => {
      if (!isLocked || !controlsRef.current || !playerRef.current) return;
      
      const camera = controlsRef.current.getObject();
      if (!camera) return;
      
      const speed = movementRef.current.running ? movementSpeed * runningMultiplier : movementSpeed;
      
      // Get direction vector
      const direction = new THREE.Vector3();
      const rotation = new THREE.Euler(0, camera.rotation.y, 0, 'YXZ');
      
      // Calculate movement based on keys pressed
      if (movementRef.current.forward) {
        direction.z -= 1;
      }
      if (movementRef.current.backward) {
        direction.z += 1;
      }
      if (movementRef.current.left) {
        direction.x -= 1;
      }
      if (movementRef.current.right) {
        direction.x += 1;
      }
      
      // Normalize direction vector
      if (direction.length() > 0) {
        direction.normalize();
      }
      
      // Apply camera rotation to movement
      direction.applyEuler(rotation);
      
      // Update player position
      playerRef.current.position.x += direction.x * speed;
      playerRef.current.position.z += direction.z * speed;
      
      // Update game state with new position
      updatePosition(
        playerRef.current.position.x,
        playerRef.current.position.y,
        playerRef.current.position.z,
        camera.rotation.y
      );
    };
    
    const interval = setInterval(updatePlayerMovement, 16);
    
    return () => clearInterval(interval);
  }, [isLocked, updatePosition]);
  
  // Handle lock and unlock camera
  const handleLock = () => {
    setIsLocked(true);
  };
  
  const handleUnlock = () => {
    setIsLocked(false);
  };
  
  // Count alive players
  const playersAlive = Object.values(gameState.players).filter(p => p.isAlive).length;
  
  // Check if local player is dead
  const isLocalPlayerDead = gameState.localPlayerId 
    ? !(gameState.players[gameState.localPlayerId]?.isAlive ?? true)
    : false;
  
  return (
    <div className="game-container">
      <Canvas shadows>
        <fog attach="fog" args={['#0a0a0a', 0, 40]} />
        
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 1.8, 0]} fov={75} near={0.1} far={1000} />
          
          {/* Controls */}
          <PointerLockControls ref={controlsRef} onLock={handleLock} onUnlock={handleUnlock} />
          
          {/* Player body */}
          <group ref={playerRef} position={[0, 1.8, 0]}>
            {/* First-person weapon */}
            {isLocked && (
              <Weapon type={selectedWeapon} isReloading={isReloading} isFiring={isFiring} />
            )}
          </group>
          
          {/* Players */}
          {Object.values(gameState.players).map(player => (
            <Player 
              key={player.id} 
              player={player} 
              isLocal={player.id === gameState.localPlayerId} 
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
      </Canvas>
      
      {/* Loading indicator */}
      <Loader />
      
      {/* Game UI */}
      {isGameStarted && (
        <GameUI
          health={isLocalPlayerDead ? 0 : health}
          ammo={ammo}
          weaponType={selectedWeapon}
          isReloading={isReloading}
          playersAlive={playersAlive}
          kills={gameState.kills}
          deaths={gameState.deaths}
          score={gameState.localPlayerId ? gameState.players[gameState.localPlayerId]?.score || 0 : 0}
          onWeaponChange={changeWeapon}
        />
      )}
      
      {/* Click to play overlay when not locked */}
      {!isLocked && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <motion.div 
            className="glass rounded-xl p-8 text-center max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-lime-400 mb-4">Lime Tactics</h2>
            <p className="text-white mb-6">
              Click to play the game. Use WASD to move, SHIFT to run, and mouse to aim and shoot.
              Press R to reload, and 1-2 to switch weapons.
            </p>
            <button 
              className="px-6 py-3 bg-lime-500 hover:bg-lime-600 text-white rounded-lg font-medium shadow-lg transition-all hover:scale-105"
              onClick={() => {
                if (controlsRef.current) {
                  controlsRef.current.lock();
                }
              }}
            >
              PLAY NOW
            </button>
            <button 
              className="px-6 py-2 text-white/70 hover:text-white rounded-lg font-medium mt-4 transition-all"
              onClick={() => router.navigate({ to: '/lobby' })}
            >
              Back to Lobby
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Game;
