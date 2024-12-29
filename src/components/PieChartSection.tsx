
// import React, { useState,  useRef, useCallback } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { OrbitControls, Text, Billboard } from '@react-three/drei';
// import { motion, AnimatePresence } from 'framer-motion';
// import * as THREE from 'three';
// import { FiSettings, FiX, FiRefreshCw } from 'react-icons/fi';

// // Interfaces
// interface SliceData {
//   label: string;
//   value: number;
//   color: string;
//   startAngle: number;
//   angle: number;
// }

// interface PieSliceProps {
//   sliceIndex: number;                    // Index de la tranche
//   startAngle: number;
//   angle: number;
//   color: string;
//   thickness: number;
//   offset: [number, number, number];
//   showLabel: boolean;
//   onClick: (index: number) => void;      // Callback pour gérer le clic sur la tranche
// }

// // Fonction de génération des données pour le Pie Chart
// function generatePieData(numberOfSlices: number): SliceData[] {
//   const data: SliceData[] = [];
//   let total = 0;

//   for (let i = 1; i <= numberOfSlices; i++) {
//     const value = Math.floor(Math.random() * 46) + 5; // Valeur aléatoire [5..50]
//     const color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'); // Couleur aléatoire
//     total += value;
//     data.push({ label: `Slice ${i}`, value, color, startAngle: 0, angle: 0 });
//   }

//   let cumulative = 0;
//   return data.map((slice) => {
//     const startAngle = cumulative;
//     const angle = (slice.value / total) * Math.PI * 2;
//     cumulative += angle;
//     return { ...slice, startAngle, angle };
//   });
// }

// const PieSlice: React.FC<PieSliceProps> = ({
//   sliceIndex,
//   startAngle,
//   angle,
//   color,
//   thickness,
//   offset,
//   showLabel,
//   onClick,
// }) => {
//   // Construction de la Shape pour la tranche
//   const shape = new THREE.Shape();
//   shape.moveTo(0, 0);
//   shape.absarc(0, 0, 1, startAngle, startAngle + angle, false);
//   shape.lineTo(0, 0);

//    // Réduction du bevel pour des bords moins prononcés
//    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
//     depth: thickness,
//     bevelEnabled: true,        // Activer le chanfrein
//     bevelThickness: 0.01,      // Épaisseur du chanfrein (réduite)
//     bevelSize: 0.01,           // Taille du chanfrein (réduite)
//     bevelSegments: 1,          // Nombre de segments pour arrondir le chanfrein
//   };

//   const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);


//   // Calcul de l'angle central pour placer le label
//   const centralAngle = startAngle + angle / 2;
//   const labelRadius = 1.1; // Ajuster pour rapprocher/éloigner les labels
//   const labelX = Math.cos(centralAngle) * labelRadius;
//   const labelZ = Math.sin(centralAngle) * labelRadius;
//   const labelY = thickness / 2; // Met le label au centre de la tranche en Y

//   // Gestion du clic sur la tranche
//   const handlePointerDown = () => {
//     onClick(sliceIndex);
//   };

//   return (
//     <group position={offset}>
//       {/* Tranche */}
//       <mesh
//         rotation={[Math.PI / 2, 0, 0]}
//         geometry={geometry}
//         onPointerDown={handlePointerDown} // Gérer le clic ici
//       >
//         <meshStandardMaterial color={color} />
//       </mesh>

//       {/* Label */}
//       {showLabel && (
//         <Billboard position={[labelX, labelY, labelZ]}>
//           <Text
//             fontSize={0.2}
//             color="white"
//             anchorX="center"
//             anchorY="middle"
//           >
//             {`${((angle / (2 * Math.PI)) * 100).toFixed(1)}%`}
//           </Text>
//         </Billboard>
//       )}
//     </group>
//   );
// };

// // Composant Animé pour gérer l'animation + l'affichage des tranches
// const AnimatedPieChart: React.FC<{
//   data: SliceData[];
//   thickness: number;
//   spacingXY: number; // Écartement radial sur X et Y
//   spacingXZ: number; // Écartement sur X et Z
// }> = ({ data, thickness, spacingXY, spacingXZ }) => {
//   const groupRef = useRef<THREE.Group>(null!);
//   const [animationPhase, setAnimationPhase] = useState<'rollingIn' | 'falling' | 'final'>('rollingIn');

//   // État pour gérer la tranche "mise en avant"
//   const [highlightIndex, setHighlightIndex] = useState<number | null>(null);

//   // Callback au clic d'une tranche
//   const handleSliceClick = (index: number) => {
//     // Si on clique sur la même tranche déjà "ressortie", on la recentre
//     if (highlightIndex === index) {
//       setHighlightIndex(null);
//     } else {
//       // Sinon, on change la tranche "mise en avant"
//       setHighlightIndex(index);
//     }
//   };

//   // Calculer l'offset de base (en fonction des sliders spacingXY / spacingXZ)
//   const calculateBaseOffset = (startAngle: number, angle: number): [number, number, number] => {
//     const centralAngle = startAngle + angle / 2;

//     // Écartement radial basé sur les axes X et Y
//     const radialX = Math.cos(centralAngle) * spacingXY;
//     const radialY = Math.sin(centralAngle) * spacingXY;

//     // Écartement basé sur les axes X et Z
//     const xOffset = Math.cos(centralAngle) * spacingXZ;
//     const zOffset = Math.sin(centralAngle) * spacingXZ;

//     // Combinaison des deux écartements
//     const totalX = radialX + xOffset;
//     const totalY = radialY;
//     const totalZ = zOffset;

//     return [totalX, totalY, totalZ];
//   };

//   // Calculer l'offset supplémentaire si la tranche est highlight (sur X et Z)
//   const calculateHighlightOffset = (startAngle: number, angle: number): [number, number, number] => {
//     const centralAngle = startAngle + angle / 2;
//     const highlightDistance = 0.3; // Ajuster pour plus/moins de décalage

//     const highlightOffsetX = Math.cos(centralAngle) * highlightDistance;
//     const highlightOffsetZ = Math.sin(centralAngle) * highlightDistance;

//     return [highlightOffsetX, 0, highlightOffsetZ];
//   };

//   // Gérer l'animation d'entrée du Pie Chart (rolling, falling, etc.)
//   useFrame((state, delta) => {
//     if (!groupRef.current) return;

//     // Phase 1 : Rolling In
//     if (animationPhase === 'rollingIn') {
//       // Déplacer le groupe de la gauche vers le centre
//       groupRef.current.position.x += delta * 2; // Ajustez la vitesse
//       // Faire rouler autour de l'axe Z
//       groupRef.current.rotation.z -= delta * 5;

//       // Détecter si on a atteint le centre
//       const targetX = 0;
//       if (groupRef.current.position.x >= targetX) {
//         groupRef.current.position.x = targetX;
//         setAnimationPhase('falling');
//       }
//     }

//     // Phase 2 : Falling
//     if (animationPhase === 'falling') {
//       // Faire pivoter autour de l'axe X pour tomber à plat
//       groupRef.current.rotation.x += delta * 2;

//       // Détecter si le pie chart est à plat
//       if (groupRef.current.rotation.x >= Math.PI / 2) {
//         groupRef.current.rotation.x = Math.PI / 2;
//         setAnimationPhase('final');
//       }
//     }

//     // Phase 3 : Final : plus d'action
//     // Rien à faire
//   });

//   return (
//     <group ref={groupRef}>
//       {data.map((slice, index) => {
//         // Calcul offset de base
//         const baseOffset = calculateBaseOffset(slice.startAngle, slice.angle);

//         // Si la tranche est mise en avant, on ajoute un offset supplémentaire
//         const highlightOffset =
//           highlightIndex === index
//             ? calculateHighlightOffset(slice.startAngle, slice.angle)
//             : [0, 0, 0];

//         // Offset final
//         const finalOffset: [number, number, number] = [
//           baseOffset[0] + highlightOffset[0],
//           baseOffset[1] + highlightOffset[1],
//           baseOffset[2] + highlightOffset[2],
//         ];

//         return (
//           <PieSlice
//             key={index}
//             sliceIndex={index}
//             startAngle={slice.startAngle}
//             angle={slice.angle}
//             color={slice.color}
//             thickness={thickness}
//             offset={finalOffset} // Calcul des offsets basés sur les sliders et le highlight
//             showLabel={spacingXY !== 0 || spacingXZ !== 0}
//             onClick={handleSliceClick}
//           />
//         );
//       })}
//     </group>
//   );
// };

// // Composant principal : gère l'UI, la génération des données et les sliders
// const PieChartSection: React.FC<{ numSlices?: number }> = ({ numSlices = 5 }) => {
//   const [data, setData] = useState<SliceData[]>(generatePieData(numSlices));
//   const [spacingXY, setSpacingXY] = useState(0); // Écartement radial sur X et Y
//   const [spacingXZ, setSpacingXZ] = useState(0); // Écartement sur X et Z
//   const thickness = 0.2; // Épaisseur des tranches
//   const [showSettings, setShowSettings] = useState(false);
//   const [numberOfSlices, setNumberOfSlices] = useState<number>(numSlices);

//   // Régénérer les données et réinitialiser les écartements
//   const regenerateData = useCallback(() => {
//     setData(generatePieData(numberOfSlices));
//     setSpacingXY(0);
//     setSpacingXZ(0);
//   }, [numberOfSlices]);

//   // Ajuster l'écartement X+Y
//   const adjustSpacingXY = (value: number) => {
//     setSpacingXY(value);
//   };

//   // Ajuster l'écartement X+Z
//   const adjustSpacingXZ = (value: number) => {
//     setSpacingXZ(value);
//   };

//   return (
//     <div className="relative w-full h-screen">
//       {/* Canvas */}
//       <Canvas
//         style={{ background: 'linear-gradient(to bottom, #000428, #004e92)' }}
//         camera={{ position: [-1, 1, 5], fov: 50 }} // Position de la caméra
//         shadows
//       >
//         {/* Lumières */}
//         <ambientLight intensity={0.6} />
//         <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
//         <spotLight position={[-5, 5, 5]} angle={0.3} intensity={1} castShadow />

//         {/* Pie Chart Animé */}
//         <AnimatedPieChart
//           data={data}
//           thickness={thickness}
//           spacingXY={spacingXY}
//           spacingXZ={spacingXZ}
//         />

//         {/* Contrôles caméra */}
//         <OrbitControls enableZoom={true} enableRotate={true} />
//       </Canvas>

//       {/* Boutons et Contrôles */}
//       <div className="absolute bottom-10 left-10">
//         <AnimatePresence>
//           {!showSettings ? (
//             <motion.button
//               key="open-settings"
//               initial={{ opacity: 0, scale: 0 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0 }}
//               transition={{ duration: 0.3 }}
//               onClick={() => setShowSettings(true)}
//               className="p-3 bg-gray-800 text-white rounded-full shadow hover:bg-gray-700 focus:outline-none"
//               aria-label="Ouvrir les paramètres"
//             >
//               <FiSettings size={24} />
//             </motion.button>
//           ) : (
//             <motion.div
//               key="settings-panel"
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 50 }}
//               transition={{ duration: 0.5 }}
//               className="relative p-6 bg-white bg-opacity-90 rounded shadow-lg"
//             >
//               {/* Bouton pour fermer */}
//               <button
//                 onClick={() => setShowSettings(false)}
//                 className="absolute top-2 right-2 p-1 bg-gray-800 text-white rounded-full hover:bg-gray-700 focus:outline-none"
//                 aria-label="Fermer les paramètres"
//               >
//                 <FiX size={16} />
//               </button>

//               <h2 className="text-lg font-semibold mb-4">Paramètres du Pie Chart</h2>

//               {/* Slider X+Y */}
//               <div className="mb-4">
//                 <label htmlFor="spacingXY" className="block text-sm font-medium text-gray-700 mb-1">
//                   Écartement radial (X & Y) : {spacingXY.toFixed(2)}
//                 </label>
//                 <input
//                   type="range"
//                   id="spacingXY"
//                   min={0}
//                   max={2}  // Ajustez selon vos besoins
//                   step={0.01}
//                   value={spacingXY}
//                   onChange={(e) => adjustSpacingXY(parseFloat(e.target.value))}
//                   className="w-full"
//                 />
//               </div>

//               {/* Slider X+Z */}
//               <div className="mb-4">
//                 <label htmlFor="spacingXZ" className="block text-sm font-medium text-gray-700 mb-1">
//                   Écartement (X & Z) : {spacingXZ.toFixed(2)}
//                 </label>
//                 <input
//                   type="range"
//                   id="spacingXZ"
//                   min={-4}
//                   max={2}  // Ajustez selon vos besoins
//                   step={0.01}
//                   value={spacingXZ}
//                   onChange={(e) => adjustSpacingXZ(parseFloat(e.target.value))}
//                   className="w-full"
//                 />
//               </div>

//               {/* Nombre de tranches */}
//               <div className="mb-4">
//                 <label htmlFor="numberOfSlices" className="block text-sm font-medium text-gray-700 mb-1">
//                   Nombre de tranches :
//                 </label>
//                 <input
//                   type="number"
//                   id="numberOfSlices"
//                   value={numberOfSlices}
//                   onChange={(e) => setNumberOfSlices(Number(e.target.value))}
//                   min={1}
//                   max={20}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>

//               {/* Bouton Générer */}
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={regenerateData}
//                   className="flex items-center px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
//                 >
//                   <FiRefreshCw className="mr-2" />
//                   Générer
//                 </button>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default PieChartSection;

import React, { useState, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Billboard } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { FiSettings, FiX, FiRefreshCw, FiList } from 'react-icons/fi';

// Interfaces
interface SliceData {
  label: string;
  value: number;
  color: string;
  startAngle: number;
  angle: number;
}

interface PieSliceProps {
  sliceIndex: number;                    // Index de la tranche
  startAngle: number;
  angle: number;
  color: string;
  thickness: number;
  offset: [number, number, number];
  showLabel: boolean;
  isHighlighted: boolean;                // Nouvelle prop pour la mise en évidence
  isHovered: boolean;                    // Nouvelle prop pour le survol
  onClick: (index: number) => void;      // Callback pour gérer le clic sur la tranche
  onHover: (index: number) => void;      // Callback pour gérer le survol
  onUnhover: () => void;                 // Callback pour gérer la sortie du survol
}

// Fonction de génération des données pour le Pie Chart
function generatePieData(numberOfSlices: number): SliceData[] {
  const data: SliceData[] = [];
  let total = 0;

  for (let i = 1; i <= numberOfSlices; i++) {
    const value = Math.floor(Math.random() * 46) + 5; // Valeur aléatoire [5..50]
    const color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'); // Couleur aléatoire
    total += value;
    data.push({ label: `Slice ${i}`, value, color, startAngle: 0, angle: 0 });
  }

  let cumulative = 0;
  return data.map((slice) => {
    const startAngle = cumulative;
    const angle = (slice.value / total) * Math.PI * 2;
    cumulative += angle;
    return { ...slice, startAngle, angle };
  });
}

const PieSlice: React.FC<PieSliceProps> = ({
  sliceIndex,
  startAngle,
  angle,
  color,
  thickness,
  offset,
  showLabel,
  isHighlighted,
  isHovered,
  onClick,
  onHover,
  onUnhover,
}) => {
  // Construction de la Shape pour la tranche
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.absarc(0, 0, 1, startAngle, startAngle + angle, false);
  shape.lineTo(0, 0);

  // Extrusion settings
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: thickness,
    bevelEnabled: true,        // Activer le chanfrein
    bevelThickness: 0.01,      // Épaisseur du chanfrein (réduite)
    bevelSize: 0.01,           // Taille du chanfrein (réduite)
    bevelSegments: 1,          // Nombre de segments pour arrondir le chanfrein
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  // Calcul de l'angle central pour placer le label
  const centralAngle = startAngle + angle / 2;
  const labelRadius = 1.1; // Ajuster pour rapprocher/éloigner les labels
  const labelX = Math.cos(centralAngle) * labelRadius;
  const labelZ = Math.sin(centralAngle) * labelRadius;
  const labelY = thickness / 2; // Met le label au centre de la tranche en Y

  // Gestion des événements de survol
  const handlePointerOver = () => {
    onHover(sliceIndex);
  };

  const handlePointerOut = () => {
    onUnhover();
  };

  // Gestion du clic sur la tranche
  const handlePointerDown = () => {
    onClick(sliceIndex);
  };

  // Définir la couleur en fonction de l'état
  const meshColor = isHighlighted ? '#FFD700' : isHovered ? '#FFA500' : color;

  return (
    <group position={offset}>
      {/* Tranche */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        geometry={geometry}
        onPointerOver={handlePointerOver} // Gérer le survol ici
        onPointerOut={handlePointerOut}   // Gérer la sortie du survol ici
        onPointerDown={handlePointerDown} // Gérer le clic ici
      >
        <meshStandardMaterial color={meshColor} />
      </mesh>

      {/* Label */}
      {showLabel && (
        <Billboard position={[labelX, labelY, labelZ]}>
          <Text
            fontSize={0.3} // Augmenter la taille de la police pour une meilleure lisibilité
            color="white"
            anchorX="center"
            anchorY="middle"
            
          >
            {`${((angle / (2 * Math.PI)) * 100).toFixed(1)}%`}
          </Text>
        </Billboard>
      )}
    </group>
  );
};

// Composant Liste des Tranches
const SliceList: React.FC<{
  slices: SliceData[];
  highlightedIndex: number | null;
  onClickSlice: (index: number) => void;
}> = ({ slices, highlightedIndex, onClickSlice }) => {
  return (
    <div className="p-4 bg-white bg-opacity-75 rounded shadow text-black">
      <h2 className="text-xl font-bold mb-4">Liste des Tranches</h2>
      <ul>
        {slices.map((slice, index) => (
          <li
            key={index}
            className={`p-2 cursor-pointer rounded ${
              highlightedIndex === index
                ? 'bg-gray-700 text-white'
                : 'hover:bg-gray-700 hover:text-white'
            }`}
            onClick={() => onClickSlice(index)}
            tabIndex={0}
            aria-label={`Tranche ${slice.label}`}
          >
            {slice.label} - {slice.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Composant pour gérer l'animation avec useFrame
const AnimatedGroup: React.FC<{
  children: React.ReactNode;
  groupRef: React.RefObject<THREE.Group>;
  animationPhase: 'rollingIn' | 'falling' | 'final';
  setAnimationPhase: React.Dispatch<React.SetStateAction<'rollingIn' | 'falling' | 'final'>>;
}> = ({ children, groupRef, animationPhase, setAnimationPhase }) => {
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Phase 1 : Rolling In
    if (animationPhase === 'rollingIn') {
      // Déplacer le groupe de la gauche vers le centre
      groupRef.current.position.x += delta * 2; // Ajustez la vitesse
      // Faire rouler autour de l'axe Z
      groupRef.current.rotation.z -= delta * 5;

      // Détecter si on a atteint le centre
      const targetX = 0;
      if (groupRef.current.position.x >= targetX) {
        groupRef.current.position.x = targetX;
        setAnimationPhase('falling');
      }
    }

    // Phase 2 : Falling
    if (animationPhase === 'falling') {
      // Faire pivoter autour de l'axe X pour tomber à plat
      groupRef.current.rotation.x += delta * 2;

      // Détecter si le pie chart est à plat
      if (groupRef.current.rotation.x >= Math.PI / 2) {
        groupRef.current.rotation.x = Math.PI / 2;
        setAnimationPhase('final');
      }
    }

    // Phase 3 : Final : plus d'action
    // Rien à faire
  });

  return <group ref={groupRef}>{children}</group>;
};

// Composant principal : gère l'UI, la génération des données et les sliders
const PieChartSection: React.FC<{ numSlices?: number }> = ({ numSlices = 5 }) => {
  const [data, setData] = useState<SliceData[]>(generatePieData(numSlices));
  const [spacingXY, setSpacingXY] = useState(0); // Écartement radial sur X et Y
  const [spacingXZ, setSpacingXZ] = useState(0); // Écartement sur X et Z
  const thickness = 0.2; // Épaisseur des tranches
  const [showSettings, setShowSettings] = useState(false);
  const [showSliceList, setShowSliceList] = useState(false);
  const [numberOfSlices, setNumberOfSlices] = useState<number>(numSlices);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const groupRef = useRef<THREE.Group>(null!);
  const [animationPhase, setAnimationPhase] = useState<'rollingIn' | 'falling' | 'final'>('rollingIn');

  // Fonction pour régénérer les données et réinitialiser les écartements
  const regenerateData = useCallback(() => {
    setData(generatePieData(numberOfSlices));
    setSpacingXY(0);
    setSpacingXZ(0);
    setHighlightedIndex(null);
    setHoveredIndex(null);
    setAnimationPhase('rollingIn'); // Réinitialiser l'animation
  }, [numberOfSlices]);

  // Fonctions pour ajuster l'écartement
  const adjustSpacingXY = (value: number) => {
    setSpacingXY(value);
  };

  const adjustSpacingXZ = (value: number) => {
    setSpacingXZ(value);
  };

  // Fonction pour gérer la sélection de tranche
  const handleSliceClick = (index: number) => {
    // Si on clique sur la même tranche déjà "mise en avant", on la recentre
    if (highlightedIndex === index) {
      setHighlightedIndex(null);
    } else {
      // Sinon, on change la tranche "mise en avant"
      setHighlightedIndex(index);
    }
  };

  // Gestion du survol
  const handleSliceHover = (index: number) => {
    setHoveredIndex(index);
  };

  const handleSliceUnhover = () => {
    setHoveredIndex(null);
  };

  // Calculer l'offset de base (en fonction des sliders spacingXY / spacingXZ)
  const calculateBaseOffset = (startAngle: number, angle: number): [number, number, number] => {
    const centralAngle = startAngle + angle / 2;

    // Écartement radial basé sur les axes X et Y
    const radialX = Math.cos(centralAngle) * spacingXY;
    const radialY = Math.sin(centralAngle) * spacingXY;

    // Écartement basé sur les axes X et Z
    const xOffset = Math.cos(centralAngle) * spacingXZ;
    const zOffset = Math.sin(centralAngle) * spacingXZ;

    // Combinaison des deux écartements
    const totalX = radialX + xOffset;
    const totalY = radialY;
    const totalZ = zOffset;

    return [totalX, totalY, totalZ];
  };

  // Calculer l'offset supplémentaire si la tranche est highlight (sur X et Z)
  const calculateHighlightOffset = (startAngle: number, angle: number): [number, number, number] => {
    const centralAngle = startAngle + angle / 2;
    const highlightDistance = 0.3; // Ajuster pour plus/moins de décalage

    const highlightOffsetX = Math.cos(centralAngle) * highlightDistance;
    const highlightOffsetZ = Math.sin(centralAngle) * highlightDistance;

    return [highlightOffsetX, 0, highlightOffsetZ];
  };

  return (
    <div className="relative w-full h-screen">
      {/* Canvas */}
      <Canvas
        style={{ background: 'linear-gradient(to bottom, #000428, #004e92)' }}
        camera={{ position: [-1, 1, 5], fov: 50 }} // Position de la caméra
        shadows
      >
        {/* Lumières */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <spotLight position={[-5, 5, 5]} angle={0.3} intensity={1} castShadow />

        {/* Pie Chart Animé avec AnimatedGroup */}
        <AnimatedGroup
          groupRef={groupRef}
          animationPhase={animationPhase}
          setAnimationPhase={setAnimationPhase}
        >
          {data.map((slice, index) => {
            // Calcul offset de base
            const baseOffset = calculateBaseOffset(slice.startAngle, slice.angle);

            // Si la tranche est mise en avant, on ajoute un offset supplémentaire
            const highlightOffset =
              highlightedIndex === index
                ? calculateHighlightOffset(slice.startAngle, slice.angle)
                : [0, 0, 0];

            // Offset final
            const finalOffset: [number, number, number] = [
              baseOffset[0] + highlightOffset[0],
              baseOffset[1] + highlightOffset[1],
              baseOffset[2] + highlightOffset[2],
            ];

            // Déterminer si cette tranche est la mise en avant pour afficher son label
            const showLabel = (spacingXY !== 0 || spacingXZ !== 0) || highlightedIndex === index;

            // Déterminer si cette tranche est survolée
            const isHighlighted = highlightedIndex === index || hoveredIndex === index;

            return (
              <PieSlice
                key={index}
                sliceIndex={index}
                startAngle={slice.startAngle}
                angle={slice.angle}
                color={slice.color}
                thickness={thickness}
                offset={finalOffset} // Calcul des offsets basés sur les sliders et le highlight
                showLabel={showLabel} // Intégration de la condition basée sur les sliders
                isHighlighted={isHighlighted}
                isHovered={hoveredIndex === index}
                onClick={handleSliceClick}
                onHover={handleSliceHover}
                onUnhover={handleSliceUnhover}
              />
            );
          })}
        </AnimatedGroup>

        {/* Contrôles caméra */}
        <OrbitControls enableZoom={true} enableRotate={true} />
      </Canvas>

      {/* Paramètres en Bas à Gauche */}
      <div className="absolute bottom-10 left-10">
        <AnimatePresence>
          {!showSettings ? (
            <motion.button
              key="open-settings"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowSettings(true)}
              className="p-3 bg-gray-800 text-white rounded-full shadow hover:bg-gray-700 focus:outline-none"
              aria-label="Ouvrir les paramètres"
            >
              <FiSettings size={24} />
            </motion.button>
          ) : (
            <motion.div
              key="settings-panel"
              initial={{ opacity: 0, x: -50, y: 50 }} // Animation de bas à gauche
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: -50, y: 50 }}
              transition={{ duration: 0.5 }}
              className="relative p-6 bg-white bg-opacity-75 rounded shadow text-black"
            >
              {/* Bouton pour fermer les paramètres */}
              <button
                onClick={() => setShowSettings(false)}
                className="absolute top-2 right-2 p-1 bg-gray-800 text-white rounded-full hover:bg-gray-700 focus:outline-none"
                aria-label="Fermer les paramètres"
              >
                <FiX size={16} />
              </button>

              <h2 className="text-xl font-bold mb-4">Paramètres du Pie Chart</h2>

              {/* Slider X+Y */}
              <div className="mb-4">
                <label htmlFor="spacingXY" className="block text-sm font-medium text-gray-700 mb-1">
                  Écartement radial (X & Y) : {spacingXY.toFixed(2)}
                </label>
                <input
                  type="range"
                  id="spacingXY"
                  min={0}
                  max={2}  // Ajustez selon vos besoins
                  step={0.01}
                  value={spacingXY}
                  onChange={(e) => adjustSpacingXY(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Slider X+Z */}
              <div className="mb-4">
                <label htmlFor="spacingXZ" className="block text-sm font-medium text-gray-700 mb-1">
                  Écartement (X & Z) : {spacingXZ.toFixed(2)}
                </label>
                <input
                  type="range"
                  id="spacingXZ"
                  min={-4}
                  max={2}  // Ajustez selon vos besoins
                  step={0.01}
                  value={spacingXZ}
                  onChange={(e) => adjustSpacingXZ(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Nombre de tranches */}
              <div className="mb-4">
                <label htmlFor="numberOfSlices" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de tranches :
                </label>
                <input
                  type="number"
                  id="numberOfSlices"
                  value={numberOfSlices}
                  onChange={(e) => setNumberOfSlices(Number(e.target.value))}
                  min={1}
                  max={20}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Bouton Générer */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={regenerateData}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none"
                >
                  <FiRefreshCw className="mr-2" />
                  Générer
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Liste des Tranches en Milieu à Droite */}
      <div className="absolute top-1/2 right-10 transform -translate-y-1/2">
        <AnimatePresence>
          {!showSliceList ? (
            <motion.button
              key="open-slice-list"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowSliceList(true)}
              className="p-3 bg-gray-800 text-white rounded-full shadow hover:bg-gray-700 focus:outline-none"
              aria-label="Ouvrir la liste des tranches"
            >
              <FiList size={24} />
            </motion.button>
          ) : (
            <motion.div
              key="slice-list-panel"
              initial={{ opacity: 0, x: 50, y: 0 }} // Animation venant de la droite
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 50, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative p-6 bg-white bg-opacity-75 rounded shadow text-black"
            >
              {/* Bouton pour fermer la liste des tranches */}
              <button
                onClick={() => setShowSliceList(false)}
                className="absolute top-2 right-2 p-1 bg-gray-800 text-white rounded-full hover:bg-gray-700 focus:outline-none"
                aria-label="Fermer la liste des tranches"
              >
                <FiX size={16} />
              </button>

              <SliceList
                slices={data}
                highlightedIndex={highlightedIndex}
                onClickSlice={handleSliceClick}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tooltip pour les survols */}
      {hoveredIndex !== null && highlightedIndex === null && (
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-75 text-black p-2 rounded shadow-lg pointer-events-none">
          <strong>{data[hoveredIndex].label}</strong>
          <br />
          Valeur: {data[hoveredIndex].value}
          <br />
          Couleur: <span style={{ color: data[hoveredIndex].color }}>{data[hoveredIndex].color}</span>
        </div>
      )}
    </div>
  );
};

export default PieChartSection;