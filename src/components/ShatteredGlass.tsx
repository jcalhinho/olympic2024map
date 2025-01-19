import React, { useState, useRef } from 'react';
import { RigidBody } from '@react-three/rapier';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Delaunay } from 'd3-delaunay';

// Composant Fragment inchangé
const Fragment: React.FC<{
  shape: THREE.Shape;
  position: [number, number, number];
  
}> = ({ shape, position }) => {

  
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.8,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 1,
  };
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  
  return (
    <RigidBody
      type="dynamic"
      colliders="hull"
      mass={1}
      position={position}
      restitution={0.2}
      friction={0.5}
    >
      <mesh castShadow receiveShadow>
        <primitive object={geometry} attach="geometry" />
        <meshPhysicalMaterial
              color="rgba(5, 123, 227, 0.5)" // Bleu avec opacité
              transparent
              opacity={0.6}
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

interface ShatteredGlassProps {
  /** Position initiale de la plaque */
  position?: [number, number, number];
  /** Taille [x, y, z] de la plaque */
  size?: [number, number, number];
  /** Callback appelé lors du contact avec le verre */
  isBroken:boolean;
  setIsBroken: (isBroken: boolean) => void;
}

const ShatteredGlass: React.FC<ShatteredGlassProps> = ({
  position ,
  size = [10, 10, 0.5], // Default size if not provided
  isBroken,
  setIsBroken,
}) => {

  const [fragments, setFragments] = useState<JSX.Element[]>([]);
  const glassRef = useRef<any>(null);
  const { camera } = useThree();

  // Décalage désiré devant la caméra (tu peux ajuster cette valeur)
  const offsetDistance = 5;

  // Met à jour la position de la plaque pour qu'elle suive la caméra
  useFrame(() => {
    // Met à jour uniquement tant que la plaque n'est pas brisée
    if (!isBroken && glassRef.current) {
      const camPos = camera.position.clone();
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      const newPos = camPos.add(forward.multiplyScalar(offsetDistance));
      
      if (typeof glassRef.current.setNextKinematicTranslation === 'function') {
        glassRef.current.setNextKinematicTranslation(newPos);
      } else if (glassRef.current.position) {
        glassRef.current.position.copy(newPos);
      }
  
      // Il est préférable de cloner le quaternion pour éviter tout problème d’aliasing
      if (typeof glassRef.current.setNextKinematicRotation === 'function') {
        glassRef.current.setNextKinematicRotation(camera.quaternion.clone());
      } else if (glassRef.current.quaternion) {
        glassRef.current.quaternion.copy(camera.quaternion);
      }
    }
  });

  const handleCollisionEnter = () => {
    if (isBroken) return;
    setIsBroken(true);
    
    // Récupère la position et l'orientation de la caméra
    const camPos = camera.position.clone();
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    // Par exemple, positionner les fragments à 2 unités devant la caméra
    const fragmentStartPos = camPos.add(forward.multiplyScalar(2));
    fragmentStartPos.x -= 40;
 
    // Génération des fragments (le reste du code reste identique)
    const numPoints = 30;
    const points: [number, number][] = [];
    for (let i = 0; i < numPoints; i++) {
      points.push([
        Math.random() * (size ? size[0] : 10),
        Math.random() * size[1],
      ]);
    }
    points.push([0, 0], [size[0], 0], [size[0], size[1]], [0, size[1]]);
    const delaunay = Delaunay.from(points);
    const triangles = delaunay.triangles;
  
    const newFragments: JSX.Element[] = [];
    for (let i = 0; i < triangles.length; i += 3) {
      const a = triangles[i];
      const b = triangles[i + 1];
      const c = triangles[i + 2];
  
      const shape = new THREE.Shape();
      shape.moveTo(points[a][0], points[a][1]);
      shape.lineTo(points[b][0], points[b][1]);
      shape.lineTo(points[c][0], points[c][1]);
      shape.closePath();
  
      newFragments.push(
        <Fragment
          key={`frag-${i}`}
          shape={shape}
          position={[fragmentStartPos.x, fragmentStartPos.y, fragmentStartPos.z]}
        />
      );
    }
    setFragments(newFragments);
  };
  return (
    <>
      {/* Tant que la plaque n'est pas brisée on l'affiche */}
      {!isBroken && (
        <RigidBody
          ref={glassRef}  // On référence ici la plaque pour la manipuler dynamiquement
          type="kinematicPosition"
          colliders="cuboid"
          friction={0.5}
          restitution={0.2}
          position={position}  // Valeur initiale (sera mise à jour par useFrame)
          onCollisionEnter={handleCollisionEnter}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={size} /> 
             <meshPhysicalMaterial
              side={THREE.DoubleSide}
              // color="rgba(5, 123, 227, 0.1)"
              transparent
              opacity={0}
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
      {isBroken && fragments}
    </>
  );
};

export default ShatteredGlass;