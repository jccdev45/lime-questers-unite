import { useState, useEffect, useCallback, useRef } from 'react';
import { Player, supabase, updatePlayerPosition, fireWeapon, leaveRoom } from '@/lib/supabase';

// Import Bullet from the vite-env.d.ts type declarations
type Bullet = {
  id: string;
  playerId: string;
  x: number;
  y: number;
  z: number;
  directionX: number;
  directionY: number;
  directionZ: number;
  createdAt: number;
};

type GameState = {
  players: Record<string, Player>;
  bullets: Bullet[];
  localPlayerId: string | null;
  roomId: string | null;
  gameStarted: boolean;
  kills: number;
  deaths: number;
};

const useGameState = (initialRoomId?: string, initialPlayerId?: string) => {
  const [gameState, setGameState] = useState<GameState>({
    players: {},
    bullets: [],
    localPlayerId: initialPlayerId || null,
    roomId: initialRoomId || null,
    gameStarted: false,
    kills: 0,
    deaths: 0,
  });
  
  const [selectedWeapon, setSelectedWeapon] = useState('pistol');
  const [ammo, setAmmo] = useState({ current: 12, max: 12 });
  const [isReloading, setIsReloading] = useState(false);
  const [health, setHealth] = useState(100);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastPositionUpdateRef = useRef<number>(0);
  const playerPositionRef = useRef({ x: 0, y: 1.8, z: 0, rotationY: 0 });
  
  // Mock function to create bot players
  const createBotPlayers = useCallback(() => {
    const bots: Record<string, Player> = {};
    
    for (let i = 0; i < 5; i++) {
      const botId = `bot-${i}`;
      bots[botId] = {
        id: botId,
        name: `Bot ${i}`,
        x: Math.random() * 20 - 10,
        y: 1.8,
        z: Math.random() * 20 - 10,
        rotationY: Math.random() * Math.PI * 2,
        health: 100,
        weapon: i % 2 === 0 ? 'rifle' : 'pistol',
        score: Math.floor(Math.random() * 5),
        isAlive: true,
        team: i % 2 === 0 ? 'green' : 'red',
        lastUpdated: Date.now(),
      };
    }
    
    return bots;
  }, []);
  
  // Initialize game
  const initGame = useCallback((roomId: string, playerId: string) => {
    setGameState(prev => ({
      ...prev,
      roomId,
      localPlayerId: playerId,
      players: {
        ...prev.players,
        [playerId]: {
          id: playerId,
          name: 'You',
          x: 0,
          y: 1.8,
          z: 0,
          rotationY: 0,
          health: 100,
          weapon: selectedWeapon,
          score: 0,
          isAlive: true,
          team: 'green',
          lastUpdated: Date.now(),
        },
        ...createBotPlayers(),
      },
      gameStarted: true,
    }));
  }, [createBotPlayers, selectedWeapon]);
  
  // Update player position
  const updatePosition = useCallback((x: number, y: number, z: number, rotationY: number) => {
    if (!gameState.localPlayerId || !gameState.roomId) return;
    
    playerPositionRef.current = { x, y, z, rotationY };
    
    // Don't update position too frequently
    const now = Date.now();
    if (now - lastPositionUpdateRef.current > 50) {
      lastPositionUpdateRef.current = now;
      
      setGameState(prev => {
        if (!prev.localPlayerId) return prev;
        
        const updatedPlayers = {
          ...prev.players,
          [prev.localPlayerId]: {
            ...prev.players[prev.localPlayerId],
            x,
            y,
            z,
            rotationY,
            lastUpdated: now,
          }
        };
        
        // Send position update to server
        if (prev.roomId) {
          updatePlayerPosition(prev.roomId, {
            id: prev.localPlayerId,
            x,
            y,
            z,
            rotationY,
          });
        }
        
        return {
          ...prev,
          players: updatedPlayers,
        };
      });
    }
  }, [gameState.localPlayerId, gameState.roomId]);
  
  // Fire weapon
  const fire = useCallback(() => {
    if (!gameState.localPlayerId || !gameState.roomId || isReloading) return;
    
    if (ammo.current <= 0) {
      reload();
      return;
    }
    
    setAmmo(prev => ({ ...prev, current: prev.current - 1 }));
    
    const { x, y, z, rotationY } = playerPositionRef.current;
    
    // Calculate direction
    const directionX = Math.sin(rotationY);
    const directionZ = Math.cos(rotationY);
    
    const bulletId = `bullet-${Date.now()}-${Math.random()}`;
    const bullet: Bullet = {
      id: bulletId,
      playerId: gameState.localPlayerId,
      x,
      y: y - 0.1, // Slightly below eye level
      z,
      directionX,
      directionY: 0,
      directionZ,
      createdAt: Date.now(),
    };
    
    // Send bullet to server
    fireWeapon(gameState.roomId, {
      playerId: bullet.playerId,
      x: bullet.x,
      y: bullet.y,
      z: bullet.z,
      directionX: bullet.directionX,
      directionY: bullet.directionY,
      directionZ: bullet.directionZ,
    });
    
    setGameState(prev => ({
      ...prev,
      bullets: [...prev.bullets, bullet],
    }));
    
    // Check for hits
    Object.values(gameState.players).forEach(player => {
      if (player.id !== gameState.localPlayerId && player.isAlive) {
        // Simple hit detection
        const dx = player.x - x;
        const dz = player.z - z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        // Check if aiming in the direction of the player
        const angleToPlayer = Math.atan2(dx, dz);
        const angleDiff = Math.abs(angleToPlayer - rotationY);
        
        if (distance < 10 && (angleDiff < 0.3 || angleDiff > Math.PI * 2 - 0.3)) {
          // Hit!
          const damage = selectedWeapon === 'rifle' ? 25 : 15;
          
          setGameState(prev => {
            const updatedPlayers = { ...prev.players };
            const hitPlayer = updatedPlayers[player.id];
            
            if (hitPlayer && hitPlayer.isAlive) {
              const newHealth = Math.max(0, hitPlayer.health - damage);
              const isKilled = newHealth <= 0;
              
              updatedPlayers[player.id] = {
                ...hitPlayer,
                health: newHealth,
                isAlive: !isKilled,
              };
              
              if (isKilled && prev.localPlayerId) {
                // Update local player score
                updatedPlayers[prev.localPlayerId] = {
                  ...updatedPlayers[prev.localPlayerId],
                  score: updatedPlayers[prev.localPlayerId].score + 1,
                };
                
                return {
                  ...prev,
                  players: updatedPlayers,
                  kills: prev.kills + 1,
                };
              }
            }
            
            return {
              ...prev,
              players: updatedPlayers,
            };
          });
        }
      }
    });
    
  }, [gameState.localPlayerId, gameState.roomId, gameState.players, selectedWeapon, isReloading, ammo, reload]);
  
  // Reload weapon
  function reload() {
    if (isReloading || ammo.current === ammo.max) return;
    
    setIsReloading(true);
    
    setTimeout(() => {
      setAmmo({ ...ammo, current: ammo.max });
      setIsReloading(false);
    }, selectedWeapon === 'rifle' ? 2000 : 1000);
  }
  
  // Change weapon
  const changeWeapon = useCallback((weapon: string) => {
    setSelectedWeapon(weapon);
    setAmmo({
      current: weapon === 'rifle' ? 30 : 12,
      max: weapon === 'rifle' ? 30 : 12,
    });
    
    if (gameState.localPlayerId) {
      setGameState(prev => {
        if (!prev.localPlayerId) return prev;
        
        const updatedPlayers = {
          ...prev.players,
          [prev.localPlayerId]: {
            ...prev.players[prev.localPlayerId],
            weapon,
          }
        };
        
        return {
          ...prev,
          players: updatedPlayers,
        };
      });
    }
  }, [gameState.localPlayerId]);
  
  // Take damage
  const takeDamage = useCallback((amount: number) => {
    setHealth(prev => {
      const newHealth = Math.max(0, prev - amount);
      
      if (newHealth === 0) {
        setGameState(prev => ({
          ...prev,
          deaths: prev.deaths + 1,
        }));
        
        // Respawn after 3 seconds
        setTimeout(() => {
          setHealth(100);
          
          if (gameState.localPlayerId) {
            setGameState(prev => {
              if (!prev.localPlayerId) return prev;
              
              const updatedPlayers = {
                ...prev.players,
                [prev.localPlayerId]: {
                  ...prev.players[prev.localPlayerId],
                  x: Math.random() * 20 - 10,
                  z: Math.random() * 20 - 10,
                  health: 100,
                  isAlive: true,
                }
              };
              
              return {
                ...prev,
                players: updatedPlayers,
              };
            });
          }
        }, 3000);
      }
      
      return newHealth;
    });
  }, [gameState.localPlayerId]);
  
  // Game loop
  useEffect(() => {
    if (!gameState.gameStarted) return;
    
    // Update bot players
    const updateBots = () => {
      setGameState(prev => {
        const now = Date.now();
        const updatedPlayers = { ...prev.players };
        
        Object.keys(updatedPlayers).forEach(id => {
          if (id.startsWith('bot-') && updatedPlayers[id].isAlive) {
            // Random movement
            if (Math.random() < 0.02) {
              const angle = Math.random() * Math.PI * 2;
              const speed = 0.1;
              
              updatedPlayers[id] = {
                ...updatedPlayers[id],
                x: updatedPlayers[id].x + Math.sin(angle) * speed,
                z: updatedPlayers[id].z + Math.cos(angle) * speed,
                rotationY: angle,
                lastUpdated: now,
              };
            }
            
            // Random shooting
            if (Math.random() < 0.01 && prev.localPlayerId) {
              const bot = updatedPlayers[id];
              const player = updatedPlayers[prev.localPlayerId];
              
              if (player && player.isAlive) {
                const dx = player.x - bot.x;
                const dz = player.z - bot.z;
                const distance = Math.sqrt(dx * dx + dz * dz);
                
                if (distance < 15) {
                  // Bot can see player, attempt to shoot
                  const angleToPlayer = Math.atan2(dx, dz);
                  updatedPlayers[id] = {
                    ...bot,
                    rotationY: angleToPlayer,
                  };
                  
                  if (Math.random() < 0.3) {
                    // Hit player
                    takeDamage(Math.random() < 0.2 ? 25 : 10);
                  }
                }
              }
            }
            
            // Respawn dead bots
            Object.keys(updatedPlayers).forEach(id => {
              if (id.startsWith('bot-') && !updatedPlayers[id].isAlive) {
                if (Math.random() < 0.01) {
                  updatedPlayers[id] = {
                    ...updatedPlayers[id],
                    x: Math.random() * 20 - 10,
                    z: Math.random() * 20 - 10,
                    health: 100,
                    isAlive: true,
                  };
                }
              }
            });
          }
        });
        
        // Update bullets
        const updatedBullets = prev.bullets.filter(bullet => {
          // Remove old bullets
          if (now - bullet.createdAt > 2000) return false;
          
          return true;
        });
        
        return {
          ...prev,
          players: updatedPlayers,
          bullets: updatedBullets,
        };
      });
    };
    
    // Start game loop
    gameLoopRef.current = setInterval(updateBots, 50) as unknown as number;
    
    return () => {
      if (gameLoopRef.current !== null) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.gameStarted, takeDamage]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (gameState.roomId && gameState.localPlayerId) {
        leaveRoom(gameState.roomId, gameState.localPlayerId);
      }
    };
  }, [gameState.roomId, gameState.localPlayerId]);
  
  return {
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
    takeDamage,
  };
};

export default useGameState;
