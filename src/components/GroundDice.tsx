


// src/components/GroundDice.tsx
import React, { useRef, useMemo } from 'react';
import { RigidBody } from '@react-three/rapier';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { extend, Object3DNode, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import myfont from '../../public/fonts/helvetiker_regular.typeface.json';
import FloatingLetters from './FloatingLetters';
import { RoundedBox } from '@react-three/drei';

interface GroundDiceProps {
  targetRotation: THREE.Euler;
  onBrickDestroyed: (brickId: string) => void;
  onLetterFallen: (letter: string) => void;
  sizeZ: number; // Nouvelle prop pour la taille sur l'axe z
}

interface UserData {
  type: string;
  id?: string;
  letter?: string;
}

extend({ TextGeometry });

declare module '@react-three/fiber' {
  interface ThreeElements {
    textGeometry: Object3DNode<TextGeometry, typeof TextGeometry>;
  }
}

// const GroundDice: React.FC<GroundDiceProps> = ({ targetRotation, onBrickDestroyed, onLetterFallen, sizeZ }) => {
//   const groundRef = useRef<RigidBody>(null);
//   const currentRotation = useRef(new THREE.Euler(0, 0, 0, 'XYZ'));

//   useFrame(() => {
//     if (groundRef.current) {
//       // Interpolation de la rotation actuelle vers la rotation cible
//       currentRotation.current.x += (targetRotation.x - currentRotation.current.x) * 0.1;
//       currentRotation.current.y += (targetRotation.y - currentRotation.current.y) * 0.1;
//       currentRotation.current.z += (targetRotation.z - currentRotation.current.z) * 0.1;

//       // Conversion en quaternion pour Rapier
//       const quaternion = new THREE.Quaternion().setFromEuler(currentRotation.current);
//       groundRef.current.setNextKinematicRotation(quaternion);
//     }
//   });

//   return (
//     <>
//       {/* Sol rotatif */}
//       <RigidBody 
//         ref={groundRef}
//         type="kinematicPosition"
//         colliders="cuboid"
//         restitution={0.1}
//         friction={0.5}
//         position={[0, -5, 0]}
//         userData={{ type: 'ground' }}
//       >
//         <RoundedBox args={[52, 8, sizeZ]} radius={0.5} smoothness={4} castShadow receiveShadow>
//           <meshStandardMaterial color="lightblue" />
//         </RoundedBox>
//       </RigidBody>

//       {/* Lettres "VISUALISATION" flottantes */}
//       <FloatingLetters
//         letters={['V', 'I', 'S', 'U', 'A', 'L', 'I', 'Z', 'A', 'T', 'I', 'O', 'N']}
//         onBrickDestroyed={onBrickDestroyed}
//         onLetterFallen={onLetterFallen}
//       />
//     </>
//   );
// };

const GroundDice: React.FC<GroundDiceProps> = ({ targetRotation, onBrickDestroyed, onLetterFallen, sizeZ }) => {
  const groundRef = useRef<RigidBody>(null);
  const groundRef2 = useRef<RigidBody>(null);
  const currentRotation = useRef(new THREE.Euler(0, 0, 0, 'XYZ'));

  useFrame(() => {
    if (groundRef.current) {
      // Interpolation de la rotation actuelle vers la rotation cible
      currentRotation.current.x += (targetRotation.x - currentRotation.current.x) * 0.1;
      currentRotation.current.y += (targetRotation.y - currentRotation.current.y) * 0.1;
      currentRotation.current.z += (targetRotation.z - currentRotation.current.z) * 0.1;

      // Conversion en quaternion pour Rapier
      const quaternion = new THREE.Quaternion().setFromEuler(currentRotation.current);
      groundRef.current.setNextKinematicRotation(quaternion);
    }
  });

  return (
    <>
      {/* Sol rotatif */}
      <RigidBody 
        ref={groundRef}
        type="kinematicPosition"
        colliders="cuboid"
        restitution={0.1}
        friction={0.5}
        position={[0, -2, 5]}
        userData={{ type: 'ground' }}
      >
        <RoundedBox args={[52, 8, 8]} radius={0.5} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color="grey" />
        </RoundedBox>
      </RigidBody>
      <RigidBody 
        ref={groundRef2}
        type="fixed"
        colliders="cuboid"
        restitution={0.1}
        friction={0.5}
        position={[0, -5, -45]}
        userData={{ type: 'ground' }}
      >
        <RoundedBox args={[52, 8, 25]} radius={0.5} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color="#458" />
        </RoundedBox>
      </RigidBody>
      {/* Lettres "VISUALISATION" flottantes */}
      <FloatingLetters
        letters={['V', 'I', 'S', 'U', 'A', 'L', 'I', 'Z', 'A', 'T', 'I', 'O', 'N']}
        onBrickDestroyed={onBrickDestroyed}
        onLetterFallen={onLetterFallen}
      />
    </>
  );
};

export default GroundDice;