import { Routes, Route, Link } from "react-router-dom";
import "./index.css"; // Assurez-vous que votre fichier CSS est bien importé
import MapCard from "./components/MapCard";
import { OlympicIcon } from "./assets/icons";
import Drawer from "react-modern-drawer";
import { useState } from "react";
import "react-modern-drawer/dist/index.css";
import MapProvider from "./constants/MapContext";

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
              Languagegjhgjhg
            </button>
          </div>
        </nav>
        <Routes>
          <Route path="/parkings-velo" element={<>toto</>} />
          <Route path="/evenements-culturels" element={<>toto2</>} />
          <Route path="/centres-preparation" element={<>toto3</>} />

          <Route path={""} element={<></>} />
          <Route path="/psa-snm" element={<></>} />
          <Route path="/boutiques-officielles" element={<></>} />
          <Route path="/poi-sites" element={<></>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
// import React, { useState, useCallback, useMemo } from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, Line } from "@react-three/drei";
// import * as THREE from "three";
// import data from "./data.json"; // Assurez-vous que vos données sont correctement formatées

// // Définition des types pour TypeScript
// interface ComputerData {
//   id: string;
//   name: string;
//   position?: [number, number, number];
//   color?: string;
// }

// interface HouseData {
//   id: string;
//   name: string;
//   position?: [number, number, number];
//   color?: string;
//   computers: ComputerData[];
// }

// interface BuildingData {
//   id: string;
//   name: string;
//   position?: [number, number, number];
//   color?: string;
//   houses: HouseData[];
// }

// interface Data {
//   buildings: BuildingData[];
// }

// const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffa500", "#800080", "#ffff00"];

// // Composant pour le plateau
// const Plate: React.FC = React.memo(() => (
//   <mesh position={[0, 0, 0]} receiveShadow>
//     <boxGeometry args={[600, 1, 600]} />
//     <meshStandardMaterial color="#ccc" />
//   </mesh>
// ));

// interface BuildingProps {
//   position: [number, number, number];
//   color: string;
//   onClick: () => void;
// }

// // Immeubles en forme de cylindre
// const Building: React.FC<BuildingProps> = React.memo(({ position, color, onClick }) => (
//   <mesh position={position} castShadow onClick={onClick}>
//     <cylinderGeometry args={[5, 5, 20, 32]} />
//     <meshStandardMaterial color={color} />
//   </mesh>
// ));

// interface HouseProps {
//   position: [number, number, number];
//   color: string;
//   onClick: () => void;
// }

// // Maisons en forme de cube
// const House: React.FC<HouseProps> = React.memo(({ position, color, onClick }) => (
//   <mesh position={position} castShadow onClick={onClick}>
//     <boxGeometry args={[6, 12, 6]} />
//     <meshStandardMaterial color={color} />
//   </mesh>
// ));

// interface ComputerProps {
//   position: [number, number, number];
//   color: string;
// }

// // Ordinateurs en forme de sphère
// const Computer: React.FC<ComputerProps> = React.memo(({ position, color }) => (
//   <mesh position={position} castShadow>
//     <sphereGeometry args={[1, 32, 32]} />
//     <meshStandardMaterial color={color} />
//   </mesh>
// ));

// interface RoadProps {
//   start: [number, number, number];
//   end: [number, number, number];
//   isHighlighted?: boolean;
// }

// // Composant pour les routes
// const Road: React.FC<RoadProps> = React.memo(({ start, end, isHighlighted }) => (
//   <Line
//     points={[start, end]}
//     color={isHighlighted ? "yellow" : "black"}
//     lineWidth={2}
//   />
// ));

// // Fonction pour générer les positions et les couleurs
// const generatePositionsAndColors = (data: Data): Data => {
//   const buildingCount = data.buildings.length;
//   const radiusBuilding = buildingCount * 5;
//   const radiusHouse = buildingCount * 10;
//   const radiusComputer = buildingCount * 15;

//   const centerX = 0;
//   const centerZ = 0;

//   const buildings = data.buildings.map((building, index) => {
//     const angleIncrementBuilding = (Math.PI * 2) / buildingCount;
//     const angleBuilding = index * angleIncrementBuilding;

//     const x = centerX + radiusBuilding * Math.cos(angleBuilding);
//     const z = centerZ + radiusBuilding * Math.sin(angleBuilding);
//     const y = 10; // Hauteur du cylindre / 2

//     const buildingColor = colors[index % colors.length];
//     const buildingPosition: [number, number, number] = [x, y, z];

//     const houseCount = building.houses.length;
//     const angleIncrementHouse = (Math.PI * 2) / (houseCount * buildingCount);

//     const houses = building.houses.map((house, hIndex) => {
//       const angleHouse = angleBuilding + hIndex * angleIncrementHouse;

//       const hx = centerX + radiusHouse * Math.cos(angleHouse);
//       const hz = centerZ + radiusHouse * Math.sin(angleHouse);
//       const hy = 6; // Hauteur du cube / 2

//       const houseColor = colors[(index + hIndex + 1) % colors.length];
//       const housePosition: [number, number, number] = [hx, hy, hz];

//       const computerCount = house.computers.length;
//       const angleIncrementComputer = (Math.PI * 2) / (computerCount * houseCount * buildingCount);

//       const computers = house.computers.map((computer, cIndex) => {
//         const angleComputer = angleHouse + cIndex * angleIncrementComputer;

//         const cx = centerX + radiusComputer * Math.cos(angleComputer);
//         const cz = centerZ + radiusComputer * Math.sin(angleComputer);
//         const cy = 1; // Rayon de la sphère

//         const computerColor = colors[(index + hIndex + cIndex + 2) % colors.length];
//         const computerPosition: [number, number, number] = [cx, cy, cz];

//         return {
//           ...computer,
//           position: computerPosition,
//           color: computerColor,
//         };
//       });

//       return {
//         ...house,
//         position: housePosition,
//         color: houseColor,
//         computers,
//       };
//     });

//     return {
//       ...building,
//       position: buildingPosition,
//       color: buildingColor,
//       houses,
//     };
//   });

//   return {
//     ...data,
//     buildings,
//   };
// };

// const Scene: React.FC = () => {
//   const [openedHouses, setOpenedHouses] = useState<Set<string>>(new Set());
//   const [openedComputers, setOpenedComputers] = useState<Set<string>>(new Set());

//   const toggleHouses = useCallback((buildingId: string) => {
//     setOpenedHouses((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(buildingId)) {
//         newSet.delete(buildingId);
//       } else {
//         newSet.add(buildingId);
//       }
//       return newSet;
//     });
//   }, []);

//   const toggleComputers = useCallback((houseId: string) => {
//     setOpenedComputers((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(houseId)) {
//         newSet.delete(houseId);
//       } else {
//         newSet.add(houseId);
//       }
//       return newSet;
//     });
//   }, []);

//   const dataWithPositions = useMemo(() => generatePositionsAndColors(data), [data]);

//   const openedHousesData = useMemo(() => {
//     return dataWithPositions.buildings
//       .filter((building) => openedHouses.has(building.id))
//       .flatMap((building) =>
//         building.houses.map((house) => ({ ...house, building }))
//       );
//   }, [openedHouses, dataWithPositions]);

//   const openedComputersData = useMemo(() => {
//     return openedHousesData
//       .filter((house) => openedComputers.has(house.id))
//       .flatMap((house) =>
//         house.computers.map((computer) => ({ ...computer, house }))
//       );
//   }, [openedComputers, openedHousesData]);

//   return (
//     <>
//       <Plate />

//       {/* Immeubles */}
//       {dataWithPositions.buildings.map((building) => (
//         <Building
//           key={building.id}
//           position={building.position!}
//           color={building.color!}
//           onClick={() => toggleHouses(building.id)}
//         />
//       ))}

//       {/* Maisons */}
//       {openedHousesData.map((house) => (
//         <House
//           key={house.id}
//           position={house.position!}
//           color={house.color!}
//           onClick={() => toggleComputers(house.id)}
//         />
//       ))}

//       {/* Ordinateurs */}
//       {openedComputersData.map((computer) => (
//         <Computer
//           key={computer.id}
//           position={computer.position!}
//           color={computer.color!}
//         />
//       ))}

//       {/* Routes */}
//       {openedHousesData.map((house) => (
//         <Road
//           key={`road-house-${house.id}`}
//           start={house.building.position!}
//           end={house.position!}
//           isHighlighted={openedComputers.has(house.id)}
//         />
//       ))}

//       {openedComputersData.map((computer) => (
//         <Road
//           key={`road-computer-${computer.id}`}
//           start={computer.house.position!}
//           end={computer.position!}
//           isHighlighted
//         />
//       ))}
//     </>
//   );
// };

// const App: React.FC = () => (
//   <div style={{ width: "100vw", height: "100vh", background: "#552" }}>
//     <Canvas
//       shadows
//       camera={{
//         position: [0, 150, 300],
//         fov: 60,
//         near: 0.1,
//         far: 1000,
//       }}
//     >
//       <ambientLight intensity={0.9} />
//       <directionalLight position={[50, 100, 50]} intensity={1} castShadow={true} />
//       <Scene />
//       <OrbitControls enableZoom enableRotate enablePan />
//     </Canvas>
//   </div>
// );

// export default App;
// import React, { useState, useCallback, useMemo } from "react";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import { OrbitControls, SoftShadows } from "@react-three/drei";
// import * as THREE from "three";
// import { animated, useSpring } from "@react-spring/three";
// import data from "./data.json";

// // Types TypeScript
// interface ComputerData {
//   id: string;
//   name: string;
//   position?: [number, number, number];
// }

// interface HouseData {
//   id: string;
//   name: string;
//   position?: [number, number, number];
//   computers: ComputerData[];
// }

// interface BuildingData {
//   id: string;
//   name: string;
//   position?: [number, number, number];
//   houses: HouseData[];
//   color: string;
// }

// interface Data {
//   buildings: BuildingData[];
// }

// // Composant pour le plateau
// const Plate: React.FC<{ radius: number }> = React.memo(({ radius }) => (
//   <mesh
//     position={[0, -2, 0]}
//     receiveShadow
//     rotation={[-Math.PI / 2, 0, 0]}
//   >
//     <circleGeometry args={[radius + 20, 64]} />
//     <meshStandardMaterial color="#ffd700" side={THREE.DoubleSide} />
//   </mesh>
// ));

// // Composant pour les entités
// const AnimatedBuilding = animated((props: any) => (
//   <mesh position={props.position} castShadow onClick={props.onClick}>
//     <cylinderGeometry args={[5, 5, props.height, 64]} />
//     <meshStandardMaterial color={props.color} />
//   </mesh>
// ));

// const AnimatedHouse = animated((props: any) => (
//   <mesh position={props.position} castShadow onClick={props.onClick}>
//     <boxGeometry args={[6, props.height, 6]} />
//     <meshStandardMaterial color={props.color} />
//   </mesh>
// ));

// const AnimatedComputer = animated((props: any) => (
//   <mesh position={props.position} castShadow>
//     <sphereGeometry args={[2, 64, 64]} />
//     <meshStandardMaterial color={props.color} />
//   </mesh>
// ));

// // Gestion de la caméra avec animation
// const AnimatedCamera: React.FC<{ is2D: boolean }> = ({ is2D }) => {
//   const { camera } = useThree();

//   // Animation de la caméra
//   const { position, rotation } = useSpring({
//     position: is2D ? [0, 300, 0] : [0, 200, 400],
//     rotation: is2D ? [-Math.PI / 2, 0, 0] : [0, 0, 0],
//     config: { mass: 2, tension: 200, friction: 40 },
//   });

//   useFrame(() => {
//     // Mise à jour progressive de la caméra
//     camera.position.set(position.get()[0], position.get()[1], position.get()[2]);
//     camera.rotation.set(rotation.get()[0], rotation.get()[1], rotation.get()[2]);
//   });

//   return null;
// };

// // Génération des positions
// const generatePositionsAndColors = (
//   data: Data,
//   radiusBuilding: number,
//   radiusHouse: number,
//   radiusComputer: number
// ): { data: Data; radius: number } => {
//   const buildingCount = data.buildings.length;
//   const centerX = 0;
//   const centerZ = 0;

//   const buildings = data.buildings.map((building, index) => {
//     const angleIncrementBuilding = (Math.PI * 2) / buildingCount;
//     const angleBuilding = index * angleIncrementBuilding;

//     const x = centerX + radiusBuilding * Math.cos(angleBuilding);
//     const z = centerZ + radiusBuilding * Math.sin(angleBuilding);
//     const y = 10;

//     const buildingColor = `hsl(${(index * 360) / buildingCount}, 80%, 50%)`;
//     const buildingPosition: [number, number, number] = [x, y, z];

//     const houseCount = building.houses.length;
//     const angleIncrementHouse = (Math.PI * 2) / (houseCount * buildingCount);

//     const houses = building.houses.map((house, hIndex) => {
//       const angleHouse = angleBuilding + hIndex * angleIncrementHouse;

//       const hx = centerX + radiusHouse * Math.cos(angleHouse);
//       const hz = centerZ + radiusHouse * Math.sin(angleHouse);
//       const hy = 6;

//       const housePosition: [number, number, number] = [hx, hy, hz];

//       const computerCount = house.computers.length;
//       const angleIncrementComputer = (Math.PI * 2) / (computerCount * houseCount * buildingCount);

//       const computers = house.computers.map((computer, cIndex) => {
//         const angleComputer = angleHouse + cIndex * angleIncrementComputer;

//         const cx = centerX + radiusComputer * Math.cos(angleComputer);
//         const cz = centerZ + radiusComputer * Math.sin(angleComputer);
//         const cy = 2;

//         const computerPosition: [number, number, number] = [cx, cy, cz];

//         return {
//           ...computer,
//           position: computerPosition,
//         };
//       });

//       return {
//         ...house,
//         position: housePosition,
//         computers,
//       };
//     });

//     return {
//       ...building,
//       position: buildingPosition,
//       color: buildingColor,
//       houses,
//     };
//   });

//   return {
//     data: { ...data, buildings },
//     radius: radiusComputer + 10,
//   };
// };

// const Scene: React.FC<{ radiusBuilding: number; radiusHouse: number; radiusComputer: number; is2D: boolean }> = ({
//   radiusBuilding,
//   radiusHouse,
//   radiusComputer,
//   is2D,
// }) => {
//   const { data: dataWithPositions, radius } = useMemo(
//     () => generatePositionsAndColors(data, radiusBuilding, radiusHouse, radiusComputer),
//     [data, radiusBuilding, radiusHouse, radiusComputer]
//   );

//   return (
//     <>
//       <SoftShadows size={10} samples={30} />
//       <Plate radius={radius} />

//       {dataWithPositions.buildings.map((building) => (
//         <React.Fragment key={building.id}>
//           <AnimatedBuilding
//             position={building.position!}
//             color={building.color}
//             height={is2D ? 0.5 : 20}
//           />
//           {building.houses.map((house) => (
//             <React.Fragment key={house.id}>
//               <AnimatedHouse
//                 position={house.position!}
//                 color={building.color}
//                 height={is2D ? 0.5 : 12}
//               />
//               {house.computers.map((computer) => (
//                 <AnimatedComputer
//                   key={computer.id}
//                   position={computer.position!}
//                   color={building.color}
//                 />
//               ))}
//             </React.Fragment>
//           ))}
//         </React.Fragment>
//       ))}
//     </>
//   );
// };

// const App: React.FC = () => {
//   const [radiusBuilding, setRadiusBuilding] = useState(50);
//   const [radiusHouse, setRadiusHouse] = useState(100);
//   const [radiusComputer, setRadiusComputer] = useState(150);
//   const [is2D, setIs2D] = useState(false);

//   const handleBuildingRadius = (value: number) => {
//     setRadiusBuilding(Math.max(25, Math.min(value, radiusHouse)));
//   };

//   const handleHouseRadius = (value: number) => {
//     setRadiusHouse(Math.max(radiusBuilding, Math.min(value, radiusComputer)));
//   };

//   const handleComputerRadius = (value: number) => {
//     setRadiusComputer(Math.max(radiusHouse, Math.min(value, 400)));
//   };

//   return (
//     <div style={{ width: "100vw", height: "100vh", background: "#552", position: "relative" }}>
//       <div
//         style={{
//           position: "absolute",
//           top: "10px",
//           right: "10px",
//           background: "rgba(255, 255, 255, 0.8)",
//           padding: "10px",
//           borderRadius: "8px",
//           zIndex: 1000,
//         }}
//       >
//         <div>
//           <label>Bâtiments Radius: {radiusBuilding}</label>
//           <input
//             type="range"
//             min="25"
//             max={radiusHouse}
//             value={radiusBuilding}
//             onChange={(e) => handleBuildingRadius(Number(e.target.value))}
//           />
//         </div>
//         <div>
//           <label>Maisons Radius: {radiusHouse}</label>
//           <input
//             type="range"
//             min={radiusBuilding}
//             max={radiusComputer}
//             value={radiusHouse}
//             onChange={(e) => handleHouseRadius(Number(e.target.value))}
//           />
//         </div>
//         <div>
//           <label>Ordinateurs Radius: {radiusComputer}</label>
//           <input
//             type="range"
//             min={radiusHouse}
//             max="400"
//             value={radiusComputer}
//             onChange={(e) => handleComputerRadius(Number(e.target.value))}
//           />
//         </div>
//         <button
//           style={{ marginTop: "10px", padding: "5px 10px", background: "#333", color: "#fff", borderRadius: "5px" }}
//           onClick={() => setIs2D((prev) => !prev)}
//         >
//           {is2D ? "Passer en 3D" : "Passer en 2D"}
//         </button>
//       </div>

//       <Canvas
//         shadows
//         camera={{
//           position: [400, 0, 400],
//           fov: 50,
//           near: 0.1,
//           far: 1000,
//         }}
//       >
//         <ambientLight intensity={0.8} />
//         <directionalLight
//           position={[50, 100, 50]}
//           intensity={1.5}
//           castShadow
//           shadow-mapSize-width={1024}
//           shadow-mapSize-height={1024}
//         />
//         <AnimatedCamera is2D={is2D} />
//         <Scene
//           radiusBuilding={radiusBuilding}
//           radiusHouse={radiusHouse}
//           radiusComputer={radiusComputer}
//           is2D={is2D}
//         />
//         <OrbitControls enableZoom enablePan enableRotate={!is2D} maxPolarAngle={is2D ? Math.PI / 2 : Math.PI} />
//       </Canvas>
//     </div>
//   );
// };

// export default App;