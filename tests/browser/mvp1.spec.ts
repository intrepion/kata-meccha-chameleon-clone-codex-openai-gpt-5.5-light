import { expect, test } from "@playwright/test";

test("MVP 1 completes Training Grove through the browser path", async ({ page }) => {
  await page.goto("/app.html?test");

  await expect(page.getByTestId("level")).toHaveText("Training Grove");
  await expect(page.getByTestId("goal")).toHaveText("Reach the sunlit exit");
  await expect(page.locator("canvas")).toBeVisible();

  const before = await page.evaluate(() => window.__meccha?.getState());
  expect(before?.levelId).toBe("training-grove");

  await page.keyboard.down("w");
  await page.waitForTimeout(300);
  await page.keyboard.up("w");
  await page.keyboard.press("Space");
  await page.keyboard.down("e");
  await page.waitForTimeout(150);
  await page.keyboard.up("e");

  const afterMovement = await page.evaluate(() => window.__meccha?.getState());
  expect(afterMovement?.player.z).toBeLessThan(before?.player.z ?? 0);

  await page.evaluate(() => window.__meccha?.moveToExit());

  await expect(page.getByTestId("level")).toHaveText("Sentry Shrine");
  await expect(page.getByTestId("progress")).toHaveText("1 / 3 Levels");
});
