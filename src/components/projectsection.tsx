// src/components/projectsection.tsx

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
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
  setHighlightedNode?: React.Dispatch<React.SetStateAction<string | null>>;
  highlightedNode: string | null;
  hoveredNode: NodeType | null;
  spacing: { x: number; y: number; z: number };
  isRotating: boolean;
  toggleHighlight: (node: NodeType) => void; // Ajouter cette prop
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
  toggleHighlight: (node: NodeType) => void; // Ajouter cette prop
}

export interface NodeListProps {
  nodes: NodeType[];
  links: LinkType[];
  onHoverNode: (node: NodeType | null) => void;
  onClickNode: (node: NodeType) => void; // Modifier le type pour éviter null
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
    const sourceIndex = Math.floor(Math.random() * totalNodes);
    let targetIndex = Math.floor(Math.random() * totalNodes);

    // Assurer que la source et la cible ne sont pas les mêmes
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
  highlightedNode,
  hoveredNode,
  spacing,
  isRotating,
  toggleHighlight, // Recevoir la prop
}) => {
  // Mémoriser nodePositions avec useMemo
  const nodePositions = useMemo(() => {
    const positions: { [key: string]: [number, number, number] } = {};
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

    // Assigner des positions aux nœuds
    nodes.forEach((node) => {
      if (node.type === 'source') {
        const xPosition = -horizontalSpacing;
        const row = Math.floor(sourceIndex / numRows);
        const col = sourceIndex % numRows;
        const yOffset = nodeSize + verticalSpacing;
        const yPosition = col * yOffset - ((numRows - 1) * yOffset) / 2;
        const zPosition = row * depthSpacing;
        positions[node.item] = [xPosition, yPosition, zPosition];
        sourceIndex += 1;
      }

      if (node.type === 'source/target') {
        const xPosition = 0;
        const row = Math.floor(middleIndex / numRows);
        const col = middleIndex % numRows;
        const yOffset = nodeSize + verticalSpacing;
        const yPosition = col * yOffset - ((numRows - 1) * yOffset) / 2;
        const zPosition = row * depthSpacing;
        positions[node.item] = [xPosition, yPosition, zPosition];
        middleIndex += 1;
      }

      if (node.type === 'target') {
        const xPosition = horizontalSpacing;
        const row = Math.floor(targetIndex / numRows);
        const col = targetIndex % numRows;
        const yOffset = nodeSize + verticalSpacing;
        const yPosition = col * yOffset - ((numRows - 1) * yOffset) / 2;
        const zPosition = row * depthSpacing;
        positions[node.item] = [xPosition, yPosition, zPosition];
        targetIndex += 1;
      }
    });

    // Calculer le centre des positions des nœuds
    const allPositions = Object.values(positions);
    const centerX = allPositions.reduce((sum, pos) => sum + pos[0], 0) / allPositions.length;
    const centerY = allPositions.reduce((sum, pos) => sum + pos[1], 0) / allPositions.length;
    const centerZ = allPositions.reduce((sum, pos) => sum + pos[2], 0) / allPositions.length;

    // Ajuster les positions des nœuds pour centrer le graphe
    Object.keys(positions).forEach((item) => {
      positions[item][0] -= centerX;
      positions[item][1] -= centerY;
      positions[item][2] -= centerZ;
    });

    return positions;
  }, [nodes, links, spacing.x, spacing.y, spacing.z]);

  // Calculer les tailles des nœuds avec useMemo pour éviter les recalculs
  const nodesWithSizes = useMemo(() => {
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
    return nodes.map((node) => ({
      ...node,
      size: Math.max(2, Math.min(10, nodeDegrees[node.item])) * 1.5, // Échelle de taille ajustée
    }));
  }, [nodes, links]);

  // Préparer les chemins des liens avec visibilité correcte en utilisant useMemo
  const linkPaths = useMemo(() => {
    return links.map((link) => {
      const sourcePos = nodePositions[link.source];
      const targetPos = nodePositions[link.target];
      const visible =
        highlightedNode === null ||
        highlightedNode === link.source ||
        highlightedNode === link.target;
      return {
        start: sourcePos,
        end: targetPos,
        color: 'white',
        radius: 1.2,
        visible: visible,
      };
    });
  }, [links, nodePositions, highlightedNode]);

  // Calculer les positions des titres et ajuster leur hauteur avec useMemo
  const titleYOffset = 10; // Ajuster cette valeur pour élever les textes
  const numRows = Math.ceil(Math.sqrt(nodes.length / 3));
  const sourceTitlePosition = useMemo(
    () =>
      new THREE.Vector3(
        -spacing.x,
        -(numRows * (8 + spacing.y)) / 2 - 10 + titleYOffset,
        0
      ),
    [spacing.x, spacing.y, numRows]
  );

  const middleTitlePosition = useMemo(
    () =>
      new THREE.Vector3(
        0,
        -(numRows * (8 + spacing.y)) / 2 - 10 + titleYOffset,
        0
      ),
    [spacing.y, numRows]
  );

  const targetTitlePosition = useMemo(
    () =>
      new THREE.Vector3(
        spacing.x,
        -(numRows * (8 + spacing.y)) / 2 - 10 + titleYOffset,
        0
      ),
    [spacing.x, spacing.y, numRows]
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
    <group ref={groupRef}>
      {/* Titres des Colonnes */}
      <Text
        position={sourceTitlePosition}
        fontSize={60}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Item Source
      </Text>
      <Text
        position={middleTitlePosition}
        fontSize={60}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Item Source/Item Target
      </Text>
      <Text
        position={targetTitlePosition}
        fontSize={60}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
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
            onClick={() => toggleHighlight(node)} // Utiliser toggleHighlight
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
  toggleHighlight, // Recevoir la prop
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
        toggleHighlight={toggleHighlight} // Passer la fonction
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
    onClickNode(node); // Utiliser la fonction de basculer
  };

  return (
    <div className="relative p-4">
      <h2 className="text-xl font-bold mb-4 text-white">Liste des Nœuds</h2>
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
    <div className="absolute top-10 left-0 p-4 bg-white bg-opacity-75 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Contrôle des Espacements</h2>
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
    () =>
      generateData(
        numberOfSourceNodes,
        numberOfMiddleNodes,
        numberOfTargetNodes,
        numberOfLinks
      ),
    [numberOfSourceNodes, numberOfMiddleNodes, numberOfTargetNodes, numberOfLinks]
  );

  const [hoveredNode, setHoveredNode] = useState<NodeType | null>(null);
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [spacing, setSpacing] = useState<{ x: number; y: number; z: number }>({
    x: 500, // Valeurs initiales
    y: 80,
    z: 80,
  });

  // Fonction de basculer la mise en évidence
  const toggleHighlight = useCallback((node: NodeType) => {
    if (highlightedNode === node.item) {
      setHighlightedNode(null);
    } else {
      setHighlightedNode(node.item);
    }
  }, [highlightedNode]);

  const toggleRotation = () => {
    setIsRotating((prev) => !prev);
  };

  return (
    <div className="relative  flex bg-gray-800">
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
          toggleHighlight={toggleHighlight} // Passer la fonction
        />
      </div>

      {/* Liste des Nœuds */}
      <div className="absolute top-8 right-4 h-full overflow-y-auto bg-gray-900 bg-opacity-75 p-4 text-white">
        <NodeList
          nodes={DATA.nodes}
          links={DATA.links}
          onHoverNode={setHoveredNode}
          onClickNode={toggleHighlight} // Utiliser la fonction partagée
          highlightedNode={highlightedNode}
        />
      </div>

      {/* Contrôles des Espacements */}
      <SpacingControls spacing={spacing} setSpacing={setSpacing} />

      {/* Contrôles de Génération des Données */}
      <div className="absolute bottom-0 left-0 p-4 bg-white bg-opacity-75 rounded-tl-lg rounded-tr-lg shadow">
        <h2 className="text-xl font-bold mb-4">data generate</h2>
        <div className="mb-4">
          <label htmlFor="numberOfSourceNodes" className="block text-sm font-medium text-gray-700">
            source nodes:
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
            source/target nodes:
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
           target nodes:
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
            links:
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
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
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