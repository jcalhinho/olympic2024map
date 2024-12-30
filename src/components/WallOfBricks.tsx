// src/components/WallOfBricks.tsx
import React, { useState, useMemo } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Euler, Vector3 } from '@react-three/fiber';
import Brick from './Brick';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import myfont from '../../public/fonts/helvetiker_regular.typeface.json';
import * as THREE from 'three';

interface WallOfBricksProps {
  onBrickDestroyed: (brickId: string) => void;
  onLetterFallen: (letter: string) => void;
  position: Vector3;
  rotation: Euler;
}

interface DataLetter {
  letter: string;
  brickId: string;
  position: [number, number, number];
  isFalling: boolean;
}

const WallOfBricks: React.FC<WallOfBricksProps> = ({ onBrickDestroyed, onLetterFallen, position, rotation }) => {
  // Paramètres de la grille de briques
  const brickCountX = 14; // Nombre de briques horizontalement
  const brickCountY = 10; // Nombre de briques verticalement
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

  // Définir les briques qui supportent les lettres "DATA"
  const dataLetters = ['D', 'A', 'T', 'A'];
  const dataBrickIndices = [2, 5, 8, 11]; // Indices X des briques pour "D", "A", "T", "A"

  // Initialisation des lettres "DATA"
  const [dataLettersState, setDataLettersState] = useState<DataLetter[]>(() => {
    const letters: DataLetter[] = dataLetters.map((letter, idx) => {
      const x = dataBrickIndices[idx];
      const y = brickCountY - 1; // Dernière rangée
      const brickId = `${x}-${y}`;
      const brickPosition: [number, number, number] = [
        (x - (brickCountX / 2 - 0.5)) * brickSpacingX,
        y * brickSpacingY + 1,
        0,
      ];
      return {
        letter,
        brickId,
        position: [brickPosition[0], brickPosition[1] + 1.5, brickPosition[2]], // Position au-dessus de la brique
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
      onLetterFallen(dataLetter.letter);
    }
  };

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
          />
        );
      })}

      {/* Rendu des lettres "DATA" */}
      {dataLettersState.map((dataLetter, idx) => (
        <RigidBody
          key={`data-letter-${idx}`}
          type={dataLetter.isFalling ? "dynamic" : "dynamic"}
          colliders="hull"
          restitution={0.2}
          friction={0.5}
          position={dataLetter.position}
          userData={{ type: 'dataLetter', letter: dataLetter.letter }}
        >
          <mesh castShadow receiveShadow>
            <textGeometry args={[dataLetter.letter, { font, size: 3, depth: 0.2 }]} />
            <meshStandardMaterial color="yellow" />
          </mesh>
        </RigidBody>
      ))}
    </group>
  );
};

export default WallOfBricks;