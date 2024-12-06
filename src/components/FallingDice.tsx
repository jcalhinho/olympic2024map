// /Users/jcalhinho/Documents/olympic2024map/src/components/FallingDice.tsx
// Ce fichier n'est plus utilisé, mais on le garde inchangé car vous avez demandé de tout fournir.
import React, { useMemo } from 'react';
import { RigidBody } from '@react-three/rapier';
import { RoundedBox } from '@react-three/drei';

const FallingDie: React.FC<{ position: [number, number, number] }> = ({ position }) => {
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
      restitution={0.6}
      friction={0.5}
    >
      <mesh castShadow receiveShadow>
        <RoundedBox args={[5, 5, 5]} radius={0.5} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color="lightblue" />
        </RoundedBox>
      </mesh>
    </RigidBody>
  );
};

export default FallingDie;