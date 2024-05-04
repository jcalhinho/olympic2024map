import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css'; // Assurez-vous que votre fichier CSS est bien importé

function App() {
  return (
   
      <Router>
        <div className="body">
          <nav className="p-4">
            <div className="flex justify-center space-x-4">
              <button className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg cursor-pointer shadow-neumorphism transition duration-200  active:shadow-neumorphism-active"><Link to="/parkings-velo">Parkings Vélo</Link></button>
              <button className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg cursor-pointer shadow-neumorphism transition duration-200  active:shadow-neumorphism-active"><Link to="/evenements-culturels">Événements Culturels</Link></button>
              <button className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg cursor-pointer shadow-neumorphism transition duration-200  active:shadow-neumorphism-active"><Link to="/centres-preparation">Centres de Préparation</Link></button>
              <button className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg cursor-pointer shadow-neumorphism transition duration-200  active:shadow-neumorphism-active"><Link to="/aide-volontaires">Aide aux Volontaires</Link></button>
              <button className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg cursor-pointer shadow-neumorphism transition duration-200  active:shadow-neumorphism-active"><Link to="/sites-competition">Sites de Compétition</Link></button>
              <button className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg cursor-pointer shadow-neumorphism transition duration-200  active:shadow-neumorphism-active"><Link to="/psa-snm">PSA SNM</Link></button>
              <button className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg cursor-pointer shadow-neumorphism transition duration-200  active:shadow-neumorphism-active"><Link to="/boutiques-officielles">Boutiques Officielles</Link></button>
              <button className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg cursor-pointer shadow-neumorphism transition duration-200  active:shadow-neumorphism-active"><Link to="/poi-sites">POI Sites</Link></button>
            </div>
          </nav>
          <Routes>
            <Route path="/parkings-velo" element={<>parking</>} />
            <Route path="/evenements-culturels" element={<>evenements-culturels</>} />
            <Route path="/centres-preparation" element={<>centres-preparation</>} />
            <Route path="/aide-volontaires" element={<>aide-volontaires</>} />
            <Route path="/sites-competition" element={<>sites-competition</>} />
            <Route path="/psa-snm" element={<>psa-snm</>} />
            <Route path="/boutiques-officielles" element={<>boutiques-officielles</>} />
            <Route path="/poi-sites" element={<>poi-sites</>} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
