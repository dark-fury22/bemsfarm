import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import Footer from "../components/layout/Footer";

const COLORS = {
  primary: "#2E7D32",
  accent: "#F57C00",
  dark: "#1A1A2E",
  white: "#FFFFFF",
  gray: "#F8F9FA",
};

export default function LandingPage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const W = canvas.parentElement.offsetWidth;
    const H = canvas.parentElement.offsetHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.set(0, 1, 9);

    // ── Fog ──
    scene.fog = new THREE.FogExp2(0x0a1628, 0.04);

    // ── Lighting ──
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const sun = new THREE.DirectionalLight(0xffeedd, 2.5);
    sun.position.set(8, 12, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.setScalar(2048);
    scene.add(sun);
    const green = new THREE.PointLight(0x2e7d32, 3, 20);
    green.position.set(-6, 4, 2);
    scene.add(green);
    const orange = new THREE.PointLight(0xf57c00, 2, 15);
    orange.position.set(6, 2, -2);
    scene.add(orange);
    const blue = new THREE.PointLight(0x1a237e, 1.5, 12);
    blue.position.set(0, -3, 4);
    scene.add(blue);

    // ── Ground plane with reflections ──
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.MeshStandardMaterial({
        color: 0x0d1117,
        roughness: 0.8,
        metalness: 0.3,
      }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -3;
    ground.receiveShadow = true;
    scene.add(ground);

    // ── Grid ──
    const grid = new THREE.GridHelper(40, 30, 0x1a3a1a, 0x0d2a0d);
    grid.position.y = -2.98;
    grid.material.opacity = 0.4;
    grid.material.transparent = true;
    scene.add(grid);

    // ── Central hero orb ──
    const orbGroup = new THREE.Group();
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 128, 128),
      new THREE.MeshStandardMaterial({
        color: 0x2e7d32,
        emissive: 0x1a4a1a,
        emissiveIntensity: 0.3,
        roughness: 0.1,
        metalness: 0.9,
      }),
    );
    orb.castShadow = true;
    orbGroup.add(orb);

    // Inner glow orb
    const innerOrb = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 64, 64),
      new THREE.MeshBasicMaterial({
        color: 0x4caf50,
        transparent: true,
        opacity: 0.15,
      }),
    );
    orbGroup.add(innerOrb);

    // Orbit rings
    const ringColors = [0x2e7d32, 0xf57c00, 0x4caf50];
    const rings = ringColors.map((col, i) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.2 + i * 0.6, 0.025, 16, 200),
        new THREE.MeshBasicMaterial({
          color: col,
          transparent: true,
          opacity: 0.6 - i * 0.15,
        }),
      );
      ring.rotation.x = Math.PI / 3 + i * 0.4;
      ring.rotation.y = i * 0.8;
      orbGroup.add(ring);
      return ring;
    });

    orbGroup.position.set(2, 0.5, 0);
    scene.add(orbGroup);

    // ── Floating Nigerian food crystals ──
    const crystals = [];
    const crystalData = [
      { color: 0xf4d03f, pos: [-4, 2, -1], size: 0.5 }, // Rice/grain gold
      { color: 0xe74c3c, pos: [-3, -0.5, 1], size: 0.4 }, // Tomatoes red
      { color: 0x27ae60, pos: [5, 2.5, -2], size: 0.45 }, // Vegetables green
      { color: 0xe07b39, pos: [4, -1, 1], size: 0.55 }, // Palm oil orange
      { color: 0x8e44ad, pos: [-5, 1, 2], size: 0.35 }, // Beans purple
      { color: 0xf39c12, pos: [0, 3, -3], size: 0.4 }, // Groundnut yellow
      { color: 0x1abc9c, pos: [-1, -2, 2], size: 0.3 }, // Ugu teal
      { color: 0xe67e22, pos: [6, 1, 0], size: 0.5 }, // Garri amber
    ];

    crystalData.forEach((data, i) => {
      const geo =
        Math.random() > 0.5
          ? new THREE.OctahedronGeometry(data.size, 0)
          : new THREE.TetrahedronGeometry(data.size, 0);

      const mat = new THREE.MeshStandardMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 0.25,
        roughness: 0.2,
        metalness: 0.7,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...data.pos);
      mesh.castShadow = true;
      mesh.userData = {
        basePos: [...data.pos],
        speed: 0.3 + i * 0.15,
        phase: i * 0.9,
        rotSpeed: 0.01 + Math.random() * 0.02,
      };
      scene.add(mesh);
      crystals.push(mesh);

      // Crystal point light
      const light = new THREE.PointLight(data.color, 0.8, 5);
      light.position.set(...data.pos);
      scene.add(light);
      mesh.userData.light = light;
    });

    // ── Particle system ──
    const pCount = 500;
    const pPositions = new Float32Array(pCount * 3);
    const pColors = new Float32Array(pCount * 3);
    const greenC = new THREE.Color(0x4caf50);
    const orangeC = new THREE.Color(0xf57c00);

    for (let i = 0; i < pCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 30;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      const c = Math.random() > 0.5 ? greenC : orangeC;
      pColors[i * 3] = c.r;
      pColors[i * 3 + 1] = c.g;
      pColors[i * 3 + 2] = c.b;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(pColors, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── Connecting lines between crystals ──
    crystalData.forEach((a, i) => {
      if (i < crystalData.length - 1) {
        const b = crystalData[i + 1];
        const geo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(...a.pos),
          new THREE.Vector3(...b.pos),
        ]);
        const mat = new THREE.LineBasicMaterial({
          color: 0x2e7d32,
          transparent: true,
          opacity: 0.2,
        });
        scene.add(new THREE.Line(geo, mat));
      }
    });

    // ── Mouse handler ──
    const onMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Resize handler ──
    const onResize = () => {
      const W2 = canvas.parentElement.offsetWidth;
      const H2 = canvas.parentElement.offsetHeight;
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
      renderer.setSize(W2, H2);
    };
    window.addEventListener("resize", onResize);

    // ── Animation loop ──
    let t = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      t += 0.008;

      // Orb
      orbGroup.rotation.y += 0.005;
      orb.rotation.y = t * 0.3;
      orb.position.y = Math.sin(t) * 0.2;
      rings.forEach((r, i) => {
        r.rotation.z += 0.004 + i * 0.002;
      });

      // Crystals
      crystals.forEach((c) => {
        const { basePos, speed, phase, rotSpeed } = c.userData;
        c.position.y = basePos[1] + Math.sin(t * speed + phase) * 0.4;
        c.rotation.x += rotSpeed;
        c.rotation.y += rotSpeed * 0.7;
        c.userData.light.position.copy(c.position);
      });

      // Particles
      const pos = particles.geometry.attributes.position.array;
      for (let i = 0; i < pCount; i++) {
        pos[i * 3 + 1] += 0.008;
        if (pos[i * 3 + 1] > 10) pos[i * 3 + 1] = -10;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y += 0.0003;

      // Camera parallax
      camera.position.x += (mouseRef.current.x * 2 - camera.position.x) * 0.04;
      camera.position.y +=
        (-mouseRef.current.y * 1.5 + 1 - camera.position.y) * 0.04;
      camera.lookAt(2, 0.5, 0);

      // Pulsing lights
      green.intensity = 2.5 + Math.sin(t * 2) * 0.5;
      orange.intensity = 2 + Math.sin(t * 1.5 + 1) * 0.5;

      renderer.render(scene, camera);
    };
    animate();

    setTimeout(() => setLoaded(true), 400);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  const features = [
    {
      icon: "🌾",
      title: "Farm Direct",
      desc: "Sourced directly from Nigerian farmers",
    },
    {
      icon: "🚚",
      title: "Fast Delivery",
      desc: "Same-day delivery within Lagos",
    },
    {
      icon: "💯",
      title: "Quality Assured",
      desc: "100% fresh, quality checked products",
    },
    {
      icon: "💰",
      title: "Best Prices",
      desc: "Fair prices direct from the source",
    },
  ];

  const stats = [
    { value: "50+", label: "Fresh Products" },
    { value: "10k+", label: "Happy Customers" },
    { value: "100%", label: "Farm Direct" },
    { value: "24/7", label: "Customer Support" },
  ];

  return (
    <div style={{ backgroundColor: COLORS.white }}>
      <nav
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #2E7D32, #4CAF50)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            🌿
          </div>
          <span
            style={{
              fontSize: "18px",
              fontWeight: 800,
              color: "white",
              fontFamily: "Space Grotesk, sans-serif",
            }}
          >
            BemsFarm
          </span>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/login")}
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              backgroundColor: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "14px",
              backdropFilter: "blur(10px)",
            }}
          >
            Sign In
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/register")}
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              backgroundColor: "#F57C00",
              border: "none",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "14px",
              boxShadow: "0 4px 14px rgba(245,124,0,0.4)",
            }}
          >
            Get Started
          </motion.button>
        </div>
      </nav>

      {/* ── 3D Hero Section ── */}
      <section
        style={{
          position: "relative",
          height: "100vh",
          minHeight: "600px",
          backgroundColor: "#0a1628",
          overflow: "hidden",
        }}
      >
        {/* Canvas container */}
        <div style={{ position: "absolute", inset: 0 }}>
          <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
        </div>

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(10,22,40,0.92) 0%, rgba(10,22,40,0.6) 50%, rgba(10,22,40,0.2) 100%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "200px",
            background: "linear-gradient(to top, #ffffff, transparent)",
            pointerEvents: "none",
          }}
        />

        {/* Hero Content */}
        <AnimatePresence>
          {loaded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                padding: "0 5%",
                maxWidth: "1280px",
                margin: "0 auto",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <div style={{ maxWidth: "600px" }}>
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "rgba(46,125,50,0.25)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(76,175,80,0.4)",
                    borderRadius: "50px",
                    padding: "8px 20px",
                    marginBottom: "24px",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "#4CAF50",
                      display: "inline-block",
                      animation: "pulse 2s infinite",
                    }}
                  />
                  <span
                    style={{
                      color: "#4CAF50",
                      fontSize: "13px",
                      fontWeight: 600,
                      letterSpacing: "1px",
                    }}
                  >
                    🌿 NIGERIA'S #1 FARM MARKETPLACE
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 80 }}
                  style={{
                    fontSize: "clamp(28px, 4vw, 56px)",
                    fontWeight: 900,
                    color: "white",
                    lineHeight: 1.15,
                    marginBottom: "20px",
                    fontFamily: "Space Grotesk, sans-serif",
                    maxWidth: "560px",
                  }}
                >
                  Fresh Nigerian
                  <br />
                  <span
                    style={{
                      background:
                        "linear-gradient(135deg, #F57C00, #FF9800, #F57C00)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Foods Delivered
                  </span>
                  <br />
                  <span
                    style={{ color: "rgba(255,255,255,0.9)", fontSize: "75%" }}
                  >
                    Straight to Your Door
                  </span>
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    fontSize: "clamp(14px, 2vw, 17px)",
                    color: "rgba(255,255,255,0.75)",
                    lineHeight: 1.8,
                    marginBottom: "36px",
                    maxWidth: "480px",
                  }}
                >
                  Rice, palm oil, garri, beans, tomatoes and more — sourced
                  directly from Nigerian farms at the best prices. Fresh. Fast.
                  Trusted.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
                >
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 20px 50px rgba(245,124,0,0.5)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/products")}
                    style={{
                      background: "linear-gradient(135deg, #F57C00, #FF9800)",
                      color: "white",
                      border: "none",
                      borderRadius: "16px",
                      padding: "16px 32px",
                      fontSize: "16px",
                      fontWeight: 800,
                      cursor: "pointer",
                      boxShadow: "0 8px 32px rgba(245,124,0,0.4)",
                      letterSpacing: "0.3px",
                    }}
                  >
                    🛍️ Shop Now
                  </motion.button>
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(255,255,255,0.2)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/register")}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.1)",
                      color: "white",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderRadius: "16px",
                      padding: "16px 32px",
                      fontSize: "16px",
                      fontWeight: 700,
                      cursor: "pointer",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    Get Started →
                  </motion.button>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  style={{
                    display: "flex",
                    gap: "32px",
                    marginTop: "48px",
                    flexWrap: "wrap",
                  }}
                >
                  {stats.map((s) => (
                    <div key={s.label}>
                      <p
                        style={{
                          fontSize: "26px",
                          fontWeight: 900,
                          color: "white",
                          lineHeight: 1,
                        }}
                      >
                        {s.value}
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "rgba(255,255,255,0.5)",
                          marginTop: "4px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {s.label}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            position: "absolute",
            bottom: "100px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            opacity: 0.5,
          }}
        >
          <div
            style={{
              width: "1px",
              height: "50px",
              background: "linear-gradient(to bottom, white, transparent)",
            }}
          />
          <p style={{ color: "white", fontSize: "10px", letterSpacing: "3px" }}>
            SCROLL
          </p>
        </motion.div>
      </section>

      {/* ── Features Strip ── */}
      <section style={{ backgroundColor: COLORS.gray, padding: "40px 24px" }}>
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "24px",
          }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                border: "1px solid #E8EAED",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  backgroundColor: "#F1F8F1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  flexShrink: 0,
                }}
              >
                {f.icon}
              </div>
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: "15px",
                    color: "#202124",
                    marginBottom: "4px",
                  }}
                >
                  {f.title}
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#9AA0A6",
                    lineHeight: 1.4,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Category Showcase ── */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "40px",
            }}
          >
            <div>
              <p
                style={{
                  color: "#F57C00",
                  fontWeight: 700,
                  fontSize: "14px",
                  letterSpacing: "2px",
                  marginBottom: "8px",
                }}
              >
                BROWSE BY CATEGORY
              </p>
              <h2
                style={{
                  fontSize: "clamp(24px, 4vw, 40px)",
                  fontWeight: 800,
                  color: "#202124",
                }}
              >
                What are you
                <br />
                looking for?
              </h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/products")}
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                backgroundColor: "#2E7D32",
                color: "white",
                border: "none",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "14px",
                flexShrink: 0,
              }}
            >
              View All →
            </motion.button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "16px",
            }}
          >
            {[
              {
                icon: "🌾",
                name: "Rice & Grains",
                color: "#FFF8E1",
                border: "#F4D03F",
                count: "4 items",
              },
              {
                icon: "🫙",
                name: "Oils & Fats",
                color: "#FBE9E7",
                border: "#F57C00",
                count: "2 items",
              },
              {
                icon: "🫘",
                name: "Legumes",
                color: "#F3E5F5",
                border: "#7B1FA2",
                count: "2 items",
              },
              {
                icon: "🥬",
                name: "Vegetables",
                color: "#E8F5E9",
                border: "#2E7D32",
                count: "2 items",
              },
              {
                icon: "🍠",
                name: "Tubers",
                color: "#FFF3E0",
                border: "#E65100",
                count: "3 items",
              },
              {
                icon: "🌶️",
                name: "Spices",
                color: "#FFEBEE",
                border: "#C62828",
                count: "1 item",
              },
            ].map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{
                  y: -6,
                  boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/products?category=${cat.name}`)}
                style={{
                  backgroundColor: cat.color,
                  borderRadius: "20px",
                  padding: "24px 16px",
                  textAlign: "center",
                  cursor: "pointer",
                  border: `2px solid ${cat.border}20`,
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>
                  {cat.icon}
                </div>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: "14px",
                    color: "#202124",
                    marginBottom: "4px",
                  }}
                >
                  {cat.name}
                </p>
                <p style={{ fontSize: "12px", color: "#9AA0A6" }}>
                  {cat.count}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Flash Sale Banner ── */}
      <section
        style={{
          margin: "0 24px 80px",
          maxWidth: "1280px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          style={{
            borderRadius: "28px",
            overflow: "hidden",
            background:
              "linear-gradient(135deg, #1A1A2E 0%, #2E7D32 50%, #1B5E20 100%)",
            padding: "48px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "24px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "200px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.04)",
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <span
              style={{
                backgroundColor: "#F57C00",
                color: "white",
                fontSize: "12px",
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: "6px",
                letterSpacing: "1px",
                marginBottom: "16px",
                display: "inline-block",
              }}
            >
              🔥 LIMITED OFFER
            </span>
            <h2
              style={{
                fontSize: "clamp(24px, 4vw, 44px)",
                fontWeight: 900,
                color: "white",
                marginBottom: "12px",
                fontFamily: "Space Grotesk, sans-serif",
              }}
            >
              Up to 40% Off
              <br />
              <span style={{ color: "#F57C00" }}>Fresh Farm Products</span>
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                marginBottom: "24px",
                fontSize: "15px",
              }}
            >
              Limited time offer — Order now and save big on your favourite
              Nigerian foods
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/deals")}
              style={{
                backgroundColor: "#F57C00",
                color: "white",
                border: "none",
                borderRadius: "14px",
                padding: "16px 32px",
                fontSize: "16px",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(245,124,0,0.4)",
              }}
            >
              Claim Offer →
            </motion.button>
          </div>
          <div
            style={{
              fontSize: "120px",
              filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))",
              position: "relative",
              zIndex: 1,
            }}
          >
            🧺
          </div>
        </motion.div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ backgroundColor: COLORS.gray, padding: "80px 24px" }}>
        <div
          style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}
        >
          <p
            style={{
              color: "#F57C00",
              fontWeight: 700,
              fontSize: "14px",
              letterSpacing: "2px",
              marginBottom: "8px",
            }}
          >
            HOW IT WORKS
          </p>
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 40px)",
              fontWeight: 800,
              color: "#202124",
              marginBottom: "60px",
            }}
          >
            Fresh food in 3 easy steps
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "32px",
            }}
          >
            {[
              {
                step: "01",
                icon: "🔍",
                title: "Browse Products",
                desc: "Explore our wide range of fresh Nigerian foods",
              },
              {
                step: "02",
                icon: "🛒",
                title: "Add to Cart",
                desc: "Select your items and quantities easily",
              },
              {
                step: "03",
                icon: "💳",
                title: "Checkout",
                desc: "Pay securely with multiple payment options",
              },
              {
                step: "04",
                icon: "🚚",
                title: "Fast Delivery",
                desc: "Receive fresh products at your doorstep",
              },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                style={{ textAlign: "center", padding: "32px 20px" }}
              >
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "20px",
                      backgroundColor: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "32px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      margin: "0 auto",
                    }}
                  >
                    {s.icon}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: "#F57C00",
                      color: "white",
                      fontSize: "10px",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {s.step}
                  </div>
                </div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#202124",
                    marginBottom: "8px",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#9AA0A6",
                    lineHeight: 1.6,
                  }}
                >
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
