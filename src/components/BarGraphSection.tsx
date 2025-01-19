import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Billboard, Environment, OrbitControls, Text } from '@react-three/drei';
import { animated, useSpring, config } from '@react-spring/three';
import * as THREE from 'three';
import { FiSettings } from 'react-icons/fi';



const socialDataFull = [
  { network: 'Twitter', posts: 15000000, color: 'cyan' },
  { network: 'Instagram', posts: 14000000, color: 'magenta' },
  { network: 'Facebook', posts: 13000000, color: 'blue' },
  { network: 'LinkedIn', posts: 1200000, color: 'navy' },
  { network: 'Snapchat', posts: 1100000, color: 'yellow' },
  { network: 'TikTok', posts: 16000000, color: 'lightblue' },
  { network: 'Reddit', posts: 900000, color: 'orange' },
  { network: 'Pinterest', posts: 800000, color: 'red' },
  { network: 'YouTube', posts: 1000000, color: 'darkred' },
  { network: 'Tumblr', posts: 700000, color: 'purple' },
  { network: 'WhatsApp', posts: 600000, color: 'green' },
  { network: 'WeChat', posts: 5000000, color: 'teal' },
  { network: 'Viber', posts: 400000, color: 'pink' },
  { network: 'Line', posts: 300000, color: 'brown' },
  { network: 'Telegram', posts: 200000, color: 'skyblue' },
  { network: 'Discord', posts: 100000, color: 'indigo' },
  { network: 'Clubhouse', posts: 1500000, color: 'lavender' },
  { network: 'Flickr', posts: 2500000, color: 'coral' },
  { network: 'Periscope', posts: 3500000, color: 'olive' },
  { network: 'Mix', posts: 4500000, color: 'goldenrod' },
];
const generateSocialDataMap = () => {
  const map: { [key: number]: typeof socialDataFull } = {};
  const topCounts = [4, 6, 8, 12, 20];

  topCounts.forEach((count) => {
    map[count] = socialDataFull
      .slice(0, count) // 
      .map((item) => ({
        ...item,
        posts: Math.round(item.posts / 1000000), 
      }));
  });

  return map;
};


const socialDataMap = generateSocialDataMap();
function get3DLayout(numFaces: number, geometry: THREE.BufferGeometry) {
  if (numFaces === 6) {
    return [
      { center: new THREE.Vector3(0, 0, 0.5), normal: new THREE.Vector3(0, 0, 1) },
      { center: new THREE.Vector3(0, 0, -0.5), normal: new THREE.Vector3(0, 0, -1) },
      { center: new THREE.Vector3(0, 0.5, 0), normal: new THREE.Vector3(0, 1, 0) },
      { center: new THREE.Vector3(0, -0.5, 0), normal: new THREE.Vector3(0, -1, 0) },
      { center: new THREE.Vector3(0.5, 0, 0), normal: new THREE.Vector3(1, 0, 0) },
      { center: new THREE.Vector3(-0.5, 0, 0), normal: new THREE.Vector3(-1, 0, 0) },
    ];
  }
  return generateFaceData(geometry).map((d) => ({
    center: new THREE.Vector3(d.center[0], d.center[1], d.center[2]),
    normal: new THREE.Vector3(d.normal[0], d.normal[1], d.normal[2]).normalize(),
  }));
}

/**
 * Exemple de fonction generateFaceData pour regrouper les triangles en fonction de leur normale.
 */
function generateFaceData(geometry: THREE.BufferGeometry) {
  const positionAttr = geometry.getAttribute('position');
  const normalAttr = geometry.getAttribute('normal');

  type FaceGroup = { centers: THREE.Vector3[]; normal: THREE.Vector3 };
  const groups: FaceGroup[] = [];
  const tolerance = 0.1;

  for (let i = 0; i < positionAttr.count; i += 3) {
    const v0 = new THREE.Vector3(
      positionAttr.getX(i),
      positionAttr.getY(i),
      positionAttr.getZ(i)
    );
    const v1 = new THREE.Vector3(
      positionAttr.getX(i + 1),
      positionAttr.getY(i + 1),
      positionAttr.getZ(i + 1)
    );
    const v2 = new THREE.Vector3(
      positionAttr.getX(i + 2),
      positionAttr.getY(i + 2),
      positionAttr.getZ(i + 2)
    );
    const center = new THREE.Vector3().add(v0).add(v1).add(v2).divideScalar(3);
    const triNormal = new THREE.Vector3(
      normalAttr.getX(i),
      normalAttr.getY(i),
      normalAttr.getZ(i)
    ).normalize();

    let found = false;
    for (const g of groups) {
      if (triNormal.angleTo(g.normal) < tolerance) {
        g.centers.push(center);
        found = true;
        break;
      }
    }
    if (!found) {
      groups.push({ centers: [center], normal: triNormal.clone() });
    }
  }

  const faceData: { center: [number, number, number]; normal: [number, number, number] }[] = [];
  groups.forEach((g) => {
    const avg = new THREE.Vector3();
    g.centers.forEach((c) => avg.add(c));
    avg.divideScalar(g.centers.length);
    faceData.push({
      center: [avg.x, avg.y, avg.z],
      normal: [g.normal.x, g.normal.y, g.normal.z],
    });
  });
  return faceData;
}

/**
 * Pour l'arrangement "à plat" (mode « déplié »), on définit
 * un layout 2D : ici les blocs sont alignés sur l'axe X.
 */
function get2DLayout(count: number) {
  // On définit un espacement constant (ici 1) et on centre le tout.
  const spacing = 0.7;
  const startX = -((count - 1) * spacing) / 2;
  const layout = [];
  for (let i = 0; i < count; i++) {
    const x = startX + i * spacing;
    // Ici, la position 2D sera sur l'axe X, avec y = 0 et z = 0.
    // La rotation est fixée pour que le bloc soit debout :
    // Une rotation de -90° autour de l'axe X fait passer l'axe Z en axe Y.
    layout.push({
      center: new THREE.Vector3(x, 0, 0),
      // Pour que la barre soit "debout", on la fait pivoter de -90° autour de X.
      normal: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
    });
  }
  return layout;
}

/**
 * Composant Block : représente le bloc 3D d'un réseau social.
 */
const Block = ({
  position,
  size,
  color,
  onClick,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  onClick?: () => void;
}) => (
  <mesh position={position} onClick={onClick} castShadow receiveShadow>
    <boxGeometry args={size} />
    <meshPhysicalMaterial
      color={color}
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




interface SubdividingBlockProps {
  numFaces: number;
  isUnfolded: boolean;
  toggleUnfold: () => void;
  highlightedNetwork: string | null;
}

const SubdividingBlock = ({
  numFaces,
  isUnfolded,
 
  highlightedNetwork,
}: SubdividingBlockProps) => {
  const [isDivided, setIsDivided] = useState(false);
  const toggleDivide = () => setIsDivided((prev) => !prev);

  // Trier les données pour le top choisi (on utilise le mapping selon le nombre de faces)
  const socialData = [...(socialDataMap[numFaces] || [])].sort((a, b) => b.posts - a.posts);
  const maxPosts = socialData.reduce((max, d) => (d.posts > max ? d.posts : max), 0);

  // Création de la géométrie centrale en fonction du nombre de faces
  let parentGeometry: THREE.BufferGeometry;
  switch (numFaces) {
    case 4:
      parentGeometry = new THREE.TetrahedronGeometry(1);
      break;
    case 6:
      parentGeometry = new THREE.BoxGeometry(1, 1, 1);
      break;
    case 8:
      parentGeometry = new THREE.OctahedronGeometry(1);
      break;
    case 12:
      parentGeometry = new THREE.DodecahedronGeometry(1);
      break;
    case 20:
      parentGeometry = new THREE.IcosahedronGeometry(1);
      break;
    default:
      parentGeometry = new THREE.OctahedronGeometry(1);
  }
  parentGeometry.computeVertexNormals();

  // Layouts 3D et 2D
  const faceLayout3D = get3DLayout(numFaces, parentGeometry);
  const twoDLayout = get2DLayout(socialData.length);
  const { positionY } = useSpring({
    positionY: isUnfolded ? -2 : 0, // Passe de 0 à -2 sur l'axe Y
    config: config.gentle,
  });
  // Animation pour la division
  const springs = useSpring({
    offset: isDivided ? 0.5 : 0,
    scale: isDivided ? 1 : 0,
    config: config.wobbly,
  });

  // Animation pour le dépliage
  const { fraction } = useSpring({
    fraction: isUnfolded ? 1 : 0,
    config: config.gentle,
  });

  // Détermine l'index du réseau mis en avant dans socialData (s'il existe)
  const highlightIndex = socialData.findIndex(
    (d) => d.network === highlightedNetwork
  );

  // SPRING pour faire tourner l'ensemble de la géométrie en mode "assemblé" seulement
  // Si un réseau est sélectionné et qu'on n'est pas en mode déplié, on calcule la rotation cible
  let targetRotation: [number, number, number] = [0, 0, 0];
  if (!isUnfolded && highlightIndex !== -1 && faceLayout3D[highlightIndex]) {
    // On souhaite aligner la normale de la face sélectionnée avec (0,0,1)
    const faceNormal = faceLayout3D[highlightIndex].normal.clone().normalize();
    const targetQuat = new THREE.Quaternion().setFromUnitVectors(faceNormal, new THREE.Vector3(0, 1, 0));
    const targetEuler = new THREE.Euler().setFromQuaternion(targetQuat);
    targetRotation = [targetEuler.x, targetEuler.y, targetEuler.z];
    console.log(targetRotation)
  }
  console.log(targetRotation)
  const { parentRotation } = useSpring<any>({
    parentRotation: targetRotation,
    config: config.gentle,
  });

  return (
    <animated.group rotation={parentRotation}>
    {/* La forme centrale cliquable avec animation de la position */}
    <animated.mesh
      geometry={parentGeometry}
      position-y={positionY}
      onClick={toggleDivide}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial
        color="orange"
        roughness={0.3}
        metalness={0.5}
        transparent
        opacity={1}
        transmission={0.5}
        ior={1.5}
        thickness={0.2}
        reflectivity={0.5}
      />
    </animated.mesh>

      {/* Les blocs pour chaque réseau */}
      {socialData.map((data, i) => {
        if (!faceLayout3D[i] || !twoDLayout[i]) return null;
        const postsScale = data.posts / maxPosts;
        const barHeight = 0.5 + postsScale;

        // Layout 3D
        const c3 = faceLayout3D[i].center;
        const n3 = faceLayout3D[i].normal;
        // Ajustement pour positionner la barre de sorte que sa base touche la face
        const adjustedPosition = c3.clone().add(n3.clone().multiplyScalar(barHeight / 2));

        // Calcul de la rotation pour aligner la barre à la face
        const q3D = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          n3.clone().normalize()
        );
        const e3D = new THREE.Euler().setFromQuaternion(q3D);

        // Layout 2D
        const c2 = twoDLayout[i].center;
        const e2D = twoDLayout[i].rotation;
      
      //  Interpolation de la position en fonction du mode déplié/non déplié
        const animatedPosition = fraction.to((f) => {
          const x = adjustedPosition.x + (c2.x - adjustedPosition.x) * f;
          // Si le bloc est sélectionné en mode déplié, force l'axe X à zéro.

          let y = adjustedPosition.y * (1 - f) + f * ((0.5 + postsScale) / 2);
          if (isUnfolded && data.network === highlightedNetwork) {
            y += 0.5; // soulève de 10 unités
          }
         
          const z = adjustedPosition.z + (c2.z - adjustedPosition.z) * f;
          return [x, y, z];
        });

        // Interpolation de la rotation entre la rotation 3D et la rotation 2D
        const q3 = new THREE.Quaternion().setFromEuler(e3D);
        const q2 = new THREE.Quaternion().setFromEuler(e2D);
        const animatedRotation = fraction.to((f) => {
          const qm = q3.clone().slerp(q2, f);
          const e = new THREE.Euler().setFromQuaternion(qm);
          return [e.x, e.y, e.z];
        });
        const animatedScale = springs.scale.to((s) => {
          if (highlightedNetwork && !isUnfolded) {
            // Si un réseau est sélectionné, cacher les autres barres
            return highlightedNetwork === data.network ? [s, s, s] : [0, 0, 0];
          }
          // Sinon, afficher toutes les barres
          return [s, s, s];
        });
        return (
          <animated.group
            key={i}
            position={animatedPosition as any}
            rotation={animatedRotation as any}
            scale={animatedScale as any}//|| 
             
          >
            <Block
              position={[0, 0, 0]}
              size={[0.5, 0.5, 0.5 + postsScale]}
              color={data.color}
              onClick={toggleDivide}
            />
            <Billboard position={[0, 0, barHeight / 2 + 0.3]}
      rotation={[Math.PI / 2,0,0]}>
             <Text
      
      fontSize={0.15}
      color="white"
      anchorX="center"
      anchorY="bottom"
    >
       
       {highlightedNetwork === data.network ? (
    <>
      <Text fontSize={0.15} color="white" anchorX="center" anchorY="middle">
        avg posts by day: {data.posts}
      </Text>
      <Text fontSize={0.15} color="white" anchorX="center" anchorY="top" position={[0, -0.1, 0]}>
        {data.network}
      </Text>
    </>
  ) : (
    <Text fontSize={0.15} color="white" anchorX="center" anchorY="bottom">
      {data.network}
    </Text>
  )}
    </Text>
            </Billboard>
            
          </animated.group>
        );
      })}
    </animated.group>
  );
};

const BarGraphSection = () => {
  const shapeOptions = [4, 6, 8, 12, 20];

  const [numFaces, setNumFaces] = useState(8);
  const [isUnfolded, setIsUnfolded] = useState(false);
  const [highlightedNetwork, setHighlightedNetwork] = useState<string | null>(null);
 // Réseaux actuellement affichés dans le top sélectionné
 const currentTopNetworks = socialDataMap[numFaces] || [];
  const handleTopSelection = (faces: number) => {
    setNumFaces(faces);
    setHighlightedNetwork(null); // réinitialise la sélection
  };

  // Lorsqu'on clique sur un bouton réseau :
  // En mode non déplié, cela fera tourner la géométrie pour mettre en avant le réseau
  // En mode déplié, cela soulèvera le bloc (cf. SubdividingBlock)
  const handleNetworkHighlight = (network: string) => {
    setHighlightedNetwork((prev) => (prev === network ? null : network));
  };

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* Nouvelle div pour choisir le top (au lieu du dropdown) */}
      <div style={{ position: 'absolute', zIndex: 2, top: 150, left: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {shapeOptions.map((faces) => (
            <button
              key={faces}
              onClick={() => handleTopSelection(faces)}
              style={{
                padding: '10px 20px',
                background: numFaces === faces ? '#004e92' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Top {faces}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des 20 réseaux */}
      <div style={{ position: 'absolute', zIndex: 2, top: 150, right: 20, overflowY:"auto" }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {currentTopNetworks.map((item) => (
            <button
              key={item.network}
              onClick={() => handleNetworkHighlight(item.network)}
              style={{
                padding: '5px 10px',
                background: highlightedNetwork === item.network ? '#004e92' : '#ddd',
                color: highlightedNetwork === item.network ? 'white' : 'black',
                border: '1px solid #ccc',
                borderRadius: '3px',
                cursor: 'pointer',
              }}
            >
              {item.network}
            </button>
          ))}
        </div>
      </div>

      {/* Bouton de basculement du mode déplié */}
      <div style={{ position: 'absolute', zIndex: 2, top: 50, right: 20 }}>
        <button
          onClick={() => setIsUnfolded((prev) => !prev)}
          className="p-2 bg-gray-800 text-white rounded shadow"
          aria-label="Ouvrir les contrôles de génération de données"
        >
          <FiSettings size={24} />
        </button>
      </div>

      <Canvas
        shadows
        camera={{ position: [3, 3, 5], fov: 50 }}
        style={{ background: 'linear-gradient(to bottom, #000428, #004e92)' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.4} />
        <pointLight position={[-5, -5, 5]} intensity={0.5} />
        <Environment preset="night" />

        <SubdividingBlock
          numFaces={numFaces}
          isUnfolded={isUnfolded}
          toggleUnfold={() => setIsUnfolded((prev) => !prev)}
          highlightedNetwork={highlightedNetwork}
        />

        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default BarGraphSection;


