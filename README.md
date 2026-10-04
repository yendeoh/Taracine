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
- `film.html?id=<film-id>` — Film detail, Cinema & time (cinema pills, 7-day strip, format highlight, showtime pills with price tags), and Tickets (seat list, live summary, timed hold). `&cinema=<id>&date=YYYY-MM-DD` preselect. Your chosen cinema is remembered in the browser.
- `login.html` — Sign in form with real-time validation, Show password, Remember me, and a simulated async login check.

## Structure

- `assets/css/taracine.css` — the design system (tokens at the top).
- `assets/js/data.js` — fictional films, cinemas, the `Screen` class hierarchy for formats, deterministic showtime generator, and the Promise-based `checkLogin()` / `holdSeats()` simulators.
- `assets/js/app.js` — page behaviors (tile select-then-continue, filters, showtimes, tickets step, login form).
- `assets/posters/*.svg` — authored poster art, one per film (synthetic; swap for real one-sheets).
- `PRODUCT.md`, `DESIGN.md`, `.impeccable/` — product and design records from the Impeccable workflow.

## Course concepts referenced (IPT)

The JavaScript deliberately applies the patterns from the IPT lesson decks. Each use is marked with a `Lesson:` comment in the code.

| Lesson | Where it is used |
|---|---|
| Arrays: `push()` and `pop()` | `app.js` Tickets step: `seats` is an array of seat labels. The **+** button pushes the next seat, **−** pops the last one, and the summary prints the array. |
| Asynchronous JavaScript: Promises, `async`/`await`, `try...catch`, `setTimeout`, `setInterval`/`clearInterval` | `data.js` `checkLogin()` and `holdSeats()` return Promises that resolve or reject after a timer. `app.js` awaits them in `async` functions with `try...catch` and prints "Signing in…" / "Holding your seats…" first. The seat hold counts down with `setInterval` and stops with `clearInterval`. |
| Event bubbling, capturing, `stopPropagation`, delegation | `app.js` `wireTiles()`: one listener on the poster wall uses `event.target.closest(".tile")` (delegation, bubbling). A second listener registered with `true` runs in the capture phase and calls `event.stopPropagation()` when the small open-arrow link is clicked, so the tile is not selected while the link still navigates. The showtime groups have a capture-phase listener that names the format before the bubbling handler selects the time. |
| Inheritance and polymorphism: `class`, `extends`, `super()`, method overriding, `forEach` | `data.js`: `Screen` is the parent class; `StandardScreen`, `GrandScreen`, `WraparoundScreen` and `SalonScreen` extend it with `super()` and each overrides `perks()`. `app.js` renders "Four ways to watch" with `D.screens.forEach(screen => screen.perks())`, the same call giving a different list per subclass. |
| Login form (Week 9): `novalidate`, `validateEmail()`, `validatePassword()`, `showError()`, `showValid()`, `input` + `blur` feedback, Show Password, Remember Me, `preventDefault()` | `login.html` + `app.js` login section. Email must contain `@`, password needs 6+ characters, feedback prints beside each field, success reads "Login successful! Welcome, &lt;email&gt;" (with "Remember Me is ON." when checked). |
