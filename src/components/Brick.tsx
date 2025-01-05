

// src/components/Brick.tsx
import React, { useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import { RoundedBox } from '@react-three/drei';
import { CollisionEnterPayload } from '@react-three/rapier';
import ExplosionParticles from './ExplosionParticles'; // <-- Import de l'explosion

interface BrickProps {
  position: [number, number, number];
  onDestroyed: (brickId: string) => void;
  brickId: string;
  shouldFall: boolean;
}

const Brick: React.FC<BrickProps> = ({ position, onDestroyed, brickId, shouldFall }) => {
  const [isDestroyed, setIsDestroyed] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  const handleCollision = (event: CollisionEnterPayload) => {
    const otherBody = event.other.rigidBody;
    const userData = otherBody?.userData as { type: string } | undefined;

    // Ignorer les collisions avec les lettres "DATA" pour éviter de les détruire
    if (userData?.type === 'dataLetter') return;

    // Si la brique est frappée par "VISUALISATION", on la détruit
    if (!isDestroyed && userData?.type === 'visualisationLetter') {
      setIsDestroyed(true);
      setShowParticles(true);

      // Après un petit délai, on signale la destruction (enlève la brique du mur)
      setTimeout(() => {
        onDestroyed(brickId);
      }, 300);

      // Puis on cache les particules
      setTimeout(() => {
        setShowParticles(false);
      }, 1500);
    }
  };

  return (
    <>
      {!isDestroyed && (
        <RigidBody
          key={`${brickId}-${shouldFall ? 'dynamic' : 'fixed'}`} 
          type={shouldFall ? 'dynamic' : 'fixed'}
          colliders="cuboid"
          restitution={0.1}
          friction={0.5}
          mass={6}
          position={position}
          onCollisionEnter={handleCollision}
          userData={{ type: 'brick', id: brickId }}
        >
          <RoundedBox
            args={[3, 2.5, 8.5]}
            radius={0.2}
            smoothness={2}
          >
            <meshPhysicalMaterial
              color="rgba(5, 123, 227, 0.5)" // Bleu avec opacité
              transparent
              opacity={0.6}
              transmission={1} // Pour une transparence complète
              roughness={0} // Surface très lisse
              metalness={0.1} // Augmenter pour plus de réflexions
              ior={1.5} // Indice de réfraction typique du verre
              reflectivity={0.4} // Augmenter pour des réflexions plus prononcées
              thickness={1} // Épaisseur du matériau
              envMapIntensity={1} // Intensité des réflexions de l'environnement
            
            />
          </RoundedBox>
        </RigidBody>
      )}

      {/* Particules affichées là où se trouvait la brique */}
      {showParticles && <ExplosionParticles position={position} />}
    </>
  );
};

export default Brick;