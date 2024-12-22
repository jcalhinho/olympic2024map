

// import React, { useRef, useMemo, useEffect, useState } from 'react';
// import { RigidBody, RigidBodyApi } from '@react-three/rapier';
// import { RoundedBox } from '@react-three/drei';
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
// import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
// import * as THREE from 'three';
// import myfont from '../../public/fonts/helvetiker_regular.typeface.json';
// import { extend, Object3DNode, useFrame } from '@react-three/fiber';

// // Étendre TextGeometry dans React Three Fiber
// extend({ TextGeometry });

// // Déclaration pour intégrer TextGeometry dans les éléments Three Fiber
// declare module '@react-three/fiber' {
//   interface ThreeElements {
//     textGeometry: Object3DNode<TextGeometry, typeof TextGeometry>;
//   }
// }

// interface GroundDiceProps {
//   targetRotation: THREE.Euler; // Rotation cible passée depuis App.tsx
// }

// const GroundDice: React.FC<GroundDiceProps> = ({ targetRotation }) => {
//   const cubeRef = useRef<RigidBodyApi | null>(null);
//   const lettersRefs = useRef<RigidBodyApi[]>([]);
//   const currentRotation = useRef(new THREE.Euler(0, 0, 0, 'XYZ'));
 
//   const [letters, setLetters] = useState<string[]>(['D', 'A', 'T', 'A', 'V', ' I', 'Z']);
//   // Charger et parser la police une seule fois
//   const font = useMemo(() => new FontLoader().parse(myfont), []);

//   const resetLetter = (index: number) => {
//     setLetters((prevLetters) => {
//       const newLetters = [...prevLetters];
//       newLetters[index] = newLetters[index]; // Maintenir le même texte
//       return newLetters;
//     });
//   };
//   useFrame(() => {
//     lettersRefs.current.forEach((letterRef, index) => {
//       const position = letterRef.translation();
//       if (position.y < -100) { // Seuil de réinitialisation
//         letterRef.setTranslation({ x: (index - 4) * 0.90, y: 20, z: 0 }, true);
//         letterRef.setLinvel({ x: 0, y: 0, z: 0 }, true);
//         letterRef.setAngvel({ x: 0, y: 0, z: 0 }, true);
//       }
//     });
//   });
//   // Appliquer la rotation cible au cube de manière fluide
//   useFrame(() => {
//     if (cubeRef.current) {
//       // Interpoler progressivement vers la rotation cible
//       currentRotation.current.x += (targetRotation.x - currentRotation.current.x) * 0.10;
//       currentRotation.current.y += (targetRotation.y - currentRotation.current.y) * 0.10;
//       currentRotation.current.z += (targetRotation.z - currentRotation.current.z) * 0.10;

//       const quaternion = new THREE.Quaternion().setFromEuler(currentRotation.current);
//       cubeRef.current.setNextKinematicRotation(quaternion);
//     }
//   });

//   // Fonction pour créer une lettre
//   const createLetter = (
//     text: string,
//     position: [number, number, number],
//     rotation: [number, number, number],
//     key: string
//   ) => {
//     return (
//       <RigidBody
//         colliders="hull" // Colliders adaptés à la forme du texte
//         restitution={0.2} // Réglage du rebond
//         friction={0.5} // Réglage de la friction pour ralentir les glissements
//         mass={2}
//         position={position}
//         rotation={rotation}
//         key={key}
//         ref={(ref) => {
//           if (ref && !lettersRefs.current.includes(ref)) {
//             lettersRefs.current.push(ref); // Ajouter la référence des lettres
//           }
//         }}
//       >
//         <mesh castShadow>
//           <textGeometry args={[text, { font, size: 1.2, depth: 0.2 }]} />
//           <meshStandardMaterial color="red" />
//         </mesh>
//       </RigidBody>
//     );
//   };

//   return (
//     <group>
//       {/* Cube */}
//       <RigidBody
//         ref={cubeRef}
//         type="kinematicPosition" // Rotation contrôlée manuellement
//         colliders="cuboid"
//         friction={0.5}
//         position={[0, 0, 0]} // Centre du cube à Y=1 (cube hauteur=2)
//       >
//         <RoundedBox args={[10, 10, 10]} radius={0.5} smoothness={4} castShadow receiveShadow>
//           <meshStandardMaterial color="lightblue" />
//         </RoundedBox>
//       </RigidBody>
//       <group>
//         {letters.map((letter, index) =>
//           createLetter(letter, [(index - 4) * 0.90, 20, 0], [0, 0, 0], `${letter}-${index}`)
//         )}
//       </group>
      
//     </group>
//   );
// };

// export default GroundDice;

// src/components/GroundDice.tsx
import React, { useRef, useMemo, useState } from 'react';
import { RigidBody, RigidBodyApi } from '@react-three/rapier';
import { RoundedBox } from '@react-three/drei';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { extend, Object3DNode, useFrame } from '@react-three/fiber';
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

interface GroundDiceProps {
  targetRotation: THREE.Euler; // Rotation cible passée depuis App.tsx
}

const GroundDice: React.FC<GroundDiceProps> = ({ targetRotation }) => {
  const cubeRef = useRef<RigidBodyApi | null>(null);
  const lettersRefs = useRef<RigidBodyApi[]>([]);
  const currentRotation = useRef(new THREE.Euler(0, 0, 0, 'XYZ'));

  const [letters] = useState<string[]>(['D', 'A', 'T', 'A', 'V', 'I', 'Z']);
  // Charger et parser la police une seule fois
  const font = useMemo(() => new FontLoader().parse(myfont), []);

  const navigate = useNavigate(); // Hook pour la navigation

  const resetLetter = (index: number) => {
    // Fonction de réinitialisation si nécessaire
    // (Actuellement, elle ne modifie pas l'état)
  };

  useFrame(() => {
    lettersRefs.current.forEach((letterRef, index) => {
      const position = letterRef.translation();
      if (position.y < -100) { // Seuil de réinitialisation
        letterRef.setTranslation({ x: (index - 4) * 0.90, y: 20, z: 0 }, true);
        letterRef.setLinvel({ x: 0, y: 0, z: 0 }, true);
        letterRef.setAngvel({ x: 0, y: 0, z: 0 }, true);
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
      cubeRef.current.setNextKinematicRotation(quaternion);
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
          if (ref && !lettersRefs.current.includes(ref)) {
            lettersRefs.current.push(ref); // Ajouter la référence des lettres
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
  const handleCubeClick = (event: any) => {
    const faceNormal = event.face.normal;
    let face = '';

    // Déterminer quelle face a été cliquée en fonction de la normale
    if (faceNormal.x === 1) face = 'right';
    else if (faceNormal.x === -1) face = 'left';
    else if (faceNormal.y === 1) face = 'top';
    else if (faceNormal.y === -1) face = 'bottom';
    else if (faceNormal.z === 1) face = 'front';
    else if (faceNormal.z === -1) face = 'back';

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
        ref={cubeRef}
        type="kinematicPosition" // Rotation contrôlée manuellement
        colliders="cuboid"
        friction={0.5}
        position={[0, 0, 0]} // Centre du cube
      >
        <RoundedBox args={[10, 10, 10]} radius={0.5} smoothness={4} castShadow receiveShadow onClick={handleCubeClick}>
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