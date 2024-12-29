

// src/components/Home.tsx
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import GroundDice from './GroundDice';
import { Euler } from 'three';

const Home: React.FC = () => {
  // État de rotation cible
  const [targetRotation, setTargetRotation] = useState<Euler>(new Euler(0, 0, 0, 'XYZ'));

  // Handlers pour la rotation
  const rotateUp = () => {
    setTargetRotation((prev) => new Euler(prev.x - Math.PI / 2, prev.y, prev.z, 'XYZ'));
  };

  const rotateDown = () => {
    setTargetRotation((prev) => new Euler(prev.x + Math.PI / 2, prev.y, prev.z, 'XYZ'));
  };

  const rotateLeft = () => {
    setTargetRotation((prev) => new Euler(prev.x, prev.y + Math.PI / 2, prev.z, 'XYZ'));
  };

  const rotateRight = () => {
    setTargetRotation((prev) => new Euler(prev.x, prev.y - Math.PI / 2, prev.z, 'XYZ'));
  };

  // Composant pour les boutons de rotation avec labels
  const RotationButton: React.FC<{
    label: string;
    position: [number, number, number];
    onClick: () => void;
  }> = ({ label, position, onClick }) => {
    return (
      <mesh position={position} onClick={onClick} castShadow receiveShadow>
        <boxGeometry args={[2, 1, 0.2]} />
        <meshStandardMaterial color="orange" />
        <Text
          position={[0, 0, 0.3]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </mesh>
    );
  };

  return (
    <Canvas
      shadows
      camera={{ position: [0, 15, 30], fov: 60 }}
      style={{
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(to bottom, #000428, #004e92)' // Fond bleu ciel
      }}
    >
      {/* Lumières */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={500}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />

      {/* Monde physique avec gravité */}
      <Physics gravity={[0, -9.81, 0]}>
        <GroundDice targetRotation={targetRotation} />
      </Physics>

      {/* Contrôles de la caméra */}
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        minPolarAngle={0} // Permet l'inclinaison complète vers le bas
        maxPolarAngle={Math.PI} // Permet l'inclinaison complète vers le haut
        target={[0, 0, 0]} // Centre les contrôles sur le cube
      />

      {/* Boutons de rotation autour du cube */}
      <group>
        {/* Bouton Up */}
        <RotationButton
          label="↑"
          position={[0, 10, 0]} // Position ajustée pour être autour du cube
          onClick={rotateUp}
        />
        {/* Bouton Down */}
        <RotationButton
          label="↓"
          position={[0, -10, 0]} // Position ajustée pour être autour du cube
          onClick={rotateDown}
        />
        {/* Bouton Left */}
        <RotationButton
          label="←"
          position={[-10, 0, 0]} // Position ajustée pour être autour du cube
          onClick={rotateLeft}
        />
        {/* Bouton Right */}
        <RotationButton
          label="→"
          position={[10, 0, 0]} // Position ajustée pour être autour du cube
          onClick={rotateRight}
        />
      </group>
    </Canvas>
  );
};

export default Home;