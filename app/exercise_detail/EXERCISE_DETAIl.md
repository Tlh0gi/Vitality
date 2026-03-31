# Exercise Detail Page

**Route:** `/exercise_detail?id={exerciseId}`
**Files:** `app/exercise_detail/page.js`, `app/exercise_detail/ExerciseDetailContent.js`, `app/exercise_detail/exercise_detail.css`

The Exercise Detail page shows the full description and step-by-step instructions for a single exercise, along with a completion toggle. The route receives the exercise ID via a URL query parameter (`?id=`). The page is split into two files — a thin shell component that handles `Suspense`, and a content component that reads the search params and drives all the logic.

---

## page.js

### Directive

```js
'use client';
```

### Dependencies

| Import | Source |
|---|---|
| `Suspense` | `react` |
| `Navbar` | `../../components/Navbar` |
| `ExerciseDetailContent` | `./ExerciseDetailContent` |
| `exercise_detail.css` | `./exercise_detail.css` |

### Purpose

A minimal shell component. It renders `<Navbar />` and wraps `<ExerciseDetailContent />` in a `<Suspense>` boundary. This is required because `ExerciseDetailContent` uses `useSearchParams()`, which needs `Suspense` in Next.js to avoid a build-time error.

The fallback renders a simple `"Loading..."` paragraph inside `.detail-container` while the content hydrates.

### Structure

```
<Navbar />
<Suspense fallback={<div.detail-container><p>Loading...</p></div>}>
  <ExerciseDetailContent />
```

---

## ExerciseDetailContent.js

### Directive

```js
'use client';
```

### Dependencies

| Import | Source |
|---|---|
| `useState`, `useEffect` | `react` |
| `useSearchParams`, `useRouter` | `next/navigation` |
| `Link` | `next/link` |
| `getExerciseById`, `getCategoryById` | `../../utils/exerciseData` |
| `getCompletedExercises`, `toggleExerciseCompletion` | `../../utils/exerciseStorage` |

### URL Parameter

| Param | Type | Description |
|---|---|---|
| `id` | string → parsed as `int` | The ID of the exercise to display |

### State

| Variable | Type | Initial Value | Description |
|---|---|---|---|
| `exercise` | `object \| null` | `null` | The full exercise object from `exerciseData.js` |
| `category` | `object \| null` | `null` | The category object matching `exercise.categoryId` |
| `isCompleted` | `boolean` | `false` | Whether the exercise has been completed today |

### Effects

**Effect — Load exercise data on mount**
Runs when `exerciseId` or `router` changes. Performs the following in order:

1. If `exerciseId` is falsy (no `?id=` param), redirects to `/exercises`.
2. Calls `getExerciseById(exerciseId)` — if no match found, redirects to `/exercises`.
3. Sets `exercise` state with the found data.
4. Calls `getCategoryById(exercise.categoryId)` and sets `category` state.
5. Reads `getCompletedExercises()` and sets `isCompleted` based on whether `exerciseId` is in the returned array.

### Functions

**`handleToggle()`**
Calls `toggleExerciseCompletion(exerciseId)`. On success, updates `isCompleted` directly from `result.completed`. Logs an error on failure.

> Unlike the exercises list page, this component updates `isCompleted` from the toggle result directly rather than re-reading `localStorage`, since it only needs to track a single exercise.

### Loading State

While `exercise` is `null` (before the effect runs), the component returns a minimal `<div.detail-container><p>Loading...</p></div>`.

### Page Structure

```
<div.detail-container>
  <Link.back-link>                   ← "← Back to Exercises" → /exercises
  <div.exercise-detail-card>
    <div.exercise-header>            ← Green gradient header
      <h1>                           ← exercise.name
      <span.category-badge>          ← category.name (if category exists)
      <div.completion-toggle>        ← Checkbox + label, absolute top-right
        <input[checkbox]>
        <span>                       ← "Completed Today" or "Mark as Complete"
    <div.exercise-content>
      <div.completion-status-banner> ← Green if done, amber if not
        <span>                       ← "✓" or "💪"
        <span>                       ← Status message
      <div.section>
        <h2> 📋 Description
        <p>                          ← exercise.description (full, not truncated)
      <div.section>
        <h2> 📝 Instructions
        <div.instructions-box>       ← exercise.instructions
```

### Completion Toggle States

| State | Banner Style | Checkbox | Label |
|---|---|---|---|
| Completed | Green bg + border (`.completion-status-banner`) | Checked | `"Completed Today"` |
| Not completed | Amber bg + border (`.not-completed`) | Unchecked | `"Mark as Complete"` |

The `.completion-toggle` div has an `onClick={handleToggle}` handler. The inner `<input>` also calls `handleToggle` via `onChange`, and uses `e.stopPropagation()` on its own `onClick` to prevent the toggle firing twice from a single checkbox click.

---

## exercise_detail.css

### Reset

Same global reset as `exercise.css` — `margin: 0`, `padding: 0`, `box-sizing: border-box`, `background: #f5f7fa`.

### Layout

`.detail-container` is centred at `max-width: 900px` (narrower than the exercises list) with `2rem` padding. Content is a single vertically stacked card.

### Key Styles

**`.back-link`**
Inline-flex green link (`#52c87a`). On hover the `gap` between arrow and text grows from `0.5rem` to `0.75rem`, giving a subtle sliding arrow effect.

**`.exercise-detail-card`**
White card, `15px` border radius, `overflow: hidden` to clip the header gradient flush.

**`.exercise-header`**
Green gradient (`#52c87a → #3eb370`), `position: relative` to anchor the `.completion-toggle` absolutely. Title at `2.5rem`.

**`.category-badge`**
Frosted pill — `rgba(255,255,255,0.2)` background, `20px` border radius, white text.

**`.completion-toggle`**
Absolutely positioned top-right of the header (`2rem` from each edge). Semi-transparent white pill that brightens on hover. Contains the checkbox and label text side by side.

**`.instructions-box`**
Light grey background (`#f7fafc`) with a `4px` left border in green (`#52c87a`). Provides clear visual separation from the description section.

**`.completion-status-banner`**
Full-width banner inside `.exercise-content`. Two variants:
- **Default (completed):** `#f0fdf4` background, green border, dark green text.
- **`.not-completed`:** `#fef3c7` background, amber border (`#f59e0b`), dark amber text.

### Responsive Breakpoint — `max-width: 768px`

| Change | Detail |
|---|---|
| Container padding | Reduced to `1rem` |
| Header padding | Reduced to `1.5rem` |
| Header `h1` font size | Reduced to `2rem` |
| `.completion-toggle` | Removed absolute positioning (`position: static`), `margin-top: 1rem`, `width: fit-content` — flows below the title |
| Content padding | Reduced to `1.5rem` |
| Section `h2` font size | Reduced to `1.3rem` |