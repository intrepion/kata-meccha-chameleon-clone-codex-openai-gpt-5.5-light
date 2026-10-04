import { expect, test, type Page } from "@playwright/test";

const pressForMovement = async (page: Page, key: string) => {
  const before = await page.evaluate(() => window.__meccha?.getState());
  await page.keyboard.down(key);
  await page.waitForTimeout(220);
  await page.keyboard.up(key);
  const after = await page.evaluate(() => window.__meccha?.getState());
  if (!before || !after) throw new Error("Missing Meccha test state");
  return { before, after };
};

test("WASD movement maps to screen axes and Chameleon faces travel direction", async ({ page }) => {
  await page.goto("/.vite-entry/index.html?test");

  let movement = await pressForMovement(page, "w");
  expect(movement.after.player.z).toBeGreaterThan(movement.before.player.z);
  expect(movement.after.facingForward.z).toBeGreaterThan(0.95);

  movement = await pressForMovement(page, "d");
  expect(movement.after.player.x).toBeLessThan(movement.before.player.x);
  expect(movement.after.facingForward.x).toBeLessThan(-0.95);

  movement = await pressForMovement(page, "s");
  expect(movement.after.player.z).toBeLessThan(movement.before.player.z);
  expect(movement.after.facingForward.z).toBeLessThan(-0.95);

  movement = await pressForMovement(page, "a");
  expect(movement.after.player.x).toBeGreaterThan(movement.before.player.x);
  expect(movement.after.facingForward.x).toBeGreaterThan(0.95);
});
