"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useFBX, Environment } from "@react-three/drei";
import * as THREE from "three";

/* ────────────────────────────────────────────
   Particle cloud that assembles into the tooth
   ──────────────────────────────────────────── */
function ParticleAssembly({
  fbx,
  progress,
}: {
  fbx: THREE.Group;
  progress: React.RefObject<number>;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const [data] = useState(() => {
    const positions: number[] = [];
    const clone = fbx.clone(true);

    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = maxDim > 0 ? 2 / maxDim : 1;

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const geo = mesh.geometry.clone();
        geo.applyMatrix4(mesh.matrixWorld);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          positions.push(
            (pos.getX(i) - center.x) * s,
            (pos.getY(i) - center.y) * s,
            (pos.getZ(i) - center.z) * s
          );
        }
        geo.dispose();
      }
    });

    const maxParticles = 4000;
    const stride = Math.max(1, Math.floor(positions.length / 3 / maxParticles));
    const targetArr: number[] = [];
    const startArr: number[] = [];

    for (let i = 0; i < positions.length / 3; i += stride) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      targetArr.push(x, y, z);

      const radius = 4 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      startArr.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
    }

    const count = targetArr.length / 3;
    const target = new Float32Array(targetArr);
    const start = new Float32Array(startArr);
    const current = new Float32Array(start);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(current, 3));

    return { geometry, target, start, current, count };
  });

  useFrame(() => {
    if (!pointsRef.current) return;
    const t = progress.current;

    // Smooth easing for position
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const pos = data.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < data.count; i++) {
      const i3 = i * 3;
      pos.array[i3] = data.start[i3] + (data.target[i3] - data.start[i3]) * ease;
      pos.array[i3 + 1] = data.start[i3 + 1] + (data.target[i3 + 1] - data.start[i3 + 1]) * ease;
      pos.array[i3 + 2] = data.start[i3 + 2] + (data.target[i3 + 2] - data.start[i3 + 2]) * ease;
    }
    pos.needsUpdate = true;

    // Particles fade out from 60% → 100% (overlaps with mesh fade-in)
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = t < 0.6 ? 1 : Math.max(0, 1 - (t - 0.6) / 0.4);
  });

  return (
    <points ref={pointsRef} geometry={data.geometry}>
      <pointsMaterial
        color="#b0b0b0"
        size={0.02}
        sizeAttenuation
        transparent
        opacity={1}
        depthWrite={false}
      />
    </points>
  );
}

/* ────────────────────────────────────────────
   The solid tooth mesh (crossfades with particles)
   ──────────────────────────────────────────── */
function SolidTooth({
  fbx,
  progress,
}: {
  fbx: THREE.Group;
  progress: React.RefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const [scene] = useState(() => {
    const clone = fbx.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = maxDim > 0 ? 2 / maxDim : 1;
    clone.scale.setScalar(s);
    clone.position.set(-center.x * s, -center.y * s, -center.z * s);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
          color: "#e0e0e0",
          roughness: 0.25,
          metalness: 0.15,
          transparent: true,
          opacity: 0,
        });
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
    const t = progress.current;

    // Mesh fades in from 50% → 90% (starts while particles still assembling)
    const meshOpacity = t < 0.5 ? 0 : Math.min(1, (t - 0.5) / 0.4);

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        mat.opacity = meshOpacity;
      }
    });
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

/* ────────────────────────────────────────────
   Main controller: shared progress + cursor
   ──────────────────────────────────────────── */
function ToothController() {
  const fbx = useFBX("/models/teeth.fbx");
  const wrapperRef = useRef<THREE.Group>(null);
  const progress = useRef(0);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    // ~2 seconds total assembly (delta * 0.5 ≈ 2s to reach 1.0)
    if (progress.current < 1) {
      progress.current = Math.min(1, progress.current + delta * 0.5);
    }

    if (!wrapperRef.current) return;
    const targetY = pointer.x * 0.6;
    const targetX = -pointer.y * 0.4;
    wrapperRef.current.rotation.y +=
      (targetY - wrapperRef.current.rotation.y) * 0.05;
    wrapperRef.current.rotation.x +=
      (targetX - wrapperRef.current.rotation.x) * 0.05;
  });

  return (
    <group ref={wrapperRef}>
      <ParticleAssembly fbx={fbx} progress={progress} />
      <SolidTooth fbx={fbx} progress={progress} />
    </group>
  );
}

export default function ToothScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      style={{ pointerEvents: "auto" }}
      frameloop="always"
    >
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <directionalLight position={[-5, -3, 4]} intensity={0.6} />
      <Environment preset="studio" />
      <Suspense fallback={null}>
        <ToothController />
      </Suspense>
    </Canvas>
  );
}
