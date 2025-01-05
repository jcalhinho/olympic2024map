// // src/components/InvisibleScreen.tsx
// import React, { useState, forwardRef } from 'react';
// import { RigidBody } from '@react-three/rapier';
// import * as THREE from 'three';
// import { TextureLoader } from 'three';
// import { useLoader } from '@react-three/fiber';

// interface InvisibleScreenProps {
//   position?: THREE.Vector3;
//   rotation?: [number, number, number];
// }

// const InvisibleScreen = forwardRef<THREE.Mesh, InvisibleScreenProps>(({
//   position,
//   rotation = [0, 0, 0],
// }, ref) => {
//   const [isCracked, setIsCracked] = useState(false);
//   const crackTexture = useLoader(TextureLoader, '../src/textures/Drawing.png');

//   const handleCollisionEnter = (event: any) => {
//     setIsCracked(true);
//   };

//   return (
//     <RigidBody
//       type="fixed"
//       colliders="cuboid"
//       restitution={0.1}
//       friction={0.1}
//       position={position}
//       rotation={rotation as [number, number, number]}
//       onCollisionEnter={handleCollisionEnter}
//       userData={{ type: 'invisibleScreen' }}
//     >
//       <mesh ref={ref} receiveShadow castShadow>
//         <boxGeometry args={[40, 20, 0.2]} />
//         <meshPhysicalMaterial
//           opacity={isCracked ? 0.7 : 0}
//           transparent
//           color={'white'}
//           transmission={isCracked ? 1 : 0}
//           roughness={0}
//           metalness={0.1}
//           ior={1.5}
//           reflectivity={0.4}
//           thickness={0.05}
//           envMapIntensity={1}
//           map={isCracked ? crackTexture : null}
//         />
//       </mesh>
//     </RigidBody>
//   );
// });

// export default InvisibleScreen;

// src/components/InvisibleScreen.tsx
import React, { useState, forwardRef } from 'react';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import ShatterEffect from './ShatteredGlass'; // <-- On l'importe

interface InvisibleScreenProps {
  position?: THREE.Vector3;
  rotation?: [number, number, number];
}

const InvisibleScreen = forwardRef<THREE.Mesh, InvisibleScreenProps>(
  ({ position, rotation = [0, 0, 0] }, ref) => {
    // On garde si besoin
    const [isCracked, setIsCracked] = useState(false);

    // Nouvel état pour l’effet de shatter
    const [shattered, setShattered] = useState(false);

    const crackTexture = useLoader(TextureLoader, '../src/textures/Drawing.png');

    const handleCollisionEnter = (event: any) => {
      // Au lieu de fissurer l’écran, on active le shatter
      setShattered(true);
      // Vous pouvez retirer ou commenter ce setIsCracked
     // setIsCracked(true);
    };

    return (
      <>
        {!shattered && (
          <RigidBody
            type="fixed"
            colliders="cuboid"
            restitution={0.1}
            friction={0.1}
            position={position}
            rotation={rotation as [number, number, number]}
            onCollisionEnter={handleCollisionEnter}
            userData={{ type: 'invisibleScreen' }}
          >
            <mesh ref={ref} receiveShadow castShadow>
              <boxGeometry args={[40, 20, 0.2]} />
              <meshPhysicalMaterial
                opacity={isCracked ? 0.7 : 0}
                transparent
                color={'white'}
                transmission={isCracked ? 1 : 0}
                roughness={0}
                metalness={0.1}
                ior={1.5}
                reflectivity={0.4}
                thickness={0.05}
                envMapIntensity={1}
                map={isCracked ? crackTexture : null}
              />
            </mesh>
          </RigidBody>
        )}

        {shattered && (
          // On affiche le composant ShatterEffect
          <ShatterEffect
            imageUrl='../src/textures/Drawing.png' // ou l'image que vous voulez "exploser"
            position={[0, 0, 0]}
            size={[50, 40, 0.5]} // dimensions proches de l'écran
          />
        )}
      </>
    );
  }
);

export default InvisibleScreen;