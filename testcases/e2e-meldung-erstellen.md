# E2E-Testfälle: Meldung erstellen

## Testfall 1 – Positiv: Erfolgreiches Erstellen einer Meldung

**Ziel:** Benutzer erstellt eine neue Meldung mit vollständigem Formular\
**Erwartung:** Meldung wird gespeichert und angezeigt

**Schritte:**

1. Benutzer loggt sich ein
2. Klick auf "Meldung erstellen"
3. Formular ausfüllen
4. Klick auf "Speichern"
5. Anzeige der Detailseite

**Ergebnis:** Meldung erfolgreich gespeichert, Detailseite sichtbar

---

## Testfall 2 – Negativ: Fehler bei fehlender Beschreibung

**Ziel:** Benutzer lässt die Beschreibung leer\
**Erwartung:** Fehlerhinweis, Meldung wird nicht gespeichert

**Schritte:**

1. Benutzer loggt sich ein
2. Klick auf "Meldung erstellen"
3. Nur Titel eingeben, Beschreibung leer lassen
4. Klick auf "Meldung erstellen"

**Ergebnis:** Fehlerhinweis „Fülle dieses Feld aus“, kein Speichern möglich

## Testfall 3 - Positiv: Bearbeitung einer Meldung

**Ziel:** Benutzer bearbeitet eine bestehende Meldung mit vollständigem
Formular\
**Erwartung:** Meldung wird gespeichert und angezeigt

**Schritte:**

1. Benutzer loggt sich ein
2. Klick auf "Meldung erstellen"
3. Formular ausfüllen
4. Klick auf "Speichern"
5. Anzeige der Detailseite
6. Klick auf "Bearbeiten"
7. Änderung der Beschreibung
8. Klick auf "Speichern"
9. Anzeige der Detailseite

**Ergebnis:**

- Änderungen erfolgreich gespeichert
- Detailseite sichtbar
- neuer Eintrag im Verlauf

## Testfall 4 - Positiv: Änderung des Status

**Ziel:** Tutor ändert den Status einer Meldung\
**Erwartung:** Meldung speichert neuen Status

**Schritte:**

1. Tutor loggt sich ein
2. Klick auf bestehende Meldung
3. Klick auf Status Drop-down
4. Anzeige der Detailseite

**Ergebnis:**

- Status erfolgreich gespeichert
- Detailseite sichtbar
- neuer Eintrag im Verlauf
