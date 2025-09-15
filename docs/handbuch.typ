#import "template-handbuch.typ": *

#show: project.with(
  title: [
    CorrectHub
  ],
  paper_type: "Handbuch",
  authors: (
    (
      name: "Benjamin Falk",
      role: "Projektleitung",
      matriculation_number: "31912112",
      study_program: text(
        hyphenate: false,
        [Wirtschafts-?informatik (B.Sc.)]
      ),
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


= Einleitung

Willkommen im Korrekturmanagementsystem *"CorrectHub"*!

Dieses Handbuch unterstützt Sie Schritt für Schritt bei der Nutzung des Systems. Es richtet sich an alle Nutzer:innen, die Korrekturmeldungen einreichen, bearbeiten oder nachverfolgen möchten – unabhängig vom Erfahrungsstand. Ziel ist es, die Kommunikation über fehlerhafte Inhalte oder Verbesserungsvorschläge effizient und transparent zu gestalten.

#figure(
  image("images/login.png"),
  caption: [Login-Seite]
)
= Registrierung

Bevor Sie das System nutzen können, ist eine Registrierung erforderlich. Gehen Sie auf die Startseite und klicken Sie auf den Button „Registrieren“. Füllen Sie das Formular mit Ihren persönlichen Angaben aus. Nach dem Absenden erhalten Sie eine Bestätigungs-E-Mail. Klicken Sie auf den darin enthaltenen Link, um Ihre Registrierung abzuschließen und Ihr Konto zu aktivieren.

= Anmeldung

Nach erfolgreicher Registrierung können Sie sich jederzeit mit Ihrer E-Mail-Adresse und Ihrem Passwort anmelden.
Sollten Sie Ihr Passwort vergessen haben, klicken Sie auf „Passwort vergessen?“, um ein neues Passwort anzufordern.

= Korrekturmeldung erstellen

Nach dem Login gelangen Sie zum Dashboard. Um eine neue Meldung zu erstellen, klicken Sie auf den Button „Meldung erstellen“, oben rechts auf der Seite.
Hinweis: In der mobilen Ansicht ist dieser Button im Menü hinter dem Symbol mit den drei Balken (☰) versteckt.
#figure(
  image("images/mobileview.png", width: 80%),
  caption: [Smartphone Ansicht]
)

== Neue Korrekturmeldung erstellen
Im Formular können Sie eine passende Kategorie auswählen:

-	*Inhaltlicher Fehler* – für fachliche oder sachliche Fehler
-	*Verbesserungsvorschlag* – für Änderungswünsche oder Optimierungen
-	*Sonstige* – wenn keine der oben genannten Kategorien zutrifft

Vergeben Sie anschließend einen aussagekräftigen Titel, der das Problem in wenigen Worten beschreibt.

Im nächsten Schritt haben Sie die Möglichkeit, den Sachverhalt im Feld „Beschreibung“ detailliert zu schildern. Eine präzise Beschreibung hilft den zuständigen Tutor:innen, Ihre Meldung schneller und zielgerichteter zu bearbeiten. Bitte verzichten Sie in diesem Feld auf das Einfügen von Links – dafür gibt es ein separates Eingabefeld.

Optional können Sie Anhänge (Punkt 4.2) oder Links (Punkt 4.3) hinzufügen.

Wenn gewünscht, können Sie Ihre Meldung vollständig anonym einreichen. In diesem Fall ist für niemanden ersichtlich, von wem die Meldung stammt – auch nicht für Tutor:innen oder das Admin-Team.

Wichtig:
Benutzer:innen können *nur ihre eigenen Meldungen* sehen. 

Tutor:innen oder Administrator:innen haben Zugriff auf alle eingereichten Meldungen – anonymisierte Meldungen erscheinen auch für sie ohne Namensangabe.

Abschließend klicken Sie auf den Button „Meldung einreichen“. Ihre Meldung erscheint daraufhin im Dashboard. Eine Zuweisung erfolgt durch den zuständigen Admin oder Tutor:in.

== Anhänge hinzufügen
Sie können Ihrer Meldung unterstützende Dateien wie Screenshots oder Fotos beifügen.

Beachten Sie dabei die folgenden Punkte:
-	*Unterstützte Dateiformate*: Es können ausschließlich Bilder im PNG- oder JPG-Format hochgeladen werden. Andere Dateitypen wie PDF oder ZIP sind nicht erlaubt – nutzen Sie hierfür bitte die Link-Funktion unter Punkt 4.3.
-	*Maximale Dateigröße*: Die maximal erlaubte Größe pro Datei beträgt 1 MB.
Tipp: Falls Ihre Bilddatei das Limit geringfügig überschreitet, können Sie sie mit einem kostenlosen Online-Komprimierungstool verkleinern (z.B. TinyPNG) und anschließend erneut hochladen.

== Links hinzufügen
Falls sich Ihre Meldung auf ein bereits vorhandenes Dokument bezieht (z.B. ein Skript, eine Folie oder eine Webseite), können Sie den zugehörigen Link im Feld „Links“ einfügen. So können die zuständigen Personen den Kontext Ihrer Meldung direkt nachvollziehen.

Alternativ eignet sich dieses Feld auch für größere Dateien wie PDFs oder Videos, die nicht als Anhang hochgeladen werden können (z.B. wegen des 1 MB-Limits). In diesem Fall laden Sie die Datei bitte in einen persönlichen Cloud-Speicher (z.B. Google Drive, Dropbox) hoch und fügen den öffentlich zugänglichen Link hier ein.

== Meldung bearbeiten
Nachdem Sie Ihre Meldung eingereicht haben, können Sie diese jederzeit überarbeiten.
Falls Sie nach dem Einreichen die Vorschau-Seite verlassen haben, kehren Sie über das Dashboard zur Detailansicht Ihrer Meldung zurück und klicken Sie dort auf „Bearbeiten“.
Sie können beispielsweise den Titel, die Beschreibung, Anhänge oder Links nachträglich bearbeiten bzw. erweitern.
Diese Funktion ist besonders hilfreich, wenn Sie zusätzliche Informationen ergänzen oder kleine Fehler in Ihrer ursprünglichen Eingabe korrigieren möchten.

= Verlauf & Kommentare
Unterhalb Ihrer Meldung finden Sie zwei Tabs: *Kommentare* und *Verlauf*.

Im Kommentarbereich können Sie direkt mit der zuständigen Lehrkraft (Tutor:in) kommunizieren. Rückfragen, Erklärungen oder Updates werden in chronologischer Reihenfolge dokumentiert. Auch Sie selbst können jederzeit neue Kommentare hinzufügen oder auf bestehende antworten.
#figure(
  image("images/Kommentar.png", width: 60%),
  caption: [Kommentar]
)

Der Verlauf stellt die komplette Historie Ihrer Meldung dar – übersichtlich und nachvollziehbar. Jede Änderung am Status (z.B. von „neu“ zu „in Bearbeitung“), an der Beschreibung oder an Anhängen wird automatisch protokolliert. Auch der Zeitpunkt und die ausführende Person werden aufgezeichnet.

So können Sie jederzeit einsehen:
- Wann Ihre Meldung erstellt wurde
- Welche Änderungen vorgenommen wurden
- Welche Aktionen von Tutor:innen oder Admins erfolgten
- Welche Inhalte bearbeitet oder ergänzt wurden

Der Verlauf erfüllt eine zentrale Anforderung des Systems: Transparenz und Nachvollziehbarkeit. Dadurch lassen sich Entscheidungen sowie Reaktionen besser verstehen und dokumentieren.
#figure(
  image("images/Verlauf.png", width: 60%),
  caption: [Verlauf]
)

= Filter- und Suchfunktionen
Um Ihre Korrekturmeldungen im Dashboard übersichtlich zu verwalten, stehen Ihnen hilfreiche Sortier- und Suchfunktionen zur Verfügung.
#figure(
  image("images/filter_search.png"),
  caption: [Filter- und Suchfunktionen]
)

*Sortierung*

Die Spalten in der Übersichtstabelle können durch einen Klick auf die kleinen Pfeile neben den jeweiligen Spaltennamen sortiert werden – entweder aufsteigend oder absteigend. 

Dies ist für folgende Spalten möglich:
-	Titel
-	Kategorie
-	Priorität
-	Status
-	Eingangsdatum
So können Sie zum Beispiel schnell die neuesten Meldungen anzeigen lassen oder gezielt alle Meldungen mit hoher Priorität gruppieren.

*Suchfunktion*

Oberhalb der Meldungsliste befindet sich ein Suchfeld, mit dem Sie gezielt nach Stichworten im Titel Ihrer Meldungen suchen können.
Die Liste wird während der Eingabe automatisch gefiltert, sodass nur relevante Ergebnisse angezeigt werden.

= Abmelden
Um Ihre Sitzung zu beenden, klicken Sie in der oberen Navigationsleiste auf „Logout“. Sie werden dadurch sicher vom System abgemeldet und zur Anmeldeseite zurückgeleitet.

Hinweis: Dieser Schritt ist besonders wichtig, wenn Sie das System auf einem öffentlichen oder fremden Gerät genutzt haben.
= Kontaktaufnahme
Bei technischen Problemen, Fragen zur Bedienung oder Unsicherheiten können Sie sich jederzeit an das Support-Team wenden. Die entsprechende E-Mail-Adresse finden Sie im Bereich „Kontakt“ in der Fußzeile der Webseite.