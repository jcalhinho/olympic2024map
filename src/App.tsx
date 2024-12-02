import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./index.css";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Environment, Loader } from "@react-three/drei";
import AboutSection from "./components/aboutsection";
import ProjectsSection from "./components/projectsection";
import * as THREE from "three";

function App() {
  return (
    <div className="h-screen w-screen">
      {/* En-tête de navigation */}
      <header className="flex justify-between items-center px-4 py-2 bg-gray-800 text-white absolute top-0 left-0 right-0 z-10">
        <h1 className="text-xl font-bold">Mon Portfolio</h1>
        <nav>
          <Link to="/" className="mx-2">
            Accueil
          </Link>
          <Link to="/projets" className="mx-2">
            Projets
          </Link>
          <Link to="/a-propos" className="mx-2">
            À Propos
          </Link>
        </nav>
      </header>

      {/* Routes de l'application */}
      <main className="h-full">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/projets" element={<ProjectsSection />} />
          <Route path="/a-propos" element={<AboutSection />} />
        </Routes>
      </main>
    </div>
  );
}

function Accueil() {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
        {/* Lumières */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* Environnement */}
        <Environment preset="sunset" />

        {/* Contrôles de la caméra */}
        <OrbitControls enableZoom={true} enablePan={true} />

        {/* Objets 3D représentant les projets */}
        <Projects />

        {/* Sol */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#555" />
        </mesh>
      </Canvas>

      {/* Chargeur pour les ressources 3D */}
      <Loader />

      {/* Texte de bienvenue */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white pointer-events-none">
        <h1 className="text-4xl font-bold"></h1>
        <p className="mt-2">
          
        </p>
      </div>
    </div>
  );
}

function Projects() {
  const projectData = [
    {
      id: 1,
      position: [-5, 0, 0],
      color: "red",
      title: "Projet 1",
      description: "Description du projet 1.",
    },
    {
      id: 2,
      position: [0, 0, 0],
      color: "green",
      title: "Projet 2",
      description: "Description du projet 2.",
    },
    {
      id: 3,
      position: [5, 0, 0],
      color: "blue",
      title: "Projet 3",
      description: "Description du projet 3.",
    },
  ];

  return (
    <>
      {projectData.map((project) => (
        <ProjectMesh key={project.id} project={project} />
      ))}
    </>
  );
}

function ProjectMesh({ project }) {
  const [hovered, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const meshRef = React.useRef<THREE.Mesh>();

  // Animation de la caméra lors du clic sur un projet
  useFrame((state) => {
    if (active && meshRef.current) {
      state.camera.position.lerp(
        new THREE.Vector3(
          meshRef.current.position.x,
          meshRef.current.position.y + 2,
          meshRef.current.position.z + 5
        ),
        0.1
      );
      state.camera.lookAt(meshRef.current.position);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={project.position}
      scale={hovered ? 1.2 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      {/* Forme géométrique représentant le projet */}
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={project.color} />

      {/* Affichage des informations du projet lorsqu'il est actif */}
      {active && (
        <Html distanceFactor={10}>
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold">{project.title}</h2>
            <p className="mt-2">{project.description}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setActive(false)}
            >
              Fermer
            </button>
          </div>
        </Html>
      )}
    </mesh>
  );
}

export default App;