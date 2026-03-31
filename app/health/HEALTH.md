# Health & Nutrition Page

**Route:** `/health`
**Files:** `app/health/page.js`, `app/health/health.css`

The Health & Nutrition page displays categorised nutrition tips and recommended foods for each workout type. Content is driven entirely by `nutritionData.js` — no API calls are made on this page.

---

## page.js

### Directive

```js
'use client';
```

### Dependencies

| Import | Source |
|---|---|
| `useState`, `useEffect` | `react` |
| `Navbar` | `../../components/Navbar` |
| `NUTRITION_DATA`, `getSectionKeys` | `../../utils/nutritionData` |
| `health.css` | `./health.css` |

### State

| Variable | Type | Initial Value | Description |
|---|---|---|---|
| `activeSection` | `string` | `'general'` | The currently displayed nutrition section key |

### Derived Values

| Variable | Source | Description |
|---|---|---|
| `sectionKeys` | `getSectionKeys()` | Array of all section keys used to render the nav buttons and section list |

### Functions

**`showSection(sectionKey)`**
Sets `activeSection` to the given key and, after a 100ms delay, smoothly scrolls to the matching section element using `document.getElementById(sectionKey + '-section')`. The delay ensures the section is rendered (and therefore visible) before the scroll fires.

### Effects

**Effect — Interactivity on section change**
Runs whenever `activeSection` changes. Attaches two sets of imperative DOM event listeners:

- **Tip cards (`.tip-card`)** — `mouseenter` lifts the card with `translateY(-3px) scale(1.02)`; `mouseleave` resets it. Note: CSS already handles a `:hover` transform — this JS layer adds the scale on top.
- **Food items (`.food-item`)** — `click` briefly flashes the background to `#dcfce7` (light green) for 200ms as a tap/click feedback.

> ⚠️ The cleanup `return` statements inside the `forEach` loops only clean up the last listener attached, not all of them. This is a known limitation to be aware of if refactoring.

### Page Structure

```
<Navbar />
<main.main-content>
  <section.health-hero>              ← Hero banner with title and subtitle
  <div.container>
    <section.quick-facts>            ← 4 static nutrition stat cards
      <div.facts-grid>
        <div.fact-item> × 4
    <section.nutrition-nav>          ← Sticky section filter buttons
      <div.nav-buttons>
        <button.nav-btn> × 5        ← One per section key; .active on current
    {sectionKeys.map(...)}
      <section.nutrition-section>   ← Hidden by default; .active = visible
        <div.section-header>         ← Icon, title, description
        <div.content-grid>
          <div.tips-section>         ← Tip cards list
            <div.tip-card> × N
              <div.tip-header>       ← tip.icon + tip.title
              <div.tip-content>      ← tip.content
          <div.foods-section>        ← Recommended foods list
            <ul.food-list>
              <li.food-item> × N
```

### Section Navigation Buttons

Each button maps to a `NUTRITION_DATA` section key. The `.active` class is applied when `activeSection` matches:

| Button Label | Section Key |
|---|---|
| 🏋️ General Fitness | `general` |
| 💪 Upper Body | `upper_body` |
| 🦵 Lower Body | `lower_body` |
| 🔥 Core | `core` |
| ❤️ Cardio | `cardio` |

### Quick Facts (Static)

| Stat | Label |
|---|---|
| 60% | of your body is water |
| 2–3 | liters of water daily |
| 30min | post-workout protein window |
| 5–6 | small meals per day |

---

## health.css

### Layout

The page uses a single-column `container` layout. The nutrition content area switches to a two-column `content-grid` (`1fr 1fr`) for tips and foods side by side on desktop, collapsing to a single column on mobile (≤ 768px).

### Key Styles

**`.health-hero`**
Full-width green gradient banner (`#4ade80 → #22c55e`). Title at `3rem`, subtitle capped at `600px` width.

**`.nutrition-nav`**
Sticky container (`top: 100px`, `z-index: 10`) so the section filter buttons remain accessible while scrolling. White background with a soft box shadow.

**`.nav-btn`**
Pill-shaped buttons (`border-radius: 25px`). Default state is slate grey on light background. Active/hover state switches to green (`#22c55e`) with a green glow shadow and a subtle upward lift.

**`.nutrition-section`**
Hidden by default (`display: none`). The `.active` class sets `display: block` and triggers the `fadeInUp` animation.

**`@keyframes fadeInUp`**
Fades the section in from `opacity: 0` + `translateY(20px)` to fully visible over `0.5s ease`.

**`.content-grid`**
Two-column grid with `3rem` gap. Both `.tips-section` and `.foods-section` share a light background (`#f8fafc`) and a left green border accent (`5px solid #22c55e`).

**`.tip-card`**
White card with a border and `0.3s` transition. CSS `:hover` lifts it with `translateY(-3px)` and adds a shadow (JS effect in `useEffect` adds `scale(1.02)` on top of this).

**`.tip-icon`**
Circular green badge (`40×40px`, `border-radius: 50%`) containing the tip emoji.

**`.food-item`**
Left-bordered list item with a `🥗` pseudo-element prefix. Hover slides it right with `translateX(5px)` and tints the background to `#f0fdf4`. Click briefly flashes `#dcfce7` via JS.

**`.quick-facts`**
Green gradient banner matching the hero. Uses `backdrop-filter: blur(10px)` on each `.fact-item` for a frosted glass effect.

### Responsive Breakpoint — `max-width: 768px`

| Change | Detail |
|---|---|
| Hero `h1` font size | Reduced to `2rem` |
| Nav buttons | Stack vertically, fixed `200px` width |
| Content grid | Collapses to single column |
| Section padding | Reduced to `2rem` |