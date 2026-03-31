# Progress Page

**Route:** `/progress`
**Files:** `app/progress/page.js`, `app/progress/progress.css`

The My Progress page displays the user's fitness statistics derived from their exercise completion history stored in `localStorage`. All data is read on mount via `getAllProgressStats()` from `utils/stats.js` — no API calls are made.

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
| `Link` | `next/link` |
| `Navbar` | `../../components/Navbar` |
| `getAllProgressStats`, `formatDate` | `../../utils/stats` |
| `progress.css` | `./progress.css` |

### State

| Variable | Type | Initial Value | Description |
|---|---|---|---|
| `stats` | `object` | See below | All progress statistics for the current user |

**`stats` default shape:**

```js
{
  currentStreak: 0,
  weeklyCompletions: 0,
  monthlyCompletions: 0,
  totalExercises: 0,
  categoryStats: [],
  recentActivities: []
}
```

### Effects

**Effect 1 — Load stats on mount**
Runs once on mount. Calls `getAllProgressStats()` and sets the result into `stats` state.

**Effect 2 — Animate progress bars**
Runs whenever `stats.categoryStats` changes. After a 500ms delay (to ensure CSS is loaded), it finds all `.progress-fill` elements and resets their `width` to `0%`, then after a further 100ms restores each bar's original inline width. This triggers the CSS `transition: width 0.5s ease` animation on every render, giving a fill-in effect. Returns a cleanup that clears the outer timeout.

### Conditional Rendering

**Motivational message** — Only rendered when `stats.currentStreak > 0`. Displays an encouraging banner above the stats grid.

**Category breakdown** — If `stats.categoryStats` has entries, renders a progress bar row for each. Otherwise shows an empty state with a link to `/exercises`.

**Recent activity** — Only rendered when `stats.recentActivities` has entries.

### Page Structure

```
<Navbar />
<div.progress-container>
  <h1.section-title>               ← "📈 Your Fitness Progress"
  [if currentStreak > 0]
    <div.motivational-message>     ← Conditional streak banner
  <div.stats-grid>
    <div.stat-card.streak-card>    ← currentStreak (amber)
    <div.stat-card>                ← weeklyCompletions
    <div.stat-card.total-card>     ← totalExercises (green)
    <div.stat-card>                ← monthlyCompletions
  <div.category-section>           ← Category breakdown
    <h2.section-title>
    [if categoryStats.length > 0]
      <div.category-item> × N
        <div.category-name>        ← category.name
        <div.category-stats>
          <div.progress-bar>
            <div.progress-fill>    ← width set to category.percentage%
          <span.category-percentage> ← "X%"
          <span.category-count>    ← completion count badge
    [else]
      <div.empty-state>            ← Icon, message, link to /exercises
  [if recentActivities.length > 0]
    <div.category-section>         ← Recent activity list
      <h2.section-title>
      <div.category-item> × N
        <div.category-name>        ← activity.exercise.name
        <small.activity-date>      ← "Category • Formatted date"
  <div.button-group>
    <Link.btn-primary>             ← "Continue Workout" → /exercises
    <Link.btn-primary.btn-secondary> ← "Back to Home" → /
```

### Stats Grid Cards

| Card | Modifier Class | Value | Number Colour |
|---|---|---|---|
| Day Streak | `.streak-card` | `currentStreak` | Amber `#f59e0b` |
| This Week | — | `weeklyCompletions` | Indigo `#4f46e5` |
| Total Completed | `.total-card` | `totalExercises` | Green `#10b981` |
| This Month | — | `monthlyCompletions` | Indigo `#4f46e5` |

> The streak label pluralises automatically: `"Day Streak"` vs `"Days Streak"` based on `currentStreak !== 1`.

---

## progress.css

### Layout

The page uses a centred `progress-container` (`max-width: 1200px`, `padding: 20px`). Stats are arranged in a responsive auto-fit grid. Category and activity sections are stacked full-width cards below.

### Key Styles

**`.stats-grid`**
`repeat(auto-fit, minmax(250px, 1fr))` — four equal columns on wide screens, collapsing naturally as the viewport narrows.

**`.stat-card`**
White card with a `12px` border radius and a soft shadow. Lifts `5px` on hover with an increased shadow.

**`.stat-number`**
`2.5em`, bold. Default colour is indigo (`#4f46e5`). Overridden to amber on `.streak-card` and green on `.total-card`.

**`.motivational-message`**
Full-width green gradient banner (`#07db63 → #0b7227`). Lifts `4px` on hover with a deeper shadow.

**`.category-section`**
White card with `30px` padding and the same shadow pattern as stat cards. Used for both the category breakdown and recent activity sections.

**`.category-item`**
Flexbox row, space-between. Separated by a bottom border; the last item has no border.

**`.progress-bar` / `.progress-fill`**
The bar track is `100px × 8px`, grey (`#e5e7eb`), with overflow hidden. The fill uses a green gradient (`#66ea9e → #045926`) and animates width changes over `0.5s ease` — this is what the JS effect in `useEffect` triggers.

**`.category-count`**
Small green pill badge (`#40d068`) showing the raw completion count.

**`.empty-state`**
Centred layout with a large faded emoji icon, text, and a CTA link. Uses indigo (`#667eea`) for text colour.

**`.btn-primary`**
Teal gradient button (`#1abc9c → #16a085`). Hover lightens the gradient. The `.btn-secondary` modifier overrides the background to grey (`#6b7280`).

### Responsive Breakpoint — `max-width: 768px`

| Change | Detail |
|---|---|
| Stats grid | Collapses to single column (`1fr`) |
| Container padding | Reduced to `15px` |
| Stat number font size | Reduced to `2em` |
| Progress bar width | Reduced to `60px` |
| Category stats gap | Reduced to `10px` |
| Action buttons | Stack vertically, full width up to `300px` |