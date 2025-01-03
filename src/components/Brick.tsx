// src/components/Brick.tsx
import React, {  useState } from 'react';
import { RigidBody } from '@react-three/rapier'; // Import correct sans RigidBodyApi
import { RoundedBox } from '@react-three/drei';

interface BrickProps {
  position: [number, number, number];
  onDestroyed: (brickId: string) => void;
  brickId: string;
  shouldFall: boolean; // Indique si la brique doit tomber
}

const Brick: React.FC<BrickProps> = ({ position, onDestroyed, brickId, shouldFall }) => {
  const [isDestroyed, setIsDestroyed] = useState(false);

  const handleCollision = (event) => {
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
      }, 50);
    }
  };

  return (
    <RigidBody
      key={`${brickId}-${shouldFall ? 'dynamic' : 'fixed'}`} // Clé unique pour forcer le remount
      type={shouldFall ? 'dynamic' : 'fixed'} // Définir le type en fonction de shouldFall
      colliders="cuboid"
      restitution={0.1}
      friction={0.5}
      mass={6}
      position={position}
      onCollisionEnter={handleCollision}
      userData={{ type: 'brick', id: brickId }}
    >
      <RoundedBox args={[3, 2.5, 8.5]} radius={0.2} smoothness={2} scale={isDestroyed ? [0, 0, 0] : [1, 1, 1]}>
        <meshStandardMaterial color={isDestroyed ? 'white' : 'grey'} />
      </RoundedBox>
    </RigidBody>
  );
};

export default Brick;