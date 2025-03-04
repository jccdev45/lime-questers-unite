
import React from 'react';
import { Button } from '@/components/ui/button';
import { Target, Swords } from 'lucide-react'; // Use valid icons from lucide-react
import { motion } from 'framer-motion';

interface GameUIProps {
  health: number;
  ammo: { current: number; max: number };
  score: number;
  kills: number;
  deaths: number;
  isReloading: boolean;
  selectedWeapon: string;
  onWeaponChange: (weapon: string) => void;
  onReload: () => void;
}

const GameUI: React.FC<GameUIProps> = ({
  health,
  ammo,
  score,
  kills,
  deaths,
  isReloading,
  selectedWeapon,
  onWeaponChange,
  onReload,
}) => {
  return (
    <>
      {/* Crosshair */}
      <div className="crosshair">
        <Target className="w-6 h-6 text-lime-500 opacity-50" />
      </div>

      {/* HUD */}
      <div className="fps-hud">
        <div className="flex justify-between items-end">
          <div className="glass p-3 rounded-lg">
            <div className="mb-2">
              <p className="text-xs text-white/70 mb-1">HEALTH</p>
              <div className="w-48 h-2 bg-white/20 rounded-full">
                <div 
                  className="health-bar" 
                  style={{ width: `${health}%` }}
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-white/70 mb-1">AMMO</p>
              <div className="flex justify-between items-center">
                <div className="ammo-counter">
                  {isReloading ? (
                    <motion.span
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                    >
                      Reloading...
                    </motion.span>
                  ) : (
                    `${ammo.current} / ${ammo.max}`
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onReload}
                  disabled={isReloading || ammo.current === ammo.max}
                  className="ml-2 text-xs"
                >
                  Reload
                </Button>
              </div>
            </div>
          </div>

          <div className="glass p-3 rounded-lg">
            <div className="text-center">
              <p className="text-xs text-white/70">SCORE</p>
              <p className="text-xl font-bold text-lime-400">{score}</p>
            </div>
            <div className="flex justify-between gap-4 mt-2">
              <div className="text-center">
                <p className="text-xs text-white/70">KILLS</p>
                <p className="text-sm font-medium text-white">{kills}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-white/70">DEATHS</p>
                <p className="text-sm font-medium text-white">{deaths}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weapon selection */}
      <div className="weapon-select">
        <div className="flex flex-col gap-2">
          <button
            className={`p-2 rounded-lg flex items-center gap-2 transition-all ${
              selectedWeapon === 'pistol'
                ? 'bg-lime-500 text-black'
                : 'text-white hover:bg-white/10'
            }`}
            onClick={() => onWeaponChange('pistol')}
          >
            <Swords className="w-4 h-4" />
            <span className="text-sm">Pistol</span>
          </button>
          <button
            className={`p-2 rounded-lg flex items-center gap-2 transition-all ${
              selectedWeapon === 'rifle'
                ? 'bg-lime-500 text-black'
                : 'text-white hover:bg-white/10'
            }`}
            onClick={() => onWeaponChange('rifle')}
          >
            <Swords className="w-4 h-4" />
            <span className="text-sm">Rifle</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default GameUI;
