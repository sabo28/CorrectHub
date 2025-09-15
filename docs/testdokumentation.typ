#import "template.typ": *

#show: project.with(
  title: [
    CorrektHub
  ], subtitle: [
    Analyse, Konzeption und prototypische\ Umsetzung eines
    Korrekturmanagementsystems (Aufgabenstellung 2)
  ], paper_type: "Testdokumentation", authors: (
    (
      name: "Benjamin Falk", role: "Projektleitung", matriculation_number: "31912112", study_program: text(hyphenate: false, [Wirtschafts-?informatik (B.Sc.)]), page_range: "",
    ), (
      name: "Labeeb Malik", role: "Mitglied 2", matriculation_number: "32107067", study_program: "Informatik (B.Sc.)", page_range: "",
    ), (
      name: "Antony Cherukattu", role: "Mitglied 3", matriculation_number: "92006671", study_program: "Informatik (B.Sc.)", page_range: "",
    ),
  ), module_name: [Projekt: Software Engineering (ISEF01)], tutor_name: [Tobias Brückmann], bibliography_file: "", hide_authors_table: true,
)

= Einleitung

Diese Testdokumentation beschreibt die Vorgehensweise, Werkzeuge und Ergebnisse
der Qualitätssicherung im Projekt CorrektHub. Ziel der Tests ist es, die
funktionale Korrektheit, Stabilität sowie Benutzerfreundlichkeit der
entwickelten Webanwendung sicherzustellen.

Durch den Einsatz verschiedener Testmethoden - von automatisierten Unit- und
Integrationstests bis hin zu manuellen UI-Tests - soll gewährleistet werden,
dass alle relevanten Anforderungen zuverlässig erfüllt werden. Gleichzeitig
sollen Fehler frühzeitig erkannt und zukünftige Regressionen vermieden werden.

Im Folgenden werden die zugrunde liegende Teststrategie, die konkreten
Testarten, die Durchführung sowie die erzielten Ergebnisse dokumentiert.

= Teststrategie

Die Qualitätssicherung bei CorrektHub verfolgt mehrere Ziele:

- Sicherstellung der korrekten Umsetzung funktionaler Anforderungen
- Vermeidung und frühzeitige Erkennung von Fehlern im Systemverhalten
- Steigerung der Robustheit und Benutzerfreundlichkeit
- Verhinderung von Regressionen bei Weiterentwicklungen

Diese Ziele werden durch eine Kombination automatisierter und manueller
Testverfahren erreicht, wobei jede Methode auf einen spezifischen
Anwendungsbereich abzielt.

== Testumgebung

Für Akzeptanztests wurde eine separate Testumgebung eingerichtet, die unabhängig
von der Produktivumgebung betrieben wird. Sie bildet die Produktionsbedingungen
realitätsnah ab und ermöglicht Tests unter kontrollierten Rahmenbedingungen.

Automatisierte Unit- und Integrationstests werden hingegen in isolierten
Containern ausgeführt. Dadurch ist eine konsistente und reproduzierbare
Testbasis gewährleistet - unabhängig von der Systemumgebung oder dem
Entwicklungsstand anderer Komponenten.

Zum Einsatz kamen dabei folgende Tools und Technologien:

- Deno: Ausführung der Backend-Logik sowie Durchführung automatisierter Tests
- Docker: Containerisierte und isolierte Ausführung der Anwendungskomponenten
- Fresh Framework: Für serverseitiges Rendering und die Entwicklung UI-bezogener
  Tests
- Browser (manuell und automatisiert): Durchführung von Tests auf der
  Benutzeroberfläche

= Testarten

Zur Sicherstellung der Qualität in verschiedenen Bereichen der Anwendung wurden
mehrere Testarten eingesetzt. Diese unterscheiden sich hinsichtlich ihres Ziels,
ihres Umfangs sowie ihres Automatisierungsgrads.

== Unit-Tests

Unit-Tests prüfen einzelne Funktionen oder Methoden isoliert vom restlichen
System. Dabei wird gezielt überprüft, ob eine bestimmte Funktion bei definierten
Eingabewerten das erwartete Ergebnis liefert.

Im Projekt CorrektHub wurden Unit-Tests vor allem zur Validierung der
Geschäftslogik und Hilfsfunktionen im Backend eingesetzt. Sie zeichnen sich
durch geringe Komplexität, hohe Ausführungsgeschwindigkeit und leichte
Reproduzierbarkeit aus.

== Integrationstests

Integrationstests überprüfen das Zusammenspiel mehrerer Komponenten,
beispielsweise zwischen Domain-Service, Datenbank und Business-Logik. Ziel ist
es sicherzustellen, dass die Datenflüsse korrekt sind und Schnittstellen wie
vorgesehen miteinander interagieren.

Diese Tests wurden insbesondere für komplexere Abläufe und API-Endpunkte
verwendet.

== End-to-End-Tests (E2E)

End-to-End-Tests simulieren komplette Nutzerabläufe - von der Eingabe in der
Benutzeroberfläche bis zur Verarbeitung im Backend und der Darstellung der
Ergebnisse. Sie stellen sicher, dass das Gesamtsystem unter realistischen
Bedingungen funktioniert.

Im Projekt wurden E2E-Tests sowohl automatisiert als auch manuell durchgeführt.
Beispielsweise wurden typische Workflows wie das Erstellen und Bearbeiten von
Meldungen, das Einloggen mit verschiedenen Rollen oder der gesamte Lebenszyklus
einer Korrekturmeldung getestet.

== Manuelle Tests

Für Bereiche, in denen automatisierte Tests nur eingeschränkt möglich oder
sinnvoll sind, wurden manuelle Tests durchgeführt. Dies betraf insbesondere:

- die Benutzeroberfläche (UI)
- die User Experience (UX)
- die visuelle Darstellung

= Testdurchführung

== Vorgehensweise

Die Tests wurden iterativ im Verlauf der Entwicklung durchgeführt. Bereits
während der Implementierung neuer Features kamen automatisierte Unit- und
Integrationstests zum Einsatz. Nach Abschluss eines Sprint-Inkrements wurden
zusätzlich manuelle UI- und E2E-Tests vorgenommen, um die Funktionalität aus
Nutzersicht zu validieren.

Wichtige Akzeptanzkriterien wurden in Form von Testfällen dokumentiert und
regelmäßig überprüft.

Automatisierte Tests werden dabei entweder lokal oder mittels Continuous
Integration durchgeführt. Hierzu wird der Befehl `make test-coverage` sowie `make e2e` für
End-to-End-Tests verwendet.

== Testabdeckung

Die automatisierten Tests decken einen Großteil der kritischen Geschäftslogik
sowie zentrale API-Endpunkte ab. Dabei wurde besonders auf die folgenden
Bereiche geachtet:

- Verarbeitung von Meldungen und Statuswechseln
- Rechte- und Rollenkonzept (Zugriffsbeschränkungen)
- Validierung von Eingaben
- Reaktionen des Systems auf fehlerhafte oder unvollständige Eingaben

Die Benutzeroberfläche wurde primär manuell getestet, insbesondere im Hinblick
auf:

- korrekte Darstellung
- intuitive Bedienbarkeit
- Rollenspezifische Funktionalitäten

Die Testabdeckung wird mittels Continuous Integration als Teil eines
Pull-Requests kommentiert. Dazu wird das Tool Barecheck verwendet.

#figure(
  image("images/barecheck.png"), caption: [Barecheck - Bericht der Testabdeckung als Kommentar in einem Pull Request],
)

= Ergebnisse und Bewertung

Die durchgeführten Tests zeigen, dass die Kernfunktionalitäten von CorrektHub
zuverlässig und erwartungsgemäß funktionieren. Die automatisierten Tests
verliefen größtenteils erfolgreich und deckten insbesondere die Geschäftslogik
umfassend ab.

Auch die manuell durchgeführten UI- und E2E-Tests ergaben, dass typische
Anwendungsfälle wie das Einreichen, Bearbeiten und Bewerten von Meldungen
korrekt ablaufen. Kleinere visuelle Inkonsistenzen oder Usability-Schwächen
konnten identifiziert und behoben werden.

== Erkenntnisse

Im Rahmen der Testdurchführung konnten wichtige Erkenntnisse gewonnen werden:

- Fehler in der Logik konnten frühzeitig durch Unit-Tests erkannt und teilweise
  direkt im Entwicklungsprozess behoben werden.
- Bei gefundenen Bugs ist es ratsam als ersten Schritt einen Testfall zu
  schreiben, der den Bug reproduziert.
- Auch wenn die Funktionalität gegeben ist, sind Aspekte wie Layout,
  Responsiveness und Nutzerführung entscheidend für die Qualität der Anwendung.
- Wenn Anforderungen nicht klar definiert sind, ist es manchmal schwierig, klare
  Tests zu schreiben.

== Noch bestehende Einschränkungen

- Manche Funktionen wurden mangels Zeit womöglich nicht ausreichend getestet.
- Es bestehen noch kleinere Optimierungspotenziale bei der Validierung von
  Benutzereingaben und Fehlermeldungen.

= Fazit

Die im Projekt CorrektHub durchgeführten Tests haben wesentlich zur
Sicherstellung der Qualität der entwickelten Webanwendung beigetragen. Durch die
Kombination automatisierter und manueller Testverfahren konnte eine breite
Testabdeckung erzielt werden - sowohl auf technischer als auch auf funktionaler
Ebene.

Insbesondere die frühzeitige Integration von Unit- und Integrationstests
ermöglichte eine effiziente Fehlererkennung und -behebung während der
Entwicklung. Die ergänzenden manuellen Tests erlaubten eine nutzerorientierte
Prüfung der Anwendung und gaben wertvolle Rückmeldungen zur Usability und zur
Darstellung der Inhalte.

Trotz kleinerer Einschränkungen in der Tiefe einzelner Testszenarien lässt sich
festhalten, dass die wesentlichen Anforderungen erfolgreich umgesetzt und
umfassend validiert wurden. Die erarbeiteten Testmethoden bilden zudem eine
solide Grundlage für eine zukünftige Weiterentwicklung und Wartung des Systems.

= Anhang

#renderAttachment(
  "../domain/user/verification-code.test.ts", caption: [Unit Tests zum Domain Objekt `VerificationCode` in der User-Domain],
)

#renderAttachment(
  "../domain/report/service.test.ts", caption: [Integrationstest des Report Services in Verbindung mit User Domain Objekten],
)

#renderAttachment("../e2e/login.spec.ts", caption: [End-to-End Tests zum Login])
