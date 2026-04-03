"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

function Tooth() {
  const { scene: gltfScene } = useGLTF("/models/tooth2.glb");
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  const [scene] = useState(() => {
    const clone = gltfScene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = maxDim > 0 ? 2.8 / maxDim : 1;
    clone.scale.setScalar(s);
    clone.position.set(-center.x * s, -center.y * s, -center.z * s);

    // Whiten the tooth
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material = mesh.material.clone();
          mesh.material.color.lerp(new THREE.Color("#ffffff"), 0.6);
          mesh.material.emissive = new THREE.Color("#ffffff");
          mesh.material.emissiveIntensity = 0.05;
          mesh.material.needsUpdate = true;
        }
      }
    });

    return clone;
  });

  useEffect(() => {
    return () => {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.geometry?.dispose();
          if (mesh.material instanceof THREE.Material) mesh.material.dispose();
        }
      });
    };
  }, [scene]);

  useFrame(() => {
    if (!groupRef.current) return;
    const baseX = -0.15;
    // Tooth turns TOWARD cursor — eyes follow it
    const targetY = pointer.x * 0.4;
    const targetX = baseX - pointer.y * 0.25;
    groupRef.current.rotation.y +=
      (targetY - groupRef.current.rotation.y) * 0.07;
    groupRef.current.rotation.x +=
      (targetX - groupRef.current.rotation.x) * 0.07;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/tooth2.glb");

export default function ToothScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      style={{ pointerEvents: "auto" }}
      frameloop="always"
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.1} />
      <directionalLight position={[-4, -2, 3]} intensity={0.35} />
      <Environment preset="city" environmentIntensity={0.5} />
      <Suspense fallback={null}>
        <Tooth />
      </Suspense>
    </Canvas>
  );
}
