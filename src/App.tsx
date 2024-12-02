// src/App.tsx

import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./index.css";
import AboutSection from "./components/aboutsection";
import ProjectsSection from "./components/projectsection";


function App() {
  return (
    <div className="h-screen w-screen">
      {/* En-tête de navigation */}
      <header className="flex justify-end items-center px-4 py-2 bg-gray-800 text-white fixed top-0 left-0 right-0 z-10">
       
        <nav>
          <Link to="/" className="mx-2 hover:underline">
            Accueil
          </Link>
          <Link to="/projets" className="mx-2 hover:underline">
            Projets
          </Link>
          <Link to="/a-propos" className="mx-2 hover:underline">
            À Propos
          </Link>
        </nav>
      </header>

      {/* Routes de l'application */}
      <main className="h-full mt-16">
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
      <ProjectsSection />
    </div>
  );
}

export default App;