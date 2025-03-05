export {};

declare namespace JSX {
  interface IntrinsicElements {
    group: any;
    mesh: any;
    boxGeometry: any;
    planeGeometry: any;
    meshStandardMaterial: any;
    cylinderGeometry: any;
    sphereGeometry: any;
    pointLight: any;
    ambientLight: any;
    directionalLight: any;
    fog: any;
    sprite: any;
    spriteMaterial: any;
    capsuleGeometry: any;
    canvasTexture: any;
    gridHelper: any;
  }
}

// Define types for Bullet
export interface Bullet {
  id: string;
  playerId: string;
  x: number;
  y: number;
  z: number;
  directionX: number;
  directionY: number;
  directionZ: number;
  createdAt: number;
}

// Define types for GameRoom
export interface GameRoom {
  id: string;
  name: string;
  map: string;
  maxPlayers: number;
  currentPlayers: number;
  status: "waiting" | "playing" | "ended";
  hostId: string;
  createdAt: string;
}
