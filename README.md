# Taracine

A portfolio design study: a cinema-chain website modeled on the structure and booking flow of [SM Cinema](https://www.smcinema.com/), rebuilt with an original visual identity ("Kiosk Clarity": the lobby self-service kiosk brought to the web — one task per course, oversized targets, a three-step rail, one orange accent).

The ten cinemas, prices and perks are fictional. The Now showing list mixes nine real releases currently listed on smcinema.com (titles, ratings, runtimes, cast and synopses from their listing; posters hotlinked from SM Cinema's media CDN and owned by the films' studios) with twelve fictional films; Taracine does not actually screen anything.

## Run it

No build step. Serve the folder with any static server and open `index.html`:

```sh
python3 -m http.server 8731
# then open http://127.0.0.1:8731/
```

Opening `index.html` directly from the filesystem also works in most browsers.

## Pages

- `index.html` — Home: step rail, tonight's films as poster tiles with next showtimes, Now showing / Coming soon, screen formats, pick-your-cinema, club. Tap a tile, then Continue.
- `movies.html` — Movies listing with Now showing / Coming soon and format / family filters (`?format=grand|wrap|salon` preselects a format; `?cinema=<id>` sets the cinema).
- `cinemas.html` — All ten cinemas with search and region filter, what's still showing today at each, and a one-tap "Choose" that sets your cinema site-wide.
- `experience.html` — Each screen format in depth (built from the `Screen` subclasses), where to find it, and what's showing in it this week.
- `film.html?id=<film-id>` — Film detail, Cinema & time (cinema pills, 7-day strip, format highlight, showtime pills with price tags), Seats (a live seat map: your selection, unavailable, wheelchair spaces, seats taken by other customers in real time, cross-tab sync via BroadcastChannel), Tickets (seat list, live summary, timed hold; booking without an account prompts you to sign in or create one and brings you back with your seats kept, or continue as guest), and Payment (GCash, Maya, card, and a **Bypass (demo)** option that completes the booking and opens the receipt). `&cinema=<id>&date=YYYY-MM-DD` preselect. Your chosen cinema is remembered in the browser.
- `login.html` — Sign in or create an account. Accounts are real calls to [DummyJSON](https://dummyjson.com) (`/auth/login`, `/users/filter`, `/users/add`): sign in with a sample user such as `emilys` / `emilyspass` or by email. Remember me keeps the session in localStorage; otherwise sessionStorage. Created accounts are returned by the API but not stored there.
- `tickets.html` — Receipts rendered as an "online ticket" document in the style of a cinema's printed e-ticket: operator header, fiscal rows (demo values), then one ticket per seat with a blank QR area, a Code 128 barcode (JsBarcode from cdnjs, falls back to text offline), a Screen bar, the amount breakdown (gross, net, basic, amusement tax, VAT, amount due; demo math) and a Seat bar. Print or save as PDF. Cancellation closes 12 hours before the show. The mobile Tickets tab shows the count.

## Structure

- `assets/css/taracine.css` — the design system (tokens at the top).
- `assets/js/data.js` — fictional films, cinemas, the `Screen` class hierarchy for formats, deterministic showtime generator, and the Promise-based `checkLogin()` / `holdSeats()` simulators.
- `assets/js/app.js` — page behaviors (tile select-then-continue, filters, showtimes, tickets step, login form).
- `assets/posters/photos/*.jpg` — photographic poster backgrounds (Creative Commons photos from Wikimedia Commons, credits below); the film title is composited on top in HTML like a one-sheet.
- `assets/posters/*.svg` — authored flat poster art, used as the fallback when a photo is missing.
- `PRODUCT.md`, `DESIGN.md`, `.impeccable/` — product and design records from the Impeccable workflow.

## Course concepts referenced (IPT)

The JavaScript deliberately applies the patterns from the IPT lesson decks. Each use is marked with a `Lesson:` comment in the code.

| Lesson | Where it is used |
|---|---|
| Arrays: `push()` and `pop()` | `app.js` Tickets step: `seats` is an array of seat labels. The **+** button pushes the next seat, **−** pops the last one, and the summary prints the array. |
| Asynchronous JavaScript: Promises, `async`/`await`, `try...catch`, `setTimeout`, `setInterval`/`clearInterval` | `data.js` `checkLogin()` and `holdSeats()` return Promises that resolve or reject after a timer. `app.js` awaits them in `async` functions with `try...catch` and prints "Signing in…" / "Holding your seats…" first. The seat hold counts down with `setInterval` and stops with `clearInterval`. The seat map's live feed (other customers booking seats while you look) is another `setInterval`, cleared when you leave the step. |
| Event bubbling, capturing, `stopPropagation`, delegation | `app.js` `wireTiles()`: one listener on the poster wall uses `event.target.closest(".tile")` (delegation, bubbling). A second listener registered with `true` runs in the capture phase and calls `event.stopPropagation()` when the small open-arrow link is clicked, so the tile is not selected while the link still navigates. The showtime groups have a capture-phase listener that names the format before the bubbling handler selects the time. |
| Inheritance and polymorphism: `class`, `extends`, `super()`, method overriding, `forEach` | `data.js`: `Screen` is the parent class; `StandardScreen`, `GrandScreen`, `WraparoundScreen` and `SalonScreen` extend it with `super()` and each overrides `perks()`. `app.js` renders "Four ways to watch" with `D.screens.forEach(screen => screen.perks())`, the same call giving a different list per subclass. |
| Login form (Week 9): `novalidate`, `validateEmail()`, `validatePassword()`, `showError()`, `showValid()`, `input` + `blur` feedback, Show Password, Remember Me, `preventDefault()` | `login.html` + `app.js` login section. Password needs 6+ characters, email must contain `@` when creating an account, feedback prints beside each field, success reads "Login successful! Welcome, &lt;name&gt;" (with "Remember Me is ON." when checked). The credential check is a real `fetch` to DummyJSON awaited in `try...catch`. |

## Photo credits

Poster backgrounds are Creative Commons or public-domain photographs from Wikimedia Commons, used under their stated licenses with attribution. They stand in for real one-sheets in this study; the fictional film titles are composited on top.

| Film | Photo | Author | License |
|---|---|---|---|
| `sa-dulo-ng-dagat` | [SanAntonio,Zambalesjf9052 07.JPG](https://commons.wikimedia.org/wiki/File:SanAntonio,Zambalesjf9052_07.JPG) | Ramon FVelasquez | CC BY-SA 3.0 |
| `barangay-dynamo` | [3605jfSchool Baliti Barangay San Fernando Pampangafvf 14.JPG](https://commons.wikimedia.org/wiki/File:3605jfSchool_Baliti_Barangay_San_Fernando_Pampangafvf_14.JPG) | Judgefloro | CC BY-SA 4.0 |
| `taal` | [1 taal volcano crater lake 2011.jpg](https://commons.wikimedia.org/wiki/File:1_taal_volcano_crater_lake_2011.jpg) | chensiyuan | CC BY-SA 4.0 |
| `ang-huling-jeepney` | [Montalban patok jeepney.png](https://commons.wikimedia.org/wiki/File:Montalban_patok_jeepney.png) | Chmernootz | CC BY-SA 4.0 |
| `tidewater` | [Rembrandt Christ in the Storm on the Lake of Galilee.jpg](https://commons.wikimedia.org/wiki/File:Rembrandt_Christ_in_the_Storm_on_the_Lake_of_Galilee.jpg) | Rembrandt | Public domain |
| `sampaguita-sessions` | [Beach-Please-2022-crowd-stage-lights-night-performance.jpg](https://commons.wikimedia.org/wiki/File:Beach-Please-2022-crowd-stage-lights-night-performance.jpg) | PinkBeachPlanet | CC BY-SA 4.0 |
| `escolta-1951` | [0222jfSanta Cruz Escolta Binondo Streets Manila Heritage Landmarksfvf 06.JPG](https://commons.wikimedia.org/wiki/File:0222jfSanta_Cruz_Escolta_Binondo_Streets_Manila_Heritage_Landmarksfvf_06.JPG) | Judgefloro | Public domain |
| `pasig-noir` | [Jones Bridge view from the Pasig River Esplanade.jpg](https://commons.wikimedia.org/wiki/File:Jones_Bridge_view_from_the_Pasig_River_Esplanade.jpg) | Akoayposa2411 | CC0 |
| `carnival-of-ghosts` | [Illuminated Ferris wheel, bouncing castle and carousel at night in a funfair in Vientiane, Laos.jpg](https://commons.wikimedia.org/wiki/File:Illuminated_Ferris_wheel,_bouncing_castle_and_carousel_at_night_in_a_funfair_in_Vientiane,_Laos.jpg) | Basile Morin | CC BY-SA 4.0 |
| `the-second-screening` | [Payana Museum, Karnataka (2025) 339.jpg](https://commons.wikimedia.org/wiki/File:Payana_Museum,_Karnataka_(2025)_339.jpg) | Gpkp | CC BY-SA 4.0 |
| `bayanihan` | [Bahay Kubo - Ifugao house.jpg](https://commons.wikimedia.org/wiki/File:Bahay_Kubo_-_Ifugao_house.jpg) | Lien Bryan™ | CC BY 2.0 |
| `signal-no-5` | [Typhoon Koppu over the Philippines (21695256053).jpg](https://commons.wikimedia.org/wiki/File:Typhoon_Koppu_over_the_Philippines_(21695256053).jpg) | NASA's Earth Observatory | CC BY 2.0 |
| `luzviminda` | [Aerial view of Bucana, 2005-03-31 010659.jpg](https://commons.wikimedia.org/wiki/File:Aerial_view_of_Bucana,_2005-03-31_010659.jpg) | eric molina | CC BY 2.0 |
| `lakbay-bituin` | [Milky Way Over Lac de Gaube.jpg](https://commons.wikimedia.org/wiki/File:Milky_Way_Over_Lac_de_Gaube.jpg) | CUIZIANG | CC BY 4.0 |
| `manila-static` | [Skyline of Makati at night.jpg](https://commons.wikimedia.org/wiki/File:Skyline_of_Makati_at_night.jpg) | Red marquis | CC0 |
| `harana-sa-hulyo` | [Close up of an acoustic guitar being played.jpg](https://commons.wikimedia.org/wiki/File:Close_up_of_an_acoustic_guitar_being_played.jpg) | Nataev | CC BY-SA 4.0 |
| `the-lantern-keeper` | [GLFjf1503 02.JPG](https://commons.wikimedia.org/wiki/File:GLFjf1503_02.JPG) | Ramon FVelasquez | CC BY-SA 3.0 |
| `night-market` | [DZ6 0930 Skewers of sizzling street food glow under neon lights as a bustling night market hums in the background.jpg](https://commons.wikimedia.org/wiki/File:DZ6_0930_Skewers_of_sizzling_street_food_glow_under_neon_lights_as_a_bustling_night_market_hums_in_the_background.jpg) | PattayaPatrol | CC BY-SA 4.0 |
| `kuya-robot` | [Osaka Tin Toy Institute – The Tin Age Collection – Mechanized Robot – Robby the Robot – Side.jpg](https://commons.wikimedia.org/wiki/File:Osaka_Tin_Toy_Institute_%E2%80%93_The_Tin_Age_Collection_%E2%80%93_Mechanized_Robot_%E2%80%93_Robby_the_Robot_%E2%80%93_Side.jpg) | D J Shin | CC BY-SA 3.0 |
| `habagat` | [9848Effects floods of Typhoon Goni Telacsan Tacasan Macabebe 67.jpg](https://commons.wikimedia.org/wiki/File:9848Effects_floods_of_Typhoon_Goni_Telacsan_Tacasan_Macabebe_67.jpg) | Judgefloro | CC0 |
