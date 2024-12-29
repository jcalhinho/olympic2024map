import React, { useRef,  useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import { RoundedBox } from '@react-three/drei';

import { extend, Object3DNode, ThreeEvent, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useNavigate } from 'react-router-dom';
import WallOfBricks from './WallOfBricks';
import FloatingLetters from './FloatingLetters';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

extend({ TextGeometry });

declare module '@react-three/fiber' {
  interface ThreeElements {
    textGeometry: Object3DNode<TextGeometry, typeof TextGeometry>;
  }
}

export type RigidBodyApi = {
  translation: () => { x: number; y: number; z: number };
  setTranslation: (translation: { x: number; y: number; z: number }, wakeUp?: boolean) => void;
  setLinvel: (linvel: { x: number; y: number; z: number }, wakeUp?: boolean) => void;
  setAngvel: (angvel: { x: number; y: number; z: number }, wakeUp?: boolean) => void;
  setNextKinematicRotation: (rotation: THREE.Quaternion) => void;
};

interface GroundDiceProps {
  targetRotation: THREE.Euler;
}

const GroundDice: React.FC<GroundDiceProps> = ({ targetRotation }) => {
  const cubeRef = useRef<RigidBodyApi | null>(null);
  const currentRotation = useRef(new THREE.Euler(0, 0, 0, 'XYZ'));
  const [letters] = useState<string[]>(['D', 'A', 'T', 'A', 'V', 'I', 'Z']);
  const [bricks, setBricks] = useState<string[]>([]);
  const navigate = useNavigate();

  
  // Fonction pour gérer la destruction d'une brique
  const handleBrickDestroyed = (id: string) => {
    setBricks((prev) => prev.filter((brickId) => brickId !== id));
    console.log(bricks)
  };

  // Interpoler la rotation du cube
  useFrame(() => {
    if (cubeRef.current) {
      currentRotation.current.x += (targetRotation.x - currentRotation.current.x) * 0.10;
      currentRotation.current.y += (targetRotation.y - currentRotation.current.y) * 0.10;
      currentRotation.current.z += (targetRotation.z - currentRotation.current.z) * 0.10;

      const quaternion = new THREE.Quaternion().setFromEuler(currentRotation.current);
      cubeRef.current.setNextKinematicRotation(quaternion);
    }
  });

  // Gestion des clics sur le cube
  const handleCubeClick = (event: ThreeEvent<MouseEvent>) => {
    const faceNormal = event.face?.normal;
    let face = '';

    if (faceNormal?.x === 1) face = 'right';
    else if (faceNormal?.x === -1) face = 'left';
    else if (faceNormal?.y === 1) face = 'top';
    else if (faceNormal?.y === -1) face = 'bottom';
    else if (faceNormal?.z === 1) face = 'front';
    else if (faceNormal?.z === -1) face = 'back';

    switch (face) {
      case 'front':
        navigate('/projects/sankey3d');
        break;
      case 'back':
        navigate('/projects/piechart');
        break;
      case 'left':
        navigate('/projects/bargraph');
        break;
      case 'right':
        navigate('/projects/another-route');
        break;
      case 'top':
        navigate('/projects/top-route');
        break;
      case 'bottom':
        navigate('/projects/bottom-route');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <>
     
      <RigidBody
        ref={(ref) => {
          if (ref && !cubeRef.current) {
            cubeRef.current = ref as unknown as RigidBodyApi;
          }
        }}
        type="kinematicPosition"
        colliders="cuboid"
        friction={0.5}
        position={[0, 0, 0]}
      >
        <RoundedBox
          args={[10, 10, 10]}
          radius={0.5}
          smoothness={4}
          castShadow
          receiveShadow
          onClick={handleCubeClick}
        >
          <meshStandardMaterial color="lightblue" />
        </RoundedBox>
      </RigidBody>

      {/* Mur de briques */}
      <WallOfBricks onBrickDestroyed={handleBrickDestroyed} />

      {/* Lettres flottantes */}
      <FloatingLetters letters={letters} onBrickDestroyed={handleBrickDestroyed} />
    </>
  );
};

export default GroundDice;