// src/components/PieChart.tsx
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Physics, RigidBody, RigidBodyApi } from '@react-three/rapier';
import { useSprings, animated } from '@react-spring/three';

/**
 * Génère les données pour un PieChart
 */
export function generatePieData(
  numberOfSlices: number
): { label: string; value: number; color: string }[] {
  const data = [];
  for (let i = 1; i <= numberOfSlices; i++) {
    const value = Math.floor(Math.random() * 46) + 5; // Valeur aléatoire [5..50]
    const color =
      '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    data.push({ label: `Slice ${i}`, value, color });
  }
  return data;
}

interface PieSliceData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieSliceData[];
  height?: number;
  isDislocated?: boolean; // Contrôle visuel pour éloigner les tranches
}

/**
 * Représentation visuelle d’une tranche du cylindre
 */
interface PieSliceBodyProps {
  slice: PieSliceData & { startAngle: number; endAngle: number };
  height: number;
  isDislocated: boolean;
}

const PieSliceBody: React.FC<PieSliceBodyProps> = ({
  slice,
  height,
  isDislocated,
}) => {
  const thetaStart = slice.startAngle;
  const thetaLength = slice.endAngle - slice.startAngle;

  // Rayon “de base” : un cylindre de rayon 5
  const baseRadius = 5;

  // Angle moyen pour calculer la direction radiale
  const midAngle = thetaStart + thetaLength / 2;

  // On va décaler les tranches uniquement de façon VISUELLE,
  // en agrandissant le rayon si "dislocated".
  const offsetRadius = isDislocated ? 8 : 5; // ex. 5 => 8
  const geometry = useMemo(() => {
    return new THREE.CylinderGeometry(
      baseRadius,
      baseRadius,
      height,
      32,
      1,
      false,
      thetaStart,
      thetaLength
    );
  }, [thetaStart, thetaLength, height]);

  // => On utilise react-spring pour animer la translation radiale
  const initialPos: [number, number, number] = [0, 0, 0];
  const finalPos: [number, number, number] = [
    Math.cos(midAngle) * (offsetRadius - baseRadius),
    0,
    Math.sin(midAngle) * (offsetRadius - baseRadius),
  ];

  // Animation
  const [springs] = useSprings(1, () => ({
    position: finalPos,
    config: { tension: 170, friction: 26 },
  }));

  return (
    <animated.mesh
      rotation={[Math.PI / 2, 0, 0]}
      position={springs.position}
      geometry={geometry}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={slice.color} side={THREE.DoubleSide} />
    </animated.mesh>
  );
};

/**
 * Composant principal PieChart
 */
const PieChart: React.FC<PieChartProps> = ({
  data,
  height = 2,
  isDislocated = false,
}) => {
  /**
   * 1) Roulage depuis la gauche
   * 2) S'arrête au milieu => tombe à plat
   * 3) Dislocation = offset radial
   * 4) Réintégration = retour centre
   */

  // On va manipuler le rigidBody d'un "gros cylindre" complet (pas un par slice).
  // En effet, pour simuler "un cylindre" qui roule, on aura un seul RigidBody.
  // Ensuite, on affiche nos slices ENFANTS de ce RigidBody (visuels).
  // Une fois qu'il tombe à plat, on le fige.

  const [isRolling, setIsRolling] = useState(true); // roulement en cours ?
  const cylinderRef = useRef<RigidBodyApi | null>(null);

  // Au chargement, on programme une "impulsion" pour rouler vers le centre
  useEffect(() => {
    if (cylinderRef.current) {
      // Ex. : on lui donne une vitesse vers +X et une légère rotation
      cylinderRef.current.setLinvel({ x: 2, y: 0, z: 0 }, true);
      cylinderRef.current.setAngvel({ x: 0, y: 0, z: -2 }, true);
    }
  }, []);

  // On calcule la distribution angulaire pour chaque slice
  const total = useMemo(
    () => data.reduce((acc, item) => acc + item.value, 0),
    [data]
  );
  const slicesWithAngles = useMemo(() => {
    let startAngle = 0;
    return data.map((slice) => {
      const angle = (slice.value / total) * Math.PI * 2;
      const endAngle = startAngle + angle;
      const item = { ...slice, startAngle, endAngle };
      startAngle = endAngle;
      return item;
    });
  }, [data, total]);

  // On écoute la position du cylindre. Quand x ~ 0 => on estime qu'il est arrivé au centre.
  // On le fige (setIsRolling(false)).
  const onUpdate = () => {
    if (cylinderRef.current && isRolling) {
      const translation = cylinderRef.current.translation();
      if (translation.x >= 0) {
        // On considère qu'il est assez au centre => on arrête
        setIsRolling(false);

        // On le fige
        cylinderRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        cylinderRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
        cylinderRef.current.setBodyType('fixed', true); // devient immobile
      }
    }
  };

  return (
    <Canvas shadows camera={{ position: [0, 30, 50], fov: 45 }}>
      {/* Lumières */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[0, 30, 50]} intensity={0.9} castShadow />

      <Physics gravity={[0, -9.81, 0]}>
        {/* RigidBody GLOBALE => cylindre qui roule */}
        <RigidBody
          colliders="hull"
          ref={cylinderRef}
          type="dynamic" // Au départ, dynamic pour rouler
          position={[-20, 2, 0]} // On le met à gauche
          rotation={[0, 0, 0]}
          onUpdate={onUpdate} // On surveille sa position
        >
          {/* On dessine un group de slices en 3D */}
          <group>
            {slicesWithAngles.map((slice, i) => (
              <PieSliceBody
                key={i}
                slice={slice}
                height={height}
                isDislocated={isDislocated}
              />
            ))}
          </group>
        </RigidBody>

        {/* Sol */}
        <RigidBody type="fixed" colliders="hull">
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[200, 200]} />
            <shadowMaterial opacity={0.4} />
          </mesh>
        </RigidBody>
      </Physics>

      <OrbitControls />
    </Canvas>
  );
};

export default PieChart;