import { GameSession } from "./types";

import { supabaseClient } from "@/integrations/supabase/client";

// Player position update
export const updatePlayerPosition = async (
  roomId: string,
  positionData: {
    id: string;
    x: number;
    y: number;
    z: number;
    rotationY: number;
  }
): Promise<void> => {
  // Would normally update the player position in Supabase Realtime
  console.log("Player position updated", positionData);
};

// Weapon fire
export const fireWeapon = async (
  roomId: string,
  bulletData: {
    playerId: string;
    x: number;
    y: number;
    z: number;
    directionX: number;
    directionY: number;
    directionZ: number;
  }
): Promise<void> => {
  // Would normally publish the bullet data to Supabase Realtime
  console.log("Weapon fired", bulletData);
};

// Leave room
export const leaveRoom = async (
  roomId: string,
  playerId: string
): Promise<void> => {
  // Would normally remove the player from the room in Supabase
  console.log("Player left room", { roomId, playerId });
};

// Game room functions
export const getRooms = async (): Promise<GameSession[]> => {
  // This would normally query Supabase, but for now return mock data
  return [
    {
      id: "room-1",
      name: "Lime Arena",
      map: "default",
      maxPlayers: 8,
      status: "waiting",
      createdAt: new Date().toISOString(),
      hostId: "host-1",
    },
  ];
};

export const createRoom = async (
  name: string,
  map: string = "default",
  maxPlayers: number = 8
): Promise<GameSession> => {
  const room = {
    id: `room-${Date.now()}`,
    name,
    map,
    maxPlayers,
    status: "waiting" as const,
    createdAt: new Date().toISOString(),
    hostId: "current-user-id",
  };

  // Would normally save to Supabase
  return room;
};

export const joinRoom = async (
  roomId: string,
  playerId: string
): Promise<boolean> => {
  // Would normally update the room in Supabase
  return true;
};

// Supabase Realtime helpers
export const subscribeToGameUpdates = (
  gameId: string,
  callback: (payload: any) => void
) => {
  return supabaseClient
    .channel(`game-${gameId}`)
    .on("broadcast", { event: "game-update" }, (payload) => {
      callback(payload);
    })
    .subscribe();
};

export const publishGameUpdate = async (gameId: string, data: any) => {
  return await supabaseClient.channel(`game-${gameId}`).send({
    type: "broadcast",
    event: "game-update",
    payload: data,
  });
};
