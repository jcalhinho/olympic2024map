
// src/components/WallOfBricks.tsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Euler, Vector3 } from '@react-three/fiber';
import Brick from './Brick';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import myfont from '../../public/fonts/helvetiker_regular.typeface.json';
import { CustomRigidBodyApi } from './FloatingLetters';

interface WallOfBricksProps {
  onBrickDestroyed: (brickId: string) => void;
  onLetterFallen: (letter: string) => void;
  position: Vector3;
  rotation: Euler;
  bricksShouldFall: boolean; // Nouvelle prop pour déclencher la chute des briques
}

interface DataLetter {
  letter: string;
  brickId: string;
  position: [number, number, number];
  isFalling: boolean;
}

const WallOfBricks: React.FC<WallOfBricksProps> = ({ onBrickDestroyed, onLetterFallen, position, rotation, bricksShouldFall }) => {
  // Paramètres de la grille de briques
  const brickCountX = 14; // Nombre de briques horizontalement
  const brickCountY = 6; // Nombre de briques verticalement
  const brickSpacingX = 3; // Espacement horizontal
  const brickSpacingY = 2.5; // Espacement vertical

  // Initialisation des briques
  const [activeBricks, setActiveBricks] = useState<string[]>(() => {
    const bricks: string[] = [];
    for (let y = 0; y < brickCountY; y++) {
      for (let x = 0; x < brickCountX; x++) {
        bricks.push(`${x}-${y}`);
      }
    }
    return bricks;
  });
  const dataLettersRefs = useRef<CustomRigidBodyApi[]>([]);
  // Définir les briques qui supportent les lettres "DATA"
  const dataLetters = ['D', 'A', 'T', 'A'];
  const dataBrickIndices = [0.5,4 ,7, 9]; // Indices X des briques pour "D", "A", "T", "A"
 
  // Initialisation des lettres "DATA"
  const [dataLettersState, setDataLettersState] = useState<DataLetter[]>(() => {
    const letters: DataLetter[] = dataLetters.map((letter, idx) => {
      const x = dataBrickIndices[idx];
      const y = brickCountY - 1; // Dernière rangée
      const brickId = `${x}-${y}`;
      const brickPosition: [number, number, number] = [
        (x - (brickCountX / 2 )) * brickSpacingX,
        y * brickSpacingY + 1,
        -4,
      ];
      return {
        letter,
        brickId,
        position: [brickPosition[0], brickPosition[1] + 3, brickPosition[2]], // Position ajustée au-dessus de la brique
        isFalling: false,
      };
    });
    return letters;
  });

  // Charger la police de caractères
  const font = useMemo(() => new FontLoader().parse(myfont), []);

  // Gestion de la destruction d'une brique
  const handleBrickDestroyedInternal = (brickId: string) => {
    setActiveBricks((prev) => prev.filter((id) => id !== brickId));
    onBrickDestroyed(brickId);

    // Vérifier si la brique supporte une lettre "DATA"
    const dataLetter = dataLettersState.find(dl => dl.brickId === brickId);
    if (dataLetter) {
      // Faire tomber la lettre "DATA"
      setDataLettersState((prev) =>
        prev.map(dl => dl.brickId === brickId ? { ...dl, isFalling: true } : dl)
      );

      // Notifier que la lettre "DATA" est tombée
      onLetterFallen(dataLetter.letter);
    }
  };
 useEffect(() => {
    if (bricksShouldFall) {
      dataLettersRefs.current.forEach((rigidBody) => {
        if (rigidBody) {
          // Option 1: Définir la vitesse linéaire directement
          rigidBody.setLinvel({ x: 0, y: 15, z: -7 }, true);

          // Option 2: Appliquer une impulsion pour un mouvement plus naturel
          // rigidBody.applyImpulse({ x: 0, y: 0, z: -10 }, true);
        }
      });
    }
  }, [bricksShouldFall]);
  return (
    <group position={position} rotation={rotation}>
      {/* Rendu des briques */}
      {activeBricks.map((brickId) => {
        const [x, y] = brickId.split('-').map(Number);
        const brickPosition: [number, number, number] = [
          (x - (brickCountX / 2 - 0.5)) * brickSpacingX,
          y * brickSpacingY + 1,
          0,
        ];

        return (
          <Brick
            key={`brick-${brickId}`}
            brickId={brickId}
            position={brickPosition}
            onDestroyed={handleBrickDestroyedInternal}
            shouldFall={bricksShouldFall} // Passer la prop pour déclencher la chute
          />
        );
      })}

      {/* Rendu des lettres "DATA" */}
      {dataLettersState.map((dataLetter, idx) => (
        <RigidBody
          key={`data-letter-${idx}`}
          type={"dynamic"} // Définir le type en fonction de isFalling
          colliders="cuboid" // Utiliser des colliders cuboid pour une meilleure détection
          restitution={0}
          friction={0}
          mass={3}
          position={dataLetter.position}
          userData={{ type: 'dataLetter', letter: dataLetter.letter }}
          ref={(ref) => {
            if (ref) {
              dataLettersRefs.current[idx] = ref;
            }
          }}
        >
          <mesh castShadow receiveShadow>
            <textGeometry args={[dataLetter.letter, { font, size: 13, depth: bricksShouldFall ? 8.2 :8.2  }]} />
            <meshStandardMaterial color="white" />
          </mesh>
        </RigidBody>
      ))}
    </group>
  );
};

export default WallOfBricks;