import "./style.css";
import * as THREE from "three";
import {
  completeLevel,
  collectSunfly,
  createPlayer,
  createProgress,
  isGateOpen,
  isGripSurfaceActive,
  isInsideBox,
  isSentryDetection,
  isTongueAnchorActive,
  levelOrder,
  levels,
  paintLabels,
  paintSurface,
  resetToCheckpoint,
  useTongueAnchor,
  type Box,
  type LevelDefinition,
  type LevelId,
  type PaintableSurface,
  type PaintColor,
  type PlayerState
} from "./domain";

type InputState = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  orbitLeft: boolean;
  orbitRight: boolean;
};

type MecchaTestApi = {
  getState: () => {
    levelId: LevelId;
    player: { x: number; y: number; z: number };
    completedLevels: LevelId[];
    currentPaint: string;
    gateOpen: boolean;
    activeGripSurfaces: string[];
    collectedSunflies: number;
    sentryAlert: string;
    activeTongueAnchors: string[];
  };
  moveToExit: () => void;
  paintSurface: (surfaceId: string, paint?: PaintColor) => void;
  collectSunfly: (index: number) => void;
  triggerSentry: (sentryId: string) => void;
  useTongueAnchor: (anchorId: string) => void;
  setLevel: (levelId: LevelId) => void;
};

declare global {
  interface Window {
    __meccha?: MecchaTestApi;
  }
}

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app root");
}

const isTestMode = new URLSearchParams(window.location.search).has("test");
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x6fc5b2);
scene.fog = new THREE.Fog(0x6fc5b2, 22, 56);

const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 100);
const clock = new THREE.Clock();

const ambient = new THREE.HemisphereLight(0xe8ffd4, 0x27422d, 2.1);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xfff1b8, 2.2);
sun.position.set(-6, 12, 8);
sun.castShadow = true;
scene.add(sun);

const hud = document.createElement("div");
hud.className = "hud";
hud.innerHTML = `
  <div class="hud__pill"><span class="hud__label">Paint</span><span class="hud__value" data-testid="paint">Green Grip</span></div>
  <div class="hud__pill"><span class="hud__label">Level</span><span class="hud__value" data-testid="level">Training Grove</span></div>
  <div class="hud__pill"><span class="hud__label">Goal</span><span class="hud__value" data-testid="goal">Reach the sunlit exit</span></div>
  <div class="hud__pill"><span class="hud__label">Progress</span><span class="hud__value" data-testid="progress">0 / 3 Levels</span></div>
`;
document.body.appendChild(hud);

const message = document.createElement("div");
message.className = "hud__message";
message.dataset.testid = "message";
message.textContent = "Training Grove: move with WASD, orbit with Q/E, jump with Space.";
document.body.appendChild(message);
message.className = "hud__message";
message.dataset.testid = "message";
message.textContent = "Training Grove: move with WASD, orbit with Q/E, jump with Space.";
document.body.appendChild(message);

const startOverlay = document.createElement("div");
startOverlay.className = "start-overlay";
startOverlay.innerHTML = `
  <div class="start-overlay__panel">
    <h1>Meccha Chameleon</h1>
    <p>Paint, climb, blend, and leap through the Jungle Temple.</p>
    <button type="button" data-testid="start">Start Training Grove</button>
  </div>
`;

if (!isTestMode) {
  document.body.appendChild(startOverlay);
}

let level: LevelDefinition = levels["training-grove"];
let progress = createProgress(level.id);
let player: PlayerState = createPlayer(level);
let chameleon: THREE.Group;
let worldGroup = new THREE.Group();
let exitMesh: THREE.Mesh;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const paintableMeshes = new Map<string, THREE.Mesh>();
const gateMeshes = new Map<string, THREE.Mesh>();
const sunflyMeshes = new Map<number, THREE.Mesh>();
const sentryMeshes = new Map<string, THREE.Mesh>();
const tongueAnchorMeshes = new Map<string, THREE.Mesh>();
let orbitYaw = -Math.PI / 2;
let orbitPitch = 0.42;
let gameStarted = isTestMode;
let sentryAlert = "Clear";
let audioContext: AudioContext | undefined;

const input: InputState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
  orbitLeft: false,
  orbitRight: false
};

const makeBoxMesh = (box: Box, color: number): THREE.Mesh => {
  const geometry = new THREE.BoxGeometry(box.size.x, box.size.y, box.size.z);
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.78 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(box.center.x, box.center.y, box.center.z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
};

const paintColorHex: Record<PaintColor, number> = {
  green: 0x70d65c,
  purple: 0x8f63e9,
  orange: 0xf28c28
};

const storageKey = "meccha-chameleon-progress";

const playTone = (frequency: number, duration = 0.08) => {
  if (isTestMode) return;
  audioContext ??= new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.frequency.value = frequency;
  oscillator.type = "triangle";
  gain.gain.setValueAtTime(0.06, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
};

const saveProgress = () => {
  window.localStorage.setItem(
    storageKey,
    JSON.stringify({
      completedLevels: progress.completedLevels,
      collectedSunflies: progress.collectedSunflies
    })
  );
};

const restoreProgress = () => {
  const saved = window.localStorage.getItem(storageKey);
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved) as Partial<typeof progress>;
    progress = {
      ...progress,
      completedLevels: parsed.completedLevels ?? progress.completedLevels,
      collectedSunflies: parsed.collectedSunflies ?? progress.collectedSunflies
    };
  } catch {
    window.localStorage.removeItem(storageKey);
  }
};

const createChameleon = (): THREE.Group => {
  const group = new THREE.Group();

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x70d65c,
    roughness: 0.62
  });
  const outlineMaterial = new THREE.MeshBasicMaterial({
    color: 0xe9ff7a,
    transparent: true,
    opacity: 0.34,
    side: THREE.BackSide
  });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 16), bodyMaterial);
  body.scale.set(1, 0.72, 1.3);
  body.castShadow = true;
  group.add(body);

  const outline = new THREE.Mesh(new THREE.SphereGeometry(0.49, 24, 16), outlineMaterial);
  outline.scale.set(1, 0.72, 1.3);
  group.add(outline);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 12), bodyMaterial);
  head.position.set(0, 0.15, -0.55);
  head.castShadow = true;
  group.add(head);

  const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x131313 });
  [-0.18, 0.18].forEach((x) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 8), eyeMaterial);
    eye.position.set(x, 0.35, -0.78);
    group.add(eye);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), pupilMaterial);
    pupil.position.set(x, 0.35, -0.845);
    group.add(pupil);
  });

  return group;
};

const decorateWorld = () => {
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8a5c2f, roughness: 0.9 });
  const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x2e9c5a, roughness: 0.8 });
  const stoneMaterial = new THREE.MeshStandardMaterial({ color: 0xb8b17c, roughness: 0.86 });

  for (let i = 0; i < 8; i += 1) {
    const x = -10 + i * 3;
    const z = i % 2 === 0 ? -5.3 : 5.3;
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 2.2, 8), trunkMaterial);
    trunk.position.set(x, 0.85, z);
    trunk.castShadow = true;
    worldGroup.add(trunk);

    const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9, 0), leafMaterial);
    leaves.position.set(x, 2.25, z);
    leaves.castShadow = true;
    worldGroup.add(leaves);
  }

  for (let i = 0; i < 5; i += 1) {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.42, 2.4, 6), stoneMaterial);
    pillar.position.set(-5 + i * 2.5, 0.95, i % 2 === 0 ? 4.4 : -4.4);
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    worldGroup.add(pillar);
  }
};

const loadLevel = (levelId: LevelId) => {
  level = levels[levelId];
  player = createPlayer(level);
  sentryAlert = "Clear";
  scene.remove(worldGroup);
  worldGroup = new THREE.Group();
  paintableMeshes.clear();
  gateMeshes.clear();
  sunflyMeshes.clear();
  sentryMeshes.clear();
  tongueAnchorMeshes.clear();
  scene.add(worldGroup);

  level.platforms.forEach((platform, index) => {
    worldGroup.add(makeBoxMesh(platform, index === 0 ? 0x4f8f42 : 0xc6b56f));
  });

  exitMesh = makeBoxMesh(level.exit, 0xf2c14e);
  exitMesh.name = "Exit";
  worldGroup.add(exitMesh);

  level.paintableSurfaces.forEach((surface) => {
    const mesh = makeBoxMesh(surface.box, 0xd6e39e);
    mesh.name = surface.id;
    mesh.userData.surfaceId = surface.id;
    paintableMeshes.set(surface.id, mesh);
    worldGroup.add(mesh);
  });

  level.gates.forEach((gate) => {
    const mesh = makeBoxMesh(gate.box, 0x7c6b45);
    mesh.name = gate.id;
    gateMeshes.set(gate.id, mesh);
    worldGroup.add(mesh);
  });

  const sunflyMaterial = new THREE.MeshStandardMaterial({
    color: 0xf9f871,
    emissive: 0x665900,
    roughness: 0.35
  });
  level.sunflies.forEach((sunfly, index) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 10), sunflyMaterial.clone());
    mesh.position.set(sunfly.x, sunfly.y, sunfly.z);
    mesh.name = `sunfly-${index}`;
    mesh.castShadow = true;
    sunflyMeshes.set(index, mesh);
    worldGroup.add(mesh);
  });

  level.sentries.forEach((sentry) => {
    const base = makeBoxMesh(sentry.vision, 0x8f63e9);
    base.name = sentry.id;
    base.material = new THREE.MeshStandardMaterial({
      color: 0x8f63e9,
      transparent: true,
      opacity: 0.26,
      roughness: 0.8
    });
    sentryMeshes.set(sentry.id, base);
    worldGroup.add(base);
  });

  level.tongueAnchors.forEach((anchor) => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 18, 12),
      new THREE.MeshStandardMaterial({ color: 0xf28c28, emissive: 0x562500 })
    );
    mesh.position.set(anchor.position.x, anchor.position.y, anchor.position.z);
    mesh.name = anchor.id;
    tongueAnchorMeshes.set(anchor.id, mesh);
    worldGroup.add(mesh);
  });

  decorateWorld();

  if (chameleon) {
    scene.remove(chameleon);
  }
  chameleon = createChameleon();
  scene.add(chameleon);
  updateHud();
  updatePaintMeshes();
};

const updateHud = () => {
  const paint = document.querySelector<HTMLElement>('[data-testid="paint"]');
  const levelText = document.querySelector<HTMLElement>('[data-testid="level"]');
  const goal = document.querySelector<HTMLElement>('[data-testid="goal"]');
  const progressText = document.querySelector<HTMLElement>('[data-testid="progress"]');

  if (paint) paint.textContent = paintLabels[player.currentPaint];
  if (levelText) levelText.textContent = level.name;
  if (goal) goal.textContent = level.goal;
  if (progressText) {
    progressText.textContent = `${progress.completedLevels.length} / ${levelOrder.length} Levels`;
  }
};

const getSurface = (surfaceId: string): PaintableSurface | undefined =>
  level.paintableSurfaces.find((surface) => surface.id === surfaceId);

const activeGripSurfaces = (): string[] =>
  level.paintableSurfaces
    .filter((surface) => isGripSurfaceActive(progress, surface))
    .map((surface) => surface.id);

const activeTongueAnchors = (): string[] =>
  level.tongueAnchors
    .filter((anchor) => isTongueAnchorActive(progress, level, anchor))
    .map((anchor) => anchor.id);

const updatePaintMeshes = () => {
  level.paintableSurfaces.forEach((surface) => {
    const mesh = paintableMeshes.get(surface.id);
    if (!mesh) return;
    const painted = progress.paintedSurfaces[surface.id];
    const material = mesh.material;
    if (material instanceof THREE.MeshStandardMaterial) {
      material.color.setHex(painted ? paintColorHex[painted] : 0xd6e39e);
      material.emissive.setHex(isGripSurfaceActive(progress, surface) ? 0x1f6f2e : 0x000000);
    }
  });

  level.gates.forEach((gate) => {
    const mesh = gateMeshes.get(gate.id);
    if (!mesh) return;
    const open = isGateOpen(progress, level, gate);
    mesh.visible = !open;
    mesh.position.y = open ? -20 : gate.box.center.y;
  });

  sunflyMeshes.forEach((mesh, index) => {
    mesh.visible = !progress.collectedSunflies[level.id].includes(index);
  });

  level.tongueAnchors.forEach((anchor) => {
    const mesh = tongueAnchorMeshes.get(anchor.id);
    if (!mesh) return;
    const material = mesh.material;
    if (material instanceof THREE.MeshStandardMaterial) {
      material.emissive.setHex(isTongueAnchorActive(progress, level, anchor) ? 0xaa4f00 : 0x1c1205);
    }
  });
};

const applyPaintToSurface = (surfaceId: string, paint = player.currentPaint) => {
  const surface = getSurface(surfaceId);
  if (!surface) return;
  progress = paintSurface(progress, surface, paint);
  message.textContent = `${surface.label} painted ${paintLabels[paint]}.`;
  updatePaintMeshes();
  updateHud();
};

const collectSunfliesIfReady = () => {
  const nextProgress = collectSunfly(progress, level, player);
  if (nextProgress !== progress) {
    progress = nextProgress;
    message.textContent = `Sunfly collected in ${level.name}.`;
    playTone(880);
    saveProgress();
    updatePaintMeshes();
    updateHud();
  }
};

const checkSentryDetection = () => {
  const watching = level.sentries.find((sentry) => isInsideBox(player.position, sentry.vision));
  if (watching && !isSentryDetection(watching, player, player.currentPaint)) {
    sentryAlert = "Clear";
    updateHud();
    return;
  }
  const detected = level.sentries.find((sentry) =>
    isSentryDetection(sentry, player, player.currentPaint)
  );
  if (!detected) return;
  player = resetToCheckpoint(player, detected);
  sentryAlert = detected.label;
  message.textContent = `${detected.label} spotted the wrong camouflage. Back to checkpoint.`;
  playTone(180, 0.16);
  chameleon.position.set(player.position.x, player.position.y, player.position.z);
  updateHud();
};

const activateTongueAnchor = (anchorId: string) => {
  const anchor = level.tongueAnchors.find((candidate) => candidate.id === anchorId);
  if (!anchor) return;
  const nextPlayer = useTongueAnchor(progress, level, player, anchor);
  if (nextPlayer === player) {
    message.textContent = `${anchor.label} needs Orange Paint.`;
    return;
  }
  player = nextPlayer;
  message.textContent = `${anchor.label} pulled the Chameleon across.`;
  playTone(520);
  chameleon.position.set(player.position.x, player.position.y, player.position.z);
  updateHud();
};

const finishLevelIfReady = () => {
  const nextProgress = completeLevel(progress, level, player);
  if (nextProgress !== progress) {
    progress = nextProgress;
    saveProgress();
    playTone(660, 0.12);
    message.textContent = `${level.name} complete. ${progress.levelId === level.id ? "All levels complete." : "Next level unlocked."}`;
    if (progress.levelId !== level.id) {
      loadLevel(progress.levelId);
    }
  }
  updateHud();
};

const clampToWorld = () => {
  const ground = level.platforms[0];
  const halfX = ground.size.x / 2 - 0.45;
  const halfZ = ground.size.z / 2 - 0.45;
  player.position.x = THREE.MathUtils.clamp(
    player.position.x,
    ground.center.x - halfX,
    ground.center.x + halfX
  );
  player.position.z = THREE.MathUtils.clamp(
    player.position.z,
    ground.center.z - halfZ,
    ground.center.z + halfZ
  );
};

const updatePlayer = (dt: number) => {
  if (!gameStarted) return;

  if (input.orbitLeft) orbitYaw += dt * 1.8;
  if (input.orbitRight) orbitYaw -= dt * 1.8;
  orbitPitch = THREE.MathUtils.clamp(orbitPitch, 0.18, 0.82);

  const move = new THREE.Vector3(
    Number(input.right) - Number(input.left),
    0,
    Number(input.backward) - Number(input.forward)
  );

  if (move.lengthSq() > 0) {
    move.normalize();
    const yaw = new THREE.Euler(0, orbitYaw, 0);
    move.applyEuler(yaw);
    const previousX = player.position.x;
    const previousZ = player.position.z;
    player.position.x += move.x * dt * 5;
    player.position.z += move.z * dt * 5;
    chameleon.rotation.y = Math.atan2(move.x, move.z);
    const blockedByGate = level.gates.some((gate) => {
      if (isGateOpen(progress, level, gate)) return false;
      return (
        Math.abs(player.position.x - gate.box.center.x) <= gate.box.size.x / 2 + 0.45 &&
        Math.abs(player.position.z - gate.box.center.z) <= gate.box.size.z / 2 + 0.45
      );
    });
    if (blockedByGate) {
      player.position.x = previousX;
      player.position.z = previousZ;
    }
  }

  if (input.jump && player.grounded) {
    player.velocity.y = 7;
    player.grounded = false;
  }

  player.velocity.y -= 18 * dt;
  player.position.y += player.velocity.y * dt;

  const groundY = 0.75;
  if (player.position.y <= groundY) {
    player.position.y = groundY;
    player.velocity.y = 0;
    player.grounded = true;
  }

  clampToWorld();
  chameleon.position.set(player.position.x, player.position.y, player.position.z);
  collectSunfliesIfReady();
  checkSentryDetection();
  finishLevelIfReady();
};

const handlePaintClick = (event: PointerEvent) => {
  if (!gameStarted || paintableMeshes.size === 0) return;
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects([...paintableMeshes.values()], false);
  const surfaceId = hits[0]?.object.userData.surfaceId;
  if (typeof surfaceId === "string") {
    applyPaintToSurface(surfaceId);
  }
};

const updateCamera = () => {
  const target = new THREE.Vector3(player.position.x, player.position.y + 0.8, player.position.z);
  const distance = 8;
  const horizontal = Math.cos(orbitPitch) * distance;
  camera.position.set(
    target.x + Math.cos(orbitYaw) * horizontal,
    target.y + Math.sin(orbitPitch) * distance,
    target.z + Math.sin(orbitYaw) * horizontal
  );
  camera.lookAt(target);
};

const resize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};

const onKey = (event: KeyboardEvent, pressed: boolean) => {
  const key = event.key.toLowerCase();
  if (key === "w" || key === "arrowup") input.forward = pressed;
  if (key === "s" || key === "arrowdown") input.backward = pressed;
  if (key === "a" || key === "arrowleft") input.left = pressed;
  if (key === "d" || key === "arrowright") input.right = pressed;
  if (key === " ") input.jump = pressed;
  if (key === "q") input.orbitLeft = pressed;
  if (key === "e") input.orbitRight = pressed;
  if (pressed && key === "1") player.currentPaint = "green";
  if (pressed && key === "2") player.currentPaint = "purple";
  if (pressed && key === "3") player.currentPaint = "orange";
  if (pressed && ["1", "2", "3"].includes(key)) {
    message.textContent = `Selected ${paintLabels[player.currentPaint]}.`;
    updateHud();
  }
};

window.addEventListener("keydown", (event) => onKey(event, true));
window.addEventListener("keyup", (event) => onKey(event, false));
window.addEventListener("resize", resize);
renderer.domElement.addEventListener("pointerdown", handlePaintClick);

startOverlay.querySelector("button")?.addEventListener("click", () => {
  gameStarted = true;
  startOverlay.remove();
});

window.__meccha = {
  getState: () => ({
    levelId: level.id,
    player: { ...player.position },
    completedLevels: [...progress.completedLevels],
    currentPaint: player.currentPaint,
    gateOpen: level.gates.every((gate) => isGateOpen(progress, level, gate)),
    activeGripSurfaces: activeGripSurfaces(),
    collectedSunflies: progress.collectedSunflies[level.id].length,
    sentryAlert,
    activeTongueAnchors: activeTongueAnchors()
  }),
  moveToExit: () => {
    player.position = { ...level.exit.center };
    chameleon.position.set(player.position.x, player.position.y, player.position.z);
    finishLevelIfReady();
  },
  paintSurface: (surfaceId: string, paint = player.currentPaint) => {
    player.currentPaint = paint;
    applyPaintToSurface(surfaceId, paint);
  },
  collectSunfly: (index: number) => {
    const sunfly = level.sunflies[index];
    if (!sunfly) return;
    player.position = { ...sunfly };
    collectSunfliesIfReady();
  },
  triggerSentry: (sentryId: string) => {
    const sentry = level.sentries.find((candidate) => candidate.id === sentryId);
    if (!sentry) return;
    player.position = { ...sentry.vision.center };
    chameleon.position.set(player.position.x, player.position.y, player.position.z);
    checkSentryDetection();
  },
  useTongueAnchor: (anchorId: string) => {
    activateTongueAnchor(anchorId);
  },
  setLevel: (levelId: LevelId) => {
    progress = { ...progress, levelId };
    loadLevel(levelId);
  }
};

restoreProgress();
loadLevel("training-grove");
resize();

const animate = () => {
  const dt = Math.min(clock.getDelta(), 0.05);
  updatePlayer(dt);
  updateCamera();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};

animate();
