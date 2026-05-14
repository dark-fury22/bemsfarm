import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as THREE from "three";

export default function SplashScreen() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    // ── Three.js Scene Setup ──
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.z = 5;

    // ── Lighting ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xe07b39, 1.2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0x3d6b2e, 0.8);
    dirLight2.position.set(-5, -3, -5);
    scene.add(dirLight2);

    // ── Main Fruit (Orange Sphere) ──
    const fruitGeo = new THREE.SphereGeometry(1.2, 64, 64);
    const fruitMat = new THREE.MeshPhongMaterial({
      color: 0xe07b39,
      shininess: 80,
      specular: 0xffaa66,
    });
    const fruit = new THREE.Mesh(fruitGeo, fruitMat);
    scene.add(fruit);

    // ── Stem ──
    const stemGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8);
    const stemMat = new THREE.MeshPhongMaterial({ color: 0x5d4037 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(0, 1.4, 0);
    scene.add(stem);

    // ── Leaf ──
    const leafGeo = new THREE.SphereGeometry(0.3, 16, 16);
    leafGeo.scale(1.5, 0.3, 0.8);
    const leafMat = new THREE.MeshPhongMaterial({ color: 0x3d6b2e });
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set(0.3, 1.5, 0);
    scene.add(leaf);

    // ── Floating Particles (leaves/sparkles) ──
    const particleCount = 80;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    const particleMat = new THREE.PointsMaterial({
      color: 0x3d6b2e,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── Animation Loop ──
    let frame = 0;
    const animate = () => {
      frame++;
      sceneRef.current = requestAnimationFrame(animate);

      fruit.rotation.y += 0.008;
      fruit.rotation.x = Math.sin(frame * 0.01) * 0.1;
      fruit.position.y = Math.sin(frame * 0.02) * 0.15;
      stem.position.y = 1.4 + Math.sin(frame * 0.02) * 0.15;
      leaf.position.y = 1.5 + Math.sin(frame * 0.02) * 0.15;
      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;

      renderer.render(scene, camera);
    };
    animate();

    // ── Navigate after 3s ──
    const token = localStorage.getItem("token");
    const timer = setTimeout(() => navigate(token ? "/home" : "/login"), 3000);

    // ── Cleanup ──
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(sceneRef.current);
      renderer.dispose();
    };
  }, [navigate]);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#F5EFE6",
        overflow: "hidden",
      }}
    >
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />

      {/* Brand Name Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        style={{
          position: "absolute",
          bottom: "20%",
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
          style={{
            fontSize: "52px",
            fontWeight: 800,
            color: "#3D6B2E",
            letterSpacing: "-1px",
            marginBottom: "8px",
          }}
        >
          Frutella
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{
            fontSize: "16px",
            color: "#8B6F47",
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}
        >
          Fresh from Nigeria 🌿
        </motion.p>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ display: "flex", gap: "8px", marginTop: "32px" }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#E07B39",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
