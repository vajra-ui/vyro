import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useOperationalStore } from '../../stores/operationalStore';
import { SimulatedDisasterType, AIRescuePlanOption } from '../../types/vyro';
import { 
  Waves, 
  Flame, 
  Activity, 
  Wind, 
  Biohazard, 
  Mountain, 
  Droplets,
  Users, 
  Home, 
  Maximize2, 
  ArrowLeft, 
  RotateCcw, 
  ShieldAlert, 
  Navigation, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  AlertTriangle,
  Play,
  Pause,
  Heart
} from 'lucide-react';

interface SimulatedCityTwinProps {
  onBack?: () => void;
  isHeroMode?: boolean;
}

export const SimulatedCityTwin3D: React.FC<SimulatedCityTwinProps> = ({ 
  onBack,
  isHeroMode = false 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Dynamic mesh references for animation
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const tsunamiWaveMeshRef = useRef<THREE.Mesh | null>(null);
  const rainParticlesRef = useRef<THREE.Points | null>(null);
  const smokeParticlesRef = useRef<THREE.Points | null>(null);
  const fireBillboardsRef = useRef<THREE.Group | null>(null);
  const gasCloudRef = useRef<THREE.Mesh | null>(null);
  const debrisGroupRef = useRef<THREE.Group | null>(null);
  const activeRouteLineRef = useRef<THREE.Line | null>(null);
  const routePulseMeshRef = useRef<THREE.Mesh | null>(null);
  const routeCurveRef = useRef<THREE.CatmullRomCurve3 | null>(null);

  // Entities 3D meshes
  const victimBeaconsRef = useRef<{ id: string; mesh: THREE.Group; light: THREE.PointLight; basePos: THREE.Vector3 }[]>([]);
  const rescueUnitsRef = useRef<{ id: string; group: THREE.Group; waypointIndex: number; t: number; waypoints: THREE.Vector3[] }[]>([]);
  const helicopterRef = useRef<THREE.Group | null>(null);
  const heloRotorRef = useRef<THREE.Mesh | null>(null);
  const rescueTruckRef = useRef<THREE.Group | null>(null);
  const ambulanceRef = useRef<THREE.Group | null>(null);
  const primaryVictimLightRef = useRef<THREE.PointLight | null>(null);
  const primaryVictimBeamRef = useRef<THREE.Mesh | null>(null);
  const primaryVictimRingRef = useRef<THREE.Mesh | null>(null);
  const routeLineMatRef = useRef<THREE.LineBasicMaterial | null>(null);
  const familyReunionBeaconRef = useRef<THREE.PointLight | null>(null);
  const animatedHumansRef = useRef<{ leftArm?: THREE.Mesh; rightArm?: THREE.Mesh; isWaving: boolean; offset: number }[]>([]);

  // Store state
  const {
    active3DDisaster,
    setActive3DDisaster,
    activeAiRescuePlan,
    setActiveAiRescuePlan,
    threatAssessmentTab,
    setThreatAssessmentTab,
    threatData,
    aiRescuePlans,
    cases,
    rescueTeams,
    selectEntity,
    selectedEntity,
    simulationRunning,
    toggleSimulation,
    setPrimaryViewMode,
    activeRescueStage,
    activeRescueTracking,
    activeCitizenCaseId,
    openFamilyModal
  } = useOperationalStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [waveCountdown, setWaveCountdown] = useState(5);
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);
  const [cameraFlying, setCameraFlying] = useState(false);

  // Wave timer countdown animation
  useEffect(() => {
    const timer = setInterval(() => {
      setWaveCountdown((prev) => (prev <= 1 ? 5 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Procedural Window Illumination Canvas Texture
  const windowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, 128, 128);

      for (let y = 6; y < 128; y += 14) {
        for (let x = 6; x < 128; x += 14) {
          const rand = Math.random();
          if (rand > 0.45) {
            // Bright warm amber, gold, or cyan office glow
            ctx.fillStyle = rand > 0.85 ? '#38bdf8' : rand > 0.65 ? '#fbbf24' : '#fef08a';
            ctx.fillRect(x, y, 8, 8);
          } else {
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(x, y, 8, 8);
          }
        }
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 8);
    return texture;
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Atmosphere (Lightened fog for maximum clarity)
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x070e1c);
    scene.fog = new THREE.FogExp2(0x070e1c, 0.0016); // Thinned out so all buildings & colors shine

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1400);
    cameraRef.current = camera;
    camera.position.set(130, 95, 140);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.minDistance = 15;
    controls.maxDistance = 400;
    controls.target.set(0, 10, 0);

    // 5. High-Visibility Multi-Source Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2); // Clean, bright ambient light
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2); // Bright primary sun/illumination
    dirLight.position.set(90, 160, 80);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 450;
    dirLight.shadow.camera.left = -180;
    dirLight.shadow.camera.right = 180;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = -180;
    scene.add(dirLight);

    // Fill light from opposite side to remove dark shadows on buildings
    const fillLight = new THREE.DirectionalLight(0x7dd3fc, 1.3);
    fillLight.position.set(-100, 120, -90);
    scene.add(fillLight);

    const skyHemi = new THREE.HemisphereLight(0x93c5fd, 0x1e293b, 1.4);
    scene.add(skyHemi);

    // 6. Ground Plane & Tactical Grid Network
    const groundGeo = new THREE.PlaneGeometry(420, 420, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0a1426,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Tactical Grid
    const gridHelper = new THREE.GridHelper(380, 76, 0x0284c7, 0x1e293b);
    gridHelper.position.y = 0.08;
    scene.add(gridHelper);

    // 7. River / Canal Channel (with clear, vivid water)
    const riverGeo = new THREE.PlaneGeometry(400, 36, 64, 16);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.7,
      transparent: true,
      opacity: 0.88
    });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(0, 0.4, 0);
    scene.add(river);
    waterMeshRef.current = river;

    // Embankments & Wide Waterfront Esplanades
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
    const curbGeo = new THREE.BoxGeometry(400, 1.2, 3);
    const curbNorth = new THREE.Mesh(curbGeo, curbMat);
    curbNorth.position.set(0, 0.6, -18);
    scene.add(curbNorth);

    const curbSouth = new THREE.Mesh(curbGeo, curbMat);
    curbSouth.position.set(0, 0.6, 18);
    scene.add(curbSouth);

    // 8. Wide Arched Bridges Crossing River
    const createBridge = (xPos: number) => {
      const bridgeGroup = new THREE.Group();
      // Main bridge road deck (Wide 18m deck)
      const deckGeo = new THREE.BoxGeometry(18, 2.4, 42);
      const deckMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.4, roughness: 0.5 });
      const deck = new THREE.Mesh(deckGeo, deckMat);
      deck.position.y = 2.4;
      bridgeGroup.add(deck);

      // Glowing Center Yellow Striping
      const stripeGeo = new THREE.PlaneGeometry(1.2, 40);
      const stripeMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.y = 3.65;
      bridgeGroup.add(stripe);

      // Pedestrian Sidewalks on bridge sides
      const walkMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 });
      const walkL = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.4, 40), walkMat);
      walkL.position.set(-7.5, 3.8, 0);
      bridgeGroup.add(walkL);
      const walkR = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.4, 40), walkMat);
      walkR.position.set(7.5, 3.8, 0);
      bridgeGroup.add(walkR);

      // Warning lights
      const lightLeft = new THREE.PointLight(0x38bdf8, 2, 25);
      lightLeft.position.set(-9, 5, 0);
      bridgeGroup.add(lightLeft);
      const lightRight = new THREE.PointLight(0x38bdf8, 2, 25);
      lightRight.position.set(9, 5, 0);
      bridgeGroup.add(lightRight);

      bridgeGroup.position.set(xPos, 0, 0);
      return bridgeGroup;
    };
    scene.add(createBridge(-55));
    scene.add(createBridge(55));

    // 9. Wide Arterial Boulevards (Making Space Free & Legible)
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    // North-South Central Grand Boulevard (28m wide)
    const grandAve = new THREE.Mesh(new THREE.PlaneGeometry(28, 380), roadMat);
    grandAve.rotation.x = -Math.PI / 2;
    grandAve.position.set(0, 0.1, 0);
    scene.add(grandAve);

    // East-West Arterial Avenues (20m wide)
    const northAve = new THREE.Mesh(new THREE.PlaneGeometry(380, 20), roadMat);
    northAve.rotation.x = -Math.PI / 2;
    northAve.position.set(0, 0.1, -75);
    scene.add(northAve);

    const southAve = new THREE.Mesh(new THREE.PlaneGeometry(380, 20), roadMat);
    southAve.rotation.x = -Math.PI / 2;
    southAve.position.set(0, 0.1, 75);
    scene.add(southAve);

    // Open Green Evacuation Parks & Assembly Squares (Giving Breathing Room)
    const parkMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.9 });
    const parkNorth = new THREE.Mesh(new THREE.PlaneGeometry(45, 45), parkMat);
    parkNorth.rotation.x = -Math.PI / 2;
    parkNorth.position.set(65, 0.12, -75);
    scene.add(parkNorth);

    const parkSouth = new THREE.Mesh(new THREE.PlaneGeometry(45, 45), parkMat);
    parkSouth.rotation.x = -Math.PI / 2;
    parkSouth.position.set(-65, 0.12, 75);
    scene.add(parkSouth);

    // 10. Architectural Building Color Palette (Vivid, Recognizable & Distinct)
    const buildingPalette = [
      // 0. Modern Cobalt Sky High-Rise
      new THREE.MeshStandardMaterial({
        color: 0x2563eb,
        map: windowTexture,
        roughness: 0.25,
        metalness: 0.65
      }),
      // 1. Slate Modern Steel
      new THREE.MeshStandardMaterial({
        color: 0x475569,
        map: windowTexture,
        roughness: 0.35,
        metalness: 0.55
      }),
      // 2. High-Tech Cyan Glass Tower
      new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        map: windowTexture,
        roughness: 0.2,
        metalness: 0.75
      }),
      // 3. Warm Ochre Sandstone
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        map: windowTexture,
        roughness: 0.6,
        metalness: 0.15
      }),
      // 4. Vibrant Terracotta Residential
      new THREE.MeshStandardMaterial({
        color: 0xc2410c,
        map: windowTexture,
        roughness: 0.65,
        metalness: 0.15
      }),
      // 5. Clean Contemporary White / Platinum
      new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        map: windowTexture,
        roughness: 0.35,
        metalness: 0.3
      }),
      // 6. Deep Teal Modern Corporate
      new THREE.MeshStandardMaterial({
        color: 0x0f766e,
        map: windowTexture,
        roughness: 0.25,
        metalness: 0.6
      }),
      // 7. Rich Amber Gold Tower
      new THREE.MeshStandardMaterial({
        color: 0xb45309,
        map: windowTexture,
        roughness: 0.45,
        metalness: 0.4
      })
    ];

    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7,
      metalness: 0.4
    });

    // 11. Spacious, Uncongested Building Layout (Generous 25m+ Open Space Between Structures)
    const buildingGroup = new THREE.Group();
    animatedHumansRef.current = [];

    // Distinct Building Plots:
    // Placed with wide street gaps, large plazas, and clear views
    const buildingConfigs = [
      // North Sector (Skyscrapers & Commercial District) - z between -40 and -115
      { x: -110, z: -105, w: 18, d: 18, h: 65, matIdx: 0, name: 'North Tower Alpha' },
      { x: -75,  z: -110, w: 22, d: 20, h: 80, matIdx: 2, name: 'Apex Glass High-Rise' },
      { x: -35,  z: -110, w: 18, d: 18, h: 55, matIdx: 1, name: 'North Steel Plaza' },
      { x: 35,   z: -110, w: 20, d: 18, h: 72, matIdx: 6, name: 'Teal Meridian Tower' },
      { x: 105,  z: -105, w: 22, d: 20, h: 60, matIdx: 3, name: 'Ochre Financial Center' },
      
      // North Mid-Row (Spaced out, along North Avenue)
      { x: -110, z: -55,  w: 18, d: 16, h: 48, matIdx: 4, name: 'North Terrace' },
      { x: -15,  z: -42,  w: 24, d: 22, h: 42, matIdx: 5, name: 'Command Complex Rooftop (Victim)' }, // PRIMARY ROOFTOP VICTIM
      { x: 35,   z: -50,  w: 18, d: 18, h: 58, matIdx: 0, name: 'Harbor Tower' },
      { x: 105,  z: -55,  w: 20, d: 18, h: 52, matIdx: 7, name: 'Amber Center' },

      // South Sector (Residential & Civic Quarter) - z between 40 and 115
      { x: -110, z: 55,   w: 20, d: 18, h: 45, matIdx: 3, name: 'West Residential A' },
      { x: -15,  z: 50,   w: 18, d: 16, h: 40, matIdx: 4, name: 'Riverside Suites' },
      { x: 35,   z: 50,   w: 22, d: 20, h: 55, matIdx: 1, name: 'Metro Civic Tower' },
      { x: 110,  z: 55,   w: 20, d: 18, h: 46, matIdx: 0, name: 'East Skyline Suites' },

      // South Far-Row (Spaced out, along South Avenue)
      { x: -110, z: 105,  w: 18, d: 18, h: 50, matIdx: 6, name: 'South Marina' },
      { x: -35,  z: 110,  w: 20, d: 18, h: 62, matIdx: 2, name: 'Oceanic Glass Tower' },
      { x: 35,   z: 110,  w: 18, d: 18, h: 54, matIdx: 5, name: 'Pearl White Tower' },
      { x: 110,  z: 105,  w: 22, d: 20, h: 68, matIdx: 7, name: 'Sunrise Tower' }
    ];

    buildingConfigs.forEach((cfg, idx) => {
      const mat = buildingPalette[cfg.matIdx % buildingPalette.length];
      const bldgGeo = new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d);
      const bldg = new THREE.Mesh(bldgGeo, mat);
      bldg.position.set(cfg.x, cfg.h / 2, cfg.z);
      bldg.castShadow = true;
      bldg.receiveShadow = true;
      bldg.name = cfg.name;
      buildingGroup.add(bldg);

      // Distinct Rooftop Slab with Rim
      const roofGeo = new THREE.BoxGeometry(cfg.w * 0.95, 1.4, cfg.d * 0.95);
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.set(cfg.x, cfg.h + 0.7, cfg.z);
      buildingGroup.add(roof);

      // Helipads on selected tall towers
      if (cfg.h > 55) {
        const helipad = new THREE.Mesh(
          new THREE.RingGeometry(cfg.w * 0.2, cfg.w * 0.35, 24),
          new THREE.MeshBasicMaterial({ color: 0xfbbf24, side: THREE.DoubleSide })
        );
        helipad.rotation.x = -Math.PI / 2;
        helipad.position.set(cfg.x, cfg.h + 1.45, cfg.z);
        buildingGroup.add(helipad);
      }

      // Rooftop Antennas / Warning Lights
      if (cfg.h >= 60 || idx === 1) {
        const antGeo = new THREE.CylinderGeometry(0.25, 0.45, 10, 8);
        const antMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const ant = new THREE.Mesh(antGeo, antMat);
        ant.position.set(cfg.x, cfg.h + 5.7, cfg.z);
        buildingGroup.add(ant);

        const beaconLight = new THREE.PointLight(0x0284c7, 1.5, 35);
        beaconLight.position.set(cfg.x, cfg.h + 10.8, cfg.z);
        buildingGroup.add(beaconLight);
      }
    });
    scene.add(buildingGroup);

    // 12. HELPER FUNCTION: High-Visibility Stylized 3D Human Characters
    const createHumanFigure = (jacketColor: number, pantsColor = 0x1e293b, scale = 1.0, isWaving = false, isSitting = false) => {
      const g = new THREE.Group();
      // Head
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.35 * scale, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.5 })
      );
      head.position.y = (isSitting ? 1.1 : 1.6) * scale;
      g.add(head);

      // Torso / Jacket
      const torso = new THREE.Mesh(
        new THREE.BoxGeometry(0.6 * scale, 0.8 * scale, 0.35 * scale),
        new THREE.MeshStandardMaterial({ color: jacketColor, roughness: 0.4 })
      );
      torso.position.y = (isSitting ? 0.6 : 1.0) * scale;
      g.add(torso);

      // Legs
      const legMat = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.7 });
      if (isSitting) {
        // Sitting forward bent legs
        const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.2 * scale, 0.2 * scale, 0.6 * scale), legMat);
        leftLeg.position.set(-0.16 * scale, 0.2 * scale, 0.25 * scale);
        g.add(leftLeg);
        const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.2 * scale, 0.2 * scale, 0.6 * scale), legMat);
        rightLeg.position.set(0.16 * scale, 0.2 * scale, 0.25 * scale);
        g.add(rightLeg);
      } else {
        const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.2 * scale, 0.7 * scale, 0.22 * scale), legMat);
        leftLeg.position.set(-0.16 * scale, 0.35 * scale, 0);
        g.add(leftLeg);
        const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.2 * scale, 0.7 * scale, 0.22 * scale), legMat);
        rightLeg.position.set(0.16 * scale, 0.35 * scale, 0);
        g.add(rightLeg);
      }

      // Arms (with animated arm tracking)
      const armMat = new THREE.MeshStandardMaterial({ color: jacketColor, roughness: 0.4 });
      const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.16 * scale, 0.65 * scale, 0.16 * scale), armMat);
      const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.16 * scale, 0.65 * scale, 0.16 * scale), armMat);

      if (isWaving) {
        leftArm.position.set(-0.4 * scale, 1.4 * scale, 0);
        leftArm.rotation.z = Math.PI * 0.75;
        rightArm.position.set(0.4 * scale, 1.4 * scale, 0);
        rightArm.rotation.z = -Math.PI * 0.75;
      } else {
        leftArm.position.set(-0.38 * scale, (isSitting ? 0.6 : 0.95) * scale, 0);
        rightArm.position.set(0.38 * scale, (isSitting ? 0.6 : 0.95) * scale, 0);
      }
      g.add(leftArm);
      g.add(rightArm);

      animatedHumansRef.current.push({
        leftArm,
        rightArm,
        isWaving,
        offset: Math.random() * Math.PI * 2
      });

      return g;
    };

    // 13. KEY OPERATIONAL FACILITIES (Spacious & Visible)

    // A. GOVERNMENT GENERAL HOSPITAL (Clean White & Medical Cross)
    const hospGroup = new THREE.Group();
    const hospBldg = new THREE.Mesh(
      new THREE.BoxGeometry(32, 22, 30),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.2 })
    );
    hospBldg.position.y = 11;
    hospGroup.add(hospBldg);

    // Illuminated Medical Red/Green Cross
    const crossMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 0.5), crossMat);
    crossV.position.set(0, 16, 15.3);
    hospGroup.add(crossV);
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(8, 2, 0.5), crossMat);
    crossH.position.set(0, 16, 15.3);
    hospGroup.add(crossH);

    // Hospital Beacon Light
    const hospBeacon = new THREE.PointLight(0x10b981, 3, 50);
    hospBeacon.position.set(0, 26, 0);
    hospGroup.add(hospBeacon);

    // Ambulance Canopy & Helipad
    const bayRoof = new THREE.Mesh(
      new THREE.BoxGeometry(20, 1.2, 14),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 })
    );
    bayRoof.position.set(0, 5, 20);
    hospGroup.add(bayRoof);

    // Hospital Medical Humans (7 Staff & Stretcher Team)
    const docLead = createHumanFigure(0xf8fafc, 0x0284c7, 1.1, false); // Doctor in white
    docLead.position.set(-4, 0, 20);
    hospGroup.add(docLead);

    const medic1 = createHumanFigure(0x0284c7, 0x1e293b, 1.1, false); // Paramedic
    medic1.position.set(4, 0, 20);
    hospGroup.add(medic1);

    const medic2 = createHumanFigure(0x0284c7, 0x1e293b, 1.1, false);
    medic2.position.set(8, 0, 18);
    hospGroup.add(medic2);

    // Stretcher Team carrying patient
    const stretcherCarrier1 = createHumanFigure(0x38bdf8, 0x1e293b, 1.0, false);
    stretcherCarrier1.position.set(-8, 0, 21);
    hospGroup.add(stretcherCarrier1);

    const stretcherCarrier2 = createHumanFigure(0x38bdf8, 0x1e293b, 1.0, false);
    stretcherCarrier2.position.set(-8, 0, 25);
    hospGroup.add(stretcherCarrier2);

    // Stretcher bed
    const stretcher = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.3, 3.2),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8 })
    );
    stretcher.position.set(-8, 0.8, 23);
    hospGroup.add(stretcher);

    hospGroup.position.set(-75, 0, -55);
    scene.add(hospGroup);

    // B. VYRO SAFE SHELTER 01 (Vivid Foliage Green Complex)
    const shelterGroup = new THREE.Group();
    const shelterBldg = new THREE.Mesh(
      new THREE.BoxGeometry(36, 16, 28),
      new THREE.MeshStandardMaterial({ color: 0x15803d, metalness: 0.2, roughness: 0.5 })
    );
    shelterBldg.position.y = 8;
    shelterGroup.add(shelterBldg);

    // Green Glowing Perimeter Fence Ring
    const shelterRing = new THREE.Mesh(
      new THREE.RingGeometry(26, 28, 32),
      new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    shelterRing.rotation.x = -Math.PI / 2;
    shelterRing.position.y = 0.2;
    shelterGroup.add(shelterRing);

    // Green Shelter Beacon
    const shelterBeacon = new THREE.PointLight(0x10b981, 3.5, 60);
    shelterBeacon.position.set(0, 20, 0);
    shelterGroup.add(shelterBeacon);

    // Relief Tents around shelter
    const createTent = (xPos: number, zPos: number) => {
      const coneGeo = new THREE.ConeGeometry(3.5, 3.2, 4);
      const coneMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
      const tent = new THREE.Mesh(coneGeo, coneMat);
      tent.rotation.y = Math.PI / 4;
      tent.position.set(xPos, 1.6, zPos);
      return tent;
    };
    shelterGroup.add(createTent(-18, 18));
    shelterGroup.add(createTent(18, 18));

    // Shelter Volunteers & Evacuee Humans (8 Humans)
    const shelterCoord = createHumanFigure(0x10b981, 0x1e293b, 1.1, false);
    shelterCoord.position.set(0, 0, 18);
    shelterGroup.add(shelterCoord);

    const shelterMed = createHumanFigure(0x38bdf8, 0x1e293b, 1.0, false);
    shelterMed.position.set(-4, 0, 18);
    shelterGroup.add(shelterMed);

    // Evacuees sitting and resting
    const evac1 = createHumanFigure(0xfbbf24, 0x334155, 1.0, false, true);
    evac1.position.set(-16, 0, 18);
    shelterGroup.add(evac1);

    const evac2 = createHumanFigure(0xf43f5e, 0x334155, 1.0, false, true);
    evac2.position.set(-14, 0, 18);
    shelterGroup.add(evac2);

    const evac3 = createHumanFigure(0x60a5fa, 0x1e293b, 1.0, false);
    evac3.position.set(14, 0, 18);
    shelterGroup.add(evac3);

    const evacChild = createHumanFigure(0xfde047, 0x1e293b, 0.7, true);
    evacChild.position.set(16, 0, 18);
    shelterGroup.add(evacChild);

    shelterGroup.position.set(75, 0, 55);
    scene.add(shelterGroup);

    // C. FAMILY REUNIFICATION CENTER RC-02 (Royal Purple with Pulsing Emerald Ready Beacon)
    const familyGroup = new THREE.Group();
    const familyPavilion = new THREE.Mesh(
      new THREE.BoxGeometry(26, 12, 26),
      new THREE.MeshStandardMaterial({ color: 0x7e22ce, roughness: 0.35, metalness: 0.4 })
    );
    familyPavilion.position.y = 6;
    familyGroup.add(familyPavilion);

    // Glowing Canopy Roof
    const canopyRoof = new THREE.Mesh(
      new THREE.BoxGeometry(30, 1.2, 30),
      new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.3 })
    );
    canopyRoof.position.y = 12.6;
    familyGroup.add(canopyRoof);

    // Verification Desk Station
    const deskGeo = new THREE.BoxGeometry(8, 1.2, 2);
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.set(0, 0.6, 17);
    familyGroup.add(desk);

    // Pulsing Emerald Green Ready Beacon (Signifies Match Found & Ready for Safe Handoff)
    const famBeacon = new THREE.PointLight(0x10b981, 4.0, 55);
    famBeacon.position.set(0, 18, 0);
    familyGroup.add(famBeacon);
    familyReunionBeaconRef.current = famBeacon;

    // Glowing Tactical Ground Boundary
    const famRing = new THREE.Mesh(
      new THREE.RingGeometry(20, 22, 32),
      new THREE.MeshBasicMaterial({ color: 0xa855f7, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    famRing.rotation.x = -Math.PI / 2;
    famRing.position.y = 0.2;
    familyGroup.add(famRing);

    // Family Center Humans (8 Humans: Officers, Guardians, Reunited Children)
    // Intake & Verification Officers
    const intakeOfficer = createHumanFigure(0x2563eb, 0x0f172a, 1.1, false);
    intakeOfficer.position.set(-2, 0, 18);
    familyGroup.add(intakeOfficer);

    const verifyOfficer = createHumanFigure(0x475569, 0x0f172a, 1.1, false);
    verifyOfficer.position.set(2, 0, 18);
    familyGroup.add(verifyOfficer);

    // Security guard safeguarding entrance
    const secGuard = createHumanFigure(0x0f172a, 0x0f172a, 1.15, false);
    secGuard.position.set(-8, 0, 17);
    familyGroup.add(secGuard);

    // Reunited Family: Father, Mother, Joyfully Waving Child
    const famFather = createHumanFigure(0xa855f7, 0x1e293b, 1.1, false);
    famFather.position.set(5, 0, 15);
    familyGroup.add(famFather);

    const famMother = createHumanFigure(0xf472b6, 0x1e293b, 1.0, false);
    famMother.position.set(8, 0, 15);
    familyGroup.add(famMother);

    const famChild = createHumanFigure(0xfde047, 0x1e293b, 0.72, true); // Child waving in joy
    famChild.position.set(6.5, 0, 16);
    familyGroup.add(famChild);

    // Waiting Family Relative in Queue
    const waitingFam = createHumanFigure(0x10b981, 0x334155, 1.05, false, true);
    waitingFam.position.set(-6, 0, 14);
    familyGroup.add(waitingFam);

    familyGroup.position.set(-60, 0, 55);
    scene.add(familyGroup);

    // D. VYRO COMMAND CENTER HEADQUARTERS (Graphite Tech with Cyan Radar Mast)
    const cmdGroup = new THREE.Group();
    const cmdBldg = new THREE.Mesh(
      new THREE.BoxGeometry(26, 30, 26),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.3 })
    );
    cmdBldg.position.y = 15;
    cmdGroup.add(cmdBldg);

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.7, 14, 8), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    mast.position.y = 37;
    cmdGroup.add(mast);
    const cmdLight = new THREE.PointLight(0x38bdf8, 3.5, 55);
    cmdLight.position.y = 44;
    cmdGroup.add(cmdLight);

    cmdGroup.position.set(55, 0, -55);
    scene.add(cmdGroup);

    // 14. CRITICAL VICTIM BEACON & ROOFTOP SURVIVORS
    const victimGroup = new THREE.Group();
    const victimPos = new THREE.Vector3(-15, 42, -42); // Aligned precisely with rooftop

    // Vertical locator light beam (180m high beam)
    const beamGeo = new THREE.CylinderGeometry(0.5, 0.5, 180, 16);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.copy(victimPos);
    beam.position.y += 90;
    victimGroup.add(beam);
    primaryVictimBeamRef.current = beam;

    // Pulsing circular ground glow ring
    const ringGeo = new THREE.RingGeometry(3, 5, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(victimPos);
    ring.position.y += 0.8;
    victimGroup.add(ring);
    primaryVictimRingRef.current = ring;

    // Glowing point light
    const victimLight = new THREE.PointLight(0xef4444, 4, 45);
    victimLight.position.copy(victimPos);
    victimLight.position.y += 3;
    victimGroup.add(victimLight);
    primaryVictimLightRef.current = victimLight;

    // 3 Recognizable Stylized Human Victims Waving on Rooftop
    const victimHuman1 = createHumanFigure(0xf97316, 0x1e293b, 1.2, true);
    victimHuman1.position.set(victimPos.x - 2, victimPos.y + 0.7, victimPos.z);
    victimGroup.add(victimHuman1);

    const victimHuman2 = createHumanFigure(0xef4444, 0x1e293b, 1.15, true);
    victimHuman2.position.set(victimPos.x + 2, victimPos.y + 0.7, victimPos.z);
    victimGroup.add(victimHuman2);

    const victimChild = createHumanFigure(0xfbbf24, 0x1e293b, 0.78, true);
    victimChild.position.set(victimPos.x, victimPos.y + 0.7, victimPos.z + 1.8);
    victimGroup.add(victimChild);

    scene.add(victimGroup);
    victimBeaconsRef.current.push({
      id: 'VY-26-1042',
      mesh: victimGroup,
      light: victimLight,
      basePos: victimPos
    });

    // 15. FIRST RESPONDERS & EVACUEES ON BOULEVARDS & BRIDGES (14 Additional Visible Humans)
    // Search & Rescue Team along River Canal
    const sarOfficer1 = createHumanFigure(0xf97316, 0x0f172a, 1.1, false);
    sarOfficer1.position.set(-25, 0.8, -12);
    scene.add(sarOfficer1);

    const sarOfficer2 = createHumanFigure(0xf97316, 0x0f172a, 1.1, false);
    sarOfficer2.position.set(-21, 0.8, -12);
    scene.add(sarOfficer2);

    // Police Cordon Officers at Bridge Entrance
    const police1 = createHumanFigure(0x1e3a8a, 0x0f172a, 1.1, false);
    police1.position.set(-50, 2.6, -18);
    scene.add(police1);

    const police2 = createHumanFigure(0x1e3a8a, 0x0f172a, 1.1, false);
    police2.position.set(50, 2.6, 18);
    scene.add(police2);

    // Evacuees walking across Bridge Deck towards Shelter
    const bridgeWalker1 = createHumanFigure(0x0284c7, 0x334155, 1.05, false);
    bridgeWalker1.position.set(-52, 3.8, 4);
    scene.add(bridgeWalker1);

    const bridgeWalker2 = createHumanFigure(0xf43f5e, 0x334155, 1.0, false);
    bridgeWalker2.position.set(-52, 3.8, -4);
    scene.add(bridgeWalker2);

    // Pedestrians on Central Grand Avenue
    const ped1 = createHumanFigure(0x10b981, 0x1e293b, 1.05, false);
    ped1.position.set(5, 0.2, 20);
    scene.add(ped1);

    const ped2 = createHumanFigure(0xfbbf24, 0x1e293b, 1.0, false);
    ped2.position.set(-5, 0.2, -20);
    scene.add(ped2);

    // 16. MOVING RESCUE VEHICLES
    // A. Rescue Truck R-07
    const truckGroup = new THREE.Group();
    const truckBody = new THREE.Mesh(
      new THREE.BoxGeometry(6, 2.4, 9.5),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.3 })
    );
    truckBody.position.y = 1.8;
    truckGroup.add(truckBody);
    const truckCab = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 2.0, 3.8),
      new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.2 })
    );
    truckCab.position.set(0, 3.4, 2);
    truckGroup.add(truckCab);
    const truckLight = new THREE.PointLight(0x38bdf8, 2.5, 25);
    truckLight.position.set(0, 4.8, 0);
    truckGroup.add(truckLight);

    truckGroup.position.set(-25, 2.2, 0);
    scene.add(truckGroup);
    rescueTruckRef.current = truckGroup;

    // B. Zodiac Raft Z-02 in river channel (with 2 crew figures)
    const boatGroup = new THREE.Group();
    const boatHull = new THREE.Mesh(
      new THREE.BoxGeometry(4.5, 1.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.6, roughness: 0.3 })
    );
    boatHull.position.y = 0.9;
    boatGroup.add(boatHull);

    // Raft Crew
    const boatCrew1 = createHumanFigure(0xf97316, 0x1e293b, 0.95, false, true);
    boatCrew1.position.set(0, 0.7, 1.2);
    boatGroup.add(boatCrew1);
    const boatCrew2 = createHumanFigure(0xf97316, 0x1e293b, 0.95, false, true);
    boatCrew2.position.set(0, 0.7, -1.2);
    boatGroup.add(boatCrew2);

    const boatLight = new THREE.PointLight(0x38bdf8, 3, 30);
    boatLight.position.set(0, 2.8, 0);
    boatGroup.add(boatLight);
    boatGroup.position.set(35, 1.2, 2);
    scene.add(boatGroup);

    // C. ALS Ambulance AMB-04
    const ambGroup = new THREE.Group();
    const ambBody = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 2.6, 8.5),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.4, roughness: 0.3 })
    );
    ambBody.position.y = 2.0;
    ambGroup.add(ambBody);
    const ambLightbar = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 0.45, 0.9),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    ambLightbar.position.set(0, 3.5, 1);
    ambGroup.add(ambLightbar);
    const ambLight = new THREE.PointLight(0xef4444, 2.5, 25);
    ambLight.position.set(0, 3.8, 1);
    ambGroup.add(ambLight);

    ambGroup.position.set(-65, 2.0, -35);
    scene.add(ambGroup);
    ambulanceRef.current = ambGroup;

    // D. Coast Guard Helo AIR-01
    const heloGroup = new THREE.Group();
    const heloBody = new THREE.Mesh(new THREE.BoxGeometry(3.8, 3.0, 9.5), new THREE.MeshStandardMaterial({ color: 0xe0f2fe, metalness: 0.7 }));
    heloGroup.add(heloBody);
    const rotor = new THREE.Mesh(new THREE.BoxGeometry(18, 0.15, 1.4), new THREE.MeshBasicMaterial({ color: 0x0369a1 }));
    rotor.position.y = 2.1;
    heloGroup.add(rotor);
    heloRotorRef.current = rotor;
    const heloLight = new THREE.PointLight(0x38bdf8, 3.5, 45);
    heloLight.position.set(0, -1, 0);
    heloGroup.add(heloLight);
    heloGroup.position.set(65, 75, -45);
    scene.add(heloGroup);
    helicopterRef.current = heloGroup;

    // 17. Continuous 3D Rescue Chain Route (VICTIM -> VEHICLE -> HOSPITAL -> SHELTER -> FAMILY REUNION)
    const routeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-15, 42, -42),  // Victim Rooftop
      new THREE.Vector3(-15, 2.5, -12),  // Extraction Point at Old Bridge
      new THREE.Vector3(0, 2.2, 0),      // Vehicle Transit Grand Avenue
      new THREE.Vector3(-75, 2.5, -55),  // Hospital Bay
      new THREE.Vector3(75, 2.5, 55),    // Shelter Perimeter
      new THREE.Vector3(-60, 2.5, 55)    // Family Reunification Center RC-02
    ]);
    routeCurveRef.current = routeCurve;

    const routePoints = routeCurve.getPoints(120);
    const routeGeo = new THREE.BufferGeometry().setFromPoints(routePoints);
    const routeMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 3,
      transparent: true,
      opacity: 0.95
    });
    const routeLine = new THREE.Line(routeGeo, routeMat);
    scene.add(routeLine);
    activeRouteLineRef.current = routeLine;
    routeLineMatRef.current = routeMat;

    // Glowing traveling energy pulse
    const pulseGeo = new THREE.SphereGeometry(2.0, 16, 16);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
    scene.add(pulseMesh);
    routePulseMeshRef.current = pulseMesh;

    // 18. Disaster Atmospheric Effects
    // Tsunami Wave
    const waveGeo = new THREE.BoxGeometry(380, 18, 32, 48, 8, 8);
    const waveMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.6,
      transparent: true,
      opacity: 0.82
    });
    const tsunamiWave = new THREE.Mesh(waveGeo, waveMat);
    tsunamiWave.position.set(0, 8, -75);
    scene.add(tsunamiWave);
    tsunamiWaveMeshRef.current = tsunamiWave;

    // Rain Particles (Cyclone)
    const rainCount = 1400;
    const rainGeo = new THREE.BufferGeometry();
    const rainPos = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      rainPos[i * 3] = (Math.random() - 0.5) * 360;
      rainPos[i * 3 + 1] = Math.random() * 120;
      rainPos[i * 3 + 2] = (Math.random() - 0.5) * 360;
    }
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
    const rainMat = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.65,
      transparent: true,
      opacity: 0.65
    });
    const rainSystem = new THREE.Points(rainGeo, rainMat);
    scene.add(rainSystem);
    rainParticlesRef.current = rainSystem;

    // Wildfire Smoke & Billboards
    const smokeCount = 350;
    const smokeGeo = new THREE.BufferGeometry();
    const smokePos = new Float32Array(smokeCount * 3);
    for (let i = 0; i < smokeCount; i++) {
      smokePos[i * 3] = 40 + (Math.random() - 0.5) * 45;
      smokePos[i * 3 + 1] = 10 + Math.random() * 55;
      smokePos[i * 3 + 2] = -50 + (Math.random() - 0.5) * 45;
    }
    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePos, 3));
    const smokeMat = new THREE.PointsMaterial({
      color: 0x334155,
      size: 4.5,
      transparent: true,
      opacity: 0.45
    });
    const smokeSystem = new THREE.Points(smokeGeo, smokeMat);
    scene.add(smokeSystem);
    smokeParticlesRef.current = smokeSystem;

    const fireGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
      const fireGeo = new THREE.SphereGeometry(3 + Math.random() * 3, 12, 12);
      const fireMat = new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.85 });
      const fireSphere = new THREE.Mesh(fireGeo, fireMat);
      fireSphere.position.set(40 + (Math.random() - 0.5) * 35, 12 + Math.random() * 15, -50 + (Math.random() - 0.5) * 35);
      fireGroup.add(fireSphere);
    }
    scene.add(fireGroup);
    fireBillboardsRef.current = fireGroup;

    // Chemical Vapor Cloud
    const gasGeo = new THREE.SphereGeometry(26, 24, 24);
    const gasMat = new THREE.MeshStandardMaterial({
      color: 0xa3e635,
      transparent: true,
      opacity: 0.35,
      roughness: 0.9
    });
    const gasCloud = new THREE.Mesh(gasGeo, gasMat);
    gasCloud.position.set(-55, 18, 65);
    scene.add(gasCloud);
    gasCloudRef.current = gasCloud;

    // Earthquake Debris Mounds
    const debrisGroup = new THREE.Group();
    for (let i = 0; i < 24; i++) {
      const debGeo = new THREE.BoxGeometry(2 + Math.random() * 3, 1.5 + Math.random() * 2, 2 + Math.random() * 3);
      const debMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.95 });
      const deb = new THREE.Mesh(debGeo, debMat);
      deb.position.set(-45 + (Math.random() - 0.5) * 20, 1, 0 + (Math.random() - 0.5) * 25);
      deb.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
      debrisGroup.add(deb);
    }
    scene.add(debrisGroup);
    debrisGroupRef.current = debrisGroup;

    // Resize handling
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 19. Animation & Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      controls.update();

      // Animate Water ripples
      if (riverMat) {
        riverMat.opacity = 0.85 + Math.sin(elapsedTime * 2) * 0.08;
      }

      // Animate Humans Waving Arms
      animatedHumansRef.current.forEach((h) => {
        if (h.isWaving && h.leftArm && h.rightArm) {
          const wave = Math.sin(elapsedTime * 6 + h.offset) * 0.45;
          h.leftArm.rotation.z = Math.PI * 0.75 + wave;
          h.rightArm.rotation.z = -Math.PI * 0.75 - wave;
        }
      });

      // Animate Family Reunion Emerald Beacon Pulsing
      if (familyReunionBeaconRef.current) {
        familyReunionBeaconRef.current.intensity = 3.5 + Math.sin(elapsedTime * 4) * 1.5;
      }

      // Animate Tsunami Wave
      if (tsunamiWaveMeshRef.current) {
        if (active3DDisaster === 'TSUNAMI') {
          tsunamiWaveMeshRef.current.visible = true;
          const cycle = (elapsedTime % 5) / 5;
          tsunamiWaveMeshRef.current.position.z = -85 + cycle * 160;
          tsunamiWaveMeshRef.current.position.y = 8 + Math.sin(cycle * Math.PI) * 12;
          tsunamiWaveMeshRef.current.scale.y = 1 + Math.sin(cycle * Math.PI) * 0.8;
        } else {
          tsunamiWaveMeshRef.current.visible = false;
        }
      }

      // Animate Flood Water Level
      if (waterMeshRef.current) {
        if (active3DDisaster === 'FLOOD') {
          waterMeshRef.current.position.y = 2.4 + Math.sin(elapsedTime * 0.8) * 0.4;
          waterMeshRef.current.scale.set(1.15, 1.8, 1);
        } else if (active3DDisaster === 'TSUNAMI') {
          waterMeshRef.current.position.y = 1.6 + Math.sin(elapsedTime * 1.5) * 0.6;
        } else {
          waterMeshRef.current.position.y = 0.4;
          waterMeshRef.current.scale.set(1, 1, 1);
        }
      }

      // Animate Rain for Cyclone
      if (rainParticlesRef.current) {
        if (active3DDisaster === 'CYCLONE') {
          rainParticlesRef.current.visible = true;
          const pos = rainParticlesRef.current.geometry.attributes.position.array as Float32Array;
          for (let i = 0; i < rainCount; i++) {
            pos[i * 3 + 1] -= 3.5;
            pos[i * 3] += 1.2;
            if (pos[i * 3 + 1] < 0) {
              pos[i * 3 + 1] = 120;
              pos[i * 3] = (Math.random() - 0.5) * 360;
            }
          }
          rainParticlesRef.current.geometry.attributes.position.needsUpdate = true;
        } else {
          rainParticlesRef.current.visible = false;
        }
      }

      // Animate Smoke & Fire
      if (smokeParticlesRef.current && fireBillboardsRef.current) {
        if (active3DDisaster === 'WILDFIRE') {
          smokeParticlesRef.current.visible = true;
          fireBillboardsRef.current.visible = true;
          const pos = smokeParticlesRef.current.geometry.attributes.position.array as Float32Array;
          for (let i = 0; i < smokeCount; i++) {
            pos[i * 3 + 1] += 0.35;
            if (pos[i * 3 + 1] > 65) pos[i * 3 + 1] = 12;
          }
          smokeParticlesRef.current.geometry.attributes.position.needsUpdate = true;
          fireBillboardsRef.current.children.forEach((c, idx) => {
            const scale = 1 + Math.sin(elapsedTime * 4 + idx) * 0.35;
            c.scale.set(scale, scale, scale);
          });
        } else {
          smokeParticlesRef.current.visible = false;
          fireBillboardsRef.current.visible = false;
        }
      }

      // Animate Chemical Gas Cloud
      if (gasCloudRef.current) {
        if (active3DDisaster === 'CHEMICAL') {
          gasCloudRef.current.visible = true;
          gasCloudRef.current.position.x = -55 + Math.sin(elapsedTime * 0.5) * 8;
          const s = 1 + Math.sin(elapsedTime * 0.7) * 0.15;
          gasCloudRef.current.scale.set(s, s * 0.8, s);
        } else {
          gasCloudRef.current.visible = false;
        }
      }

      // Debris visible for Earthquake
      if (debrisGroupRef.current) {
        debrisGroupRef.current.visible = active3DDisaster === 'EARTHQUAKE' || active3DDisaster === 'LANDSLIDE';
      }

      // Animate Victim Pulsing Beacons
      victimBeaconsRef.current.forEach((vb) => {
        const pulse = 1 + Math.sin(elapsedTime * 4) * 0.35;
        vb.mesh.scale.set(pulse, pulse, pulse);
        vb.light.intensity = 3.0 + Math.sin(elapsedTime * 5) * 1.5;
      });

      // Animate Helicopter
      if (heloRotorRef.current && helicopterRef.current) {
        heloRotorRef.current.rotation.y += 0.85;
        if (activeAiRescuePlan === 'B') {
          helicopterRef.current.position.x = -15 + Math.cos(elapsedTime * 0.8) * 14;
          helicopterRef.current.position.z = -42 + Math.sin(elapsedTime * 0.8) * 14;
          helicopterRef.current.position.y = 55 + Math.sin(elapsedTime * 1.5) * 3;
        }
      }

      // Animate Rescue Truck
      if (rescueTruckRef.current) {
        const truckCycle = (elapsedTime * 0.15) % 1;
        rescueTruckRef.current.position.z = -25 + truckCycle * 50;
        rescueTruckRef.current.position.x = -25 + Math.sin(truckCycle * Math.PI) * 4;
      }

      // Animate Ambulance
      if (ambulanceRef.current) {
        const ambCycle = (elapsedTime * 0.2) % 1;
        ambulanceRef.current.position.z = -55 + ambCycle * 40;
      }

      // Animate Route Energy Pulse
      if (routePulseMeshRef.current && routeCurveRef.current) {
        const pulseProgress = (elapsedTime * 0.18) % 1;
        const pt = routeCurveRef.current.getPointAt(pulseProgress);
        routePulseMeshRef.current.position.copy(pt);
      }

      // Dynamic Route & Beacon Color (RED -> CYAN -> GREEN)
      const isReunited = activeRescueStage === 'FAMILY';
      const isMedicalOrHospital = activeRescueStage === 'MEDICAL' || activeRescueStage === 'HOSPITAL' || activeRescueStage === 'SHELTER';
      const targetColor = isReunited ? 0x10b981 : isMedicalOrHospital ? 0x38bdf8 : 0xef4444;

      if (primaryVictimLightRef.current) {
        primaryVictimLightRef.current.color.setHex(targetColor);
      }
      if (primaryVictimRingRef.current && primaryVictimRingRef.current.material instanceof THREE.MeshBasicMaterial) {
        primaryVictimRingRef.current.material.color.setHex(targetColor);
      }
      if (primaryVictimBeamRef.current && primaryVictimBeamRef.current.material instanceof THREE.MeshBasicMaterial) {
        primaryVictimBeamRef.current.material.color.setHex(targetColor);
      }
      if (routeLineMatRef.current) {
        routeLineMatRef.current.color.setHex(targetColor);
      }
      if (routePulseMeshRef.current && routePulseMeshRef.current.material instanceof THREE.MeshBasicMaterial) {
        routePulseMeshRef.current.material.color.setHex(targetColor);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [windowTexture, active3DDisaster, activeAiRescuePlan, activeRescueStage]);

  // Smooth Camera Fly-To function
  const flyCameraTo = (targetPos: THREE.Vector3, lookAtPos: THREE.Vector3, duration = 1200) => {
    if (!cameraRef.current || !controlsRef.current) return;
    setCameraFlying(true);

    const startPos = cameraRef.current.position.clone();
    const startTarget = controlsRef.current.target.clone();
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

      cameraRef.current?.position.lerpVectors(startPos, targetPos, ease);
      controlsRef.current?.target.lerpVectors(startTarget, lookAtPos, ease);
      controlsRef.current?.update();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCameraFlying(false);
      }
    };
    requestAnimationFrame(step);
  };

  const resetCamera = () => {
    flyCameraTo(new THREE.Vector3(130, 95, 140), new THREE.Vector3(0, 10, 0), 1000);
  };

  const focusOnVictim = () => {
    flyCameraTo(new THREE.Vector3(15, 60, -15), new THREE.Vector3(-15, 42, -42), 1200);
    selectEntity('VICTIM', 'VY-2026-0002047');
  };

  const focusOnRescueTeam = () => {
    flyCameraTo(new THREE.Vector3(45, 25, 25), new THREE.Vector3(15, 2, 0), 1200);
    selectEntity('TEAM', 'TEAM-BRAVO-02');
  };

  const focusOnFamilyReunion = () => {
    flyCameraTo(new THREE.Vector3(-30, 30, 85), new THREE.Vector3(-60, 6, 55), 1200);
  };

  const toggleFullscreenMode = () => {
    if (!document.fullscreenElement) {
      mountRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative w-full h-full bg-[#050914] overflow-hidden select-none flex flex-col font-sans">
      {/* 1. TOP HEADER */}
      <div className="h-14 bg-[#070e1c]/90 backdrop-blur-md border-b border-slate-800/80 px-4 flex items-center justify-between z-20 shrink-0 shadow-lg">
        {/* Left: Back Button + Title + Subtitle */}
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center space-x-1"
              title="Return to Previous View"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-sm tracking-widest text-white uppercase flex items-center">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mr-1.5 animate-pulse"></span>
                3D CITY TWIN
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold tracking-wider">
                SIMULATION MODE
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono tracking-tight">
              Command Complex Rooftop / Old Bridge Sector • Spacious Grid
            </div>
          </div>
        </div>

        {/* Right Status Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-xs font-mono">
          {/* Wave Timer */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-sky-950/80 border border-sky-500/40 text-cyan-300 shadow-sm">
            <Waves className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-bold">Wave ({waveCountdown}s)</span>
          </div>

          {/* Focus Family Reunion Button */}
          <button
            onClick={focusOnFamilyReunion}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 transition cursor-pointer"
            title="Fly camera to Family Reunification Center RC-02"
          >
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-current" />
            <span className="hidden sm:inline">RC-02 Reunion</span>
          </button>

          {/* Victims Count Pill */}
          <button 
            onClick={focusOnVictim}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60 transition cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-rose-400" />
            <span>Victims (14)</span>
          </button>

          {/* Shelter Pill */}
          <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
            <Home className="w-3.5 h-3.5 text-emerald-400" />
            <span>Shelter (92%)</span>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreenMode}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. DISASTER SELECTOR BAR */}
      <div className="bg-[#091122]/95 border-b border-slate-800/80 px-3 py-1.5 flex items-center space-x-1 sm:space-x-2 overflow-x-auto scrollbar-none z-20 shrink-0">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider pl-1 mr-1 hidden sm:inline">
          DISASTER SCENARIO:
        </span>
        {[
          { type: 'TSUNAMI' as SimulatedDisasterType, label: '🌊 Tsunami' },
          { type: 'FLOOD' as SimulatedDisasterType, label: '🌊 Flood' },
          { type: 'EARTHQUAKE' as SimulatedDisasterType, label: '🌎 Earthquake' },
          { type: 'WILDFIRE' as SimulatedDisasterType, label: '🔥 Wildfire' },
          { type: 'CYCLONE' as SimulatedDisasterType, label: '🌀 Cyclone' },
          { type: 'CHEMICAL' as SimulatedDisasterType, label: '☢ Chemical' },
          { type: 'LANDSLIDE' as SimulatedDisasterType, label: '⛰ Landslide' }
        ].map((d) => (
          <button
            key={d.type}
            onClick={() => setActive3DDisaster(d.type)}
            className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition whitespace-nowrap flex items-center space-x-1 ${
              active3DDisaster === d.type
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25 border border-cyan-400'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>{d.label}</span>
          </button>
        ))}
      </div>

      {/* 3. MAIN 3D CITY VIEWPORT */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-[#050914]">
        {/* Canvas WebGL Mount */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* 4. TOP FLOATING TELEMETRY HUD BANNERS */}
        <div className="absolute top-3 left-4 right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pointer-events-none z-10">
          <div className="flex flex-col space-y-1.5">
            {/* Surge Banner */}
            <div className="px-3 py-1.5 rounded-lg bg-[#071328]/85 backdrop-blur-md border border-cyan-500/40 text-cyan-200 text-xs font-mono shadow-xl flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="font-bold tracking-wide">
                🌊 18M TSUNAMI WAVE SURGE SWEEPING OVER BUILDINGS
              </span>
            </div>

            {/* Tactical Extraction Sub-banner */}
            <div className="px-3 py-1 rounded-md bg-[#0a1832]/80 backdrop-blur-sm border border-slate-700/60 text-slate-300 text-[11px] font-mono flex items-center space-x-2">
              <span className="text-amber-400 font-bold">🚑</span>
              <span>Cruising River Channel → Winch Extraction</span>
            </div>
          </div>

          {/* Quick Camera Navigation Controls */}
          <div className="pointer-events-auto flex items-center space-x-1.5 bg-[#070e1c]/80 backdrop-blur-md p-1 rounded-lg border border-slate-800 shadow-lg">
            <button
              onClick={focusOnVictim}
              className="px-2 py-1 rounded text-[11px] font-mono bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition"
              title="Fly camera to critical rooftop victim"
            >
              🎯 Focus Victim
            </button>
            <button
              onClick={focusOnRescueTeam}
              className="px-2 py-1 rounded text-[11px] font-mono bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 transition"
              title="Fly camera to rescue boat"
            >
              🚤 Focus Team
            </button>
            <button
              onClick={focusOnFamilyReunion}
              className="px-2 py-1 rounded text-[11px] font-mono bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 transition"
              title="Fly camera to Family Reunification Center RC-02"
            >
              💖 Reunion RC-02
            </button>
            <button
              onClick={resetCamera}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700/60 transition"
              title="Reset 3D Camera"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Floating In-Scene Victim Locator Tag */}
        <div className="absolute top-28 left-8 pointer-events-none hidden md:block">
          <div className={`px-3 py-2 rounded-lg bg-black/85 backdrop-blur-md border-l-4 border border-slate-800 shadow-2xl text-xs font-mono ${
            activeRescueStage === 'FAMILY' ? 'border-l-emerald-500' : 'border-l-rose-500'
          }`}>
            <div className="flex items-center space-x-1.5 font-bold">
              <span className={`w-2 h-2 rounded-full ${
                activeRescueStage === 'FAMILY' ? 'bg-emerald-400' : 'bg-rose-500 animate-pulse'
              }`}></span>
              <span className={activeRescueStage === 'FAMILY' ? 'text-emerald-300' : 'text-rose-400'}>
                CASE #{activeCitizenCaseId || 'VY-26-1042'}
              </span>
            </div>
            <div className="text-[10px] text-slate-300 mt-0.5">
              STAGE: <strong className="text-cyan-300">{activeRescueStage}</strong> ({activeRescueStage === 'FAMILY' ? 'SAFE & REUNITED' : 'CRITICAL RESCUE'})
            </div>
            <div className="text-[10px] text-cyan-400 font-mono">LOCATION: OLD BRIDGE ROOFTOP (+42m)</div>
          </div>
        </div>

        {/* Floating Route Telemetry Tag */}
        <div className="absolute bottom-6 left-6 pointer-events-none hidden lg:block z-10">
          <div className="px-3 py-2 rounded-lg bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 text-xs font-mono shadow-xl">
            <div className="text-[10px] text-slate-400">
              RESCUE UNIT TELEMETRY ({activeRescueTracking.teamName} / {activeRescueTracking.vehicleId}):
            </div>
            <div className="text-cyan-300 font-bold flex items-center space-x-2 mt-0.5">
              <span>SPEED: {activeRescueTracking.speedKmh} km/h</span>
              <span className="text-slate-600">•</span>
              <span>HEADING: {activeRescueTracking.heading}°</span>
              <span className="text-slate-600">•</span>
              <span>DIST: {activeRescueTracking.distanceKm} km</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400">ETA: {activeRescueTracking.etaMinutes} min</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400">{activeRescueTracking.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. BOTTOM CONTROL PANEL OF 3D TWIN */}
      <div className="bg-[#070e1c]/95 border-t border-slate-800 p-3 z-20 shrink-0">
        {/* Top Header of Bottom Panel */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
          {/* Tabs */}
          <div className="flex items-center space-x-2 font-mono text-xs">
            <button
              onClick={() => setThreatAssessmentTab('PLANS')}
              className={`px-3 py-1 rounded-md font-bold transition flex items-center space-x-1.5 ${
                threatAssessmentTab === 'PLANS'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🧠 AI RESCUE PLANS (3)</span>
            </button>
            <button
              onClick={() => setThreatAssessmentTab('THREAT')}
              className={`px-3 py-1 rounded-md font-bold transition flex items-center space-x-1.5 ${
                threatAssessmentTab === 'THREAT'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>⚠ THREAT ASSESSMENT</span>
            </button>
          </div>

          {/* Right Feasibility Status */}
          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="text-slate-400 text-[11px]">OPTIMAL PATH:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold tracking-wider">
              94% FEASIBILITY
            </span>
          </div>
        </div>

        {/* Tab Content 1: AI Rescue Plan Cards */}
        {threatAssessmentTab === 'PLANS' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {aiRescuePlans.map((plan) => {
              const isSelected = activeAiRescuePlan === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => {
                    setActiveAiRescuePlan(plan.id);
                    if (plan.id === 'A') focusOnRescueTeam();
                    else if (plan.id === 'B' && helicopterRef.current) {
                      flyCameraTo(new THREE.Vector3(50, 75, -20), new THREE.Vector3(-15, 42, -42), 1200);
                    }
                  }}
                  className={`p-2.5 rounded-lg border transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                          plan.id === 'A' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                          plan.id === 'B' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {plan.title}
                        </span>
                        <span className="text-xs font-bold text-slate-100">{plan.teamCallsign}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-1">
                        {plan.routeDescription}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-extrabold text-cyan-300">
                        ETA: {plan.eta}
                      </div>
                      <div className={`text-[11px] font-mono font-bold mt-0.5 ${
                        plan.feasibilityPercent >= 80 ? 'text-emerald-400' :
                        plan.feasibilityPercent >= 60 ? 'text-amber-400' :
                        'text-rose-400'
                      }`}>
                        {plan.feasibilityPercent}% FEASIBILITY
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">RISK: <strong className={plan.riskLevel === 'LOW' ? 'text-emerald-400' : plan.riskLevel === 'MEDIUM' ? 'text-amber-400' : 'text-rose-400'}>{plan.riskLevel}</strong></span>
                    <span className="text-cyan-400 font-semibold">{isSelected ? '● ACTIVE ROUTE IN 3D' : 'Click to Highlight'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Tab Content 2: Threat Assessment Telemetry */
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 font-mono text-xs">
            <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400">WATER LEVEL</div>
              <div className="text-sm font-bold text-cyan-300 mt-0.5">+{threatData.waterLevelMeters}m</div>
              <div className="text-[9px] text-slate-500">CANAL BASIN</div>
            </div>
            <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400">AFFECTED BUILDINGS</div>
              <div className="text-sm font-bold text-amber-400 mt-0.5">{threatData.affectedBuildings}</div>
              <div className="text-[9px] text-slate-500">INUNDATED</div>
            </div>
            <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400">TRAPPED PEOPLE</div>
              <div className="text-sm font-bold text-rose-400 mt-0.5">{threatData.trappedPeople}</div>
              <div className="text-[9px] text-slate-500">SOS REGISTERED</div>
            </div>
            <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400">BLOCKED ROUTES</div>
              <div className="text-sm font-bold text-slate-200 mt-0.5">{threatData.blockedRoutes} SECTORS</div>
              <div className="text-[9px] text-slate-500">DEBRIS / SURGE</div>
            </div>
            <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400">RESCUE RISK</div>
              <div className="text-sm font-bold text-rose-400 mt-0.5">{threatData.rescueRisk}</div>
              <div className="text-[9px] text-slate-500">HIGH CURRENT</div>
            </div>
            <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400">COMMS STATUS</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">4/5 MESH NODES</div>
              <div className="text-[9px] text-slate-500">LORA RELAYS</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
