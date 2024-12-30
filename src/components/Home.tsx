// src/components/Home.tsx
import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import GroundDice from './GroundDice';
import WallOfBricks from './WallOfBricks';
import { Euler } from 'three';
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { FiArrowUp, FiArrowDown,  } from 'react-icons/fi';


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
  const [fallenDataLetters, setFallenDataLetters] = useState<Set<string>>(new Set());
// État pour la position de la souris
const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
const [tooltipMessage, setTooltipMessage] = useState<string>('');
// État pour le compteur de clics
const [clickCount, setClickCount] = useState(0);
  const handleBrickDestroyed = (id: string) => {
   <></>
  };

  const handleLetterFallen = (letter: string) => {
    setFallenDataLetters((prev) => new Set(prev).add(letter));
    setTooltipMessage(`Lettre "${letter}" tombée!`);
  };

  const hasWon = fallenDataLetters.size === 4; // "D", "A", "T", "A"

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
      setTopMessage('Ca fait deja 124 fois que vous cliquez...ca va?');
    } else if (clickCount === 10) {
      setTopMessage('10 clics ! Impressionnant !');
    } else if (clickCount > 10) {
      setTopMessage('Vous continuez à cliquer... Bravo !');
    } else {
      setTopMessage('');
    }
  }, [clickCount]);
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
      >
        <ImagePlane url="/public/corgi.jpg"position={[0, 15.5, -20]} />
        {/* Lumières */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1.5}
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
            onLetterFallen={handleLetterFallen}
          />

          {/* Mur de briques et lettres "DATA" */}
          <WallOfBricks
            onBrickDestroyed={handleBrickDestroyed}
            onLetterFallen={handleLetterFallen}
            position={[0, 2, -20]}
            rotation={[0, 0, 0]}
          />
      
        </Physics>

        {/* Contrôles de la caméra */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          minPolarAngle={0} // Permet l'inclinaison complète vers le bas
          maxPolarAngle={Math.PI} // Permet l'inclinaison complète vers le haut
          target={[0, 10, 0]} // Centre les contrôles sur le mur de briques
        />


      </Canvas><div className="absolute bottom-5 right-5 flex flex-col space-y-2">
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
          {/* Bouton Gauche */}
          

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

          {/* Bouton Droite */}
          
        </div></div>
    </div>
  );
};

export default Home;