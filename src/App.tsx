import { Routes, Route, Link } from "react-router-dom";
import './index.css'; // Assurez-vous que votre fichier CSS est bien importé
import MapCard from './components/MapCard';

function App() {
  return (
   
     
        <div className="h-full w-full">
          <nav className="py-3 mb-4">
            <div className="">
            <Link to="/parkings-velo"> <button className="whitespace-nowrap bg-white font-normal  py-1 px-2 mx-1  rounded cursor-pointer shadow-neumorphism transition duration-200  active:shadow-neumorphism-active">Parkings Vélo</button></Link>
            <Link to="/evenements-culturels"><button className="whitespace-nowrap bg-white font-normal  py-1 px-2 mx-1  rounded cursor-pointer shadow-neumorphism transition duration-200  active:shadow-neumorphism-active">Événements Culturels</button></Link>
             <Link to="/centres-preparation"> <button className="whitespace-nowrap bg-white font-normal  py-1 px-2 mx-1  rounded cursor-pointer shadow-neumorphism transition duration-200  active:shadow-neumorphism-active">Centres de Préparation</button></Link>
             <Link to="/aide-volontaires"> <button className="whitespace-nowrap bg-white font-normal  py-1 px-2 mx-1  rounded cursor-pointer shadow-neumorphism transition duration-200  active:shadow-neumorphism-active">Aide aux Volontaires</button></Link>
             <Link to="/sites-competition"> <button className="whitespace-nowrap bg-white font-normal  py-1 px-2 mx-1  rounded cursor-pointer shadow-neumorphism transition duration-200  active:shadow-neumorphism-active">Sites de Compétition</button></Link>
             <Link to="/psa-snm"> <button className="whitespace-nowrap bg-white font-normal  py-1 px-2 mx-1  rounded cursor-pointer shadow-neumorphism transition duration-200  active:shadow-neumorphism-active">PSA SNM</button></Link>
             <Link to="/boutiques-officielles"> <button className="whitespace-nowrap bg-white font-normal  py-1 px-2 mx-1  rounded cursor-pointer shadow-neumorphism transition duration-200  active:shadow-neumorphism-active">Boutiques Officielles</button></Link>
             <Link to="/poi-sites"> <button className="whitespace-nowrap bg-white font-normal  py-1 px-2 mx-1  rounded cursor-pointer shadow-neumorphism transition duration-200  active:shadow-neumorphism-active">POI Sites</button></Link>
            </div>
          </nav>
          <Routes>
            <Route path="/parkings-velo" element={<MapCard />} />
            <Route path="/evenements-culturels" element={<MapCard />} />
            <Route path="/centres-preparation" element={<MapCard />} />
            <Route path="/aide-volontaires" element={<MapCard />} />
            <Route path="/sites-competition" element={<MapCard />} />
            <Route path="/psa-snm" element={<MapCard />} />
            <Route path="/boutiques-officielles" element={<MapCard />} />
            <Route path="/poi-sites" element={<MapCard />} />
          </Routes>
        </div>
     


    
  );
}

export default App;
