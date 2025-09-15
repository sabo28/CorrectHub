#import "template.typ": *

#show: project.with(
  title: [
    CorrektHub
  ], subtitle: [
    Analyse, Konzeption und prototypische\ Umsetzung eines
    Korrekturmanagementsystems (Aufgabenstellung 2)
  ], paper_type: "Anforderungsliste & Produkt-Backlog", authors: (
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

Dieses Dokument fasst die im Projekt CorrectHub erarbeiteten Anforderungen sowie den finalen Stand des Product Backlogs zusammen. Es wurde im Rahmen des Projekts ein Prototyp für ein webbasiertes Korrekturmanagementsystem entwickelt. Ziel war es, eine Plattform bereitzustellen, über die Fehler, Verbesserungsvorschläge und Ergänzungen zu Studienmaterialien einfach und schnell gemeldet werden konnten.
Die Anwendung richtete sich an Studierende, Tutoren und Verantwortliche für die Materialerstellung. Sie ermöglichte die zentrale Erfassung, Kategorisierung und Bewertung eingehender Meldungen sowie die Nachverfolgbarkeit über den gesamten Lebenszyklus - von der Erfassung bis zur Umsetzung oder Ablehnung.

== Anforderungen und Scope

- Erfassung und Verwaltung von Meldungen mit relevanten Metadaten
- Kategorisierung und Priorisierung von Meldungen
- Zuweisung eingegangener Meldungen
- Statusverfolgung über den gesamten Bearbeitungsprozess
- Rollenbasierte Benutzeroberfläche für unterschiedliche Nutzergruppen

Nicht Teil der Umsetzung war die vollständige Integration in bestehende produktive Systeme der Hochschule. Der Fokus lag auf einem funktionsfähigen Prototyp mit den wichtigsten Kernfunktionen.

== Verwendete Methodik

Die Umsetzung erfolgte nach der agilen Projektmanagementmethode Scrum. Die Anforderungen wurden in Form von User Stories erfasst, priorisiert und in aufeinanderfolgenden Sprints umgesetzt. Sprint-Reviews unterstützten eine kontinuierliche Verbesserung des Entwicklungsprozesses, während das Sprint-Backlog als zentrale Planungsgrundlage diente. In der Umsetzung kam es jedoch vereinzelt zu Abweichungen vom geplanten Zeitrahmen - einige Sprints dauerten wenige Tage länger oder kürzer als vorgesehen. Rückblickend hätten wir Sprints konsequenter zum geplanten Termin beenden und offene Tickets in den nächsten Sprint übernehmen sollen.

Zu Beginn wurden die Sprints in Redmine als eigenständige Tickets angelegt, wobei Epics als Untertickets hinzugefügt wurden. Im weiteren Verlauf erwies es sich jedoch als übersichtlicher, stattdessen eigene Versionen anzulegen. Diese enthielten die einzelnen Tickets, die innerhalb eines Sprints umgesetzt werden sollten, und ermöglichten so eine klarere Struktur und bessere Nachverfolgbarkeit.

#figure(
  image("images/versions.png"),
  caption: [Versionen zur besseren Übersicht der Sprints - die angezeigten Startzeitpunkte sind jedoch nicht korrekt.]
)

Wie bereits beschrieben, wurden die Sprints während der Umsetzung in Redmine mithilfe von Versionen organisiert. Jeder Sprint verfolgte dabei ein übergeordnetes Ziel, woraus sich die folgende Sprintstruktur ergab:

#figure(
  table(
    columns: 3,
    align: (horizon + center, horizon + center, horizon + left),
    table.header[*Sprint*][*Zielversion*][*Ziel*],
    [Sprint 1], [v0.1.0], [Entwicklungsumgebung aufsetzen],
    [Sprint 2], [v0.2.0], [Login und Registrierung],
    [Sprint 3], [v0.3.0], [Meldung erstellen],
    [Sprint 4], [v0.4.0], [Lebenszyklus und Kommentare zu Meldungen],
    [Sprint 5], [v0.5.0], [Meldungs- und Benutzerübersicht],
    [Sprint 6], [v0.6.0], [Fehlerbehebungen],
    [Sprint 7], [v1.0.0], [Benutzerhandbuch und Abschluss],
  ),
  caption: [Zuordnung der Zielversion zu Sprints]
)

= Product Backlog

Eine erste Stakeholder-Analyse wurde bereits im Rahmen von Meilenstein 1 durchgeführt. Zu diesem Zeitpunkt umfasste die Liste neben dem Entwicklerteam und dem Projektleiter auch den Kunden, also den Tutor, sowie externe Stakeholder. Reguläre Endnutzer - insbesondere Studierende - wurden jedoch nicht ausdrücklich genannt.

Die folgende, angepasste Liste bildet die relevanten Stakeholder umfassender ab:

- Entwicklerteam
- Projektleiter
- Kunde
- Tutoren
- Studierende

Das System wurde in erster Linie für Tutoren und Studierende konzipiert, richtet sich jedoch auch an alle weiteren Personen, die im Rahmen ihrer Tätigkeit mit dem System in Berührung kommen.

Im Product Backlog wurden vor allem funktionale Anforderungen festgehalten. Ergänzend entstanden im Verlauf der Sprints weitere Tickets, die der Übersichtlichkeit dienten und das Projektmanagement unterstützten.

#let tickets = csv("tickets.csv")
#table(
  columns: 6,
  align: (horizon + center, horizon, horizon, horizon, horizon, horizon + center),
  table.header[*ID*][*Typ*][*Status*][*Priorität*][*Name*][*Zielversion*],
  ..tickets.flatten(),
)
#figure(
  [],
  caption: [Product Backlog],
  kind: table
)
