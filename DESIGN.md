---
name: Taracine
description: A cinema-chain booking site built like the lobby's self-service kiosk — one task per course, oversized targets, one rationed orange.
colors:
  ground: "#FFFFFF"
  panel: "#F2F3F5"
  panel-2: "#E9EBEF"
  hairline: "#E3E5E9"
  ink: "#0F1115"
  ink-hover: "#2A2D33"
  mid: "#5C6370"
  accent: "#FF5A1F"
  accent-hover: "#E84A12"
  accent-soft: "#FFE9DF"
  accent-ink: "#9A3208"
  on-accent: "#0F1115"
  on-accent-soft: "#4A1C09"
  ok: "#1E9E6A"
  ok-soft: "#E3F5EC"
  ok-ink: "#0F6B47"
  warn-soft: "#FFF3E0"
  warn-ink: "#8A4B00"
  restricted: "#B3261E"
  on-ink-muted: "#B8BCC4"
  underline-rest: "#C7CBD2"
  placeholder: "#9AA0A8"
  invalid-soft: "#FFF5F4"
  warn-icon: "#C76A00"
  other-tab: "#FFD9CC"
  poster-scrim: "rgba(10,11,14,0.92)"
typography:
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
  display:
    fontFamily: "Lexend, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(2rem, 1.3rem + 2.4vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Lexend, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Lexend, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  price:
    fontFamily: "Lexend, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Lexend, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  body-sm:
    fontFamily: "Lexend, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "normal"
  meta:
    fontFamily: "Lexend, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Lexend, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.02em"
rounded:
  key: "4px"
  focus: "6px"
  badge: "8px"
  inset: "14px"
  cell: "16px"
  tile: "20px"
  card: "24px"
  pill: "999px"
  seat-top: "8px"
  seat-bottom: "6px"
  scrollbar-thumb: "10px"
  screen-bar: "18px"
spacing:
  "2xs": "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  "2xl": "32px"
  "3xl": "40px"
  gutter: "24px"
  gutter-mobile: "16px"
  topbar: "64px"
  target: "52px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.on-accent}"
  button-primary-disabled:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.mid}"
  button-ghost:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "52px"
  button-ghost-hover:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "52px"
  button-ink-hover:
    backgroundColor: "{colors.ink-hover}"
    textColor: "{colors.ground}"
  button-sm:
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "40px"
    typography: "{typography.body-sm}"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.mid}"
    rounded: "{rounded.pill}"
    padding: "0 14px"
    height: "40px"
  nav-link-hover:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
  nav-link-current:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  topbar-pill:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 14px 0 12px"
    height: "40px"
  step:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.mid}"
    rounded: "{rounded.pill}"
    padding: "6px 16px 6px 6px"
    height: "44px"
  step-current:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
  step-done:
    backgroundColor: "{colors.ok-soft}"
    textColor: "{colors.ok}"
  chip:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "0 14px"
    height: "36px"
  chip-hover:
    backgroundColor: "{colors.panel}"
  chip-pressed:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  chip-sm:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.mid}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 10px"
    height: "26px"
  rating-badge:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    typography: "{typography.label}"
    rounded: "{rounded.badge}"
    padding: "0 8px"
    height: "26px"
  rating-badge-g:
    backgroundColor: "{colors.ok}"
    textColor: "{colors.ground}"
  rating-badge-restricted:
    backgroundColor: "{colors.restricted}"
    textColor: "{colors.ground}"
  segmented:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.pill}"
    padding: "4px"
  segmented-option:
    backgroundColor: "transparent"
    textColor: "{colors.mid}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "40px"
  segmented-option-selected:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
  tile:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "8px"
  tile-hover:
    backgroundColor: "{colors.panel}"
  tile-selected:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.ink}"
  cinema-card:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tile}"
    padding: "16px 18px"
  cinema-card-selected:
    backgroundColor: "{colors.accent-soft}"
  cinema-pill:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.cell}"
    padding: "8px 16px"
    height: "56px"
  cinema-pill-pressed:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  date-cell:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.cell}"
    height: "64px"
  date-cell-pressed:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
  time-pill:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.cell}"
    padding: "10px 14px"
    height: "60px"
    width: "112px"
  time-pill-pressed:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
  time-pill-past:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.mid}"
  format-card:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "20px 22px"
  session-group:
    backgroundColor: "{colors.ground}"
    rounded: "{rounded.card}"
    padding: "18px 20px"
  summary-panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "22px"
  club-card:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    rounded: "{rounded.card}"
    padding: "28px"
  state-ok:
    backgroundColor: "{colors.ok-soft}"
    textColor: "{colors.ok-ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.inset}"
    padding: "12px 14px"
  state-info:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.mid}"
    rounded: "{rounded.inset}"
    padding: "12px 14px"
  state-warn:
    backgroundColor: "{colors.warn-soft}"
    textColor: "{colors.warn-ink}"
    rounded: "{rounded.inset}"
    padding: "12px 14px"
  qty-stepper:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "52px"
  tabbar-item:
    backgroundColor: "transparent"
    textColor: "{colors.mid}"
    height: "64px"
  tabbar-item-current:
    textColor: "{colors.accent}"
---

# Design System: Taracine

## Overview

**Creative North Star: "Kiosk Clarity"**

Taracine is the lobby's self-service ticket kiosk brought to the web. Every screen is a course with one job: pick a film, pick a cinema and a time, set a seat count. Targets are sized for a thumb at arm's length (52px primary buttons, 56 to 64px picker cells, 2:3 posters five across), a three-step rail stays visible at the top of every page, and nothing moves until you touch it. The site refuses the dark streaming grid with a red button, the white-label Vista ticketing template, and the deco-facade direction it replaced.

The material is flat and bright: a white ground, light grey panels (#F2F3F5 / #E9EBEF) that alternate with the ground to separate courses, and 1px hairlines (#E3E5E9) for every edge that needs one. There are no gradients, no glows, no drop shadows anywhere in the stylesheet; depth is tonal. One orange (#FF5A1F) is rationed strictly by role: the current step, the current selection, and the primary action. Everything else that is "on" goes to ink (#0F1115) on white or white on ink. Selection is also expressed through weight and size (a selected tile's title steps from 500/1.0625rem to 600/1.125rem), not color alone.

One typeface, Lexend, carries every role from the 3rem display headline to the 0.625rem "Next" tag, in weights 400/500/600/700 with tabular numerals on by default so prices and times align. Posters are the only imagery. State prints itself inline where the action happened (a held-seats message under the stepper, a "Trailers are not part of this design study" note under the trailer button); there are no toasts and no modals.

**Key Characteristics:**
- One task per course; courses alternate white and panel grey, divided by hairlines.
- Oversized pill and cell targets: 52px primary buttons, 44px steps, 56 to 64px picker cells, 2:3 poster tiles.
- A persistent three-step rail (Movie, Cinema & time, Tickets) with current step orange and done steps green.
- Select-then-continue: a tap selects (orange border and soft tint), a fixed bottom bar slides up with the one primary action.
- Flat material: no shadows, no gradients, no glow; tonal panels and 1px hairlines only.
- Lexend everywhere, tabular numerals, tight negative tracking on headings.
- Motion only in response to touch: 180ms state transitions, 220ms bar slide, fully disabled under reduced-motion.

## Colors

A white ground with cool light-grey panels and one hot orange that is allowed to appear only where the visitor's attention must go next.

### Primary
- **Kiosk Orange** (`accent`): the current step pill, the selected tile's 2px border, the selected date and time cells, every primary button, the active mobile tab, the focus ring, the input caret, the wordmark dot, and the check marks inside the dark Club card. Darkens to **Kiosk Orange Pressed** (`accent-hover`) on hover and active only; it never brightens or glows.
- **Orange Tint** (`accent-soft`): the fill of a selected tile or selected cinema card, text selection highlight, and the count badge inside the selected segmented tab. Always paired with ink text or orange border, never with orange text at body size.
- **Burnt Orange Ink** (`accent-ink`): small text that must read as accent on a light ground (the step number inside the lit step, "Few seats left" under a time, counts in the selected tab).
- **Ink on Orange** (`on-accent`) and **Deep Rust** (`on-accent-soft`): text and secondary text sitting on a solid orange fill. Text on orange is always dark, never white.

### Neutral
- **Ground** (`ground`): page background, cards at rest, the selected segmented option, the number disc inside a step at rest.
- **Panel** (`panel`) and **Panel 2** (`panel-2`): alternating course backgrounds, segmented control tracks, hover fills for tiles and pills, past-showtime fills, disabled button fills. Panel 2 is the panel's own hover or nested tone.
- **Hairline** (`hairline`): every 1px border: top bar, course dividers, chips, cells, cards, footer rules, legend keys.
- **Ink** (`ink`): all primary text, headings, the current nav pill, pressed chips and cinema pills, the rating badge, the "Next" tag, the Club card. Hovers to **Ink Hover** (`ink-hover`) on dark buttons.
- **Mid** (`mid`): secondary text, metadata, inactive steps, nav links at rest, inactive mobile tabs, disabled text.
- **Muted on Ink** (`on-ink-muted`): secondary text on ink surfaces (price qualifier in the Club card, city under a pressed cinema pill).
- **Rest Underline** (`underline-rest`): the resting underline color of inline links and the scrollbar thumb; the underline turns ink on hover.

### Status
- **Hold Green** (`ok`), **Green Tint** (`ok-soft`), **Green Ink** (`ok-ink`): done steps in the rail, the G rating badge, and the inline "seats held" state. Green marks completion, never selection.
- **Warn Tint** (`warn-soft`) and **Warn Ink** (`warn-ink`): the inline warning state only.
- **Restricted Red** (`restricted`): the R-16 and R-18 rating badges only. It is a classification color, not an error or accent color.

### Named Rules
**The One Orange Rule.** Orange appears on exactly three kinds of thing: the current step, the current selection, and the primary action. If two primary buttons are visible at once, one of them is wrong. Secondary "on" states (pressed chips, current nav, pressed cinema pill) go to ink, not orange.

**The Dark-On-Orange Rule.** Text on an orange fill is ink or deep rust, never white. White text is reserved for ink and green fills.

**The Green Means Done Rule.** Green marks a completed step, a hold confirmation, or a G rating. It never marks a selectable or selected target.

## Typography

**Display Font:** Lexend (with system-ui, -apple-system, Segoe UI, Roboto, sans-serif)
**Body Font:** Lexend (same family)
**Label/Mono Font:** none; tabular numerals (`font-feature-settings: "tnum" 1`) on the body handle alignment of times and prices.

**Character:** A single humanist sans built for reading ease, used at a few confident weights. Headings are semibold (600) with tight negative tracking (-0.015em) and `text-wrap: balance`; body is regular (400) at 1.5; interactive labels are medium (500) and step to semibold (600) when selected. The wordmark is the only bold (700) in the system, lowercase with -0.02em tracking.

### Hierarchy
- **Display** (600, `clamp(2rem, 1.3rem + 2.4vw, 3rem)`, 1.15, -0.015em): the one page question ("What are we watching tonight?") and the film title on the detail page. Max width 18ch.
- **Headline** (600, 1.75rem, 1.15): course titles ("Now showing", "Cinema & time", "Tickets"). Larger numeric moments reuse the weight at 2rem to 2.5rem (Club price 2.25rem, points line 2rem).
- **Title** (600, 1.125rem to 1.25rem, 1.15): card and group headings (format name, session group, Club points), the selected tile title, the selected date number, the ticket total.
- **Price** (600, 1.375rem, 1.1, -0.01em): the per-seat price on a format card; the "per seat" qualifier is 400 at 0.875rem in mid.
- **Body** (400, 1rem, 1.5): running text. Synopsis is capped at 66ch at 1.6; course intros at 56ch; hero subline 1.0625rem at 1.6.
- **Body Small** (500, 0.9375rem, 1.5): chips, small buttons, picker labels, cinema pill names, tile "Next" lines, format descriptions, footer links.
- **Meta** (400, 0.875rem): tile metadata, cinema addresses, the bottom bar subline, footer headings (600).
- **Label** (600, 0.75rem, 0.02em): rating badges (700), small chips, counts, spec labels, date weekday, time sublines. Case is as written; nothing is set in uppercase.
- **Tag** (600, 0.625rem, 0.04em): the "Next" marker riding a showtime pill; the smallest size in the system and the only one with wider tracking.

### Named Rules
**The Weight Steps With Selection Rule.** Selecting a target raises its label one weight (500 to 600) and, for tiles, one size step (1.0625rem to 1.125rem). Color alone never carries selection.

**The No Caps Rule.** No label, badge, or button is uppercase. Hierarchy comes from weight, size, and tone.

## Layout

The page is a single centered column, `min(1200px, 100% - 48px)` wide, with a 24px gutter that drops to 16px under 820px. A sticky 64px top bar (60px on phones) holds the wordmark, a centered pill nav, and two pills on the right. Beneath it sits the three-step rail (20px above, 8px below), then the display headline, then a sequence of full-width courses. Each course has 32px of vertical padding; adjacent courses are separated by a hairline, except where a course is set on the panel grey, which replaces the line. Course heads are a flex row (title left, segmented control or small ghost button right, 20px below).

Grids are fixed-count and collapse by breakpoint, never by auto-fill:
- Poster tiles: 5 columns at desktop, 4 under 1100px, 2 under 820px; gaps 24px by 20px (20px by 14px on phones). Tiles are 2:3 posters with a 10px gap to their text.
- Format cards: 4 columns, 2 under 1100px; 16px gap.
- Cinema cards: 2 columns, 1 under 820px; 12px gap.
- Film detail: 260px poster column plus fluid info column, 32px gap; single column under 820px with the poster capped at 200px.
- Dates: 7 cells, 4 under 820px; time pills wrap at min 112px, becoming two-up (`calc(50% - 5px)`) on phones.
- Tickets: fluid column plus a 360px summary; stacks under 1100px.
- Footer: 1.4fr 1fr 1fr 1fr, then 2 columns, then 1.

Horizontal rails (cinema pills, the "Also showing" poster rail) scroll with hidden or thin scrollbars and `scroll-snap-type: x proximity`, with 150px to 180px columns.

The spacing rhythm is a 4px grid used in tight steps: 2 and 4 for intra-label gaps, 6 to 10 inside pills and tiles, 12 to 16 between cells and cards, 20 to 24 between groups and grid tracks, 28 inside large cards, 32 for course padding, 40 for empty-state padding.

Fixed chrome: the continue bar sits at the bottom with a 76px minimum height (72px on phones) and pushes the body down by 92px when shown. On phones a 64px five-item tab bar sits under it, so the bar lifts to `bottom: 64px` and body padding grows to 164px. Both use a near-opaque white (96%) over a hairline; only the top bar adds a `blur(10px) saturate(140%)` backdrop.

Breakpoints: 1100px (grid tightening), 820px (phone layout: nav hidden, tab bar shown, step labels collapse to numbers except current and done), 420px (tile titles step down, bottom bar subline hidden, title clamps to 2 lines).

## Elevation & Depth

This system has no shadows, no glows, and no gradients; the stylesheet contains zero `box-shadow` or gradient declarations. Depth is tonal: the white ground, panel grey for a course or a hovered target, panel 2 for a nested or hovered panel, and ink for the few surfaces that must sit above everything (current nav pill, pressed chips, the Club card, the "Next" tag). Edges are 1px hairlines, upgraded to a 2px orange border only on the selected tile. Fixed chrome (top bar, continue bar, tab bar) separates from content with a hairline and a 92 to 96% white fill; the top bar alone uses a backdrop blur so scrolled content ghosts beneath it.

### Named Rules
**The Hairline Or Nothing Rule.** An edge is a 1px hairline (#E3E5E9) or no edge at all. No shadow, no glow, no second border color, with the single exception of the 2px orange selection border on tiles and cinema cards.

**The Nothing Moves At Rest Rule.** Hover shifts a fill one tone (ground to panel, panel to panel 2) or darkens the accent. Press scales a button to 0.98. The continue bar slides in 220ms; everything else transitions in 180ms on `cubic-bezier(0.2, 0.8, 0.2, 1)`. Under `prefers-reduced-motion: reduce` every transition and animation is off and scroll is instant.

## Shapes

Round, soft, and consistent: pills for anything a thumb presses in a row (buttons, nav, chips, steps, the quantity stepper), 16px cells for the picker grid (cinema pills, dates, times, spec boxes), 20px for poster art and cinema cards, 24px for tiles, format cards, session groups, summary panels, and the Club card. Inline state messages and the footer notice sit at 14px; the rating badge and the continue bar's thumbnail at 8px; legend keys at 4px; the focus ring at 6px. Circles are used for the step number disc (32px), the tile's open-in-detail button (36px), the wordmark dot (10px), and footer social links (40px). The 2:3 poster is the only fixed aspect ratio. Borders are 1px hairlines at rest; a selected tile carries a 2px orange border; sold-out showtimes switch to a dashed hairline; past showtimes drop their border and sit on panel grey with a 2px strikethrough.

## Components

### Buttons
Confident pills, big enough to hit from arm's length, in three tones that map directly to importance.
- **Shape:** full pill (999px), 52px tall, 22px horizontal padding, 10px gap to an inline 20px stroke icon. Small variant is 40px tall with 16px padding at 0.9375rem.
- **Primary:** orange fill and border (`accent`), ink text (`on-accent`), 600 weight. One per view: the continue bar's "Pick a time" / "Buy tickets", "Join the Club", the detail page's "Pick a time".
- **Hover / Active / Disabled:** hover darkens to `accent-hover`; active scales to 0.98; disabled goes panel-2 fill with mid text and no transform.
- **Ghost:** white fill, hairline border, ink text; hover panel fill with panel-2 border. Used for "Trailer", "Browse by format", "All movies".
- **Ink:** ink fill, white text; hover `ink-hover`. The "Sign in" style pill variant (`pill--ink`) shares this treatment at 40px.
- **Focus:** 3px orange outline, 2px offset, 6px radius on every focusable element.

### Chips
- **Style:** 36px pill, white fill, hairline border, ink text at 0.9375rem/500; hover panel fill. Small chips (26px, panel fill, no border, mid text at 0.75rem/600) label genres and runtimes on film detail.
- **State:** `aria-pressed="true"` goes ink fill with white text. Chips are ink when on, never orange: they filter, they do not select a step.

### Rating Badge
Ink fill, white 0.75rem/700 label, 8px radius, 26px tall, pinned 10px from the top-left of a poster. G is green; R-16 and R-18 are restricted red; PG and R-13 stay ink.

### Segmented Control
A 4px-padded panel pill holding 40px transparent options in mid text; the selected option lifts to a white fill with ink 600 text, and its count badge turns orange tint with burnt-orange text. On phones it stretches full width with equal options and moves above the course title.

### Step Rail (signature)
Three pills with a 32px number disc, a label, and 24px hairline separators (12px on phones). At rest: panel fill, mid text, white disc. Current (`aria-current="step"`): orange fill, ink text, white disc with burnt-orange number. Done: green tint fill, green text, solid green disc with a white check. On phones, steps that are neither current nor done collapse to the disc alone. The rail is the only place where orange and green appear together.

### Poster Tile (signature)
A 2:3 poster at 20px radius inside an 8px-padded, 24px-radius frame with a transparent 2px border, title (1.0625rem/500), metadata (0.875rem mid), and a "Next 7:50 PM" line with a clock icon. Hover fills the frame with panel grey and reveals a 36px white circular open button at the top right (always visible on phones). Selected (`aria-pressed="true"`) sets a 2px orange border, orange tint fill, and raises the title to 1.125rem/600. First tap selects and raises the continue bar; a second tap on the selected tile opens the film.

### Continue Bar (signature)
Fixed to the viewport bottom, 76px minimum, 96% white over a hairline, sliding in with `translateY` over 220ms when `data-show="true"`. Left: a 40x60px poster thumbnail at 8px radius; middle: title (600) and a mid subline (hidden under 420px, title clamps to two lines); right: the single primary button. On phones it rests above the 64px tab bar. It is the only element that animates onto the screen.

### Picker Cells
All share a white fill, hairline border, 16px radius, and a hover to panel.
- **Cinema pill:** 56px min, left-aligned name (0.9375rem/600) over city (0.75rem mid); pressed goes ink with muted-on-ink city. Scrolls horizontally.
- **Date cell:** 64px min, centered weekday (0.75rem/500 mid) over date (1.125rem/600); pressed goes orange with ink text and deep-rust weekday.
- **Time pill:** 60px min, 112px min width, time (1.0625rem/600) over a format-and-price subline (0.75rem). Pressed goes orange. `past`: panel fill, no border, mid text, 2px strikethrough, disabled. `soldout`: dashed hairline, mid text, disabled. `few`: subline in burnt orange 600. `next`: an ink "Next" tag (0.625rem/600, 0.04em) overhangs the top-right corner by 9px. A legend row (0.8125rem mid, 14px keys at 4px radius) explains past, sold-out, and next.
- **Session group:** a 24px-radius hairline card (18px by 20px padding) per format holding a title, price, and the time pills; a non-focused format dims to 40% opacity when a format chip is pressed.

### Cards / Containers
- **Format card:** white on the panel course, 24px radius, 20px by 22px padding, a 36px stroke icon in a two-row grid beside price (1.375rem/600) and name (1.125rem/600), description below; hover adds a hairline border.
- **Cinema card:** 20px radius, hairline, 16px by 18px padding, name and address with a small ink "Pick" button; selected goes orange border and tint, button stays ink.
- **Summary panel:** panel fill, 24px radius, 22px padding, rows of mid label and ink value, a hairline-topped total at 1.25rem/600.
- **Club card:** the one ink surface, 24px radius, 28px padding, white text, orange check icons, a primary button bottom-left; its sibling points panel is panel grey.
- **Empty state:** panel fill, 24px radius, 40px by 24px padding, centered title and mid text capped at 44ch.
- **Shadow strategy:** none; see Elevation & Depth.

### Inputs / Fields
The only input-like control is the quantity stepper: a 52px hairline pill with two 52px square icon buttons flanking a 40px-wide 1.125rem/600 output. Buttons hover to panel; at their limit they go hairline-colored and `not-allowed`. The caret and native accent color are orange.

### Inline State
A 14px-radius message row with a 20px icon, 0.9375rem/500 text, 12px by 14px padding, printed where the action happened. Ok: green tint with green-ink text and a green check. Info: panel grey with mid text. Warn: warm tint with warn-ink text and an amber icon. There are no toasts, modals, or snackbars.

### Navigation
- **Top bar:** sticky, 64px, 92% white with backdrop blur, hairline below. Wordmark is lowercase 1.25rem/700 with a 10px orange dot. Center nav links are 40px pills in mid; hover panel fill and ink; current page is ink fill with white text. Right side holds a 40px cinema pill (pin icon plus cinema name) and a "Sign in" pill.
- **Mobile tab bar (under 820px):** fixed 64px, five equal columns, 22px icons over 0.6875rem/500 labels in mid, 96% white with hairline top and safe-area padding. The current page's item turns orange with a heavier 2.25 stroke; this is the only place orange marks a navigation state.
- **Inline links:** ink 500 with a rest-grey underline offset 3px that turns ink on hover.

### Icons
A single inline SVG sprite of 24-unit stroke icons at 20px, 1.75 stroke, round caps and joins; 16px inside tile meta and done-step discs (2.5 stroke), 18px in pills, 36px at 1.5 stroke on format cards. The play icon alone is filled. No icon fonts, no emoji, no raster icons.

## Do's and Don'ts

### Do:
- **Do** keep one primary orange button per view, carried by the continue bar when a selection exists.
- **Do** make every pressable target at least 36px tall (chips) and 52px for primary actions, with picker cells at 56 to 64px.
- **Do** raise a selected label one weight step (500 to 600) alongside its color change.
- **Do** separate courses by alternating white and panel grey or a single 1px hairline, never both.
- **Do** print state inline where the action happened, in the ok / info / warn message row.
- **Do** keep every time pill's format and price in its subline, and show past and sold-out times greyed or dashed rather than removed.
- **Do** transition fills and borders over 180ms on `cubic-bezier(0.2, 0.8, 0.2, 1)` and honor `prefers-reduced-motion` by removing all motion.
- **Do** use Lexend for everything, with tabular numerals on, and keep headings at 600 with -0.015em tracking.

### Don't:
- **Don't** add box shadows, gradients, or glows to any surface or state; depth is tonal and edged by hairlines.
- **Don't** put orange on a chip, nav pill, cinema pill, or any secondary "on" state; those go to ink.
- **Don't** set white text on an orange fill; use ink or deep rust.
- **Don't** use green or red for selection or emphasis; green marks done, red marks R-16 and R-18 only.
- **Don't** set labels or buttons in uppercase, or introduce a second typeface or an icon font.
- **Don't** use toasts, modals, or snackbars; hold confirmations, trailer notes, and warnings print inline.
- **Don't** animate anything at rest or on page load; only the continue bar enters, and only in response to a selection.
- **Don't** switch grids to auto-fill; columns are fixed per breakpoint (5/4/2 tiles, 4/2 formats, 2/1 cinemas, 7/4 dates).

## Forms (added after the first record)

The sign-in page (`login.html`) introduces text inputs and checkboxes. They follow the same vocabulary as every other control: hairline borders, 14px radius, 52px height, ink focus border with the orange focus ring, no shadows.

- **Text input** `.input`: 52px tall, `--line` border, 14px radius, 16px side padding, placeholder `#9AA0A8`. Hover border `#C7CBD2`; focus border `--ink`; `.invalid` border `#B3261E` on `#FFF5F4`; `.valid` border `--ok`.
- **Field message** `.msg`: 0.8125rem under the field, reserved height so the layout never jumps. `.msg.error` is `#B3261E` 500; `.msg.valid-message` is `--ok-ink` 500 and reads "Looks good."
- **Checkbox row** `.check`: 44px tall tap target, 20px native checkbox tinted with `accent-color: --accent`, label text 0.9375rem.
- **Form state** reuses `.state` (info, success, warn) printed inline under the button; no toasts, no modals.
- **Seats line** `.seats-line` in the Tickets step prints the seat array ("H9, H10") in ink 600 beside a `--mid` label.
- **Perks list** `.perks`: disc list, 0.875rem `--mid`, used in the format cards and the sign-in aside.

The orange ration is unchanged: the only orange on the sign-in page is the Login button and the checkbox tint when checked.

## Posters and seat map (added)

- **Poster tile** `.tile__art` / `.film__art`: a photograph (`img.photo`, object-fit cover, 2:3) with a title caption `.poster-cap` composited at the bottom: uppercase 700 title, small tracked release line, white on a dark scrim. The scrim is the one place a gradient appears, and it is part of the poster artwork, not UI chrome; the UI itself stays gradient-free.
- **Seat map** `.seatmap`: hairline-bordered 24px card; legend row; a `.screen` bar in `--panel-2`; rows labelled both sides in `--mid` 0.75rem; seats are 28×26px (22×21 on phones), 8px top radius / 6px bottom. States: available `--ink`, unavailable `--panel-2`, mine `--ok` with a white check, being booked by another tab `#FFD9CC` with a 1px `--accent` inset ring, wheelchair space an outlined glyph. A seat just taken flashes `--accent` once (600ms, two steps). A `.live` indicator (green dot, orange while an update lands) prints the latest event in words.

## Cinemas and Experience pages (added)

- **Cinemas page**: the `.cinema` card grows a `.cinema__today` line (hairline above, `--mid` text with ink bolds) and an actions pair (Choose + Showtimes). A `.search` text input and region chips lead the course; the empty state reuses `.empty`.
- **Experience page**: one `.xp__item` per screen format, a two-column hairline card (icon + name + price, blurb, perks | a `--panel` aside with "Where to find it" chips and the week's titles). Stacks to one column under 820px.
- **Real posters**: when a film carries a studio one-sheet, the tile shows it uncaptioned; the photo + `.poster-cap` treatment is only for the fictional films.

## Sign-in prompt, payment and receipts (added)

- **Sign-in prompt** `.authbox`: an `--accent-soft` panel (no border) with a 1.125rem heading, `--accent-ink` body copy and three actions: primary Sign in, ghost Create account, ghost Continue as guest. It appears inline in the Tickets step when a visitor without an account presses Buy tickets; no modal.
- **Payment methods** `.method`: 64px radio rows with a 16px radius hairline border; the checked row turns `--ink` border on `--panel`, and the demo method turns `--accent` border on `--accent-soft`. States print inline under the rows.
- **Receipt** `.receipt`: a 24px card split by a dashed hairline into poster + title, detail rows + a 96px demo entry code (12×12 ink cells with three finder squares), and a `--panel` footer carrying the monospace reference and Cancel. The receipt just paid gets an `--ok` border.
- **Step rail** gains step 4, Payment; steps 1–3 show as done (green) while paying.

## Online ticket document (replaces the receipt card)

`.doc` is a printed e-ticket rendered on white, deliberately a document rather than a UI card: centred brand and "Taracine Online Ticket" title, operator and cinema address, a monospace fiscal block, then one `.doc__ticket` per seat separated by a 2px dashed rule. Each ticket has a label/value grid (movie at 1.5rem 700), a 120px dashed blank QR area, a 160×54 barcode, two full-width black bars (`.doc__bar`: Screen, Seat) with 2.25rem white values, and a tabular amount list with a 2px rule above Amt due. The `--panel` footer holds the reference and Cancel, or the locked reason once the 12-hour window has closed. Print styles hide the chrome and break pages per booking.
