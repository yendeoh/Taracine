# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

static HTML/CSS/JS, no build step (user's choice). Pages open directly in a browser or via any static server.

## Users

Primary: Filipino moviegoers planning a cinema visit, usually on a phone, often the same day or evening. Their job is to see what is showing, pick a nearby branch and a time, and get to the point of buying a ticket with as little friction as possible.

Secondary: design reviewers and hiring managers evaluating this as a portfolio piece. They judge craft, clarity, and how convincingly the site behaves like a real cinema product.

## Product Purpose

Taracine is a portfolio study: a cinema-chain website modeled on the structure and booking flow of SM Cinema (smcinema.com), rebuilt with its own visual identity. It exists to demonstrate production-grade front-end design craft on a familiar, content-heavy commercial pattern. Success means a first-time visitor can find a movie, a branch, and a showtime in seconds, and a reviewer sees a distinctive, coherent, finished product rather than a template.

## Positioning

Same information architecture as a national cinema chain (featured banners, Now Showing / Coming Soon, cinema finder, film detail with showtimes by branch and date, premium screen formats, membership) but with an original visual world instead of the white-label Vista Cinema template that SM Cinema and most regional chains ship.

## Operating Context

Reference site structure (SM Cinema, captured 2026-10-03):

- Global nav: Home, Movies, Cinemas, Membership Upgrade, Cinema Points, Experience; Sign in / Sign up.
- Home: hero banner carousel ("Featured content"), skyscraper promo slot, Now showing / Coming soon tabs over a poster grid (poster, title, censor-rating badge, Play trailer), footer banner, footer nav, socials, cookie notice.
- Movies: same tabs and poster grid, page heading "Movies".
- Cinemas: "Search for your cinema", list of branches with full addresses.
- Film detail: rating badge, poster, Runtime, Release date, Genres, Censor rating description, Cast, Synopsis; "Showtimes" with a cinema picker ("Where would you like to see the movie?") and a scrolling date strip (e.g. "Tue 6 Oct").
- Experience: IMAX, ScreenX, Directors Club, Regular Cinema, Event Screen, Snack Time.
- Membership: Premium Member 1 Year, PHP 1,200.00; perks include free popcorn and drink upgrade per visit, free birth-month ticket, double points; 1 point = 1 peso.
- Seat picker exists on the booking flow.

Built surfaces: Home, Movies, Film detail (showtimes → live seat map → hold → sign-in prompt or guest → payment → receipt), Cinemas, Experience, Sign in / Create account (DummyJSON), Tickets (receipts). Membership page and concessions remain unbuilt.

## Capabilities and Constraints

- Static site: branch and showtime data is authored locally and clearly fictional. Nine real releases from smcinema.com (captured 2026-10-04) sit alongside twelve fictional films in Now showing, at the user's request, with their studio posters hotlinked from SM Cinema's CDN and marked `source: "smcinema"` in data.js; their showtimes at Taracine cinemas are still generated and fictional. Accounts are DummyJSON demo users (dummyjson.com; sample credentials such as emilys / emilyspass), kept in the browser; no Taracine backend exists. Payment is simulated: GCash, Maya and card are shown but only the "Bypass (demo)" method completes, producing a receipt (kept only for the current run; re-running the site resets to zero bookings) rendered as a printed-style online ticket (one per seat, demo fiscal values, blank QR area, barcode). Bookings cannot be cancelled within 12 hours of the show.
- Booking flow runs showtime → seat map → seat hold; the hold is simulated (Promise + timer) and no purchase is completed. Seat availability is generated deterministically per showtime, with a simulated live feed of other customers and real cross-tab sync through BroadcastChannel.
- Philippine context: peso pricing, local censor ratings (G, PG, R-13, R-16, R-18), Philippine city and mall names for branches.
- Terminology: "Now showing", "Coming soon", "Cinemas" (branches), "Showtimes", "Experience" (screen formats).
- Undecided: whether a seat picker screen is built in a later round; whether branch pages get their own route.

## Brand Commitments

- Name: Taracine. Fictional cinema chain; no real logo or assets exist yet.
- Binding constraint from the user: keep SM Cinema's structure, sections, and flow, but do not reuse its visual identity (electric blue #0030ff header/footer, yellow secondary, HK Grotesk, white Vista template look).
- Binding constraint from the user (2026-10-03, redesign request): the look must read as modern and aesthetic, and the UI/UX must be easy to use. The first direction ("Avenida Marquee", a Manila deco theater facade with blade sign, letter board and brass booth) was built and then rejected by the user as not modern; it is anti-reference for future rounds. Ease of use outranks expression on every surface.

## Evidence on Hand

- Reference text captures of smcinema.com (home, films, sites, screen-formats, subscription, cinema-points, a film page, a branch page) taken 2026-10-03 via a text proxy; the live site blocks direct fetches.
- No real movie posters, stills, trailers or logos are on hand. Poster backgrounds are Creative Commons / public-domain photographs from Wikimedia Commons (credits in README.md and assets/posters/credits.json) with the fictional title composited on top; the flat SVG art remains as fallback. Any other imagery must be labeled synthetic. Do not present fictional films, branches, prices, or perks as real claims about any existing cinema.

## Product Principles

1. Time-to-showtime is the product: every surface should shorten the path from "what's on" to a branch and a time.
2. Phone first, same-day use: decisions are made standing in a mall or on a commute.
3. Real-product fidelity over mockup gloss: states, empty results, long titles, and dense data all have to work.
4. Original identity, borrowed skeleton: the structure may be familiar, the look must not be mistakable for the reference.
5. Everything fictional is labeled; nothing invented reads as a real-world claim.
