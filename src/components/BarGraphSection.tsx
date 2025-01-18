

// import React, { useState} from 'react';
// import { Canvas} from '@react-three/fiber';
// import { OrbitControls,  Environment } from '@react-three/drei';



// const generateData = () => {
//   const data = [];
//   // Ici, nous générons 7 valeurs aléatoires entre 1 et 10
//   for (let i = 0; i < 7; i++) {
//     data.push(Math.floor(Math.random() * 10) + 1);
//   }
//   return data;
// };

// //
// // Composant d’une barre (représentée par une boîte)
// //
// const Bar = ({ value, index, barWidth, spacing }) => {
//   return (
//     <mesh position={[index * (barWidth + spacing), value / 2, 0]}>
//       {/* La hauteur de la boîte est égale à "value" */}
//       <boxGeometry args={[barWidth, value, barWidth]} />
//       <meshPhysicalMaterial
//   color="teal"
//   roughness={0.3} // Niveau de rugosité
//   metalness={0.5} // Intensité métallique
//   transparent
//   opacity={1} // Transparence
//   transmission={0.5} // Transparence pour simuler du verre ou du plastique
//   ior={1.5} // Indice de réfraction (1.5 pour le verre)
//   thickness={0.2} // Épaisseur virtuelle
//   reflectivity={0.5} // Réflexions
// />
//     </mesh>
//   );
// };

// // Composant principal : gère l'UI, la génération des données et les sliders
// const BarChartSection = () => {

//   const [data, setData] = useState(generateData());
//   const barWidth = 0.8;
//   const spacing = 0.2;

  

//   return (
//     <div style={{ width: "100%", height: "100vh", position: "relative" }}>
//       {/* Bouton pour regénérer les données */}
//       <button
//         onClick={() => setData(generateData())}
//         style={{
//           position: "absolute",
//           zIndex: 1,
//           top: "20px",
//           left: "20px",
//           padding: "10px 15px",
//           background: "#fff",
//           border: "1px solid #ccc",
//           cursor: "pointer",
//         }}
//       >
//         Générer des données
//       </button>

//       <Canvas camera={{ position: [0, 10, 20], fov: 50 }} style={{ background: 'linear-gradient(to bottom, #000428, #004e92)' }}
        
//         shadows>
//         {/* Lumière ambiante et directionnelle */}
//           <ambientLight intensity={0.3} /> {/* Lumière ambiante douce */}
//         <directionalLight position={[5, 5, 5]} intensity={0.8} /> {/* Lumière directionnelle */}
//         <pointLight position={[-5, -5, 5]} intensity={0.5} /> {/* Lumière ponctuelle */}
//         <Environment preset="sunset" /> 
//         {/* Contrôles pour naviguer dans la scène */}
//         <OrbitControls />

       

//         {/* Affichage des barres */}
//         {data.map((value, index) => (
//           <Bar key={index} value={value} index={index} barWidth={barWidth} spacing={spacing} />
//         ))}

        
//       </Canvas>
//     </div>
//   );
// };


// export default BarChartSection;  // Fonction pour relancer l'animation de départ


import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Line, Text } from '@react-three/drei';

/**
 * Génère des données de ventes aléatoires.
 * - 12 mois
 * - 8 catégories par mois
 * Chaque valeur est un volume de ventes (entre 5 et 55).
 */
const generateData = () => {
  const data = [];
  for (let month = 0; month < 12; month++) {
    const monthData = [];
    for (let cat = 0; cat < 8; cat++) {
      monthData.push(Math.floor(Math.random() * 50) + 5);
    }
    data.push(monthData);
  }
  return data;
};

/**
 * Composant d’une barre 3D.
 * La position est définie par l’index du mois (axe X) et de la catégorie (axe Z).
 * La hauteur (axe Y) correspond au volume de ventes.
 */
const Bar = ({ value, monthIndex, catIndex, barWidth, monthSpacing, categorySpacing }: { value: number, monthIndex: number, catIndex: number, barWidth: number, monthSpacing: number, categorySpacing: number }) => {
  return (
    <mesh
      position={[
        monthIndex * monthSpacing, // Axe X : mois
        value / 2,                 // Axe Y : la barre est centrée sur sa hauteur
        catIndex * categorySpacing // Axe Z : catégorie
      ]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[barWidth, value, barWidth]} />
      <meshPhysicalMaterial
        color="teal"
        roughness={0.3}
        metalness={0.5}
        transparent
        opacity={1}
        transmission={0.5}
        ior={1.5}
        thickness={0.2}
        reflectivity={0.5}
      />
    </mesh>
  );
};

/**
 * Composant affichant toutes les barres.
 */
const Bars = ({ data, barWidth = 0.8, monthSpacing = 2, categorySpacing = 2 }: { data: number[][], barWidth?: number, monthSpacing?: number, categorySpacing?: number }) => {
  return data.map((monthData: unknown[], monthIndex: unknown) =>
    monthData.map((value: unknown, catIndex: unknown) => (
      <Bar
        key={`bar-${monthIndex}-${catIndex}`}
        value={value as number}
        monthIndex={monthIndex as number}
        catIndex={catIndex as number}
        barWidth={barWidth}
        monthSpacing={monthSpacing}
        categorySpacing={categorySpacing}
      />
    ))
  );
};

/**
 * Composant Axes :
 * - Axe X : Mois
 * - Axe Y : Volume
 * - Axe Z : Catégories
 * Les axes sont dessinés à l’aide du composant <Line> et des étiquettes avec <Text>.
 */
const Axes = ({ data, monthSpacing = 8, categorySpacing = 8 }: { data: number[][], monthSpacing?: number, categorySpacing?: number }) => {
  // Calcul du volume maximum pour l'axe Y
  const maxVolume = Math.max(...data.flat());
  // Définition des longueurs des axes
  const xLength = (12 - 1) * monthSpacing + monthSpacing;
  const yLength = maxVolume + 10; // marge au-dessus de la plus haute barre
  const zLength = (8 - 1) * categorySpacing + categorySpacing;

  return (
    <>
      {/* Axe X (Mois) */}
      <Line
        points={[[-10, 0, zLength], [xLength, 0, zLength]]}
        color="white"
        lineWidth={4}
      />
      <Text position={[xLength + 0.5, 0, 0]} fontSize={0.5} color="white">
        Mois
      </Text>

      {/* Axe Y (Volume) */}
      <Line
        points={[[-10, 0,-5], [-10, yLength, -5]]}
        color="white"
        lineWidth={4}
      />
      <Text position={[0, yLength + 0.5, 0]} fontSize={0.5} color="white">
        Volume
      </Text>

      {/* Axe Z (Catégories) */}
      <Line
        points={[[-10, 0, -5], [-10, 0, zLength]]}
        color="white"
        lineWidth={4}
      />
      <Text position={[0, 0, zLength + 0.5]} fontSize={0.5} color="white">
        Catégories
      </Text>

      {/* Labels pour chaque mois le long de l'axe X */}
      {Array.from({ length: 12 }, (_, i) => (
        <Text
          key={`label-month-${i}`}
          position={[i * monthSpacing, -0.5, 0]}
          fontSize={0.3}
          color="white"
        >
          {`M${i + 1}`}
        </Text>
      ))}

      {/* Labels pour chaque catégorie le long de l'axe Z */}
      {Array.from({ length: 8 }, (_, i) => (
        <Text
          key={`label-cat-${i}`}
          position={[-0.5, 0, i * categorySpacing]}
          fontSize={0.3}
          color="white"
        >
          {`C${i + 1}`}
        </Text>
      ))}
    </>
  );
};

/**
 * Composant principal affichant le bargraph 3D complet.
 */
const BarChartSection = () => {
  const [data, setData] = useState(generateData());
  // Paramètres d'espacement
  const monthSpacing = 8;
  const categorySpacing = 8;
  const barWidth = 2.8;

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {/* Bouton pour regénérer les données */}
      <button
        onClick={() => setData(generateData())}
        style={{
          position: "absolute",
          zIndex: 1,
          top: "50px",
          left: "20px",
          padding: "10px 15px",
          background: "#fff",
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
      >
        Générer des données
      </button>

      <Canvas
        camera={{ position: [20, 30, 40], fov: 50 }}
        style={{ background: 'linear-gradient(to bottom, #000428, #004e92)' }}
        shadows
      >
        {/* Lumières */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 20, 5]} intensity={0.8} castShadow />
        <pointLight position={[-5, -5, 5]} intensity={0.5} />
        <Environment preset="sunset" />
        {/* Contrôles pour naviguer dans la scène */}
        <OrbitControls />

        {/* Affichage des barres */}
        <Bars
          data={data}
          barWidth={barWidth}
          monthSpacing={monthSpacing}
          categorySpacing={categorySpacing}
        />

        {/* Affichage des axes */}
        <Axes data={data} monthSpacing={monthSpacing} categorySpacing={categorySpacing} />

        {/* Sol pour visualiser le niveau zéro */}
        {/* <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[
            ((12 - 1) * monthSpacing) / 2,
            0,
            ((8 - 1) * categorySpacing) / 2,
          ]}
          receiveShadow
        >
          <planeGeometry args={[25, 20]} />
          <meshStandardMaterial color="#222" side={2} />
        </mesh> */}
      </Canvas>
    </div>
  );
};

export default BarChartSection;