# E2E-Testfälle: Benutzer-Login

## Testfall 1 – Positiv: Login mit Benutzername

**Ziel:** Benutzer loggt sich mit gültigem Benutzernamen und Passwort ein\
**Erwartung:** Weiterleitung zum Dashboard

**Schritte:**

1. Benutzer ruft die Login-Seite auf
2. Gibt gültigen Benutzernamen und korrektes Passwort ein
3. Klickt auf „Login“

**Ergebnis:**

- Benutzer wird eingeloggt
- Weiterleitung zum Dashboard erfolgt

---

## Testfall 2 – Positiv: Login mit E-Mail-Adresse

**Ziel:** Benutzer loggt sich mit gültiger E-Mail-Adresse und Passwort ein\
**Erwartung:** Weiterleitung zum Dashboard

**Schritte:**

1. Benutzer ruft die Login-Seite auf
2. Gibt gültige E-Mail-Adresse und korrektes Passwort ein
3. Klickt auf „Login“

**Ergebnis:**

- Benutzer wird eingeloggt
- Weiterleitung zum Dashboard erfolgt

---

## Testfall 3 – Negativ: Falscher Benutzername

**Ziel:** Benutzer gibt einen ungültigen Benutzernamen ein\
**Erwartung:** Login schlägt fehl, Fehlermeldung erscheint

**Schritte:**

1. Benutzer ruft die Login-Seite auf
2. Gibt einen nicht existierenden Benutzernamen und ein Passwort ein
3. Klickt auf „Login“

**Ergebnis:**

- Fehlermeldung wird angezeigt:\
  **„Benutzername/E-Mail oder Passwort falsch!“**
- Keine Weiterleitung zum Dashboard

---

## Testfall 4 – Negativ: Falsche E-Mail-Adresse

**Ziel:** Benutzer gibt eine nicht registrierte E-Mail-Adresse ein\
**Erwartung:** Login schlägt fehl, Fehlermeldung erscheint

**Schritte:**

1. Benutzer ruft die Login-Seite auf
2. Gibt eine falsche E-Mail-Adresse und ein korrektes Passwort ein
3. Klickt auf „Login“

**Ergebnis:**

- Fehlermeldung wird angezeigt:\
  **„Benutzername/E-Mail oder Passwort falsch!“**
- Keine Weiterleitung zum Dashboard

---

## Testfall 5 – Negativ: Falsches Passwort

**Ziel:** Benutzer gibt ein falsches Passwort ein\
**Erwartung:** Login schlägt fehl, Fehlermeldung erscheint

**Schritte:**

1. Benutzer ruft die Login-Seite auf
2. Gibt gültigen Benutzernamen oder E-Mail-Adresse ein
3. Gibt falsches Passwort ein
4. Klickt auf „Login“

**Ergebnis:**

- Fehlermeldung wird angezeigt:\
  **„Benutzername/E-Mail oder Passwort falsch!“**
- Keine Weiterleitung zum Dashboard

---

## Testfall 6 – Negativ: Account noch nicht aktiviert (E-Mail nicht bestätigt)

**Ziel:** Benutzer versucht sich einzuloggen, ohne seine E-Mail-Adresse
bestätigt zu haben\
**Erwartung:** Login schlägt fehl, allgemeine Fehlermeldung erscheint

**Schritte:**

1. Benutzer registriert sich, aber aktiviert den Account nicht über den
   E-Mail-Link
2. Ruft Login-Seite auf
3. Gibt gültige Zugangsdaten ein
4. Klickt auf „Login“

**Ergebnis:**

- Fehlermeldung wird angezeigt:\
  **„Benutzername/E-Mail oder Passwort falsch!“**
- Keine Weiterleitung zum Dashboard
