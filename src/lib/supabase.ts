
import { createClient } from '@supabase/supabase-js';

// For this demo, we'll use the public Supabase URL and anon key
// In a production app, these would be environment variables
const supabaseUrl = 'https://supabase.example.com';
const supabaseAnonKey = 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Player = {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  rotationY: number;
  health: number;
  weapon: string;
  score: number;
  isAlive: boolean;
  lastUpdate: number;
};

export type Bullet = {
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

export type GameRoom = {
  id: string;
  name: string;
  map: string;
  playerCount: number;
  maxPlayers: number;
  status: 'waiting' | 'playing' | 'ended';
};

// Mock functions until we connect to Supabase
export const joinRoom = async (roomId: string, playerName: string): Promise<{ playerId: string }> => {
  console.log(`Joining room ${roomId} as ${playerName}`);
  return { playerId: `player-${Math.floor(Math.random() * 1000)}` };
};

export const leaveRoom = async (roomId: string, playerId: string) => {
  console.log(`Player ${playerId} left room ${roomId}`);
};

export const updatePlayerPosition = async (roomId: string, player: Partial<Player>) => {
  console.log(`Updating player position in room ${roomId}`, player);
};

export const fireWeapon = async (roomId: string, bullet: Omit<Bullet, 'id' | 'createdAt'>) => {
  console.log(`Player ${bullet.playerId} fired in room ${roomId}`);
};

export const getRooms = async (): Promise<GameRoom[]> => {
  // Mock rooms
  return [
    {
      id: 'room-1',
      name: 'Lime Arena',
      map: 'arena',
      playerCount: 3,
      maxPlayers: 8,
      status: 'playing'
    },
    {
      id: 'room-2',
      name: 'Tactical Grounds',
      map: 'tactical',
      playerCount: 1,
      maxPlayers: 6,
      status: 'waiting'
    },
    {
      id: 'room-3',
      name: 'Citrus Battlefield',
      map: 'battlefield',
      playerCount: 0,
      maxPlayers: 10,
      status: 'waiting'
    }
  ];
};

export const createRoom = async (roomName: string, map: string, maxPlayers: number): Promise<{ roomId: string }> => {
  console.log(`Creating room ${roomName} with map ${map}`);
  return { roomId: `room-${Math.floor(Math.random() * 1000)}` };
};

export default supabase;
