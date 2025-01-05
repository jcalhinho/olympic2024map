// src/components/Home.tsx
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import GroundDice from './GroundDice';
import WallOfBricks from './WallOfBricks';
import {  Euler } from 'three';
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import InvisibleScreen from './InvisibleScreen';
import * as THREE from 'three';
import ShatteredGlass from './ShatteredGlass';

// Composant pour suivre la caméra

interface FollowCameraScreenProps {
  onShatter: () => void;
}

const FollowCameraScreen = forwardRef<THREE.Mesh, FollowCameraScreenProps>(
  ({ onShatter }, ref) => {
    const screenRef = useRef<THREE.Mesh>(null);
    const { camera } = useThree();

    useFrame(() => {
      if (screenRef.current) {
        const distance = 20; // Distance devant la caméra
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(camera.quaternion);
        const newPosition = new THREE.Vector3().copy(camera.position).add(direction.multiplyScalar(distance));
        screenRef.current.position.copy(newPosition);
        screenRef.current.quaternion.copy(camera.quaternion);
      }
    });

    return <InvisibleScreen ref={ref || screenRef} onShatter={onShatter} />;
  }
);
const ImagePlane: React.FC<{ url: string; position: [number, number, number] }> = ({ url, position }) => {
  const texture = useLoader(TextureLoader, url);

  return (
    <mesh position={position}>
      <planeGeometry args={[38, 21.5]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

const Home: React.FC = () => {
  // État de rotation cible
  const [targetRotation, setTargetRotation] = useState<Euler>(new Euler(0, 0, 0, 'XYZ'));

  // État pour suivre les lettres "DATA" tombées
  const [fallenDataLetters, setFallenDataLetters] = useState<string[]>([]);

  // État pour indiquer si les briques doivent tomber
  const [bricksShouldFall, setBricksShouldFall] = useState<boolean>(false);

  // État pour la position de la souris
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [tooltipMessage, setTooltipMessage] = useState<string>('');

  // État pour le compteur de clics
  const [clickCount, setClickCount] = useState(0);

  // État pour la taille sur l'axe z de GroundDice
  const [groundDiceSizeZ, setGroundDiceSizeZ] = useState(10); // Valeur initiale de z

  // Fonction pour étendre GroundDice sur l'axe z
  const extendGroundDiceZ = () => {
    setGroundDiceSizeZ(prev => prev + 40);
  };

  const handleBrickDestroyed = (id: string) => {
    // Implémentation selon vos besoins
  };

  // Gestion des lettres "DATA" tombées
  const handleDataLetterFallen = (letter: string) => {
    setFallenDataLetters((prev) => [...prev, letter]);
    setTooltipMessage(`Lettre "${letter}" tombée!`);
  };

  // Gestion des lettres "VISUALISATION" tombées
  const handleVisualLetterFallen = (letter: string) => {
    // Vous pouvez ajouter des actions spécifiques pour les lettres "VISUALISATION" si nécessaire
    setTooltipMessage(`Lettre "${letter}" tombée!`);
  };

  const hasWon = fallenDataLetters.length === 4; // "D", "A", "T", "A"

  const rotateUp = () => {
    setTargetRotation((prev) => new Euler(prev.x - Math.PI / 2, prev.y, prev.z, 'XYZ'));
    setTooltipMessage('Rotation vers le haut !');
  };

  const rotateDown = () => {
    setTargetRotation((prev) => new Euler(prev.x + Math.PI / 2, prev.y, prev.z, 'XYZ'));
    setTooltipMessage('Rotation vers le bas !');
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        rotateUp();
      }
      if (event.key === 'ArrowDown') {
        rotateDown();
      }
    };

    // Ajouter un écouteur d'événements pour keydown
    window.addEventListener('keydown', handleKeyDown);

    // Nettoyage de l'écouteur d'événements lors du démontage du composant
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = event.clientX;
      const y = event.clientY;
      
      setMousePosition({ x, y });
    
      // Définir les messages selon les zones de l'écran
      if (x <= 200) {
        setTooltipMessage('Tu es dans la zone de gauche !');
      } else if (x > 200 && x <= 500) {
        setTooltipMessage('Tu es dans la zone du centre !');
      } else if (x > 500) {
        setTooltipMessage('Tu es dans la zone de droite !');
      } else {
        setTooltipMessage('');
      }
    };

    const handleMouseClick = () => {
      setClickCount((prev) => prev + 1);
      setTooltipMessage('Clic détecté !');
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleMouseClick);

    // Nettoyage des écouteurs
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseClick);
    };
  }, []);

  const [topMessage, setTopMessage] = useState<string>('');
  useEffect(() => {
    // Afficher un message spécifique selon le nombre de clics
    if (clickCount === 124) {
      setTopMessage('Ça fait déjà 124 fois que vous cliquez... ça va?');
    } else if (clickCount === 10) {
      setTopMessage('10 clics ! Impressionnant !');
    } else if (clickCount > 10) {
      setTopMessage('Vous continuez à cliquer... Bravo !');
    } else {
      setTopMessage('');
    }
  }, [clickCount]);
  // const handleBallReachTarget = () => {
  //   rotateUp();
  //   setTooltipMessage('La balle a déclenché la rotation vers le haut!');
  // };
  // Effet pour augmenter sizeZ et déclencher la chute des briques lorsque toutes les lettres "DATA" sont tombées
  useEffect(() => {
    if (fallenDataLetters.length === 1) {
      extendGroundDiceZ();
      setBricksShouldFall(true); // Déclenche la chute des briques
      setTooltipMessage('Toutes les lettres "DATA" sont tombées !');
    }
  }, [fallenDataLetters]);

  return (
    <div className="relative overflow-hidden">
      {/* Message de victoire */}
      {hasWon && (
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '2em',
            zIndex: 100000,
          }}
        >
          GG Bro!
        </div>
       )} 

      {/* Message en haut de l'écran */}
      {topMessage && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '10px',
            zIndex: 1000,
          }}
        >
          {topMessage}
        </div>
      )}

      {/* Tooltip qui suit la souris */}
      {tooltipMessage && (
        <div
          style={{
            position: 'absolute',
            top: mousePosition.y + 10,
            left: mousePosition.x + 10,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        >
          {tooltipMessage}
        </div>
      )}

      {/* Canvas 3D */}
      <Canvas
        shadows
        camera={{ position: [0, 15, 70], fov: 50 }}
        style={{
          height: '100vh',
          width: '100vw',
          background: 'linear-gradient(to bottom, #000428, #004e92)',
        }}
      > <Environment preset="night"  />
        {/* <ImagePlane url="/public/corgi.jpg" position={[0, 15.5, -20]} /> */}
        {/* Lumières */}
        <ambientLight intensity={0.1} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={500}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
        />

        {/* Monde physique avec gravité */}
        <Physics gravity={[0, -9.81, 0]}>
          {/* Sol et lettres "VISUALISATION" */}
          <GroundDice
            targetRotation={targetRotation}
            onBrickDestroyed={handleBrickDestroyed}
            onLetterFallen={handleVisualLetterFallen}
            sizeZ={groundDiceSizeZ} // Passer la taille z ici
          />

          {/* Mur de briques et lettres "DATA" */}
          <WallOfBricks
            onBrickDestroyed={handleBrickDestroyed}
            onLetterFallen={handleDataLetterFallen}
            position={[0, -2, -10]}
            rotation={[0, 0, 0]}
            bricksShouldFall={bricksShouldFall} // Passer la prop ici
          />
          <ShatteredGlass
            position={[0, 0, 40]}   // Position dans la scène
            size={[90, 90, 0.8]}    // Largeur/hauteur/épaisseur
           // glassTextureUrl={'src/textures/Drawing.png'}
          />
       {/* Balle Animée */}
       {/* <AnimatedBall onReachTarget={handleBallReachTarget} targetX={20}/> */}
        </Physics>

        {/* Contrôles de la caméra */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          minPolarAngle={0} // Permet l'inclinaison complète vers le bas
          maxPolarAngle={Math.PI} // Permet l'inclinaison complète vers le haut
          target={[0, 10, 0]} // Centre les contrôles sur le mur de briques
        />
      </Canvas>

      <div className="absolute bottom-5 right-5 flex flex-col space-y-2">
        {/* Bouton Haut */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={rotateUp}
          className="p-2 bg-gray-800 text-white rounded-full shadow flex items-center justify-center"
          aria-label="Rotation Haut"
        >
          <FiArrowUp size={24} />
        </motion.button>

        <div className="flex space-x-2">
          {/* Bouton Bas */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={rotateDown}
            className="p-2 bg-gray-800 text-white rounded-full shadow flex items-center justify-center"
            aria-label="Rotation Bas"
          >
            <FiArrowDown size={24} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Home;