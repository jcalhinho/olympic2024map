// src/components/ExplosionParticles.tsx
import React, { useMemo } from 'react';
import { Vector3 } from '@react-three/fiber';

interface ExplosionParticlesProps {
  position: [number, number, number];
}

const ExplosionParticles: React.FC<ExplosionParticlesProps> = ({ position }) => {
  // Générer un petit nuage de particules
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 20; i++) {
      temp.push({
        x: position[0] + (Math.random() - 0.4) * 2, // éparpillées autour de la brique
        y: position[1] + (Math.random() - 0.3) * 3,
        z: position[2] + (Math.random() - 0.2) * 4,
        color: 'grey',
      });
    }
    return temp;
  }, [position]);

  return (
    <group>
      {particles.map((p, idx) => (
        <mesh key={idx} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color={"grey"} />
        </mesh>
      ))}
    </group>
  );
};

export default ExplosionParticles;