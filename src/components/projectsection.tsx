// import { useEffect, useRef, useState } from 'react';
// import { Canvas, ThreeEvent } from '@react-three/fiber';
// import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
// import * as THREE from 'three';

// import { DATA } from "./skaters";

// export interface NodeType {
//   ip: string;
// }

// export interface LinkType {
//   ip_src: string;
//   ip_dst: string;
//   value: number;
//   proto?: string;
// }

// export interface SankeyNodeProps {
//   position: [number, number, number];
//   size: number;
//   color: string;
//   label: string;
//   onPointerOver: (event: ThreeEvent<PointerEvent>) => void;
//   onPointerMove: (event: ThreeEvent<PointerEvent>) => void;
//   onPointerOut: (event: ThreeEvent<PointerEvent>) => void;
//   onClick: (event: ThreeEvent<MouseEvent>) => void;
//   visible: boolean;
// }

// export interface SankeyLinkProps {
//   start: [number, number, number];
//   end: [number, number, number];
//   color: string;
//   radius: number;
//   visible: boolean;
// }

// export interface SankeyDiagram3DProps {
//   nodes: NodeType[];
//   links: LinkType[];
//   tooltipRef: React.RefObject<HTMLDivElement>;
//   tooltipContentRef: React.RefObject<HTMLDivElement | null>;
//   setHighlightedNode: React.Dispatch<React.SetStateAction<string | null>>;
//   highlightedNode: string | null;
//   hoveredNode: NodeType | null;
//   spacing: { x: number; y: number; z: number };
// }

// export interface MultiProtoProps {
//   data: {
//     nodes: NodeType[];
//     links: LinkType[];
//   };
//   hoveredNode: NodeType | null;
//   spacing: { x: number; y: number; z: number };
// }

// export interface NodeListProps {
//   nodes: NodeType[];
//   onHoverNode: (node: NodeType | null) => void;
// }

// export interface SpacingControlsProps {
//   spacing: { x: number; y: number; z: number };
//   setSpacing: React.Dispatch<React.SetStateAction<{ x: number; y: number; z: number }>>;
// }

// // Composant SankeyNode avec ombres
// const SankeyNode: React.FC<SankeyNodeProps> = ({
//   position,
//   size,
//   color,
//   label,
//   onPointerOver,
//   onPointerMove,
//   onPointerOut,
//   onClick,
//   visible,
// }) => (
//   <>
//     <mesh
//       position={position}
//       onPointerOver={onPointerOver}
//       onPointerMove={onPointerMove}
//       onPointerOut={onPointerOut}
//       onClick={onClick}
//       visible={visible}
//       castShadow // Permet de projeter une ombre
//       receiveShadow // Permet de recevoir des ombres
//     >
//       <sphereGeometry args={[size, 32, 32]} />
//       <meshStandardMaterial color={color} />
//     </mesh>
//     {visible && (
//       <Text
//         position={[position[0], position[1] - size - 1, position[2]]}
//         fontSize={7}
//         color="black"
//         anchorX="center"
//         anchorY="middle"
//       >
//         {label}
//       </Text>
//     )}
//   </>
// );

// // Composant SankeyLink avec ombres
// const SankeyLink: React.FC<SankeyLinkProps> = ({ start, end, color, radius, visible }) => {
//   const ref = useRef<THREE.Mesh>();

//   useEffect(() => {
//     const curve = new THREE.CubicBezierCurve3(
//       new THREE.Vector3(...start),
//       new THREE.Vector3(...start).lerp(new THREE.Vector3(...end), 0.33).setZ(2),
//       new THREE.Vector3(...start).lerp(new THREE.Vector3(...end), 0.66).setZ(2),
//       new THREE.Vector3(...end)
//     );

//     const path = new THREE.CurvePath<THREE.Vector3>();
//     path.add(curve);

//     const tubeGeometry = new THREE.TubeGeometry(path, 50, radius, 18, false);
//     if (ref.current) {
//       ref.current.geometry = tubeGeometry;
//     }
//   }, [start, end, radius]);

//   return (
//     <mesh ref={ref} visible={visible} castShadow>
//       <meshStandardMaterial color={color} opacity={visible ? 0.8 : 0.2} transparent />
//     </mesh>
//   );
// };

// // Composant SankeyDiagram3D avec corrections
// const SankeyDiagram3D: React.FC<SankeyDiagram3DProps> = ({
//   nodes,
//   links,
//   tooltipRef,
//   tooltipContentRef,
//   setHighlightedNode,
//   highlightedNode,
//   hoveredNode,
//   spacing,
// }) => {
//   const nodePositions: { [key: string]: [number, number, number] } = {};
//   const nodeSize = 8; // Taille fixe pour tous les nœuds
//   const verticalSpacing = spacing.y;
//   const horizontalSpacing = spacing.x;
//   const depthSpacing = spacing.z;

//   let sourceIndex = 0;
//   let middleIndex = 0;
//   let targetIndex = 0;
//   const numRows = Math.ceil(Math.sqrt(nodes.length));
//   const nodeDegrees: { [key: string]: number } = {};

//   // Initialisez les degrés à 0 pour tous les nœuds
//   nodes.forEach((node) => {
//     nodeDegrees[node.ip] = 0;
//   });

//   // Calculez le degré de chaque nœud à partir des liens
//   links.forEach((link) => {
//     nodeDegrees[link.ip_src] = (nodeDegrees[link.ip_src] || 0) + 1;
//     nodeDegrees[link.ip_dst] = (nodeDegrees[link.ip_dst] || 0) + 1;
//   });

//   // Ajoutez une taille pour chaque nœud en fonction de son degré
//   const nodesWithSizes = nodes.map((node) => ({
//     ...node,
//     size: Math.max(2, Math.min(10, nodeDegrees[node.ip])) * 2, // Échelle de taille
//   }));

//   const handlePointerOver = (
//     event: ThreeEvent<PointerEvent>,
//     node: NodeType
//   ) => {
//     if (tooltipContentRef.current && tooltipRef.current) {
//       const relatedLinks = links.filter(link => link.ip_src === node.ip || link.ip_dst === node.ip);
//       const content = relatedLinks.map(link => `
//         ${link.ip_src} -> ${link.ip_dst}<br/>
//         Value: ${link.value}<br/>
//         Protocol: ${link.proto || 'N/A'}
//       `).join('<br/>');
//       tooltipContentRef.current.innerHTML = content;
//       tooltipRef.current.style.display = 'block';
//       tooltipRef.current.style.left = event.clientX + 'px'; // Ajuster la position pour être plus proche de la souris
//       tooltipRef.current.style.top = event.clientY + 'px';  // Ajuster la position pour être plus proche de la souris
//     }
//   };

//   const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
//     if (tooltipRef.current) {
//       tooltipRef.current.style.left = event.clientX + 'px';
//       tooltipRef.current.style.top = event.clientY + 'px';
//     }
//   };

//   const handlePointerOut = () => {
//     if (tooltipRef.current) {
//       tooltipRef.current.style.display = 'none';
//     }
//   };

//   const handleClick = (node: NodeType) => {
//     if (highlightedNode === node.ip) {
//       setHighlightedNode(null);
//     } else {
//       setHighlightedNode(node.ip);
//     }
//   };

//   // Première passe : assigner des positions aux nœuds sources
//   nodes.forEach(node => {
//     const isSource = links.some(link => link.ip_src === node.ip);
//     const isTarget = links.some(link => link.ip_dst === node.ip);

//     if (isSource && !isTarget) {
//       const xPosition = -horizontalSpacing;
//       const row = Math.floor(sourceIndex / numRows);
//       const col = sourceIndex % numRows;
//       const yOffset = nodeSize / 2 + verticalSpacing;
//       const yPosition = col * yOffset - (numRows * yOffset) / 2;
//       const zPosition = row * depthSpacing;
//       nodePositions[node.ip] = [xPosition, yPosition, zPosition];
//       sourceIndex += 1;
//     }
//   });

//   // Deuxième passe : assigner des positions aux nœuds intermédiaires
//   nodes.forEach(node => {
//     const isSource = links.some(link => link.ip_src === node.ip);
//     const isTarget = links.some(link => link.ip_dst === node.ip);

//     if (isSource && isTarget) {
//       const xPosition = 0;
//       const row = Math.floor(middleIndex / numRows);
//       const col = middleIndex % numRows;
//       const yOffset = nodeSize / 2 + verticalSpacing;
//       const yPosition = col * yOffset - (numRows * yOffset) / 2;
//       const zPosition = row * depthSpacing;
//       nodePositions[node.ip] = [xPosition, yPosition, zPosition];
//       middleIndex += 1;
//     }
//   });

//   // Troisième passe : assigner des positions aux nœuds cibles
//   nodes.forEach(node => {
//     const isSource = links.some(link => link.ip_src === node.ip);
//     const isTarget = links.some(link => link.ip_dst === node.ip);

//     if (!isSource && isTarget) {
//       const xPosition = horizontalSpacing;
//       const row = Math.floor(targetIndex / numRows);
//       const col = targetIndex % numRows;
//       const yOffset = nodeSize / 2 + verticalSpacing;
//       const yPosition = col * yOffset - (numRows * yOffset) / 2;
//       const zPosition = row * depthSpacing;
//       nodePositions[node.ip] = [xPosition, yPosition, zPosition];
//       targetIndex += 1;
//     }
//   });

//   // Calculer le centre des positions des nœuds
//   const allPositions = Object.values(nodePositions);
//   const centerX = allPositions.reduce((sum, pos) => sum + pos[0], 0) / allPositions.length;
//   const centerY = allPositions.reduce((sum, pos) => sum + pos[1], 0) / allPositions.length;
//   const centerZ = allPositions.reduce((sum, pos) => sum + pos[2], 0) / allPositions.length;

//   // Ajuster les positions des nœuds pour les centrer
//   Object.keys(nodePositions).forEach(ip => {
//     nodePositions[ip][0] -= centerX - 280;
//     nodePositions[ip][1] -= centerY;
//     nodePositions[ip][2] -= centerZ;
//   });

//   // Préparer les chemins des liens avec visibilité correcte
//   const linkPaths = links.map((link) => {
//     const sourcePos = nodePositions[link.ip_src];
//     const targetPos = nodePositions[link.ip_dst];
//     const visible = highlightedNode === null || highlightedNode === link.ip_src || highlightedNode === link.ip_dst;
//     return {
//       start: sourcePos, // Renommé de 'path[0]' à 'start'
//       end: targetPos,   // Renommé de 'path[1]' à 'end'
//       color: `white`,   // Couleur blanche
//       radius: 1.2,      // Épaisseur du tube
//       visible: visible,
//     };
//   });

//   // Calculer les positions des titres
//   const sourceTitlePosition = new THREE.Vector3(-horizontalSpacing - 200, -(numRows * (nodeSize / 2 + verticalSpacing)) / 2 - 20, 0);
//   const middleTitlePosition = new THREE.Vector3(-100, -(numRows * (nodeSize / 2 + verticalSpacing)) / 2 - 20, 0);
//   const targetTitlePosition = new THREE.Vector3(horizontalSpacing - 200, -(numRows * (nodeSize / 2 + verticalSpacing)) / 2 - 20, 0);

//   return (
//     <>
//       <Text position={sourceTitlePosition} fontSize={60} color="black" anchorX="center" anchorY="middle">
//         IP Source
//       </Text>
//       <Text position={middleTitlePosition} fontSize={60} color="black" anchorX="center" anchorY="middle">
//         IP Source/IP Target
//       </Text>
//       <Text position={targetTitlePosition} fontSize={60} color="black" anchorX="center" anchorY="middle">
//         IP Target
//       </Text>
      
//       {/* Rendu des Nœuds */}
//       {nodesWithSizes.map((node, index) => {
//         const isVisible =
//           (highlightedNode === null || highlightedNode === node.ip || links.some(
//             (link) =>
//               (link.ip_src === highlightedNode && link.ip_dst === node.ip) ||
//               (link.ip_dst === highlightedNode && link.ip_src === node.ip)
//           )) &&
//           (hoveredNode === null || node.ip === hoveredNode.ip || links.some(
//             (link) =>
//               (link.ip_src === hoveredNode.ip && link.ip_dst === node.ip) ||
//               (link.ip_dst === hoveredNode.ip && link.ip_src === node.ip)
//           ));

//         return (
//           <SankeyNode
//             key={index}
//             position={nodePositions[node.ip]}
//             size={node.size} // Passez la taille calculée ici
//             color="blue"
//             label={node.ip}
//             onPointerOver={(e) => handlePointerOver(e, node)}
//             onPointerMove={handlePointerMove}
//             onPointerOut={handlePointerOut}
//             onClick={() => handleClick(node)}
//             visible={isVisible}
            
//           />
//         );
//       })}

//       {/* Rendu des Liens */}
//       {linkPaths.map((link, index) => (
//         <SankeyLink
//           key={index}
//           start={link.start}
//           end={link.end}
//           color={link.color}
//           radius={link.radius}
//           visible={link.visible} // Utilisez directement la propriété 'visible' calculée
//         />
//       ))}

//       {/* Sol sous les textes */}
//       <mesh
//   position={[
//     0,
//     -(numRows * (nodeSize / 2 + verticalSpacing)) / 2 - 30,
//     0,
//   ]} // Position sous les textes
//   rotation={[-Math.PI / 2, 0, 0]} // Inclinaison horizontale
//   castShadow // Permet de projeter une ombre
//       receiveShadow // Permet de recevoir des ombres si nécessaire
// >
//   <planeGeometry args={[3000, 3000,]} 

//       />
//     <meshStandardMaterial color="#808080" /> {/* Couleur grise pour le sol */}
// </mesh>
//     </>
//   );
// };

// const MultiProto: React.FC<MultiProtoProps> = ({ data, hoveredNode, spacing }) => {
//   const tooltipRef = useRef<HTMLDivElement>(null);
//   const tooltipContentRef = useRef<HTMLDivElement>(null);
//   const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
//   const { nodes, links } = data;

//   useEffect(() => {
//     const tooltip = tooltipRef.current;
//     if (tooltip) {
//       const handleMouseMove = (event: MouseEvent) => {
//         tooltip.style.left = event.clientX - 280 + 'px';
//         tooltip.style.top = event.clientY - 180 + 'px';
//       };

//       window.addEventListener('mousemove', handleMouseMove);

//       return () => {
//         window.removeEventListener('mousemove', handleMouseMove);
//       };
//     }
//   }, []);

//   return (
//     <div className="h-full relative">
//       <Canvas
//         style={{ background: 'linear-gradient(to bottom, #FFD700, #FF8C00)' }}
//         shadows // Activer les ombres globalement
//       >
//         <PerspectiveCamera makeDefault position={[0, 0, 2400]} far={100000} />
//         <ambientLight intensity={0.5} />
//         <directionalLight
//           castShadow
//           intensity={1}
//           position={[10, 20, 10]}
//           shadow-mapSize-width={1024}
//           shadow-mapSize-height={1024}
//           shadow-camera-far={50}
//           shadow-camera-near={1}
//           shadow-camera-top={10}
//           shadow-camera-bottom={-10}
//           shadow-camera-left={-10}
//           shadow-camera-right={10}
//         />
//         <pointLight position={[10, 10, 10]} />
//         <SankeyDiagram3D
//           nodes={nodes}
//           links={links}
//           tooltipRef={tooltipRef}
//           tooltipContentRef={tooltipContentRef}
//           setHighlightedNode={setHighlightedNode}
//           highlightedNode={highlightedNode}
//           hoveredNode={hoveredNode}
//           spacing={spacing}
//         />
//         <OrbitControls />
//       </Canvas>
//       <div
//         ref={tooltipRef}
//         style={{
//           position: 'absolute',
//           display: 'none',
//           background: 'black',
//           color: 'white', // Assurez-vous que le texte est visible
//           padding: '5px',
//           borderRadius: '5px',
//           boxShadow: '0 0 5px rgba(0,0,0,0.3)',
//           pointerEvents: 'none',
//           transform: 'translate(0%, 0%)',
//           whiteSpace: 'nowrap',
//           maxHeight: '200px',
//           overflowY: 'auto',
//           overflowX: 'hidden'
//         }}
//       >
//         <div ref={tooltipContentRef}></div>
//       </div>
//     </div>
//   );
// };

// const NodeList: React.FC<NodeListProps> = ({ nodes, onHoverNode }) => {
//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Liste des Nœuds</h2>
//       <ul>
//         {nodes.map((node) => (
//           <li
//             key={node.ip}
//             className="p-2 hover:bg-gray-200 cursor-pointer"
//             onMouseEnter={() => onHoverNode(node)}
//             onMouseLeave={() => onHoverNode(null)}
//           >
//             {node.ip}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// const SpacingControls: React.FC<SpacingControlsProps> = ({ spacing, setSpacing }) => {
//   const handleChange = (axis: 'x' | 'y' | 'z', value: number) => {
//     setSpacing((prev) => ({ ...prev, [axis]: value }));
//   };

//   return (
//     <div className="absolute top-0 left-0 mt-4">
//       <h2 className="text-xl font-bold mb-4">Contrôle des Espacements</h2>
//       <div className="mb-4">
//         <label htmlFor="spacingX">Espacement X : {spacing.x}</label>
//         <input
//           id="spacingX"
//           type="range"
//           min="100"
//           max="2000"
//           step="10"
//           value={spacing.x}
//           onChange={(e) => handleChange('x', Number(e.target.value))}
//           className="w-full"
//         />
//       </div>
//       <div className="mb-4">
//         <label htmlFor="spacingY">Espacement Y : {spacing.y}</label>
//         <input
//           id="spacingY"
//           type="range"
//           min="10"
//           max="200"
//           step="1"
//           value={spacing.y}
//           onChange={(e) => handleChange('y', Number(e.target.value))}
//           className="w-full"
//         />
//       </div>
//       <div className="mb-4">
//         <label htmlFor="spacingZ">Espacement Z : {spacing.z}</label>
//         <input
//           id="spacingZ"
//           type="range"
//           min="10"
//           max="200"
//           step="1"
//           value={spacing.z}
//           onChange={(e) => handleChange('z', Number(e.target.value))}
//           className="w-full"
//         />
//       </div>
//     </div>
//   );
// };

// const ProjectsSection: React.FC = () => {
//   const [hoveredNode, setHoveredNode] = useState<NodeType | null>(null);
//   const [spacing, setSpacing] = useState<{ x: number; y: number; z: number }>({
//     x: 800, // Valeurs initiales que vous utilisiez
//     y: 56,
//     z: 48,
//   });

//   return (
//     <div className="relative h-full flex">
//       <div className="flex-grow">
//         <MultiProto data={DATA} hoveredNode={hoveredNode} spacing={spacing} />
//       </div>
//       <div className="absolute top-0 right-0 h-full overflow-y-auto bg-gray-100 p-4">
//         <NodeList nodes={DATA.nodes} onHoverNode={setHoveredNode} />
//       </div>
//       <SpacingControls spacing={spacing} setSpacing={setSpacing} />
//     </div>
//   );
// };

// export default ProjectsSection;

// src/components/ProjectsSection.tsx

// import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
// import { Canvas, ThreeEvent } from '@react-three/fiber';
// import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
// import * as THREE from 'three';

// // Interfaces pour les nœuds et les liens
// export interface NodeType {
//   item: string;
// }

// export interface LinkType {
//   source: string;
//   target: string;
//   value: number;
//   proto?: string;
// }

// export interface SankeyNodeProps {
//   position: [number, number, number];
//   size: number;
//   color: string;
//   label: string;
//   onPointerOver: (event: ThreeEvent<PointerEvent>) => void;
//   onPointerMove: (event: ThreeEvent<PointerEvent>) => void;
//   onPointerOut: (event: ThreeEvent<PointerEvent>) => void;
//   onClick: (event: ThreeEvent<MouseEvent>) => void;
//   visible: boolean;
// }

// export interface SankeyLinkProps {
//   start: [number, number, number];
//   end: [number, number, number];
//   color: string;
//   radius: number;
//   visible: boolean;
// }

// export interface SankeyDiagram3DProps {
//   nodes: NodeType[];
//   links: LinkType[];
//   tooltipRef: React.RefObject<HTMLDivElement>;
//   tooltipContentRef: React.RefObject<HTMLDivElement | null>;
//   setHighlightedNode: React.Dispatch<React.SetStateAction<string | null>>;
//   highlightedNode: string | null;
//   hoveredNode: NodeType | null;
//   spacing: { x: number; y: number; z: number };
// }

// export interface MultiProtoProps {
//   data: {
//     nodes: NodeType[];
//     links: LinkType[];
//   };
//   hoveredNode: NodeType | null;
//   spacing: { x: number; y: number; z: number };
// }

// export interface NodeListProps {
//   nodes: NodeType[];
//   onHoverNode: (node: NodeType | null) => void;
// }

// export interface SpacingControlsProps {
//   spacing: { x: number; y: number; z: number };
//   setSpacing: React.Dispatch<React.SetStateAction<{ x: number; y: number; z: number }>>;
// }

// // Fonction de génération des données
// const protocols = [
//   "Tcp", "Ssl", "IcmpV4", "Ssh", "Http", "Dns", 
//   "Uncategorized", "Nbns", "Mdns", "Snmp", "Ssdp", 
//   "Dhcp4", "Ntp"
// ];

// interface Data {
//   nodes: NodeType[];
//   links: LinkType[];
// }

// const generateData = (numberOfNodes: number, numberOfLinks: number): Data => {
//   const nodes: NodeType[] = [];
//   const links: LinkType[] = [];

//   // Génération des nœuds
//   for (let i = 1; i <= numberOfNodes; i++) {
//     nodes.push({ item: `Item${i}` });
//   }

//   // Génération des liens
//   for (let i = 0; i < numberOfLinks; i++) {
//     const sourceIndex = Math.floor(Math.random() * numberOfNodes);
//     let targetIndex = Math.floor(Math.random() * numberOfNodes);

//     // Assurer que la source et la cible ne soient pas les mêmes
//     while (targetIndex === sourceIndex) {
//       targetIndex = Math.floor(Math.random() * numberOfNodes);
//     }

//     const value = parseFloat((Math.random()).toFixed(6));
//     const proto = protocols[Math.floor(Math.random() * protocols.length)];

//     links.push({
//       value,
//       source: nodes[sourceIndex].item,
//       target: nodes[targetIndex].item,
//       proto
//     });
//   }

//   return { nodes, links };
// };

// // Composant SankeyNode avec ombres
// const SankeyNode: React.FC<SankeyNodeProps> = React.memo(({
//   position,
//   size,
//   color,
//   label,
//   onPointerOver,
//   onPointerMove,
//   onPointerOut,
//   onClick,
//   visible,
// }) => (
//   <>
//     <mesh
//       position={position}
//       onPointerOver={onPointerOver}
//       onPointerMove={onPointerMove}
//       onPointerOut={onPointerOut}
//       onClick={onClick}
//       visible={visible}
//       castShadow
//       receiveShadow
//     >
//       <sphereGeometry args={[size, 32, 32]} />
//       <meshStandardMaterial color={color} />
//     </mesh>
//     {/* {visible && (
//       <Text
//        // position={[position[0], position[1] - size - 1, position[2]]}
//         fontSize={7}
//         color="black"
//         anchorX="center"
//         anchorY="middle"
//       >
//         {label}
//       </Text>
//     )} */}
//   </>
// ));

// // Composant SankeyLink avec ombres
// const SankeyLink: React.FC<SankeyLinkProps> = React.memo(({ start, end, color, radius, visible }) => {
//   const ref = useRef<THREE.Mesh>(null!);

//   const tubeGeometry = useMemo(() => {
//     const curve = new THREE.CubicBezierCurve3(
//       new THREE.Vector3(...start),
//       new THREE.Vector3(...start).lerp(new THREE.Vector3(...end), 0.33).setZ(2),
//       new THREE.Vector3(...start).lerp(new THREE.Vector3(...end), 0.66).setZ(2),
//       new THREE.Vector3(...end)
//     );

//     const path = new THREE.CurvePath<THREE.Vector3>();
//     path.add(curve);

//     return new THREE.TubeGeometry(path, 50, radius, 18, false);
//   }, [start, end, radius]);

//   useEffect(() => {
//     if (ref.current) {
//       ref.current.geometry = tubeGeometry;
//     }
//     // Nettoyage de la géométrie pour éviter les fuites de mémoire
//     return () => {
//       tubeGeometry.dispose();
//     };
//   }, [tubeGeometry]);

//   return (
//     <mesh ref={ref} visible={visible} castShadow>
//       <meshStandardMaterial color={color} opacity={visible ? 0.8 : 0.2} transparent />
//     </mesh>
//   );
// });

// // Composant SankeyDiagram3D avec corrections
// const SankeyDiagram3D: React.FC<SankeyDiagram3DProps> = ({
//   nodes,
//   links,
//   tooltipRef,
//   tooltipContentRef,
//   setHighlightedNode,
//   highlightedNode,
//   hoveredNode,
//   spacing,
// }) => {
//   const nodePositions: { [key: string]: [number, number, number] } = {};
//   const nodeSize = 8; // Taille fixe pour tous les nœuds
//   const verticalSpacing = spacing.y;
//   const horizontalSpacing = spacing.x;
//   const depthSpacing = spacing.z;

//   let sourceIndex = 0;
//   let middleIndex = 0;
//   let targetIndex = 0;
//   const numRows = Math.ceil(Math.sqrt(nodes.length));
//   const nodeDegrees: { [key: string]: number } = {};

//   // Initialisez les degrés à 0 pour tous les nœuds
//   nodes.forEach((node) => {
//     nodeDegrees[node.item] = 0;
//   });

//   // Calculez le degré de chaque nœud à partir des liens
//   links.forEach((link) => {
//     nodeDegrees[link.source] = (nodeDegrees[link.source] || 0) + 1;
//     nodeDegrees[link.target] = (nodeDegrees[link.target] || 0) + 1;
//   });

//   // Ajoutez une taille pour chaque nœud en fonction de son degré
//   const nodesWithSizes = nodes.map((node) => ({
//     ...node,
//     size: Math.max(2, Math.min(10, nodeDegrees[node.item])) * 2, // Échelle de taille
//   }));

//   const handlePointerOver = useCallback(
//     (event: ThreeEvent<PointerEvent>, node: NodeType) => {
//       if (tooltipContentRef.current && tooltipRef.current) {
//         const relatedLinks = links.filter(link => link.source === node.item || link.target === node.item);
//         const content = relatedLinks.map(link => `
//           ${link.source} -> ${link.target}<br/>
//           Value: ${link.value}<br/>
//           Protocol: ${link.proto || 'N/A'}
//         `).join('<br/>');
//         tooltipContentRef.current.innerHTML = content;
//         tooltipRef.current.style.display = 'block';
//         tooltipRef.current.style.left = event.clientX + 'px'; // Ajuster la position pour être plus proche de la souris
//         tooltipRef.current.style.top = event.clientY + 'px';  // Ajuster la position pour être plus proche de la souris
//       }
//     },
//     [links, tooltipContentRef, tooltipRef]
//   );

//   const handlePointerMove = useCallback((event: ThreeEvent<PointerEvent>) => {
//     if (tooltipRef.current) {
//       tooltipRef.current.style.left = event.clientX + 'px';
//       tooltipRef.current.style.top = event.clientY + 'px';
//     }
//   }, [tooltipRef]);

//   const handlePointerOut = useCallback(() => {
//     if (tooltipRef.current) {
//       tooltipRef.current.style.display = 'none';
//     }
//   }, [tooltipRef]);

//   const handleClick = useCallback((node: NodeType) => {
//     if (highlightedNode === node.item) {
//       setHighlightedNode(null);
//     } else {
//       setHighlightedNode(node.item);
//     }
//   }, [highlightedNode, setHighlightedNode]);

//   // Première passe : assigner des positions aux nœuds sources
//   nodes.forEach(node => {
//     const isSource = links.some(link => link.source === node.item);
//     const isTarget = links.some(link => link.target === node.item);

//     if (isSource && !isTarget) {
//       const xPosition = -horizontalSpacing;
//       const row = Math.floor(sourceIndex / numRows);
//       const col = sourceIndex % numRows;
//       const yOffset = nodeSize / 2 + verticalSpacing;
//       const yPosition = col * yOffset - (numRows * yOffset) / 2;
//       const zPosition = row * depthSpacing;
//       nodePositions[node.item] = [xPosition, yPosition, zPosition];
//       sourceIndex += 1;
//     }
//   });

//   // Deuxième passe : assigner des positions aux nœuds intermédiaires
//   nodes.forEach(node => {
//     const isSource = links.some(link => link.source === node.item);
//     const isTarget = links.some(link => link.target === node.item);

//     if (isSource && isTarget) {
//       const xPosition = 0;
//       const row = Math.floor(middleIndex / numRows);
//       const col = middleIndex % numRows;
//       const yOffset = nodeSize / 2 + verticalSpacing;
//       const yPosition = col * yOffset - (numRows * yOffset) / 2;
//       const zPosition = row * depthSpacing;
//       nodePositions[node.item] = [xPosition, yPosition, zPosition];
//       middleIndex += 1;
//     }
//   });

//   // Troisième passe : assigner des positions aux nœuds cibles
//   nodes.forEach(node => {
//     const isSource = links.some(link => link.source === node.item);
//     const isTarget = links.some(link => link.target === node.item);

//     if (!isSource && isTarget) {
//       const xPosition = horizontalSpacing;
//       const row = Math.floor(targetIndex / numRows);
//       const col = targetIndex % numRows;
//       const yOffset = nodeSize / 2 + verticalSpacing;
//       const yPosition = col * yOffset - (numRows * yOffset) / 2;
//       const zPosition = row * depthSpacing;
//       nodePositions[node.item] = [xPosition, yPosition, zPosition];
//       targetIndex += 1;
//     }
//   });

//   // Calculer le centre des positions des nœuds
//   const allPositions = Object.values(nodePositions);
//   const centerX = allPositions.reduce((sum, pos) => sum + pos[0], 0) / allPositions.length;
//   const centerY = allPositions.reduce((sum, pos) => sum + pos[1], 0) / allPositions.length;
//   const centerZ = allPositions.reduce((sum, pos) => sum + pos[2], 0) / allPositions.length;

//   // Ajuster les positions des nœuds pour les centrer
//   Object.keys(nodePositions).forEach(item => {
//     nodePositions[item][0] -= centerX - 280;
//     nodePositions[item][1] -= centerY;
//     nodePositions[item][2] -= centerZ;
//   });

//   // Préparer les chemins des liens avec visibilité correcte
//   const linkPaths = links.map((link) => {
//     const sourcePos = nodePositions[link.source];
//     const targetPos = nodePositions[link.target];
//     const visible = highlightedNode === null || highlightedNode === link.source || highlightedNode === link.target;
//     return {
//       start: sourcePos,
//       end: targetPos,
//       color: `lightblue`,
//       radius: 1.2,
//       visible: visible,
//     };
//   });

//   // Calculer les positions des titres
//   const sourceTitlePosition = new THREE.Vector3(-horizontalSpacing - 200, -(numRows * (nodeSize / 2 + verticalSpacing)) / 2 - 20, 0);
//   const middleTitlePosition = new THREE.Vector3(-100, -(numRows * (nodeSize / 2 + verticalSpacing)) / 2 - 20, 0);
//   const targetTitlePosition = new THREE.Vector3(horizontalSpacing - 200, -(numRows * (nodeSize / 2 + verticalSpacing)) / 2 - 20, 0);

//   return (
//     <>
//       {/* <Text position={sourceTitlePosition} fontSize={60} color="black" anchorX="center" anchorY="middle">
//         Item Source
//       </Text>
//       <Text position={middleTitlePosition} fontSize={60} color="black" anchorX="center" anchorY="middle">
//         Item Source/Item Target
//       </Text>
//       <Text position={targetTitlePosition} fontSize={60} color="black" anchorX="center" anchorY="middle">
//         Item Target
//       </Text> */}
      
//       {/* Rendu des Nœuds */}
//       {nodesWithSizes.map((node, index) => {
//         const isVisible =
//           (highlightedNode === null || highlightedNode === node.item || links.some(
//             (link) =>
//               (link.source === highlightedNode && link.target === node.item) ||
//               (link.target === highlightedNode && link.source === node.item)
//           )) &&
//           (hoveredNode === null || node.item === hoveredNode.item || links.some(
//             (link) =>
//               (link.source === hoveredNode.item && link.target === node.item) ||
//               (link.target === hoveredNode.item && link.source === node.item)
//           ));

//         return (
//           <SankeyNode
//             key={index}
//             position={nodePositions[node.item]}
//             size={node.size}
//             color="blue"
//             label={node.item}
//             onPointerOver={(e) => handlePointerOver(e, node)}
//             onPointerMove={handlePointerMove}
//             onPointerOut={handlePointerOut}
//             onClick={() => handleClick(node)}
//             visible={isVisible}
//           />
//         );
//       })}

//       {/* Rendu des Liens */}
//       {linkPaths.map((link, index) => (
//         <SankeyLink
//           key={index}
//           start={link.start}
//           end={link.end}
//           color={link.color}
//           radius={link.radius}
//           visible={link.visible}
//         />
//       ))}

//       {/* Sol sous les textes */}
//       {/* <mesh
//         position={[
//           0,
//           -(numRows * (nodeSize / 2 + verticalSpacing)) / 2 - 30,
//           0,
//         ]}
//         rotation={[-Math.PI / 2, 0, 0]}
//         castShadow
//         receiveShadow
//       >
//         <planeGeometry args={[3000, 3000]} />
//         <meshStandardMaterial color="#808080" />
//       </mesh> */}
//     </>
//   );
// };

// const MultiProto: React.FC<MultiProtoProps> = ({ data, hoveredNode, spacing }) => {
//   const tooltipRef = useRef<HTMLDivElement>(null);
//   const tooltipContentRef = useRef<HTMLDivElement>(null);
//   const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
//   const { nodes, links } = data;

//   useEffect(() => {
//     const tooltip = tooltipRef.current;
//     if (tooltip) {
//       const handleMouseMove = (event: MouseEvent) => {
//         tooltip.style.left = event.clientX - 280 + 'px';
//         tooltip.style.top = event.clientY - 180 + 'px';
//       };

//       window.addEventListener('mousemove', handleMouseMove);

//       return () => {
//         window.removeEventListener('mousemove', handleMouseMove);
//       };
//     }
//   }, []);

//   return (
//     <div className="h-full relative">
//       <Canvas
//         style={{ background: 'linear-gradient(to bottom, #FFD700, #FF8C00)' }}
//         shadows
//       >
//         <PerspectiveCamera makeDefault position={[0, 0, 2400]} far={100000} />
//         <ambientLight intensity={0.5} />
//         <directionalLight
//           castShadow
//           intensity={1}
//           position={[10, 20, 10]}
//           shadow-mapSize-width={1024}
//           shadow-mapSize-height={1024}
//           shadow-camera-far={50}
//           shadow-camera-near={1}
//           shadow-camera-top={10}
//           shadow-camera-bottom={-10}
//           shadow-camera-left={-10}
//           shadow-camera-right={10}
//         />
//         <pointLight position={[10, 10, 10]} />
//         <SankeyDiagram3D
//           nodes={nodes}
//           links={links}
//           tooltipRef={tooltipRef}
//           tooltipContentRef={tooltipContentRef}
//           setHighlightedNode={setHighlightedNode}
//           highlightedNode={highlightedNode}
//           hoveredNode={hoveredNode}
//           spacing={spacing}
//         />
//         <OrbitControls />
//       </Canvas>
//       <div
//         ref={tooltipRef}
//         style={{
//           position: 'absolute',
//           display: 'none',
//           background: 'black',
//           color: 'white',
//           padding: '5px',
//           borderRadius: '5px',
//           boxShadow: '0 0 5px rgba(0,0,0,0.3)',
//           pointerEvents: 'none',
//           transform: 'translate(0%, 0%)',
//           whiteSpace: 'nowrap',
//           maxHeight: '200px',
//           overflowY: 'auto',
//           overflowX: 'hidden'
//         }}
//       >
//         <div ref={tooltipContentRef}></div>
//       </div>
//     </div>
//   );
// };

// const NodeList: React.FC<NodeListProps> = ({ nodes, onHoverNode }) => {
//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Liste des Nœuds</h2>
//       <ul>
//         {nodes.map((node) => (
//           <li
//             key={node.item}
//             className="p-2 hover:bg-gray-200 cursor-pointer"
//             onMouseEnter={() => onHoverNode(node)}
//             onMouseLeave={() => onHoverNode(null)}
//             tabIndex={0}
//             aria-label={`Node ${node.item}`}
//           >
//             {node.item}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// const SpacingControls: React.FC<SpacingControlsProps> = ({ spacing, setSpacing }) => {
//   const handleChange = (axis: 'x' | 'y' | 'z', value: number) => {
//     setSpacing((prev) => ({ ...prev, [axis]: value }));
//   };

//   return (
//     <div className="absolute top-0 left-0 mt-4">
//       <h2 className="text-xl font-bold mb-4">Contrôle des Espacements</h2>
//       <div className="mb-4">
//         <label htmlFor="spacingX">Espacement X : {spacing.x}</label>
//         <input
//           id="spacingX"
//           type="range"
//           min="100"
//           max="2000"
//           step="10"
//           value={spacing.x}
//           onChange={(e) => handleChange('x', Number(e.target.value))}
//           className="w-full"
//         />
//       </div>
//       <div className="mb-4">
//         <label htmlFor="spacingY">Espacement Y : {spacing.y}</label>
//         <input
//           id="spacingY"
//           type="range"
//           min="10"
//           max="200"
//           step="1"
//           value={spacing.y}
//           onChange={(e) => handleChange('y', Number(e.target.value))}
//           className="w-full"
//         />
//       </div>
//       <div className="mb-4">
//         <label htmlFor="spacingZ">Espacement Z : {spacing.z}</label>
//         <input
//           id="spacingZ"
//           type="range"
//           min="10"
//           max="200"
//           step="1"
//           value={spacing.z}
//           onChange={(e) => handleChange('z', Number(e.target.value))}
//           className="w-full"
//         />
//       </div>
//     </div>
//   );
// };

// const ProjectsSection: React.FC = () => {
//   // États pour le nombre de nœuds et de liens
//   const [numberOfNodes, setNumberOfNodes] = useState<number>(50);
//   const [numberOfLinks, setNumberOfLinks] = useState<number>(100);

//   // Génération des données avec useMemo pour éviter les recalculs inutiles
//   const DATA = useMemo(() => generateData(numberOfNodes, numberOfLinks), [numberOfNodes, numberOfLinks]);

//   const [hoveredNode, setHoveredNode] = useState<NodeType | null>(null);
//   const [spacing, setSpacing] = useState<{ x: number; y: number; z: number }>({
//     x: 800, // Valeurs initiales que vous utilisiez
//     y: 56,
//     z: 48,
//   });

//   return (
//     <div className="relative h-full flex">
//       <div className="flex-grow">
//         <MultiProto data={DATA} hoveredNode={hoveredNode} spacing={spacing} />
//       </div>
//       <div className="absolute top-0 right-0 h-full overflow-y-auto bg-gray-100 p-4">
//         <NodeList nodes={DATA.nodes} onHoverNode={setHoveredNode} />
//       </div>
//       <SpacingControls spacing={spacing} setSpacing={setSpacing} />

//       {/* Contrôles pour générer les données dynamiquement */}
//       <div className="absolute bottom-0 left-0 p-4 bg-white bg-opacity-75">
//         <h2 className="text-xl font-bold mb-4">Générer des Données</h2>
//         <div className="mb-4">
//           <label htmlFor="numberOfNodes">Nombre de Nœuds:</label>
//           <input
//             type="number"
//             id="numberOfNodes"
//             value={numberOfNodes}
//             onChange={(e) => setNumberOfNodes(Number(e.target.value))}
//             min={1}
//             max={500}
//             className="ml-2 p-1 border rounded"
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="numberOfLinks">Nombre de Liens:</label>
//           <input
//             type="number"
//             id="numberOfLinks"
//             value={numberOfLinks}
//             onChange={(e) => setNumberOfLinks(Number(e.target.value))}
//             min={0}
//             max={1000}
//             className="ml-2 p-1 border rounded"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectsSection;

// src/components/ProjectsSection.tsx

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';

// Interfaces pour les nœuds et les liens
export interface NodeType {
  item: string;
  type: 'source' | 'source/target' | 'target';
}

export interface LinkType {
  source: string;
  target: string;
  value: number;
  proto?: string;
}

export interface SankeyNodeProps {
  position: [number, number, number];
  size: number;
  color: string;
  label: string;
  onHover: () => void;
  onUnhover: () => void;
  onClick: () => void;
  visible: boolean;
  isHighlighted: boolean;
}

export interface SankeyLinkProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  radius: number;
  visible: boolean;
}

export interface SankeyDiagram3DProps {
  nodes: NodeType[];
  links: LinkType[];
  setHoveredNode: React.Dispatch<React.SetStateAction<NodeType | null>>;
  setHighlightedNode: React.Dispatch<React.SetStateAction<string | null>>;
  highlightedNode: string | null;
  hoveredNode: NodeType | null;
  spacing: { x: number; y: number; z: number };
  isRotating: boolean;
}

export interface MultiProtoProps {
  data: {
    nodes: NodeType[];
    links: LinkType[];
  };
  hoveredNode: NodeType | null;
  setHoveredNode: React.Dispatch<React.SetStateAction<NodeType | null>>;
  highlightedNode: string | null;
  setHighlightedNode: React.Dispatch<React.SetStateAction<string | null>>;
  spacing: { x: number; y: number; z: number };
  isRotating: boolean;
}

export interface NodeListProps {
  nodes: NodeType[];
  links: LinkType[];
  onHoverNode: (node: NodeType | null) => void;
  onClickNode: (node: NodeType | null) => void;
  highlightedNode: string | null;
}

export interface SpacingControlsProps {
  spacing: { x: number; y: number; z: number };
  setSpacing: React.Dispatch<React.SetStateAction<{ x: number; y: number; z: number }>>;
}

// Liste des protocoles possibles
const protocols = [
  'Tcp',
  'Ssl',
  'IcmpV4',
  'Ssh',
  'Http',
  'Dns',
  'Uncategorized',
  'Nbns',
  'Mdns',
  'Snmp',
  'Ssdp',
  'Dhcp4',
  'Ntp',
];

// Interface pour les données générées
interface Data {
  nodes: NodeType[];
  links: LinkType[];
}

// Fonction de génération des données
const generateData = (
  numberOfSourceNodes: number,
  numberOfMiddleNodes: number,
  numberOfTargetNodes: number,
  numberOfLinks: number
): Data => {
  const nodes: NodeType[] = [];
  const links: LinkType[] = [];

  // Génération des nœuds sources
  for (let i = 1; i <= numberOfSourceNodes; i++) {
    nodes.push({ item: `Source${i}`, type: 'source' });
  }

  // Génération des nœuds source/target
  for (let i = 1; i <= numberOfMiddleNodes; i++) {
    nodes.push({ item: `SourceTarget${i}`, type: 'source/target' });
  }

  // Génération des nœuds cibles
  for (let i = 1; i <= numberOfTargetNodes; i++) {
    nodes.push({ item: `Target${i}`, type: 'target' });
  }

  const totalNodes = nodes.length;

  // Génération des liens
  for (let i = 0; i < numberOfLinks; i++) {
    let sourceIndex = Math.floor(Math.random() * totalNodes);
    let targetIndex = Math.floor(Math.random() * totalNodes);

    // S'assurer que la source et la cible ne sont pas les mêmes
    while (targetIndex === sourceIndex) {
      targetIndex = Math.floor(Math.random() * totalNodes);
    }

    const sourceNode = nodes[sourceIndex];
    const targetNode = nodes[targetIndex];

    const value = parseFloat((Math.random() * 100).toFixed(2)); // Valeur entre 0 et 100
    const proto = protocols[Math.floor(Math.random() * protocols.length)];

    links.push({
      value,
      source: sourceNode.item,
      target: targetNode.item,
      proto,
    });
  }

  return { nodes, links };
};

// Composant SankeyNode avec ombres et surbrillance
const SankeyNode: React.FC<SankeyNodeProps> = React.memo(
  ({ position, size, color, label, onHover, onUnhover, onClick, visible, isHighlighted }) => (
    <>
      <mesh
        position={position}
        onPointerOver={onHover}
        onPointerOut={onUnhover}
        onClick={onClick}
        visible={visible}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={isHighlighted ? '#FFFF00' : color}
          emissive={isHighlighted ? '#FFFF00' : 'black'}
          emissiveIntensity={isHighlighted ? 0.5 : 0}
        />
      </mesh>
      {visible && (
        <Text
          position={[position[0], position[1] - size - 2, position[2]]} // Léger ajustement
          fontSize={7}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </>
  )
);

// Composant SankeyLink avec ombres
const SankeyLink: React.FC<SankeyLinkProps> = React.memo(({ start, end, color, radius, visible }) => {
  const ref = useRef<THREE.Mesh>(null!);

  const tubeGeometry = useMemo(() => {
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(...start).lerp(new THREE.Vector3(...end), 0.33).setZ(start[2] + 5),
      new THREE.Vector3(...start).lerp(new THREE.Vector3(...end), 0.66).setZ(start[2] + 5),
      new THREE.Vector3(...end)
    );

    const path = new THREE.CurvePath<THREE.Vector3>();
    path.add(curve);

    return new THREE.TubeGeometry(path, 100, radius, 8, false);
  }, [start, end, radius]);

  useEffect(() => {
    if (ref.current) {
      ref.current.geometry = tubeGeometry;
    }
    // Nettoyage de la géométrie pour éviter les fuites de mémoire
    return () => {
      tubeGeometry.dispose();
    };
  }, [tubeGeometry]);

  return (
    <mesh ref={ref} visible={visible} castShadow>
      <meshStandardMaterial color={color} opacity={visible ? 0.8 : 0.2} transparent />
    </mesh>
  );
});

// Composant Particle pour les effets d'animation des liens
interface ParticleProps {
  curve: THREE.Curve<THREE.Vector3>;
}

const Particle: React.FC<ParticleProps> = ({ curve }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [progress, setProgress] = useState<number>(0);

  useFrame((state, delta) => {
    setProgress((prev) => (prev + delta * 0.5) % 1); // Ajuster la vitesse ici
    const point = curve.getPoint(progress);
    meshRef.current.position.set(point.x, point.y, point.z);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[5, 8, 8]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

// Composant SankeyDiagram3D avec corrections
const SankeyDiagram3D: React.FC<SankeyDiagram3DProps> = ({
  nodes,
  links,
  setHoveredNode,
  setHighlightedNode,
  highlightedNode,
  hoveredNode,
  spacing,
  isRotating,
}) => {
  const nodePositions: { [key: string]: [number, number, number] } = {};
  const nodeSize = 8; // Taille fixe pour tous les nœuds
  const verticalSpacing = spacing.y;
  const horizontalSpacing = spacing.x;
  const depthSpacing = spacing.z;

  let sourceIndex = 0;
  let middleIndex = 0;
  let targetIndex = 0;
  const numRows = Math.ceil(Math.sqrt(nodes.length / 3)); // Ajustement pour trois catégories
  const nodeDegrees: { [key: string]: number } = {};

  // Initialiser les degrés à 0 pour tous les nœuds
  nodes.forEach((node) => {
    nodeDegrees[node.item] = 0;
  });

  // Calculer le degré de chaque nœud à partir des liens
  links.forEach((link) => {
    nodeDegrees[link.source] = (nodeDegrees[link.source] || 0) + 1;
    nodeDegrees[link.target] = (nodeDegrees[link.target] || 0) + 1;
  });

  // Ajouter une taille pour chaque nœud en fonction de son degré
  const nodesWithSizes = nodes.map((node) => ({
    ...node,
    size: Math.max(2, Math.min(10, nodeDegrees[node.item])) * 1.5, // Échelle de taille ajustée
  }));

  // Assigner des positions aux nœuds
  nodes.forEach((node) => {
    if (node.type === 'source') {
      const xPosition = -horizontalSpacing;
      const row = Math.floor(sourceIndex / numRows);
      const col = sourceIndex % numRows;
      const yOffset = nodeSize + verticalSpacing;
      const yPosition = col * yOffset - ((numRows - 1) * yOffset) / 2;
      const zPosition = row * depthSpacing;
      nodePositions[node.item] = [xPosition, yPosition, zPosition];
      sourceIndex += 1;
    }
  });

  nodes.forEach((node) => {
    if (node.type === 'source/target') {
      const xPosition = 0;
      const row = Math.floor(middleIndex / numRows);
      const col = middleIndex % numRows;
      const yOffset = nodeSize + verticalSpacing;
      const yPosition = col * yOffset - ((numRows - 1) * yOffset) / 2;
      const zPosition = row * depthSpacing;
      nodePositions[node.item] = [xPosition, yPosition, zPosition];
      middleIndex += 1;
    }
  });

  nodes.forEach((node) => {
    if (node.type === 'target') {
      const xPosition = horizontalSpacing;
      const row = Math.floor(targetIndex / numRows);
      const col = targetIndex % numRows;
      const yOffset = nodeSize + verticalSpacing;
      const yPosition = col * yOffset - ((numRows - 1) * yOffset) / 2;
      const zPosition = row * depthSpacing;
      nodePositions[node.item] = [xPosition, yPosition, zPosition];
      targetIndex += 1;
    }
  });

  // Calculer le centre des positions des nœuds
  const allPositions = Object.values(nodePositions);
  const centerX = allPositions.reduce((sum, pos) => sum + pos[0], 0) / allPositions.length;
  const centerY = allPositions.reduce((sum, pos) => sum + pos[1], 0) / allPositions.length;
  const centerZ = allPositions.reduce((sum, pos) => sum + pos[2], 0) / allPositions.length;

  // Ajuster les positions des nœuds pour centrer le graphe
  Object.keys(nodePositions).forEach((item) => {
    nodePositions[item][0] -= centerX;
    nodePositions[item][1] -= centerY;
    nodePositions[item][2] -= centerZ;
  });

  // Préparer les chemins des liens avec visibilité correcte
  const linkPaths = links.map((link) => {
    const sourcePos = nodePositions[link.source];
    const targetPos = nodePositions[link.target];
    const visible = highlightedNode === null || highlightedNode === link.source || highlightedNode === link.target;
    return {
      start: sourcePos,
      end: targetPos,
      color: `white`,
      radius: 1.2,
      visible: visible,
    };
  });

  // Calculer les positions des titres et ajuster leur hauteur
  const titleYOffset = 10; // Ajuster cette valeur pour élever les textes
  const sourceTitlePosition = new THREE.Vector3(
    -horizontalSpacing,
    -(numRows * (nodeSize + verticalSpacing)) / 2 - 10 + titleYOffset,
    0
  );
  const middleTitlePosition = new THREE.Vector3(
    0,
    -(numRows * (nodeSize + verticalSpacing)) / 2 - 10 + titleYOffset,
    0
  );
  const targetTitlePosition = new THREE.Vector3(
    horizontalSpacing,
    -(numRows * (nodeSize + verticalSpacing)) / 2 - 10 + titleYOffset,
    0
  );

  // Gérer la rotation
  const groupRef = useRef<THREE.Group>(null!);
  useFrame(() => {
    if (isRotating && groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  // Générer des particules lors du survol d'un nœud
  const [particles, setParticles] = useState<{ key: string; curve: THREE.Curve<THREE.Vector3> }[]>([]);

  useEffect(() => {
    if (hoveredNode) {
      const relatedLinks = links.filter(
        (link) => link.source === hoveredNode.item || link.target === hoveredNode.item
      );
      const newParticles = relatedLinks.map((link) => {
        const start = nodePositions[link.source];
        const end = nodePositions[link.target];
        const curve = new THREE.CubicBezierCurve3(
          new THREE.Vector3(...start),
          new THREE.Vector3(...start).lerp(new THREE.Vector3(...end), 0.33).setZ(start[2] + 5),
          new THREE.Vector3(...start).lerp(new THREE.Vector3(...end), 0.66).setZ(start[2] + 5),
          new THREE.Vector3(...end)
        );
        return { key: `${link.source}-${link.target}`, curve };
      });
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [hoveredNode, links, nodePositions]);

  return (
    <>
      <group ref={groupRef}>
        {/* Titres des Colonnes */}
        <Text position={sourceTitlePosition} fontSize={60} color="white" anchorX="center" anchorY="middle">
          Item Source
        </Text>
        <Text position={middleTitlePosition} fontSize={60} color="white" anchorX="center" anchorY="middle">
          Item Source/Item Target
        </Text>
        <Text position={targetTitlePosition} fontSize={60} color="white" anchorX="center" anchorY="middle">
          Item Target
        </Text>

        {/* Rendu des Nœuds */}
        {nodesWithSizes.map((node, index) => {
          const isVisible =
            highlightedNode === null ||
            highlightedNode === node.item ||
            links.some(
              (link) =>
                (link.source === highlightedNode && link.target === node.item) ||
                (link.target === highlightedNode && link.source === node.item)
            );

          // Définir la couleur du nœud en fonction de son type
          let nodeColor = '#1E90FF'; // DodgerBlue pour 'source'
          if (node.type === 'source') nodeColor = '#1E90FF'; // DodgerBlue
          if (node.type === 'source/target') nodeColor = '#32CD32'; // LimeGreen
          if (node.type === 'target') nodeColor = '#FFA500'; // Orange

          return (
            <SankeyNode
              key={index}
              position={nodePositions[node.item]}
              size={node.size}
              color={nodeColor}
              label={node.item}
              onHover={() => setHoveredNode(node)}
              onUnhover={() => setHoveredNode(null)}
              onClick={() => {
                if (highlightedNode === node.item) {
                  setHighlightedNode(null);
                } else {
                  setHighlightedNode(node.item);
                }
              }}
              visible={isVisible}
              isHighlighted={highlightedNode === node.item}
            />
          );
        })}

        {/* Rendu des Liens */}
        {linkPaths.map((link, index) => (
          <SankeyLink
            key={index}
            start={link.start}
            end={link.end}
            color={link.color}
            radius={link.radius}
            visible={link.visible}
          />
        ))}

        {/* Rendu des Particules */}
        {particles.map((particle) => (
          <Particle key={particle.key} curve={particle.curve} />
        ))}

        {/* Sol */}
        {/* <mesh
          position={[0, -(numRows * (nodeSize + verticalSpacing)) / 2 - 30, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          castShadow
          receiveShadow
        >
          <planeGeometry args={[3000, 3000]} />
          <meshStandardMaterial color="#404040" />
        </mesh> */}
      </group>
    </>
  );
};

// Composant MultiProto
const MultiProto: React.FC<MultiProtoProps> = ({
  data,
  hoveredNode,
  setHoveredNode,
  highlightedNode,
  setHighlightedNode,
  spacing,
  isRotating,
}) => {
  return (
    <Canvas
      style={{ background: 'linear-gradient(to bottom, #000428, #004e92)' }} // Fond dégradé sombre
      shadows
    >
      <PerspectiveCamera makeDefault position={[0, 0, 2400]} far={100000} />
      <ambientLight intensity={0.3} />
      <directionalLight
        castShadow
        intensity={1}
        position={[10, 20, 10]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={100}
        shadow-camera-near={0.1}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-camera-left={-50}
        shadow-camera-right={50}
      />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <SankeyDiagram3D
        nodes={data.nodes}
        links={data.links}
        setHoveredNode={setHoveredNode}
        setHighlightedNode={setHighlightedNode}
        highlightedNode={highlightedNode}
        hoveredNode={hoveredNode}
        spacing={spacing}
        isRotating={isRotating}
      />
      <OrbitControls />
    </Canvas>
  );
};

// Composant NodeList avec tooltip sur le survol et gestion du clic
const NodeList: React.FC<NodeListProps> = ({ nodes, links, onHoverNode, onClickNode, highlightedNode }) => {
  const [tooltip, setTooltip] = useState<{ visible: boolean; content: string; x: number; y: number }>({
    visible: false,
    content: '',
    x: 0,
    y: 0,
  });

  const handleMouseEnter = (node: NodeType, event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    // Compter les liens liés
    const relatedLinks = links.filter((link) => link.source === node.item || link.target === node.item).length;

    const content = `
      <strong>${node.item}</strong><br/>
      Type: ${node.type}<br/>
      Number of Links: ${relatedLinks}
    `;
    setTooltip({
      visible: true,
      content,
      x: event.clientX + 10,
      y: event.clientY + 10,
    });
    onHoverNode(node);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    setTooltip((prev) => ({
      ...prev,
      x: event.clientX + 10,
      y: event.clientY + 10,
    }));
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
    onHoverNode(null);
  };

  const handleClick = (node: NodeType) => {
    if (node.item === highlightedNode) {
      onClickNode(null); // Réinitialiser si déjà mis en évidence
    } else {
      onClickNode(node); // Mettre en évidence le nœud cliqué
    }
  };

  return (
    <div className="relative p-4">
      <h2 className="text-xl font-bold mb-4 text-white">Node List</h2>
      <ul>
        {nodes.map((node) => (
          <li
            key={node.item}
            className={`p-2 cursor-pointer rounded ${
              highlightedNode === node.item ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
            onMouseEnter={(e) => handleMouseEnter(node, e)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(node)}
            tabIndex={0}
            aria-label={`Node ${node.item}`}
          >
            {node.item}
          </li>
        ))}
      </ul>
      {tooltip.visible && (
        <div
          style={{
            position: 'absolute',
            top: tooltip.y,
            left: tooltip.x,
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: tooltip.content }} />
        </div>
      )}
    </div>
  );
};

// Composant SpacingControls
const SpacingControls: React.FC<SpacingControlsProps> = ({ spacing, setSpacing }) => {
  const handleChange = (axis: 'x' | 'y' | 'z', value: number) => {
    setSpacing((prev) => ({ ...prev, [axis]: value }));
  };

  return (
    <div className="absolute top-4 left-4 p-4 bg-white bg-opacity-75 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Spacing Controls</h2>
      <div className="mb-4">
        <label htmlFor="spacingX" className="block text-sm font-medium text-gray-700">
          Spacing X : {spacing.x}
        </label>
        <input
          id="spacingX"
          type="range"
          min="100"
          max="2000"
          step="10"
          value={spacing.x}
          onChange={(e) => handleChange('x', Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="spacingY" className="block text-sm font-medium text-gray-700">
          Spacing Y : {spacing.y}
        </label>
        <input
          id="spacingY"
          type="range"
          min="10"
          max="200"
          step="1"
          value={spacing.y}
          onChange={(e) => handleChange('y', Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="spacingZ" className="block text-sm font-medium text-gray-700">
          Spacing Z : {spacing.z}
        </label>
        <input
          id="spacingZ"
          type="range"
          min="10"
          max="200"
          step="1"
          value={spacing.z}
          onChange={(e) => handleChange('z', Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
};

// Composant principal ProjectsSection
const ProjectsSection: React.FC = () => {
  // États pour le nombre de nœuds et de liens
  const [numberOfSourceNodes, setNumberOfSourceNodes] = useState<number>(10);
  const [numberOfMiddleNodes, setNumberOfMiddleNodes] = useState<number>(20);
  const [numberOfTargetNodes, setNumberOfTargetNodes] = useState<number>(10);
  const [numberOfLinks, setNumberOfLinks] = useState<number>(50);
  const [isRotating, setIsRotating] = useState<boolean>(true); // État pour contrôler la rotation

  // Génération des données avec useMemo pour éviter les recalculs inutiles
  const DATA = useMemo(
    () => generateData(numberOfSourceNodes, numberOfMiddleNodes, numberOfTargetNodes, numberOfLinks),
    [numberOfSourceNodes, numberOfMiddleNodes, numberOfTargetNodes, numberOfLinks]
  );

  const [hoveredNode, setHoveredNode] = useState<NodeType | null>(null);
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [spacing, setSpacing] = useState<{ x: number; y: number; z: number }>({
    x: 800, // Valeurs initiales
    y: 56,
    z: 48,
  });

  const toggleRotation = () => {
    setIsRotating((prev) => !prev);
  };

  return (
    <div className="relative h-full flex bg-gray-800">
      {/* Graphe 3D */}
      <div className="flex-grow">
        <MultiProto
          data={DATA}
          hoveredNode={hoveredNode}
          setHoveredNode={setHoveredNode}
          highlightedNode={highlightedNode}
          setHighlightedNode={setHighlightedNode}
          spacing={spacing}
          isRotating={isRotating}
        />
      </div>

      {/* Liste des Nœuds */}
      <div className="absolute top-0 right-0 h-full overflow-y-auto bg-gray-900 bg-opacity-75 p-4">
        <NodeList
          nodes={DATA.nodes}
          links={DATA.links}
          onHoverNode={setHoveredNode}
          onClickNode={(node) => {
            if (node && node.item === highlightedNode) {
              setHighlightedNode(null);
            } else if (node) {
              setHighlightedNode(node.item);
            }
          }}
          highlightedNode={highlightedNode}
        />
      </div>

      {/* Contrôles des Espacements */}
      <SpacingControls spacing={spacing} setSpacing={setSpacing} />

      {/* Contrôles de Génération des Données */}
      <div className="absolute bottom-0 left-0 p-4 bg-white bg-opacity-75 rounded-tl-lg rounded-tr-lg shadow">
        <h2 className="text-xl font-bold mb-4">Generate Data</h2>
        <div className="mb-4">
          <label htmlFor="numberOfSourceNodes" className="block text-sm font-medium text-gray-700">
            Number of Source Nodes:
          </label>
          <input
            type="number"
            id="numberOfSourceNodes"
            value={numberOfSourceNodes}
            onChange={(e) => setNumberOfSourceNodes(Number(e.target.value))}
            min={1}
            max={500}
            className="mt-1 p-1 border rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="numberOfMiddleNodes" className="block text-sm font-medium text-gray-700">
            Number of Source/Target Nodes:
          </label>
          <input
            type="number"
            id="numberOfMiddleNodes"
            value={numberOfMiddleNodes}
            onChange={(e) => setNumberOfMiddleNodes(Number(e.target.value))}
            min={0}
            max={500}
            className="mt-1 p-1 border rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="numberOfTargetNodes" className="block text-sm font-medium text-gray-700">
            Number of Target Nodes:
          </label>
          <input
            type="number"
            id="numberOfTargetNodes"
            value={numberOfTargetNodes}
            onChange={(e) => setNumberOfTargetNodes(Number(e.target.value))}
            min={1}
            max={500}
            className="mt-1 p-1 border rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="numberOfLinks" className="block text-sm font-medium text-gray-700">
            Number of Links:
          </label>
          <input
            type="number"
            id="numberOfLinks"
            value={numberOfLinks}
            onChange={(e) => setNumberOfLinks(Number(e.target.value))}
            min={0}
            max={1000}
            className="mt-1 p-1 border rounded w-full"
          />
        </div>
      </div>

      {/* Bouton de Contrôle de la Rotation */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <button
          onClick={toggleRotation}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none shadow"
        >
          {isRotating ? 'Stop Rotation' : 'Start Rotation'}
        </button>
      </div>
    </div>
  );
};

export default ProjectsSection;