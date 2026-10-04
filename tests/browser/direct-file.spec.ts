import { expect, test } from "@playwright/test";
import { pathToFileURL } from "node:url";

for (const fileName of ["index.html", "app.html", "dev.html"]) {
test(`${fileName} launches from file protocol without Vite module CORS failures`, async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(pathToFileURL(`${process.cwd()}/${fileName}`).toString());

  await expect(page.getByTestId("level")).toHaveText("Training Grove");
  await expect(page.locator("canvas")).toBeVisible();

  expect(errors.join("\n")).not.toMatch(/CORS policy|Failed to load resource|main\.ts/);

  const state = await page.evaluate(() => window.__meccha?.getState());
  expect(state?.levelId).toBe("training-grove");
});
}
