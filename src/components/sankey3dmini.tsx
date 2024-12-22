// src/components/SankeyDiagram3DMini.tsx
import React, { useMemo } from 'react';
import { MeshProps } from '@react-three/fiber';
import * as THREE from 'three';
import { LinkType, NodeType } from './projectsection';
 // Assurez-vous que les chemins sont corrects

interface SankeyDiagram3DMiniProps {
  nodes: NodeType[];
  links: LinkType[];
}

const SankeyDiagram3DMini: React.FC<SankeyDiagram3DMiniProps> = ({ nodes, links }) => {
  // Calculer les positions des nœuds de manière simplifiée
  const nodePositions = useMemo(() => {
    const positions: { [key: string]: THREE.Vector3 } = {};
    const radius = 2;

    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * Math.PI * 2;
      positions[node.item] = new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      );
    });

    return positions;
  }, [nodes]);

  return (
    <group>
      {/* Rendre les liens */}
      {links.map((link, index) => {
        const start = nodePositions[link.source];
        const end = nodePositions[link.target];
        const curve = new THREE.CubicBezierCurve3(
          start,
          new THREE.Vector3(start.x, start.y, 1),
          new THREE.Vector3(end.x, end.y, 1),
          end
        );

        const geometry = new THREE.TubeGeometry(curve, 20, 0.05, 8, false);
        const material = new THREE.MeshStandardMaterial({ color: 'yellow', transparent: true, opacity: 0.6 });

        return <mesh key={index} geometry={geometry} material={material} />;
      })}

      {/* Rendre les nœuds */}
      {nodes.map((node, index) => (
        <mesh key={index} position={nodePositions[node.item]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#1E90FF" />
        </mesh>
      ))}
    </group>
  );
};

export default SankeyDiagram3DMini;