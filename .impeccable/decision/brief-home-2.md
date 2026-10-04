# Surface: Home (index.html), with Movies (movies.html) and Film detail (film.html) as sibling surfaces in the same world

Scope: redesign of Taracine (portfolio study modeled on SM Cinema's structure). Visitor mode: Persuade on Home (decide what to watch, act), Operate on Movies and Film detail (find a branch and a time, hold a seat). The user's redesign brief pins: modern, aesthetic, easy to use; ease outranks expression everywhere.

Audience and job: Filipino moviegoers on a phone, same-day planning in a mall or on a commute; secondary: design reviewers judging craft. Action: reach a showtime at a branch and hold tickets. Content: fictional films, cinemas, prices, perks, all labeled synthetic. Constraints: static HTML/CSS/JS, no build; keep SM Cinema's IA (Home, Movies, Cinemas, Membership/Club, Cinema Points, Experience; Now showing / Coming soon; cinema finder; film detail with showtimes by cinema and date). Anti-reference: the first build (Avenida Marquee deco facade) and SM Cinema's Vista template.

## Direction contract

THESIS: The website is the lobby's self-service kiosk: one task per course, oversized targets you could hit with a thumb at arm's length, a visible three-step rail (Movie, Cinema & time, Tickets). It refuses the dark streaming grid with a red button, the white Vista ticketing template, and the deco facade it replaces.

OWN-WORLD: White ground (#FFFFFF) with light panels (#F2F3F5) and hairlines (#E3E5E9); ink (#0F1115) and mid text (#5C6370); one orange accent (#FF5A1F) rationed to the current step, selection and the primary action, with a soft tint (#FFE9DF) for selected surfaces. Tiles with 20 to 24px radius, pill buttons at 48 to 56px height, tabular numerals. One typeface, Lexend (built for reading ease), 400/500/600/700, fixed rem scale 1.2. Posters are the only imagery. No gradients, no glow, no shadows beyond a 1px hairline. Raises: absences stay visible as tagged gaps (video wall); color rationed by role (Bauhaus); selection steps weight and scale, not just color (chromatophore); every showtime pill carries its format and price tag (bazaar); states print themselves inline, no toasts or modals (phosphor); one reserved accent that brightens only on hover and active (shader portal).

STORY: The visitor sees tonight's films as big tiles, taps one, and the bottom bar invites them to continue; they pick a cinema and a day from big pills, tap a time, see a live ticket summary build, set a count, and hold seats. Every step prints its state where it happened.

FIRST VIEWPORT: Top bar 64px: wordmark left, nav center (Home, Movies, Cinemas, Experience, Club), cinema pill and Sign in right. Beneath, the step rail (1 Movie lit orange, 2 Cinema & time, 3 Tickets). Then a headline "What are we watching tonight?" with the cinema and date as a subline, and the poster tile wall (five across on desktop, two on phones), each tile a 2:3 poster with title, rating chip and "Next 4:55 PM". Tapping a tile selects it and a sticky bottom bar slides in: "Continue with <title>" as the primary action. On phones a fixed bottom tab bar (Home, Movies, Cinemas, Tickets, Account) sits under everything.

FORM: Kiosk Clarity, candidate 5 of 7 on the re-rolled grounded list (after Film Magazine, Bright Cinema App, Wallet Pass, Departures Board). Seed key 423fd3d7, re-roll 1. Signature interaction: select-then-continue with the sliding bottom bar and the live ticket summary; motion grammar 150 to 250ms state transitions, nothing animates at rest.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Unresolved
- Seat picker and dedicated Cinemas / Experience / Club pages are later surfaces.
- Poster art is authored SVG per fictional film, labeled synthetic.
