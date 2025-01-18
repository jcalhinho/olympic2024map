// src/components/Home.tsx
import React, { useEffect, useState } from 'react';
import { Canvas, useLoader, } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import GroundDice from './GroundDice';
import WallOfBricks from './WallOfBricks';
import { Euler, TextureLoader } from 'three';


import { motion } from 'framer-motion';
import { FiArrowUp, FiArrowDown, FiRefreshCw } from 'react-icons/fi';

import ShatteredGlass from './ShatteredGlass';

const ImagePlane: React.FC<{ url: string; position: [number, number, number] }> = ({ url, position }) => {
  const texture = useLoader(TextureLoader, url);

  return (
    <mesh position={position}>
      <planeGeometry args={[38, 21.5]} />
      <meshStandardMaterial map={texture}

      />
    </mesh>
  );
};

const Home: React.FC = () => {
  // État de rotation cible
  const [targetRotation, setTargetRotation] = useState<Euler>(new Euler(0, 0, 0, 'XYZ'));
  const [isBroken, setIsBroken] = useState(false);
  // État pour suivre les lettres "DATA" tombées
  const [fallenDataLetters, setFallenDataLetters] = useState<string[]>([]);

  // État pour indiquer si les briques doivent tomber
  const [bricksShouldFall, setBricksShouldFall] = useState<boolean>(false);
  const [topMessage, setTopMessage] = useState<string>('Break stuff, it’s fun! ');




  // État pour la taille sur l'axe z de GroundDice
  const [groundDiceSizeZ, setGroundDiceSizeZ] = useState(10); // Valeur initiale de z

  // Fonction pour étendre GroundDice sur l'axe z
  const extendGroundDiceZ = () => {
    setGroundDiceSizeZ(prev => prev + 40);
  };



  // Gestion des lettres "DATA" tombées
  const handleDataLetterFallen = (letter: string) => {
    setFallenDataLetters((prev) => [...prev, letter]);

  };





  const rotateUp = () => {
    setTargetRotation((prev) => new Euler(prev.x - Math.PI / 2, prev.y, prev.z, 'XYZ'));

  };

  const rotateDown = () => {
    setTargetRotation((prev) => new Euler(prev.x + Math.PI / 2, prev.y, prev.z, 'XYZ'));

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
    if (isBroken) {
      // Message immédiatement après la casse
      setTopMessage('Wo-wo-wo, you broke the glass!');

      // Après 6 secondes, afficher le message pour calmer l’utilisateur et éventuellement l'image
      const timer1 = setTimeout(() => {
        setTopMessage('To calm you down, here is a cute image ^^');

        // Ensuite, après 10 secondes, réinitialiser le message
        const timer2 = setTimeout(() => {
          setTopMessage('');
        }, 10000);

        // Nettoyage éventuel du deuxième timer
        return () => clearTimeout(timer2);
      }, 6000);

      // Nettoyage du premier timer
      return () => clearTimeout(timer1);
    }
  }, [isBroken]);

  const [sceneKey, setSceneKey] = useState(0);

  const resetScene = () => {
    setTargetRotation(new Euler(0, 0, 0, 'XYZ'));
    setIsBroken(false);
    setFallenDataLetters([]);
    setBricksShouldFall(false);
    setGroundDiceSizeZ(10);
    setTopMessage('Break stuff, it’s fun!');
    // Augmente la clé pour forcer le re-montage de la scène
    setSceneKey(prev => prev + 1);
  };

  useEffect(() => {
    if (bricksShouldFall && !isBroken) {
      setTopMessage("Maybe there's something else to break?");
    }
  }, [bricksShouldFall, isBroken]);


  useEffect(() => {
    if (fallenDataLetters.length === 1) {
      extendGroundDiceZ();
      setBricksShouldFall(true);
    }
  }, [fallenDataLetters]);








  return (
    <div className="relative overflow-hidden">

      {topMessage && (
        <div
          style={{
            position: 'absolute',
            top: 50,
            left: 0,
            width: '100%',
            textAlign: 'center',
            fontSize: "25px",
            backgroundColor: 'transparent',
            color: 'white',
            padding: '10px',
            zIndex: 1,
          }}
        >
          {topMessage}
        </div>
      )}



      {/* Canvas 3D */}
      <Canvas
        key={sceneKey}
        shadows
        camera={{ position: [0, 15, 70], fov: 50 }}
        style={{
          height: '100vh',
          width: '100vw',
          background: 'linear-gradient(to bottom, #000428, #004e92)',
        }}
      >
        <Environment preset="night" />
        <ambientLight intensity={0.5} />

        {topMessage === 'To calm you down, here is a cute image ^^' && (
          <ImagePlane url="/corgi.jpg" position={[0, 35.5, -20]} />
        )}





        <OrbitControls

          enableZoom={true}
          enablePan={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          target={[0, 10, 0]}
        />
        {/* Lumières */}
        <ambientLight intensity={0.8} />
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


            sizeZ={groundDiceSizeZ} // Passer la taille z ici
          />

          {/* Mur de briques et lettres "DATA" */}
          <WallOfBricks

            onLetterFallen={handleDataLetterFallen}
            position={[0, -2, -10]}
            rotation={[0, 0, 0]}
            bricksShouldFall={bricksShouldFall} // Passer la prop ici
          />
          <ShatteredGlass
            position={[0, 15, 70]}   // Position dans la scène
            size={[80, 50, 0.8]}    // Largeur/hauteur/épaisseur
            isBroken={isBroken}
            setIsBroken={setIsBroken}
          />

        </Physics>

        {/* Contrôles de la caméra */}

      </Canvas>

      <div className="absolute bottom-[45%] right-5 flex flex-col space-y-2">
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
       {bricksShouldFall && <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={resetScene}
          className="p-2 bg-gray-800 text-white rounded-full shadow flex items-center justify-center"
          aria-label="Réinitialiser la scène"
        >
          <FiRefreshCw size={24} />
        </motion.button>} 
      </div>
    </div>
  );
};

export default Home;