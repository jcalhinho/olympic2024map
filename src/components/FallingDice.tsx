
import React, { useMemo } from 'react';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';

// Composant pour un petit dé qui tombe
const FallingDie: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  // Taille du petit dé
  

  // Rotation initiale aléatoire
  const initialRotation = useMemo(() => [
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
  ] as [number, number, number], []);

  return (
    <RigidBody
      colliders="cuboid"
      position={position}
      rotation={initialRotation}
      restitution={0.6} // Rebond légèrement
      friction={0.5}
    >
      <mesh castShadow receiveShadow>
        
        <RoundedBox args={[5, 5, 5]} radius={0.5} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="lightblue" />
      </RoundedBox>{/* Or jaune pour les petits dés */}
      </mesh>
    </RigidBody>
  );
};

export default FallingDie;