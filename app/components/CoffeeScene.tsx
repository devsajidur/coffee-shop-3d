"use client";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, ContactShadows, Environment, Center } from "@react-three/drei";
import { Suspense } from "react";

function Model() {
  // পাথ এবং ফাইল নেম চেক করো: cup.glb (ছোট হাতের)
  const { scene } = useGLTF("/assets/3d-models/Cafe.glb");
  
  return (
    <Center>
      <primitive object={scene} scale={2.5} position={[0, 0, 0]} />
    </Center>
  );
}

export default function CoffeeScene() {
  return (
    <div className="h-[500px] w-full bg-[#0a0a0a] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
      <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
        {/* কড়া আলো দিচ্ছি যাতে অন্ধকার না থাকে */}
        <ambientLight intensity={2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={5} />
        <Environment preset="city" />
        
        {/* মডেল লোড না হওয়া পর্যন্ত কমলা রঙের বক্স দেখাবে */}
        <Suspense fallback={
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" wireframe />
          </mesh>
        }>
          <Model />
          <ContactShadows position={[0, -1, 0]} opacity={0.6} scale={10} blur={2} />
        </Suspense>

        <OrbitControls autoRotate autoRotateSpeed={4} enableZoom={true} />
      </Canvas>
    </div>
  );
}