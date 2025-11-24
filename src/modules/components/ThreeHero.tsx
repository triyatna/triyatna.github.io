import React, { useEffect, useRef } from "react";

export default function ThreeHero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup = () => {};
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    async function init() {
      const el = ref.current;
      if (!el) return;

      let THREE: typeof import("three");
      try {
        THREE = (await import("three")) as typeof import("three");
      } catch {
        return;
      }

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(el.clientWidth, el.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 100);
      camera.position.z = 6;

      // Tech-themed lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const dir = new THREE.DirectionalLight(0xffffff, 1);
      dir.position.set(5, 5, 5);
      scene.add(dir);

      const readCssVar = (name: string, fallback: string) =>
        getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

      const readAccent = () => new THREE.Color(readCssVar("--accent", "#58A6FF"));
      
      let accent = readAccent();

      // --- Tech Network Globe ---
      const group = new THREE.Group();
      scene.add(group);

      // 1. Wireframe Core
      const geo = new THREE.IcosahedronGeometry(1.8, 1);
      const wireMat = new THREE.LineBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0.15,
      });
      const wireframe = new THREE.LineSegments(new THREE.WireframeGeometry(geo), wireMat);
      group.add(wireframe);

      // 2. Nodes (Points)
      const spriteSize = 32; // Reduced size
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = spriteSize;
      const ctx = canvas.getContext("2d")!;
      const rad = ctx.createRadialGradient(
        spriteSize / 2, spriteSize / 2, 0,
        spriteSize / 2, spriteSize / 2, spriteSize / 2
      );
      rad.addColorStop(0, "rgba(255,255,255,1)");
      rad.addColorStop(0.4, "rgba(255,255,255,0.3)");
      rad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = rad;
      ctx.fillRect(0, 0, spriteSize, spriteSize);
      const spriteTex = new THREE.CanvasTexture(canvas);
      spriteTex.colorSpace = THREE.SRGBColorSpace;

      const pointsMat = new THREE.PointsMaterial({
        map: spriteTex,
        color: accent,
        size: 0.12,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const points = new THREE.Points(geo, pointsMat);
      group.add(points);

      // 3. Outer Ring (Data Stream)
      const ringGeo = new THREE.TorusGeometry(2.8, 0.02, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);

      // 4. Floating Particles
      const partGeo = new THREE.BufferGeometry();
      const partCount = 40;
      const partPos = new Float32Array(partCount * 3);
      for(let i=0; i<partCount*3; i++) partPos[i] = (Math.random() - 0.5) * 8;
      partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
      const partMat = new THREE.PointsMaterial({
        color: accent,
        size: 0.05,
        transparent: true,
        opacity: 0.4,
      });
      const particles = new THREE.Points(partGeo, partMat);
      scene.add(particles);

      // Theme Observer
      const mo = new MutationObserver(() => {
        const nextAccent = readAccent();
        if (!nextAccent.equals(accent)) {
          accent = nextAccent;
          wireMat.color = accent;
          pointsMat.color = accent;
          ringMat.color = accent;
          partMat.color = accent;
        }
      });
      mo.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "class", "style"],
      });

      // Resize Observer
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        }
      });
      ro.observe(el);

      let raf = 0;
      const animate = () => {
        const t = performance.now() * 0.001;
        
        group.rotation.y = t * 0.15;
        group.rotation.x = Math.sin(t * 0.2) * 0.1;
        
        ring.rotation.z = -t * 0.2;
        ring.scale.setScalar(1 + Math.sin(t) * 0.02);

        particles.rotation.y = t * 0.05;

        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        mo.disconnect();
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
        renderer.dispose();
        
        // Dispose geometries & materials
        geo.dispose();
        wireframe.geometry.dispose();
        ringGeo.dispose();
        partGeo.dispose();
        spriteTex.dispose();
        
        wireMat.dispose();
        pointsMat.dispose();
        ringMat.dispose();
        partMat.dispose();
      };
    }

    init();
    return () => cleanup();
  }, []);

  return <div ref={ref} className="h-full w-full" aria-hidden="true" />;
}
