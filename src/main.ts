import "./style.css";
import * as THREE from "three";
import {
  completeLevel,
  createPlayer,
  createProgress,
  levelOrder,
  levels,
  paintLabels,
  type Box,
  type LevelDefinition,
  type LevelId,
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
  };
  moveToExit: () => void;
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
let orbitYaw = -Math.PI / 2;
let orbitPitch = 0.42;
let gameStarted = isTestMode;

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
  scene.remove(worldGroup);
  worldGroup = new THREE.Group();
  scene.add(worldGroup);

  level.platforms.forEach((platform, index) => {
    worldGroup.add(makeBoxMesh(platform, index === 0 ? 0x4f8f42 : 0xc6b56f));
  });

  exitMesh = makeBoxMesh(level.exit, 0xf2c14e);
  exitMesh.name = "Exit";
  worldGroup.add(exitMesh);
  decorateWorld();

  if (chameleon) {
    scene.remove(chameleon);
  }
  chameleon = createChameleon();
  scene.add(chameleon);
  updateHud();
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

const finishLevelIfReady = () => {
  const nextProgress = completeLevel(progress, level, player);
  if (nextProgress !== progress) {
    progress = nextProgress;
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
    player.position.x += move.x * dt * 5;
    player.position.z += move.z * dt * 5;
    chameleon.rotation.y = Math.atan2(move.x, move.z);
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
  finishLevelIfReady();
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
};

window.addEventListener("keydown", (event) => onKey(event, true));
window.addEventListener("keyup", (event) => onKey(event, false));
window.addEventListener("resize", resize);

startOverlay.querySelector("button")?.addEventListener("click", () => {
  gameStarted = true;
  startOverlay.remove();
});

window.__meccha = {
  getState: () => ({
    levelId: level.id,
    player: { ...player.position },
    completedLevels: [...progress.completedLevels],
    currentPaint: player.currentPaint
  }),
  moveToExit: () => {
    player.position = { ...level.exit.center };
    chameleon.position.set(player.position.x, player.position.y, player.position.z);
    finishLevelIfReady();
  },
  setLevel: (levelId: LevelId) => {
    progress = { ...progress, levelId };
    loadLevel(levelId);
  }
};

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
