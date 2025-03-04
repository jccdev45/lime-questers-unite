
import { createClient } from '@supabase/supabase-js';

// These environment variables should be properly set in a .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Player type definition
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

// Game session type definition
export interface GameSession {
  id: string;
  name: string;
  map: string;
  maxPlayers: number;
  status: 'waiting' | 'playing' | 'ended';
  createdAt: string;
  hostId: string;
}

// Utility functions for Supabase Realtime
export const subscribeToGameUpdates = (gameId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`game-${gameId}`)
    .on('broadcast', { event: 'game-update' }, (payload) => {
      callback(payload);
    })
    .subscribe();
};

export const publishGameUpdate = async (gameId: string, data: any) => {
  return await supabase
    .channel(`game-${gameId}`)
    .send({
      type: 'broadcast',
      event: 'game-update',
      payload: data,
    });
};
