
// // src/components/WallOfBricks.tsx
// import React, { useState, useMemo, useEffect, useRef } from 'react';
// import { RigidBody } from '@react-three/rapier';
// import { Euler, Vector3 } from '@react-three/fiber';
// import Brick from './Brick';
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
// import myfont from '../../public/fonts/helvetiker_regular.typeface.json';
// import { CustomRigidBodyApi } from './FloatingLetters';

// interface WallOfBricksProps {
//   onBrickDestroyed: (brickId: string) => void;
//   onLetterFallen: (letter: string) => void;
//   position: Vector3;
//   rotation: Euler;
//   bricksShouldFall: boolean; // Nouvelle prop pour déclencher la chute des briques
// }

// interface DataLetter {
//   letter: string;
//   brickId: string;
//   position: [number, number, number];
//   isFalling: boolean;
// }

// const WallOfBricks: React.FC<WallOfBricksProps> = ({ onBrickDestroyed, onLetterFallen, position, rotation, bricksShouldFall }) => {
//   // Paramètres de la grille de briques
//   const brickCountX = 14; // Nombre de briques horizontalement
//   const brickCountY = 6; // Nombre de briques verticalement
//   const brickSpacingX = 3; // Espacement horizontal
//   const brickSpacingY = 2.5; // Espacement vertical

//   // Initialisation des briques
//   const [activeBricks, setActiveBricks] = useState<string[]>(() => {
//     const bricks: string[] = [];
//     for (let y = 0; y < brickCountY; y++) {
//       for (let x = 0; x < brickCountX; x++) {
//         bricks.push(`${x}-${y}`);
//       }
//     }
//     return bricks;
//   });
//   const dataLettersRefs = useRef<CustomRigidBodyApi[]>([]);
//   // Définir les briques qui supportent les lettres "DATA"
//   const dataLetters = ['D', 'A', 'T', 'A'];
//   const dataBrickIndices = [0.5,4 ,7, 9]; // Indices X des briques pour "D", "A", "T", "A"
 
//   // Initialisation des lettres "DATA"
//   const [dataLettersState, setDataLettersState] = useState<DataLetter[]>(() => {
//     const letters: DataLetter[] = dataLetters.map((letter, idx) => {
//       const x = dataBrickIndices[idx];
//       const y = brickCountY - 1; // Dernière rangée
//       const brickId = `${x}-${y}`;
//       const brickPosition: [number, number, number] = [
//         (x - (brickCountX / 2 )) * brickSpacingX,
//         y * brickSpacingY + 1,
//         -4,
//       ];
//       return {
//         letter,
//         brickId,
//         position: [brickPosition[0], brickPosition[1] + 3, brickPosition[2]], // Position ajustée au-dessus de la brique
//         isFalling: false,
//       };
//     });
//     return letters;
//   });

//   // Charger la police de caractères
//   const font = useMemo(() => new FontLoader().parse(myfont), []);

//   // Gestion de la destruction d'une brique
//   const handleBrickDestroyedInternal = (brickId: string) => {
//     setActiveBricks((prev) => prev.filter((id) => id !== brickId));
//     onBrickDestroyed(brickId);

//     // Vérifier si la brique supporte une lettre "DATA"
//     const dataLetter = dataLettersState.find(dl => dl.brickId === brickId);
//     if (dataLetter) {
//       // Faire tomber la lettre "DATA"
//       setDataLettersState((prev) =>
//         prev.map(dl => dl.brickId === brickId ? { ...dl, isFalling: true } : dl)
//       );

//       // Notifier que la lettre "DATA" est tombée
//       onLetterFallen(dataLetter.letter);
//     }
//   };

  
//  useEffect(() => {
//     if (bricksShouldFall) {
//       dataLettersRefs.current.forEach((rigidBody) => {
//         if (rigidBody) {
//           // Option 1: Définir la vitesse linéaire directement
//           rigidBody.setLinvel({ x: 0, y: 15, z: -7 }, true);

//           // Option 2: Appliquer une impulsion pour un mouvement plus naturel
//           // rigidBody.applyImpulse({ x: 0, y: 0, z: -10 }, true);
//         }
//       });
//     }
//   }, [bricksShouldFall]);
//   return (
//     <group position={position} rotation={rotation}>
//       {/* Rendu des briques */}
//       {activeBricks.map((brickId) => {
//         const [x, y] = brickId.split('-').map(Number);
//         const brickPosition: [number, number, number] = [
//           (x - (brickCountX / 2 - 0.5)) * brickSpacingX,
//           y * brickSpacingY + 1,
//           0,
//         ];

//         return (
//           <Brick
//             key={`brick-${brickId}`}
//             brickId={brickId}
//             position={brickPosition}
//             onDestroyed={handleBrickDestroyedInternal}
//             shouldFall={bricksShouldFall} // Passer la prop pour déclencher la chute
//           />
//         );
//       })}

//       {/* Rendu des lettres "DATA" */}
//       {dataLettersState.map((dataLetter, idx) => (
//         <RigidBody
//           key={`data-letter-${idx}`}
//           type={"dynamic"} // Définir le type en fonction de isFalling
//           colliders="cuboid" // Utiliser des colliders cuboid pour une meilleure détection
//           restitution={0}
//           friction={0}
//           mass={3}
//           position={dataLetter.position}
//           userData={{ type: 'dataLetter', letter: dataLetter.letter }}
//           ref={(ref) => {
//             if (ref) {
//               dataLettersRefs.current[idx] = ref;
//             }
//           }}
//         >
//           <mesh castShadow receiveShadow>
//             <textGeometry args={[dataLetter.letter, { font, size: 13, depth: bricksShouldFall ? 8.2 :8.2  }]} />
//             <meshStandardMaterial color="white" />
//           </mesh>
//         </RigidBody>
//       ))}
//     </group>
//   );
// };

// export default WallOfBricks;

// src/components/WallOfBricks.tsx
import React, { useState, useRef, useMemo } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Euler, Vector3, useFrame } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import myfont from '../../public/fonts/helvetiker_regular.typeface.json';
import Brick from './Brick';
import * as THREE from 'three';

export interface CustomRigidBodyApi  {
  translation: () => { x: number; y: number; z: number };
  setLinvel(arg0: { x: number; y: number; z: number }, wakeUp: boolean): void;
  setAngvel(arg0: { x: number; y: number; z: number }, wakeUp: boolean): void;
  setTranslation(arg0: { x: number; y: number; z: number }, wakeUp: boolean): void;
  setRotation(arg0: THREE.Quaternion, wakeUp: boolean): void;
  wakeUp?: () => void;
}

interface WallOfBricksProps {
  onBrickDestroyed: (brickId: string) => void;
  onLetterFallen: (letter: string) => void;
  position: Vector3;
  rotation: Euler;
  bricksShouldFall: boolean;
}

interface DataLetter {
  letter: string;
  brickId: string;
  // Position initiale
  position: [number, number, number];
  // On stocke la même position comme "initialPosition" pour la réinit
  initialPosition: [number, number, number];
}

const WallOfBricks: React.FC<WallOfBricksProps> = ({
  onBrickDestroyed,
  onLetterFallen,
  position,
  rotation,
  bricksShouldFall,
}) => {
  const brickCountX = 14;
  const brickCountY = 6;
  const brickSpacingX = 3;
  const brickSpacingY = 2.5;

  // --- 1) Briques actives ---
  const [activeBricks, setActiveBricks] = useState<string[]>(() => {
    const bricks: string[] = [];
    for (let y = 0; y < brickCountY; y++) {
      for (let x = 0; x < brickCountX; x++) {
        bricks.push(`${x}-${y}`);
      }
    }
    return bricks;
  });

  // --- 2) Lettres DATA ---
  const dataLetters = ['D', 'A', 'T', 'A'];
  // Indices X des colonnes sur lesquelles sont posées les lettres
  // (ajuste selon la configuration de ton mur)
  const dataBrickIndices = [-0.5, 4, 7, 11];

  // Références directes (RigidBody) vers chaque lettre
  const dataLettersRefs = useRef<CustomRigidBodyApi[]>([]);

  // Stocker la position initiale de chaque lettre
  const [dataLettersState] = useState<DataLetter[]>(() => {
    return dataLetters.map((letter, idx) => {
      const x = dataBrickIndices[idx];
      const y = brickCountY - 1;
      const brickId = `${x}-${y}`;

      // On calcule la position 3D initiale
      const px = (x - brickCountX / 2) * brickSpacingX;
      const py = y * brickSpacingY + 4; // un peu plus haut que la brique
      const pz = -4;

      return {
        letter,
        brickId,
        position: [px, py, pz] as [number, number, number],
        initialPosition: [px, py, pz] as [number, number, number],
      };
    });
  });

  // Charger la police 3D
  const font = useMemo(() => new FontLoader().parse(myfont), []);

  // --- 3) Callback quand une brique est détruite ---
  const handleBrickDestroyedInternal = (brickId: string) => {
    setActiveBricks((prev) => prev.filter((id) => id !== brickId));
    onBrickDestroyed(brickId);

    // Vérifier si c'était la brique d'une lettre "DATA"
    // => on signale la chute
    const found = dataLettersState.find((dl) => dl.brickId === brickId);
    if (found) {
      onLetterFallen(found.letter);
    }
  };

  // --- 4) useFrame : réinitialiser les lettres quand elles tombent trop bas ---
  useFrame(() => {
    dataLettersRefs.current.forEach((letterRef, idx) => {
      if (!letterRef) return;

      const { x, y, z } = letterRef.translation();

      // Seuil de reset
      if (y < -15) {
        // Récup la position initiale
        const [initX, initY, initZ] = dataLettersState[idx].initialPosition;

        // Optionnel : si tu veux qu’elles repartent encore plus en arrière, modifie initZ
        // let newZ = initZ - 10; // Par ex. 
        // Ou laisser tel quel
        // Sinon, juste initZ

        // 1) On replace la lettre
        letterRef.setTranslation({ x: initX, y: initY, z: initZ-38 }, true);

        // 2) On remet la vitesse linéaire et angulaire à zéro
        letterRef.setLinvel({ x: 0, y: 0, z: 0 }, true);
        letterRef.setAngvel({ x: 0, y: 0, z: 0 }, true);

        // 3) On réinitialise la rotation si besoin (ex: 0,0,0)
        const euler = new THREE.Euler(0, 0, 0, 'XYZ');
        const quaternion = new THREE.Quaternion().setFromEuler(euler);
        letterRef.setRotation(quaternion, true);

        // 4) On les réveille
        if (letterRef.wakeUp) {
          letterRef.wakeUp();
        }
      }
    });
  });

  // --- 5) Gérer la chute forcée des lettres si bricksShouldFall = true ---
  // (facultatif, selon ta logique)
  React.useEffect(() => {
    if (bricksShouldFall) {
      dataLettersRefs.current.forEach((ref) => {
        if (ref) {
          // On leur donne une vitesse
          ref.setLinvel({ x: 0, y: 10, z: -9 }, true);
          if (ref.wakeUp) {
            ref.wakeUp();
          }
        }
      });
    }
  }, [bricksShouldFall]);

  // --- 6) Rendu ---
  return (
    <group position={position} rotation={rotation}>
      {/* Les briques */}
      {activeBricks.map((brickId) => {
        const [bx, by] = brickId.split('-').map(Number);

        const brickPos: [number, number, number] = [
          (bx - (brickCountX / 2 - 0.5)) * brickSpacingX, // alignement horizontal
          by * brickSpacingY + 1, // alignement vertical
          0,
        ];

        return (
          <Brick
            key={`brick-${brickId}`}
            brickId={brickId}
            position={brickPos}
            onDestroyed={handleBrickDestroyedInternal}
            shouldFall={bricksShouldFall}
          />
        );
      })}

      {/* Lettres DATA */}
      {dataLettersState.map((dl, idx) => {
        return (
          <RigidBody
            key={`data-letter-${idx}`}
            ref={(ref) => {
              if (ref) dataLettersRefs.current[idx] = ref as CustomRigidBodyApi;
            }}
            type="dynamic"
            colliders="cuboid"
            restitution={0}
            friction={0}
            mass={3}
            position={dl.position}
            userData={{ type: 'dataLetter', letter: dl.letter }}
          >
            <mesh castShadow receiveShadow>
              <textGeometry
                args={[dl.letter, { font, size: 13, depth: 8.2 }]}
              />
              <meshStandardMaterial color="white" />
            </mesh>
          </RigidBody>
        );
      })}
    </group>
  );
};

export default WallOfBricks;