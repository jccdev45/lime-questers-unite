// Merge existing types.ts content here if necessary

// Player type definition (already exists, just move it here)
export interface Player {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  rotationY: number;
  health: number;
  score: number;
  isAlive: boolean;
  weapon: string;
  team: string;
  lastUpdated: number;
}

// Game session type definition (already exists, just move it here)
export interface GameSession {
  id: string;
  name: string;
  map: string;
  maxPlayers: number;
  status: "waiting" | "playing" | "ended";
  createdAt: string;
  hostId: string;
}

// Bullet type definition (already exists, just move it here)
export interface Bullet {
  id: string;
  playerId: string;
  x: number;
  y: number;
  z: number;
  directionX: number;
  directionY: number;
  directionZ: number;
  createdAt: number;
}
