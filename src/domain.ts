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

export type Sentry = {
  id: string;
  label: string;
  vision: Box;
  requiredPaint: PaintColor;
  checkpoint: Vec3;
};

export type TongueAnchor = {
  id: string;
  label: string;
  position: Vec3;
  panelSurfaceId: string;
  landing: Vec3;
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
  sentries: Sentry[];
  tongueAnchors: TongueAnchor[];
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
    ],
    sentries: [],
    tongueAnchors: []
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
    paintableSurfaces: [
      {
        id: "sentry-shrine-camouflage-panel",
        label: "Shrine camouflage panel",
        kind: "camouflage-panel",
        requiredPaint: "purple",
        box: {
          center: { x: -3.8, y: 0.35, z: -3.6 },
          size: { x: 1.5, y: 0.2, z: 1.5 }
        }
      }
    ],
    gates: [],
    sentries: [
      {
        id: "shrine-watch",
        label: "Shrine Watch",
        requiredPaint: "purple",
        checkpoint: { x: -8, y: 1.1, z: 0 },
        vision: {
          center: { x: 1.5, y: 1.1, z: 0 },
          size: { x: 4.2, y: 2.2, z: 5.8 }
        }
      }
    ],
    tongueAnchors: []
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
    paintableSurfaces: [
      {
        id: "anchor-falls-orange-panel",
        label: "Falls anchor panel",
        kind: "anchor-panel",
        requiredPaint: "orange",
        box: {
          center: { x: -2.2, y: 0.35, z: -3.8 },
          size: { x: 1.5, y: 0.2, z: 1.5 }
        }
      },
      {
        id: "anchor-falls-green-grip",
        label: "Falls grip panel",
        kind: "grip-panel",
        requiredPaint: "green",
        box: {
          center: { x: 5.8, y: 1.95, z: -1.5 },
          size: { x: 1.5, y: 0.2, z: 1.5 }
        }
      }
    ],
    gates: [],
    sentries: [],
    tongueAnchors: [
      {
        id: "falls-tongue-anchor",
        label: "Falls Tongue Anchor",
        panelSurfaceId: "anchor-falls-orange-panel",
        position: { x: 2.2, y: 2.5, z: -1.2 },
        landing: { x: 4.2, y: 2.1, z: -0.2 }
      }
    ]
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

  const nextCollected = [...collected].sort((a, b) => a - b);
  const currentCollected = progress.collectedSunflies[level.id];
  if (
    nextCollected.length === currentCollected.length &&
    nextCollected.every((sunflyIndex, index) => sunflyIndex === currentCollected[index])
  ) {
    return progress;
  }

  return {
    ...progress,
    collectedSunflies: {
      ...progress.collectedSunflies,
      [level.id]: nextCollected
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

export const isSentryDetection = (
  sentry: Sentry,
  player: PlayerState,
  camouflagePaint?: PaintColor
): boolean =>
  isInsideBox(player.position, sentry.vision) && camouflagePaint !== sentry.requiredPaint;

export const resetToCheckpoint = (player: PlayerState, sentry: Sentry): PlayerState => ({
  ...player,
  position: { ...sentry.checkpoint },
  velocity: { x: 0, y: 0, z: 0 },
  grounded: false
});

export const isTongueAnchorActive = (
  progress: GameProgress,
  level: LevelDefinition,
  anchor: TongueAnchor
): boolean => {
  const surface = level.paintableSurfaces.find(
    (candidate) => candidate.id === anchor.panelSurfaceId
  );
  if (!surface) return false;
  return progress.paintedSurfaces[surface.id] === surface.requiredPaint;
};

export const useTongueAnchor = (
  progress: GameProgress,
  level: LevelDefinition,
  player: PlayerState,
  anchor: TongueAnchor
): PlayerState => {
  if (!isTongueAnchorActive(progress, level, anchor)) {
    return player;
  }
  return {
    ...player,
    position: { ...anchor.landing },
    velocity: { x: 0, y: 0, z: 0 }
  };
};
