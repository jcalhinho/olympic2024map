import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";

const PortfolioGraph = () => {
  const data = [
    { skill: "React", level: 80 },
    { skill: "Three.js", level: 70 },
    { skill: "JavaScript", level: 90 },
  ];

  const positions = data.map((item, index) => [
    index * 10,
    item.level / 10,
    0,
  ]);

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} />
      <Line
        points={positions}
        color="blue"
        lineWidth={2}
      />
      {positions.map(([x, y, z], index) => (
        <mesh position={[x, y, z]} key={index}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="red" />
        </mesh>
      ))}
      <OrbitControls />
    </Canvas>
  );
};

export default PortfolioGraph;