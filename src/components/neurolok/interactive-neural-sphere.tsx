import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Zap } from "lucide-react";

export function InteractiveNeuralSphere() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const rotX = useRef(0);
  const rotY = useRef(0);
  const targetRotX = useRef(0);
  const targetRotY = useRef(0);
  const lastMouse = useRef({ x: 0, y: 0 });
  const isMouseDown = useRef(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 420;
    const height = mount.clientHeight || 420;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6.5;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    mount.appendChild(renderer.domElement);

    // 3. Create Fluid Iridescent Glass Torus Knot (Matching reference image)
    const geometry = new THREE.TorusKnotGeometry(1.4, 0.48, 180, 48, 2, 3);

    // Iridescent Emerald Glass Material
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#059669"),
      emissive: new THREE.Color("#022c22"),
      emissiveIntensity: 0.4,
      roughness: 0.12,
      metalness: 0.25,
      transmission: 0.55,
      thickness: 1.2,
      ior: 1.52,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      sheen: 0.8,
      sheenColor: new THREE.Color("#34d399"),
      specularColor: new THREE.Color("#a7f3d0"),
    });

    const knotMesh = new THREE.Mesh(geometry, material);
    scene.add(knotMesh);

    // 4. Floating Emerald Particles Field
    const particleCount = 80;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: new THREE.Color("#6ee7b7"),
      size: 0.06,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 5. Multi-Point Emerald & Iridescent Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 12, 20);
    emeraldLight.position.set(4, 4, 5);
    scene.add(emeraldLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 8, 20);
    cyanLight.position.set(-4, -3, 4);
    scene.add(cyanLight);

    const specularLight = new THREE.DirectionalLight(0xffffff, 3.5);
    specularLight.position.set(2, 5, 4);
    scene.add(specularLight);

    // Handle Resize
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;

      if (!isMouseDown.current) {
        targetRotY.current += 0.005;
        targetRotX.current = Math.sin(time * 0.4) * 0.15;
      }

      rotX.current += (targetRotX.current - rotX.current) * 0.08;
      rotY.current += (targetRotY.current - rotY.current) * 0.08;

      knotMesh.rotation.x = rotX.current;
      knotMesh.rotation.y = rotY.current;
      knotMesh.rotation.z = Math.sin(time * 0.3) * 0.1;

      particleSystem.rotation.y = time * 0.05;

      emeraldLight.position.x = Math.sin(time * 0.8) * 5;
      emeraldLight.position.y = Math.cos(time * 0.6) * 4;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDown.current = true;
    setIsDragging(true);
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;

    targetRotY.current += dx * 0.008;
    targetRotX.current += dy * 0.008;

    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative flex h-[440px] w-full cursor-grab items-center justify-center overflow-hidden rounded-[2.5rem] bg-[#040906] p-4 shadow-[0_25px_90px_-20px_rgba(16,185,129,0.3)] transition-all duration-500 active:cursor-grabbing"
    >
      {/* Background Radial Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.25),transparent_70%)] blur-3xl"
      />

      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="relative z-10 h-full w-full" />

      {/* Top Badge */}
      <div className="absolute top-4 left-5 z-20 flex items-center gap-2 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/80 px-3 py-1 text-[11px] font-medium text-emerald-300 shadow-md backdrop-blur-md">
          <Zap className="size-3.5 animate-pulse text-emerald-400" /> Iridescent Emerald Torus
        </span>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-4 right-5 z-20 flex items-center gap-2 text-[10px] text-emerald-300/80 font-mono pointer-events-none">
        <Sparkles className="size-3 text-emerald-400" />
        <span>Drag 3D object to rotate & inspect</span>
      </div>
    </div>
  );
}
