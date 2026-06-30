"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface BackgroundCanvasProps {
  isLoaded: boolean;
}

export default function BackgroundCanvas({ isLoaded }: BackgroundCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined" || !canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 8;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0); // Fades in on load
    scene.add(ambientLight);

    const mouseSpotlight = new THREE.SpotLight(0xffffff, 0, 18, Math.PI / 4, 0.5, 1);
    mouseSpotlight.position.set(0, 0, 8);
    scene.add(mouseSpotlight);

    // Volumetric point lights (unified to emerald-cyan and clean white)
    const blueLight = new THREE.PointLight(0x00ffaa, 0.5, 15);
    blueLight.position.set(-5, -3, 2);
    scene.add(blueLight);

    const purpleLight = new THREE.PointLight(0xffffff, 0.5, 15);
    purpleLight.position.set(5, 3, 2);
    scene.add(purpleLight);

    // Special Moment Pulse PointLight
    const flashLight = new THREE.PointLight(0x00ffaa, 0, 20);
    flashLight.position.set(0, 0, 1);
    scene.add(flashLight);

    // --- Core Groups ---
    const heroGroup = new THREE.Group();
    const aboutGroup = new THREE.Group();
    const techUniverseGroup = new THREE.Group();
    const productPanelGroup = new THREE.Group();
    const timelineGroup = new THREE.Group();
    scene.add(heroGroup);
    scene.add(aboutGroup);
    scene.add(techUniverseGroup);
    scene.add(productPanelGroup);
    scene.add(timelineGroup);

    // ==========================================
    // 1. HERO SECTION ASSETS (Sculpture + Rings)
    // ==========================================
    const crystalGeometry = new THREE.IcosahedronGeometry(1.6, 1);
    const crystalPositionAttr = crystalGeometry.attributes.position;
    const crystalCount = crystalPositionAttr.count;
    
    const crystalOriginalPositions: THREE.Vector3[] = [];
    const crystalExplosionVectors: THREE.Vector3[] = [];
    for (let i = 0; i < crystalCount; i++) {
      const pos = new THREE.Vector3(
        crystalPositionAttr.getX(i),
        crystalPositionAttr.getY(i),
        crystalPositionAttr.getZ(i)
      );
      crystalOriginalPositions.push(pos);
      crystalExplosionVectors.push(pos.clone().normalize().multiplyScalar(5 + Math.random() * 5));
    }

    const crystalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.9,
      thickness: 1.5,
      ior: 1.5,
      transparent: true,
      opacity: 0,
      flatShading: true,
      side: THREE.DoubleSide,
    });
    const crystalMesh = new THREE.Mesh(crystalGeometry, crystalMaterial);
    heroGroup.add(crystalMesh);

    // Rings
    const rings: THREE.LineLoop[] = [];
    const ringMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
    });
    for (let i = 0; i < 3; i++) {
      const radius = 2.0 + i * 0.4;
      const geom = new THREE.BufferGeometry();
      const pts = [];
      for (let j = 0; j <= 64; j++) {
        const theta = (j / 64) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
      }
      geom.setFromPoints(pts);
      const line = new THREE.LineLoop(geom, ringMaterial.clone());
      line.rotation.x = Math.random() * Math.PI;
      line.rotation.y = Math.random() * Math.PI;
      heroGroup.add(line);
      rings.push(line);
    }

    // ==========================================
    // 2. NEURAL NETWORK / STARFIELD PARTICLES
    // ==========================================
    const particleCount = 250;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    
    const particleStateHero: THREE.Vector3[] = [];
    const particleStateAbout: THREE.Vector3[] = [];
    const particleStateUniverse: THREE.Vector3[] = [];

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.2;
      const hx = r * Math.sin(phi) * Math.cos(theta);
      const hy = r * Math.sin(phi) * Math.sin(theta);
      const hz = r * Math.cos(phi);
      particleStateHero.push(new THREE.Vector3(hx, hy, hz));
      
      particlePositions[i * 3] = hx;
      particlePositions[i * 3 + 1] = hy;
      particlePositions[i * 3 + 2] = hz;

      const ax = (Math.random() - 0.5) * 16;
      const ay = (Math.random() - 0.5) * 8 - 2;
      const az = (Math.random() - 0.5) * 4 - 1;
      particleStateAbout.push(new THREE.Vector3(ax, ay, az));

      const uAngle = Math.random() * Math.PI * 2;
      const uRadius = 3.5 + Math.random() * 4.5;
      const ux = Math.cos(uAngle) * uRadius;
      const uy = Math.sin(uAngle) * uRadius;
      const uz = (Math.random() - 0.5) * 4 - 1;
      particleStateUniverse.push(new THREE.Vector3(ux, uy, uz));
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0,
      sizeAttenuation: true,
    });
    const mainParticles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(mainParticles);

    // Star connections
    const connectionsMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
    });
    const maxConn = 150;
    const connectionsGeometry = new THREE.BufferGeometry();
    const connectionsPositions = new Float32Array(maxConn * 2 * 3);
    connectionsGeometry.setAttribute("position", new THREE.BufferAttribute(connectionsPositions, 3));
    const connectionsMesh = new THREE.LineSegments(connectionsGeometry, connectionsMaterial);
    scene.add(connectionsMesh);

    // ==========================================
    // 3. ABOUT SECTION BLUEPRINTS & WIREFRAMES
    // ==========================================
    const browserWidth = 3.6;
    const browserHeight = 2.2;
    const browserPts = [
      new THREE.Vector3(-browserWidth/2, -browserHeight/2, 0),
      new THREE.Vector3(browserWidth/2, -browserHeight/2, 0),
      new THREE.Vector3(browserWidth/2, -browserHeight/2, 0),
      new THREE.Vector3(browserWidth/2, browserHeight/2, 0),
      new THREE.Vector3(browserWidth/2, browserHeight/2, 0),
      new THREE.Vector3(-browserWidth/2, browserHeight/2, 0),
      new THREE.Vector3(-browserWidth/2, browserHeight/2, 0),
      new THREE.Vector3(-browserWidth/2, -browserHeight/2, 0),
      new THREE.Vector3(-browserWidth/2, browserHeight/2 - 0.3, 0),
      new THREE.Vector3(browserWidth/2, browserHeight/2 - 0.3, 0),
    ];
    const browserGeom = new THREE.BufferGeometry().setFromPoints(browserPts);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x00ffaa,
      transparent: true,
      opacity: 0,
    });
    const browserMesh = new THREE.LineSegments(browserGeom, wireMat);
    browserMesh.position.set(-2, 0, 0);
    aboutGroup.add(browserMesh);

    // Database
    const dbMesh = new THREE.Group();
    const dbRadius = 0.8;
    const dbHeight = 1.6;
    const dbLayers = 4;
    const dbSegments = 32;
    const dbLineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
    });

    for (let k = 0; k < dbLayers; k++) {
      const y = -dbHeight/2 + (k / (dbLayers - 1)) * dbHeight;
      const ringGeom = new THREE.BufferGeometry();
      const ringPts = [];
      for (let j = 0; j <= dbSegments; j++) {
        const theta = (j / dbSegments) * Math.PI * 2;
        ringPts.push(new THREE.Vector3(Math.cos(theta) * dbRadius, y, Math.sin(theta) * dbRadius));
      }
      ringGeom.setFromPoints(ringPts);
      dbMesh.add(new THREE.Line(ringGeom, dbLineMat.clone()));
    }
    for (let k = 0; k < 4; k++) {
      const theta = (k / 4) * Math.PI * 2;
      const pts = [
        new THREE.Vector3(Math.cos(theta) * dbRadius, -dbHeight/2, Math.sin(theta) * dbRadius),
        new THREE.Vector3(Math.cos(theta) * dbRadius, dbHeight/2, Math.sin(theta) * dbRadius),
      ];
      dbMesh.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), dbLineMat.clone()));
    }
    dbMesh.position.set(3.5, 0.2, -1);
    aboutGroup.add(dbMesh);

    // Floater tokens
    const floatTokenGeom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const tokenMat = new THREE.MeshBasicMaterial({
      color: 0x00ffaa,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    const tokens: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const m = new THREE.Mesh(floatTokenGeom, tokenMat.clone());
      m.position.set(
        -1.5 + Math.random() * 3,
        1.2 + Math.random() * 0.8,
        -0.5 + Math.random() * 1
      );
      aboutGroup.add(m);
      tokens.push(m);
    }

    // ==========================================
    // 4. TECH UNIVERSE Glowing Central Core
    // ==========================================
    const coreGeometry = new THREE.SphereGeometry(0.22, 32, 32);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00ffaa,
      emissive: 0x00ffaa,
      emissiveIntensity: 2.0,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0,
      transmission: 0.6,
      thickness: 0.5,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    
    const coreShellGeom = new THREE.IcosahedronGeometry(0.32, 2);
    const coreShellMat = new THREE.MeshBasicMaterial({
      color: 0x00ffaa,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    const coreShellMesh = new THREE.Mesh(coreShellGeom, coreShellMat);
    techUniverseGroup.add(coreMesh);
    techUniverseGroup.add(coreShellMesh);

    // ==========================================
    // 5. SELECTED WORK: 6 GLASS PRODUCT PANELS
    // ==========================================
    const panelGeom = new THREE.BoxGeometry(1.8, 2.5, 0.08);
    const glassProductMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.95,
      thickness: 1.2,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });

    // Custom internal wireframes inside the glass panel meshes
    const innerWireGeom = new THREE.BoxGeometry(1.6, 2.3, 0.05);
    const innerWireMat = new THREE.MeshBasicMaterial({
      color: 0x00ffaa,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });

    // We space 6 panels orbitally by default
    const panels: THREE.Group[] = [];
    const panelCount = 6;
    for (let i = 0; i < panelCount; i++) {
      const group = new THREE.Group();
      
      // Outer glass screen mesh
      const glassMesh = new THREE.Mesh(panelGeom, glassProductMaterial.clone());
      group.add(glassMesh);

      // Inner architectural components wireframe mesh
      const wireColor = i % 2 === 0 ? 0x00ffaa : 0xffffff;
      const wireMesh = new THREE.Mesh(innerWireGeom, innerWireMat.clone());
      wireMesh.material.color.setHex(wireColor);
      group.add(wireMesh);

      const angle = (i / panelCount) * Math.PI * 2;
      group.position.set(Math.cos(angle) * 3.8, 0.2, Math.sin(angle) * 3.8 - 2.5);
      group.rotation.y = -angle + Math.PI / 2;
      productPanelGroup.add(group);
      panels.push(group);
    }

    // ==========================================
    // 6. CASE STUDIES: 3D BLUEPRINT WORKSPACE & COLLAPSE TIMELINE
    // ==========================================
    const blueprintGrid = new THREE.GridHelper(20, 40, 0x00ffaa, 0x002233);
    blueprintGrid.position.y = -1.8;
    (blueprintGrid.material as THREE.Material).transparent = true;
    (blueprintGrid.material as THREE.Material).opacity = 0;
    scene.add(blueprintGrid);

    // Floating blueprint nodes forming sitemaps
    const bpBoxGeoms = [
      new THREE.BoxGeometry(1.6, 1.1, 0.4),
      new THREE.BoxGeometry(0.9, 0.9, 0.3),
      new THREE.BoxGeometry(1.1, 0.8, 0.3),
      new THREE.BoxGeometry(0.7, 0.7, 0.2),
      new THREE.BoxGeometry(0.6, 0.6, 0.2),
    ];
    const bpBoxMat = new THREE.MeshBasicMaterial({
      color: 0x00ffaa,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    const bpBoxes: THREE.Mesh[] = [];
    const bpBoxGroup = new THREE.Group();
    scene.add(bpBoxGroup);

    bpBoxGeoms.forEach((geom) => {
      const mesh = new THREE.Mesh(geom, bpBoxMat.clone());
      mesh.position.set((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4);
      bpBoxGroup.add(mesh);
      bpBoxes.push(mesh);
    });

    // Connecting wires between sitemap component nodes
    const bpLinesMat = new THREE.LineBasicMaterial({
      color: 0x00ffaa,
      transparent: true,
      opacity: 0,
    });
    const bpLinesGeom = new THREE.BufferGeometry();
    const bpLinesPos = new Float32Array(4 * 2 * 3); // 4 line links
    bpLinesGeom.setAttribute("position", new THREE.BufferAttribute(bpLinesPos, 3));
    const bpLinesMesh = new THREE.LineSegments(bpLinesGeom, bpLinesMat);
    scene.add(bpLinesMesh);

    // Horizontal timeline vector
    const timelineAxisGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-6, 0, 0),
      new THREE.Vector3(6, 0, 0),
    ]);
    const timelineAxisMat = new THREE.LineBasicMaterial({
      color: 0x00ffaa,
      transparent: true,
      opacity: 0,
    });
    const timelineAxis = new THREE.Line(timelineAxisGeom, timelineAxisMat);

    // Timeline tick segments
    const tickGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -0.15, 0),
      new THREE.Vector3(0, 0.15, 0),
    ]);
    const ticks: THREE.Line[] = [];
    for (let i = 0; i < 6; i++) {
      const tick = new THREE.Line(tickGeom, timelineAxisMat.clone());
      tick.position.x = -5 + i * 2;
      ticks.push(tick);
    }

    // Add axis and ticks to timelineGroup
    timelineGroup.add(timelineAxis);
    ticks.forEach(tick => timelineGroup.add(tick));

    // ==========================================
    // 7. EXPERIENCE TIMELINE MILESTONE 3D OBJECTS
    // ==========================================
    // Milestone 1 (Beginning): Raw blueprint wireframe box
    const m1Geom = new THREE.BoxGeometry(0.55, 0.55, 0.55);
    const m1Mesh = new THREE.Mesh(m1Geom, bpBoxMat.clone());
    m1Mesh.position.y = 0.45;
    ticks[0].add(m1Mesh);

    // Milestone 2 (Team Dev): Hexagonal framework ring
    const m2Geom = new THREE.RingGeometry(0.28, 0.42, 6);
    const m2Mesh = new THREE.Mesh(m2Geom, bpBoxMat.clone());
    m2Mesh.position.y = 0.45;
    ticks[1].add(m2Mesh);

    // Milestone 3 (Full Stack): Three cylinder server nodes
    const m3Geom = new THREE.CylinderGeometry(0.18, 0.18, 0.55, 8);
    const m3Mesh = new THREE.Mesh(m3Geom, bpBoxMat.clone());
    m3Mesh.position.y = 0.45;
    ticks[2].add(m3Mesh);

    // Milestone 4 (Creative): Double spinning rings
    const m4Group = new THREE.Group();
    m4Group.position.y = 0.45;
    const m4Geom1 = new THREE.TorusGeometry(0.28, 0.04, 8, 24);
    const m4Mesh1 = new THREE.Mesh(m4Geom1, bpBoxMat.clone());
    m4Group.add(m4Mesh1);
    const m4Mesh2 = new THREE.Mesh(m4Geom1, bpBoxMat.clone());
    m4Mesh2.rotation.x = Math.PI / 2;
    m4Group.add(m4Mesh2);
    ticks[3].add(m4Group);

    // Milestone 5 (Today): Gloss physical crystal with light transmission
    const m5Geom = new THREE.IcosahedronGeometry(0.42, 1);
    const m5Mesh = new THREE.Mesh(m5Geom, glassProductMaterial.clone());
    m5Mesh.position.y = 0.45;
    ticks[4].add(m5Mesh);

    // Endpoint Sphere (What's next)
    const m6Geom = new THREE.SphereGeometry(0.38, 16, 16);
    const m6Mesh = new THREE.Mesh(m6Geom, bpBoxMat.clone());
    m6Mesh.material.color.setHex(0x00ffaa);
    m6Mesh.position.y = 0.45;
    ticks[5].add(m6Mesh);

    // ==========================================
    // 7b. EXPERIENCE: SUBTLE ASCENDING STREAMS
    // ==========================================
    const streamCount = 120;
    const streamGeom = new THREE.BufferGeometry();
    const streamPositions = new Float32Array(streamCount * 3);
    const streamSpeeds: number[] = [];
    const streamLanes: number[] = [];

    for (let i = 0; i < streamCount; i++) {
      const lane = (Math.random() - 0.5) * 14;
      streamLanes.push(lane);
      streamPositions[i * 3] = lane;
      streamPositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      streamPositions[i * 3 + 2] = -6 - Math.random() * 4;
      streamSpeeds.push(0.008 + Math.random() * 0.018);
    }
    streamGeom.setAttribute("position", new THREE.BufferAttribute(streamPositions, 3));
    const streamMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.025,
      transparent: true,
      opacity: 0,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const streamParticles = new THREE.Points(streamGeom, streamMat);
    scene.add(streamParticles);

    // Soft aurora ribbon — thin curved line that breathes during experience
    const auroraPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 48; i++) {
      const t = i / 48;
      auroraPoints.push(new THREE.Vector3((t - 0.5) * 12, Math.sin(t * Math.PI * 2) * 0.6, -5));
    }
    const auroraGeom = new THREE.BufferGeometry().setFromPoints(auroraPoints);
    const auroraMat = new THREE.LineBasicMaterial({
      color: 0x88ffcc,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const auroraLine = new THREE.Line(auroraGeom, auroraMat);
    scene.add(auroraLine);

    // ==========================================
    // 8. AMBIENT BACKGROUND STARS
    // ==========================================
    const bgParticleCount = 2500;
    const bgGeometry = new THREE.BufferGeometry();
    const bgPositions = new Float32Array(bgParticleCount * 3);
    const bgOriginalPositions: THREE.Vector3[] = [];

    for (let i = 0; i < bgParticleCount; i++) {
      const x = (Math.random() - 0.5) * 32;
      const y = (Math.random() - 0.5) * 22;
      const z = (Math.random() - 0.5) * 12 - 4;
      bgPositions[i * 3] = x;
      bgPositions[i * 3 + 1] = y;
      bgPositions[i * 3 + 2] = z;
      bgOriginalPositions.push(new THREE.Vector3(x, y, z));
    }
    bgGeometry.setAttribute("position", new THREE.BufferAttribute(bgPositions, 3));
    const bgMaterial = new THREE.PointsMaterial({
      color: 0x00ffaa,
      size: 0.045,
      transparent: true,
      opacity: 0,
      sizeAttenuation: true,
    });
    const bgPoints = new THREE.Points(bgGeometry, bgMaterial);
    scene.add(bgPoints);

    // ==========================================
    // 9. CREATIVE LAB: FOG PARTICLES + HOLO SCREEN
    // ==========================================
    // Atmospheric lab fog — slow-drifting soft sphere sprites
    const fogCount = 180;
    const fogGeom = new THREE.BufferGeometry();
    const fogPositions = new Float32Array(fogCount * 3);
    const fogOriginals: THREE.Vector3[] = [];
    for (let i = 0; i < fogCount; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 8 - 1;
      fogPositions[i * 3] = x;
      fogPositions[i * 3 + 1] = y;
      fogPositions[i * 3 + 2] = z;
      fogOriginals.push(new THREE.Vector3(x, y, z));
    }
    fogGeom.setAttribute("position", new THREE.BufferAttribute(fogPositions, 3));
    const fogMat = new THREE.PointsMaterial({
      color: 0x00ffaa,
      size: 0.18,
      transparent: true,
      opacity: 0,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const fogParticles = new THREE.Points(fogGeom, fogMat);
    scene.add(fogParticles);

    // Holographic testimonials screen (flat plane with emissive edge glow)
    const holoScreenGeom = new THREE.PlaneGeometry(4.5, 2.8);
    const holoScreenMat = new THREE.MeshPhysicalMaterial({
      color: 0x001a0d,
      emissive: 0x00ffaa,
      emissiveIntensity: 0,
      roughness: 0.4,
      metalness: 0.6,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const holoScreen = new THREE.Mesh(holoScreenGeom, holoScreenMat);
    holoScreen.position.set(0, 0.2, -1.5);
    scene.add(holoScreen);

    // Holo screen edge wireframe
    const holoEdgeGeom = new THREE.EdgesGeometry(holoScreenGeom);
    const holoEdgeMat = new THREE.LineBasicMaterial({
      color: 0x00ffaa,
      transparent: true,
      opacity: 0,
    });
    const holoEdge = new THREE.LineSegments(holoEdgeGeom, holoEdgeMat);
    holoEdge.position.copy(holoScreen.position);
    scene.add(holoEdge);

    // Amber lab spotlight for ending — warms up as other lights dim
    const amberSpot = new THREE.SpotLight(0xffaa44, 0, 14, Math.PI / 5, 0.4, 1.5);
    amberSpot.position.set(0, 4, 4);
    amberSpot.target.position.set(0, 0, -1.5);
    scene.add(amberSpot);
    scene.add(amberSpot.target);

    // ==========================================
    // 10. CONTACT SECTION: SUNRISE LIGHTING
    // ==========================================
    // HemisphereLight: cool mint/emerald ground, clean white sky — simulates clean modern sunrise
    const sunriseHemi = new THREE.HemisphereLight(0xffffff, 0x00ffaa, 0);
    scene.add(sunriseHemi);

    // Two clean white / emerald sunrise volumetric points
    const sunrisePoint1 = new THREE.PointLight(0x00ffaa, 0, 18);
    sunrisePoint1.position.set(-3, -4, 3);
    scene.add(sunrisePoint1);

    const sunrisePoint2 = new THREE.PointLight(0xffffff, 0, 14);
    sunrisePoint2.position.set(3, -5, 2);
    scene.add(sunrisePoint2);

    // --- Interactive Mouse Variables ---
    const mouse = { x: 0, y: 0 };
    const smoothMouse = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      const xPercent = (e.clientX / window.innerWidth) * 100;
      const yPercent = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty("--mouse-x", `${xPercent}%`);
      document.documentElement.style.setProperty("--mouse-y", `${yPercent}%`);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // --- Resize Handler ---
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    // --- Frame Loop ---
    let entranceProgress = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();
      const scrollY = window.scrollY;
      const viewH = window.innerHeight;

      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.05;
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.05;

      // ----------------------------------------------------
      // SCROLL TIMING INDEX MATH FOR 15.6H TOTAL HEIGHT
      // ----------------------------------------------------
      // 1. Hero: 0 to 1.2H
      const heroFactor = Math.min(Math.max(scrollY / (1.2 * viewH), 0), 1);
      const explosionFactor = Math.min(Math.max((scrollY - 0.4 * viewH) / (0.8 * viewH), 0), 1);

      // 2. About: 1.2H to 2.6H (1.4H scroll height)
      const aboutFactor = Math.min(Math.max((scrollY - 1.2 * viewH) / (1.4 * viewH), 0), 1);
      
      // Chapters relative offsets within About section
      const ch1Factor = Math.min(Math.max((scrollY - 1.3 * viewH) / (0.2 * viewH), 0), 1);
      const ch2Factor = Math.min(Math.max((scrollY - 1.5 * viewH) / (0.2 * viewH), 0), 1);
      const ch3Factor = Math.min(Math.max((scrollY - 1.7 * viewH) / (0.2 * viewH), 0), 1);
      const ch4Factor = Math.min(Math.max((scrollY - 1.9 * viewH) / (0.2 * viewH), 0), 1);
      const chTransitionFactor = Math.min(Math.max((scrollY - 2.4 * viewH) / (0.2 * viewH), 0), 1);

      // 3. Tech Universe: 2.6H to 5.6H (3.0H scroll height)
      const universeFactor = Math.min(Math.max((scrollY - 2.6 * viewH) / (3.0 * viewH), 0), 1);
      const pulseFactor = Math.max(0, 1 - Math.abs(scrollY - 4.1 * viewH) / (0.4 * viewH));
      const universeToWorkFactor = Math.min(Math.max((scrollY - 5.1 * viewH) / (0.5 * viewH), 0), 1);

      // 4. Selected Work Gallery: 5.6H to 7.8H (2.2H scroll height)
      const selectedWorkFactor = Math.min(Math.max((scrollY - 5.6 * viewH) / (2.2 * viewH), 0), 1);
      const activeProjectIdx = Math.min(Math.max(Math.floor((scrollY - 5.6 * viewH) / (0.36 * viewH)), 0), 5);
      const productCircleFactor = Math.min(Math.max((scrollY - 7.0 * viewH) / (0.8 * viewH), 0), 1);
      const workEndingFactor = Math.min(Math.max((scrollY - 7.2 * viewH) / (0.6 * viewH), 0), 1);

      // 5. Case Studies: 7.8H to 9.4H (1.6H scroll height)
      const caseStudiesFactor = Math.min(Math.max((scrollY - 7.8 * viewH) / (1.6 * viewH), 0), 1);
      const activeStageIdx = Math.min(Math.max(Math.floor((scrollY - 7.8 * viewH) / (0.22 * viewH)), 0), 5);
      const specialFoundationFactor = Math.min(Math.max((scrollY - 8.8 * viewH) / (0.3 * viewH), 0), 1);
      const timelineTransitionFactor = Math.min(Math.max((scrollY - 9.1 * viewH) / (0.3 * viewH), 0), 1);

      // 6. Experience Timeline: 9.4H to 10.6H (1.2H scroll height)
      const experienceFactor = Math.min(Math.max((scrollY - 9.4 * viewH) / (1.2 * viewH), 0), 1);

      // Retrospective camera rotation (10.3H to 10.6H)
      const retrospectiveFactor = Math.min(Math.max((scrollY - 10.3 * viewH) / (0.3 * viewH), 0), 1);

      // 7. Creative Lab: 10.6H to 12.2H (1.6H scroll height)
      const labFactor = Math.min(Math.max((scrollY - 10.6 * viewH) / (1.6 * viewH), 0), 1);

      // 8. Testimonials: 12.2H to 13.2H (1.0H scroll height)
      const testimonialsFactor = Math.min(Math.max((scrollY - 12.2 * viewH) / (1.0 * viewH), 0), 1);

      // 9. Contact: 13.2H to 14.4H (1.2H scroll height)
      const contactFactor = Math.min(Math.max((scrollY - 13.2 * viewH) / (1.2 * viewH), 0), 1);
      const contactSunriseFactor = Math.min(Math.max((scrollY - 14.0 * viewH) / (0.4 * viewH), 0), 1);

      // ----------------------------------------------------
      // LIGHTING & CAMERA FLY-THROUGHS
      // ----------------------------------------------------
      if (isLoaded && entranceProgress < 1) {
        entranceProgress += 0.015;
      }
      
      // Dynamic intensities
      ambientLight.intensity = (0.15 + pulseFactor * 0.95 + productCircleFactor * 0.45 + caseStudiesFactor * 0.35 + experienceFactor * 0.4) * Math.min(1, entranceProgress);
      mouseSpotlight.intensity = (45 + pulseFactor * 120 - workEndingFactor * 25 - specialFoundationFactor * 35) * Math.min(1, entranceProgress);
      flashLight.intensity = pulseFactor * 12.0 + productCircleFactor * 4.0;

      camera.position.x += (smoothMouse.x * 1.5 - camera.position.x) * 0.05;
      camera.position.y += (smoothMouse.y * 1.2 - camera.position.y) * 0.05;
      
      // Dynamic camera zoom stages
      const zoomZ = 8 
        - ch4Factor * 2.8 
        + universeFactor * 2.5 
        - universeToWorkFactor * 3.5 
        + selectedWorkFactor * 1.5 
        - workEndingFactor * 2.5
        - caseStudiesFactor * 1.5
        + timelineTransitionFactor * 3.0
        - experienceFactor * 1.5;
      
      camera.position.z += (zoomZ - camera.position.z) * 0.08;
      camera.lookAt(0, 0, 0);

      // Spotlight tracking target
      const spotlightVector = new THREE.Vector3(smoothMouse.x * 6, smoothMouse.y * 3.5, 3.5);
      mouseSpotlight.position.copy(spotlightVector);
      mouseSpotlight.target.position.set(smoothMouse.x * 2.5, smoothMouse.y * 1.8, 0);
      mouseSpotlight.target.updateMatrixWorld();

      // Unified lighting color lerps (emerald accent and white)
      const targetLightColor1 = new THREE.Color(0x00ffaa);
      const targetLightColor2 = new THREE.Color(0xffffff);
      blueLight.color.lerp(targetLightColor1, 0.05);
      purpleLight.color.lerp(targetLightColor2, 0.05);

      // Quantum Particle Flow Field (Undulating morphing 3D wave grid)
      bgPoints.rotation.y = time * 0.01 + smoothMouse.x * 0.02;
      bgPoints.rotation.x = Math.sin(time * 0.05) * 0.05 + smoothMouse.y * 0.02;
      
      const bgPos = bgPoints.geometry.attributes.position;
      const scrollFactor = scrollY / (15.6 * viewH); // 0 to 1 normalized scroll

      for (let i = 0; i < bgParticleCount; i++) {
        const px = bgOriginalPositions[i].x;
        const pz = bgOriginalPositions[i].z;
        
        // Fluid undulating wave calculations that scale with scroll
        const wave1 = Math.sin(px * 0.25 + time * 0.45 + scrollFactor * 6.5) * 0.8;
        const wave2 = Math.cos(pz * 0.25 - time * 0.35 + scrollFactor * 5.0) * 0.5;
        const swell = Math.sin(time * 0.15 + (px + pz) * 0.08) * 0.4 * (1 + scrollFactor * 1.5);
        
        const py = bgOriginalPositions[i].y + (wave1 + wave2 + swell) * 1.8;
        
        bgPos.setXYZ(i, px, py, pz);
      }
      bgPos.needsUpdate = true;
      bgMaterial.opacity = 0.24 * Math.min(1, entranceProgress);

      // ----------------------------------------------------
      // HERO MESH ANIMATIONS & EXPLOSION
      // ----------------------------------------------------
      heroGroup.rotation.y = time * 0.04 + smoothMouse.x * 0.2;
      heroGroup.rotation.x = time * 0.02 + smoothMouse.y * 0.15;

      const crystalPos = crystalGeometry.attributes.position;
      for (let i = 0; i < crystalCount; i++) {
        const orig = crystalOriginalPositions[i];
        const exp = crystalExplosionVectors[i];
        const targetX = THREE.MathUtils.lerp(orig.x, exp.x, explosionFactor);
        const targetY = THREE.MathUtils.lerp(orig.y, exp.y, explosionFactor);
        const targetZ = THREE.MathUtils.lerp(orig.z, exp.z, explosionFactor);
        crystalPos.setXYZ(i, targetX, targetY, targetZ);
      }
      crystalPos.needsUpdate = true;
      crystalMaterial.opacity = (1 - explosionFactor) * 0.7 * Math.min(1, entranceProgress);

      rings.forEach((ring, idx) => {
        const scale = 1 + explosionFactor * (2 + idx * 1.5);
        ring.scale.set(scale, scale, scale);
        if (Array.isArray(ring.material)) {
          ring.material.forEach(m => m.opacity = (1 - explosionFactor) * 0.15 * Math.min(1, entranceProgress));
        } else {
          ring.material.opacity = (1 - explosionFactor) * 0.15 * Math.min(1, entranceProgress);
        }
      });

      // ----------------------------------------------------
      // NEURAL PARTICLES MORPHING & TECH ORBIT
      // ----------------------------------------------------
      const particlePosAttr = particleGeometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        const heroState = particleStateHero[i];
        const aboutState = particleStateAbout[i];
        const univState = particleStateUniverse[i];

        const currentTarget = new THREE.Vector3().lerpVectors(heroState, aboutState, explosionFactor);
        
        if (universeFactor > 0) {
          currentTarget.lerpVectors(aboutState, univState, universeFactor);
        }

        if (pulseFactor > 0) {
          const noiseScale = pulseFactor * 1.5;
          currentTarget.x += Math.sin(i * 0.5) * noiseScale;
          currentTarget.y += Math.cos(i * 0.5) * noiseScale;
          currentTarget.z += Math.sin(i * 0.3) * noiseScale;
        }

        particlePosAttr.setXYZ(i, currentTarget.x, currentTarget.y, currentTarget.z);
      }
      particlePosAttr.needsUpdate = true;

      // Particle styling adjustments
      if (universeFactor > 0) {
        mainParticles.rotation.y = time * 0.08;
        particleMaterial.size = (0.07 + Math.sin(time * 4) * 0.015 - universeToWorkFactor * 0.05) * Math.min(1, entranceProgress);
        particleMaterial.opacity = (0.9 - universeToWorkFactor * 0.9) * Math.min(1, entranceProgress);
      } else {
        mainParticles.rotation.y = 0;
        particleMaterial.size = 0.05 * Math.min(1, entranceProgress);
        particleMaterial.opacity = 0.8 * Math.min(1, entranceProgress);
      }

      // Particle segments paths
      let connIdx = 0;
      const connPosAttr = connectionsGeometry.attributes.position;
      const positions = particlePosAttr.array as Float32Array;
      
      const connOpacityScale = Math.max(0, 1 - explosionFactor * 2) 
        + Math.max(0, explosionFactor - universeFactor * 2) * 0.6 
        + Math.max(0, universeFactor - universeToWorkFactor * 2) * 0.15 * (1 - pulseFactor * 1.5);
      
      connectionsMaterial.opacity = connOpacityScale * 0.15 * Math.min(1, entranceProgress);

      if (connOpacityScale > 0) {
        for (let i = 0; i < particleCount && connIdx < maxConn; i++) {
          const ix = positions[i * 3];
          const iy = positions[i * 3 + 1];
          const iz = positions[i * 3 + 2];

          for (let j = i + 1; j < particleCount && connIdx < maxConn; j++) {
            const jx = positions[j * 3];
            const jy = positions[j * 3 + 1];
            const jz = positions[j * 3 + 2];

            const dx = ix - jx;
            const dy = iy - jy;
            const dz = iz - jz;
            const distSq = dx * dx + dy * dy + dz * dz;

            const threshold = THREE.MathUtils.lerp(1.0, 1.8, explosionFactor);
            if (distSq < threshold) {
              connPosAttr.setXYZ(connIdx * 2, ix, iy, iz);
              connPosAttr.setXYZ(connIdx * 2 + 1, jx, jy, jz);
              connIdx++;
            }
          }
        }
      }
      for (let k = connIdx; k < maxConn; k++) {
        connPosAttr.setXYZ(k * 2, 0, 0, 0);
        connPosAttr.setXYZ(k * 2 + 1, 0, 0, 0);
      }
      connPosAttr.needsUpdate = true;

      // ----------------------------------------------------
      // ABOUT BLUEPRINT & WIREFRAME ASSEMBLE
      // ----------------------------------------------------
      aboutGroup.rotation.y = time * 0.03 + smoothMouse.x * 0.15;
      
      const jitterAmount = (ch1Factor - ch2Factor) * 0.18;
      if (jitterAmount > 0) {
        browserMesh.position.x = -2 + (Math.random() - 0.5) * jitterAmount;
        browserMesh.position.y = (Math.random() - 0.5) * jitterAmount;
        dbMesh.position.x = 3.5 + (Math.random() - 0.5) * jitterAmount;
        dbMesh.position.y = 0.2 + (Math.random() - 0.5) * jitterAmount;
      } else {
        browserMesh.position.set(-2, 0, 0);
        dbMesh.position.set(3.5, 0.2, -1);
      }

      const bpOpacity = Math.max(0, ch2Factor - chTransitionFactor * 1.5) * 0.4;
      wireMat.opacity = bpOpacity;
      dbMesh.children.forEach(child => {
        const line = child as THREE.Line;
        if (Array.isArray(line.material)) {
          line.material.forEach(m => m.opacity = bpOpacity);
        } else {
          line.material.opacity = bpOpacity;
        }
      });

      if (ch3Factor > 0 && ch3Factor < 1) {
        browserMesh.scale.set(ch3Factor, ch3Factor, ch3Factor);
      } else if (ch3Factor >= 1) {
        browserMesh.scale.set(1, 1, 1);
      } else {
        browserMesh.scale.set(0.001, 0.001, 0.001);
      }

      tokens.forEach((tk, idx) => {
        tk.position.y += Math.sin(time * 0.5 + idx) * 0.002;
        tk.rotation.x += 0.008;
        tk.rotation.y += 0.005;
        if (Array.isArray(tk.material)) {
          tk.material.forEach(m => m.opacity = bpOpacity * 0.5);
        } else {
          tk.material.opacity = bpOpacity * 0.5;
        }
      });

      // ----------------------------------------------------
      // TECH UNIVERSE CENTRAL CORE SHIFTS
      // ----------------------------------------------------
      techUniverseGroup.rotation.y = -time * 0.05 + smoothMouse.x * 0.2;
      techUniverseGroup.rotation.x = Math.sin(time * 0.2) * 0.1 + smoothMouse.y * 0.15;
      
      coreShellMesh.rotation.y = time * 0.12;
      coreShellMesh.rotation.z = time * 0.08;

      const coreScale = 1.0 + pulseFactor * 1.25 + Math.sin(time * 5) * 0.03;
      coreMesh.scale.set(coreScale, coreScale, coreScale);
      coreShellMesh.scale.set(coreScale, coreScale, coreScale);

      const coreOpacity = Math.max(0, universeFactor - universeToWorkFactor) * 0.85;
      coreMaterial.opacity = coreOpacity;
      coreShellMat.opacity = coreOpacity * 0.25;
      coreMaterial.emissiveIntensity = 2.0 + pulseFactor * 5.0;

      // ----------------------------------------------------
      // SELECTED WORK: 6 GLASS PRODUCT PANELS (LERP LOGIC)
      // ----------------------------------------------------
      productPanelGroup.rotation.y = time * 0.02;

      panels.forEach((p, idx) => {
        const glassMesh = p.children[0] as THREE.Mesh;
        const glassMat = glassMesh.material as THREE.MeshPhysicalMaterial;
        
        const wireMesh = p.children[1] as THREE.Mesh;
        const wireMeshMat = wireMesh.material as THREE.MeshBasicMaterial;

        // Force all Selected Work panels to be completely hidden to prevent text obstruction
        const targetPos = new THREE.Vector3(0, -25, -20);
        const targetRot = new THREE.Vector3(0, 0, 0);
        const targetOpacity = 0.0;
        const targetWireOpacity = 0.0;

        // Apply smooth interpolation (lerping)
        p.position.lerp(targetPos, 0.08);
        
        p.rotation.x = THREE.MathUtils.lerp(p.rotation.x, targetRot.x, 0.08);
        p.rotation.y = THREE.MathUtils.lerp(p.rotation.y, targetRot.y, 0.08);
        p.rotation.z = THREE.MathUtils.lerp(p.rotation.z, targetRot.z, 0.08);
        
        glassMat.opacity = THREE.MathUtils.lerp(glassMat.opacity, targetOpacity, 0.08);
        
        if (workEndingFactor > 0) {
          glassMat.transmission = THREE.MathUtils.lerp(0.95, 1.0, workEndingFactor);
          glassMat.roughness = THREE.MathUtils.lerp(0.1, 0.0, workEndingFactor);
        } else {
          glassMat.transmission = 0.95;
          glassMat.roughness = 0.1;
        }

        wireMeshMat.opacity = THREE.MathUtils.lerp(wireMeshMat.opacity, targetWireOpacity, 0.08);
      });

      // ----------------------------------------------------
      // CASE STUDIES: 3D BLUEPRINT GRIDS & WIREFRAME BOXES
      // ----------------------------------------------------
      blueprintGrid.rotation.y = time * 0.015;
      
      const gridTargetOpacity = Math.max(0, caseStudiesFactor - timelineTransitionFactor) * 0.18;
      (blueprintGrid.material as THREE.Material).opacity = THREE.MathUtils.lerp(
        (blueprintGrid.material as THREE.Material).opacity,
        gridTargetOpacity,
        0.08
      );

      const boxTargets = [
        new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(),
        new THREE.Vector3(), new THREE.Vector3()
      ];

      if (activeStageIdx === 0) {
        boxTargets[0].set(-1.8, 1.2, -0.5);
        boxTargets[1].set(1.5, 0.8, -1.0);
        boxTargets[2].set(-1.2, -1.0, 0.2);
        boxTargets[3].set(2.0, -1.2, 0.5);
        boxTargets[4].set(0.2, 0.1, -1.2);
      } else if (activeStageIdx === 1) {
        boxTargets[0].set(0, 1.2, 0);
        boxTargets[1].set(-1.6, 0.0, 0);
        boxTargets[2].set(1.6, 0.0, 0);
        boxTargets[3].set(-1.6, -1.2, 0);
        boxTargets[4].set(1.6, -1.2, 0);
      } else if (activeStageIdx === 2) {
        boxTargets[0].set(0, 0, 0);
        boxTargets[1].set(-1.1, 0.35, 0.1);
        boxTargets[2].set(0.4, 0.35, 0.1);
        boxTargets[3].set(0.4, -0.45, 0.1);
        boxTargets[4].set(-1.1, -0.55, 0.1);
      } else if (activeStageIdx === 3) {
        boxTargets[0].set(0, 0.4, 0);
        boxTargets[1].set(-1.0, -0.4, 0);
        boxTargets[2].set(1.0, -0.4, 0);
        boxTargets[3].set(-1.8, -1.0, 0);
        boxTargets[4].set(1.8, -1.0, 0);
      } else if (activeStageIdx === 4) {
        boxTargets[0].set(0, 0.2, 0.1);
        boxTargets[1].set(-0.35, -0.2, 0.15);
        boxTargets[2].set(0.35, -0.2, 0.15);
        boxTargets[3].set(-0.7, -0.5, 0.2);
        boxTargets[4].set(0.7, -0.5, 0.2);
      } else {
        boxTargets[0].set(0, 0, 0.5);
        boxTargets[1].set(0, 0, 0.5);
        boxTargets[2].set(0, 0, 0.5);
        boxTargets[3].set(0, 0, 0.5);
        boxTargets[4].set(0, 0, 0.5);
      }

      if (timelineTransitionFactor > 0) {
        bpBoxes.forEach((box, idx) => {
          const tickX = -5 + idx * 2.0;
          boxTargets[idx].set(tickX, 0, 0);
        });
      }

      bpBoxes.forEach((box, idx) => {
        box.position.lerp(boxTargets[idx], 0.08);
        box.rotation.y = time * 0.1 + idx;
        box.rotation.x = time * 0.05 + idx;

        const boxMat = box.material as THREE.MeshBasicMaterial;
        let targetOpacity = 0.0;

        if (caseStudiesFactor > 0 && timelineTransitionFactor < 1) {
          targetOpacity = (1 - specialFoundationFactor * 0.95) * 0.45;
        } else if (timelineTransitionFactor >= 1) {
          targetOpacity = 0.0;
        }

        boxMat.opacity = THREE.MathUtils.lerp(boxMat.opacity, targetOpacity, 0.08);
      });

      // Hide blueprint clutter during experience — text must stay readable
      if (experienceFactor > 0) {
        bpBoxes.forEach((box) => {
          const boxMat = box.material as THREE.MeshBasicMaterial;
          boxMat.opacity = THREE.MathUtils.lerp(boxMat.opacity, 0, 0.12);
        });
        (blueprintGrid.material as THREE.Material).opacity = THREE.MathUtils.lerp(
          (blueprintGrid.material as THREE.Material).opacity,
          0,
          0.12
        );
        (bpLinesMesh.material as THREE.LineBasicMaterial).opacity = THREE.MathUtils.lerp(
          (bpLinesMesh.material as THREE.LineBasicMaterial).opacity,
          0,
          0.12
        );
      }

      const bpLinesPosAttr = bpLinesMesh.geometry.attributes.position;
      const bpLinesPositions = bpLinesPosAttr.array as Float32Array;

      bpLinesPositions[0] = bpBoxes[0].position.x;
      bpLinesPositions[1] = bpBoxes[0].position.y;
      bpLinesPositions[2] = bpBoxes[0].position.z;
      bpLinesPositions[3] = bpBoxes[1].position.x;
      bpLinesPositions[4] = bpBoxes[1].position.y;
      bpLinesPositions[5] = bpBoxes[1].position.z;

      bpLinesPositions[6] = bpBoxes[0].position.x;
      bpLinesPositions[7] = bpBoxes[0].position.y;
      bpLinesPositions[8] = bpBoxes[0].position.z;
      bpLinesPositions[9] = bpBoxes[2].position.x;
      bpLinesPositions[10] = bpBoxes[2].position.y;
      bpLinesPositions[11] = bpBoxes[2].position.z;

      bpLinesPositions[12] = bpBoxes[1].position.x;
      bpLinesPositions[13] = bpBoxes[1].position.y;
      bpLinesPositions[14] = bpBoxes[1].position.z;
      bpLinesPositions[15] = bpBoxes[3].position.x;
      bpLinesPositions[16] = bpBoxes[3].position.y;
      bpLinesPositions[17] = bpBoxes[3].position.z;

      bpLinesPositions[18] = bpBoxes[2].position.x;
      bpLinesPositions[19] = bpBoxes[2].position.y;
      bpLinesPositions[20] = bpBoxes[2].position.z;
      bpLinesPositions[21] = bpBoxes[4].position.x;
      bpLinesPositions[22] = bpBoxes[4].position.y;
      bpLinesPositions[23] = bpBoxes[4].position.z;

      bpLinesPosAttr.needsUpdate = true;

      const bpLinesOpacity = (1 - specialFoundationFactor * 0.95) * 0.18 * (caseStudiesFactor > 0 && timelineTransitionFactor < 1 ? 1 : 0);
      (bpLinesMesh.material as THREE.LineBasicMaterial).opacity = THREE.MathUtils.lerp(
        (bpLinesMesh.material as THREE.LineBasicMaterial).opacity,
        bpLinesOpacity,
        0.08
      );

      // ----------------------------------------------------
      // TIMELINE 3D — kept hidden (HTML timeline handles UX)
      // ----------------------------------------------------
      (timelineAxis.material as THREE.LineBasicMaterial).opacity = THREE.MathUtils.lerp(
        (timelineAxis.material as THREE.LineBasicMaterial).opacity,
        0,
        0.12
      );
      timelineAxis.scale.set(0.01, 1, 1);

      ticks.forEach((tick) => {
        const tickMat = tick.material as THREE.LineBasicMaterial;
        tickMat.opacity = THREE.MathUtils.lerp(tickMat.opacity, 0, 0.12);
        tick.scale.set(1, 0.01, 1);
        tick.children.forEach((child) => {
          const mesh = child as THREE.Mesh;
          if (mesh.material instanceof THREE.Material) {
            mesh.material.transparent = true;
            mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity, 0, 0.12);
          }
        });
      });

      timelineGroup.rotation.y = THREE.MathUtils.lerp(timelineGroup.rotation.y, 0, 0.08);
      timelineGroup.position.z = THREE.MathUtils.lerp(timelineGroup.position.z, 0, 0.08);

      // ----------------------------------------------------
      // EXPERIENCE: soft ascending streams + aurora ribbon
      // ----------------------------------------------------
      if (experienceFactor > 0) {
        const streamPosAttr = streamGeom.attributes.position;
        for (let i = 0; i < streamCount; i++) {
          let y = streamPositions[i * 3 + 1] + streamSpeeds[i] * (1 + experienceFactor);
          if (y > 9) y = -9;
          streamPositions[i * 3 + 1] = y;
          streamPosAttr.setY(i, y);
          // Gentle horizontal sway
          const sway = Math.sin(time * 0.4 + i * 0.7) * 0.015 * experienceFactor;
          streamPosAttr.setX(i, streamLanes[i] + sway);
        }
        streamPosAttr.needsUpdate = true;

        const streamOpacity = Math.min(0.22, experienceFactor * 0.28) * Math.min(1, entranceProgress);
        streamMat.opacity = THREE.MathUtils.lerp(streamMat.opacity, streamOpacity, 0.06);
        streamMat.color.lerp(new THREE.Color(0xaaffee), 0.03);

        // Aurora ribbon breathes and shifts with scroll
        const auroraPosAttr = auroraGeom.attributes.position;
        for (let i = 0; i <= 48; i++) {
          const t = i / 48;
          const wave = Math.sin(t * Math.PI * 3 + time * 0.35) * 0.35 * experienceFactor;
          const y = Math.sin(t * Math.PI * 2) * 0.6 + wave + retrospectiveFactor * 0.4;
          auroraPosAttr.setXYZ(i, (t - 0.5) * 12, y, -5 - experienceFactor * 0.5);
        }
        auroraPosAttr.needsUpdate = true;
        auroraMat.opacity = THREE.MathUtils.lerp(
          auroraMat.opacity,
          Math.min(0.12, experienceFactor * 0.15),
          0.06
        );

        // Pull back camera slightly — keeps depth without blocking text
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, 9.5, 0.04);

        // Dim the mouse spotlight so it doesn't wash over copy
        mouseSpotlight.intensity = THREE.MathUtils.lerp(
          mouseSpotlight.intensity,
          8 * Math.min(1, entranceProgress),
          0.06
        );
      } else {
        streamMat.opacity = THREE.MathUtils.lerp(streamMat.opacity, 0, 0.08);
        auroraMat.opacity = THREE.MathUtils.lerp(auroraMat.opacity, 0, 0.08);
      }

      // ----------------------------------------------------
      // CREATIVE LAB — local section handles atmosphere; keep global 3D hidden
      // ----------------------------------------------------
      if (labFactor > 0) {
        fogMat.opacity = THREE.MathUtils.lerp(fogMat.opacity, 0, 0.12);
        holoScreenMat.opacity = THREE.MathUtils.lerp(holoScreenMat.opacity, 0, 0.12);
        holoEdgeMat.opacity = THREE.MathUtils.lerp(holoEdgeMat.opacity, 0, 0.12);
        amberSpot.intensity = THREE.MathUtils.lerp(amberSpot.intensity, 0, 0.12);

        mouseSpotlight.intensity = THREE.MathUtils.lerp(
          mouseSpotlight.intensity,
          5 * Math.min(1, entranceProgress),
          0.06
        );
      } else {
        fogMat.opacity = THREE.MathUtils.lerp(fogMat.opacity, 0, 0.08);
        holoScreenMat.opacity = THREE.MathUtils.lerp(holoScreenMat.opacity, 0, 0.08);
        holoEdgeMat.opacity = THREE.MathUtils.lerp(holoEdgeMat.opacity, 0, 0.08);
        amberSpot.intensity = THREE.MathUtils.lerp(amberSpot.intensity, 0, 0.08);
      }

      // ----------------------------------------------------
      // CONTACT SECTION: SUNRISE WARMING (28.5H–32H)
      // ----------------------------------------------------
      if (contactFactor > 0) {
        // Sunrise hemisphere light brightens
        sunriseHemi.intensity = THREE.MathUtils.lerp(sunriseHemi.intensity, contactFactor * 1.2, 0.07);
        sunrisePoint1.intensity = THREE.MathUtils.lerp(sunrisePoint1.intensity, contactFactor * 8, 0.07);
        sunrisePoint2.intensity = THREE.MathUtils.lerp(sunrisePoint2.intensity, contactFactor * 6, 0.07);

        // Cool down blue/purple volumetric lights as warmth enters
        blueLight.intensity = THREE.MathUtils.lerp(blueLight.intensity, (1 - contactFactor) * 0.4, 0.06);
        purpleLight.intensity = THREE.MathUtils.lerp(purpleLight.intensity, (1 - contactFactor) * 0.4, 0.06);

        // At sunrise peak, dim all dark-era lights
        if (contactSunriseFactor > 0) {
          ambientLight.intensity = THREE.MathUtils.lerp(ambientLight.intensity, 0.4 + contactSunriseFactor * 0.8, 0.06);
          // Shift ambient toward warm white
          ambientLight.color.lerp(new THREE.Color(0xfff0d0), 0.04);
        }

        // Camera gently pulls back and tilts upward slightly for dawn feel
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, 8.5 + contactSunriseFactor * 2.0, 0.04);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, contactSunriseFactor * -0.5, 0.04);
      } else {
        sunriseHemi.intensity = THREE.MathUtils.lerp(sunriseHemi.intensity, 0, 0.08);
        sunrisePoint1.intensity = THREE.MathUtils.lerp(sunrisePoint1.intensity, 0, 0.08);
        sunrisePoint2.intensity = THREE.MathUtils.lerp(sunrisePoint2.intensity, 0, 0.08);
      }

      // Testimonials: gentle brightening toward warm golds (bridge between lab and contact)
      if (testimonialsFactor > 0) {
        // Gradually warm the ambient toward the holo screen colour
        ambientLight.intensity = THREE.MathUtils.lerp(ambientLight.intensity, 0.15 + testimonialsFactor * 0.1, 0.05);
      }

      // Render Scene
      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      // Dispose resources
      crystalGeometry.dispose();
      crystalMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      connectionsGeometry.dispose();
      connectionsMaterial.dispose();
      browserGeom.dispose();
      wireMat.dispose();
      bgGeometry.dispose();
      bgMaterial.dispose();
      floatTokenGeom.dispose();
      tokenMat.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      coreShellGeom.dispose();
      coreShellMat.dispose();
      panelGeom.dispose();
      glassProductMaterial.dispose();
      innerWireGeom.dispose();
      innerWireMat.dispose();
      blueprintGrid.dispose();
      bpBoxGeoms.forEach(g => g.dispose());
      bpBoxMat.dispose();
      bpLinesGeom.dispose();
      bpLinesMat.dispose();
      timelineAxisGeom.dispose();
      timelineAxisMat.dispose();
      tickGeom.dispose();
      m1Geom.dispose();
      m2Geom.dispose();
      m3Geom.dispose();
      m4Geom1.dispose();
      m5Geom.dispose();
      m6Geom.dispose();
      streamGeom.dispose();
      streamMat.dispose();
      auroraGeom.dispose();
      auroraMat.dispose();
      
      dbMesh.children.forEach(child => {
        const line = child as THREE.Line;
        line.geometry.dispose();
        if (Array.isArray(line.material)) {
          line.material.forEach(m => m.dispose());
        } else {
          line.material.dispose();
        }
      });
      panels.forEach(p => {
        const gMesh = p.children[0] as THREE.Mesh;
        gMesh.geometry.dispose();
        if (Array.isArray(gMesh.material)) {
          gMesh.material.forEach(m => m.dispose());
        } else {
          gMesh.material.dispose();
        }
        const wMesh = p.children[1] as THREE.Mesh;
        wMesh.geometry.dispose();
        if (Array.isArray(wMesh.material)) {
          wMesh.material.forEach(m => m.dispose());
        } else {
          wMesh.material.dispose();
        }
      });
      // Phase 8 Creative Lab disposals
      fogGeom.dispose();
      fogMat.dispose();
      holoScreenGeom.dispose();
      holoScreenMat.dispose();
      holoEdgeGeom.dispose();
      holoEdgeMat.dispose();
      renderer.dispose();
    };
  }, [isLoaded]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-50"
        style={{
          filter: "contrast(1.02) saturate(0.85)",
        }}
      />
    </div>
  );
}
