# IU Gruppenarbeit: CorrectHub

**CorrectHub** ist ein webbasiertes Korrekturmanagementsystem, das es Studierenden und Lehrenden ermöglicht, Feedback, Anmerkungen und Verbesserungsvorschläge für studentische Arbeiten systematisch zu erfassen und nachzuverfolgen.

---

### 🎯 Für Recruiter: Kontext & Mein Beitrag

Dieses Repository enthält den finalen Source Code meines Hochschul-Gruppenprojekts, das mit der Note 1,0 bewertet wurde. Das ursprüngliche Entwicklungs-Repository mit der vollständigen Commit- und Pull-Request-Historie ist privat und im Besitz der Projektleitung.

In diesem Projekt war ich **maßgeblich für die Entwicklung des Backends sowie für die Erstellung des Frontend-Prototypen** verantwortlich.

**Meine Kernbeiträge umfassten:**

* **Backend-Entwicklung (Deno, TypeScript):**
    * Konzeption und Implementierung der REST-API zur Verwaltung von Nutzern, Einreichungen und Feedback.
    * Design des Datenbankschemas und Umsetzung der Datenbankmigrationen mit Drizzle ORM.
    * Implementierung der Geschäftslogik nach den Prinzipien des Domain-Driven Design (DDD).
* **Frontend-Prototyping (Fresh):**
    * Aufbau der grundlegenden UI-Komponenten und Seitenstruktur.
    * Sicherstellung der serverseitigen Renderings (SSR) für eine performante Nutzererfahrung.
* **DevOps & Testing:**
    * Einrichtung der Testumgebung für Unit- und Integrationstests (`deno test`).
    * Konfiguration der CI/CD-Pipeline über GitHub Actions für automatisierte Deployments auf Deno Deploy.

### 🏛️ Architektur & Technologie-Stack

Wir haben uns für einen modernen, auf Deno basierenden Tech-Stack entschieden, um von nativer TypeScript-Unterstützung, hoher Sicherheit und exzellenter Performance zu profitieren.

* **Runtime:** [Deno][1]
* **Webframework:** [Fresh][2] (Server-Side Rendering, Islands Architecture)
* **Datenbank & ORM:** PostgreSQL (via [Docker][3]) & [Drizzle ORM][12]
* **Testing:** [Deno Test][8], [Playwright][11] (E2E)
* **Deployment:** [Deno Deploy][13] (via GitHub Actions CI/CD)

---

<details>
<summary>💻 Technische Dokumentation (Quick Start, Tests & mehr)</summary>

### 🚀 Quick Start

> [!note] Stelle sicher, dass alle [Voraussetzungen](#vorbereitung) erfüllt
> sind.

1.  `make` im Terminal ausführen
2.  http://localhost:8000 im Browser aufrufen

### Vorbereitung

Folgende Tools werden benötigt

- [Docker][3] (z.B. Docker for Desktop)
- [deno][1] (zur aktiven Entwicklung)
- [Node.js][4] (erforderlich für die Durchführung von E2E Tests)
- [git][5] (optional zur aktiven Entwicklung)
- [make][6] (unter Windows z.B. über WSL oder GnuWin32)

### Entwicklungsumgebung

Dieses Projekt ist optimiert für [Visual Studio Code][7]. Bereits integriert
sind:

- [Linting][8]
- [Formatierung][9] als auch
- [Type Checking][10] und
- Hot Reloading

## Starten der Entwicklungsumgebung

```shell
make
```

Dies startet das Projekt per Docker Compose im Entwicklungsmodus. Änderungen am
Code werden automatisch geladen (Hot Reloading). Die Anwendung ist anschließend
erreichbar unter:

http://localhost:8000

> [!note] `make` entspricht dem Befehl `make start`, der wiederum
> `docker compose up` ausführt.

## Clean Start

Wenn du die Anwendung mit einem leeren Zustand starten möchtest, führe folgendes
aus:

```shell
make clean start
```

Dies stoppt und entfernt bestehende Container und startet das Projekt von Grund
auf neu.

## Unit- und Integrationstests

Automatisierte Tests können wie folgt ausgeführt werden:

```shell
make test
```

Dieser Befehl führt sowohl Linting (`deno lint`), Type Checking (`deno check`)
als auch die eigentlichen Tests (`deno test`) aus.

### Testabdeckung

Um die Testabdeckung zu ermitteln, verwende:

```shell
make test-coverage
```

Die Coverage-Daten werden dann im Verzeichnis `coverage` abgelegt.

## End-to-End (E2E) Tests

Für End-to-End-Tests wird [Playwright][11] verwendet.

```shell
make e2e
```

> [!warning] Hier wird die bestehen Umgebung gelöscht und neu gestartet
> (`make clean`), bevor die Tests ausgeführt werden.

## Datenbankmigrationen

Datenbank-Migrationen erfolgen mit [Drizzle ORM][12]. Um neue Migrationen zu
generieren:

```
make sql NAME=migrations_name
```

## Deployment

Für das Hosting kommt [Deno Deploy][13] zum Einsatz – eine serverlose Plattform
speziell für Deno-Projekte.

Das Deployment erfolgt in 2 Ebenen:

### 1. Staging-System

Sobald ein neuer Pull Request (PR) auf GitHub erstellt wird, wird automatisch
ein Deployment in der Staging-Umgebung durchgeführt. So können Änderungen vor
dem Merge in einer realitätsnahen Umgebung getestet und überprüft werden.

> [!tip] Die Staging-URL wird direkt im jeweiligen PR angezeigt.

### 2. Live-System

Sobald ein Pull Request in den main-Branch gemerged wird, erfolgt automatisch
das Deployment auf die Produktionsumgebung. Dabei wird die Anwendung über Deno
Deploy aktualisiert und unter der Live-URL bereitgestellt.
</details>

[1]: https://deno.com/
[2]: https://fresh.deno.dev/
[3]: https://www.docker.com/
[4]: https://nodejs.org/
[5]: https://git-scm.com/
[6]: https://www.gnu.org/software/make/
[7]: https://code.visualstudio.com/
[8]: https://docs.deno.com/runtime/reference/cli/lint/
[9]: https://docs.deno.com/runtime/reference/cli/fmt/
[10]: https://docs.deno.com/runtime/reference/cli/check/
[11]: https://playwright.dev/
[12]: https://orm.drizzle.team/
[13]: https://deno.com/deploy
