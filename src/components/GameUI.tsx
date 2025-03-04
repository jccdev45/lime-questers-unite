
import React, { useState, useEffect } from 'react';
import { Crosshair, Target, Shield, Zap, Gun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GameUIProps {
  health: number;
  ammo: { current: number; max: number };
  weapon: string;
  isReloading: boolean;
  playersAlive: number;
  kills: number;
  deaths: number;
  score: number;
  onWeaponChange: (weapon: string) => void;
}

const GameUI: React.FC<GameUIProps> = ({
  health,
  ammo,
  weapon,
  isReloading,
  playersAlive,
  kills,
  deaths,
  score,
  onWeaponChange,
}) => {
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [damageTaken, setDamageTaken] = useState(false);
  const [healthState, setHealthState] = useState(health);
  
  // Flash effect when health decreases
  useEffect(() => {
    if (health < healthState) {
      setDamageTaken(true);
      setTimeout(() => setDamageTaken(false), 300);
    }
    setHealthState(health);
  }, [health, healthState]);
  
  return (
    <>
      {/* Crosshair */}
      <div className="crosshair">
        <Crosshair 
          className={cn(
            "w-5 h-5 text-white opacity-70 transition-all duration-300",
            isReloading ? "scale-150 opacity-30" : "",
            weapon === 'rifle' ? "scale-125" : "scale-100"
          )}
        />
      </div>
      
      {/* Bottom HUD */}
      <motion.div 
        className="fps-hud"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <div className="flex justify-between items-center gap-4">
          {/* Health indicator */}
          <motion.div 
            className="glass rounded-lg p-3 flex items-center gap-2 w-52"
            animate={{ 
              x: damageTaken ? [-5, 5, -3, 3, 0] : 0,
              borderColor: damageTaken ? ['rgba(255,50,50,0.5)', 'rgba(255,255,255,0.2)'] : 'rgba(255,255,255,0.2)',
            }}
            transition={{ duration: 0.3 }}
          >
            <Shield className="text-white w-5 h-5" />
            <div className="flex-1">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  className="health-bar" 
                  initial={{ width: "100%" }}
                  animate={{ 
                    width: `${health}%`,
                    backgroundColor: health > 60 
                      ? "#84cc16" 
                      : health > 30 
                        ? "#facc15" 
                        : "#ef4444"
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
            <span className="text-white font-mono">{health}</span>
          </motion.div>
          
          {/* Score info */}
          <div className="glass rounded-lg p-3 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Target className="text-lime-400 w-4 h-4" />
              <span className="text-white text-sm">{kills}</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex items-center gap-1">
              <Zap className="text-red-400 w-4 h-4" />
              <span className="text-white text-sm">{deaths}</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex items-center gap-1">
              <span className="text-white text-sm font-bold">Score:</span>
              <span className="text-lime-400 text-sm">{score}</span>
            </div>
          </div>
          
          {/* Ammo counter */}
          <motion.div 
            className="glass rounded-lg p-3 flex items-center gap-2 w-44"
            animate={{ opacity: isReloading ? 0.7 : 1 }}
          >
            <Gun className="text-white w-5 h-5" />
            <div className="flex-1 flex justify-center">
              {isReloading ? (
                <span className="text-yellow-400 text-sm animate-pulse">RELOADING</span>
              ) : (
                <motion.span 
                  className="ammo-counter" 
                  key={ammo.current}
                  initial={{ scale: 1.3, color: "#ffffff" }}
                  animate={{ scale: 1, color: ammo.current < 3 ? "#ef4444" : "#ffffff" }}
                  transition={{ duration: 0.2 }}
                >
                  {ammo.current}/{ammo.max}
                </motion.span>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Weapon selector */}
      <div className="weapon-select">
        <div className="flex flex-col gap-2">
          <button
            className={cn(
              "px-4 py-2 rounded-lg flex items-center gap-2 transition-all",
              weapon === 'pistol' 
                ? "bg-lime-500 text-white" 
                : "bg-white/10 text-white hover:bg-white/20"
            )}
            onClick={() => onWeaponChange('pistol')}
          >
            <span className="text-sm font-medium">Pistol</span>
          </button>
          <button
            className={cn(
              "px-4 py-2 rounded-lg flex items-center gap-2 transition-all",
              weapon === 'rifle' 
                ? "bg-lime-500 text-white" 
                : "bg-white/10 text-white hover:bg-white/20"
            )}
            onClick={() => onWeaponChange('rifle')}
          >
            <span className="text-sm font-medium">Rifle</span>
          </button>
        </div>
      </div>
      
      {/* Players alive counter */}
      <motion.div 
        className="fixed top-5 left-5 glass rounded-lg p-3 flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <Zap className="text-lime-400 w-5 h-5" />
        <span className="text-white text-sm">{playersAlive} ALIVE</span>
      </motion.div>
      
      {/* Game status messages */}
      <AnimatePresence>
        {health <= 0 && (
          <motion.div
            key="dead-message"
            className="fixed top-1/4 left-0 right-0 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="inline-block glass rounded-lg px-8 py-4">
              <h2 className="text-red-500 text-3xl font-bold mb-2">YOU DIED</h2>
              <p className="text-white text-lg">Respawning in 3 seconds...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Scoreboard (toggled with Tab key) */}
      <AnimatePresence>
        {showScoreboard && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="glass rounded-xl p-6 max-w-2xl w-full">
              <h2 className="text-white text-2xl font-bold mb-4">Scoreboard</h2>
              <div className="space-y-2">
                {/* Example scoreboard entries */}
                <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                  <span className="text-lime-400 font-medium">You</span>
                  <div className="flex items-center gap-4">
                    <span className="text-white">{kills} kills</span>
                    <span className="text-white">{deaths} deaths</span>
                    <span className="text-white font-bold">{score} pts</span>
                  </div>
                </div>
                {/* Mock other players */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                    <span className="text-white font-medium">Bot {i + 1}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-white">{Math.floor(Math.random() * 10)} kills</span>
                      <span className="text-white">{Math.floor(Math.random() * 5)} deaths</span>
                      <span className="text-white font-bold">{Math.floor(Math.random() * 20)} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GameUI;
