import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

// Use the GameRoom type from vite-env.d.ts
type GameRoom = {
  id: string;
  name: string;
  map: string;
  maxPlayers: number;
  currentPlayers?: number;
  status: "waiting" | "playing" | "ended";
  hostId: string;
  createdAt: string;
};

export const Route = createFileRoute("/lobby")({
  component: Lobby,
});

// Mock functions to replace missing exports
const getRooms = async (): Promise<GameRoom[]> => {
  return [
    {
      id: "room-1",
      name: "Lime Arena",
      map: "default",
      maxPlayers: 8,
      currentPlayers: 3,
      status: "waiting",
      createdAt: new Date().toISOString(),
      hostId: "host-1",
    },
    {
      id: "room-2",
      name: "Neon Jungle",
      map: "jungle",
      maxPlayers: 6,
      currentPlayers: 5,
      status: "playing",
      createdAt: new Date().toISOString(),
      hostId: "host-2",
    },
  ];
};

const createRoom = async (name: string): Promise<GameRoom> => {
  return {
    id: `room-${Date.now()}`,
    name,
    map: "default",
    maxPlayers: 8,
    currentPlayers: 1,
    status: "waiting",
    createdAt: new Date().toISOString(),
    hostId: "current-user",
  };
};

const joinRoom = async (roomId: string): Promise<boolean> => {
  return true;
};

function Lobby() {
  const [rooms, setRooms] = useState<GameRoom[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchRooms = async () => {
      const fetchedRooms = await getRooms();
      setRooms(fetchedRooms);
    };

    fetchRooms();
  }, []);

  const handleCreateRoom = async () => {
    if (newRoomName.trim() === "") {
      alert("Room name cannot be empty.");
      return;
    }

    const newRoom = await createRoom(newRoomName);
    setRooms([...rooms, newRoom]);
    setNewRoomName("");
  };

  const handleJoinRoom = async (roomId: string) => {
    const success = await joinRoom(roomId);
    if (success) {
      router.navigate({
        to: "/game",
        search: {
          room: roomId,
        },
      });
    } else {
      alert("Failed to join room.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Game Lobby
          </h1>
          <p className="text-muted-foreground">
            Join an existing room or create a new one to start playing.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter room name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
            />
            <Button onClick={handleCreateRoom}>Create Room</Button>
          </div>

          {rooms.map((room) => (
            <motion.div
              key={room.id}
              className="glass p-4 rounded-lg flex items-center justify-between"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {room.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {room.currentPlayers}/{room.maxPlayers} Players | Status:{" "}
                  {room.status}
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => handleJoinRoom(room.id)}
              >
                Join
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
