
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Billboard, Environment, OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';
import { FiList, FiSettings, FiX } from 'react-icons/fi'; // Import des icônes
import { motion, AnimatePresence } from 'framer-motion'; // Import de framer-motion

// Interfaces for nodes and links
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
  toggleHighlight: (node: NodeType) => void; // Add this prop
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
  toggleHighlight: (node: NodeType) => void; // Add this prop
}

export interface NodeListProps {
  nodes: NodeType[];
  links: LinkType[];
  onHoverNode: (node: NodeType | null) => void;
  onClickNode: (node: NodeType) => void; // Modify type to avoid null
  highlightedNode: string | null;
}

export interface SpacingControlsProps {
  spacing: { x: number; y: number; z: number };
  setSpacing: React.Dispatch<React.SetStateAction<{ x: number; y: number; z: number }>>;
}

// List of possible protocols
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

// Interface for generated data
interface Data {
  nodes: NodeType[];
  links: LinkType[];
}

// Data generation function
export const generateData = (
  numberOfSourceNodes: number,
  numberOfMiddleNodes: number,
  numberOfTargetNodes: number,
  numberOfLinks: number
): Data => {
  const nodes: NodeType[] = [];
  const links: LinkType[] = [];

  // Generate source nodes
  for (let i = 1; i <= numberOfSourceNodes; i++) {
    nodes.push({ item: `Source${i}`, type: 'source' });
  }

  // Generate source/target nodes
  for (let i = 1; i <= numberOfMiddleNodes; i++) {
    nodes.push({ item: `SourceTarget${i}`, type: 'source/target' });
  }

  // Generate target nodes
  for (let i = 1; i <= numberOfTargetNodes; i++) {
    nodes.push({ item: `Target${i}`, type: 'target' });
  }

  const totalNodes = nodes.length;

  // Generate links
  for (let i = 0; i < numberOfLinks; i++) {
    const sourceIndex = Math.floor(Math.random() * totalNodes);
    let targetIndex = Math.floor(Math.random() * totalNodes);

    // Ensure source and target are not the same
    while (targetIndex === sourceIndex) {
      targetIndex = Math.floor(Math.random() * totalNodes);
    }

    const sourceNode = nodes[sourceIndex];
    const targetNode = nodes[targetIndex];

    const value = parseFloat((Math.random() * 100).toFixed(2)); // Value between 0 and 100
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

// SankeyNode component with shadows and highlighting
const SankeyNode: React.FC<SankeyNodeProps> = React.memo(
  ({ position, size, color, label, onHover, onUnhover, onClick, visible, isHighlighted }) => {
    const textRef = useRef<THREE.Mesh>(null);
    useFrame(({ camera }) => {
      // Orienter le texte vers la caméra
      if (textRef.current) {
        textRef.current.lookAt(camera.position); // Le texte "regarde" toujours la caméra
      }
    });
    const labelOffsetY = -size - 2;
   return ( <>
      <mesh
        position={position}
        onPointerOver={() => { if (visible) onHover(); }} // Conditionner le survol
        onPointerOut={() => { if (visible) onUnhover(); }} // Conditionner le survol
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
        ref={textRef} 
          position={[position[0], position[1] + labelOffsetY, position[2]]} // Slight adjustment
          fontSize={7}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </>
  )}
);

// SankeyLink component with shadows
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
    // Cleanup geometry to prevent memory leaks
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

// Particle component for link animation effects
interface ParticleProps {
  curve: THREE.Curve<THREE.Vector3>;
}

const Particle: React.FC<ParticleProps> = ({ curve }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [progress, setProgress] = useState<number>(0);

  useFrame((state, delta) => {
    setProgress((prev) => (prev + delta * 0.5) % 1); // Adjust speed here
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

// SankeyDiagram3D component with fixes
const SankeyDiagram3D: React.FC<SankeyDiagram3DProps> = ({
  nodes,
  links,
  setHoveredNode,
  highlightedNode,
  hoveredNode,
  spacing,
  isRotating,
  toggleHighlight, // Receive the prop
}) => {
  // Memoize nodePositions with useMemo
  const nodePositions = useMemo(() => {
    const positions: { [key: string]: [number, number, number] } = {};
    const nodeSize = 8; // Fixed size for all nodes
    const verticalSpacing = spacing.y;
    const horizontalSpacing = spacing.x;
    const depthSpacing = spacing.z;

    let sourceIndex = 0;
    let middleIndex = 0;
    let targetIndex = 0;
    const numRows = Math.ceil(Math.sqrt(nodes.length / 3)); // Adjustment for three categories
    const nodeDegrees: { [key: string]: number } = {};

    // Initialize degrees to 0 for all nodes
    nodes.forEach((node) => {
      nodeDegrees[node.item] = 0;
    });

    // Calculate each node's degree based on links
    links.forEach((link) => {
      nodeDegrees[link.source] = (nodeDegrees[link.source] || 0) + 1;
      nodeDegrees[link.target] = (nodeDegrees[link.target] || 0) + 1;
    });

    // Assign positions to nodes
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

    // Calculate center of node positions
    const allPositions = Object.values(positions);
    // const centerX = allPositions.reduce((sum, pos) => sum + pos[0], 0) / allPositions.length;
    const centerY = allPositions.reduce((sum, pos) => sum + pos[1], 0) / allPositions.length;
    const centerZ = allPositions.reduce((sum, pos) => sum + pos[2], 0) / allPositions.length;

    // Adjust node positions to center the graph
    Object.keys(positions).forEach((item) => {
     // positions[item][0] -= centerX;
      positions[item][1] -= centerY;
      positions[item][2] -= centerZ;
    });

    return positions;
  }, [nodes, links, spacing.x, spacing.y, spacing.z]);

  // Calculate node sizes with useMemo to avoid unnecessary recalculations
  const nodesWithSizes = useMemo(() => {
    const nodeDegrees: { [key: string]: number } = {};

    // Initialize degrees to 0 for all nodes
    nodes.forEach((node) => {
      nodeDegrees[node.item] = 0;
    });

    // Calculate each node's degree based on links
    links.forEach((link) => {
      nodeDegrees[link.source] = (nodeDegrees[link.source] || 0) + 1;
      nodeDegrees[link.target] = (nodeDegrees[link.target] || 0) + 1;
    });

    // Add a size for each node based on its degree
    return nodes.map((node) => ({
      ...node,
      size: Math.max(2, Math.min(10, nodeDegrees[node.item])) * 2.5, // Adjusted size scale
    }));
  }, [nodes, links]);

  // Prepare link paths with correct visibility using useMemo
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

  // Calculate title positions and adjust their height using useMemo
  const titleYOffset = 10; // Adjust this value to lift texts
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

  // Handle rotation
  const groupRef = useRef<THREE.Group>(null!);
  useFrame(() => {
    if (isRotating && groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  // Generate particles when hovering or highlighting a node
  const [particles, setParticles] = useState<{ key: string; curve: THREE.Curve<THREE.Vector3> }[]>([]);

  useEffect(() => {
    const activeNodes: NodeType[] = [];

    if (highlightedNode) {
      const highlighted = nodes.find(node => node.item === highlightedNode);
      if (highlighted) activeNodes.push(highlighted);
    } else if (hoveredNode) { // Priorité à highlightedNode
      activeNodes.push(hoveredNode);
    }

    if (activeNodes.length > 0) {
      const relatedLinks = links.filter(link =>
        activeNodes.some(node => node.item === link.source || node.item === link.target)
      );

      console.log('Generating particles for links:', relatedLinks);

      const newParticles = relatedLinks.map((link, index) => {
        const start = nodePositions[link.source];
        const end = nodePositions[link.target];
        const curve = new THREE.CubicBezierCurve3(
          new THREE.Vector3(...start),
          new THREE.Vector3(...start).lerp(new THREE.Vector3(...end), 0.33).setZ(start[2] + 5),
          new THREE.Vector3(...start).lerp(new THREE.Vector3(...end), 0.66).setZ(start[2] + 5),
          new THREE.Vector3(...end)
        );
        return { key: `${link.source}-${link.target}-${index}`, curve };
      });

      setParticles(newParticles);
    } else {
      console.log('Clearing all particles');
      setParticles([]);
    }
  }, [hoveredNode, highlightedNode, links, nodePositions, nodes]);

  return (
    <group ref={groupRef}>
      {/* Column Titles */}
      <Billboard position={sourceTitlePosition}>
  <Text
    fontSize={40}
    color="white"
    anchorX="center"
    anchorY="middle"
  >
    Source
  </Text>
</Billboard>

<Billboard position={middleTitlePosition}>
  <Text
    fontSize={40}
    color="white"
    anchorX="center"
    anchorY="middle"
  >
    Source/Target
  </Text>
</Billboard>

<Billboard position={targetTitlePosition}>
  <Text
    fontSize={40}
    color="white"
    anchorX="center"
    anchorY="middle"
  >
    Target
  </Text>
</Billboard>

      {/* Render Nodes */}
      {nodesWithSizes.map((node, index) => {
        const isVisible =
          highlightedNode === null ||
          highlightedNode === node.item ||
          links.some(
            (link) =>
              (link.source === highlightedNode && link.target === node.item) ||
              (link.target === highlightedNode && link.source === node.item)
          );

        // Define node color based on type
        let nodeColor = '#1E90FF'; // DodgerBlue for 'source'
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
            onClick={() => toggleHighlight(node)} // Use toggleHighlight
            visible={isVisible}
            isHighlighted={highlightedNode === node.item}
          />
        );
      })}

      {/* Render Links */}
      {linkPaths.map((link, index) => (
        <SankeyLink
          key={index}
          start={link.start}
          end={link.end}
          color={"yellow"}
          radius={link.radius}
          visible={link.visible}
        />
      ))}

      {/* Render Particles */}
      {particles.map((particle) => (
        <Particle key={particle.key} curve={particle.curve} />
      ))}

      {/* Ground */}
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

// MultiProto component
const MultiProto: React.FC<MultiProtoProps> = ({
  data,
  hoveredNode,
  setHoveredNode,
  highlightedNode,
  setHighlightedNode,
  spacing,
  isRotating,
  toggleHighlight, // Receive the prop
}) => {
  return (
    <Canvas
      style={{ background: 'linear-gradient(to bottom, #000428, #004e92)' }} // Dark gradient background
      shadows
    >
      <PerspectiveCamera makeDefault position={[0, 0, 1200]} far={100000} />
         <ambientLight intensity={0.3} /> {/* Lumière ambiante douce */}
      <directionalLight position={[5, 5, 5]} intensity={0.4} /> {/* Lumière directionnelle */}
      <pointLight position={[-5, -5, 5]} intensity={0.5} /> {/* Lumière ponctuelle */}
      <Environment preset="night" /> 
      <directionalLight
        castShadow
        intensity={1}
        position={[-10, 20, 0]}
        rotation={[0,20,20]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={100}
        shadow-camera-near={0.1}
        shadow-camera-top={50}
        shadow-camera-bottom={50}
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
        toggleHighlight={toggleHighlight} // Pass the function
      />
      <OrbitControls />
    </Canvas>
  );
};

// NodeList component with tooltip on hover and click handling
const NodeList: React.FC<NodeListProps> = ({ nodes, links, onHoverNode, onClickNode, highlightedNode }) => {
  const [tooltip, setTooltip] = useState<{ visible: boolean; content: string }>({
    visible: false,
    content: '',
  });

  const handleMouseEnter = (node: NodeType) => {
    if (highlightedNode) return; // Empêcher le survol si un nœud est mis en évidence

    const relatedLinksCount = links.filter((link) => link.source === node.item || link.target === node.item).length;

    const content = `
      <strong>${node.item}</strong><br/>
      Type: ${node.type}<br/>
      Number of Links: ${relatedLinksCount}
    `;
    setTooltip({
      visible: true,
      content,
    });
    onHoverNode(node);
  };

  const handleMouseLeave = () => {
    if (highlightedNode) return; // Empêcher le survol si un nœud est mis en évidence

    setTooltip({
      visible: false,
      content: '',
    });
    onHoverNode(null);
  };

  const handleClick = (node: NodeType) => {
    onClickNode(node);
  };

  return (
    <div className="flex">
      {/* Tooltip */}
      {tooltip.visible && (
        <div className="h-fit bg-white bg-opacity-75 rounded shadow text-black p-2 mr-4">
          <div dangerouslySetInnerHTML={{ __html: tooltip.content }} />
        </div>
      )}

      {/* Node List */}
      <div className="p-4 bg-white bg-opacity-75 rounded shadow text-black">
        <h2 className="text-xl font-bold mb-4">Node List</h2>
        <ul>
          {nodes.map((node) => (
            <li
              key={node.item}
              className={`p-2 cursor-pointer rounded ${
                highlightedNode === node.item ? 'bg-gray-700 text-white' : 'hover:bg-gray-700 hover:text-white'
              }`}
              onMouseEnter={() => handleMouseEnter(node)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(node)}
              tabIndex={0}
              aria-label={`Node ${node.item}`}
            >
              {node.item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// SpacingControls component
const SpacingControls: React.FC<SpacingControlsProps> = ({ spacing, setSpacing }) => {
  const handleChange = (axis: 'x' | 'y' | 'z', value: number) => {
    setSpacing((prev) => ({ ...prev, [axis]: value }));
  };

  return (
    <div className="p-4 bg-white bg-opacity-75 rounded shadow">
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

// Main ProjectsSection component
const ProjectsSection: React.FC = () => {
  // States for number of nodes and links
  const [numberOfSourceNodes, setNumberOfSourceNodes] = useState<number>(10);
  const [numberOfMiddleNodes, setNumberOfMiddleNodes] = useState<number>(20);
  const [numberOfTargetNodes, setNumberOfTargetNodes] = useState<number>(10);
  const [numberOfLinks, setNumberOfLinks] = useState<number>(50);
  const [isRotating, setIsRotating] = useState<boolean>(true); // State to control rotation

  // Nouvel état pour contrôler la visibilité des SpacingControls
  const [showSpacingControls, setShowSpacingControls] = useState<boolean>(false);
  const [showNodeList, setShowNodeList] = useState<boolean>(false);
  const [showDataGeneration, setShowDataGeneration] = useState<boolean>(false);
  // Generate data with useMemo to avoid unnecessary recalculations
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
    x: 500, // Initial values
    y: 80,
    z: 80,
  });

  // Toggle highlight function
  const toggleHighlight = useCallback((node: NodeType) => {
    if (highlightedNode === node.item) {
      setHighlightedNode(null);
    } else {
      setHighlightedNode(node.item);
      setHoveredNode(null); // Réinitialiser hoveredNode lors de la mise en évidence
    }
  }, [highlightedNode]);

  // Fonction pour basculer la visibilité des SpacingControls
  const toggleSpacingControls = () => {
    setShowSpacingControls((prev) => !prev);
  };
 const toggleNodeList = () => {
    setShowNodeList((prev) => !prev);
  };
  
  const toggleDataGeneration = () => {
    setShowDataGeneration((prev) => !prev);
  };
  const toggleRotation = () => {
    setIsRotating((prev) => !prev);
  };
 
 
  return (
    <div className="relative h-full w-full flex">
      {/* 3D Graph */}
      <div className="flex-grow">
        <MultiProto
          data={DATA}
          hoveredNode={hoveredNode}
          setHoveredNode={setHoveredNode}
          highlightedNode={highlightedNode}
          setHighlightedNode={setHighlightedNode}
          spacing={spacing}
          isRotating={isRotating}
          toggleHighlight={toggleHighlight} // Pass the function
        />
      </div>

      {/* Node List */}
     
      <AnimatePresence>
  {!showNodeList ? (
     <div className="absolute top-[48%] right-0 h-[90%] overflow-y-auto overflow-x-hidden rounded">
    <motion.button
      key="open-node-list"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.3 }}
      onClick={toggleNodeList}
      className="p-2 bg-gray-800 text-white rounded shadow"
      aria-label="Ouvrir la liste des nœuds"
    >
      <FiList size={24} />
    </motion.button></div>
  ) : (
    <div className="absolute top-20 right-0 h-[90%] overflow-y-auto overflow-x-hidden rounded"> <motion.div
      key="node-list"
      initial={{ opacity: 0, x: 100, y: 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }} 
      exit={{ opacity: 0, x: 0, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <NodeList
        nodes={DATA.nodes}
        links={DATA.links}
        onHoverNode={setHoveredNode}
        onClickNode={toggleHighlight} // Use the shared function
        highlightedNode={highlightedNode}
      />
    
      <button
        onClick={toggleNodeList}
        className="absolute top-0 right-0 p-1 bg-gray-800 text-white rounded-full"
        aria-label="Fermer la liste des nœuds"
      >
        <FiX size={16} />
      </button>
    </motion.div></div>
  )}
</AnimatePresence> 

     

     
      <div className="absolute top-10 left-0">
        <AnimatePresence>
          {!showSpacingControls ? (
            
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleSpacingControls}
              className="p-2 bg-gray-800 text-white rounded shadow"
              aria-label="Ouvrir les contrôles d'espacement"
            >
              <FiSettings size={24} />
            </motion.button>
          ) : (
            // SpacingControls avec animation
            <motion.div
              initial={{ opacity: 0, x: -100, y: -100 }}
              animate={{ opacity: 1, x: 1, y: 1 }} // Animation diagonale vers bas-gauche
              exit={{ opacity: 0, x: -100, y: -100 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <SpacingControls spacing={spacing} setSpacing={setSpacing} />
              {/* Bouton pour fermer les SpacingControls */}
              <button
                onClick={toggleSpacingControls}
                className="absolute top-0 right-0 p-1 bg-gray-800 text-white rounded-full"
                aria-label="Fermer les contrôles d'espacement"
              >
                <FiX size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Data Generation Controls */}
      
      <AnimatePresence>
    {!showDataGeneration ? (<div className="absolute bottom-0 left-0">
    <motion.button
      key="open-data-generation"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.3 }}
      onClick={toggleDataGeneration}
      className="p-2 bg-gray-800 text-white rounded shadow"
      aria-label="Ouvrir les contrôles de génération de données"
    >
      <FiSettings size={24} />
    </motion.button></div>
  ) : (
    <div className="absolute bottom-0 left-0"> 
    <motion.div
      key="data-generation"
      initial={{ opacity: 0, x: -100, y: 100 }}
      animate={{ opacity: 1, x: 1, y: 1 }} // Animation vers la gauche
      exit={{ opacity: 0, x: -100, y: 100 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="p-4 bg-white bg-opacity-75 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Data Generation</h2>
        <div className="mb-4">
          <label htmlFor="numberOfSourceNodes" className="block text-sm font-medium text-gray-700">
            Source Nodes:
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
            Source/Target Nodes:
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
            Target Nodes:
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
            Links:
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
      {/* Bouton pour fermer les contrôles de Data Generation */}
      <button
        onClick={toggleDataGeneration}
        className="absolute top-0 right-0 p-1 bg-gray-800 text-white rounded-full"
        aria-label="Fermer les contrôles de génération de données"
      >
        <FiX size={16} />
      </button>
    </motion.div>
    </div>
  )}
</AnimatePresence>
      {/* Rotation Control Button */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <button
          onClick={toggleRotation}
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-600 focus:outline-none shadow"
        >
          {isRotating ? 'Stop Rotation' : 'Start Rotation'}
        </button>
      </div>
    </div>
  );
};

export default ProjectsSection;

