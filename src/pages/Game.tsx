
import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from '@tanstack/react-router';

import GameUI from '@/components/GameUI';
import GameScene from '@/components/GameScene';
import GameOverlay from '@/components/GameOverlay';
import useGameState from '@/hooks/useGameState';
import useGameControls from '@/hooks/useGameControls';

const Game = () => {
  const router = useRouter();
  const roomId = router.state.location.search.room || 'room-1';
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
  
  // Set up game controls
  useGameControls({
    isLocked,
    controlsRef,
    playerRef,
    movementRef,
    fire,
    reload,
    changeWeapon,
    isFiring,
    setIsFiring,
    updatePosition,
    roomId,
  });
  
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
        
        <GameScene
          controlsRef={controlsRef}
          playerRef={playerRef}
          players={gameState.players}
          localPlayerId={gameState.localPlayerId}
          selectedWeapon={selectedWeapon}
          isReloading={isReloading}
          isFiring={isFiring}
          mapType={mapType}
          onLock={handleLock}
          onUnlock={handleUnlock}
        />
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
      <GameOverlay isLocked={isLocked} controlsRef={controlsRef} />
    </div>
  );
};

export default Game;
