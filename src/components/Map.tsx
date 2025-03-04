import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface MapProps {
  mapType: string;
}

const Map: React.FC<MapProps> = ({ mapType }) => {
  const mapRef = useRef<THREE.Mesh>(null);
  const { scene } = useThree();

  const texture = useTexture(`/textures/${mapType}.png`);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.receiveShadow = true;
    }
  }, [mapRef]);

  useFrame(() => {
    if (mapRef.current) {
      //mapRef.current.rotation.x += 0.001;
    }
  });

  return (
    <mesh
      ref={mapRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[50, 50, 1, 1]} />
      <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  );
};

export default Map;
