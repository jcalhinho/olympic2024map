

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
  const dataBrickIndices = [0.5,4, 7.5, 10.5];

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

      const { y } = letterRef.translation();

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
          ref.setLinvel({ x: 0, y: 12, z: -9 }, true);
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
            mass={10}
            position={dl.position}
            userData={{ type: 'dataLetter', letter: dl.letter }}
          >
            <mesh castShadow receiveShadow>
              <textGeometry
                args={[dl.letter, { font, size: 9, depth: 8.2 }]}
              />
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
      })}
    </group>
  );
};

export default WallOfBricks;