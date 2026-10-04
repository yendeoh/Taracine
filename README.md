# Taracine

A portfolio design study: a cinema-chain website modeled on the structure and booking flow of [SM Cinema](https://www.smcinema.com/), rebuilt with an original visual identity ("Kiosk Clarity": the lobby self-service kiosk brought to the web — one task per course, oversized targets, a three-step rail, one orange accent).

Every film, cinema, price and perk is fictional.

## Run it

No build step. Serve the folder with any static server and open `index.html`:

```sh
python3 -m http.server 8731
# then open http://127.0.0.1:8731/
```

Opening `index.html` directly from the filesystem also works in most browsers.

## Pages

- `index.html` — Home: step rail, tonight's films as poster tiles with next showtimes, Now showing / Coming soon, screen formats, pick-your-cinema, club. Tap a tile, then Continue.
- `movies.html` — Movies listing with Now showing / Coming soon and format / family filters.
- `film.html?id=<film-id>` — Film detail, Cinema & time (cinema pills, 7-day strip, format highlight, showtime pills with price tags), and Tickets (seat count, live summary, hold). `&cinema=<id>&date=YYYY-MM-DD` preselect. Your chosen cinema is remembered in the browser.

## Structure

- `assets/css/taracine.css` — the design system (tokens at the top).
- `assets/js/data.js` — fictional films, cinemas, formats, deterministic showtime generator.
- `assets/js/app.js` — page behaviors (tile select-then-continue, filters, showtimes, tickets step).
- `assets/posters/*.svg` — authored poster art, one per film (synthetic; swap for real one-sheets).
- `PRODUCT.md`, `DESIGN.md`, `.impeccable/` — product and design records from the Impeccable workflow.
