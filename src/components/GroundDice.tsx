import React from 'react';
import { RigidBody } from '@react-three/rapier';
import { RoundedBox } from '@react-three/drei';

const GroundDie: React.FC = () => {
  const dieSize = 50;

  return (
    <RigidBody type="fixed" colliders="cuboid" restitution={0.1} friction={0.3}>
      <RoundedBox args={[dieSize, dieSize, dieSize]} radius={2} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#f5f5dc" /> {/* Blanc crème */}
      </RoundedBox>
    </RigidBody>
  );
};

export default GroundDie;