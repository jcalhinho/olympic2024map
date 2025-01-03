// src/components/AnimatedBall.tsx
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Mesh } from 'three';

interface AnimatedBallProps {
  onReachTarget: () => void; // Fonction à appeler lorsqu'elle atteint la cible
  targetX: number; // Position X cible pour déclencher la rotation
}

const AnimatedBall: React.FC<AnimatedBallProps> = ({ onReachTarget, targetX }) => {
  const rigidBodyRef = useRef<RigidBody>(null);
  const hasReachedTarget = useRef<boolean>(false); // Pour éviter plusieurs déclenchements

  useEffect(() => {
    if (rigidBodyRef.current) {
      // Définir une vitesse initiale avec composantes X et Y
      rigidBodyRef.current.setLinvel({ x: 30, y: 0, z: 0 }, true); // Ajustez les valeurs selon vos besoins
      // Ajuster la restitution pour des rebonds plus réalistes
      //rigidBodyRef.current.setRestitution(0.8, true); // 0.8 est une restitution élevée pour des rebonds visibles
    }
  }, []);

  useFrame(() => {
    if (rigidBodyRef.current && !hasReachedTarget.current) {
      const position = rigidBodyRef.current.translation();

      // Détecter si la balle a atteint ou dépassé la position X cible
      if (position.x >= targetX) {
        hasReachedTarget.current = true;
        onReachTarget(); // Déclencher la fonction rotateUp

        // Optionnel: Réinitialiser la balle après un délai
        setTimeout(() => {
          if (rigidBodyRef.current) {
            rigidBodyRef.current.setTranslation({ x: -30, y: 10, z: 0 }, true); // Remettre la balle à gauche
            rigidBodyRef.current.setLinvel({ x: 5, y: 10, z: 0 }, true); // Réinitialiser la vitesse
            hasReachedTarget.current = false;
          }
        }, 2000); // 2 secondes de délai avant la réinitialisation
      }
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      colliders="ball"
      mass={1}
      position={[-100, 10, 0]} // Position initiale à gauche avec une hauteur pour le rebond
      restitution={0.8} // Coefficient de restitution pour le rebond
      friction={0.5} // Friction pour simuler les pertes énergétiques
    >
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  );
};

export default AnimatedBall;