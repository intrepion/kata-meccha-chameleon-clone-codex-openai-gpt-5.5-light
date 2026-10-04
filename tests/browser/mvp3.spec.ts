import { expect, test } from "@playwright/test";

test("MVP 3 proves sentries, Sunflies, Tongue Anchors, persistence, and all Levels", async ({
  page
}) => {
  await page.goto("/dev.html?test");

  await page.evaluate(() => window.localStorage.clear());
  await expect(page.getByTestId("level")).toHaveText("Training Grove");
  await page.evaluate(() => window.__meccha?.moveToExit());
  await expect(page.getByTestId("level")).toHaveText("Sentry Shrine");

  await page.evaluate(() => window.__meccha?.triggerSentry("shrine-watch"));
  let state = await page.evaluate(() => window.__meccha?.getState());
  expect(state?.sentryAlert).toBe("Shrine Watch");
  expect(state?.player.x).toBe(-8);

  await page.keyboard.press("2");
  await page.evaluate(() => window.__meccha?.triggerSentry("shrine-watch"));
  state = await page.evaluate(() => window.__meccha?.getState());
  expect(state?.sentryAlert).toBe("Clear");

  await page.evaluate(() => window.__meccha?.collectSunfly(0));
  state = await page.evaluate(() => window.__meccha?.getState());
  expect(state?.collectedSunflies).toBe(1);

  await page.evaluate(() => window.__meccha?.moveToExit());
  await expect(page.getByTestId("level")).toHaveText("Anchor Falls");

  await page.evaluate(() =>
    window.__meccha?.paintSurface("anchor-falls-orange-panel", "orange")
  );
  state = await page.evaluate(() => window.__meccha?.getState());
  expect(state?.activeTongueAnchors).toEqual(["falls-tongue-anchor"]);

  await page.evaluate(() => window.__meccha?.useTongueAnchor("falls-tongue-anchor"));
  state = await page.evaluate(() => window.__meccha?.getState());
  expect(state?.player.x).toBeCloseTo(4.2, 1);

  await page.evaluate(() => window.__meccha?.collectSunfly(1));
  await page.evaluate(() => window.__meccha?.moveToExit());

  state = await page.evaluate(() => window.__meccha?.getState());
  expect(state?.completedLevels).toEqual([
    "training-grove",
    "sentry-shrine",
    "anchor-falls"
  ]);

  const saved = await page.evaluate(() => window.localStorage.getItem("meccha-chameleon-progress"));
  expect(saved).toContain("anchor-falls");
});
