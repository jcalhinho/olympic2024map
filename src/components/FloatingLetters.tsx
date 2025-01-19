

import React, { useRef, useMemo } from 'react';
import { RigidBody } from '@react-three/rapier';

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import myfont from '../../public/fonts/helvetiker_regular.typeface.json';
import { Vector } from '@dimforge/rapier3d';

interface FloatingLettersProps {
  letters: string[];
 // onBrickDestroyed: (brickId: string) => void;
 // onLetterFallen: (letter: string) => void;
}

export interface UserData {
  type: string;
  id?: string;
  letter?: string;
}
export interface CustomRigidBodyApi {
  setNextKinematicRotation(quaternion: THREE.Quaternion): unknown;
  setTranslation: (tra: Vector, wakeUp: boolean) => void;
  setLinvel: (velocity: Vector, wakeUp: boolean) => void;
  setAngvel: (angularVelocity: Vector, wakeUp: boolean) => void;
  setRotation: (quaternion: THREE.Quaternion, wakeUp: boolean) => void;
  translation: () => Vector;
  // Ajoutez d'autres méthodes si nécessaire
}
const FloatingLetters: React.FC<FloatingLettersProps> = ({ letters }) => {
  const lettersRefs: React.MutableRefObject<(CustomRigidBodyApi | null)[]> = useRef<(CustomRigidBodyApi | null)[]>([]);
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
  const handleCollision = (event: any) => {
    const otherBody = event.other.rigidBody;
    if (otherBody) {
      const userData = otherBody.userData as UserData | undefined;
  
      if (userData?.type === 'brick') {
       // onBrickDestroyed(userData.id || '');
      }
      // Cas 2: Touche l'écran invisible
      else if (userData?.type === 'invisibleScreen') {
    null
      
      }
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
        mass={6} // Masse plus importante pour plus de gravité
        gravityScale={2} // Gravité normale (ajuster si besoin)
        position={position}
        rotation={rotation}
        userData={{ type: 'visualisationLetter', id: key }}
        ref={(ref ) => {
          if (ref) {
            lettersRefs.current[index]  = ref;
          }
        }}
        onCollisionEnter={handleCollision}
      >
        <mesh castShadow receiveShadow>
          <textGeometry args={[text, { font, size: 2.5, depth: 1.3 }]} />
          <meshPhysicalMaterial
              color="lightgrey" // Bleu avec opacité
              //transparent
              opacity={1}
              transmission={1} // Pour une transparence complète
              roughness={0} // Surface très lisse
              metalness={0.1} // Augmenter pour plus de réflexions
              ior={1.5} // Indice de réfraction typique du verre
              reflectivity={0.4} // Augmenter pour des réflexions plus prononcées
              thickness={1} // Épaisseur du matériau
              envMapIntensity={1} // Intensité des réflexions de l'environnement
            
            />
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

