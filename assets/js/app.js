/* Taracine — Kiosk Clarity behaviors. State transitions only; nothing animates at rest. */
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

  // ----- shell -----
  $$("[data-nav]").forEach(a => { if (a.dataset.nav === page) a.setAttribute("aria-current", "page"); });
  function inlineNote(el, text) { const old = el.innerHTML; el.textContent = text; setTimeout(() => el.innerHTML = old, 2200); }
  const signIn = $("#sign-in"); if (signIn) signIn.addEventListener("click", e => { e.preventDefault(); inlineNote(signIn, "Accounts are outside this study"); });
  const tabAcc = $("#tab-account"); if (tabAcc) tabAcc.addEventListener("click", e => { e.preventDefault(); inlineNote(tabAcc, "Outside this study"); });
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

  // next showtime today at my cinema (any format)
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

  function wireTiles(root) {
    root.addEventListener("click", e => {
      if (e.target.closest(".tile__open")) return;
      const t = e.target.closest(".tile"); if (!t) return;
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

    const list = $("#cinema-list");
    function paintCinemas() {
      list.innerHTML = D.cinemas.map(c => `<div class="cinema" aria-pressed="${c.id === myCinema}" data-id="${c.id}">
        <div><h3>${c.name}</h3><p>${c.address}, ${c.city} · ${c.screens} screens</p></div>
        <button class="btn btn--ghost btn--sm pick" type="button">${c.id === myCinema ? "Your cinema" : "Choose"}</button>
        <div class="chips">${c.formats.filter(x => x !== "standard").map(x => `<span class="chip chip--sm">${D.formats[x].name}</span>`).join("")}</div>
      </div>`).join("");
    }
    paintCinemas();
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
    const pills = $("#cinema-pills"), datesEl = $("#dates"), ffEl = $("#format-filter"), sessionsEl = $("#sessions"), legend = $("#legend"), addr = $("#cinema-address");
    const dates = dateList();
    let dateIso = dates.map(D.isoDate).includes(params.get("date")) ? params.get("date") : D.isoDate(dates[0]);
    let chosen = null, focusFormat = "", qty = 2, held = false;

    function paintPills() {
      pills.innerHTML = D.cinemas.map(c => `<button type="button" class="cpill" data-id="${c.id}" aria-pressed="${c.id === myCinema}"><b>${c.name.replace("Taracine ", "")}</b><small>${c.city}</small></button>`).join("");
      addr.textContent = `${cinema().address}, ${cinema().city}`;
    }
    pills.addEventListener("click", e => { const b = e.target.closest(".cpill"); if (!b) return; setMyCinema(b.dataset.id); chosen = null; held = false; paintPills(); paintFormats(); paintSessions(); });
    datesEl.innerHTML = dates.map((d, i) => `<button type="button" class="date" data-date="${D.isoDate(d)}" aria-pressed="${D.isoDate(d) === dateIso}"><small>${dayLabel(d, i)}</small><b>${d.getDate()} ${MONTHS[d.getMonth()]}</b></button>`).join("");
    datesEl.addEventListener("click", e => { const b = e.target.closest(".date"); if (!b) return; dateIso = b.dataset.date; chosen = null; held = false; $$(".date", datesEl).forEach(x => x.setAttribute("aria-pressed", x === b)); paintSessions(); });
    function paintFormats() {
      const avail = film.formats.filter(x => cinema().formats.includes(x));
      ffEl.innerHTML = [`<button type="button" class="chip" data-f="" aria-pressed="${!focusFormat}">All</button>`].concat(avail.map(x => `<button type="button" class="chip" data-f="${x}" aria-pressed="${focusFormat === x}">${D.formats[x].name} · ${D.peso(D.formats[x].price)}</button>`)).join("");
    }
    ffEl.addEventListener("click", e => { const b = e.target.closest(".chip"); if (!b) return; focusFormat = b.dataset.f; $$(".chip", ffEl).forEach(x => x.setAttribute("aria-pressed", x === b)); $$(".group", sessionsEl).forEach(g => g.classList.toggle("dim", !!focusFormat && g.dataset.format !== focusFormat)); });

    function paintSessions() {
      const c = cinema();
      if (film.status === "soon") {
        sessionsEl.innerHTML = `<div class="empty"><h3>Opens ${fmtRelease(film.release)}</h3><p>Tickets go on sale one week before opening. Club members book first.</p><a class="btn btn--ghost btn--sm" href="movies.html">See what's showing now</a></div>`;
        legend.hidden = true; paintBar(); return;
      }
      const groups = D.sessions(film.id, myCinema, dateIso);
      if (!groups.length) {
        const alt = D.cinemas.filter(x => x.id !== myCinema && film.formats.some(f => x.formats.includes(f))).slice(0, 3);
        sessionsEl.innerHTML = `<div class="empty"><h3>Not showing at ${c.name}</h3><p>Try a nearby Taracine:</p><div class="chips">${alt.map(x => `<button type="button" class="chip" data-alt="${x.id}">${x.name}</button>`).join("")}</div></div>`;
        legend.hidden = true; paintBar(); return;
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
      legend.hidden = false; paintBar();
    }
    sessionsEl.addEventListener("click", e => {
      const alt = e.target.closest("[data-alt]"); if (alt) { setMyCinema(alt.dataset.alt); chosen = null; paintPills(); paintFormats(); paintSessions(); return; }
      const b = e.target.closest(".time"); if (!b || b.disabled) return;
      const same = chosen && chosen.format === b.dataset.format && chosen.h === +b.dataset.h && chosen.m === +b.dataset.m;
      chosen = same ? null : { format: b.dataset.format, h: +b.dataset.h, m: +b.dataset.m, seats: +b.dataset.seats };
      held = false; qty = Math.min(qty, chosen ? chosen.seats : 6);
      $$(".time", sessionsEl).forEach(x => x.setAttribute("aria-pressed", x === b && !same));
      paintBar();
    });

    // --- tickets ---
    const ticketsSec = $("#tickets"), summary = $("#summary"), qtyOut = $("#qty"), holdState = $("#hold-state"), qtyNote = $("#qty-note");
    function paintBar() {
      const s2 = $("#step-2"), s3 = $("#step-3");
      if (!chosen) {
        ticketsSec.hidden = true; s2.setAttribute("aria-current", "step"); s2.classList.remove("done"); s2.querySelector("b").textContent = "2"; s3.removeAttribute("aria-current");
        if (film.status === "now") showBar({ art: `assets/posters/${film.id}.svg`, title: film.title, sub: `${cinema().name} · ${fmtDay(dateIso)} · pick a time`, label: "Pick a time" });
        else hideBar();
        const btn = $("#continue-btn"); btn.onclick = () => $("#sessions").scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      const F = D.formats[chosen.format];
      ticketsSec.hidden = false; s2.removeAttribute("aria-current"); s2.classList.add("done"); s2.querySelector("b").innerHTML = `<svg class="icon"><use href="#i-check"/></svg>`; s3.setAttribute("aria-current", "step");
      const max = Math.min(6, chosen.seats);
      $("#qty-minus").disabled = qty <= 1 || held; $("#qty-plus").disabled = qty >= max || held; qtyOut.textContent = qty;
      qtyNote.textContent = `${chosen.seats} seats available in ${F.name}. Up to 6 per booking.`;
      summary.innerHTML = `<div class="row"><span>Film</span><b>${film.title}</b></div><div class="row"><span>Cinema</span><b>${cinema().name}</b></div><div class="row"><span>When</span><b>${fmtDay(dateIso)} · ${D.fmtTime(chosen.h, chosen.m)}</b></div><div class="row"><span>Format</span><b>${F.name}</b></div><div class="row"><span>Seats</span><b>${qty} × ${D.peso(F.price)}</b></div><div class="row total"><span>Total</span><b>${D.peso(qty * F.price)}</b></div>`;
      showBar({ art: `assets/posters/${film.id}.svg`, title: `${film.title} · ${D.fmtTime(chosen.h, chosen.m)}`, sub: `${cinema().name} · ${fmtDay(dateIso)} · ${F.name} · ${qty} seat${qty > 1 ? "s" : ""} · ${D.peso(qty * F.price)}`, label: held ? "Held · 10:00" : "Buy tickets" });
      const btn = $("#continue-btn");
      btn.disabled = held;
      btn.onclick = () => {
        if (ticketsSec.getBoundingClientRect().top > innerHeight * 0.6) { ticketsSec.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
        held = true; holdState.hidden = false; holdState.querySelector("span").textContent = `${qty} seat${qty > 1 ? "s" : ""} held for 10 minutes. In the real flow, seat selection and payment open here; this study stops at the hold.`;
        paintBar();
      };
    }
    $("#qty-minus").addEventListener("click", () => { qty = Math.max(1, qty - 1); paintBar(); });
    $("#qty-plus").addEventListener("click", () => { qty = Math.min(6, chosen ? chosen.seats : 6, qty + 1); paintBar(); });

    paintPills(); paintFormats(); paintSessions();

    // also showing
    const also = D.films.filter(f => f.status === "now" && f.id !== film.id).slice(0, 6);
    $("#grid-also").innerHTML = also.map(tile).join("");
    $("#grid-also").addEventListener("click", e => { const t = e.target.closest(".tile"); if (t && !e.target.closest(".tile__open")) location.href = filmUrl(D.films.find(x => x.id === t.dataset.id)); });
  }
})();
