# Exercises Page

**Route:** `/exercises`
**Files:** `app/exercises/page.js`, `app/exercises/exercise.css`

The Exercises page lists all exercises grouped by category. Users can mark exercises as completed directly from the list via a checkbox. Each card links through to the exercise detail page. All data comes from `exerciseData.js` and completion state is persisted in `localStorage` via `exerciseStorage.js`.

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
| `EXERCISE_CATEGORIES`, `getExercisesByCategory`, `truncateWords` | `../../utils/exerciseData` |
| `getCompletedExercises`, `toggleExerciseCompletion` | `../../utils/exerciseStorage` |
| `exercise.css` | `./exercise.css` |

### State

| Variable | Type | Initial Value | Description |
|---|---|---|---|
| `completedExercises` | `array` | `[]` | Array of exercise IDs completed today, sourced from `localStorage` |

### Effects

**Effect — Load completed exercises on mount**
Runs once on mount. Calls `getCompletedExercises()` and sets the result into `completedExercises` state.

### Functions

**`handleToggle(exerciseId)`**
Calls `toggleExerciseCompletion(exerciseId)`. On success, re-reads `getCompletedExercises()` and updates state to keep the UI in sync with `localStorage`. Logs an error to the console on failure.

### Page Structure

```
<Navbar />
<div.container>
  <div.page-header>               ← "💪 Exercises" heading and subtitle
  {EXERCISE_CATEGORIES.map(...)}
    <div.exercise-category>       ← One block per category
      <div.category-header>       ← Category name and description
      <div.exercises-grid>
        {exercises.map(...)}
          <div.exercise-card>     ← .completed added if exercise is done
            <div.completion-status>  ← "✓ Completed" badge (hidden until completed)
            <input[checkbox]>     ← Toggles completion on change
            <h3.exercise-name>
            <p.exercise-description> ← Truncated to 20 words
            <Link.exercise-link>  ← "View Details →" → /exercise_detail?id={id}
```

### Exercise Card Behaviour

| State | Class | Checkbox | Badge |
|---|---|---|---|
| Not completed | `.exercise-card` | Unchecked | Hidden (`opacity: 0`) |
| Completed | `.exercise-card.completed` | Checked | Visible (`opacity: 1`), green background |

Each card navigates to `/exercise_detail?id={exercise.id}` via the `View Details →` link. The `data-exercise-id` attribute is set on each card for potential DOM-level targeting.

Descriptions are passed through `truncateWords(exercise.description, 20)` to keep cards a consistent height in the grid.

---

## exercise.css

### Reset

Applies a global `* { margin: 0; padding: 0; box-sizing: border-box }` reset. Sets `body` background to `#f5f7fa` with system font stack.

### Layout

`.container` is centred at `max-width: 1200px` with `2rem` padding. Categories stack vertically. Exercise cards use `repeat(auto-fill, minmax(300px, 1fr))` — filling rows with as many 300px-minimum cards as fit.

### Key Styles

**`.exercise-category`**
White card with `15px` border radius, soft shadow, and `overflow: hidden` to clip the green category header flush to the top.

**`.category-header`**
Green gradient banner (`#52c87a → #3eb370`) with white text. Name at `1.5rem`, description slightly faded (`opacity: 0.9`).

**`.exercise-card`**
`2px` border (`#e2e8f0`), `10px` radius, `position: relative` to anchor the absolute-positioned checkbox and completion badge. Hover lifts the card `2px` and switches the border to green with a soft green glow shadow.

**`.exercise-card.completed`**
Border turns green (`#52c87a`), background tints to `#f0fdf4` (very light green).

**`.exercise-checkbox`**
Absolutely positioned top-right (`1rem` from each edge), `24×24px`, `accent-color: #52c87a`.

**`.completion-status`**
Absolutely positioned top-left. Green pill badge showing `"✓ Completed"`. Hidden by default (`opacity: 0`), revealed with `opacity: 1` when `.completed` is present. Transitions over `0.3s`.

**`.exercise-link`**
Green text link (`#52c87a`), no underline by default, underlines on hover.

### Responsive Breakpoint — `max-width: 768px`

| Change | Detail |
|---|---|
| Container padding | Reduced to `1rem` |
| Exercises grid | Collapses to single column (`1fr`) |
| Page header `h1` | Reduced to `2rem` |