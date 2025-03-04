
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            <span className="text-lime-400">Lime</span> Tactics
          </h1>
          <p className="text-muted-foreground">
            A fast-paced multiplayer FPS experience
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            className="w-full h-12 bg-lime-500 hover:bg-lime-600" 
            onClick={() => navigate({ to: '/lobby' })}
          >
            Find Game
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full h-12 border-lime-500 text-lime-500 hover:bg-lime-500/10"
            onClick={() => navigate({ to: '/game' })}
          >
            Practice Mode
          </Button>
        </div>
        
        <div className="mt-8 text-center text-xs text-muted-foreground">
          Use WASD to move, mouse to aim, left click to shoot
        </div>
      </div>
    </div>
  );
};

export default Index;
