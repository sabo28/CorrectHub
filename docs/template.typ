#import "@preview/fletcher:0.4.2" as fletcher: node, edge

#let in-outline = state("in-outline", false)

// The project function defines how your document looks.
// It takes your content and some metadata and formats it.
// Go ahead and customize it to your liking!
#let project(
  title: "", subtitle: "", paper_type: "", authors: (), module_name: "", tutor_name: "", bibliography_file: "", hide_authors_table: false, body,
) = {
  // Set the document's basic properties.
  set document(author: authors.map(author => author.name), title: title)
  set page("a4", margin: 2cm)
  set text(
    font: ("Arial"), size: 11pt, lang: "de", ligatures: true, hyphenate: true,
  )
  set par(justify: true)
  set footnote.entry(gap: 1em)
  show footnote.entry: set text(size: 10pt)
  show underline: it => {
    text(emph(it.body))
  }

  set par(spacing: 1.5em + 6pt)

  v(2cm)

  // --- Title page
  align(center, image("iu-logo.jpg", width: 80%))

  // Title itself
  align(center, text(12pt, weight: 700, title))
  align(center, text(12pt, weight: 700, subtitle))
  align(center, text(12pt, paper_type))

  v(1cm)

  align(center, module_name)
  align(center, tutor_name)

  v(1cm)

  align(
    center, "Eingereicht am: " + datetime.today().display("[day].[month].[year]"),
  )

  v(1cm)

  if authors.len() > 1 and hide_authors_table == false {
    table(
      columns: (auto, 23%, 20%, auto, 15%), align: center + horizon, inset: (5pt, 10pt), table.header(
        table.cell(fill: gray)[Gruppe], table.cell(fill: gray)[Name], table.cell(fill: gray)[Martikelnummer], table.cell(fill: gray)[Studiengang], table.cell(fill: gray, text(hyphenate: false, [Seiten-?bereiche])),
      ), ..for (role, name, matriculation_number, study_program, page_range) in authors {
        (role, name, matriculation_number, study_program, page_range)
      },
    )
  }

  pagebreak()
  set par(justify: true, leading: 1.5em)

  // Style headings
  show heading: it => {
    v(1.5em)
    set par(leading: 1.5em)
    set text(12pt, weight: "bold")
    it
    v(1em)
  }

  // Style figures
  show figure: it => {
    v(2em)
    it
    v(2em)
  }

  // Table of contents.
  show outline: it => {
    in-outline.update(true)
    it
    in-outline.update(false)
  }
  set page(numbering: "I")
  outline(depth: 3, indent: 1em)

  context {
    let imageList = figure
    .where(kind: image)
    .or(figure.where(kind: math.equation))

    if query(imageList) != () {
      pagebreak()
      heading([Abbildungsverzeichnis])
      outline(title: none, target: imageList)
    }

    let tableList = figure.where(kind: table)

    if query(tableList) != () {
      pagebreak()
      heading([Tabellenverzeichnis])
      outline(title: none, target: tableList)
    }
  }

  // Main body.
  set page(numbering: "1", number-align: center)

  counter(heading).update(0)
  set heading(numbering: "1.1.")

  body

  if bibliography_file != "" {
    pagebreak()
    set heading(numbering: none)
    counter(heading).update(3)
    bibliography(bibliography_file, title: [Literaturverzeichnis], style: "apa")
  }
}

#let attachments = state("attachments", ())

#let attach(file, caption: "", lang: "") = {
  attachments.update(s => s + ((file, caption, lang, ""),))
}

#let attachNote(note) = {
  attachments.update(s => s + (("", "", "", note),))
}

#let renderNote(note) = {
  text(note)
  line(length: 100%, stroke: 2pt + gray)
}

#let renderAttachment(file, caption: "", lang: "") = {
  let fileExt = file.split(".").at(-1)
  let useLang = lang
  if lang == "" {
    useLang = fileExt
  }

  let fileContent = read(file)
  show figure: set block(breakable: true)
  let _caption = text(file, weight: "bold")
  if caption != "" {
    _caption = _caption + " - " + caption
  }

  figure(
    raw(fileContent, block: true, lang: useLang), gap: 2em, caption: _caption, supplement: [Anhang],
  )

  line(length: 100%, stroke: 2pt + gray)
}

#let renderAttachmentSection(attachmentList) = {
  for attachment in attachmentList {
    let isNote = attachment.at(0) == "" and attachment.at(3) != ""

    if isNote {
      renderNote(attachment.at(3))
    } else {
      renderAttachment(attachment.at(0), caption: attachment.at(1), lang: attachment.at(2))
    }
  }
}

#let todo(msg) = {
  [#text(fill: fuchsia, weight: "bold", size: 12pt)[(TODO:) #msg]]
}

#let remind(msg) = {
  [#text(fill: red, weight: "bold", size: 12pt)[#underline[(Reminder:) #msg]]]
}

#let blob(pos, label, tint: white, ..args) = node(
  pos, align(center, label), width: 25mm, fill: tint.lighten(60%), stroke: 1pt + tint.darken(20%), corner-radius: 5pt, ..args,
)

#let enclose-nodes(nodes, clearance: 8mm, tint: white) = {
  let points = nodes.map(node => node.final-pos)
  let (center, size) = fletcher.bounding-rect(points)

  cetz.draw.content(
    center, rect(
      width: size.at(0) + 2 * clearance, height: size.at(1) + 2 * clearance, radius: clearance, stroke: tint.darken(20%), fill: tint.lighten(60%),
    ),
  )
}

#let flex-caption(long, short) = context if in-outline.get() { short } else { long }
