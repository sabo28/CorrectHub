# E2E-Testfälle: Benutzerregistrierung

## Testfall 1 – Positiv: Erfolgreiche Registrierung

**Ziel:** Ein neuer Benutzer registriert sich erfolgreich\
**Erwartung:** Benutzer wird zur Login-Seite weitergeleitet, mit Hinweis zur
E-Mail-Bestätigung

**Schritte:**

1. Benutzer ruft die Registrierungsseite auf
2. Gibt gültige Daten ein:
   - Benutzername: neuerBenutzer123
   - E-Mail: neuer@benutzer.de
   - Passwort: sicheresPasswort123
3. Klickt auf „Registrieren“

**Ergebnis:**

- Weiterleitung zur Login-Seite
- Erfolgsmeldung erscheint:\
  **„Du hast dich erfolgreich registriert! Bitte aktiviere deine
  E-Mail-Adresse.“**

---

## Testfall 2 – Negativ: E-Mail-Adresse bereits registriert

**Ziel:** Benutzer versucht sich mit einer bereits existierenden E-Mail zu
registrieren\
**Erwartung:** Es erscheint eine Fehlermeldung

**Schritte:**

1. Benutzer ruft die Registrierungsseite auf
2. Gibt eine bereits registrierte E-Mail-Adresse ein
3. Klickt auf „Registrieren“

**Ergebnis:**

- Es erscheint eine Fehlermeldung:\
  **„E-Mail Adresse bereits in Verwendung!“**

---

## Testfall 3 – Negativ: Benutzername bereits vergeben

**Ziel:** Benutzer versucht sich mit einem existierenden Benutzernamen zu
registrieren\
**Erwartung:** Es erscheint eine Fehlermeldung

**Schritte:**

1. Benutzer ruft die Registrierungsseite auf
2. Gibt einen bereits existierenden Benutzernamen ein
3. Klickt auf „Registrieren“

**Ergebnis:**

- Es erscheint eine Fehlermeldung:\
  **„Benutzername bereits in Verwendung!“**

---

## Testfall 4 – Negativ: Ungültige E-Mail-Adresse (kein @-Zeichen)

**Ziel:** Benutzer gibt eine ungültige E-Mail-Adresse ohne @-Zeichen ein\
**Erwartung:** Eingabe wird abgewiesen, spezifische Fehlermeldung erscheint

**Schritte:**

1. Benutzer ruft die Registrierungsseite auf
2. Gibt eine E-Mail ohne @ ein: `test`
3. Klickt auf „Registrieren“

**Ergebnis:**

- Es erscheint eine Fehlermeldung:\
  **„Die E-Mail-Adresse muss ein @-Zeichen enthalten. In der Angabe ‚test‘ fehlt
  ein @-Zeichen.“**

---

## Testfall 5 – Negativ: Leere Pflichtfelder

**Ziel:** Benutzer lässt alle Felder leer und versucht die Registrierung\
**Erwartung:** Validierungsfehler werden angezeigt

**Schritte:**

1. Benutzer ruft die Registrierungsseite auf
2. Klickt auf „Registrieren“, ohne ein Feld auszufüllen

**Ergebnis:**

- Es erscheint eine Fehlermeldung:\
  **„Fülle dieses Feld aus.“**
