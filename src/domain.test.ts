import { describe, expect, it } from "vitest";
import {
  collectSunfly,
  completeLevel,
  createPlayer,
  createProgress,
  isGateOpen,
  isGripSurfaceActive,
  levels,
  paintSurface
} from "./domain";

describe("Meccha Chameleon domain", () => {
  it("completes Training Grove when the Chameleon reaches the Exit", () => {
    const level = levels["training-grove"];
    const player = createPlayer(level);
    const progress = createProgress(level.id);

    player.position = { ...level.exit.center };

    expect(completeLevel(progress, level, player)).toMatchObject({
      levelId: "sentry-shrine",
      completedLevels: ["training-grove"]
    });
  });

  it("does not complete a Level before the Chameleon reaches the Exit", () => {
    const level = levels["training-grove"];
    const player = createPlayer(level);
    const progress = createProgress(level.id);

    expect(completeLevel(progress, level, player)).toEqual(progress);
  });

  it("collects a Sunfly once when the Chameleon reaches it", () => {
    const level = levels["sentry-shrine"];
    const player = createPlayer(level);
    const progress = createProgress(level.id);

    player.position = { ...level.sunflies[1] };

    const withSunfly = collectSunfly(progress, level, player);
    expect(withSunfly.collectedSunflies["sentry-shrine"]).toEqual([1]);
    expect(collectSunfly(withSunfly, level, player)).toEqual(withSunfly);
  });

  it("opens a Gate when its Paintable Surface receives the required Paint", () => {
    const level = levels["training-grove"];
    const gate = level.gates[0];
    const switchSurface = level.paintableSurfaces.find(
      (surface) => surface.id === gate.switchSurfaceId
    );

    if (!switchSurface) throw new Error("Missing switch surface");

    const progress = createProgress(level.id);
    expect(isGateOpen(progress, level, gate)).toBe(false);

    const painted = paintSurface(progress, switchSurface, "green");
    expect(isGateOpen(painted, level, gate)).toBe(true);
  });

  it("activates a Grip Surface when it is painted Green", () => {
    const level = levels["training-grove"];
    const gripSurface = level.paintableSurfaces.find((surface) => surface.kind === "grip-panel");

    if (!gripSurface) throw new Error("Missing grip surface");

    const progress = createProgress(level.id);
    expect(isGripSurfaceActive(progress, gripSurface)).toBe(false);

    const painted = paintSurface(progress, gripSurface, "green");
    expect(isGripSurfaceActive(painted, gripSurface)).toBe(true);
  });
});
