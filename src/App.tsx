import { Routes, Route, Link } from "react-router-dom";
import "./index.css"; // Assurez-vous que votre fichier CSS est bien importé
import MapCard from "./components/MapCard";
import { OlympicIcon } from "./assets/icons";
import Drawer from "react-modern-drawer";
import { useState } from "react";
import "react-modern-drawer/dist/index.css";

function App() {
  const [isOpenLeft, setIsOpenLeft] = useState(false);
  const [isOpenRight, setIsOpenRight] = useState(false);
  const toggleDrawerLeft = () => {
    setIsOpenLeft((prevState) => !prevState);
  };
  const toggleDrawerRight = () => {
    setIsOpenRight((prevState) => !prevState);
  };

  return (
    <>
      <Drawer
        open={isOpenLeft}
        onClose={toggleDrawerLeft}
        direction="left"
        className="w-16"
      >
        <div>Hello left</div>
      </Drawer>
      <Drawer
        open={isOpenRight}
        onClose={toggleDrawerRight}
        direction="right"
        className="w-16"
      >
        <div>Hello right</div>
      </Drawer>

      <div className="flex flex-col h-full w-full ">
        <nav className="bg-transparent flex   w-full">
          <div className="flex items-center w-full">
            <button
              className="ml-2 mr-auto whitespace-nowrap bg-white font-normal  py-1 px-2    cursor-pointer shadow-neumorphism transition duration-200  active:shadow-neumorphism-active "
              onClick={toggleDrawerLeft}
            >
              Sports
            </button>

            <OlympicIcon />
            <Link to="/parkings-velo">
              {" "}
              <button className="whitespace-nowrap bg-white font-normal  py-1 px-2 mx-1   cursor-pointer shadow-neumorphism transition duration-200  active:shadow-neumorphism-active">
                Parkings Vélo
              </button>
            </Link>
            <Link to="/evenements-culturels">
              <button className="whitespace-nowrap bg-white font-normal  py-1 px-2 mx-1   cursor-pointer shadow-neumorphism transition duration-200  active:shadow-neumorphism-active">
                Événements Culturels
              </button>
            </Link>
            <Link to="/centres-preparation">
              {" "}
              <button className="whitespace-nowrap bg-white font-normal  py-1 px-2 mx-1   cursor-pointer shadow-neumorphism transition duration-200  active:shadow-neumorphism-active">
                Centres de Préparation
              </button>
            </Link>

            <Link to="/">
              {" "}
              <button className="whitespace-nowrap bg-white font-normal  py-1 px-2 mx-1   cursor-pointer shadow-neumorphism transition duration-200  active:shadow-neumorphism-active">
                Sites de Compétition
              </button>
            </Link>
            <Link to="/psa-snm">
              {" "}
              <button className="whitespace-nowrap bg-white font-normal  py-1 px-2 mx-1   cursor-pointer shadow-neumorphism transition duration-200  active:shadow-neumorphism-active">
                PSA SNM
              </button>
            </Link>
            <Link to="/boutiques-officielles">
              {" "}
              <button className="whitespace-nowrap bg-white font-normal  py-1 px-2 mx-1   cursor-pointer shadow-neumorphism transition duration-200  active:shadow-neumorphism-active">
                Boutiques Officielles
              </button>
            </Link>
            <Link to="/poi-sites">
              {" "}
              <button className="whitespace-nowrap bg-white font-normal  py-1 px-2 mx-1   cursor-pointer shadow-neumorphism transition duration-200  active:shadow-neumorphism-active">
                POI Sites
              </button>
            </Link>

            <button
              className="mr-2 ml-auto whitespace-nowrap bg-white font-normal  py-1 px-2    cursor-pointer shadow-neumorphism transition duration-200  active:shadow-neumorphism-active "
              onClick={toggleDrawerRight}
            >
              Language
            </button>
          </div>
        </nav>
        <Routes>
          <Route path="/parkings-velo" element={<MapCard />} />
          <Route path="/evenements-culturels" element={<MapCard />} />
          <Route path="/centres-preparation" element={<MapCard />} />

          <Route path={""} element={<MapCard />} />
          <Route path="/psa-snm" element={<MapCard />} />
          <Route path="/boutiques-officielles" element={<MapCard />} />
          <Route path="/poi-sites" element={<MapCard />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
