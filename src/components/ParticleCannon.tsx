// src/components/ParticleCannon.tsx
import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RigidBody, CollisionEnterEvent } from '@react-three/rapier';

interface ParticleCannonProps {
  onBrickDestroyed: (brickId: string) => void;
  onLetterFallen: (letter: string) => void;
}

interface Particle {
  id: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
}

let particleIdCounter = 0; // Compteur pour les IDs des particules

const ParticleCannon: React.FC<ParticleCannonProps> = ({ onBrickDestroyed, onLetterFallen }) => {
  const [particles, setParticles] = useState<Particle[]>([]); // Liste des particules
  const [isFiring, setIsFiring] = useState(false); // État de tir
  const { camera } = useThree();

  const velocity = 20; // Vitesse des particules
  const maxParticles = 100; // Nombre maximum de particules

  // Direction basée sur la souris
  const [direction, setDirection] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, -1));

  // Référence pour le viseur
  const crosshairRef = useRef<THREE.Mesh>(null);

  // Fonction pour tirer une particule
  const shootParticle = () => {
    if (particles.length >= maxParticles) return;

    const origin = new THREE.Vector3(0, 2, 0); // Position du canon
    const velocityVector = direction.clone().multiplyScalar(velocity);

    const newParticle: Particle = {
      id: particleIdCounter++,
      position: origin.clone(),
      velocity: velocityVector,
    };

    setParticles((prev) => [...prev, newParticle]);
  };

  // Fonction pour viser (suivi de la souris)
  const handleMouseMove = (event: MouseEvent) => {
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const dir = raycaster.ray.direction.clone().normalize();

    setDirection(dir);
  };

  // Gestion des événements de la souris
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [camera]);

  // Gestion des événements de tir (barre d'espace)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        setIsFiring(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        setIsFiring(false); // Correction : Arrêter le tir lors de la libération de la touche
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Animation des particules et mise à jour du viseur
  useFrame(() => {
    if (isFiring) {
      shootParticle();
    }

    // Mettre à jour le viseur
    if (crosshairRef.current) {
      const distance = 10; // Distance devant la caméra
      const newPosition = camera.position.clone().add(direction.clone().multiplyScalar(distance));
      crosshairRef.current.position.copy(newPosition);
      crosshairRef.current.lookAt(camera.position);
    }
  });

  // Fonction de collision
  const handleCollision = (particleId: number, event: CollisionEnterEvent) => {
    const otherBody = event.other.rigidBody;
    const userData = otherBody?.userData as { type: string; id?: string; letter?: string };

    if (userData?.type === 'brick') {
      // Détruire la brique
      onBrickDestroyed(userData.id || '');

      // Faire tomber la lettre correspondante
      if (userData.letter) {
        onLetterFallen(userData.letter);
      }
    }

    // Supprimer la particule après collision
    setParticles((prev) => prev.filter((p) => p.id !== particleId));
  };

  return (
    <>
      {/* Canon */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 2, 32]} />
        <meshStandardMaterial color="gray" />
      </mesh>

      {/* Viseur */}
      <mesh ref={crosshairRef}>
        <sphereGeometry args={[0.1, 6, 6]} />
        <meshBasicMaterial color="red" />
      </mesh>

      {/* Particules */}
      {particles.map((particle) => (
        <RigidBody
          key={particle.id}
          colliders="ball" // Correction : Utiliser 'ball' pour les particules sphériques
          restitution={0.1} // Pas de rebond
          friction={0.5}
          mass={1}
          position={[particle.position.x, particle.position.y, particle.position.z]}
          linearVelocity={[particle.velocity.x, particle.velocity.y, particle.velocity.z]}
          onCollisionEnter={(event) => handleCollision(particle.id, event)}
        >
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
};

export default ParticleCannon;