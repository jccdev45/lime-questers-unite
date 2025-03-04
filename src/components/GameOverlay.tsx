
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from '@tanstack/react-router';

interface GameOverlayProps {
  isLocked: boolean;
  controlsRef: React.RefObject<any>;
}

const GameOverlay: React.FC<GameOverlayProps> = ({ isLocked, controlsRef }) => {
  const router = useRouter();

  if (isLocked) return null;

  return (
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
  );
};

export default GameOverlay;
