// src/components/ShatteredGlass.tsx
import React, { useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { Delaunay } from 'd3-delaunay';

/** Petit composant pour chaque fragment brisé */
const Fragment: React.FC<{
  shape: THREE.Shape;
  position: [number, number, number];
}> = ({ shape, position }) => {
  // On extrude la shape pour donner de l'épaisseur
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.8,        // Épaisseur du fragment
    bevelEnabled: true
  };
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  return (
    <RigidBody
      type="dynamic"  // Les fragments tombent sous la gravité
      colliders="hull"
      mass={1}
      position={position}
      restitution={0.2}
      friction={0.5}
    >
      <mesh castShadow receiveShadow>
        <primitive object={geometry} attach="geometry" />
        <meshPhysicalMaterial
          /** même material que bricks / groundDice **/
          side={THREE.DoubleSide}
          color="rgba(5, 123, 227, 0.1)" // Bleu avec opacité
          transparent
          opacity={0.6}
          transmission={1} // Pour un rendu de type "verre"
          roughness={0}    // Très lisse
          metalness={0.1}
          ior={1.5}
          reflectivity={0.4}
          thickness={1}
          envMapIntensity={1}
        />
      </mesh>
    </RigidBody>
  );
};

interface ShatteredGlassProps {
  /** Position de la plaque de verre dans la scène */
  position?: [number, number, number];
  /** Taille [x, y, z] de la plaque */
  size?: [number, number, number];
}

const ShatteredGlass: React.FC<ShatteredGlassProps> = ({
  position,  // Position par défaut
  size,   // Dimensions par défaut
}) => {
  const [isBroken, setIsBroken] = useState(false);
  const [fragments, setFragments] = useState<JSX.Element[]>([]);

  /** Fonction déclenchée lors de la collision avec la plaque */
  const handleCollisionEnter = () => {
    if (isBroken) return; // Si la plaque est déjà brisée, ne rien faire pour éviter de la casser plusieurs fois
    setIsBroken(true); // Marquer la plaque comme brisée
  
    // --- Génération de fragments via triangulation de Delaunay ---
    const numPoints = 60; // Nombre de points aléatoires pour la triangulation, ajustable pour plus ou moins de fragments
    const points: [number, number][] = []; // Tableau pour stocker les coordonnées des points
  
    // Générer des points aléatoires à l'intérieur de la plaque
    for (let i = 0; i < numPoints; i++) {
      points.push([
        Math.random() * size[0], // Coordonnée x aléatoire entre 0 et la largeur de la plaque
        Math.random() * size[1], // Coordonnée y aléatoire entre 0 et la hauteur de la plaque
      ]);
    }
  
    // Ajouter les coins de la plaque pour s'assurer que la triangulation couvre tout le rectangle
    points.push([0, 0], [size[0], 0], [size[0], size[1]], [0, size[1]]);
  
    // Effectuer la triangulation de Delaunay sur les points générés
    const delaunay = Delaunay.from(points);
    const triangles = delaunay.triangles; // Tableau des indices des points formant les triangles
  
    const newFragments: JSX.Element[] = []; // Tableau pour stocker les nouveaux fragments créés
  
    // Parcourir chaque triangle résultant de la triangulation
    for (let i = 0; i < triangles.length; i += 3) {
      const a = triangles[i];     // Indice du premier point du triangle
      const b = triangles[i + 1]; // Indice du deuxième point du triangle
      const c = triangles[i + 2]; // Indice du troisième point du triangle
  
      // Construction de la forme 2D du triangle
      const shape = new THREE.Shape();
      shape.moveTo(points[a][0], points[a][1]); // Déplacer le curseur au premier point
      shape.lineTo(points[b][0], points[b][1]); // Tracer une ligne vers le deuxième point
      shape.lineTo(points[c][0], points[c][1]); // Tracer une ligne vers le troisième point
      shape.closePath(); // Fermer le chemin pour former un triangle complet
  
      // Calculer la position de départ pour le fragment
      const x0 = position && size && position[0] - size[0] + points[a][0]; // Position x ajustée
      const y0 = position && size && position[1] - size[1] + points[a][1]; // Position y ajustée
      const z0 = position  && position[2]; // Position z (garde la même profondeur que la plaque initiale)
  
      // Créer un nouveau fragment avec la forme et la position calculées
      newFragments.push(
        <Fragment key={`frag-${i}`} shape={shape} position={[x0 as number, y0 as number, z0 as number]} />
      );
    }
  
    // Mettre à jour l'état avec les nouveaux fragments générés
    setFragments(newFragments);
  };

  return (
    <>
      {/* Tant que la plaque n'est pas brisée, on affiche le bloc complet */}
      {!isBroken && (
        <RigidBody
          type="fixed"       // Plaque fixée (elle ne tombe pas avant la collision)
          colliders="cuboid"
          friction={0.5}
          restitution={0.2}
          position={position}
          onCollisionEnter={handleCollisionEnter}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={size} />
            <meshPhysicalMaterial
              side={THREE.DoubleSide}
              color="rgba(5, 123, 227, 0.1)"
              transparent
              opacity={0.6}
              transmission={0.3}
              roughness={0}
              metalness={0.1}
              ior={1.5}
              reflectivity={0.4}
              thickness={1}
              envMapIntensity={1}
            />
          </mesh>
        </RigidBody>
      )}

      {/* Une fois brisée, on affiche les fragments */}
      {isBroken && fragments}
    </>
  );
};

export default ShatteredGlass;