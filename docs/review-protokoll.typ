#import "template-review-protokoll.typ": *

#show: project.with(
  title: [CorrectHub],
  paper_type: "Review-Protokoll",
  authors: (
    (
      name: "Benjamin Falk",
      role: "Projektleitung",
      matriculation_number: "31912112",
      study_program: text(hyphenate: false, [Wirtschafts-?informatik (B.Sc.)]),
    ),
    (
      name: "Labeeb Malik",
      role: "Mitglied 2",
      matriculation_number: "32107067",
      study_program: "Informatik (B.Sc.)",
    ),
    (
      name: "Antony Cherukattu",
      role: "Mitglied 3",
      matriculation_number: "92006671",
      study_program: "Informatik (B.Sc.)",
    ),
  ),
  module_name: [Projekt: Software Engineering (ISEF01)],
  tutor_name: [Tobias Brückmann],
)

= Review-Protokoll

== Ziel des Reviews
Ziel war die abschließende Qualitätssicherung sämtlicher zentraler Artefakte.  
Im Fokus standen 87 Pull Requests mit Änderungen an Code, Dokumentation und weiteren Projektbestandteilen.  
Die Überprüfung erfolgte über GitHub mittels PR-Reviews, Kommentaren sowie konkreten Verbesserungsvorschlägen.

== Beispielhafter Review-Kommentar
Im folgendem Beispiel (siehe Abbildung 1) wurde ein Vorschlag zur Umbenennung einer Bezeichnung gemacht. Dabei werden im Review-Protokoll automatisch der Name des Reviewers sowie Datum und Uhrzeit des Kommentars angegeben. Daraufhin gab der Autor eine kurze Rückmeldung, erklärte die anfänglichen Importprobleme und bestätigte, dass die Anpassung inzwischen erfolgreich umgesetzt wurde. Auch hier wird beim Kommentar der Name des Autors sowie der genaue Zeitpunkt der Antwort erfasst. Abschließend bestätigte der Reviewer die Änderung, ebenfalls mit Angabe von Name, Datum und Uhrzeit, womit die Konversation abgeschlossen werden konnte. Im Falle eines Fehlers kann ein Review jederzeit wieder als unresolved markiert werden, wodurch ein Merge des Pull Requests blockiert wird. Ein Merge ist erst dann möglich, wenn alle Reviews als resolved beziehungsweise abgeschlossen markiert sind.

#figure(
  image("images/review-example.jpg", width: 100%),
  caption: [
    Beispielhafter Review-Verlauf in GitHub
  ],
)

= Übersicht aller überprüften Pull Requests
Alle 87 Pull Requests wurden im Hinblick auf Funktionalität, Struktur, Verständlichkeit, Testbarkeit und Dokumentation geprüft.  
Identifizierte Punkte wurden im Review-Prozess adressiert und zeitnah umgesetzt.

#table(
  columns: 4,
  table.header([*PR-Nummer*], [*Titel*], [*Status*], [*Bemerkung*]),
  [#1], [workflow suggestion], [Merged], [Erster Vorschlag für den Entwicklungsprozess wurde übernommen],
  [#2], [feat: IU5155 set up dev environment], [Merged], [Konfigurationsdateien für make-Befehl hinzugefügt und ungenutzte Dokumentationsdateien entfernt],
  [#3], [feat: #4994 basic domain structure], [Closed], [Experimentelles Arbeiten am Domain Model, nicht gemerged],
  [#4], [feat: #4993 Further config adaptations and settings], [Merged], [Weitere Konfigurationsanpassungen und erste Implementierung von Result und Option vorgenommen],
  [#5], [feat: #5000 implement user registration through domain], [Merged], [Implementierung der User-Registrierung über den Domain-Service inklusive Testanleitung],
  [#6], [feat: #5000-frontend implement register route and simple register form (prototype)], [Merged], [Registrierungsroute und einfaches Registrierungsformular implementiert, nodeModulesDir-Einstellung angepasst und unnötige Demo-Dateien entfernt],
  [#7], [add todo for docker-compose], [Closed], [Test-PR ohne relevante Änderungen, nicht gemerged],
  [#8], [feat: #4999-implement user login functionality and related error handling], [Merged], [Implementierung der User-Login-Funktionalität und zugehörigem Error Handling, erste Tests ergänzt],
  [#9], [IU5189: Persistence layer with PostgreSQL], [Merged], [Einrichtung der Datenbankverbindung und Migration mit PostgreSQL, User Repository implementiert],
  [#10], [#5197 rename user name], [Merged], [Umbenennung von user.name zu user.username durchgeführt],
  [#11], [feat: #5190 streamlined input and output validation], [Merged], [Validierung der Benutzereingaben für den Register-Handler implementiert und z.ZodError zur Fehlerausgabe hinzugefügt],
  [#12], [chore: #5201 automatic type checks], [Merged], [Automatische Typüberprüfung in der CI eingerichtet, um fehlerhafte Types zu vermeiden],
  [#13], [chore: #5202 automatic formatting], [Merged], [Neuen Format-Check für CI hinzugefügt und bestehende Dateien formatiert],
  [#14], [bugfix: IU5193 empty request body leads to internal server error], [Merged], [Verbessertes Error Handling für ungültige Benutzereingaben implementiert und Unit-Tests ergänzt],
  [#15], [feat: IU5191 email verification flow], [Merged], [Implementierung des E-Mail-Verifizierungsprozesses mit Template, Verifikationslink, Event-Anpassung und Integrationstests],
  [#16], [feat: IU5195 implement session domain object and set cookies for login], [Merged], [Session-Domain-Objekt implementiert, Cookie-Handling ergänzt, Unit-Test hinzugefügt und Lint-Fehler behoben],
  [#17], [feat: IU5206 deno deploy config], [Merged], [Konfiguration für Deno Deploy erstellt, inklusive Datenbank-Branching für Tests und Produktionsdatenbank-Setup],
  [#18], [Frontend], [Closed], [Neues Interface für die Register- und Login-Seite erstellt, PR wurde versehentlich geschlossen],
  [#19], [feat: IU4999 & IU5000 login and registration UI], [Merged], [Designänderungen an Login- und Registrierungsseite durchgeführt, Favicon und Logo hinzugefügt],
  [#20], [feat: IU5196 & IU5199 & IU5200 implement backend functionality for reports & report form & attachment], [Merged], [Backend-Funktionalität für Reports inklusive Report-Domain, Service, API-Endpunkt und Repository implementiert sowie Frontend-Formular für Reports mit Anhängen erstellt],
  [#21], [feat: IU5204 username must be unique], [Merged], [Fehlerbehandlung hinzugefügt, wenn ein Benutzername bereits existiert, inklusive neuer Fehlermeldung],
  [#22], [fix: IU5290 split up CI workflows for deployment], [Merged], [Deployment-Workflow in zwei separate Workflows aufgeteilt, um parallele Ausführung zu verbessern],
  [#23], [fix: IU5290 split up CI workflows for deployment], [Merged], [Abbruchfunktion vorerst entfernt, Ergänzung zu PR #22],
  [#24], [fix: IU5290 split up CI workflows for deployment], [Merged], [Weitere Anpassung des Deployment-Workflows, Folgeänderung zu PR #23],
  [#25], [fix: IU5290 split up CI workflows for deployment], [Merged], [Weitere Anpassung am Deployment-Workflow, Folgeänderung zu PR #24],
  [#26], [fix: IU5290 split up CI workflows for deployment (#24)], [Merged], [Weitere Folgeänderung des Deployment-Workflows, bezieht sich auf PR #25],
  [#27], [fix: IU5290 split up CI workflows for deployment (#24)], [Merged], [Weitere Folgeänderung des Deployment-Workflows, bezieht sich auf PR #26],
  [#28], [feat: IU5274 use Resend to send e-mails], [Merged], [Resend für den E-Mail-Versand eingerichtet und E-Mail-Template leicht angepasst],
  [#29], [feat: IU5275, IU5272, IU5273, IU5288 propagate current session and user], [Merged], [Weitergabe der aktuellen Session und Benutzerdaten an den Request-Handler implementiert, Login-Flow erweitert und Tests ergänzt],
  [#30], [feat: IU5203 generate code coverage files], [Merged], [Erstellung von Test-Coverage-Dateien und Kommentar zur aktuellen Testabdeckung hinzugefügt],
  [#31], [feat: IU5199 attachments], [Merged], [Implementierung von Attachments inklusive Komponenten, Schema, Routen und Speicherung sowie Fehlerbehandlung für ungültige Anhänge],
  [#32], [feat: IU5286 login via username], [Merged], [Login-Formular angepasst, um Login per Benutzername oder E-Mail zu ermöglichen, Validierung und Backend-Logik erweitert, Unit-Tests ergänzt],
  [#33], [feat: implement sliding sessions with auto-expiration and cookie renewal], [Merged], [Sliding Sessions mit automatischer Verlängerung und Ablauf implementiert, inkl. Cookie-Erneuerung und Session-Löschung bei Ablauf],
  [#34], [feat: implement permission system & limitation report edit to admin and mods], [Closed], [Beginn der Implementierung eines Berechtigungssystems, PR wurde versehentlich geschlossen],
  [#35], [feat: IU5200 report frontend and IU5285 tag field], [Merged], [Frontend für Reports überarbeitet, Tag-Feld und IU-Logo hinzugefügt, Dashboard-Layout und Report-Formular angepasst],
  [#36], [feat: IU5278, IU5281 implement permission system & limitation report edit to admin and mods], [Merged], [Berechtigungssystem erweitert, Bearbeitung von Meldungen für Autoren und Admins ermöglicht, Bearbeitungsseite hinzugefügt],
  [#37], [feat: IU5192 integration tests], [Merged], [Integrationstests mit temporärem Datenbank-Container und Playwright eingerichtet, kleinere Tippfehler behoben],
  [#38], [feat: IU5346 layout], [Merged], [Layout-Konfiguration für alle Seiten erstellt, Stilanpassungen vorgenommen und Button- sowie Message-Komponente überarbeitet],
  [#39], [bugfix: IU5367 deno module not found if start app local or docker], [Merged], [nodeModulesDir-Einstellung angepasst, um Probleme beim Start der App in lokalen oder Docker-Umgebungen zu vermeiden],
  [#40], [feat: IU5345 refactor user role handling to use single role instead of array], [Merged], [Umstellung von Rollen-Array auf einzelne Rolle, User-Domain und zugehörige Tests überarbeitet],
  [#41], [feat: IU5351 add category to reports with validation and handler update], [Merged], [Report-Kategorien hinzugefügt, Datenbankschema und Report-Handler erweitert, Tests angepasst],
  [#42], [fix: IU5390 duplicated layout for new report], [Merged], [Layout-Probleme beim Erstellen neuer Reports behoben],
  [#43], [feat: IU5276, IU5277, IU5279 implement status dropdown to change the status of a report], [Merged], [Status-Dropdown im Frontend implementiert, Statusänderung mit Berechtigungsprüfung und Benachrichtigung des Autors ergänzt, Unit-Tests hinzugefügt],
  [#44], [feat: IU5282, IU5342, IU5343, IU5344, IU5354 frontend: create dummies and contact/imprint], [Merged], [CommentForm-Komponente, Dashboard-Dummies, User-Liste mit Suche und Sortierung, Impressum-, Kontakt- und Passwort-Reset-Seite implementiert],
  [#45], [fix: IU5339 set timeouts for jobs and ignore deployment annotation failures], [Merged], [Timeouts für einzelne Jobs gesetzt und Fehler bei Deployment-Annotationen ignoriert],
  [#46], [fix: IU5339 GitHub workflow fails on cleanup and timeouts], [Merged], [Linting-Fehler im Zusammenhang mit den zuvor eingeführten Workflow-Anpassungen behoben],
  [#47], [chore: 5339 optimize workflows and combine jobs where possible], [Merged], [Jobs zusammengeführt, um die Ausführungszeit der Workflows zu reduzieren],
  [#48], [feat: IU5349 Report Lifecycle], [Merged], [Mehrere Report-Events implementiert, Verlauf hinzugefügt und Integrationstests erstellt],
  [#49], [feat: IU5283 comment function for reports including notifications], [Merged], [Kommentar-Funktion für Reports mit Benachrichtigungen implementiert, inkl. Event-Dispatch und Service-Klasse],
  [#50], [feat: IU5326 Error Handling], [Merged], [Verbesserte Fehlerbehandlung für Login/Registration und Implementierung von 404- und weiteren Fehlerseiten],
  [#51], [fix: IU5352 report edit permissions], [Merged], [Zugriffsberechtigungen für das Bearbeiten von Reports angepasst, Deno-Version auf 2.4 fixiert und kleinere Designänderungen umgesetzt],
  [#52], [feat: IU5413, IU5419 Frontend Sort & Logo Font fix], [Closed], [Wurde versehentlich geschlossen - Umsetzung wurde in PR #59 fortgeführt],
  [#53], [feat: IU5389 redirect successful registration and show success message], [Merged], [Nach erfolgreicher Registrierung Weiterleitung zu /login mit Parameter ?m=reg_success sowie Anzeige einer Nachricht zur E-Mail-Verifizierung],
  [#54], [feat: IU5327 show attachment previews], [Merged], [Anzeigen von Anhängen als Bilder mit Möglichkeit, sie per Klick in neuem Tab zu öffnen],
  [#55], [chore: IU5413 check for random verification code], [Merged], [Test ergänzt, der sicherstellt, dass der VerificationCode bei jedem Aufruf zufällig ist],
  [#56], [chore: fix workflows], [Merged], [Diverse kleine Workflow-Fixes zur Verbesserung der CI/CD-Prozesse],
  [#57], [feat: IU5402, IU5348 links and priority], [Merged], [Priorität und Links sowohl in der ReportForm als auch in der temporären Tabelle integriert],
  [#58], [feat: IU5423 add assignee field], [Merged], [Zuweisungsfeld in ReportForm ergänzt, Speicherung und Rechte umgesetzt, Bugfix für Priorität],
  [#59], [feat: IU5413, IU5419 Frontend Sort & Logo Font fix], [Merged], [Sortierung & Suche in Tabellen umgesetzt, modernes UI für beide Tabellen, Logo-Schriftart korrigiert],
  [#60], [feat: IU5015 user list backend], [Merged], [Backend-Anbindung der Userliste, Sortierung umgesetzt, Buttons zum Rollentausch für Testzwecke],
  [#61], [feat: IU5438 demo users], [Merged], [Demo-Benutzer werden bei jedem Request erstellt; Passwort ist immer gleich],
  [#62], [feat: IU5002 admins and tutors will receive an email on new reports], [Merged], [Neuer Event-Listener versendet E-Mails an Admins und Tutoren bei neuen Reports],
  [#63], [feat: IU5010 Report Overview with backend], [Merged], [Neue Table-Komponente, Änderung der UserTable, Sortierung und Suche folgen in separatem PR],
  [#64], [feat: IU5010 report filter and sort], [Merged], [Sortierung der Felder, Filterung nach Titel und Beschreibung, Sortierung nach Autor/Zugewiesen noch nicht möglich],
  [#65], [feat: IU5457 e2e-testcases], [Merged], [Testcases: Erstellen von Meldungen, Hochladen von Screenshots, Benutzerregistrierung, Benutzerlogin],
  [#66], [fix: Update button colors to teal and change size], [Merged], [Primary-Buttonfarbe und Info-Messagefarbe auf teal geändert, Button-Größe angepasst],
  [#67], [feat: IU5433 improve detail page and StatusDropdown], [Merged], [ReportDetailPage überarbeitet, StatusDropdown optimiert],
  [#68], [feat: IU5392 Snackbar], [Merged], [Snackbar-Komponente implementiert],
  [#69], [feat: IU5509 Responsive Site], [Merged], [Tabellen und Navigation für kleine Displays responsiv angepasst],
  [#70], [fix: IU5518 Missing demo user role], [Merged], [Rolle MEMBER wird automatisch zugewiesen, wenn keine vorhanden ist; Login-Probleme mit Demo-User behoben],
  [#71], [chore: IU5519 add rejected status], [Merged], [Status "abgelehnt" basierend auf Projektanforderungen ergänzt],
  [#72], [fix: IU5391 fix tab focus of file selector], [Merged], [Tab-Fokus im File Picker korrigiert, damit Fokus erhalten bleibt und nicht zum Seitenanfang springt],
  [#73], [feat: IU5416 password reset], [Merged], [Passwort-Zurücksetzen implementiert inkl. Token-Validierung, Ablaufbehandlung, API-Route, automatischem Token-Cleanup und Logik für eingeloggte Nutzer und Token-Nutzer],
  [#74], [feat: IU5523 moving typst documents to repo], [Merged], [Typst-Dokumente aus typst.app ins Repository übernommen],
  [#75], [fix: IU5522 Fix status and edit buttons], [Merged], [Buttons unter Titel verschoben und vertikal angeordnet bei kleinen Displays],
  [#76], [fix: IU5521 always remove session on logout], [Merged], [Session wird beim Logout immer gelöscht],
  [#77], [fix: IU5520 add loading icon to all Buttons], [Merged], [Buttons zeigen Lade-Icon, sind währenddessen deaktiviert],
  [#78], [fix: IU5520 button becomes island], [Merged], [Button-Komponente wurde in eine Island-Komponente umgewandelt],
  [#79], [feat: IU5341 E2E tests], [Merged], [Playwright-basierte E2E-Tests für Login, Registrierung und Reports hinzugefügt; Testfälle für Anhänge entfernt, Statusänderung getestet],
  [#80], [fix: IU5458 Table cut off on smaller screens], [Merged], [Minimale Tabellenbreiten für UserTable (756px) und ReportTable (1064px) gesetzt, um Darstellungsprobleme auf kleinen Bildschirmen zu vermeiden],
  [#81], [feat: IU5341 increase test coverage], [Merged], [Testabdeckung erhöht; einige Dateien bleiben vorerst mit niedriger Coverage],
  [#82], [feat: IU5064 Manual], [Merged], [Handbuch ergänzt; unnötige Seiten entfernt und neue Vorlage erstellt],
  [#83], [chore: IU5529 scaffold test documentation], [Merged], [Testdokumentation inkl. Testzweck, Motivation und Beispielen ergänzt],
  [#84], [chore: IU5532 clean up README], [Merged], [README um klarere Projektbeschreibung und Startanleitung ergänzt],
  [#85], [chore: IU5531 Gliederung des Projektberichts], [Merged], [Vorschlag zur neuen Struktur des Projektberichts eingebracht],
  [#86], [chore: IU5065 create review protocol], [Merged], [Reviewprotokoll angelegt, Template hinzugefügt, PRs wurden ergänzt],
    [#87], [IU5530: Anforderungsliste und Produkt Backlog], [Merged],
  [Erstellung von Anforderungsliste und Produkt-Backlog],

)

== Überarbeitete Artefakte
- Alle identifizierten Mängel aus den Reviews wurden behoben.  
- Der aktuelle Stand ist im `main`-Branch verfügbar und entspricht dem geplanten Zielzustand.  

= Fazit
Die Review-Phasen wurden erfolgreich abgeschlossen.  
Alle zentralen Komponenten befinden sich in einem stabilen, dokumentierten und präsentationsfähigen Zustand.  
Das System ist funktional vollständig, wartbar und erfüllt die Qualitätsanforderungen für den weiteren Projektverlauf.
