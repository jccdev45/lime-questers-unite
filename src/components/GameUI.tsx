
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Swords, Skull, Award, Heart, Timer } from 'lucide-react';

interface GameUIProps {
  health: number;
  ammo: {
    current: number;
    max: number;
  };
  weaponType: string;
  isReloading: boolean;
  playersAlive?: number;
  kills: number;
  deaths: number;
  score: number;
  onWeaponChange: (weapon: string) => void;
  onReload?: () => void;
}

const GameUI: React.FC<GameUIProps> = ({
  health,
  ammo,
  weaponType,
  isReloading,
  playersAlive,
  kills,
  deaths,
  score,
  onWeaponChange,
  onReload,
}) => {
  return (
    <div className="absolute bottom-0 left-0 w-full p-4 text-white flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            <Heart className="mr-1 h-4 w-4" />
            {health} HP
          </Badge>
          <Badge variant="secondary">
            <Swords className="mr-1 h-4 w-4" />
            {kills} Kills
          </Badge>
          <Badge variant="secondary">
            <Skull className="mr-1 h-4 w-4" />
            {deaths} Deaths
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          {playersAlive !== undefined && (
            <Badge variant="secondary">
              <Timer className="mr-1 h-4 w-4" />
              {playersAlive} Alive
            </Badge>
          )}
          <Badge variant="secondary">
            <Award className="mr-1 h-4 w-4" />
            {score} Score
          </Badge>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div>
            <h3 className="text-lg font-semibold">Weapon: {weaponType}</h3>
            <p className="text-sm">
              Ammo: {ammo.current} / {ammo.max}
              {isReloading && <span className="ml-2">(Reloading...)</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => onWeaponChange('pistol')}
          >
            Pistol
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => onWeaponChange('rifle')}
          >
            Rifle
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameUI;
