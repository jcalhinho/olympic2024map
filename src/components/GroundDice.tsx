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

const GroundDice: React.FC<GroundDiceProps> = ({ targetRotation, onBrickDestroyed, onLetterFallen }) => {
  const groundRef = useRef<RigidBody>(null);
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
        position={[0, -5, 0]}
        userData={{ type: 'ground' }}
      >
        {/* <mesh castShadow receiveShadow >
          <boxGeometry args={[50, 10, 10]} />
          <meshStandardMaterial color="transparent" />
        </mesh> */}
        <RoundedBox args={[52, 8, 10]} radius={0.5} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="lightblue" />
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