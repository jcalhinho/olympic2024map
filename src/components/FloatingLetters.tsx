import React, { useRef, useMemo } from 'react';
import { RigidBody, CollisionEnterPayload } from '@react-three/rapier';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { extend, Object3DNode, useFrame } from '@react-three/fiber';

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import myfont from '../../public/fonts/helvetiker_regular.typeface.json';
import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';

export type RigidBody = RapierRigidBody; // Use the library's type directly

extend({ TextGeometry });

declare module '@react-three/fiber' {
  interface ThreeElements {
    textGeometry: Object3DNode<TextGeometry, typeof TextGeometry>;
  }
}

interface UserData {
  type: string;
  id?: string;
}

interface FloatingLettersProps {
  letters: string[];
  onBrickDestroyed: (id: string) => void;
}

const FloatingLetters: React.FC<FloatingLettersProps> = ({ letters, onBrickDestroyed }) => {
  const lettersRefs = useRef<RapierRigidBody[]>([]);
  const font = useMemo(() => new FontLoader().parse(myfont), []);

  useFrame(() => {
    lettersRefs.current.forEach((letterRef, index) => {
      const position = letterRef.translation();
      if (position.y < -100) {
        letterRef.setTranslation({ x: (index - 4) * 1.1, y: 20, z: 0 }, true);
        letterRef.setLinvel({ x: 0, y: 0, z: 0 }, true);
        letterRef.setAngvel({ x: 0, y: 0, z: 0 }, true);
      }
    });
  });

  const createLetter = (
    text: string,
    position: [number, number, number],
    rotation: [number, number, number],
    key: string
  ) => {
    const handleCollision = (id: string) => (event: CollisionEnterPayload) => {
      const otherRigidBody = event.other.rigidBody;

      if (!otherRigidBody) return;

      const otherData = otherRigidBody.userData as UserData | undefined;

      if (otherData?.type === "brick") {
        onBrickDestroyed(id);
      }
    };

    return (
      <RigidBody
        name={`letter-${key}`}
        key={`letter-${key}`}
        colliders="hull"
        restitution={0.5}
        friction={0.5}
        mass={0.2}
        position={position}
        rotation={rotation}
        onCollisionEnter={handleCollision(key)}
        ref={(ref) => {
          if (ref && !lettersRefs.current.includes(ref)) {
            lettersRefs.current.push(ref);
          }
        }}
      >
        <mesh castShadow>
          <textGeometry args={[text, { font, size: 1.2, depth: 0.2 }]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </RigidBody>
    );
  };

  return (
    <group>
      {letters.map((letter, index) =>
        createLetter(
          letter,
          [(index - 3) * 1.1, 15, 0],
          [0, 0, 0],
          `${letter}-${index}`
        )
      )}
    </group>
  );
};

export default FloatingLetters;