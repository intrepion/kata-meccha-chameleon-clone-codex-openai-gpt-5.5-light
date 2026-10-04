import { expect, test } from "@playwright/test";

test("MVP 2 proves paint rules, Gate opening, Grip Surface activation, and HUD updates", async ({
  page
}) => {
  await page.goto("/.vite-entry/index.html?test");

  await expect(page.getByTestId("paint")).toHaveText("Green Grip");

  const initial = await page.evaluate(() => window.__meccha?.getState());
  expect(initial?.gateOpen).toBe(false);
  expect(initial?.activeGripSurfaces).toEqual([]);

  await page.keyboard.press("2");
  await expect(page.getByTestId("paint")).toHaveText("Purple Camouflage");

  await page.keyboard.press("1");
  await page.evaluate(() =>
    window.__meccha?.paintSurface("training-grove-green-switch", "green")
  );

  await expect(page.getByTestId("message")).toContainText("Green gate switch painted Green Grip");

  await page.evaluate(() =>
    window.__meccha?.paintSurface("training-grove-grip-panel", "green")
  );

  const painted = await page.evaluate(() => window.__meccha?.getState());
  expect(painted?.gateOpen).toBe(true);
  expect(painted?.activeGripSurfaces).toEqual(["training-grove-grip-panel"]);
  await expect(page.getByTestId("paint")).toHaveText("Green Grip");
});
