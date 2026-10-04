/* Taracine — Kiosk Clarity behaviors. State transitions only; nothing animates at rest.

   Course references (IPT), marked inline with "Lesson:" comments:
   - Event bubbling, capturing and delegation: one parent listener per list, closest(), stopPropagation(), a capture-phase listener.
   - Asynchronous JavaScript: Promises from data.js awaited in async functions with try...catch; setTimeout/setInterval/clearInterval.
   - Arrays push() and pop(): the seat list in the Tickets step.
   - Login form: validateEmail/validatePassword/showError/showValid, input + blur feedback, preventDefault on submit. */
(function () {
  const D = window.TARACINE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const page = document.body.dataset.page;
  const params = new URLSearchParams(location.search);
  const today = new Date(); today.setSeconds(0, 0);
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // ----- my cinema (remembered per browser) -----
  let myCinema = "cubao";
  try { const s = localStorage.getItem("taracine.cinema"); if (s && D.cinemas.some(c => c.id === s)) myCinema = s; } catch (e) {}
  if (D.cinemas.some(c => c.id === params.get("cinema"))) myCinema = params.get("cinema");
  function setMyCinema(id) { myCinema = id; try { localStorage.setItem("taracine.cinema", id); } catch (e) {} paintCinema(); }
  function cinema() { return D.cinemas.find(c => c.id === myCinema); }
  function paintCinema() {
    const c = cinema();
    $$("#cinema-pill-name").forEach(el => el.textContent = c.name.replace("Taracine ", ""));
    $$("#hero-cinema").forEach(el => el.textContent = c.name);
  }
  paintCinema();
  const hd = $("#hero-date"); if (hd) hd.textContent = `${DAYS[today.getDay()]} ${today.getDate()} ${MONTHS[today.getMonth()]}`;

  // ----- signed-in user (DummyJSON account kept in this browser; see data.js store) -----
  let user = D.store.user();
  const signIn = $("#sign-in");
  if (signIn && user) signIn.innerHTML = `<svg class="icon"><use href="#i-user"/></svg>Hi, ${user.name}`;
  const tabAcc = $("#tab-account"); if (tabAcc && user) tabAcc.innerHTML = `<svg class="icon"><use href="#i-user"/></svg>${user.name}`;

  // ----- shell -----
  $$("[data-nav]").forEach(a => { if (a.dataset.nav === page) a.setAttribute("aria-current", "page"); });
  function inlineNote(el, text) { const old = el.innerHTML; el.textContent = text; setTimeout(() => el.innerHTML = old, 2200); }
  const tabTix = $("#tab-tickets"); if (tabTix) { const n = D.store.bookings().length; if (n) tabTix.innerHTML = `<svg class="icon"><use href="#i-ticket"/></svg>Tickets · ${n}`; }

  // ----- helpers -----
  function dateList(n = 7) { return Array.from({ length: n }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() + i); return d; }); }
  function dayLabel(d, i) { return i === 0 ? "Today" : i === 1 ? "Tomorrow" : DAYS[d.getDay()]; }
  function ratingClass(r) { return "rating rating--" + r.toLowerCase().replace("-", ""); }
  function fmtRelease(iso) { const [y, m, d] = iso.split("-").map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; }
  function fmtDay(iso) { const d = new Date(iso + "T00:00:00"); const i = Math.round((d - new Date(D.isoDate(today) + "T00:00:00")) / 864e5); return i === 0 ? "Today" : i === 1 ? "Tomorrow" : `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`; }
  function runtime(min) { return `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, "0")}m`; }
  function minutesNow() { const n = new Date(); return n.getHours() * 60 + n.getMinutes(); }
  function isToday(iso) { return iso === D.isoDate(today); }
  function filmUrl(f, extra = {}) { return `film.html?${new URLSearchParams({ id: f.id, cinema: myCinema, ...extra })}`; }
  function isSoldOut(t) { return t.seats <= 2; }

  function nextToday(f) {
    const groups = D.sessions(f.id, myCinema, D.isoDate(today));
    const all = groups.flatMap(g => g.times.map(t => ({ ...t, mins: t.h * 60 + t.m }))).sort((a, b) => a.mins - b.mins);
    const now = minutesNow();
    const upcoming = all.filter(t => t.mins >= now && !isSoldOut(t));
    if (!all.length) return { text: "Not at this cinema", none: true };
    if (!upcoming.length) return { text: "No more shows today", none: true };
    const more = upcoming.length - 1;
    return { text: `Next ${D.fmtTime(upcoming[0].h, upcoming[0].m)}${more ? ` · ${more} more` : ""}` };
  }

  function tile(f) {
    const soon = f.status === "soon";
    const nx = soon ? null : nextToday(f);
    const line = soon ? `<span class="tile__next soon"><svg class="icon"><use href="#i-cal"/></svg>Opens ${fmtRelease(f.release)}</span>`
      : `<span class="tile__next ${nx.none ? "soon" : ""}"><svg class="icon"><use href="#i-clock"/></svg>${nx.text}</span>`;
    return `<article class="tile" role="listitem" tabindex="0" data-id="${f.id}" aria-pressed="false" aria-label="${f.title}, ${f.rating}">
      <div class="tile__art">${posterImg(f)}<span class="${ratingClass(f.rating)}">${f.rating}</span>
        <a class="tile__open" href="${filmUrl(f)}" aria-label="Open ${f.title}" title="Open"><svg class="icon"><use href="#i-open"/></svg></a></div>
      <div class="tile__body"><span class="tile__title">${f.title}</span><span class="tile__meta"><span>${f.genres.join(" · ")}</span><span>${runtime(f.runtime)}</span></span>${line}</div>
    </article>`;
  }

  // Poster = photo + title composited in HTML (like a one-sheet). Falls back to the SVG art if the photo is missing.
  function posterImg(f, lazy = true) {
    if (f.poster) return `<img class="photo" src="${f.poster}" alt="" width="600" height="900" ${lazy ? 'loading="lazy"' : ""} referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='assets/posters/${f.id}.svg'">`;
    return `<img class="photo" src="assets/posters/photos/${f.id}.jpg" alt="" width="600" height="900" ${lazy ? 'loading="lazy"' : ""} onerror="this.onerror=null;this.src='assets/posters/${f.id}.svg'">
      <span class="poster-cap" aria-hidden="true"><b>${f.title}</b><small>A Taracine release · ${f.release.slice(0, 4)}</small></span>`;
  }

  // select-then-continue
  const bar = $("#continue");
  function showBar(opts) {
    if (!bar) return;
    const art = $("#continue-art"); art.referrerPolicy = "no-referrer"; art.src = opts.art || ""; $("#continue-title").textContent = opts.title; $("#continue-sub").textContent = opts.sub || "";
    const btn = $("#continue-btn"); btn.innerHTML = `${opts.label}<svg class="icon"><use href="#i-arrow"/></svg>`; if (opts.href) btn.href = opts.href;
    bar.dataset.show = "true"; document.body.dataset.bar = "true";
  }
  function hideBar() { if (!bar) return; bar.dataset.show = "false"; document.body.dataset.bar = "false"; }

  /* Lesson: Event Delegation. The poster wall has ONE listener on the parent; event.target.closest(".tile")
     finds the tile even when the click lands on the image, the title or the rating chip inside it. */
  function wireTiles(root) {
    /* Lesson: Event Capturing + stopPropagation. This listener uses the third argument `true`, so it runs in the
       capture phase (parent → target) before the bubbling handler below. When the click is on the small
       "open" arrow, stopPropagation() keeps the event from reaching the tile-selection handler, while the
       link's own navigation still happens (stopPropagation does not cancel the default action). */
    root.addEventListener("click", function (event) {
      if (event.target.closest(".tile__open")) event.stopPropagation();
    }, true);

    /* Lesson: Event Bubbling (default phase). The click bubbles from the clicked child up to this parent. */
    root.addEventListener("click", function (event) {
      const t = event.target.closest(".tile"); if (!t) return;
      const f = D.films.find(x => x.id === t.dataset.id);
      if (t.getAttribute("aria-pressed") === "true") { location.href = filmUrl(f); return; }
      $$(".tile[aria-pressed=true]").forEach(x => x.setAttribute("aria-pressed", "false"));
      t.setAttribute("aria-pressed", "true");
      const nx = f.status === "soon" ? null : nextToday(f);
      showBar({ art: f.poster || `assets/posters/photos/${f.id}.jpg`, title: f.title, sub: f.status === "soon" ? `Opens ${fmtRelease(f.release)} · details and reminders` : `${cinema().name} · ${nx.text}`, label: f.status === "soon" ? "See details" : "Pick a time", href: filmUrl(f) });
    });
    root.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("tile")) { e.preventDefault(); e.target.click(); } });
  }

  function tabs(onSwitch) {
    const tabEls = $$("[role=tab]");
    tabEls.forEach(t => t.addEventListener("click", () => {
      tabEls.forEach(x => { const on = x === t; x.setAttribute("aria-selected", on); $("#" + x.getAttribute("aria-controls")).hidden = !on; });
      const h = $("#now-title"); if (h) h.textContent = t.dataset.status === "now" ? "Now showing" : "Coming soon";
      onSwitch && onSwitch(t.dataset.status);
    }));
    if (location.hash === "#soon" && $("#tab-soon")) $("#tab-soon").click();
  }

  // ================= HOME =================
  if (page === "home") {
    const nowFilms = D.films.filter(f => f.status === "now"), soonFilms = D.films.filter(f => f.status === "soon");
    $("#count-now").textContent = nowFilms.length; $("#count-soon").textContent = soonFilms.length;
    function paintGrids() { $("#grid-now").innerHTML = nowFilms.map(tile).join(""); $("#grid-soon").innerHTML = soonFilms.map(tile).join(""); }
    paintGrids(); tabs(); wireTiles($("#movies"));

    /* Lesson: Polymorphism. Every screen is a Screen subclass; the same perks() call returns each class's own list. */
    const icons = { standard: "i-screen", grand: "i-grand", wrap: "i-wrap", salon: "i-salon" };
    const formatsEl = $("#formats");
    D.screens.forEach(screen => {
      formatsEl.insertAdjacentHTML("beforeend", `<div class="format"><svg class="icon"><use href="#${icons[screen.id]}"/></svg><p class="price">${D.peso(screen.price)}<small>per seat</small></p><h3>${screen.name}</h3><p>${screen.blurb}</p><ul class="perks">${screen.perks().map(p => `<li>${p}</li>`).join("")}</ul></div>`);
    });

    const list = $("#cinema-list");
    function paintCinemas() {
      list.innerHTML = D.cinemas.map(c => `<div class="cinema" aria-pressed="${c.id === myCinema}" data-id="${c.id}">
        <div><h3>${c.name}</h3><p>${c.address}, ${c.city} · ${c.screens} screens</p></div>
        <button class="btn btn--ghost btn--sm pick" type="button">${c.id === myCinema ? "Your cinema" : "Choose"}</button>
        <div class="chips">${c.formats.filter(x => x !== "standard").map(x => `<span class="chip chip--sm">${D.formats[x].name}</span>`).join("")}</div>
      </div>`).join("");
    }
    paintCinemas();
    // Lesson: Event Delegation again — one listener on the list, closest(".cinema") finds the card.
    list.addEventListener("click", e => {
      const c = e.target.closest(".cinema"); if (!c) return;
      setMyCinema(c.dataset.id); paintCinemas(); paintGrids(); hideBar();
      $$(".tile[aria-pressed=true]").forEach(x => x.setAttribute("aria-pressed", "false"));
    });
  }

  // ================= MOVIES =================
  if (page === "movies") {
    const filters = { format: ["grand", "wrap", "salon"].includes(params.get("format")) ? params.get("format") : "", rating: "" };
    $$("[data-filter=format]").forEach(x => x.setAttribute("aria-pressed", x.dataset.value === filters.format));
    function apply() {
      ["now", "soon"].forEach(status => {
        const list = D.films.filter(f => f.status === status && (!filters.format || f.formats.includes(filters.format)) && (!filters.rating || ["G", "PG"].includes(f.rating)));
        $("#count-" + status).textContent = list.length;
        $("#grid-" + status).innerHTML = list.length ? list.map(tile).join("")
          : `<div class="empty"><h3>Nothing matches those filters</h3><p>Try another format. Every Taracine has Standard screens, so clearing the format shows everything.</p><button class="btn btn--ghost btn--sm" type="button" id="clear-filters">Clear filters</button></div>`;
      });
      hideBar();
    }
    $("#filters").addEventListener("click", e => {
      const b = e.target.closest(".chip"); if (!b) return;
      if (b.dataset.filter === "rating") { filters.rating = filters.rating ? "" : "family"; b.setAttribute("aria-pressed", !!filters.rating); }
      else { filters.format = b.dataset.value; $$("[data-filter=format]").forEach(x => x.setAttribute("aria-pressed", x === b)); }
      apply();
    });
    document.addEventListener("click", e => { if (e.target.id === "clear-filters") { filters.format = ""; filters.rating = ""; $$("#filters .chip").forEach(x => x.setAttribute("aria-pressed", x.dataset.value === "")); apply(); } });
    apply(); tabs(); wireTiles($("main"));
  }

  // ================= FILM =================
  if (page === "film") {
    const film = D.films.find(f => f.id === params.get("id")) || D.films[0];
    document.title = `${film.title} — Taracine`;
    $("#film-title").textContent = film.title; $("#film-tagline").textContent = film.tagline; $("#film-tagline").hidden = !film.tagline && film.source !== "smcinema";
    const poster = $("#film-poster"); poster.className = "photo"; poster.alt = `Poster for ${film.title}`;
    poster.onerror = () => { poster.onerror = null; poster.src = `assets/posters/${film.id}.svg`; };
    if (film.poster) { poster.referrerPolicy = "no-referrer"; poster.src = film.poster; }
    else { poster.src = `assets/posters/photos/${film.id}.jpg`; poster.insertAdjacentHTML("afterend", `<span class="poster-cap" aria-hidden="true"><b>${film.title}</b><small>A Taracine release · ${film.release.slice(0, 4)}</small></span>`); }
    if (film.source === "smcinema") $("#film-tagline").innerHTML = `Now showing at SM Cinema · <a class="link" href="${film.sourceUrl}" rel="noopener" target="_blank">listing</a>`;
    $("#film-chips").innerHTML = `<span class="${ratingClass(film.rating)}" title="${D.ratingDescriptions[film.rating]}">${film.rating}</span>` + film.formats.map(x => `<span class="chip chip--sm">${D.formats[x].name}</span>`).join("");
    $("#film-specs").innerHTML = `
      <div><dt>Runtime</dt><dd>${runtime(film.runtime)}</dd></div>
      <div><dt>${film.status === "soon" ? "Opens" : "Released"}</dt><dd>${fmtRelease(film.release)}</dd></div>
      <div><dt>Genre</dt><dd>${film.genres.join(" · ")}</dd></div>
      <div><dt>Rating</dt><dd>${D.ratingDescriptions[film.rating]}</dd></div>
      ${film.director ? `<div><dt>Director</dt><dd>${film.director}</dd></div>` : ""}
      <div><dt>Cast</dt><dd>${film.cast.join(", ")}</dd></div>`;
    $("#film-synopsis").innerHTML = film.synopsis.map(p => `<p>${p}</p>`).join("");
    $("#trailer-btn").addEventListener("click", () => { $("#trailer-state").hidden = false; });

    // --- cinema & time ---
    const pills = $("#cinema-pills"), datesEl = $("#dates"), ffEl = $("#format-filter"), sessionsEl = $("#sessions"), legend = $("#legend"), addr = $("#cinema-address"), timeLabel = $("#time-label");
    const dates = dateList();
    let dateIso = dates.map(D.isoDate).includes(params.get("date")) ? params.get("date") : D.isoDate(dates[0]);
    let chosen = null, focusFormat = "";
    // a booking interrupted by sign-in comes back here with ?restore=1 (saved in sessionStorage by the auth prompt)
    const pending = params.get("restore") && D.store.pending() && D.store.pending().filmId === film.id ? D.store.pending() : null;
    if (pending) { dateIso = pending.date; if (D.cinemas.some(c => c.id === pending.cinemaId)) setMyCinema(pending.cinemaId); }
    let guest = false, paying = false;
    /* Lesson: Arrays push() and pop(). `seats` holds the seat labels for this booking. The + button pushes the
       next seat onto the end; the − button pops the last one off. The summary prints the array. */
    let seats = [];
    let holdTimer = null, holdSecondsLeft = 0, holdState = "idle"; // idle | holding | held | expired

    function paintPills() {
      pills.innerHTML = D.cinemas.map(c => `<button type="button" class="cpill" data-id="${c.id}" aria-pressed="${c.id === myCinema}"><b>${c.name.replace("Taracine ", "")}</b><small>${c.city}</small></button>`).join("");
      addr.textContent = `${cinema().address}, ${cinema().city}`;
    }
    pills.addEventListener("click", e => { const b = e.target.closest(".cpill"); if (!b) return; setMyCinema(b.dataset.id); resetChoice(); paintPills(); paintFormats(); paintSessions(); });
    datesEl.innerHTML = dates.map((d, i) => `<button type="button" class="date" data-date="${D.isoDate(d)}" aria-pressed="${D.isoDate(d) === dateIso}"><small>${dayLabel(d, i)}</small><b>${d.getDate()} ${MONTHS[d.getMonth()]}</b></button>`).join("");
    datesEl.addEventListener("click", e => { const b = e.target.closest(".date"); if (!b) return; dateIso = b.dataset.date; resetChoice(); $$(".date", datesEl).forEach(x => x.setAttribute("aria-pressed", x === b)); paintSessions(); });
    function paintFormats() {
      const avail = film.formats.filter(x => cinema().formats.includes(x));
      ffEl.innerHTML = [`<button type="button" class="chip" data-f="" aria-pressed="${!focusFormat}">All</button>`].concat(avail.map(x => `<button type="button" class="chip" data-f="${x}" aria-pressed="${focusFormat === x}">${D.formats[x].name} · ${D.peso(D.formats[x].price)}</button>`)).join("");
    }
    ffEl.addEventListener("click", e => { const b = e.target.closest(".chip"); if (!b) return; focusFormat = b.dataset.f; $$(".chip", ffEl).forEach(x => x.setAttribute("aria-pressed", x === b)); $$(".group", sessionsEl).forEach(g => g.classList.toggle("dim", !!focusFormat && g.dataset.format !== focusFormat)); });

    function resetChoice() { chosen = null; seats = []; stopHold(); holdState = "idle"; stopFeed(); }

    /* ===== Seat map with live updates =====
       The map is generated per format. Seats already sold are decided deterministically from the showtime so the
       demo is stable. Two things make it "live":
       1. Lesson: setInterval() — a simulated stream of other customers books a free seat every few seconds while you
          look (stopped with clearInterval when you leave the step). If one of YOUR unsaved seats is taken, it is
          replaced and the page says so inline.
       2. BroadcastChannel — real cross-tab sync: open the same showtime in two tabs and each tab sees the other's
          selection as "being booked by someone else". */
    const LAYOUTS = {
      standard: { rows: "ABCDEFGHJ", per: 17, walkwayAfter: "C", wheelchairRow: "C", lastRow: [4, 4] },
      grand:    { rows: "ABCDEFGHJKL", per: 20, walkwayAfter: "D", wheelchairRow: "D", lastRow: [6, 6] },
      wrap:     { rows: "ABCDEFGH", per: 16, walkwayAfter: "C", wheelchairRow: "C", lastRow: [5, 5] },
      salon:    { rows: "ABCDE", per: 8, walkwayAfter: "B", wheelchairRow: "B", lastRow: null }
    };
    let seatMap = null;
    let others = {};
    let feedTimer = null;
    const tabId = Math.random().toString(36).slice(2, 8);
    let channel = null;
    try { channel = new BroadcastChannel("taracine-seats"); } catch (e) {}
    const rowsEl = $("#rows"), seatsSec = $("#seats"), pickedEl = $("#picked-seats"), seatNote = $("#seat-note"), liveEl = $("#live");

    function showtimeKey() { return chosen ? `${film.id}|${myCinema}|${dateIso}|${chosen.format}|${chosen.h}:${chosen.m}` : ""; }
    function buildMap() {
      const L = LAYOUTS[chosen.format] || LAYOUTS.standard;
      const key = showtimeKey();
      const map = new Map();
      const capacity = L.rows.length * L.per;
      const soldShare = Math.max(0.05, Math.min(0.9, 1 - chosen.seats / capacity));
      for (const row of L.rows) {
        const isLast = L.lastRow && row === L.rows[L.rows.length - 1];
        for (let n = 1; n <= L.per; n++) {
          if (isLast && n > L.lastRow[0] && n <= L.per - L.lastRow[1]) continue;
          const wheel = row === L.wheelchairRow && n > L.per - 2;
          const taken = !wheel && (D.hash(key + row + n) % 1000) / 1000 < soldShare;
          map.set(`${row}${n}`, { row, n, wheel, state: taken ? "taken" : "free" });
        }
      }
      seatMap = { key, layout: L, seats: map };
      $("#screen-label").textContent = `${D.formats[chosen.format].name} · screen`;
      const gapRow = L.walkwayAfter ? L.rows[L.rows.indexOf(L.walkwayAfter) + 1] : null;
      rowsEl.innerHTML = L.rows.split("").map(row => {
        const cells = [];
        for (let n = 1; n <= L.per; n++) {
          const id = `${row}${n}`, st = map.get(id);
          if (!st) { cells.push(`<span class="seat aisle" aria-hidden="true"></span>`); continue; }
          cells.push(`<button type="button" class="seat ${st.wheel ? "wheel" : ""}" data-id="${id}" aria-label="Seat ${id}${st.wheel ? ", wheelchair space" : ""}" aria-pressed="false">${st.wheel ? '<svg class="icon"><use href="#i-wheel"/></svg>' : ""}</button>`);
        }
        return `<div class="row ${row === gapRow ? "gap" : ""}"><small>${row}</small><div class="row__seats">${cells.join("")}</div><small>${row}</small></div>`;
      }).join("");
      seats = [];
      const midRows = L.rows.split("").slice(Math.floor(L.rows.length / 2));
      outer: for (const row of midRows) {
        for (let n = Math.ceil(L.per / 2) - 1; n < L.per; n++) {
          const a = map.get(`${row}${n}`), b = map.get(`${row}${n + 1}`);
          if (a && b && a.state === "free" && b.state === "free" && !a.wheel && !b.wheel) { seats.push(`${row}${n}`); seats.push(`${row}${n + 1}`); break outer; }  // Lesson: push()
        }
      }
      seatNote.hidden = true;
      paintSeats(); startFeed(); broadcast();
    }
    function paintSeats() {
      if (!seatMap) return;
      const otherSet = new Set(Object.values(others).flat());
      const locked = holdState === "holding" || holdState === "held";
      $$(".seat[data-id]", rowsEl).forEach(el => {
        const st = seatMap.seats.get(el.dataset.id);
        const mine = seats.includes(el.dataset.id);
        el.classList.toggle("taken", st.state === "taken");
        el.classList.toggle("other", !mine && st.state !== "taken" && otherSet.has(el.dataset.id));
        el.classList.toggle("mine", mine);
        el.setAttribute("aria-pressed", mine);
        el.disabled = st.state === "taken" || (!mine && otherSet.has(el.dataset.id)) || locked;
      });
      pickedEl.textContent = seats.length ? seats.join(", ") : "none yet";
    }
    function nextFreeSeat() {
      if (!seatMap) return null;
      const otherSet = new Set(Object.values(others).flat());
      const ok = id => { const c = seatMap.seats.get(id); return c && c.state === "free" && !c.wheel && !seats.includes(id) && !otherSet.has(id); };
      const last = seats[seats.length - 1];
      if (last) {
        const st = seatMap.seats.get(last), L = seatMap.layout, rows = L.rows;
        // nearest first: walk outward along the same row, then the neighbouring rows
        for (let dist = 1; dist < L.per; dist++) for (const d of [dist, -dist]) { const cand = `${st.row}${st.n + d}`; if (ok(cand)) return cand; }
        const r = rows.indexOf(st.row);
        for (let dr = 1; dr < rows.length; dr++) for (const rr of [rows[r + dr], rows[r - dr]]) { if (!rr) continue; for (let dist = 0; dist < L.per; dist++) for (const d of [dist, -dist]) { const cand = `${rr}${st.n + d}`; if (ok(cand)) return cand; } }
      }
      for (const id of seatMap.seats.keys()) if (ok(id)) return id;
      return null;
    }
    function note(text, kind = "info") { seatNote.hidden = false; seatNote.className = `state state--${kind}`; seatNote.querySelector("span").textContent = text; }
    function broadcast() { if (channel && chosen) channel.postMessage({ type: "select", key: showtimeKey(), tab: tabId, seats: [...seats] }); }
    if (channel) channel.onmessage = (ev) => {
      const m = ev.data || {};
      if (m.tab === tabId) return;
      if (m.type === "select") { if (m.key === showtimeKey()) others[m.tab] = m.seats; else delete others[m.tab]; }
      if (m.type === "clear") delete others[m.tab];
      if (m.type === "ping" && chosen) broadcast();
      paintSeats();
      const overlap = seats.filter(x => Object.values(others).flat().includes(x));
      if (overlap.length) { liveEl.classList.add("busy"); liveEl.querySelector("span").textContent = `Another tab is also looking at ${overlap.join(", ")}`; }
    };
    if (channel) channel.postMessage({ type: "ping", tab: tabId });
    addEventListener("pagehide", () => { if (channel) channel.postMessage({ type: "clear", tab: tabId }); });

    // Lesson: setInterval() runs the simulated live feed; clearInterval() stops it when the step is left
    function startFeed() {
      stopFeed();
      liveEl.classList.remove("busy"); liveEl.querySelector("span").textContent = "Live · seats update as others book";
      feedTimer = setInterval(() => {
        if (!seatMap) return;
        const free = [...seatMap.seats.entries()].filter(([id, st]) => st.state === "free" && !st.wheel);
        if (!free.length) { stopFeed(); return; }
        const locked = holdState === "holding" || holdState === "held";
        let targetId;
        if (!locked && seats.length && Math.random() < 0.16) targetId = seats[seats.length - 1];
        else { const pool = free.filter(([id]) => !seats.includes(id)); if (!pool.length) return; targetId = pool[Math.floor(Math.random() * pool.length)][0]; }
        seatMap.seats.get(targetId).state = "taken";
        const el = rowsEl.querySelector(`.seat[data-id="${targetId}"]`); if (el) { el.classList.add("flash"); setTimeout(() => el.classList.remove("flash"), 700); }
        liveEl.classList.add("busy"); liveEl.querySelector("span").textContent = `Someone just booked ${targetId}`;
        setTimeout(() => liveEl.classList.remove("busy"), 1500);
        if (seats.includes(targetId)) {
          seats.splice(seats.indexOf(targetId), 1);
          const repl = nextFreeSeat(); if (repl) seats.push(repl);               // Lesson: push() the replacement seat
          note(`${targetId} was just taken by another customer${repl ? `, so we moved you to ${repl}` : ""}. Hold your seats to keep them.`, "warn");
        }
        paintSeats(); paintTickets(); broadcast();
      }, 3500 + Math.random() * 2500);
    }
    function stopFeed() { if (feedTimer) { clearInterval(feedTimer); feedTimer = null; } }

    // Lesson: Event Delegation — one listener on the rows container handles every seat button
    rowsEl.addEventListener("click", event => {
      const el = event.target.closest(".seat[data-id]"); if (!el || el.disabled) return;
      const id = el.dataset.id;
      if (seats.includes(id)) seats.splice(seats.indexOf(id), 1);
      else if (seats.length >= 6) { note("Up to 6 seats per booking. Remove one to pick another.", "warn"); return; }
      else seats.push(id);                                                       // Lesson: push()
      seatNote.hidden = true;
      paintSeats(); paintTickets(); broadcast();
    });
    $("#seats-reset").addEventListener("click", () => { if (holdState === "holding" || holdState === "held") return; seats = []; seatNote.hidden = true; paintSeats(); paintTickets(); broadcast(); });
    $("#seats-back").addEventListener("click", () => { resetChoice(); $$(".time", sessionsEl).forEach(x => x.setAttribute("aria-pressed", "false")); paintTickets(); $("#sessions").scrollIntoView({ behavior: "smooth", block: "start" }); });

    function paintSessions() {
      const c = cinema();
      if (film.status === "soon") {
        sessionsEl.innerHTML = `<div class="empty"><h3>Opens ${fmtRelease(film.release)}</h3><p>Tickets go on sale one week before opening. Club members book first.</p><a class="btn btn--ghost btn--sm" href="movies.html">See what's showing now</a></div>`;
        legend.hidden = true; paintTickets(); return;
      }
      const groups = D.sessions(film.id, myCinema, dateIso);
      if (!groups.length) {
        const alt = D.cinemas.filter(x => x.id !== myCinema && film.formats.some(f => x.formats.includes(f))).slice(0, 3);
        sessionsEl.innerHTML = `<div class="empty"><h3>Not showing at ${c.name}</h3><p>Try a nearby Taracine:</p><div class="chips">${alt.map(x => `<button type="button" class="chip" data-alt="${x.id}">${x.name}</button>`).join("")}</div></div>`;
        legend.hidden = true; paintTickets(); return;
      }
      const nowMin = isToday(dateIso) ? minutesNow() : -1;
      const all = groups.flatMap(g => g.times.map(t => ({ ...t, format: g.format, mins: t.h * 60 + t.m }))).sort((a, b) => a.mins - b.mins);
      const next = all.find(t => t.mins >= nowMin && !isSoldOut(t));
      sessionsEl.innerHTML = groups.map(g => {
        const F = D.formats[g.format];
        return `<section class="group ${focusFormat && focusFormat !== g.format ? "dim" : ""}" data-format="${g.format}" aria-labelledby="g-${g.format}">
          <div class="group__head"><h3 id="g-${g.format}">${F.name}</h3><span class="price">${D.peso(F.price)} <span class="muted" style="font-weight:400">per seat</span></span><p>${F.blurb}</p></div>
          <div class="times">${g.times.map(t => {
            const m = t.h * 60 + t.m, past = m < nowMin, sold = isSoldOut(t), few = !sold && t.seats < 12;
            const isNext = next && next.format === g.format && next.h === t.h && next.m === t.m;
            const pressed = chosen && chosen.format === g.format && chosen.h === t.h && chosen.m === t.m;
            const sub = past ? "Started" : sold ? "Sold out" : few ? `${t.seats} seats left` : `${F.short} · ${D.peso(F.price)}`;
            return `<button type="button" class="time ${past ? "past" : ""} ${sold ? "soldout" : ""} ${isNext ? "next" : ""} ${few ? "few" : ""}" ${past || sold ? "disabled" : ""} aria-pressed="${!!pressed}" data-format="${g.format}" data-h="${t.h}" data-m="${t.m}" data-seats="${t.seats}"><b>${D.fmtTime(t.h, t.m)}</b><small>${sub}</small></button>`;
          }).join("")}</div>
        </section>`;
      }).join("");
      legend.hidden = false; paintTickets();
    }

    /* Lesson: Event Capturing. Registered with `true`, this runs first (outer → inner) and names the format group the
       click is inside, using event.currentTarget (the sessions container) vs event.target (the clicked pill). */
    sessionsEl.addEventListener("click", function (event) {
      const group = event.target.closest(".group");
      timeLabel.textContent = group ? `Time · ${D.formats[group.dataset.format].name}` : "Time";
    }, true);

    /* Lesson: Event Bubbling + Delegation. The same click then bubbles to this listener, which does the real work. */
    sessionsEl.addEventListener("click", function (event) {
      const alt = event.target.closest("[data-alt]"); if (alt) { setMyCinema(alt.dataset.alt); resetChoice(); paintPills(); paintFormats(); paintSessions(); return; }
      const b = event.target.closest(".time"); if (!b || b.disabled) return;
      const same = chosen && chosen.format === b.dataset.format && chosen.h === +b.dataset.h && chosen.m === +b.dataset.m;
      resetChoice();
      chosen = same ? null : { format: b.dataset.format, h: +b.dataset.h, m: +b.dataset.m, seats: +b.dataset.seats };
      $$(".time", sessionsEl).forEach(x => x.setAttribute("aria-pressed", x === b && !same));
      if (chosen) buildMap(); else seatMap = null;
      paintTickets();
      if (chosen) setTimeout(() => seatsSec.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    });


    // --- tickets ---
    const ticketsSec = $("#tickets"), summary = $("#summary"), qtyOut = $("#qty"), holdEl = $("#hold-state"), qtyNote = $("#qty-note"), seatsOut = $("#seats-list");
    function paintTickets() {
      const s2 = $("#step-2"), s3 = $("#step-3");
      if (!chosen) {
        ticketsSec.hidden = true; seatsSec.hidden = true; paySec.hidden = true; s4.removeAttribute("aria-current"); authbox.hidden = true; s2.setAttribute("aria-current", "step"); s2.classList.remove("done"); s2.querySelector("b").textContent = "2"; s3.removeAttribute("aria-current");
        if (film.status === "now") showBar({ art: film.poster || `assets/posters/photos/${film.id}.jpg`, title: film.title, sub: `${cinema().name} · ${fmtDay(dateIso)} · pick a time`, label: "Pick a time" });
        else hideBar();
        const btn = $("#continue-btn"); btn.disabled = false; btn.onclick = () => $("#sessions").scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      const F = D.formats[chosen.format];
      const qty = seats.length;
      ticketsSec.hidden = false; seatsSec.hidden = false; s2.removeAttribute("aria-current"); s2.classList.add("done"); s2.querySelector("b").innerHTML = `<svg class="icon"><use href="#i-check"/></svg>`; s3.setAttribute("aria-current", "step");
      const max = Math.min(6, chosen.seats);
      const locked = holdState === "holding" || holdState === "held";
      $("#qty-minus").disabled = qty <= 1 || locked; $("#qty-plus").disabled = qty >= max || locked || !nextFreeSeat(); qtyOut.textContent = qty;
      paintSeats();
      seatsOut.textContent = seats.join(", ");
      qtyNote.textContent = `${chosen.seats} seats available in ${F.name}. Up to 6 per booking.`;
      summary.innerHTML = `<div class="row"><span>Film</span><b>${film.title}</b></div><div class="row"><span>Cinema</span><b>${cinema().name}</b></div><div class="row"><span>When</span><b>${fmtDay(dateIso)} · ${D.fmtTime(chosen.h, chosen.m)}</b></div><div class="row"><span>Format</span><b>${F.name}</b></div><div class="row"><span>Seats</span><b>${seats.join(", ")}</b></div><div class="row"><span>Price</span><b>${qty} × ${D.peso(F.price)}</b></div><div class="row total"><span>Total</span><b>${D.peso(F.priceFor(qty))}</b></div>`;
      paintPayment();
      const label = holdState === "holding" ? "Holding…" : holdState === "held" ? `Held · ${mmss(holdSecondsLeft)}` : holdState === "expired" ? "Hold again" : "Buy tickets";
      showBar({ art: film.poster || `assets/posters/photos/${film.id}.jpg`, title: `${film.title} · ${D.fmtTime(chosen.h, chosen.m)}`, sub: `${cinema().name} · ${fmtDay(dateIso)} · ${F.name} · ${qty} seat${qty > 1 ? "s" : ""} · ${D.peso(F.priceFor(qty))}`, label });
      const btn = $("#continue-btn");
      btn.disabled = locked || qty === 0;
      if (qty === 0 && !locked) btn.innerHTML = `Pick a seat first<svg class="icon"><use href="#i-arrow"/></svg>`;
      btn.onclick = () => {
        if (ticketsSec.getBoundingClientRect().top > innerHeight * 0.6) ticketsSec.scrollIntoView({ behavior: "smooth", block: "start" });
        if (!user && !guest) { askToSignIn(); return; }
        hold();
      };
    }
    $("#qty-minus").addEventListener("click", () => { if (seats.length > 1) seats.pop(); paintTickets(); broadcast(); });          // Lesson: pop() removes the last seat
    $("#qty-plus").addEventListener("click", () => { const nxt = nextFreeSeat(); if (chosen && nxt && seats.length < Math.min(6, chosen.seats)) seats.push(nxt); paintTickets(); broadcast(); }); // Lesson: push() adds the next free seat

    function mmss(s) { return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }
    function stopHold() { if (holdTimer) { clearInterval(holdTimer); holdTimer = null; } holdEl.hidden = true; holdEl.className = "state"; }

    // ----- booking without an account: suggest sign-in / sign-up, keep the booking for the round trip -----
    const authbox = $("#authbox");
    function pendingPayload() { return { filmId: film.id, cinemaId: myCinema, date: dateIso, format: chosen.format, h: chosen.h, m: chosen.m, seats: [...seats] }; }
    function askToSignIn() {
      D.store.setPending(pendingPayload());
      const back = `film.html?${new URLSearchParams({ id: film.id, cinema: myCinema, date: dateIso, restore: 1 })}`;
      $("#auth-login").href = `login.html?next=${encodeURIComponent(back)}`;
      $("#auth-signup").href = `login.html?mode=signup&next=${encodeURIComponent(back)}`;
      authbox.hidden = false;
      authbox.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    $("#auth-guest").addEventListener("click", () => { guest = true; authbox.hidden = true; D.store.setPending(null); hold(); });

    // ----- payment (step 4) -----
    const paySec = $("#payment"), payBtn = $("#pay-btn"), payState = $("#pay-state"), paySummary = $("#pay-summary"), guestFields = $("#guest-fields"), s4 = $("#step-4");
    function paintPayment() {
      if (holdState !== "held") { paySec.hidden = true; s4.removeAttribute("aria-current"); return; }
      const F = D.formats[chosen.format];
      paySec.hidden = false; s4.setAttribute("aria-current", "step"); $("#step-3").removeAttribute("aria-current"); $("#step-3").classList.add("done"); $("#step-3").querySelector("b").innerHTML = `<svg class="icon"><use href="#i-check"/></svg>`;
      guestFields.hidden = !!user;
      paySummary.innerHTML = `<div class="row"><span>Film</span><b>${film.title}</b></div><div class="row"><span>Cinema</span><b>${cinema().name}</b></div><div class="row"><span>When</span><b>${fmtDay(dateIso)} · ${D.fmtTime(chosen.h, chosen.m)}</b></div><div class="row"><span>Seats</span><b>${seats.join(", ")} · ${F.name}</b></div><div class="row"><span>Booked as</span><b>${user ? `${user.name} ${user.lastName || ""}`.trim() : "Guest"}</b></div><div class="row total"><span>Total</span><b>${D.peso(F.priceFor(seats.length))}</b></div>`;
    }
    /* Lesson: Async/Await + try...catch again. payBooking() rejects for every method except "bypass", which is the
       demonstration path to the receipt. The booking is stored in this browser and shown on tickets.html. */
    payBtn.addEventListener("click", async () => {
      if (paying) return;
      const method = (document.querySelector('input[name="method"]:checked') || {}).value || "bypass";
      const nameInput = $("#guest-name"), nameMsg = $("#guest-name-msg");
      if (!user && !nameInput.value.trim()) { nameMsg.textContent = "Add a name for the ticket."; nameMsg.className = "msg error"; nameInput.classList.add("invalid"); nameInput.focus(); return; }
      nameMsg.textContent = ""; nameInput.classList.remove("invalid");
      paying = true; payBtn.disabled = true;
      payState.hidden = false; payState.className = "state state--info"; payState.innerHTML = `<svg class="icon"><use href="#i-clock"/></svg><span>Processing ${method === "bypass" ? "demo payment" : method}…</span>`;
      const F = D.formats[chosen.format];
      const showAt = new Date(`${dateIso}T${String(chosen.h).padStart(2, "0")}:${String(chosen.m).padStart(2, "0")}:00`).toISOString();
      const screenNo = (D.hash(film.id + myCinema + dateIso + chosen.h) % cinema().screens) + 1;
      const booking = { filmId: film.id, filmTitle: film.title, poster: film.poster || `assets/posters/photos/${film.id}.jpg`, cinemaId: myCinema, cinemaName: cinema().name, cinemaAddress: `${cinema().address}, ${cinema().city}`, date: dateIso, time: D.fmtTime(chosen.h, chosen.m), showAt, screen: screenNo, format: F.name, pricePerSeat: F.price, rating: film.rating, censor: D.ratingDescriptions[film.rating], seats: [...seats], total: F.priceFor(seats.length), name: user ? `${user.name} ${user.lastName || ""}`.trim() : nameInput.value.trim(), email: user ? user.email : "", userId: user ? user.id : null };
      try {
        const paid = await D.payBooking(booking, method);
        D.store.addBooking(paid); stopHold(); stopFeed(); D.store.setPending(null);
        payState.className = "state"; payState.innerHTML = `<svg class="icon"><use href="#i-check"/></svg><span>Paid. Reference ${paid.ref}. Opening your receipt…</span>`;
        setTimeout(() => { location.href = `tickets.html?ref=${paid.ref}`; }, 900);
      } catch (error) {
        payState.className = "state state--warn"; payState.innerHTML = `<svg class="icon"><use href="#i-info"/></svg><span>${error}</span>`;
        paying = false; payBtn.disabled = false;
      }
    });

    /* Lesson: Async/Await with try...catch. holdSeats() in data.js returns a Promise that resolves after a short
       delay (a simulated server). The page prints "Holding…" first, awaits the result, then prints success or the
       error, without ever freezing. Then setInterval() counts the hold down every second and clearInterval() stops it. */
    async function hold() {
      holdState = "holding"; paintTickets();
      holdEl.hidden = false; holdEl.className = "state state--info"; holdEl.innerHTML = `<svg class="icon"><use href="#i-clock"/></svg><span>Holding your seats…</span>`;
      try {
        const result = await D.holdSeats(seats);
        holdState = "held"; holdSecondsLeft = result.minutes * 60; broadcast();
        setTimeout(() => { paintPayment(); paySec.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
        holdEl.className = "state"; holdEl.innerHTML = `<svg class="icon"><use href="#i-check"/></svg><span>Seats ${result.seats.join(", ")} held for ${result.minutes} minutes. In the real flow, payment opens here; this study stops at the hold.</span>`;
        holdTimer = setInterval(() => {
          holdSecondsLeft--;
          $("#continue-btn").innerHTML = `Held · ${mmss(holdSecondsLeft)}<svg class="icon"><use href="#i-arrow"/></svg>`;
          if (holdSecondsLeft <= 0) {
            clearInterval(holdTimer); holdTimer = null; holdState = "expired";
            holdEl.className = "state state--warn"; holdEl.innerHTML = `<svg class="icon"><use href="#i-info"/></svg><span>Your hold expired. Pick the seats again to continue.</span>`;
            paintTickets();
          }
        }, 1000);
      } catch (error) {
        holdState = "idle";
        holdEl.className = "state state--warn"; holdEl.innerHTML = `<svg class="icon"><use href="#i-info"/></svg><span>${error}</span>`;
      }
      paintTickets();
    }

    paintPills(); paintFormats(); paintSessions();
    if (pending) {
      const btn = $$(".time", sessionsEl).find(x => x.dataset.format === pending.format && +x.dataset.h === pending.h && +x.dataset.m === pending.m && !x.disabled);
      if (btn) {
        btn.click();
        const wanted = pending.seats.filter(id => { const st = seatMap && seatMap.seats.get(id); return st && st.state === "free"; });
        if (wanted.length) { seats = wanted; paintSeats(); paintTickets(); broadcast(); }
        note(user ? `Welcome back, ${user.name}. Your seats are still here: ${seats.join(", ")}.` : `Your seats are still here: ${seats.join(", ")}.`, "info");
        D.store.setPending(null);
        setTimeout(() => $("#tickets").scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      }
    }

    const also = D.films.filter(f => f.status === "now" && f.id !== film.id).slice(0, 6);
    $("#grid-also").innerHTML = also.map(tile).join("");
    $("#grid-also").addEventListener("click", e => { const t = e.target.closest(".tile"); if (t && !e.target.closest(".tile__open")) location.href = filmUrl(D.films.find(x => x.id === t.dataset.id)); });
  }

  // ================= CINEMAS =================
  if (page === "cinemas") {
    const list = $("#cinema-list"), search = $("#cinema-search"), regionEl = $("#region-filter");
    let q = "", region = "";
    function todayLine(c) {
      const todayIso = D.isoDate(today), now = minutesNow();
      const showing = D.films.filter(f => f.status === "now").map(f => {
        const all = D.sessions(f.id, c.id, todayIso).flatMap(g => g.times.map(t => ({ ...t, mins: t.h * 60 + t.m }))).filter(t => t.mins >= now && !isSoldOut(t)).sort((a, b) => a.mins - b.mins);
        return all.length ? { f, next: all[0] } : null;
      }).filter(Boolean).sort((a, b) => a.next.mins - b.next.mins);
      if (!showing.length) return `<span>No more shows today</span>`;
      return `<span><b>${showing.length}</b> film${showing.length > 1 ? "s" : ""} still showing today</span><span>Next: <b>${showing[0].f.title}</b> at ${D.fmtTime(showing[0].next.h, showing[0].next.m)}</span>`;
    }
    function paint() {
      const rows = D.cinemas.filter(c => (!region || c.region === region) && (!q || (c.name + " " + c.city + " " + c.address).toLowerCase().includes(q)));
      list.innerHTML = rows.length ? rows.map(c => `<div class="cinema" aria-pressed="${c.id === myCinema}" data-id="${c.id}">
        <div><h3>${c.name}</h3><p>${c.address}, ${c.city} · ${c.screens} screens · ${c.region}</p></div>
        <div class="actions"><button class="btn btn--ghost btn--sm pick" type="button">${c.id === myCinema ? "Your cinema" : "Choose"}</button><a class="btn btn--sm ${c.id === myCinema ? "" : "btn--ghost"}" href="movies.html?cinema=${c.id}">Showtimes</a></div>
        <div class="chips">${c.formats.map(x => `<span class="chip chip--sm">${D.formats[x].name}</span>`).join("")}</div>
        <p class="cinema__today">${todayLine(c)}</p>
      </div>`).join("") : `<div class="empty"><h3>No cinema matches</h3><p>Try a city name like Cebu or Quezon City, or clear the region filter.</p></div>`;
    }
    // Lesson: Event Delegation — one listener on the list; the Showtimes link is left to navigate on its own
    list.addEventListener("click", e => {
      if (e.target.closest("a")) return;
      const c = e.target.closest(".cinema"); if (!c) return;
      setMyCinema(c.dataset.id); paint(); paintToday();
    });
    search.addEventListener("input", () => { q = search.value.trim().toLowerCase(); paint(); });
    regionEl.addEventListener("click", e => { const b = e.target.closest(".chip"); if (!b) return; region = b.dataset.region; $$(".chip", regionEl).forEach(x => x.setAttribute("aria-pressed", x === b)); paint(); });
    function paintToday() {
      const todayIso = D.isoDate(today), now = minutesNow();
      const here = D.films.filter(f => f.status === "now" && D.sessions(f.id, myCinema, todayIso).some(g => g.times.some(t => t.h * 60 + t.m >= now)));
      $("#grid-today").innerHTML = (here.length ? here : D.films.filter(f => f.status === "now")).slice(0, 8).map(tile).join("");
      $("#today-sub").textContent = here.length ? "Next shows at your cinema. Tap a film to pick a time." : "No more shows today at your cinema. Here is what's on this week.";
    }
    paint(); paintToday(); wireTiles($("#grid-today"));
  }

  // ================= EXPERIENCE =================
  if (page === "experience") {
    const icons = { standard: "i-screen", grand: "i-grand", wrap: "i-wrap", salon: "i-salon" };
    /* Lesson: Polymorphism — the page is built by calling the same perks() on every Screen subclass with forEach. */
    const xp = $("#xp");
    D.screens.forEach(screen => {
      const where = D.cinemas.filter(c => c.formats.includes(screen.id));
      const films = D.films.filter(f => f.status === "now" && f.formats.includes(screen.id));
      xp.insertAdjacentHTML("beforeend", `<article class="xp__item" id="${screen.id}">
        <div>
          <div class="xp__head"><svg class="icon"><use href="#${icons[screen.id]}"/></svg><div><h3>${screen.name}</h3><p class="xp__price">${D.peso(screen.price)}<small>per seat</small></p></div></div>
          <p class="xp__blurb">${screen.blurb}</p>
          <ul class="perks">${screen.perks().map(p => `<li>${p}</li>`).join("")}</ul>
        </div>
        <aside class="xp__side">
          <h4>Where to find it</h4>
          <div class="chips">${where.map(c => `<a class="chip" href="movies.html?cinema=${c.id}&format=${screen.id}">${c.name.replace("Taracine ", "")}</a>`).join("")}</div>
          <h4>Showing in ${screen.name} this week</h4>
          <p class="muted" style="font-size:.9375rem">${films.length ? films.slice(0, 4).map(f => f.title).join(" · ") + (films.length > 4 ? ` and ${films.length - 4} more` : "") : "Nothing scheduled this week."}</p>
          <div class="actions"><a class="btn btn--sm" href="movies.html?format=${screen.id}">Browse ${screen.name} films<svg class="icon"><use href="#i-arrow"/></svg></a></div>
        </aside>
      </article>`);
    });
  }

  // ================= LOGIN =================
  /* Lesson: JavaScript and Forms — Login Form (Week 9). Same structure as the lesson: select the form and fields,
     validateEmail() and validatePassword() return true/false, showError()/showValid() print feedback next to the
     field, input + blur give real-time feedback, the Show Password checkbox flips the input type, submit uses
     preventDefault() and runs every validator before continuing. The account check is a real request to
     dummyjson.com (fetch + async/await + try...catch, from the Asynchronous JavaScript lesson). */
  if (page === "login") {
    const form = document.getElementById("loginForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const showPassword = document.getElementById("showPassword");
    const rememberMe = document.getElementById("rememberMe");
    const output = document.getElementById("output");
    const submitBtn = document.getElementById("loginBtn");
    const signedIn = document.getElementById("signed-in");
    const firstName = document.getElementById("firstName"), lastName = document.getElementById("lastName");
    const nameFields = document.getElementById("name-fields");
    let mode = params.get("mode") === "signup" ? "signup" : "login";
    const next = params.get("next") && params.get("next").startsWith("film.html") ? params.get("next") : "index.html";

    function paintMode() {
      const signup = mode === "signup";
      nameFields.hidden = !signup;
      $("#login-h1").textContent = signup ? "Create account" : "Sign in";
      $("#login-sub").textContent = signup ? "Your tickets and Cinema Points live in one place." : (params.get("next") ? "Sign in to finish your booking. Your seats are kept while you do." : "Members book first and earn Cinema Points on every seat.");
      $("#email-label").textContent = signup ? "Email Address" : "Email or username";
      email.placeholder = signup ? "Enter email" : "Enter email or username";
      email.autocomplete = signup ? "email" : "username";
      password.autocomplete = signup ? "new-password" : "current-password";
      submitBtn.innerHTML = `${signup ? "Create account" : "Login"}<svg class="icon"><use href="#i-arrow"/></svg>`;
      $("#mode-toggle").textContent = signup ? "Sign in instead" : "Create an account";
      $("#mode-toggle").previousSibling.textContent = signup ? "Already a member? " : "New here? ";
      output.hidden = true;
    }
    $("#mode-toggle").addEventListener("click", () => { mode = mode === "signup" ? "login" : "signup"; paintMode(); });

    function showError(input, messageElement, message) {
      messageElement.textContent = message;
      messageElement.classList.add("error");
      messageElement.classList.remove("valid-message");
      input.classList.add("invalid");
      input.classList.remove("valid");
      input.setAttribute("aria-invalid", "true");
    }
    function showValid(input, messageElement) {
      messageElement.textContent = "Looks good.";
      messageElement.classList.remove("error");
      messageElement.classList.add("valid-message");
      input.classList.remove("invalid");
      input.classList.add("valid");
      input.removeAttribute("aria-invalid");
    }
    function validateEmail() {
      const emailValue = email.value.trim();
      if (emailValue === "") { showError(email, emailError, mode === "signup" ? "Email is required." : "Email or username is required."); return false; }
      if (mode === "signup" && !emailValue.includes("@")) { showError(email, emailError, "Email must contain @."); return false; }
      if (mode === "login" && !emailValue.includes("@") && emailValue.length < 3) { showError(email, emailError, "Username must have at least 3 characters."); return false; }
      showValid(email, emailError);
      return true;
    }
    function validatePassword() {
      const passwordValue = password.value;
      if (passwordValue === "") { showError(password, passwordError, "Password is required."); return false; }
      if (passwordValue.length < 6) { showError(password, passwordError, "Password must have at least 6 characters."); return false; }
      showValid(password, passwordError);
      return true;
    }
    function validateName(input, messageElement, label) {
      if (mode !== "signup") return true;
      if (input.value.trim() === "") { showError(input, messageElement, `${label} is required.`); return false; }
      showValid(input, messageElement);
      return true;
    }
    // Real-time feedback: while typing and after leaving the field
    email.addEventListener("input", validateEmail);
    email.addEventListener("blur", validateEmail);
    password.addEventListener("input", validatePassword);
    password.addEventListener("blur", validatePassword);
    firstName.addEventListener("input", () => validateName(firstName, $("#firstNameError"), "First name"));
    lastName.addEventListener("input", () => validateName(lastName, $("#lastNameError"), "Last name"));
    // Show Password: a checkbox changes the input type
    showPassword.addEventListener("change", function () {
      password.type = showPassword.checked ? "text" : "password";
    });

    form.addEventListener("submit", async function (event) {
      event.preventDefault();                       // keep the page from reloading
      const emailOK = validateEmail();
      const passwordOK = validatePassword();
      const firstOK = validateName(firstName, $("#firstNameError"), "First name");
      const lastOK = validateName(lastName, $("#lastNameError"), "Last name");
      if (!(emailOK && passwordOK && firstOK && lastOK)) { output.className = "state state--warn"; output.innerHTML = `<svg class="icon"><use href="#i-info"/></svg><span>Fix the fields above, then try again.</span>`; output.hidden = false; return; }
      output.hidden = false; output.className = "state state--info"; output.innerHTML = `<svg class="icon"><use href="#i-clock"/></svg><span>${mode === "signup" ? "Creating your account…" : "Signing in…"}</span>`;
      submitBtn.disabled = true;
      try {
        const result = mode === "signup"
          ? await D.registerUser({ firstName: firstName.value.trim(), lastName: lastName.value.trim(), email: email.value.trim(), password: password.value })
          : await D.loginUser(email.value.trim(), password.value);
        D.store.setUser(result, rememberMe.checked);
        let message = (mode === "signup" ? "Account created! Welcome, " : "Login successful! Welcome, ") + result.name + (result.email ? ` (${result.email})` : "");
        if (rememberMe.checked) message += ". Remember Me is ON.";
        output.className = "state"; output.innerHTML = `<svg class="icon"><use href="#i-check"/></svg><span>${message}</span>`;
        if (signIn) signIn.innerHTML = `<svg class="icon"><use href="#i-user"/></svg>Hi, ${result.name}`;
        setTimeout(() => { location.href = next; }, 1400);
      } catch (error) {
        output.className = "state state--warn"; output.innerHTML = `<svg class="icon"><use href="#i-info"/></svg><span>${error.message || error}</span>`;
        submitBtn.disabled = false;
      }
    });

    paintMode();
    if (user) {
      signedIn.hidden = false;
      signedIn.querySelector("b").textContent = `${user.name} ${user.lastName || ""}`.trim() + (user.email ? ` · ${user.email}` : "");
      document.getElementById("sign-out").addEventListener("click", () => { D.store.clearUser(); location.reload(); });
      if (params.get("next")) { output.hidden = false; output.className = "state"; output.innerHTML = `<svg class="icon"><use href="#i-check"/></svg><span>You're signed in. <a class="link" href="${next}">Back to your booking</a></span>`; }
    }
  }

  // ================= TICKETS =================
  /* Receipts are rendered as an "online ticket" document: operator header, fiscal rows, then one ticket per seat
     with a blank QR area and a barcode, a Screen bar, the amount breakdown and a Seat bar. All fiscal values are demo
     values. Cancellation closes 12 hours before the show. */
  if (page === "tickets") {
    const list = $("#receipts"), highlight = params.get("ref");
    const CANCEL_WINDOW_MS = 12 * 60 * 60 * 1000;
    const OPERATOR = { name: "Taracine Cinemas Corporation", tin: "000-123-456-000", min: "20260101260000001", sn: "TRC-POS-07" };
    function showDate(b) {
      if (b.showAt) return new Date(b.showAt);
      const m = /(\d+):(\d+) (AM|PM)/.exec(b.time || ""); let h = m ? +m[1] % 12 : 0; if (m && m[3] === "PM") h += 12;
      return new Date(`${b.date}T${String(h).padStart(2, "0")}:${m ? m[2] : "00"}:00`);
    }
    function canCancel(b) { return showDate(b).getTime() - Date.now() > CANCEL_WINDOW_MS; }
    function cancelLabel(b) {
      const left = showDate(b).getTime() - Date.now();
      if (left <= 0) return "Show has started";
      if (left <= CANCEL_WINDOW_MS) return "Cancellations closed (12 hours before the show)";
      const deadline = new Date(showDate(b).getTime() - CANCEL_WINDOW_MS);
      return `Free cancellation until ${DAYS[deadline.getDay()]} ${deadline.getDate()} ${MONTHS[deadline.getMonth()]}, ${D.fmtTime(deadline.getHours(), deadline.getMinutes())}`;
    }
    function fmtDateTime(iso) { const d = new Date(iso); return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}-${D.fmtTime(d.getHours(), d.getMinutes()).toLowerCase()}`; }
    function money(n) { return n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

    function ticketHTML(b, seat, idx) {
      const per = b.pricePerSeat || Math.round(b.total / b.seats.length);
      const basic = per / 1.22, amTax = basic * 0.10, cTax = basic * 0.12;     // demo breakdown: amusement tax + VAT
      const code = `${b.ref}-${String(idx + 1).padStart(2, "0")}`;
      const d = showDate(b);
      return `<section class="doc__ticket">
        <div class="doc__body">
          <div class="doc__kv">
            <span>Booking No.</span><b>${code}</b>
            <span class="movie">${b.filmTitle}</span>
            <span>Screening Date</span><b>${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}</b>
            <span>Screening Time</span><b>${b.time}</b>
            <span class="plain">${b.rating ? `${b.rating} · ${b.censor || ""}` : ""}</span>
            <span>Ticket Type</span><b>${b.format} · Regular</b>
            <span>Name</span><b>${b.name}</b>
          </div>
          <div class="doc__codes">
            <div class="qrbox" aria-label="QR code area, left blank in this study"></div>
            <svg class="barcode" data-barcode="${code}"></svg>
            <small>${code}</small>
          </div>
        </div>
        <div class="doc__bar"><span>Screen</span><b>Cinema ${b.screen || 1}</b></div>
        <div class="doc__amounts">
          <span>Gross</span><span>${money(per)}</span>
          <span>Ord.</span><span>1</span>
          <span>Discount</span><span>0.00</span>
          <span>Net</span><span>${money(per)}</span>
          <span>Basic</span><span>${money(basic)}</span>
          <span>Am. Tax</span><span>${money(amTax)}</span>
          <span>C. Tax</span><span>${money(cTax)}</span>
          <span class="due">Amt due</span><span class="due">₱${money(per)}</span>
        </div>
        <div class="doc__bar"><span>Seat</span><b>${seat.replace(/^([A-Z]+)(\d+)$/, "$1-$2")}</b></div>
      </section>`;
    }
    function paint() {
      const all = D.store.bookings();
      $("#tickets-sub").textContent = all.length ? `${all.length} booking${all.length > 1 ? "s" : ""} made in this browser. Show a ticket's code at the door. Cancellations close 12 hours before the show.` : "No bookings yet. Pick a film and a time to get started.";
      $("#print-tickets").hidden = !all.length;
      list.innerHTML = all.length ? all.map((b, i) => `<article class="doc ${b.ref === highlight ? "new" : ""}" data-ref="${b.ref}">
        <header class="doc__head">
          <div class="doc__brand"><i aria-hidden="true"></i>taracine</div>
          <div class="doc__title">Taracine Online Ticket</div>
          <div class="doc__operator"><b>${OPERATOR.name}</b><u>${b.cinemaName}</u>${b.cinemaAddress || ""}</div>
        </header>
        <div class="doc__fiscal">
          <span>Business Name</span><span>${OPERATOR.name}</span>
          <span>VAT Reg TIN</span><span>${OPERATOR.tin}</span>
          <span>MIN</span><span>${OPERATOR.min}</span>
          <span>Machine SN</span><span>${OPERATOR.sn}</span>
          <span>Trans. Date</span><span>${fmtDateTime(b.paidAt)}</span>
          <span>OR Number</span><span>${String(100000 + (D.hash(b.ref) % 899999)).padStart(8, "0")}</span>
          <span>T/N</span><span>${b.ref}/${String(b.seats.length).padStart(3, "0")}</span>
          <span>Payment</span><span>${b.method}</span>
        </div>
        ${b.seats.map((seat, idx) => ticketHTML(b, seat, idx)).join("")}
        <div class="doc__foot"><span>Ref <b>${b.ref}</b> · ${b.seats.length} ticket${b.seats.length > 1 ? "s" : ""} · ₱${money(b.total)} total</span>
          ${canCancel(b) ? `<span>${b.ref === highlight ? "Just booked · " : ""}<button type="button" class="link" data-cancel="${b.ref}">Cancel booking</button> <span class="locked">(${cancelLabel(b)})</span></span>` : `<span class="locked">${cancelLabel(b)}</span>`}
        </div>
      </article>`).join("") : `<div class="empty"><h3>Nothing booked yet</h3><p>Your tickets will show up here after payment.</p><a class="btn btn--sm" href="movies.html">Browse movies</a></div>`;
      drawCodes();
    }
    function drawCodes() {
      $$("svg[data-barcode]", list).forEach(svg => {
        if (window.JsBarcode) { try { JsBarcode(svg, svg.dataset.barcode, { format: "CODE128", displayValue: false, height: 44, width: 1.4, margin: 0 }); return; } catch (e) {} }
        svg.outerHTML = `<small>${svg.dataset.barcode}</small>`;
      });
    }
    // Lesson: Event Delegation — one listener on the list handles every Cancel button; the 12-hour rule is re-checked at click time
    list.addEventListener("click", e => {
      const btn = e.target.closest("[data-cancel]"); if (!btn) return;
      const b = D.store.bookings().find(x => x.ref === btn.dataset.cancel);
      if (!b || !canCancel(b)) { paint(); return; }
      D.store.removeBooking(b.ref); paint();
    });
    $("#print-tickets").addEventListener("click", () => window.print());
    paint();
  }
})();
