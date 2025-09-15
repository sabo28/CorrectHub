#import "template.typ": *

#show: project.with(
  title: [
    CorrectHub
  ],
  subtitle: [
    Analyse, Konzeption und prototypische\ Umsetzung eines
    Korrekturmanagementsystems (Aufgabenstellung 2)
  ],
  paper_type: "Projektbericht",
  authors: (
    (
      name: "Benjamin Falk",
      role: "Projektleitung",
      matriculation_number: "31912112",
      study_program: text(hyphenate: false, [Wirtschafts-?informatik (B.Sc.)]),
      page_range: "?",
    ),
    (
      name: "Labeeb Malik",
      role: "Mitglied 2",
      matriculation_number: "32107067",
      study_program: "Informatik (B.Sc.)",
      page_range: "16-21, 29-33",
    ),
    (
      name: "Antony Cherukattu",
      role: "Mitglied 3",
      matriculation_number: "92006671",
      study_program: "Wirtschaftsinformatik (B.Sc.)",
      page_range: "?",
    ),
  ),
  module_name: [Projekt: Software Engineering (ISEF01)],
  tutor_name: [Tobias Brückmann],
  bibliography_file: "bibliography.bib",
)

= Abstract

Im Rahmen der Projektarbeit im Kurs Software Engineering (ISEF01) haben wir mit CorrectHub ein prototypisches Korrekturmanagementsystem
entwickelt, das Studierende im Fernstudium bei der Meldung und Verwaltung von Fehlern
in Studienmaterialien unterstützt. Gleichzeitig möchten wir auch Tutoren und Administratoren 
entlasten, indem unser System Werkzeuge zur strukturierten Bearbeitung, Priorisierung und 
Nachverfolgung von Meldungen bereitstellt. Unser Ziel war es, eine zentrale Plattform zu 
schaffen, die es ermöglicht, Meldungen einfach zu erfassen, zu kategorisieren und deren 
Bearbeitungsstatus transparent nachzuverfolgen.

Die Umsetzung erfolgte in Anlehnung an agile Methoden mit iterativer Entwicklung und 
regelmäßigen Feedbackzyklen. Technologisch basiert unser System auf einer modernen Umgebung 
mit Deno Fresh als Backend, Preact als Frontend sowie PostgreSQL als Datenbank. Zu den 
Kernfunktionen zählen Authentifizierung, Meldungserstellung und -bearbeitung, eine Rollen- und 
Rechteverwaltung für verschiedene Nutzergruppen sowie ein Benachrichtigungssystem, das sowohl 
Studierende als auch Tutoren über Statusänderungen informiert.
#pagebreak()

= Einleitung

Die Qualität von Lernmaterialien stellt einen entscheidenden Faktor für den Erfolg im
 Fernstudium dar. Anders als in klassischen Präsenzveranstaltungen fehlt im Fernstudium häufig 
 der direkte Austausch zwischen Studierenden und Tutoren, sodass das bereitgestellte Material 
 in Form von Skripten, Übungsaufgaben, Vodcasts oder Tutorien eine zentrale Rolle bei der 
 Wissensvermittlung einnimmt. Trotz umfassender Qualitätssicherungsprozesse lassen sich Fehler, 
 Unklarheiten oder veraltete Inhalte in diesen Materialien nicht vollständig vermeiden. Solche 
 Fehler können inhaltliche Ungenauigkeiten, formale Aspekte wie Tippfehler oder auch technische 
 Probleme, beispielsweise defekte Verlinkungen, betreffen.

Vor diesem Hintergrund entstand die Motivation, ein System zu entwickeln, das es ermöglicht, 
Korrekturen nicht nur schnell zu erfassen, sondern auch strukturiert zu bearbeiten und für 
alle Beteiligten transparent nachzuverfolgen. Mit CorrectHub wurde dafür ein prototypischer 
Ansatz gewählt, der Studierenden eine einfache Möglichkeit zur Meldung von Fehlern bietet 
und gleichzeitig Tutoren und Administratoren Werkzeuge für eine effiziente Bearbeitung zur 
Verfügung stellt. 

Ergänzend dazu haben wir ein Handbuch erstellt, das die Nutzung des Systems 
beschreibt und die wichtigsten Funktionen erläutert. Damit wird der Prototyp nicht nur technisch, sondern auch dokumentarisch unterstützt und seine Einsatzmöglichkeiten nachvollziehbar gemacht.

== Problemstellung

Die bestehende Vorgehensweise zur Korrekturmeldung im Fernstudium weist jedoch erhebliche 
strukturelle und organisatorische Defizite auf, die sowohl die Effizienz der Bearbeitung als 
auch die Zufriedenheit der Beteiligten beeinträchtigen. Meldungen zu fehlerhaften Inhalten 
erreichen Tutoren bislang über unterschiedlichste Kanäle, etwa per E-Mail, in Chatnachrichten, 
über Forenbeiträge oder während Tutorien. Eine zentrale Sammelstelle für diese Hinweise 
existiert nicht. Die Folge ist, dass Rückmeldungen mehrfach oder in leicht veränderter Form 
eingehen, was zu Wiederholungen führt und den Überblick erschwert.

Hinzu kommt, dass die eingereichten Meldungen in ihrer Form und Qualität stark variieren. 
Oftmals fehlen Angaben wie die konkrete Quelle, eine Seitenangabe oder eine präzise 
Fehlerbeschreibung, sodass zusätzliche Rückfragen erforderlich werden. Ohne eine 
standardisierte Struktur lassen sich Meldungen kaum priorisieren oder vergleichen, was den 
Bearbeitungsprozess verlängert und unnötig die Belastung der Verantwortlichen erhöht.

Darüber hinaus besteht für Studierende ein Problem der Nachvollziehbarkeit. Sie haben meist 
keine Möglichkeit zu erkennen, ob ihre Meldungen registriert wurden, ob sie sich in Bearbeitung 
befinden oder bereits abgeschlossen sind. Rückmeldungen erfolgen häufig nur vereinzelt oder 
über informelle Kanäle, was zu einem Gefühl der Intransparenz führt und das Vertrauen in den 
Korrekturprozess schwächt.

Tutoren und Administratoren wiederum stehen vor der Herausforderung, die Vielzahl an 
eingehenden Meldungen zu sichten, zu sortieren und die Bearbeitung zu koordinieren. Der Prozess 
ist stark von manueller Arbeit geprägt, zeitaufwendig und fehleranfällig. Besonders zu 
Semesterbeginn oder in prüfungsnahen Phasen steigt die Menge an Meldungen rasant an, was 
zu weiteren Verzögerungen führt.

Insgesamt zeigt sich, dass die aktuelle Vorgehensweise den Anforderungen an ein modernes, 
transparentes und effizientes Qualitätsmanagement nicht genügt. Es fehlt an einer zentralen 
Plattform, die die Erfassung, Strukturierung und Nachverfolgung von Korrekturmeldungen 
gewährleistet und damit sowohl den administrativen Aufwand reduziert als auch die Kommunikation 
zwischen Studierenden und Tutoren nachhaltig verbessert.

== Aufgabenstellung

Die Aufgabenstellung für dieses Projekt bestand in der Analyse, Konzeption und prototypischen 
Umsetzung eines Korrekturmanagementsystems. Ziel war es, eine Anwendung zu entwickeln, die 
Studierende im Fernstudium bei der Meldung von Fehlern oder Verbesserungsvorschlägen in 
Lehrmaterialien unterstützt und gleichzeitig die effiziente Bearbeitung durch Tutoren und 
Administratoren ermöglicht.
Wir haben die Aufgabe so verstanden, dass nicht nur eine technische Implementierung im 
Vordergrund steht, sondern auch die Abbildung organisatorischer Prozesse, die für ein 
funktionierendes Qualitätsmanagement notwendig sind. Dazu zählen insbesondere eine klare 
Rollen- und Rechteverteilung, die Möglichkeit zur Kategorisierung und Priorisierung von 
Meldungen sowie die transparente Nachverfolgbarkeit des gesamten Lebenszyklus.
Die Umsetzung war dabei bewusst auf einen Prototypen ausgelegt, der die Kernanforderungen 
abdeckt und als Grundlage für eine spätere Erweiterung oder produktive Einführung dienen kann. 
Ein besonderer Schwerpunkt lag auf der Benutzerfreundlichkeit, um die Akzeptanz bei 
Studierenden und Tutoren sicherzustellen.


== Projektziele

Wie bereits erwähnt, ist das übergeordnete Ziel des Projekts die Entwicklung eines 
Korrekturmanagementsystems, das die Qualitätssicherung von Studienmaterialien verbessert, 
indem es eine zentrale Plattform für Korrekturmeldungen bereitstellt. Neben diesem Hauptziel 
lassen sich mehrere Teilziele ableiten:

*Technische Ziele:* Aufbau einer modernen, webbasierten Anwendung, 
die eine schnelle Prototypenentwicklung ermöglicht und gleichzeitig eine solide Basis für 
zukünftige Erweiterungen bildet.

*Funktionale Ziele:* Bereitstellung der wesentlichen Funktionen wie Nutzerregistrierung und 
-authentifizierung, Erstellung und Bearbeitung von Meldungen, Rollen- und Rechteverwaltung, 
Kommentarfunktion sowie Benachrichtigungssystem.

*Organisatorische Ziele:* Förderung einer transparenten Kommunikation zwischen Studierenden, 
Tutoren und Administratoren, Reduzierung des Verwaltungsaufwands und Schaffung klarer Workflows 
für die Bearbeitung von Meldungen.

*Lernziele:* Stärkung der Eigenverantwortung der Studierenden durch aktive Beteiligung an der 
Qualitätssicherung sowie Unterstützung der Hochschule bei der kontinuierlichen Verbesserung 
ihrer Lehrmaterialien.

Im Zusammenhang mit Meilenstein 2 (Projektvideo) spielte die Definition dieser Projektziele 
eine wichtige Rolle, da sie den inhaltlichen Rahmen für die Präsentation und spätere 
Umsetzung vorgab. Wir konnten so eine gemeinsame Vorstellung entwickeln, welche Kernfunktionen 
der Prototyp abbilden soll und welche Aspekte als optionale Erweiterungen zu betrachten sind.

== Relevanz für Studium und Praxis

Die Entwicklung von CorrectHub geht über die rein technische Umsetzung hinaus und verdeutlicht 
ihren möglichen Nutzen im Studienalltag. Für Studierende könnte das System eine zentrale 
Anlaufstelle schaffen, um Fehler oder Verbesserungsvorschläge strukturiert einzubringen und 
deren Bearbeitung transparent nachzuverfolgen. Auf diese Weise würde nicht nur die Qualität 
der Lehrmaterialien verbessert, sondern auch die Eigenverantwortung der Studierenden gestärkt, 
da sie aktiv am Qualitätsprozess mitwirken könnten. Besonders in prüfungsrelevanten Situationen, 
etwa bei fehlerhaften Übungsaufgaben, würde CorrectHub für Klarheit sorgen und Unsicherheiten 
reduzieren.

Für Tutoren und Administratoren bestünde die Chance, den organisatorischen Aufwand erheblich 
zu reduzieren. Anstatt Meldungen aus verschiedenen Kanälen zusammenzuführen, würden diese 
gebündelt, transparent dargestellt und durch einheitliche Workflows effizient bearbeitet werden. 
Dies könnte Zeit sparen, eine bessere Priorisierung ermöglichen und die Gefahr verringern, 
dass Meldungen übersehen oder doppelt behandelt werden.

Auch für die Hochschule insgesamt ergäbe sich ein Mehrwert. CorrectHub würde die Möglichkeit 
bieten, die Qualität der Lehrmaterialien langfristig zu sichern und kontinuierlich zu verbessern. 
Ein zentralisiertes System könnte zudem eine wertvolle Datenbasis schaffen, mit der sich 
wiederkehrende Problemstellen identifizieren lassen, beispielsweise wenn bestimmte Kapitel 
oder Themenbereiche mehrfach Korrekturen benötigen. Auf diese Weise würde unser System nicht 
nur die Behebung einzelner Fehler erleichtern, sondern auch die kontinuierliche 
Weiterentwicklung der Studieninhalte im Sinne eines gelebten Qualitätsmanagements unterstützen.

Langfristig hätte CorrectHub das Potenzial, auch über das Fernstudium hinaus übertragen zu 
werden. Ein vergleichbarer Ansatz könnte in klassischen Präsenzstudiengängen oder in der 
beruflichen Weiterbildung genutzt werden, um eine schnelle Rückmeldung zu Lehrmaterialien zu 
ermöglichen. Damit zeigt sich, dass CorrectHub zwar als Prototyp entwickelt wurde, aber 
grundsätzlich für Bildungseinrichtungen mit umfangreichen digitalen Lehrmaterialien einen 
relevanten Nutzen stiften würde.

#pagebreak()

= Projektvorbereitung und Planung

Unser Team fand sich über das Forum des Moduls Software Engineering zusammen. In
zwei initialen Meetings standen das gegenseitige Kennenlernen sowie die Klärung
von Kompetenzen und Verständnis des Projektthemas im Vordergrund.

Die Rolle der Projektleitung übernahm Benjamin Falk. De facto übernahm er auch
Aufgaben des Product Owners, etwa die Priorisierung zentraler Anforderungen,
auch wenn die Rolle nicht offiziell benannt wurde. Gemeinsam formulierten wir
die Projektvision, welche als Leitfaden für spätere Entscheidungen zu
Architektur, Prioritäten und Qualitätssicherung diente.

Ein dedizierter Scrum Master, der Hindernisse erkennt und beseitigt @Noll2017,
war in unserem kleinen Team nicht vorgesehen. Stattdessen übernahmen wir die
Organisation gemeinschaftlich.

== Zeitplan und Meilensteine

Die Projektplanung orientierte sich an den vorgegebenen Meilensteinen (MS1 bis
MS6). Dabei berücksichtigten wir teaminterne Schätzungen und berufliche
Verpflichtungen. Die anfängliche Roadmap stellte sich wie folgt dar:

#figure(
  table(
    columns: (auto, auto, auto),
    table.header[Meilenstein][Beschreibung][Zeithorizont],
    [MS1], [Projektkonfiguration abgeschlossen], [09.03.2025 - 03.04.2025],
    [MS2], [Projektvideo bereitgestellt], [06.04.2025 - 17.04.2025],
    [MS3], [Dokumentationskonzept erstellt], [20.04.2025 - 17.05.2025],
    [MS4], [Zentrale Ergebnisartefakte entwickelt], [20.05.2025 - 16.08.2025],
    [MS5], [Ergebnispräsentation als Screencast], [19.08.2025 - 28.08.2025],
    [MS6], [Finale Ergebnisse und Projektbericht], [31.08.2025 - 13.09.2025],
  ),
  caption: flex-caption(
    [Ursprünglich geplante Roadmap.\ Quelle: Eigene Darstellung.],
    [Ursprünglich geplante Roadmap.],
  ),
)

Die Aufwandsplanung erfolgte zunächst grob anhand der Arbeitspakete (wie in
@gantt zu sehen). Aufgabenpakete wurden anschließend als Tickets in Redmine
angelegt, geschätzt und umgesetzt.

#figure(
  image("images/gantt.png"),
  caption: flex-caption(
    [Gantt-Diagramm zur Planung der einzelnen Meilensteine.\ Quelle: #link(
        "https://redmine-se.iubh.de/projects/korrekturmgt-falk-cherukattu-malik/issues/gantt",
        [redmine-se.iubh.de],
      )],
    [Gantt-Diagramm zur Planung der einzelnen Meilensteine.],
  ),
) <gantt>

== Product Backlog

Der Product Backlog bildet in Scrum ein zentrales Element und enthält
funktionale sowie nicht-funktionale Anforderungen, die im Projektverlauf
priorisiert und spezifiziert werden @Silva2017. Mit Meilenstein 1 legten wir die
Anforderungen in Redmine grob als User Stories an und verfeinerten sie
kontinuierlich.

== Sprints & Sprint Backlog

Die Umsetzung erfolgte in mehreren Sprints, die jeweils ein zentrales Thema oder
eine Funktionalität adressierten. Da Redmine keine direkte Sprintplanung
ermöglichte, nutzten wir die Roadmap-Funktion und interpretierten die Versionen
als Sprints.

#figure(
  table(
    columns: (1fr, 2fr),
    align: (center + horizon, left),
    table.header[Sprint][Hauptziel],
    [Sprint 1],
    [Dieser stand im Zeichen des Aufsetzens der Entwicklungsumgebung sowie der
      Konfiguration von GitHub Actions, um eine funktionierende Basis für Tests
      und Deployment zu schaffen.],

    [Sprint 2],
    [Konzentrierte sich auf die Implementierung der Authentifizierung,
      einschließlich Login, Registrierung und E-Mail-Verifizierung.],

    [Sprint 3],
    [Hier fokussierten wir uns auf die Kernfunktionalität der Anwendung: dem
      Erstellen von Meldungen.],

    [Sprint 4],
    [Erweiterte das System um die Möglichkeit, Kommentare zu Meldungen
      hinzuzufügen.],

    [Sprint 5],
    [Widmete sich der Benutzerverwaltung sowie der Implementierung einer
      Übersicht für Meldungen, um eine verbesserte Navigation und Transparenz zu
      gewährleisten.],

    [Sprint 6],
    [Hatte die Optimierung der mobilen Ansicht zum Ziel, sodass die Anwendung
      auch auf Smartphones komfortabel nutzbar war.],

    [Sprint 7],
    [Hier stand abschließend die Behebung von Fehlern und die Optimierung der
      bestehenden Funktionen im Vordergrund.],
  ),
  caption: flex-caption(
    [Sprintziele der jeweiligen Sprints.\ Quelle: Eigene Darstellung.],
    [Sprintziele der jeweiligen Sprints.],
  ),
)

Durch diese Strukturierung in Sprints konnten wir die Komplexität des Projekts
in überschaubare Abschnitte gliedern.

== Aufgabenteilung im Team

Das Entwicklerteam teilte die Kompetenzen klar untereinander auf. In der Praxis
wurden Verantwortlichkeiten jedoch flexibel gehandhabt und Aufgaben oft
gemeinsam übernommen.

#figure(
  table(
    columns: (20%, 40%),
    align: (horizon + right, left),
    table.header[Rolle][Verantwortliche Person(en)],
    [Projektleitung], [- Benjamin Falk],
    [Backend],
    [
      - Benjamin Falk
      - Labeeb Malik
    ],

    [Frontend],
    [
      - Antony Cherukattu
      - Benjamin Falk
      - Labeeb Malik
    ],

    [Dokumentation], [- Antony Cherukattu],
  ),
  caption: flex-caption(
    [Aufteilung der Verantwortlichkeiten.\ Quelle: Eigene Darstellung],
    [Aufteilung der Verantwortlichkeiten.],
  ),
)

Wir hatten außerdem eine Rolle des Customer Support Engineers definiert. Diese
kam, da es sich hierbei um einen Prototypen handelte, nicht zum Einsatz.

== Tools für Organisation und Kommunikation

Das Projektmanagement erfolgte wie vorgegeben in Redmine. Dort pflegten wir
Meilensteine, Product Backlog und Sprint Backlog. Redmine diente damit als
zentrales Tool für das Projektmanagement und zur Nachverfolgung des
Projektfortschritts.

Für Kommunikation nutzten wir Google Meet für wöchentliche Videokonferenzen
sowie WhatsApp für spontane Abstimmungen. Die Abstimmung mit dem Kunden (also
unserem Tutor) erfolgte ausschließlich per E-Mail.

Die Versionskontrolle und Codeverwaltung erfolgte über GitHub, das uns zugleich
die Möglichkeit bot, Pull Requests für Code Reviews zu nutzen. Ergänzend setzten
wir GitHub Actions ein, um automatisierte Tests sowie das Deployment unserer
Anwendung zu unterstützen.

Die Dokumentation führten wir zunächst im Redmine-Wiki, wechselten jedoch bald
zu Markdown- und Typst-Dateien im GitHub-Repository, da diese besser
versionierbar und in den Entwicklerworkflow eingebettet waren.

Mit den eingesetzten Werkzeuge konnten wir einerseits den formalen Anforderungen
der IU gerecht werden. Andererseits war diese praxisnah und ermöglichte uns eine
effiziente Zusammenarbeit im Team.

#pagebreak()

= Konzept und Architektur - Technische Umsetzung
== Funktionsübersicht
Die Anwendung bildet den kompletten Lebenszyklus einer Meldung ab – von der erstellten Eingabe über die Bearbeitung bis zum Abschluss. Der Zugang erfolgt über ein verifiziertes Benutzerkonto; die Anmeldung ist wahlweise per E-Mail oder Benutzername möglich. Die Authentifizierung läuft über ein Session-Cookie (HttpOnly) mit automatischer Verlängerung bei Aktivität; läuft eine Sitzung ab, erfolgt ein Redirect zur Anmeldeseite. Kern des Systems ist die strukturierte Verwaltung von Meldungen („Reports“) mit klaren Statusübergängen, optionaler Anonymisierung und transparenter Historie. Moderation und Administration steuern Zuweisungen und Statuswechsel; Benachrichtigungen halten alle Beteiligten auf dem Laufenden. Übersichten sind sortier- und durchsuchbar, das UI ist responsiv.

=== Funktionen

- Registrierung & Verifizierung: Kontoaktivierung per E-Mail, erst danach Login möglich.

- Login: mit E-Mail oder Benutzername + Passwort.

- Sitzungsverwaltung: HttpOnly-Cookie, Auto-Verlängerung bei Aktivität, Redirect bei Ablauf/Logout.

- Meldungen (Reports): Erstellung mit Kategorie (Inhaltlicher Fehler, Verbesserungsvorschlag, Sonstige), Priorität und optional anonym.

- Anhänge & Links: PNG/JPG bis 1 MB; andere Dateitypen über Links-Feld referenzieren.

- Kommentare & Verlauf: kommentierbare Historie aller Änderungen.

- Statusfluss: NEW → IN_PROGRESS → IN_REVIEW → RESOLVED; REJECTED als     Endstatus. UNKNOWN dient als sicherer Fallback (z. B. bei Datenmigrationen).

- Zuweisung (Assignee): Meldungen werden Moderator:innen/Behandelnden zugewiesen.

- Benachrichtigungen: E-Mails an Moderator:innen bei neuer Meldung, an Ersteller:in bei Statusänderung.

- Übersichten & Suche: Tabellen mit Sortierung (Titel, Kategorie, Priorität, Status, Eingangsdatum) und Live-Suche im Titel.

- Rollen & Rechte: USER sehen/bearbeiten nur eigene Meldungen; MODERATOR/ADMIN haben erweiterte Rechte (Zuweisung, Statuswechsel, Verwaltung).

- Responsives UI: optimiert für Desktop und Mobile.

Durch das Zusammenspiel aus Rollenmodell, klaren Statusregeln und Benachrichtigungen bleibt der Bearbeitungsprozess nachvollziehbar und effizient; gleichzeitig sorgen Validierungen, restriktive Upload-Regeln und serverseitige Sessions für Sicherheit und Datenschutz.


== Zielbild und Qualitätsziele

Ziel war eine schlanke, sichere und nachvollziehbare Webanwendung, die Studierenden das einfache Melden von Korrektur- und Verbesserungshinweisen ermöglicht und Tutor:innen sowie Administrator:innen einen effizienten, transparenten Bearbeitungsprozess bietet. Qualitativ steht Domain-Driven Design im Mittelpunkt: Die Fachlogik ist in der Domain gekapselt; Invarianten wie zulässige Statusübergänge und Rollenregeln werden dort zentral definiert und serverseitig durchgesetzt. Sicherheit und Datenschutz haben Vorrang (verifizierte Anmeldungen, minimale Datenerhebung, Anonymisierungsoption, restriktive Upload-Regeln). Wartbarkeit und Erweiterbarkeit werden durch Ports/Adapter, typsichere Migrationen und einen konsequenten CI-Prozess gewährleistet. Nachvollziehbarkeit entsteht durch die Historie sämtlicher Änderungen (Zeit, Akteur, Änderung) sowie ereignisbasierte Benachrichtigungen.


== Architekturüberblick

Unsere Anwendung folgt konsequent Domain-Driven Design (DDD). Die Fachlogik steckt in klar abgegrenzten Domänenobjekten (z. B. Report, User, Session, Comment). Darüber liegt der Application-Layer, der Anwendungsfälle orchestriert (z. B. Erstellen, Zuweisen, Kommentieren), Rollen- und Sichtbarkeitsregeln durchsetzt und Daten zwischen UI und Domäne mappt. Handler bilden dabei die Brücke zum UI: Sie validieren Requests, rufen die passenden Use-Cases auf und liefern schlanke Antworten zurück. So bleibt das Frontend leichtgewichtig, während die Geschäftslogik sauber in der Domain isoliert und von der Infrastruktur entkoppelt ist.

In Produktion (siehe @c4production) kommuniziert der Web-Browser direkt mit der Web-App auf Deno Deploy (Fresh: SSR + Islands). Die App spricht über Drizzle ORM mit PostgreSQL (Neon) und nutzt ein Mail-Gateway für Verifizierungen und Benachrichtigungen. TLS-Terminierung, Routing und die globale Edge-Auslieferung sind plattformseitig gemanagt; ein eigener Reverse-Proxy ist nicht erforderlich. GitHub Actions übernimmt Build, Tests und das Ausrollen nach main; PR-Previews inklusive temporärem Neon-Branch können automatisiert bereitgestellt und beim Schließen wieder bereinigt werden.

#figure(
  image("images/C4_Container_Production.png"),
  caption: flex-caption(
    [C4-Containerdiagramm Produktion\ Quelle: Eigene Darstellung],
    [C4-Containerdiagramm Produktion],
  ),
) <c4production>

In der lokalen Entwicklung (siehe @c4local) laufen die Container in Docker Compose: App (Deno + Fresh), PostgreSQL und Mailpit für Test-E-Mails. Das Makefile vereinheitlicht den Ablauf (Starten/Stoppen, Tests, E2E, SQL-Migrationen), wodurch alle Teammitglieder ohne aufwändige Einrichtung einsteigen und identische Schritte auch in der CI widerspiegeln können.

#figure(
  image("images/C4_Container_Local.png"),
  caption: flex-caption(
    [C4-Containerdiagramm Lokal\ Quelle: Eigene Darstellung],
    [C4-Containerdiagramm Lokal],
  ),
) <c4local>

== Technologiestack

Für die Umsetzung nutzen wir TypeScript auf der Deno-Laufzeit und das Full-Stack-Framework Fresh. Fresh kombiniert serverseitiges Rendering (SSR) mit der Islands-Architektur, sodass nur tatsächlich interaktive Teile clientseitig hydratisiert werden. Das sorgt für kurze Ladezeiten und einen übersichtlichen Frontend-Code.

Die Persistenzschicht setzen wir mit Drizzle ORM um: Schema-as-Code, typsichere SQL-Abfragen und nachvollziehbare Migrationen verknüpfen unsere Domänenmodelle direkt mit PostgreSQL. Für das Styling verwenden wir Tailwind CSS – damit entsteht ein konsistentes, responsives UI ohne schwergewichtige Komponentenbibliotheken.

Kurz zusammengefasst:

- Frontend/Server: Deno + Fresh (TypeScript), SSR + Islands

- Persistenz: PostgreSQL mit Drizzle (Schema, Migrationen, typed SQL)

- Styling: Tailwind CSS

- Validierung & Fehlerbehandlung: schlanke Handler, zentral gemanagte Domänenfehler

- E-Mail: Mailpit lokal (Entwicklung) / Resend als Mail-Gateway (Produktion)

- Deployment: Deno Deploy + Neon (PostgreSQL-Cloud-DB)

- Entwicklung: Docker Compose für lokale Services

In frühen Konfigurationsskizzen war ein Hosting mit Traefik (Reverse Proxy & Load Balancer) so wie Vercel mit Neon vorgesehen. Für das Produktivsystem haben wir uns jedoch für Deno Deploy mit Neon entschieden; damit entfällt Traefik zugunsten des Cloud-seitigen Routings und der gemanagten TLS/Edge-Auslieferung.

== Schichten & Verantwortlichkeiten
Die Presentation-Schicht (Routes/Islands) ist für Views und Formulare zuständig und bleibt frei von Geschäftslogik. Der Application-Layer orchestriert Use-Cases (z. B. Report anlegen, Status wechseln, zuweisen), setzt Rollen- und Sichtbarkeitsregeln durch und delegiert an Domain-Services. In der Domain liegen Entities, Value Objects und Invarianten; die Statuslogik sowie Regeln für Anhänge (PNG/JPG bis 1 MB) und Anonymisierung sind hier verankert. Die Infrastructure implementiert die Ports (Drizzle-Repos, Mail-Gateway) und bindet PostgreSQL sowie E-Mail-Versand an.

== Automatisierung & Entwickler Workflow
Ein zentrales Hilfsmittel ist unser Makefile, das wiederkehrende Aufgaben vereinfacht und vereinheitlicht:

#figure(
  table(
    columns: 3,
    align: left,
    table.header([*Befehl*], [*Was es tut?*], [*Zweck*]),
    [make start], [Führt deno check aus und startet dann docker compose up.], [Lokales System (App, DB, Mailpit) hochfahren.], 
    [make clean], [docker compose down.], [Lokale Services sauber stoppen.],
    [make lint], [deno lint], [Stil- und Regelverstöße finden.],
    [make check], [deno check], [TypeScript-Typprüfung.],
    [make test], [deno lint + deno check + deno test --allow-env --allow-net --allow-run --allow-read --doc --parallel], [Stil- und Regelverstöße finden, TypeScript-Typprüfung und Unit-/Modultests ausführen.],
    [make test-coverage], [Wie make test, zusätzlich --coverage=coverage.], [Testabdeckung messen. Coverage-Artefakte im Ordner coverage/.],
    [make e2e], [make clean und dann npm run test (Playwright).], [End-to-End-Flows prüfen.],
    [make sql], [npx drizzle-kit generate --config drizzle.config.ts --name <NAME>.], [DB-Migrationen generieren. Optional NAME: make sql NAME=add-report-status-index.],
  ),
    caption: flex-caption(
    [Makefile Befehle\ Quelle: Eigene Darstellung],
    [Makefile Befehle],
  ),
)


Alle Teammitglieder nutzen dadurch dieselben Befehle – ideal, um den Workflow 1:1 in CI/CD zu spiegeln und Reproduzierbarkeit sicherzustellen.

== Lokale Umgebung & Reproduzierbarkeit

Die lokale Entwicklungsumgebung ist in Docker vollständig containerisiert: Die App (Frontend und Backend im selben Container), Mailpit für Test-E-Mails und PostgreSQL laufen als separate Services. So ist die Umgebung jederzeit reproduzierbar und stabil; neue Teammitglieder können ohne aufwändige Einrichtung starten.

== Bereitstellung & CI/CD

Für das Deployment setzen wir auf Cloud-Dienste: Die App läuft auf Deno Deploy, die produktive Datenbank auf Neon PostgreSQL. Lokal fängt Mailpit E-Mails ab; in Produktion werden Benachrichtigungen an reale Postfächer zugestellt.

Die GitHub Workflows automatisieren Qualitätssicherung und Auslieferung:

- Ein Test-Workflow führt Linting, Type-Checks und Tests (inkl. Coverage) aus.
- Ein Playwright-Workflow startet die E2E-Tests und speichert Berichte als Artefakte.
- Der Deploy-Workflow veröffentlicht Änderungen auf main automatisch zu Deno Deploy.
- Ein Preview-Workflow erstellt für jeden Pull Request eine temporäre Vorschauumgebung samt Neon-DB-Branch, der beim Schließen des PRs wieder bereinigt wird.

#pagebreak()
= Durchführung und Implementierung

Die Durchführung orientierte sich grundsätzlich an Scrum, wurde jedoch
pragmatisch an die Rahmenbedingungen eines kleinen Teams angepasst. Unser Ansatz
war inkrementell: Funktionen wurden schrittweise entwickelt, getestet und direkt
integriert. So standen uns kontinuierlich nutzbare Zwischenstände zur Verfügung.

Ein formelles Sprint Planning gab es nicht. Stattdessen besprachen und
priorisierten wir Aufgaben in wöchentlichen Meetings. Auf Daily Standups
verzichteten wir; stattdessen erfolgte Austausch bei Bedarf ad-hoc über WhatsApp
oder spontane Meetings. Die Iterationen orientierten sich lose an zweiwöchigen
Sprints, wurden aber flexibel gehandhabt. So konnten wir kurze Feedbackzyklen
mit der nötigen Anpassungsfähigkeit kombinieren. Retrospektiven ersetzten wir
durch fortlaufendes Feedback in Meetings, Pull Requests und Chats. Zusätzlich
berichteten wir unserem Tutor etwa monatlich über den Fortschritt.

== Qualitätssicherung

Zur Sicherstellung der Qualität setzten wir auf automatisierte Tests, Code
Reviews und Styleguides. Domain Driven Design erhöhte die Testbarkeit durch eine
modulare Struktur @Efatmaneshnik2017. Ergänzend nutzten wir TDD
(Test-Driven-Development), um das Verhalten zunächst in Tests zu beschreiben,
bevor implementiert wurde @Slyngstad2008. Dies reduzierte die Wahrscheinlichkeit
für Bugs und erleichterte die Regressionstests.

Alle Änderungen wurden über Pull Requests eingebracht und von mindestens einem
weiteren Teammitglied geprüft. GitHub Actions führten automatisch Format- (deno
fmt) und Testprüfungen aus, wodurch Konsistenz und Codequalität gewährleistet
wurden.

Wir setzten Unit- und Integrationstests ein, die bei jedem PR automatisiert
liefen. End-to-End-Tests wurden zunächst textuell beschrieben und später mit
Playwright teilautomatisiert. Neben der Codequalität verglichen wir regelmäßig
die Ergebnisse mit der Dokumentation, um Inkonsistenzen frühzeitig zu erkennen.

Neben der reinen Codequalität wurden auch zentrale Ergebnisse in regelmäßigen
Abständen vom Team gegen die Dokumentation geprüft. So konnten Inkonsistenzen
frühzeitig erkannt und behoben werden, bevor sie in die finalen Artefakte
übernommen wurden.

Eine formale Definition of Done hatten wir nicht. Faktisch musste Code jedoch
reviewed sein und alle Tests bestehen. Für zukünftige Projekte erscheint uns
eine explizite Definition sinnvoll, um Qualitätskriterien klarer festzuhalten.

== Zentrale Komponenten

Im Rahmen der Implementierung setzten wir die Kernfunktionen schrittweise um.
Herzstück war die Verwaltung von Meldungen: Erstellen, Bearbeiten und
Nachverfolgen entlang eines Lebenszyklus - von "Neu" bis "Gelöst/Abgeschlossen"
oder "Abgelehnt". Kategorisierung und Priorisierung unterstützten die
Strukturierung. Eine Löschfunktion ließen wir bewusst weg, um den Prototyp
schlank zu halten.

Zur Förderung der Kommunikation ergänzten wir eine Kommentar-Funktion.
Zusätzlich implementierten wir ein Benachrichtigungssystem per E-Mail: Tutoren
und Admins wurden bei neuen Meldungen informiert, Autoren bei Statusänderungen.

Ein weiteres zentrales Element war die Benutzer- und Rollenverwaltung. Admins
und Tutoren konnten alle Nutzer einsehen. Jedoch können lediglich Admins Rollen
von Benutzern ändern. Das Rollensystem unterscheidet zwischen Admin, Tutor und
der Standardrolle Member. Auf das Löschen von Benutzern verzichteten wir hier
ebenfalls.

#figure(
  table(
    columns: (2fr, 1fr, 1fr, 1fr),
    table.header[Berechtigung][Member][Tutor][Admin],
    "Kann alle Meldungen anzeigen",
    [#emoji.prohibited],
    [#emoji.checkmark.box],
    [#emoji.checkmark.box],

    "Kann alle Benutzer auflisten",
    [#emoji.prohibited],
    [#emoji.checkmark.box],
    [#emoji.checkmark.box],

    "Kann zugewiesene Rolle von Benutzern ändern",
    [#emoji.prohibited],
    [#emoji.prohibited],
    [#emoji.checkmark.box],

    "Kann eigene Meldung anzeigen",
    [#emoji.checkmark.box],
    [#emoji.checkmark.box],
    [#emoji.checkmark.box],

    "Kann Meldung erstellen",
    [#emoji.checkmark.box],
    [#emoji.checkmark.box],
    [#emoji.checkmark.box],

    "Kann Meldung bearbeiten",
    [#emoji.noentry\ (lediglich eigene Meldung)],
    [#emoji.checkmark.box],
    [#emoji.checkmark.box],

    "Kann Status einer Meldung ändern",
    [#emoji.prohibited],
    [#emoji.checkmark.box],
    [#emoji.checkmark.box],

    "Kann Priorität einer Meldung ändern",
    [#emoji.prohibited],
    [#emoji.checkmark.box],
    [#emoji.checkmark.box],

    "Kann Zuweisung einer Meldung ändern",
    [#emoji.prohibited],
    [#emoji.checkmark.box],
    [#emoji.checkmark.box],

    "Kann einen Kommentar zu einer Meldung erstellen",
    [#emoji.noentry\ (lediglich bei eigener Meldung)],
    [#emoji.checkmark.box],
    [#emoji.checkmark.box],
  ),
  caption: flex-caption(
    [Auflistung der einzelnen Berechtigungen je nach Rolle.\ Quelle: Eigene
      Darstellung],
    [Auflistung der einzelnen Berechtigungen je nach Rolle.],
  ),
)

Die Authentifizierung erfolgt über ein klassisches Login- und
Registrierungssystem, das durch E-Mail-Verifizierung abgesichert wurde.

Zur besseren Übersichtlichkeit implementierten wir jeweils ein Dashboard für
Meldungen sowie für die Auflistung von Benutzern. Diese boten einen zentralen
Einstiegspunkt in die Anwendung und ermöglichten eine schnelle Orientierung über
den aktuellen Stand der eingereichten Meldungen sowie der existierenden Nutzer.

Mit dieser Kombination aus Funktionen entstand ein System, das sowohl die
Erfassung und Verwaltung von Meldungen als auch die Koordination zwischen
Benutzern unterstützt und gleichzeitig auf Transparenz, Nachvollziehbarkeit und
Benutzerfreundlichkeit ausgerichtet ist.

== Herausforderungen und Lösungen <herausforderungen>

Im Verlauf der Implementierung traten verschiedene technische, organisatorische
und methodische Herausforderungen auf, die wir jeweils mit pragmatischen
Lösungen bewältigt haben.

1. Begrenzte GitHub Actions Minuten und ineffiziente Nutzung
Für private Repositories stellt GitHub ein monatliches Kontingent an kostenlosen
Actions-Minuten bereit, 3000 Minuten (für Standard-Linux-Jobs), sofern der
Pro-Plan verwendet wird @ghActionsBilling2025. Diese Variante hatten wir in
Verwendung. GitHub verrechnet jedoch jede gestartete Sekunde, aufgerundet auf
volle Minuten - selbst kurze Jobs können daher übermäßig Minuten verbrauchen.

Bei uns führte eine unkritische Konfiguration der Workflows dazu, dass mehrere
Jobs stundenlang liefen, ohne aussagekräftigen Output zu liefern. Das brachte
uns schnell an das Minuten-Limit. Erst durch Anpassung der GitHub Actions durch
das Setzen von Zeitlimits und optimierte Workflow-Logik, konnten wir den
Verbrauch deutlich senken und die Mehrkosten begrenzen.

2. Overhead durch Domain-Driven Design
Für die Strukturierung des Projekts orientierten wir uns am Domain-Driven Design
(DDD). Dies erleichterte das Testen und gab eine klare modulare Trennung vor,
erforderte jedoch initial einen höheren konzeptionellen Aufwand. Dieser
Mehraufwand zahlte sich im weiteren Verlauf aus, als Funktionalitäten
aufeinander aufbauten und Tests modular wartbar blieben.

3. Instabilität des Deno Language Servers
Während der Nutzung von Deno in Visual Studio Code kam es wiederholt zu
Abstürzen des Language Servers. Dieser zeigte fälschlicherweise Fehler im Code
an, obwohl keine vorhanden waren. Die Problemumgehung bestand darin, den
Language Server manuell neu zu starten, sobald solche Symptome auftraten - eine
einfache, aber wirkungsvolle Maßnahme, die uns deutlich Zeit ersparte.

4. Kostenfreie Implementierung von Transactional Emails
Wir benötigten E-Mail-Verifizierung und Benachrichtigungen, ohne zusätzliche
Kosten zu verursachen. Nach Recherche stießen wir auf Resend.com, das eine
kostenlose Stufe mit bis zu 3000 E-Mails pro Monat (max. 100 pro Tag) und eine
Domain ermöglicht @resendFreeTier2025. Dank der Nutzung einer bestehenden Domain
von Benjamin Falk konnten wir eine Subdomain (iu.flk.onl) einrichten und Resend
effizient einsetzen.

5. Teaminterne Entscheidungen und Zeitmanagement
Da wir berufsbegleitend arbeiteten, war es nicht immer leicht, gemeinsame
Entscheidungen zu treffen. Im Konfliktfall half uns eine demokratische
Abstimmung, um Blockaden zu vermeiden. Zudem fiel es uns manchmal schwer,
Sprints zeitlich klar abzugrenzen - unvollständige Tickets wurden häufig einfach
überzogen und erst 1-2 Tage später abgeschlossen. Hier zeigt sich
Verbesserungspotenzial: z. B. die strikte Anwendung von „Definition of Done“ und
die konsequente Verschiebung offener Tickets in den nächsten Sprint.

6. Minimierung von Zeitplanverzögerungen
Das Risiko der Verzögerung im Zeitplan konnten wir durch klare und regelmäßige
Abstimmungen sowohl mit dem Kunden als auch innerhalb des Teams deutlich
reduzieren. Dies half uns, Abhängigkeiten frühzeitig zu erkennen und mögliche
Blockaden schnell zu lösen.

7. Fehlende Erfahrung mit neuen Technologien
Die fehlende Erfahrung mit den eingesetzten Technologien stellte zu Beginn eine
zusätzliche Hürde dar. Wir begegneten diesem Risiko durch gezielte Schulungen,
gemeinsame Meetings und Wissensaustausch, sodass das Team nach kurzer Zeit
effizient mit den Tools arbeiten konnte.

8. Sicherheit und Audits
Wir sind auf Sicherheitslücken und Security Audits im Projektverlauf nicht
eingegangen. Grundsätzlich sollten jedoch in regelmäßigen Abständen Audits
durchgeführt werden, um potenzielle Schwachstellen zu identifizieren und die
Systemstabilität langfristig sicherzustellen.

9. Umgang mit weiteren Risiken
Auf andere Risiken wurde aufgrund der Natur der Projektarbeit nur kaum oder gar
nicht eingegangen. Für ein reales Produktionssystem wäre hier eine
systematischere Risikobetrachtung erforderlich.


#pagebreak()
= Qualitätssicherung und Testing

== Zielsetzung und Qualitätsprinzipien

Ziel der Qualitätssicherung ist es, die funktionale Korrektheit, Stabilität und Benutzungsfreundlichkeit der Webanwendung sicherzustellen und Regressionen früh zu erkennen. Wir kombinieren automatisierte und manuelle Tests und verankern die Prüfungen fest in Entwicklungs- und Review-Prozesse. Die Testdokumentation beschreibt Strategie, Testarten, Durchführung, Ergebnisse sowie die eingesetzten Werkzeuge und Umgebungen und dient als nachvollziehbarer Qualitätsnachweis.

Wir verfolgen drei Grundprinzipien: (1) Testbarkeit durch klar formulierte Domänenregeln, (2) Reproduzierbarkeit durch containerisierte, isolierte Umgebungen, (3) Automatisierung über einheitliche Kommandos und CI-Gates. Akzeptanzkriterien werden als Testfälle formuliert und iterativ geprüft. In Summe sorgt die Kombination aus Testpyramide, separaten Umgebungen, standardisierten Kommandos, Coverage-Transparenz im PR, E2E-Szenarien und einem strengen Review-Prozess für eine ganzheitliche Absicherung der Qualität.

#figure(
  table(
    columns: (2fr, 2fr, 3fr),
    align: left,
    table.header([*Grundprinzip*], [*Kurzbeschreibung*], [*Konkrete Maßnahmen / Nachweise*]),

    [Testbarkeit durch klare Domänenregeln],
    [Domänenlogik ist kapselbar und deterministisch testbar; Invarianten sind zentral in der Domain definiert und werden serverseitig durchgesetzt.],
    [DDD-Entities/Value Objects; Invarianten (Statusübergänge, RBAC); Unit-Tests auf Service-Ebene; sprechende Fehlermeldungen als Teil der Spezifikation.],

    [Reproduzierbarkeit durch containerisierte, isolierte Umgebungen],
    [Testläufe liefern identische Ergebnisse – unabhängig von Entwickler-Rechnern oder CI.],
    [Docker Compose (App, DB, Mailpit); frische Test-DB/Migrationen pro Lauf; deterministische Fixtures/Seeds; identische Make-Kommandos lokal und in CI.],

    [Automatisierung über einheitliche Kommandos und CI-Gates],
    [Qualitätsprüfungen laufen automatisiert und blockieren Merges bei Verstößen.],
    [Make-Kommandos (make test-coverage, make e2e); CI-Workflows für Lint, Type-Check, Tests und E2E; Coverage-Kommentar im PR; Branch-Protection; E2E-Artefakte (Screenshots/Traces).],
  ),
  caption: flex-caption(
    [Grundprinzipien der Qualitätssicherung \ Quelle: Eigene Darstellung],
    [Grundprinzipien der Qualitätssicherung],
  ),
)
== Teststrategie, Abdeckung und Umgebungen

Unsere Strategie folgt der Testpyramide: Unit-Tests sichern die Fachlogik auf kleinem Scope, Integrationstests prüfen das Zusammenspiel von Komponenten (z. B. Domain-Service und Datenbank), End-to-End-Tests (E2E) verifizieren reale Nutzerflüsse im Browser. Ergänzend führen wir manuelle UI/UX-Tests für Darstellung, Bedienbarkeit und visuelle Konsistenz durch.

Testumgebungen. Für Akzeptanztests existiert eine separate Testumgebung, die produktionsnah betrieben wird und kontrollierte Rahmenbedingungen bietet. Automatisierte Unit-/Integrationstests laufen in isolierten Containern; so bleibt die Basis reproduzierbar – unabhängig von lokalen Maschinen. Zum Einsatz kommen u. a. Deno (App & Tests), Docker (Container/Isolation), das Fresh-Framework (SSR/Islands) sowie Browser für UI-Tests.

Abdeckung und Messung. Die automatisierten Tests decken die kritische Geschäftslogik und zentrale API-Endpunkte ab (u. a. Meldungsverarbeitung, Statuswechsel, Rechte, Validierungen und Fehlerszenarien). Die Coverage wird in der CI als PR-Kommentar ausgewiesen (Barecheck); UI-Aspekte werden bewusst verstärkt manuell überprüft.

== Testarten – Inhalte und Beispiele

=== Unit- und Integrationstests

Unit-Tests prüfen Funktionen/Methoden isoliert – Fokus sind Geschäftslogik und Hilfsfunktionen im Backend (z. B. Erzeugung/Parsing/Prüfung von E-Mail-Verifizierungscodes, Eingabevalidierungen, Session-Regeln). Die Tests sind schnell und deterministisch und belegen Fehlersituationen explizit. 
Integrationstests stellen sicher, dass Domain-Services, Repositories/ORM und Infrastruktur korrekt zusammenspielen (z. B. Report anlegen/ändern, Statuswechsel mit Berechtigungsprüfung, Fehler bei nicht existierenden Entitäten). Hier laufen echte Migrationen gegen eine Test-DB; typische Fehlerbilder werden über passende Exceptions/HTTP-Codes sichtbar gemacht.
Die Unit- und Integrationstests werden mit deno test ausgeführt; sie laufen deterministisch und schnell und liefern bei Bedarf Coverage für die CI.


=== End-to-End-Tests (E2E)

E2E-Tests werden mit Playwright im echten Browser ausgeführt. Sie simulieren komplette Nutzerflüsse, zum Beispiel von der Registrierung über die E-Mail-Verifizierung bis zum Login (per Benutzername oder E-Mail), das Erstellen und Bearbeiten von Meldungen inklusive Anhängen und Statusänderungen, das Sichten, Filtern und Suchen in Tabellen sowie wichtige Negativfälle (falsche Anmeldedaten, unverifiziertes Konto, abgelaufene Session). Playwright prüft damit Rendering, Routing, Formulare und Cookies realitätsnah; bei Fehlschlägen werden Screenshots, Videos und Traces als Artefakte gespeichert.

=== Manuelle Tests

Manuelles Testen adressiert Bereiche, in denen automatisierte Verfahren nur eingeschränkt greifen: UI, UX, Responsiveness und feine visuelle Details. Diese Prüfungen begleiten die Sprints, identifizieren UI-Unstimmigkeiten und fließen als Issues zurück in die Entwicklung (mit Reproduktion und Schweregrad).

== Durchführung, Werkzeuge und Automatisierung

Die Tests werden iterativ entlang der Implementierung ausgeführt: automatisierte Unit-/Integrationstests bereits während der Entwicklung, E2E- und manuelle Tests nach Inkrementen aus Nutzersicht. Automatisierte Läufe erfolgen lokal wie in der CI über standardisierte Make-Kommandos:

- make test: führt deno test (Unit/Integration).

- make test-coverage: führt deno test (Unit/Integration) inklusive Coverage aus.

- make e2e: startet die Playwright-Suite im Browser und speichert Screenshots/Traces als Artefakte.

Die Testumgebung ist containerisiert (Docker) und damit reproduzierbar; die Coverage wird als PR-Kommentar ausgewiesen (Barecheck).

Werkzeuge:

- deno test – Ausführung von Unit-/Integrationstests inklusive Coverage

- Playwright – browserbasierte E2E-Tests (Screenshots/Traces)

- Docker – isolierte, reproduzierbare Umgebungen

- Fresh – SSR/Islands, Grundlage für UI-nahe Tests

- Barecheck – Coverage-Berichte direkt im PR-Thread

== Ergebnisse, Erkenntnisse und Einschränkungen

Die durchgeführten Unit-, Integrations- und End-to-End-Tests decken die Kernfunktionalitäten ab und bestätigen die korrekten Abläufe für die wichtigsten Nutzerpfade (Registrierung/Verifizierung, Login, Meldung anlegen/bearbeiten, Upload-Regeln, Zuweisung, Statuswechsel, Suche/Sortierung). Fehlschläge in einzelnen Läufen führten zu Korrekturen (z. B. Anpassungen bei Validierungen, klarere Fehlermeldungen, UI-Konsistenz). Erst nach behobenen Befunden wurden Änderungen gemergt; damit waren die zuletzt ausgeführten CI-Pipelines einschließlich E2E grün. Manuelle Checks bestätigten Darstellung und Bedienbarkeit der zentralen Masken auf Desktop und Mobilgeräten.

Erkentnisse:

- Fehler lassen sich früh und gezielt finden, wenn Domänenregeln als Invarianten vorliegen und über Unit-Tests abgesichert werden.

- Bugfix-Vorgehen: Zuerst einen reproduzierenden Test schreiben, dann die Korrektur – erhöht die Belegbarkeit und verhindert Regressionen.

- Wahrgenommene Qualität hängt neben Funktionalität stark von Responsiveness, Fehlermeldungen und Nutzerführung ab; kleine UI-Kanten wurden durch kurze Iterationen schnell geschlossen.

- Klare Akzeptanzkriterien beschleunigen die Testbarkeit; unklare Anforderungen verzögern Tests und sollten früh präzisiert werden.

Einschränkungen und nächste Schritte:

- Breite statt Vollständigkeit: Nicht jede Funktion ist mit gleicher Tiefe getestet. Die E2E-Suite fokussiert auf hochriskante Flows; weniger kritische Pfade sind (noch) manuell abgedeckt.

- Validierungen & Fehlermeldungen: Für einige Randfälle bestehen Optimierungspotenziale (präzisere Meldungen, konsistente Feldhinweise).

== Qualitätssicherung durch Reviews (Artefakt-Prüfung)

Neben Tests ist Code- und Artefakt-Review integraler Bestandteil der Qualitätssicherung. Im Projekt wurden 97 Pull Requests auf Funktionalität, Struktur, Verständlichkeit, Testbarkeit und Dokumentation geprüft; Merges sind nur möglich, wenn alle Reviews als „resolved“ markiert sind. Die tabellarische Übersicht dokumentiert Titel, Status und Bemerkungen; das Fazit hält fest, dass die zentralen Komponenten stabil, dokumentiert und präsentationsfähig sind.

= Ergebnisse

Die Ergebnisse unserer Projektarbeit lassen sich sowohl aus technischer als auch aus 
organisatorischer Sicht bewerten. Mit CorrectHub haben wir einen funktionalen Prototyp erstellt, 
der die in der Aufgabenstellung definierten Kernanforderungen erfüllt und sich bereits in 
einer praxisnahen Umgebung demonstrieren lässt. Im Verlauf der Bearbeitung konnten wir die 
im Projektplan definierten Meilensteine schrittweise erreichen. Zu Beginn lag der Fokus in 
Meilenstein 1 auf der Projektorganisation, der Aufgabenverteilung und der Einarbeitung in die 
notwendigen Technologien. In Meilenstein 2 erstellten wir ein Projektvideo, das erste Konzepte 
und die geplante Vorgehensweise präsentierte und für ein gemeinsames Verständnis im Team sorgte. 
Meilenstein 3 diente der weiteren Verfeinerung des Konzepts und der Abstimmung der 
Umsetzungsstrategie. Besonders prägend waren jedoch Meilenstein 4 (Bereitstellung der 
zentralen Artefakte) und Meilenstein 5 (Ergebnispräsentation als Screencast), die den 
Übergang von der reinen Konzeptionsphase hin zur nutzbaren Anwendung markierten.


== Anforderung & Umsetzung

Der in Meilenstein 4 veröffentlichte Prototyp enthält alle wesentlichen Funktionen, die für ein Korrekturmanagementsystem notwendig sind:

#figure(
  table(
    columns: (2fr, 3fr),
    table.header[Anforderung][Umsetzung in CorrectHub],

    "Schnelles und einfaches Melden von Fehlern",
    [Eingabeformular mit Titel, Kategorie, Beschreibung und optionalen Anhängen; minimale Pflichtfelder für schnelle Nutzung],

    "Zentrale Sammlung und Verwaltung",
    [Alle Meldungen werden in einer Datenbank gespeichert; Darstellung im Dashboard mit Filterung nach Titel Kategorie, Status, Priorität und Eingangsdatum],

    "Nachverfolgbarkeit über den Lebenszyklus",
    [Statusstufen (*Neu*, *In Arbeit*, *In der Überprüfung*, *Gelöst und Abgeschlossen*, *Abgelehnt*), Verlaufsprotokoll und Kommentarfunktion zur lückenlosen Dokumentation],

    "Kategorisierung und Priorisierung",
    [Tutoren/Admins können Meldungen kategorisieren und mit Prioritäten versehen],

    "Transparente Kommunikation",
    [Kommentarfunktion direkt an der Meldung; automatische Benachrichtigung per E-Mail bei Statusänderungen],

    "Klare Rollen- und Rechteverteilung",
    [Rollenmodell (Member, Tutor, Admin) mit abgestuften Rechten; Administratoren verwalten Nutzer und Rollen],
  ),
  caption: flex-caption([Erfüllung der Anforderungen durch den Prototyp CorrectHub \ Quelle: Eigene Darstellung],[Erfüllung der Anforderungen durch den Prototyp CorrectHub])
)

Diese Funktionen wurden im Screencast zu Meilenstein 5 anhand einer kurzen Demo demonstriert. Dadurch konnte gezeigt werden, dass die Kernprozesse des Korrekturmanagements nicht nur konzeptionell, sondern auch praktisch umgesetzt wurden.

== Demonstration

Zur besseren Veranschaulichung wurden im Rahmen der Ergebnispräsentation Screenshots des Prototyps dokumentiert. Diese zeigen die wichtigsten Ansichten und Interaktionen:

#figure(
  image("images/login.png", width: 70%),
  caption: flex-caption([Login \ Quelle: Eigene Darstellung],[Login])
)

#figure(
  image("images/dashboard.jpg", width: 85%),
  caption: flex-caption([Dashboard \ Quelle: Eigene Darstellung],[Dashboard])
)

#figure(
  image("images/meldungerstellen.png", width: 50%),
  caption: flex-caption([Meldung erstellen \ Quelle: Eigene Darstellung],[Meldung erstellen])
)

#figure(
  image("images/vorschau.png", width: 45%),
  caption: flex-caption([Meldungsvorschau \ Quelle: Eigene Darstellung],[Meldungsvorschau])
)

#figure(
  image("images/benutzerverwaltung.png", width: 50%),
  caption: flex-caption([Benutzer und Rollenverwaltung. \ Quelle: Eigene Darstellung],[Benutzer und Rollenverwaltung.])
)

Ein Teil der Screenshots wurden als begleitendes Material zum Screencast in Meilenstein 5 aufbereitet und dienen als visuelle Referenz für die im Text beschriebenen Funktionen.

== Bewertung der Ergebnisse

Die im Rahmen der Projektarbeit erstellte Anwendung CorrectHub erfüllt die in der Aufgabenstellung definierten Kernanforderungen in hohem Maße. Die prototypische Umsetzung hat gezeigt, dass die wesentlichen Funktionen für ein Korrekturmanagementsystem erfolgreich realisiert werden konnten.

Einschränkungen bestehen lediglich in Bereichen, die bewusst nicht Teil des Prototyps waren, etwa erweiterte Filtermöglichkeiten oder eine umfassende mobile Optimierung. Diese Aspekte wurden aus Gründen der Fokussierung etwas zurückgefahren und stellen potenzielle Erweiterungen für zukünftige Anpassungen dar.
Insgesamt kann festgehalten werden, dass CorrectHub in der aktuellen Ausbaustufe als stabiler und nachvollziehbarer Prototyp eingesetzt werden kann, der die Kernprozesse eines Korrekturmanagementsystems abbildet und die geforderte Funktionalität nachweist.

#pagebreak()
= Fazit & Reflexion

Zu Beginn des Projekts standen wir vor einigen Startschwierigkeiten, etwa bei
der Abgrenzung zwischen Modul- und Projektarbeit, die wir gemeinsam mit dem
Tutor klärten. Auch die Arbeit mit Deno und Fresh war für uns neu, doch wir
gewöhnten uns rasch an die Eigenheiten und holten die anfänglich verlorene Zeit
durch fokussierte Arbeitsweise wieder auf.

Die Aufgaben wurden anhand individueller Stärken transparent über Redmine
verteilt. Klare Konventionen, konsistente Typisierung und ein gemeinsames
Architekturverständnis reduzierten Integrationsaufwände. Die Orientierung an
Domain-Driven-Design sowie erste Erfahrungen mit TDD erwiesen sich als
lehrreich, auch wenn die Einhaltung der Sprint-Zeitpläne noch konsequenter hätte
erfolgen können. Redmine war für einige eine Umstellung und nicht immer einfach
in der Handhabung.

Im Team unterstützten wir uns gegenseitig, insbesondere durch regelmäßige
Pull-Request-Reviews. Konflikte lösten wir durch direkte Gespräche oder
demokratische Entscheidungen. Die Rollenverteilung funktionierte insgesamt gut,
wurde aber flexibel gehandhabt.

Das Projekt wurde erfolgreich als Prototyp abgeschlossen. Verbesserungsbedarf
besteht vor allem bei der Benutzerverwaltung (z. B. Passwortänderungen,
Benutzerprofile) sowie bei der Optimierung der Meldungen für eine flüssigere
User-Experience. Rückblickend hätten wir einzelne Funktionen - wie die
Kommentar-Funktion - effizienter oder gar nicht umsetzen sollen.

Neben der technischen Umsetzung war das Projekt auch ein Lernprozess in
Organisation, Teamarbeit und Prozessmanagement. Persönlich nahmen wir neue
Erfahrungen im Umgang mit Redmine sowie in agiler Zusammenarbeit mit.

Insgesamt entstand ein funktionaler Prototyp mit klaren Schnittstellen und
stabilen Abläufen, der als solide Basis für künftige Weiterentwicklungen dient.

#todo[Anhang]

- Gantt-Diagramm / Projektplan
- Datenbankmodell?
- Testberichte?
- Benutzerhandbuch und README?

#todo[Quellenverzeichnis]

- Fachliteratur
- Dokumentationen
- Tutorials
- Framework-Webseiten
- etc.

---

#todo[Korrekte Seitenanzahl in Tabelle eintragen]
#todo[Kontrolle ob auf die folgenden Themen eingegangen wurde:]
- GH + PR + Actions
- Nochmal auf Scrum eingehen
- Beschreibung der zentralen Komponenten (Report, Authentifizierung, Kommentare,
  ...)
- Herausforderungen und deren Lösungen
- Beispielhafte Codeausschnitte wenns sinnvoll ist
- MS1 - Projektkonfiguration: *stimmt die immer noch? wo gab es Abweichungen*
  - https://redmine-se.iubh.de/attachments/download/4891/Projektkonfiguration-v2.pdf
- MS4 - auch die Tickets, die wir so in den Sprints bearbeitet haben
- MS3 - Dokumentationskonzept: *wurde es eingehalten?*
  - https://redmine-se.iubh.de/attachments/download/5000/Dokumentationskonzept.pdf
- Auf die bereits entstandenen Dokumente eingehen:
  - https://redmine-se.iubh.de/attachments/download/5444/Qualitaetssicherung_und_Review_der_Artefakte.pdf
  - https://redmine-se.iubh.de/attachments/download/5445/Anforderungsliste_und_Produkt_Backlog.pdf
  - https://redmine-se.iubh.de/attachments/download/5446/Handbuch.pdf
  - https://redmine-se.iubh.de/attachments/download/5447/Testdokumentation.pdf
