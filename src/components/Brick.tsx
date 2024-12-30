// src/components/Brick.tsx
import React, { useState } from 'react';
import { RigidBody, CollisionEnterEvent } from '@react-three/rapier';
import { RoundedBox } from '@react-three/drei';

interface BrickProps {
  position: [number, number, number];
  onDestroyed: (brickId: string) => void;
  brickId: string;
}

const Brick: React.FC<BrickProps> = ({ position, onDestroyed, brickId }) => {
  const [isDestroyed, setIsDestroyed] = useState(false);

  const handleCollision = (event: CollisionEnterEvent) => {
    const otherBody = event.other.rigidBody;
    const userData = otherBody?.userData as { type: string } | undefined;

    // Ignorer les collisions avec les lettres "DATA"
    if (userData?.type === 'dataLetter') {
      return;
    }

    // Détruire la brique si elle est frappée par une lettre "VISUALISATION"
    if (!isDestroyed && userData?.type === 'visualisationLetter') {
      setIsDestroyed(true);
      setTimeout(() => {
        onDestroyed(brickId);
      }, 300);
    }
  };

  return (
    <RigidBody
      type="fixed"
      colliders="hull"
      restitution={0.1}
      friction={0.5}
      position={position}
      onCollisionEnter={handleCollision}
      userData={{ type: 'brick', id: brickId }} // Ajout des données utilisateur
    >
      {/* <mesh castShadow receiveShadow scale={isDestroyed ? [0, 0, 0] : [3, 1.5, 1.5]}>
        <boxGeometry args={[3, 1.5, 1.5]} />
        <meshStandardMaterial color={isDestroyed ? 'white' : 'grey'} />
      </mesh> */}
      <RoundedBox args={[3, 1.5, 1.5]} radius={0.2} smoothness={2} scale={isDestroyed ? [0, 0, 0] : [1, 2, 1]}>
        <meshStandardMaterial color={isDestroyed ? 'white' : 'grey'} />
      </RoundedBox>
    </RigidBody>
  );
};

export default Brick;