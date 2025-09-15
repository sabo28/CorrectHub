import { expect, test } from "@playwright/test";

// testcases/e2e-login-benutzer.md - Testfall 1
test("Positiv: Login mit Benutzername", async ({ page }) => {
  await page.goto("/login");

  await page.getByRole("textbox", { name: "E‑Mail oder Benutzername" }).fill(
    "member",
  );
  await page.getByRole("textbox", { name: "Passwort" }).fill("member");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByRole("heading")).toContainText(
    "Willkommen im Dashboard",
  );

  await page.getByRole("link", { name: "Logout" }).click();
});

// testcases/e2e-login-benutzer.md - Testfall 2
test("Positiv: Login mit E-Mail-Adresse", async ({ page }) => {
  await page.goto("/login");

  await page.getByRole("textbox", { name: "E‑Mail oder Benutzername" }).fill(
    "lumio+iu-member@lumio.at",
  );
  await page.getByRole("textbox", { name: "Passwort" }).fill("member");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByRole("heading")).toContainText(
    "Willkommen im Dashboard",
  );

  await page.getByRole("link", { name: "Logout" }).click();
});

// testcases/e2e-login-benutzer.md - Testfall 3
test("Negativ: Falscher Benutzername", async ({ page }) => {
  await page.goto("/login");

  await page.getByRole("textbox", { name: "E‑Mail oder Benutzername" }).fill(
    "member1",
  );
  await page.getByRole("textbox", { name: "Passwort" }).fill("member");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.locator("form")).toContainText(
    "Benutzername/E-Mail oder Passwort falsch!",
  );
});

// testcases/e2e-login-benutzer.md - Testfall 4
test("Negativ: Falsche E-Mail-Adresse", async ({ page }) => {
  await page.goto("/login");

  await page.getByRole("textbox", { name: "E‑Mail oder Benutzername" }).fill(
    "foo@bar.com",
  );
  await page.getByRole("textbox", { name: "Passwort" }).fill("member");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.locator("form")).toContainText(
    "Benutzername/E-Mail oder Passwort falsch!",
  );
});

// testcases/e2e-login-benutzer.md - Testfall 5
test("Negativ: Falsches Passwort", async ({ page }) => {
  await page.goto("/login");

  await page.getByRole("textbox", { name: "E‑Mail oder Benutzername" }).fill(
    "foo@bar.com",
  );
  await page.getByRole("textbox", { name: "Passwort" }).fill("member");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.locator("form")).toContainText(
    "Benutzername/E-Mail oder Passwort falsch!",
  );
});
