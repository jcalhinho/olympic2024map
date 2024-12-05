import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Physics } from '@react-three/rapier';

import FallingDie from './FallingDice';
import GroundDie from './GroundDice';

const Home: React.FC = () => {
  return (
    <Canvas shadows style={{ height: '100vh', background: 'linear-gradient(to bottom, #000428, #004e92)' }}>
      {/* Caméra */}
      <PerspectiveCamera makeDefault position={[0, 100, 50]} fov={75} />

      {/* Lumières */}
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[0, 50, 100]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Monde Physique */}
      <Physics gravity={[0, -11.81, 0]}>
        {/* Dé géant */}
        <GroundDie />

        {/* Dés tombants */}
        <FallingDie position={[-15, 60, 0]} />
        <FallingDie position={[0, 61, 0]} />
        <FallingDie position={[15, 60, 0]} />
      </Physics>

      {/* Contrôles de la caméra */}
      <OrbitControls enablePan={true} enableZoom={true} />
    </Canvas>
  );
};

export default Home;