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

  // ----- remembered sign-in (from the login page's Remember Me) -----
  let user = null;
  try { user = JSON.parse(localStorage.getItem("taracine.user") || "null"); } catch (e) {}
  const signIn = $("#sign-in");
  if (signIn && user) signIn.innerHTML = `<svg class="icon"><use href="#i-user"/></svg>Hi, ${user.name}`;

  // ----- shell -----
  $$("[data-nav]").forEach(a => { if (a.dataset.nav === page) a.setAttribute("aria-current", "page"); });
  function inlineNote(el, text) { const old = el.innerHTML; el.textContent = text; setTimeout(() => el.innerHTML = old, 2200); }
  const tabTix = $("#tab-tickets"); if (tabTix) tabTix.addEventListener("click", e => { e.preventDefault(); inlineNote(tabTix, "No tickets yet"); });

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
      <div class="tile__art"><img src="assets/posters/${f.id}.svg" alt="" width="400" height="600" loading="lazy"><span class="${ratingClass(f.rating)}">${f.rating}</span>
        <a class="tile__open" href="${filmUrl(f)}" aria-label="Open ${f.title}" title="Open"><svg class="icon"><use href="#i-open"/></svg></a></div>
      <div class="tile__body"><span class="tile__title">${f.title}</span><span class="tile__meta"><span>${f.genres.join(" · ")}</span><span>${runtime(f.runtime)}</span></span>${line}</div>
    </article>`;
  }

  // select-then-continue
  const bar = $("#continue");
  function showBar(opts) {
    if (!bar) return;
    $("#continue-art").src = opts.art || ""; $("#continue-title").textContent = opts.title; $("#continue-sub").textContent = opts.sub || "";
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
      showBar({ art: `assets/posters/${f.id}.svg`, title: f.title, sub: f.status === "soon" ? `Opens ${fmtRelease(f.release)} · details and reminders` : `${cinema().name} · ${nx.text}`, label: f.status === "soon" ? "See details" : "Pick a time", href: filmUrl(f) });
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
    const filters = { format: "", rating: "" };
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
    $("#film-title").textContent = film.title; $("#film-tagline").textContent = film.tagline;
    const poster = $("#film-poster"); poster.src = `assets/posters/${film.id}.svg`; poster.alt = `Poster art for ${film.title}`;
    $("#film-chips").innerHTML = `<span class="${ratingClass(film.rating)}" title="${D.ratingDescriptions[film.rating]}">${film.rating}</span>` + film.formats.map(x => `<span class="chip chip--sm">${D.formats[x].name}</span>`).join("");
    $("#film-specs").innerHTML = `
      <div><dt>Runtime</dt><dd>${runtime(film.runtime)}</dd></div>
      <div><dt>${film.status === "soon" ? "Opens" : "Released"}</dt><dd>${fmtRelease(film.release)}</dd></div>
      <div><dt>Genre</dt><dd>${film.genres.join(" · ")}</dd></div>
      <div><dt>Rating</dt><dd>${D.ratingDescriptions[film.rating]}</dd></div>
      <div><dt>Director</dt><dd>${film.director}</dd></div>
      <div><dt>Cast</dt><dd>${film.cast.join(", ")}</dd></div>`;
    $("#film-synopsis").innerHTML = film.synopsis.map(p => `<p>${p}</p>`).join("");
    $("#trailer-btn").addEventListener("click", () => { $("#trailer-state").hidden = false; });

    // --- cinema & time ---
    const pills = $("#cinema-pills"), datesEl = $("#dates"), ffEl = $("#format-filter"), sessionsEl = $("#sessions"), legend = $("#legend"), addr = $("#cinema-address"), timeLabel = $("#time-label");
    const dates = dateList();
    let dateIso = dates.map(D.isoDate).includes(params.get("date")) ? params.get("date") : D.isoDate(dates[0]);
    let chosen = null, focusFormat = "";
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

    function resetChoice() { chosen = null; seats = []; stopHold(); holdState = "idle"; }

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
      if (chosen) { seats.push(seatLabel(0)); seats.push(seatLabel(1)); }   // Lesson: push() — start with two seats
      $$(".time", sessionsEl).forEach(x => x.setAttribute("aria-pressed", x === b && !same));
      paintTickets();
    });

    // seat labels are deterministic per showtime so the demo is stable: row from the format, numbers from the hash
    function seatLabel(i) {
      const row = { standard: "H", grand: "J", wrap: "F", salon: "B" }[chosen.format] || "G";
      const start = 3 + (D.hash(film.id + chosen.h + chosen.m) % 9);
      return `${row}${start + i}`;
    }

    // --- tickets ---
    const ticketsSec = $("#tickets"), summary = $("#summary"), qtyOut = $("#qty"), holdEl = $("#hold-state"), qtyNote = $("#qty-note"), seatsOut = $("#seats-list");
    function paintTickets() {
      const s2 = $("#step-2"), s3 = $("#step-3");
      if (!chosen) {
        ticketsSec.hidden = true; s2.setAttribute("aria-current", "step"); s2.classList.remove("done"); s2.querySelector("b").textContent = "2"; s3.removeAttribute("aria-current");
        if (film.status === "now") showBar({ art: `assets/posters/${film.id}.svg`, title: film.title, sub: `${cinema().name} · ${fmtDay(dateIso)} · pick a time`, label: "Pick a time" });
        else hideBar();
        const btn = $("#continue-btn"); btn.disabled = false; btn.onclick = () => $("#sessions").scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      const F = D.formats[chosen.format];
      const qty = seats.length;
      ticketsSec.hidden = false; s2.removeAttribute("aria-current"); s2.classList.add("done"); s2.querySelector("b").innerHTML = `<svg class="icon"><use href="#i-check"/></svg>`; s3.setAttribute("aria-current", "step");
      const max = Math.min(6, chosen.seats);
      const locked = holdState === "holding" || holdState === "held";
      $("#qty-minus").disabled = qty <= 1 || locked; $("#qty-plus").disabled = qty >= max || locked; qtyOut.textContent = qty;
      seatsOut.textContent = seats.join(", ");
      qtyNote.textContent = `${chosen.seats} seats available in ${F.name}. Up to 6 per booking.`;
      summary.innerHTML = `<div class="row"><span>Film</span><b>${film.title}</b></div><div class="row"><span>Cinema</span><b>${cinema().name}</b></div><div class="row"><span>When</span><b>${fmtDay(dateIso)} · ${D.fmtTime(chosen.h, chosen.m)}</b></div><div class="row"><span>Format</span><b>${F.name}</b></div><div class="row"><span>Seats</span><b>${seats.join(", ")}</b></div><div class="row"><span>Price</span><b>${qty} × ${D.peso(F.price)}</b></div><div class="row total"><span>Total</span><b>${D.peso(F.priceFor(qty))}</b></div>`;
      const label = holdState === "holding" ? "Holding…" : holdState === "held" ? `Held · ${mmss(holdSecondsLeft)}` : holdState === "expired" ? "Hold again" : "Buy tickets";
      showBar({ art: `assets/posters/${film.id}.svg`, title: `${film.title} · ${D.fmtTime(chosen.h, chosen.m)}`, sub: `${cinema().name} · ${fmtDay(dateIso)} · ${F.name} · ${qty} seat${qty > 1 ? "s" : ""} · ${D.peso(F.priceFor(qty))}`, label });
      const btn = $("#continue-btn");
      btn.disabled = locked;
      btn.onclick = () => {
        if (ticketsSec.getBoundingClientRect().top > innerHeight * 0.6) ticketsSec.scrollIntoView({ behavior: "smooth", block: "start" });
        hold();
      };
    }
    $("#qty-minus").addEventListener("click", () => { if (seats.length > 1) seats.pop(); paintTickets(); });          // Lesson: pop() removes the last seat
    $("#qty-plus").addEventListener("click", () => { if (chosen && seats.length < Math.min(6, chosen.seats)) seats.push(seatLabel(seats.length)); paintTickets(); }); // Lesson: push() adds the next seat

    function mmss(s) { return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }
    function stopHold() { if (holdTimer) { clearInterval(holdTimer); holdTimer = null; } holdEl.hidden = true; holdEl.className = "state"; }

    /* Lesson: Async/Await with try...catch. holdSeats() in data.js returns a Promise that resolves after a short
       delay (a simulated server). The page prints "Holding…" first, awaits the result, then prints success or the
       error, without ever freezing. Then setInterval() counts the hold down every second and clearInterval() stops it. */
    async function hold() {
      holdState = "holding"; paintTickets();
      holdEl.hidden = false; holdEl.className = "state state--info"; holdEl.innerHTML = `<svg class="icon"><use href="#i-clock"/></svg><span>Holding your seats…</span>`;
      try {
        const result = await D.holdSeats(seats);
        holdState = "held"; holdSecondsLeft = result.minutes * 60;
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

    const also = D.films.filter(f => f.status === "now" && f.id !== film.id).slice(0, 6);
    $("#grid-also").innerHTML = also.map(tile).join("");
    $("#grid-also").addEventListener("click", e => { const t = e.target.closest(".tile"); if (t && !e.target.closest(".tile__open")) location.href = filmUrl(D.films.find(x => x.id === t.dataset.id)); });
  }

  // ================= LOGIN =================
  /* Lesson: JavaScript and Forms — Login Form (Week 9). Same structure as the lesson: select the form and fields,
     validateEmail() and validatePassword() return true/false, showError()/showValid() print feedback next to the
     field, input + blur give real-time feedback, the Show Password checkbox flips the input type, submit uses
     preventDefault() and runs every validator before showing success. The login check itself is a Promise
     (checkLogin in data.js) awaited with try...catch, as in the Asynchronous JavaScript lesson. */
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
      if (emailValue === "") { showError(email, emailError, "Email is required."); return false; }
      if (!emailValue.includes("@")) { showError(email, emailError, "Email must contain @."); return false; }
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
    // Real-time feedback: while typing and after leaving the field
    email.addEventListener("input", validateEmail);
    email.addEventListener("blur", validateEmail);
    password.addEventListener("input", validatePassword);
    password.addEventListener("blur", validatePassword);
    // Show Password: a checkbox changes the input type
    showPassword.addEventListener("change", function () {
      password.type = showPassword.checked ? "text" : "password";
    });

    form.addEventListener("submit", async function (event) {
      event.preventDefault();                       // keep the page from reloading
      const emailOK = validateEmail();
      const passwordOK = validatePassword();
      if (!(emailOK && passwordOK)) { output.className = "state state--warn"; output.innerHTML = `<svg class="icon"><use href="#i-info"/></svg><span>Fix the fields above, then try again.</span>`; output.hidden = false; return; }
      output.hidden = false; output.className = "state state--info"; output.innerHTML = `<svg class="icon"><use href="#i-clock"/></svg><span>Signing in…</span>`;
      submitBtn.disabled = true;
      try {
        const result = await D.checkLogin(email.value.trim(), password.value);
        let message = "Login successful! Welcome, " + result.email;
        if (rememberMe.checked) { message += ". Remember Me is ON."; try { localStorage.setItem("taracine.user", JSON.stringify(result)); } catch (e) {} }
        output.className = "state"; output.innerHTML = `<svg class="icon"><use href="#i-check"/></svg><span>${message}</span>`;
        if (signIn) signIn.innerHTML = `<svg class="icon"><use href="#i-user"/></svg>Hi, ${result.name}`;
        setTimeout(() => { location.href = params.get("next") || "index.html"; }, 1600);
      } catch (error) {
        output.className = "state state--warn"; output.innerHTML = `<svg class="icon"><use href="#i-info"/></svg><span>${error}</span>`;
        submitBtn.disabled = false;
      }
    });

    if (user) {
      signedIn.hidden = false;
      signedIn.querySelector("b").textContent = user.email;
      document.getElementById("sign-out").addEventListener("click", () => { try { localStorage.removeItem("taracine.user"); } catch (e) {} location.reload(); });
    }
  }
})();
