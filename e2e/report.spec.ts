import { expect, test } from "@playwright/test";

// testcases/e2e-meldung-erstellen.md - Testfall 1
test("Positiv: Erfolgreiches Erstellen einer Meldung", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading")).toContainText("Login");

  // Login
  await page.getByRole("textbox", { name: "E‑Mail oder Benutzername" }).fill(
    "member",
  );
  await page.getByRole("textbox", { name: "Passwort" }).fill("member");
  await page.getByRole("button", { name: "Login" }).click();

  // Dashboard
  await expect(page.getByRole("heading")).toContainText(
    "Willkommen im Dashboard",
  );
  await expect(page.locator("td")).toContainText("Keine Meldungen gefunden.");

  // Create Report
  await page.getByRole("link", { name: "Meldung erstellen" }).click();
  await page.getByLabel("Kategorie").selectOption("IMPROVEMENT_SUGGESTION");
  await page.getByRole("textbox", { name: "Titel" }).fill("Testmeldung");
  await page.getByRole("textbox", { name: "Beschreibung" }).fill(
    "Ein Verbesserungsvorschlag",
  );
  await page.getByRole("textbox", { name: "Links" }).fill("http://example.org");
  await page.getByRole("button", { name: "Meldung erstellen" }).click();

  // Report Detail Page
  await expect(page.locator("h1")).toContainText("Testmeldung");
  await expect(page.getByRole("paragraph").filter({ hasText: "Titel" }))
    .toBeVisible();
  await expect(page.getByText("Neu", { exact: true })).toBeVisible();
  await expect(page.getByRole("main")).toContainText("Neu");
  await expect(page.getByRole("listitem")).toContainText("http://example.org/");

  await page.getByRole("link", { name: "Logout" }).click();
});

// testcases/e2e-meldung-erstellen.md - Testfall 2
test("Negativ: Fehler bei fehlender Beschreibung", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading")).toContainText("Login");

  // Login
  await page.getByRole("textbox", { name: "E‑Mail oder Benutzername" }).fill(
    "member",
  );
  await page.getByRole("textbox", { name: "Passwort" }).fill("member");
  await page.getByRole("button", { name: "Login" }).click();

  // Dashboard
  await expect(page.getByRole("heading")).toContainText(
    "Willkommen im Dashboard",
  );

  // Create Report
  await page.getByRole("link", { name: "Meldung erstellen" }).click();
  await page.getByRole("textbox", { name: "Titel" }).fill("Testmeldung");
  // Missing description
  await page.getByRole("button", { name: "Meldung erstellen" }).click();

  // Remaining on New Report page
  await expect(page.locator("h1")).toContainText("Meldung erstellen");
  await expect(page.locator("textarea[name=description][required]:invalid"))
    .toBeAttached();

  await page.getByRole("link", { name: "Logout" }).click();
});

// testcases/e2e-meldung-erstellen.md - Testfall 3
test("Positiv: Bearbeitung einer Meldung", async ({ page }) => {
  await page.goto("/login");
  // Login
  await page.getByRole("textbox", { name: "E‑Mail oder Benutzername" }).fill(
    "member",
  );
  await page.getByRole("textbox", { name: "Passwort" }).fill("member");
  await page.getByRole("button", { name: "Login" }).click();

  // Go to detail page
  await page.getByRole("link", { name: "Testmeldung" }).click();

  // Edit report
  await page.getByRole("link", { name: "Bearbeiten" }).click();
  await page.getByLabel("Kategorie").selectOption("CONTENT_ERROR");
  await page.getByRole("textbox", { name: "Titel" }).fill(
    "Testmeldung (bearbeitet)",
  );
  await page.getByRole("textbox", { name: "Beschreibung" }).fill(
    "Ein Verbesserungsvorschlag (bearbeitet)",
  );
  await page.getByRole("textbox", { name: "Links" }).fill("");
  await page.getByRole("button", { name: "Meldung speichern" }).click();

  // Check updated report
  await expect(page.locator("h1")).toContainText("Testmeldung (bearbeitet)");
  await expect(page.getByRole("main")).toContainText("Inhaltlicher Fehler");

  // Create comment
  await page.getByRole("textbox", { name: "Neuer Kommentar" }).fill(
    "Ich bin nicht anonym",
  );
  await page.getByRole("button", { name: "Kommentar absenden" }).click();
  await expect(page.getByRole("listitem")).toContainText(
    "Ich bin nicht anonym",
  );
  await expect(page.getByRole("listitem")).toContainText("member");

  // Check history
  await page.getByText("Verlauf").click();
  await expect(page.getByRole("main")).toContainText(
    "member hat diese Meldung erstellt",
  );
  await expect(page.getByRole("main")).toContainText(
    "member hat diese Meldung bearbeitet",
  );
});

// testcases/e2e-meldung-erstellen.md - Testfall 4
test("Positiv: Änderung des Status", async ({ page }) => {
  await page.goto("/login");

  await page.getByRole("textbox", { name: "E‑Mail oder Benutzername" }).fill(
    "tutor",
  );
  await page.getByRole("textbox", { name: "Passwort" }).fill("tutor");
  await page.getByRole("button", { name: "Login" }).click();

  await page.getByRole("link", { name: "Details für die Meldung" }).click();
  await page.getByRole("combobox").selectOption("IN_PROGRESS");

  await expect(page.locator("select[name=status][disabled]")).not.toBeVisible();

  await page.getByText("Verlauf").click();
  await expect(page.getByRole("main")).toContainText(
    "tutor hat den Status auf In Arbeit geändert",
  );

  await page.getByRole("link", { name: "Logout" }).click();
});
