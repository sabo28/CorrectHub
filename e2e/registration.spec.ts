import { expect, test } from "@playwright/test";

// testcases/e2e-registrieren-benutzer.md - Testfall 1
test("Positiv: Erfolgreiche Registrierung", async ({ page }) => {
  await page.goto("/login");

  await page.getByRole("link", { name: "Registrieren" }).click();
  await page.getByRole("textbox", { name: "Benutzername" }).fill(
    "neuerBenutzer123",
  );
  await page.getByRole("textbox", { name: "E-Mail" }).fill("neuer@benutzer.de");
  await page.getByRole("textbox", { name: "Passwort" }).fill(
    "sicheresPasswort123",
  );

  await page.getByRole("button", { name: "Registrieren" }).click();

  await expect(page.locator("form")).toContainText(
    "Du hast dich erfolgreich registriert!Bitte aktiviere deine E-Mail Addresse",
  );
});

// testcases/e2e-registrieren-benutzer.md - Testfall 2
test("Negativ: E-Mail-Adresse bereits registriert", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("link", { name: "Registrieren" }).click();
  await page.getByRole("textbox", { name: "Benutzername" }).fill(
    "Testbenutzer",
  );
  await page.getByRole("textbox", { name: "E-Mail" }).fill(
    "lumio+iu-member@lumio.at",
  );
  await page.getByRole("textbox", { name: "Passwort" }).fill("member");
  await page.getByRole("button", { name: "Registrieren" }).click();
  await expect(page.locator("form")).toContainText(
    "E-Mail Adresse bereits in Verwendung!",
  );
});

// testcases/e2e-registrieren-benutzer.md - Testfall 3
test("Negativ: Benutzername bereits vergeben", async ({ page }) => {
  await page.goto("/register");

  await page.getByRole("textbox", { name: "Benutzername" }).fill("member");
  await page.getByRole("textbox", { name: "E-Mail" }).fill("foobar@bar.com");
  await page.getByRole("textbox", { name: "Passwort" }).fill("test");
  await page.getByRole("button", { name: "Registrieren" }).click();

  await expect(page.locator("form")).toContainText(
    "Benutzername bereits in Verwendung!",
  );
});

// testcases/e2e-registrieren-benutzer.md - Testfall 4
test("Negativ: Ungültige E-Mail-Adresse (kein @-Zeichen)", async ({ page }) => {
  await page.goto("/register");

  await page.getByRole("textbox", { name: "Benutzername" }).fill(
    "Testbenutzer",
  );
  await page.getByRole("textbox", { name: "E-Mail" }).fill("foobar");
  await page.getByRole("textbox", { name: "Passwort" }).fill("foobar");

  await page.getByRole("button", { name: "Registrieren" }).click();

  await expect(page.locator("input[name=email][required]:invalid"))
    .toBeAttached();
  await expect(page.getByRole("heading")).toContainText("Registrierung");
});

// testcases/e2e-registrieren-benutzer.md - Testfall 5
test("Negativ: Leere Pflichtfelder", async ({ page }) => {
  await page.goto("/register");

  await page.getByRole("button", { name: "Registrieren" }).click();

  await expect(page.locator("input[name=username][required]:invalid"))
    .toBeAttached();
  await expect(page.locator("input[name=email][required]:invalid"))
    .toBeAttached();
  await expect(page.locator("input[name=password][required]:invalid"))
    .toBeAttached();

  await expect(page.getByRole("heading")).toContainText("Registrierung");
});

// testcases/e2e-login-benutzer.md - Testfall 6
test("Negativ: Account noch nicht aktiviert (E-Mail nicht bestätigt)", async ({ page }) => {
  const username = "TestbenutzerUnbestEmail";
  const email = "unbestaetigt@example.com";
  const password = "foobar";

  await page.goto("/register");

  await page.getByRole("textbox", { name: "Benutzername" }).fill(username);
  await page.getByRole("textbox", { name: "E-Mail" }).fill(email);
  await page.getByRole("textbox", { name: "Passwort" }).fill(password);
  await page.getByRole("button", { name: "Registrieren" }).click();

  await expect(page.locator("form")).toContainText(
    "Bitte aktiviere deine E-Mail Addresse",
  );

  await expect(page.getByRole("heading")).toContainText("Login");
  await page.getByRole("textbox", { name: "E‑Mail oder Benutzername" }).fill(
    username,
  );
  await page.getByRole("textbox", { name: "Passwort" }).fill(password);
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.locator("form")).toContainText(
    "Benutzername/E-Mail oder Passwort falsch!",
  );

  // Login as admin
  await page.getByRole("textbox", { name: "E‑Mail oder Benutzername" }).fill(
    "admin",
  );
  await page.getByRole("textbox", { name: "Passwort" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();

  // Check user table
  await page.getByRole("link", { name: "Benutzerverwaltung" }).click();
  await expect(page.locator("tbody")).toContainText(username);
  await expect(page.locator("tbody")).toContainText(email);
});
