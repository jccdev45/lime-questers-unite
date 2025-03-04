
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GameRoom, getRooms, createRoom, joinRoom } from '@/lib/supabase';
import { Users, Map, Plus, Gamepad2, ChevronRight, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Lobby = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<GameRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [playerName, setPlayerName] = useState('');
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomMap, setNewRoomMap] = useState('arena');
  const [newRoomMaxPlayers, setNewRoomMaxPlayers] = useState(8);
  
  // Load rooms on mount
  useEffect(() => {
    fetchRooms();
  }, []);
  
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const roomsList = await getRooms();
      setRooms(roomsList);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: 'Error',
        description: 'Failed to load game rooms',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a room name',
        variant: 'destructive',
      });
      return;
    }
    
    if (!playerName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your player name',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const { roomId } = await createRoom(newRoomName, newRoomMap, newRoomMaxPlayers);
      const { playerId } = await joinRoom(roomId, playerName);
      
      toast({
        title: 'Room Created',
        description: `Created and joined "${newRoomName}"`,
      });
      
      navigate('/game', { 
        state: { 
          roomId, 
          playerId,
          map: newRoomMap
        } 
      });
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: 'Error',
        description: 'Failed to create game room',
        variant: 'destructive',
      });
    }
  };
  
  const handleJoinRoom = async (roomId: string, map: string) => {
    if (!playerName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your player name',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const { playerId } = await joinRoom(roomId, playerName);
      
      toast({
        title: 'Joined Room',
        description: `Successfully joined the game`,
      });
      
      navigate('/game', { 
        state: { 
          roomId, 
          playerId,
          map
        } 
      });
    } catch (error) {
      console.error('Error joining room:', error);
      toast({
        title: 'Error',
        description: 'Failed to join game room',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-5xl font-bold mb-4"
            >
              <span className="text-lime-400">Lime</span> Tactics
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-gray-300 text-xl"
            >
              Fast-paced multiplayer FPS action
            </motion.p>
          </motion.div>
          
          {/* Player name input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="glass rounded-xl p-6 mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">Your Player Profile</h2>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter your player name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 flex-1 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500"
                maxLength={20}
              />
            </div>
          </motion.div>
          
          {/* Game rooms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="glass rounded-xl p-6 mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Game Rooms</h2>
              <div className="flex gap-3">
                <button
                  onClick={fetchRooms}
                  disabled={loading}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 transition-all"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span className="text-sm">Refresh</span>
                </button>
                <button
                  onClick={() => setShowCreateRoom(true)}
                  className="flex items-center gap-2 bg-lime-500 hover:bg-lime-600 rounded-lg px-4 py-2 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Create Room</span>
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
              </div>
            ) : rooms.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Gamepad2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No game rooms available</p>
                <p className="text-sm mt-2">Create a new room to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rooms.map((room) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/5 hover:bg-white/10 rounded-lg p-4 flex justify-between items-center group transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium">{room.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          room.status === 'playing' 
                            ? 'bg-blue-500/20 text-blue-300' 
                            : 'bg-green-500/20 text-green-300'
                        }`}>
                          {room.status === 'playing' ? 'In Progress' : 'Waiting'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Map className="w-4 h-4" />
                          <span>{room.map.charAt(0).toUpperCase() + room.map.slice(1)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{room.playerCount}/{room.maxPlayers}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleJoinRoom(room.id, room.map)}
                      className="bg-lime-500 hover:bg-lime-600 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <span>Join</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
          
          {/* Quick Play button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center"
          >
            <button
              onClick={() => {
                if (!playerName.trim()) {
                  toast({
                    title: 'Error',
                    description: 'Please enter your player name',
                    variant: 'destructive',
                  });
                  return;
                }
                
                if (rooms.length > 0) {
                  // Join first available room
                  const availableRoom = rooms.find(r => r.playerCount < r.maxPlayers);
                  if (availableRoom) {
                    handleJoinRoom(availableRoom.id, availableRoom.map);
                    return;
                  }
                }
                
                // Create a new room if none available
                setNewRoomName(`${playerName}'s Game`);
                setShowCreateRoom(true);
              }}
              className="bg-lime-500 hover:bg-lime-600 text-white rounded-xl px-8 py-4 text-lg font-medium transition-all hover:scale-105"
            >
              Quick Play
            </button>
            <p className="text-gray-400 text-sm mt-4">
              Joins an available game or creates a new one
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Create Room Dialog */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-xl p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold mb-6">Create New Game Room</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Room Name</label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Enter room name"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Map</label>
                <select
                  value={newRoomMap}
                  onChange={(e) => setNewRoomMap(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                >
                  <option value="arena">Arena</option>
                  <option value="tactical">Tactical</option>
                  <option value="battlefield">Battlefield</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Max Players</label>
                <select
                  value={newRoomMaxPlayers}
                  onChange={(e) => setNewRoomMaxPlayers(Number(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                >
                  <option value="4">4 Players</option>
                  <option value="6">6 Players</option>
                  <option value="8">8 Players</option>
                  <option value="10">10 Players</option>
                  <option value="12">12 Players</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowCreateRoom(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRoom}
                className="px-6 py-2 bg-lime-500 hover:bg-lime-600 text-white rounded-lg transition-all"
              >
                Create & Join
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Lobby;
