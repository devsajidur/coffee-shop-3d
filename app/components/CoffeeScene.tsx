"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, ContactShadows, Environment, Center, Float, Text, Html } from "@react-three/drei";
import { Suspense, useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";

function Loader() {
  return (
    <Html center>
      <div className="text-[#c48c5a] text-[10px] md:text-xs tracking-[0.3em] font-bold uppercase whitespace-nowrap animate-pulse">
        Loading 3D...
      </div>
    </Html>
  );
}

function FallingBeans({ isPaused }: { isPaused: boolean }) {
  const { scene } = useGLTF("/assets/3d-models/two-coffee-beans.glb");
  const beansData = useMemo(() => [
    { delay: 0, x: 0.15, z: 0.05 },
    { delay: 2.5, x: -0.15, z: -0.05 },
    { delay: 1.0, x: 1.8, z: -0.5 },
    { delay: 3.5, x: 2.2, z: 0.8 },
    { delay: 0.5, x: 1.2, z: 1.2 }
  ], []);
  const refs = useRef<THREE.Group[]>([]);

  useFrame((state) => {
    if (isPaused) return; 
    const time = state.clock.getElapsedTime();
    refs.current.forEach((ref, i) => {
      if (ref) {
        const data = beansData[i];
        const t = (time + data.delay) % 6; 
        if (t < 4) { 
          ref.position.y = THREE.MathUtils.lerp(7, -0.5, t / 4); 
          ref.position.x = data.x;
          ref.position.z = data.z;
          ref.scale.setScalar(0.08); 
          ref.visible = true;
        } else {
          ref.visible = false;
        }
      }
    });
  });

  return (
    <group>
      {beansData.map((_, i) => (
        <group key={i} ref={(el) => (refs.current[i] = el!)}>
          <Float speed={1.5} rotationIntensity={2}> 
            <primitive object={scene.clone()} />
          </Float>
        </group>
      ))}
    </group>
  );
}

function Model({ setHovered, activeModel = 1 }: { setHovered: (v: boolean) => void, activeModel?: number }) {
  const modelData = useMemo(() => ({
    1: { 
      path: "/assets/3d-models/latte-with-heart-foam-art.glb", 
      title: "Classic Latte", sub: "WITH ARTISAN HEART FOAM ART", 
      scale: 0.55, hoverScale: 0.60, 
      posY: -3.2, rotX: -0.4, hoverRotX: -0.2 
    },
    2: { 
      path: "/assets/3d-models/Machine-Expresso.glb", 
      title: "Espresso Machine", sub: "PREMIUM BREWING EXPERIENCE", 
      scale: 0.55, hoverScale: 0.60, // সাইজ ব্যালেন্স করা হয়েছে যাতে vh এর ভেতরে থাকে
      posY: -3.2, rotX: 0, hoverRotX: -0.1 // ঠিক কাপের পজিশনেই (posY: -3.2) রাখা হয়েছে
    },
    3: { 
      path: "/assets/3d-models/French-press.glb", 
      title: "French Press", sub: "CLASSIC IMMERSION BREW", 
      scale: 0.55, hoverScale: 0.60, // সাইজ ব্যালেন্স করা হয়েছে
      posY: -3.2, rotX: 0, hoverRotX: -0.1 // ঠিক কাপের পজিশনেই রাখা হয়েছে
    }
  }), []);

  const currentData = modelData[activeModel as keyof typeof modelData] || modelData[1];
  const { scene } = useGLTF(currentData.path);
  
  const modelRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsHovered(false);
    setHovered(false);
    if (modelRef.current) {
      modelRef.current.rotation.y = 0;
      modelRef.current.scale.setScalar(currentData.scale);
    }
  }, [activeModel, setHovered, currentData]);

  useFrame(() => {
    if (modelRef.current) {
      const targetS = isHovered ? currentData.hoverScale : currentData.scale;
      const targetR = isHovered ? currentData.hoverRotX : currentData.rotX;

      modelRef.current.scale.setScalar(THREE.MathUtils.lerp(modelRef.current.scale.x, targetS, 0.1));
      modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, targetR, 0.1);
      
      if (isHovered) {
        modelRef.current.rotation.y += 0.015;
      }
    }
  });

  return (
    <group>
      <group position={[0, 2, 0]}>
        <Text fontSize={0.4} color="#c48c5a" anchorX="center" anchorY="middle">
          {currentData.title}
        </Text>
        <Text position={[0, -0.35, 0]} fontSize={0.12} color="#ffffff" fillOpacity={0.6} anchorX="center" anchorY="middle" letterSpacing={0.1}>
          {currentData.sub}
        </Text>
      </group>

      <Center 
        top 
        position={[0, currentData.posY, 0]}
        onPointerOver={() => { setIsHovered(true); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setIsHovered(false); setHovered(false); document.body.style.cursor = 'default'; }}
      > 
        <primitive ref={modelRef} object={scene} />
      </Center>
    </group>
  );
}

export default function CoffeeScene({ activeModel = 1 }: { activeModel?: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full h-full min-h-[500px] relative z-20">
      <Canvas shadows camera={{ position: [0, 4, 8], fov: 35 }}>
        <ambientLight intensity={1.5} color="#fff8f0" />
        <spotLight position={[5, 10, 5]} intensity={20} color="#ffffff" castShadow />
        <Environment preset="city" />
        
        <Suspense fallback={<Loader />}>
          <Model setHovered={setIsHovered} activeModel={activeModel} />
          
          {activeModel === 1 && <FallingBeans isPaused={isHovered} />}
          
          <ContactShadows position={[0, -0.8, 0]} opacity={0.5} scale={12} blur={2.8} far={1} color="#110804" />
        </Suspense>
      </Canvas>
    </div>
  );
}