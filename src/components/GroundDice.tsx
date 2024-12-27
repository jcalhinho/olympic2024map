import React, { useRef, useMemo, useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import { RoundedBox } from '@react-three/drei';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { extend, Object3DNode, ThreeEvent, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import myfont from '../../public/fonts/helvetiker_regular.typeface.json';
import { useNavigate } from 'react-router-dom';

// Étendre TextGeometry dans React Three Fiber
extend({ TextGeometry });

// Déclaration pour intégrer TextGeometry dans les éléments Three Fiber
declare module '@react-three/fiber' {
  interface ThreeElements {
    textGeometry: Object3DNode<TextGeometry, typeof TextGeometry>;
  }
}

// Définir le type RigidBodyApi localement
type RigidBodyApi = {
  translation: () => { x: number; y: number; z: number };
  setTranslation: (translation: { x: number; y: number; z: number }, wakeUp?: boolean) => void;
  setLinvel: (linvel: { x: number; y: number; z: number }, wakeUp?: boolean) => void;
  setAngvel: (angvel: { x: number; y: number; z: number }, wakeUp?: boolean) => void;
  setNextKinematicRotation: (rotation: THREE.Quaternion) => void;
  // Ajoutez d'autres méthodes si nécessaire
};

interface GroundDiceProps {
  targetRotation: THREE.Euler; // Rotation cible passée depuis App.tsx
}

const GroundDice: React.FC<GroundDiceProps> = ({ targetRotation }) => {
  // Utiliser RigidBodyApi comme type pour les refs
  const cubeRef = useRef<RigidBodyApi | null>(null);
  const lettersRefs = useRef<RigidBodyApi[]>([]);
  const currentRotation = useRef(new THREE.Euler(0, 0, 0, 'XYZ'));

  const [letters] = useState<string[]>(['D', 'A', 'T', 'A', 'V', 'I', 'Z']);
  
  // Charger et parser la police une seule fois
  const font = useMemo(() => new FontLoader().parse(myfont), []);

  const navigate = useNavigate(); // Hook pour la navigation

  // const resetLetter = (index: number) => {
  //   // Fonction de réinitialisation si nécessaire
  //   // (Actuellement, elle ne modifie pas l'état)
  // };

  useFrame(() => {
    lettersRefs.current.forEach((letterRef, index) => {
      // Utiliser Type Assertion pour accéder aux méthodes de RigidBodyApi
      const rbApi = letterRef as unknown as RigidBodyApi;
      const position = rbApi.translation();
      if (position.y < -100) { // Seuil de réinitialisation
        rbApi.setTranslation({ x: (index - 4) * 0.90, y: 20, z: 0 }, true);
        rbApi.setLinvel({ x: 0, y: 0, z: 0 }, true);
        rbApi.setAngvel({ x: 0, y: 0, z: 0 }, true);
      }
    });
  });

  // Appliquer la rotation cible au cube de manière fluide
  useFrame(() => {
    if (cubeRef.current) {
      // Interpoler progressivement vers la rotation cible
      currentRotation.current.x += (targetRotation.x - currentRotation.current.x) * 0.10;
      currentRotation.current.y += (targetRotation.y - currentRotation.current.y) * 0.10;
      currentRotation.current.z += (targetRotation.z - currentRotation.current.z) * 0.10;

      const quaternion = new THREE.Quaternion().setFromEuler(currentRotation.current);
      
      // Utiliser Type Assertion pour accéder à la méthode de RigidBodyApi
      const rbApi = cubeRef.current as unknown as {
        setNextKinematicRotation: (rotation: THREE.Quaternion) => void;
      };
      
      rbApi.setNextKinematicRotation(quaternion);
    }
  });

  // Fonction pour créer une lettre
  const createLetter = (
    text: string,
    position: [number, number, number],
    rotation: [number, number, number],
    key: string
  ) => {
    return (
      <RigidBody
        colliders="hull" // Colliders adaptés à la forme du texte
        restitution={0} // Réglage du rebond
        friction={0.5} // Réglage de la friction pour ralentir les glissements
        mass={0.2}
        position={position}
        rotation={rotation}
        key={key}
        ref={(ref) => {
          if (ref && !lettersRefs.current.includes(ref as unknown as RigidBodyApi)) {
            lettersRefs.current.push(ref as unknown as RigidBodyApi); // Ajouter la référence des lettres
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

  // Fonction pour gérer le clic sur une face du cube
  const handleCubeClick = (event: ThreeEvent<MouseEvent>) => {
    const faceNormal = event.face?.normal;
    let face = '';

    // Déterminer quelle face a été cliquée en fonction de la normale
    if (faceNormal?.x === 1) face = 'right';
    else if (faceNormal?.x === -1) face = 'left';
    else if (faceNormal?.y === 1) face = 'top';
    else if (faceNormal?.y === -1) face = 'bottom';
    else if (faceNormal?.z === 1) face = 'front';
    else if (faceNormal?.z === -1) face = 'back';

    // Naviguer en fonction de la face cliquée
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
        navigate('/projects/another-route'); // Ajoutez d'autres routes si nécessaire
        break;
      case 'top':
        navigate('/projects/top-route'); // Ajoutez d'autres routes si nécessaire
        break;
      case 'bottom':
        navigate('/projects/bottom-route'); // Ajoutez d'autres routes si nécessaire
        break;
      default:
        navigate('/');
    }
  };

  return (
    <group>
      {/* Cube */}
      <RigidBody
        ref={(ref) => {
          if (ref && !cubeRef.current) {
            cubeRef.current = ref as unknown as RigidBodyApi;
          }
        }}
        type="kinematicPosition" // Rotation contrôlée manuellement
        colliders="cuboid"
        friction={0.5}
        position={[0, 0, 0]} // Centre du cube
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

      {/* Lettres */}
      <group>
        {letters.map((letter, index) =>
          createLetter(letter, [(index - 4) * 0.90, 20, 0], [0, 0, 0], `${letter}-${index}`)
        )}
      </group>
    </group>
  );
};

export default GroundDice;