import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Zap } from "lucide-react";

export function InteractiveNeuralSphere({ isGenerating }: { isGenerating?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

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

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6.8;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    mount.appendChild(renderer.domElement);

    // 3. Central Translucent Emerald Glass Core (Matching Image Reference 4)
    const coreGeo = new THREE.SphereGeometry(1.2, 64, 64);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#059669"),
      emissive: new THREE.Color("#022c22"),
      emissiveIntensity: 0.5,
      roughness: 0.1,
      metalness: 0.15,
      transmission: 0.65,
      thickness: 1.4,
      ior: 1.52,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      sheen: 0.9,
      sheenColor: new THREE.Color("#34d399"),
      specularColor: new THREE.Color("#d1fae5"),
    });

    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // 4. Outer Geodesic Lattice Wireframe Shell
    const latticeGeo = new THREE.IcosahedronGeometry(1.48, 2);
    const wireframeGeo = new THREE.WireframeGeometry(latticeGeo);
    const latticeMat = new THREE.LineBasicMaterial({
      color: new THREE.Color("#34d399"),
      transparent: true,
      opacity: 0.55,
      linewidth: 1.2,
    });

    const latticeMesh = new THREE.LineSegments(wireframeGeo, latticeMat);
    scene.add(latticeMesh);

    // 5. Sparkling Lattice Node Dots
    const latticePos = latticeGeo.attributes.position!;
    const nodeCount = latticePos.count;
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", latticePos);

    const nodeMat = new THREE.PointsMaterial({
      color: new THREE.Color("#a7f3d0"),
      size: 0.065,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    const nodePoints = new THREE.Points(nodeGeo, nodeMat);
    scene.add(nodePoints);

    // 6. Orbiting Outer Geometric Particle Belts (Matching reference image rings)
    const beltGroup = new THREE.Group();
    const crystalCount = 60;

    const crystalGeo = new THREE.OctahedronGeometry(0.06, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#34d399"),
      roughness: 0.2,
      metalness: 0.8,
      emissive: new THREE.Color("#065f46"),
    });

    const crystals: THREE.Mesh[] = [];

    for (let i = 0; i < crystalCount; i++) {
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      const radius = 1.9 + (i % 3) * 0.25;
      const angle = (i / crystalCount) * Math.PI * 2;
      const heightOffset = (Math.random() - 0.5) * 0.4;

      crystal.position.set(radius * Math.cos(angle), heightOffset, radius * Math.sin(angle));
      crystal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      beltGroup.add(crystal);
      crystals.push(crystal);
    }

    beltGroup.rotation.x = Math.PI * 0.25;
    scene.add(beltGroup);

    // Second Tilted Belt
    const beltGroup2 = beltGroup.clone();
    beltGroup2.rotation.x = -Math.PI * 0.35;
    beltGroup2.rotation.z = Math.PI * 0.2;
    scene.add(beltGroup2);

    // 7. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 14, 25);
    emeraldLight.position.set(4, 5, 5);
    scene.add(emeraldLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 8, 20);
    cyanLight.position.set(-5, -4, 4);
    scene.add(cyanLight);

    const mainSpecular = new THREE.DirectionalLight(0xffffff, 4.0);
    mainSpecular.position.set(3, 6, 5);
    scene.add(mainSpecular);

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
      time += 0.012;

      // Mouse rotation interpolation
      if (!isMouseDown.current) {
        targetRotY.current += isGenerating ? 0.025 : 0.006;
        targetRotX.current = Math.sin(time * 0.5) * 0.15;
      }

      rotX.current += (targetRotX.current - rotX.current) * 0.08;
      rotY.current += (targetRotY.current - rotY.current) * 0.08;

      coreMesh.rotation.x = rotX.current;
      coreMesh.rotation.y = rotY.current;

      latticeMesh.rotation.x = rotX.current * 0.8;
      latticeMesh.rotation.y = rotY.current * 1.2;
      nodePoints.rotation.x = rotX.current * 0.8;
      nodePoints.rotation.y = rotY.current * 1.2;

      beltGroup.rotation.y = time * (isGenerating ? 0.8 : 0.2);
      beltGroup2.rotation.y = -time * (isGenerating ? 0.9 : 0.25);

      // Breathing scale & generation pulse
      const breathe = Math.sin(time * (isGenerating ? 4 : 1.5)) * 0.04;
      const scale = 1 + breathe + (isGenerating ? 0.08 : 0);
      coreMesh.scale.set(scale, scale, scale);

      // Generation emissive pulse
      coreMat.emissiveIntensity = isGenerating ? 1.2 + Math.sin(time * 8) * 0.4 : 0.5;
      emeraldLight.intensity = isGenerating ? 25 : 14;

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
      coreGeo.dispose();
      coreMat.dispose();
      latticeGeo.dispose();
      wireframeGeo.dispose();
      latticeMat.dispose();
      renderer.dispose();
    };
  }, [isGenerating]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDown.current = true;
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
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative flex h-[460px] w-full cursor-grab items-center justify-center overflow-hidden rounded-[2.5rem] bg-[#030805] p-4 shadow-[0_25px_90px_-20px_rgba(16,185,129,0.35)] transition-all duration-500 active:cursor-grabbing"
    >
      {/* Soft Ambient Inner Aura */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.28),transparent_70%)] blur-3xl"
      />

      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="relative z-10 h-full w-full" />

      {/* Top Badge */}
      <div className="absolute top-4 left-5 z-20 flex items-center gap-2 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/80 px-3.5 py-1 text-[11px] font-medium text-emerald-300 shadow-md backdrop-blur-md">
          <Zap className={`size-3.5 text-emerald-400 ${isGenerating ? "animate-spin" : "animate-pulse"}`} />
          {isGenerating ? "Processing Latent Matrix…" : "Neurolok AI Core"}
        </span>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-4 right-5 z-20 flex items-center gap-2 text-[10px] text-emerald-300/80 font-mono pointer-events-none">
        <Sparkles className="size-3 text-emerald-400" />
        <span>Drag to rotate 3D AI Core</span>
      </div>
    </div>
  );
}
