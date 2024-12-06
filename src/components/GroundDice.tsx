import React, { useRef } from 'react';
import { RigidBody } from '@react-three/rapier';
import { RoundedBox } from '@react-three/drei';
import { extend, Object3DNode, useFrame } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import * as THREE from 'three';
import myfont from '../../public/fonts/helvetiker_regular.typeface.json';

// Étendre pour utiliser TextGeometry
extend({ TextGeometry });

declare module '@react-three/fiber' {
  interface ThreeElements {
    textGeometry: Object3DNode<TextGeometry, typeof TextGeometry>;
  }
}

type GroundDiceProps = {
  camera?: THREE.Camera;
};

const GroundDice: React.FC<GroundDiceProps> = ({ camera }) => {
  const lettersRef = useRef<THREE.Group>(null);
  const font = new FontLoader().parse(myfont);

  useFrame(() => {
    if (lettersRef.current && camera) {
      const cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection);
      lettersRef.current.rotation.x = cameraDirection.x * 0.5;
      lettersRef.current.rotation.y = cameraDirection.y * 0.5;
    }
  });

  const createLetter = (
    text: string,
    position: [number, number, number],
    rotation: [number, number, number]
  ) => {
    return (
      <RigidBody
        colliders="cuboid"
        restitution={0.1}
        friction={0.5}
        gravityScale={1}
        position={position}
        rotation={rotation}
      
      >
        <mesh>
          <textGeometry args={[text, { font, size: 5, depth: 0.6}]} />
          <meshLambertMaterial color={'#004e92'} />
        </mesh>
      </RigidBody>
    );
  };

  return (
    <group>
      {/* Dé principal */}
      <RigidBody type="fixed" colliders="cuboid" restitution={0.1} friction={0.3}>
        <RoundedBox
          args={[50, 50, 50]}
          radius={2}
          smoothness={2}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#f5f5dc" />
        </RoundedBox>

        {/* Lettres sur le dé */}
        <group ref={lettersRef}>
          {createLetter('D', [-18, 27.5, 0], [0, 0.1, 0])} {/* Face supérieure */}
          {createLetter('A', [-12, 27.5, 0], [0, 0, 0])} {/* Face supérieure */}
          {createLetter('T', [-6, 27.5, 0], [0, 0, 0])} {/* Face supérieure */}
          {createLetter('A', [-1, 27.5, 0], [0, 0, 0])} {/* Face supérieure */}
          {createLetter('V', [5, 27.5, 0], [0, 0, 0])} {/* Face supérieure */}
          {createLetter('I', [12, 27.5, 0], [0, 0, 0])} {/* Face supérieure */}
          {createLetter('Z', [16, 27.5, 0], [0, 0, 0])} {/* Face supérieure */}
        </group>
      </RigidBody>
    </group>
  );
};

export default GroundDice;