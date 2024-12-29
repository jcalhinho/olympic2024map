import React, { useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import { MeshProps } from '@react-three/fiber';

interface WallOfBricksProps {
  onBrickDestroyed: (brickId: string) => void;
}

interface BrickProps extends MeshProps {
  position: [number, number, number];
  onBrickDestroyed: (brickId: string) => void;
  brickId: string; 
}

const Brick: React.FC<BrickProps> = ({ position, onBrickDestroyed, brickId }) => {
  const handleCollision = () => {
    onBrickDestroyed(brickId);
    };

  return (
    <RigidBody
      name={`brick-${brickId}`}
      position={position}
      colliders="cuboid"
      restitution={0.1}
      friction={0.5}
      onCollisionEnter={handleCollision}
      type="fixed"
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 1, 1]} />
        <meshStandardMaterial color="brown" />
      </mesh>
    </RigidBody>
  );
};

const WallOfBricks: React.FC<WallOfBricksProps> = ({ onBrickDestroyed }) => {
  const brickCountX = 15; // Nombre de briques horizontalement
  const brickCountY = 13; // Nombre de briques verticalement
  const brickSpacing = 2.5; // Espacement entre les briques
  const brickZPosition = 0; // Position sur l'axe Z pour placer les briques à z=0

  const [activeBricks, setActiveBricks] = useState<string[]>(() => {
    const bricks = [];
    for (let y = 0; y < brickCountY; y++) {
      for (let x = 0; x < brickCountX; x++) {
        bricks.push(`${x}-${y}`);
      }
    }
    return bricks;
  });

  const handleBrickDestroyedInternal = (brickId: string) => {
    setActiveBricks((prev) => prev.filter((id) => id !== brickId));
    onBrickDestroyed(brickId);
  };

  const bricks = activeBricks.map((brickId) => {
    const [x, y] = brickId.split('-').map(Number);
    const position: [number, number, number] = [
      (x - (brickCountX / 2 - 0.5)) * brickSpacing, // Centrage horizontal
      y * 1.5 + 1, // Position verticale ajustée
      brickZPosition, // Positionnement à z=0
    ];
    return (
      <Brick
        key={`brick-${brickId}`}
        brickId={brickId}
        position={position}
        onBrickDestroyed={handleBrickDestroyedInternal}
      />
    );
  });

  return <group position={[0, 0, -20]}>{bricks}</group>;
};

export default WallOfBricks;