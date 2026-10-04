export type LevelId = "training-grove" | "sentry-shrine" | "anchor-falls";
export type PaintColor = "green" | "purple" | "orange";

export type Vec3 = {
  x: number;
  y: number;
  z: number;
};

export type Box = {
  center: Vec3;
  size: Vec3;
};

export type PaintableSurfaceKind = "gate-switch" | "grip-panel" | "camouflage-panel" | "anchor-panel";

export type PaintableSurface = {
  id: string;
  label: string;
  kind: PaintableSurfaceKind;
  box: Box;
  requiredPaint: PaintColor;
};

export type Gate = {
  id: string;
  label: string;
  box: Box;
  switchSurfaceId: string;
};

export type LevelDefinition = {
  id: LevelId;
  name: string;
  goal: string;
  start: Vec3;
  exit: Box;
  platforms: Box[];
  sunflies: Vec3[];
  paintableSurfaces: PaintableSurface[];
  gates: Gate[];
};

export type PlayerState = {
  position: Vec3;
  velocity: Vec3;
  grounded: boolean;
  currentPaint: PaintColor;
};

export type GameProgress = {
  levelId: LevelId;
  completedLevels: LevelId[];
  collectedSunflies: Record<LevelId, number[]>;
  paintedSurfaces: Record<string, PaintColor>;
};

export const levelOrder: LevelId[] = [
  "training-grove",
  "sentry-shrine",
  "anchor-falls"
];

export const paintLabels: Record<PaintColor, string> = {
  green: "Green Grip",
  purple: "Purple Camouflage",
  orange: "Orange Anchor"
};

export const levels: Record<LevelId, LevelDefinition> = {
  "training-grove": {
    id: "training-grove",
    name: "Training Grove",
    goal: "Reach the sunlit exit",
    start: { x: -8, y: 1.1, z: 0 },
    exit: {
      center: { x: 9.2, y: 1.25, z: 0 },
      size: { x: 1.8, y: 2.5, z: 3.2 }
    },
    platforms: [
      { center: { x: 0, y: -0.25, z: 0 }, size: { x: 24, y: 0.5, z: 10 } },
      { center: { x: -2.2, y: 0.6, z: -2.7 }, size: { x: 3.2, y: 0.6, z: 2.4 } },
      { center: { x: 2.2, y: 1.25, z: 2.4 }, size: { x: 3.2, y: 0.6, z: 2.4 } },
      { center: { x: 6.1, y: 1.85, z: 0 }, size: { x: 3.2, y: 0.6, z: 2.4 } }
    ],
    sunflies: [],
    paintableSurfaces: [
      {
        id: "training-grove-green-switch",
        label: "Green gate switch",
        kind: "gate-switch",
        requiredPaint: "green",
        box: {
          center: { x: -4.8, y: 0.35, z: -3.8 },
          size: { x: 1.4, y: 0.2, z: 1.4 }
        }
      },
      {
        id: "training-grove-grip-panel",
        label: "Training grip panel",
        kind: "grip-panel",
        requiredPaint: "green",
        box: {
          center: { x: 4.2, y: 0.35, z: -3.8 },
          size: { x: 1.4, y: 0.2, z: 1.4 }
        }
      }
    ],
    gates: [
      {
        id: "training-grove-gate",
        label: "Training Grove Gate",
        switchSurfaceId: "training-grove-green-switch",
        box: {
          center: { x: -0.2, y: 1.25, z: 0 },
          size: { x: 0.5, y: 2.5, z: 4.2 }
        }
      }
    ]
  },
  "sentry-shrine": {
    id: "sentry-shrine",
    name: "Sentry Shrine",
    goal: "Blend past the shrine watch",
    start: { x: -8, y: 1.1, z: 0 },
    exit: {
      center: { x: 9.2, y: 1.25, z: 0 },
      size: { x: 1.8, y: 2.5, z: 3.2 }
    },
    platforms: [
      { center: { x: 0, y: -0.25, z: 0 }, size: { x: 24, y: 0.5, z: 10 } }
    ],
    sunflies: [
      { x: -3, y: 1.1, z: 3.4 },
      { x: 2, y: 1.1, z: -3.4 },
      { x: 6, y: 1.1, z: 3.2 }
    ],
    paintableSurfaces: [],
    gates: []
  },
  "anchor-falls": {
    id: "anchor-falls",
    name: "Anchor Falls",
    goal: "Chain anchors to the waterfall exit",
    start: { x: -8, y: 1.1, z: 0 },
    exit: {
      center: { x: 9.2, y: 2.1, z: 0 },
      size: { x: 1.8, y: 3, z: 3.2 }
    },
    platforms: [
      { center: { x: 0, y: -0.25, z: 0 }, size: { x: 24, y: 0.5, z: 10 } },
      { center: { x: 4, y: 1.3, z: 0 }, size: { x: 4.2, y: 0.6, z: 2.2 } }
    ],
    sunflies: [
      { x: -4, y: 1.2, z: -3.4 },
      { x: 1, y: 2.2, z: 0 },
      { x: 7, y: 2.4, z: 2.8 }
    ],
    paintableSurfaces: [],
    gates: []
  }
};

export const createProgress = (levelId: LevelId = "training-grove"): GameProgress => ({
  levelId,
  completedLevels: [],
  collectedSunflies: {
    "training-grove": [],
    "sentry-shrine": [],
    "anchor-falls": []
  },
  paintedSurfaces: {}
});

export const createPlayer = (level: LevelDefinition): PlayerState => ({
  position: { ...level.start },
  velocity: { x: 0, y: 0, z: 0 },
  grounded: false,
  currentPaint: "green"
});

export const isInsideBox = (point: Vec3, box: Box): boolean =>
  Math.abs(point.x - box.center.x) <= box.size.x / 2 &&
  Math.abs(point.y - box.center.y) <= box.size.y / 2 &&
  Math.abs(point.z - box.center.z) <= box.size.z / 2;

export const completeLevel = (
  progress: GameProgress,
  level: LevelDefinition,
  player: PlayerState
): GameProgress => {
  if (!isInsideBox(player.position, level.exit)) {
    return progress;
  }

  const completedLevels = progress.completedLevels.includes(level.id)
    ? progress.completedLevels
    : [...progress.completedLevels, level.id];

  const currentIndex = levelOrder.indexOf(level.id);
  const nextLevelId = levelOrder[currentIndex + 1] ?? level.id;

  return {
    ...progress,
    levelId: nextLevelId,
    completedLevels
  };
};

export const collectSunfly = (
  progress: GameProgress,
  level: LevelDefinition,
  player: PlayerState,
  radius = 0.8
): GameProgress => {
  const collected = new Set(progress.collectedSunflies[level.id]);

  level.sunflies.forEach((sunfly, index) => {
    const distance = Math.hypot(
      player.position.x - sunfly.x,
      player.position.y - sunfly.y,
      player.position.z - sunfly.z
    );
    if (distance <= radius) {
      collected.add(index);
    }
  });

  return {
    ...progress,
    collectedSunflies: {
      ...progress.collectedSunflies,
      [level.id]: [...collected].sort((a, b) => a - b)
    }
  };
};

export const paintSurface = (
  progress: GameProgress,
  surface: PaintableSurface,
  paint: PaintColor
): GameProgress => ({
  ...progress,
  paintedSurfaces: {
    ...progress.paintedSurfaces,
    [surface.id]: paint
  }
});

export const isGateOpen = (
  progress: GameProgress,
  level: LevelDefinition,
  gate: Gate
): boolean => {
  const switchSurface = level.paintableSurfaces.find(
    (surface) => surface.id === gate.switchSurfaceId
  );
  if (!switchSurface) return false;
  return progress.paintedSurfaces[switchSurface.id] === switchSurface.requiredPaint;
};

export const isGripSurfaceActive = (
  progress: GameProgress,
  surface: PaintableSurface
): boolean => surface.kind === "grip-panel" && progress.paintedSurfaces[surface.id] === "green";
