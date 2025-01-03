

import React, { useRef, useMemo } from 'react';
import { RigidBody, CollisionEnterEvent } from '@react-three/rapier';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import myfont from '../../public/fonts/helvetiker_regular.typeface.json';

interface FloatingLettersProps {
  letters: string[];
  onBrickDestroyed: (brickId: string) => void;
  onLetterFallen: (letter: string) => void;
}

interface UserData {
  type: string;
  id?: string;
  letter?: string;
}

const FloatingLetters: React.FC<FloatingLettersProps> = ({ letters, onBrickDestroyed, onLetterFallen }) => {
  const lettersRefs = useRef<(RigidBody | null)[]>([]);
  const font = useMemo(() => new FontLoader().parse(myfont), []);

  // Positions et rotations initiales des lettres
  const initialLettersState = useMemo(() => {
    return letters.map((letter, index) => ({
      position: [(index - Math.floor(letters.length / 2)) * 4-1, 5,6] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
    }));
  }, [letters]);

  // Positions initiales des lettres
  const initialPositions = initialLettersState.map(state => state.position);
  const initialRotations = initialLettersState.map(state => state.rotation);

  // Réinitialiser les lettres si elles tombent trop bas
  useFrame(() => {
    lettersRefs.current.forEach((letterRef, index) => {
      if (letterRef) {
        const position = letterRef.translation();
        if (position.y < -10) { // Limite de réinitialisation
          const [x, y, z] = initialPositions[index];
          const [rotX, rotY, rotZ] = initialRotations[index];

          // Réinitialiser la position
          letterRef.setTranslation({ x, y, z }, true);

          // Réinitialiser la vélocité linéaire et angulaire
          letterRef.setLinvel({ x: 0, y: 0, z: 0 }, true);
          letterRef.setAngvel({ x: 0, y: 0, z: 0 }, true);

          // Réinitialiser la rotation en utilisant des quaternions
          const euler = new THREE.Euler(rotX, rotY, rotZ, 'XYZ');
          const quaternion = new THREE.Quaternion().setFromEuler(euler);
          letterRef.setRotation(quaternion, true);
        }
      }
    });
  });

  // Gestion des collisions avec les briques
  const handleCollision = (letterId: string) => (event: CollisionEnterEvent) => {
    const otherBody = event.other.rigidBody;
    const userData = otherBody?.userData as UserData | undefined;

    if (userData?.type === 'brick') {
      // Détruire la brique
      onBrickDestroyed(userData.id || '');
    }
  };

  // Créer chaque lettre avec l'index
  const createLetter = (
    text: string,
    position: [number, number, number],
    rotation: [number, number, number],
    key: string,
    index: number
  ) => {
    return (
      <RigidBody
        key={`visual-letter-${key}`}
        colliders="cuboid"
        restitution={0} // Pas de rebond
        friction={1} // Friction pour réduire les glissements
        mass={1} // Masse plus importante pour plus de gravité
        gravityScale={2} // Gravité normale (ajuster si besoin)
        position={position}
        rotation={rotation}
        userData={{ type: 'visualisationLetter', id: key }}
        ref={(ref) => {
          if (ref) {
            lettersRefs.current[index] = ref;
          }
        }}
        onCollisionEnter={handleCollision(key)}
      >
        <mesh castShadow receiveShadow>
          <textGeometry args={[text, { font, size: 2.5, depth: 1.3 }]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </RigidBody>
    );
  };

  return (
    <group>
      {letters.map((letter, index) =>
        createLetter(
          letter,
          initialPositions[index],
          initialRotations[index],
          `${letter}-${index}`,
          index // Passage de l'index ici
        )
      )}
    </group>
  );
};

export default FloatingLetters;