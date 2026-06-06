# Progress Page

**Route:** `/progress`
**Files:** `app/progress/page.jsx`


The My Progress page displays the user's fitness statistics derived from their exercise completion history stored in `localStorage`. All data is read on mount via `getAllProgressStats()` from `utils/stats.js` — no API calls are made.

---

## page.jsx

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
| `FireIcon`, `CalendarDaysIcon`, `CheckCircleIcon`, `ChartBarIcon`, `TagIcon`, `ClockIcon`, `ArrowLeftIcon`, `ArrowRightIcon`, `BoltIcon` | `@heroicons/react/24/outline` |

### State

| Variable | Type | Initial Value | Description |
|---|---|---|---|
| `stats` | `object` | See below | All progress statistics for the current user |
| `currentPage` | `number` | `1` | Active page index for the recent activity paginator |

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

### Derived Values

| Variable | Source | Description |
|---|---|---|
| `totalPages` | `Math.ceil(recentActivities.length / itemsPerPage)` | Total paginator pages |
| `currentActivities` | Slice of `recentActivities` | The 5 activities shown on the current page |
| `statCards` | Inline array | Config objects driving the four stat card tiles |

### Effects

**Effect — Load stats on mount**
Runs once on mount. Calls `getAllProgressStats()` and sets the result into `stats` state.


### Pagination Functions

| Function | Behaviour |
|---|---|
| `goToNextPage()` | Increments `currentPage` if not on the last page |
| `goToPreviousPage()` | Decrements `currentPage` if not on the first page |
| `goToPage(n)` | Sets `currentPage` to `n` directly |

### Conditional Rendering

**Motivational banner** — Only rendered when `stats.currentStreak > 0`. Displays a teal-to-green gradient banner with a `BoltIcon` above the stats grid.

**Category breakdown** — If `stats.categoryStats` has entries, renders a progress bar row for each. Otherwise shows an empty state with a `CheckCircleIcon` and a link to `/exercises`.

**Recent activity** — Only rendered when `stats.recentActivities` has entries. Includes paginator controls when `totalPages > 1`.

### Page Structure

```
<Navbar />
<div>                                  ← max-w-5xl mx-auto px-5 py-8
  <h1>                                 ← "Your Fitness Progress"
  [if currentStreak > 0]
    <div>                              ← Teal-green gradient motivational banner
      <BoltIcon />
      <p> + <p>
  <div>                                ← 2×2 / 4-col stat card grid
    <StatCard> × 4                     ← See stat card table below
  <div>                                ← Exercise Categories card
    <h2> <TagIcon /> "Exercise Categories"
    [if categoryStats.length > 0]
      <div> × N                        ← Category rows
        <span>                         ← category.name
        <div>                          ← Progress bar (teal gradient)
        <span>                         ← percentage%
        <span>                         ← count badge (bg-teal-500)
    [else]
      <div>                            ← Empty state
        <CheckCircleIcon />
        <h3> + <p> + <Link>
  [if recentActivities.length > 0]
    <div>                              ← Recent Activity card
      <h2> <ClockIcon /> "Recent Activity"
      <div> × N                        ← Activity rows
        <p>                            ← activity.exercise.name
        <p>                            ← category • formatted date
        <CheckCircleIcon />
      [if totalPages > 1]
        <div>                          ← Pagination controls
          <button> <ArrowLeftIcon />   ← Previous
          <button> × N                 ← Page number buttons
          <button> <ArrowRightIcon />  ← Next
        <p>                            ← "Showing X–Y of Z activities"
  <div>                                ← Action buttons row
    <Link>                             ← "Continue Workout" → /exercises (teal)
    <Link>                             ← "Back to Home" → / (white/outlined)
```

### Stat Cards

Each card is driven by an entry in the `statCards` config array and shares the same Tailwind card shell (`bg-white border rounded-2xl p-5 shadow-sm`). The icon, number colour, and background tint vary per card:

| Card | Icon | Value | Number Colour |
|---|---|---|---|
| Day Streak | `FireIcon` | `currentStreak` | `text-amber-500` |
| This Week | `CalendarDaysIcon` | `weeklyCompletions` | `text-teal-600` |
| Total Completed | `CheckCircleIcon` | `totalExercises` | `text-green-600` |
| This Month | `ChartBarIcon` | `monthlyCompletions` | `text-teal-600` |

> The streak label pluralises automatically: `"Day Streak"` vs `"Days Streak"` based on `currentStreak !== 1`.

### Tailwind Patterns

| Element | Key Classes |
|---|---|
| Page wrapper | `max-w-5xl mx-auto px-5 py-8` |
| Motivational banner | `bg-gradient-to-r from-teal-500 to-green-600 text-white px-6 py-5 rounded-2xl` |
| Stat card | `bg-white border border-{color}-100 rounded-2xl p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300` |
| Section card | `bg-white border border-gray-100 rounded-2xl shadow-sm p-7` |
| Progress bar track | `w-28 h-1.5 bg-gray-100 rounded-full overflow-hidden` |
| Progress bar fill | `h-full bg-gradient-to-r from-teal-400 to-green-500 transition-all duration-500 ease-out` |
| Count badge | `bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full` |
| Active page button | `bg-teal-500 text-white shadow-sm` |
| Inactive page button | `bg-gray-50 text-gray-600 hover:bg-gray-100` |
| Primary CTA | `bg-teal-500 hover:bg-teal-600 text-white rounded-xl` |
| Secondary CTA | `bg-white border border-gray-200 text-gray-600 rounded-xl` |

### Responsive Behaviour

All responsiveness is handled via Tailwind breakpoint prefixes — no media query block in a separate stylesheet.

| Change | Tailwind |
|---|---|
| Stat grid — 2 cols mobile, 4 cols desktop | `grid-cols-2 lg:grid-cols-4` |
| Progress bar — hidden on mobile | `hidden sm:block` |
| Action buttons — stack on mobile | `flex-col sm:flex-row` |