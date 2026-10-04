import { describe, expect, it } from "vitest";
import {
  collectSunfly,
  completeLevel,
  createPlayer,
  createProgress,
  levels
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
});
