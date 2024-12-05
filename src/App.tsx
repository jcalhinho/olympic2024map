import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AboutSection from './components/aboutsection';
import ProjectsSection from './components/projectsection';
import Home from './components/Home';

// Composant App avec Navigation
function App() {
  return (
    <div className="h-screen w-screen">
      {/* En-tête de navigation */}
      <header
        style={{ background: 'linear-gradient(to bottom, #004e92, #000428)' }}
        className="flex justify-end items-center px-4 py-2 bg-gray-800 text-white fixed top-0 left-0 right-0 z-10"
      >
        <nav className="flex space-x-4">
          <Link to="/" className="mx-2 hover:underline">
            Home
          </Link>
          <div className="relative group">
            <Link to="/projects" className="mx-2 hover:underline">
              Projects
            </Link>
            <div className="absolute hidden group-hover:block bg-white text-black mt-2 rounded shadow-lg">
              <Link to="/projects/sankey3d" className="block px-4 py-2 hover:bg-gray-200">
                Sankey 3D
              </Link>
              <Link to="/projects/piechart" className="block px-4 py-2 hover:bg-gray-200">
                Pie Chart
              </Link>
              <Link to="/projects/bargraph" className="block px-4 py-2 hover:bg-gray-200">
                Bar Graph
              </Link>
            </div>
          </div>
          <Link to="/who" className="mx-2 hover:underline">
            Who?
          </Link>
        </nav>
      </header>

      {/* Routes de l'application */}
      <main className="h-screen overflow-hidden ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/sankey3d" element={<ProjectsSection />} />
          <Route path="/projects/piechart" element={<div>Pie Chart Page</div>} />
          <Route path="/projects/bargraph" element={<div>Bar Graph Page</div>} />
          <Route path="/who" element={<AboutSection />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;