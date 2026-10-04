# Surface: Home (index.html), with Movies (movies.html) and Film detail (film.html) as sibling surfaces in the same world

Scope: first build of Taracine, a portfolio study modeled on SM Cinema's structure. Visitor mode: Persuade on Home (decide what to watch, act: buy tickets); Movies and Film detail lean Operate (find a branch and a time) inside the same world.

Audience and job: Filipino moviegoers on a phone, same-day planning in a mall or on a commute; secondary: design reviewers judging craft. Action: reach a showtime at a branch and press Buy tickets. Content: fictional films, branches, prices, perks, all labeled synthetic. Constraints: static HTML/CSS/JS, no build; keep SM Cinema's IA (Home, Movies, Cinemas, Membership, Cinema Points, Experience; Now showing / Coming soon; cinema finder; film detail with showtimes by cinema and date), refuse its visual identity.

## Direction contract

THESIS: The whole site is one Manila deco theater facade, read top to bottom as a visitor walking under the marquee: blade sign, changeable-letter canopy board, brass ticket booth, poster frames. It refuses the category arrangement of a dark streaming grid with a red button, and refuses the white Vista ticketing template of the reference.

OWN-WORLD: Salmon stucco ground (#E58C74) owning the page; cream plaster panels (#F6EBDC) for content courses; jade enamel (#1F6F63) for every primary action and selected state; brass hairlines (#B8893A) as the only rule; ink (#1C1A1F) for type and the canopy board; bulb warm white (#FFD98A) for the chase and NOW marker; terrazzo speckle on the footer ground. Display face Big Shoulders Display (condensed deco caps, stepped double-rule underlines); UI and body face Schibsted Grotesk; numerals tabular. Hard 4px grid, no soft shadows, no gradients except the bulb glow. Raised by the hand it beat: hard-grid medium discipline (one-bit desktop); live NOW marker on every showtime strip with past times dark (drum machine); strict full-width horizontal courses, no floating cards (coil tower).

STORY: The visitor arrives under the marquee, reads tonight's titles off the canopy board, understands this is a cinema chain with branches across the Philippines, picks a cinema and a date at the booth, and leaves with a showtime chosen and Buy tickets in hand.

FIRST VIEWPORT: Left edge, a vertical TARACINE blade sign (ink ground, bulb border chasing, display caps stacked) spanning the viewport height on desktop, collapsing to a horizontal header bar on phones. Top band: the canopy letter board, a cream panel with black changeable letters listing today's top three titles and their next showtimes, auto-advancing like a board being re-lettered. Beneath it: the ticket-booth course, a brass-grilled strip holding the finder (Cinema select · Date strip · Movie select · jade Buy tickets button). Below the fold line: the first poster course, Now showing / Coming soon as two brass tabs, posters in stepped deco frames on salmon.

FORM: Avenida Marquee, candidate 3 of 7 on the ordered grounded list (after Karatula Billboard and Lobby Lightboxes). Seed key e0a7b04e. Signature interaction: the bulb chase on the blade sign and the canopy board re-lettering (letters flip in place with a steps() cadence); motion grammar is clock-locked, stepped, never eased flourish.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Unresolved
- Seat picker and Cinemas / Experience / Membership pages are later surfaces.
- Poster art is authored SVG per fictional film, labeled synthetic; swap for real one-sheets if a real client appears.
