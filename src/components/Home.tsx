import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import * as THREE from 'three';
import GroundDie from './GroundDice';
const AnimatedCamera: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null); // Référence pour manipuler la caméra
  const [zoomOut, setZoomOut] = useState(false); // État pour déclencher le zoom arrière

  // Fonction pour déclencher le zoom
  const triggerZoomOut = () => setZoomOut(true);

  // Animation du zoom arrière
  useFrame(() => {
    if (zoomOut && cameraRef.current) {
      const camera = cameraRef.current;

      // Recule progressivement sur l'axe Z
      if (camera.position.y< 75) {
        camera.position.y += 0.5; // Ajuste la vitesse d'animation
      } else {
        setZoomOut(false); // Arrête l'animation quand on atteint la cible
      }
    }
  });

  // useEffect(() => {
  //   // Déclenche automatiquement le zoom arrière après un délai (par exemple 1 seconde)
  //   const timeout = setTimeout(triggerZoomOut, 3400);
  //   return () => clearTimeout(timeout); // Nettoyage
  // }, []);

  return (
    <PerspectiveCamera
      makeDefault
      ref={cameraRef} // Référence pour manipuler la caméra
      position={[0, 75, 0]} // Position initiale
      fov={75}
     // rotation={[-Math.PI / 2, 0, 0]}
    />
  );
};
// const Home: React.FC = () => {

//   return (
//     <Canvas
//       shadows
//       style={{
//         height: '100vh',
//         background: 'linear-gradient(to bottom, #000428, #004e92)',
//       }}
//     >
//       {/* Caméra vue aérienne */}
//       {/* <PerspectiveCamera
//         makeDefault
//         position={[0, 40, 0]}
//         fov={75}
//         rotation={[-Math.PI / 2, 0, 0]}
//       /> */}
// <AnimatedCamera />
//       {/* Lumières */}
//       <ambientLight intensity={0.8} />
//       <directionalLight
//         position={[55, 85, 120]}
//         intensity={1.2}
//         castShadow
//         shadow-mapSize-width={2048}
//         shadow-mapSize-height={2048}
//       />

//       {/* Monde Physique */}
//       <Physics gravity={[0, -9.81, 0]}>
//         <GroundDie />
//       </Physics>

//       {/* Contrôles de la caméra */}
//       <OrbitControls enablePan={true} enableZoom={true} />
//     </Canvas>
//   );
// };

// export default Home;

const Home: React.FC = () => {
  return (
    <Canvas
      shadows
      style={{
        height: '100vh',
        background: 'linear-gradient(to bottom, #000428, #004e92)',
      }}
    >
      {/* Caméra vue aérienne */}
      <AnimatedCamera />

      {/* Lumières */}
      
      {/* Lumière Ambiante */}
      {/* Éclaire uniformément toute la scène, utile pour un éclairage global de base */}
      <ambientLight intensity={0.4} />

      {/* Lumière Directionnelle */}
      {/* Simule une lumière parallèle, comme celle du soleil */}
      <directionalLight
        position={[55, 85, 120]} // Position de la lumière
        intensity={1.2} // Ajuste l'intensité (1.0 = standard)
        castShadow // Active les ombres projetées
        shadow-mapSize-width={2048} // Résolution des ombres
        shadow-mapSize-height={2048}
      />

      {/* Lumière Ponctuelle */}
      {/* Émet de la lumière dans toutes les directions depuis un point */}
      {/* <pointLight
        position={[10, 20, 10]} // Position de la lumière
        intensity={1} // Intensité lumineuse
        distance={50} // Distance maximale d'influence
        decay={2} // Diminution progressive
        color="white" // Couleur de la lumière
      /> */}

      {/* Lumière Projecteur */}
      {/* Concentre la lumière dans une direction spécifique */}
      {/* <spotLight
        position={[0, 0, 0]} // Position de la lumière
        intensity={1.5} // Intensité lumineuse
        angle={Math.PI / 6} // Angle d'ouverture du cône
        penumbra={0.5} // Douceur des bords du cône
        castShadow // Active les ombres projetées
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      /> */}

      {/* Lumière Hémisphère */}
      {/* Simule un éclairage naturel avec lumière du ciel et réflexion du sol */}
      {/* <hemisphereLight
       // skyColor={'#87CEEB'} // Couleur du ciel
        groundColor={'#2E8B57'} // Couleur du sol réfléchi
        intensity={0.6} // Intensité lumineuse
      /> */}

      {/* Monde Physique */}
      <Physics gravity={[0, -9.81, 0]}>
        <GroundDie />
      </Physics>

      {/* Contrôles de la caméra */}
      <OrbitControls enablePan={true} enableZoom={true} />
    </Canvas>
  );
};

export default Home;