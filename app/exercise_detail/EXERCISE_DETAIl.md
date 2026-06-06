# Exercise Detail Page

**Route:** `/exercise_detail?id={exerciseId}`
**Files:** `app/exercise_detail/page.js`, `app/exercise_detail/ExerciseDetailContent.jsx`


The Exercise Detail page shows the full description, step-by-step instructions, and an exercise GIF for a single exercise, alongside a completion toggle. The route receives the exercise ID via a URL query parameter (`?id=`). The page is split into two files — a thin shell component that handles `Suspense`, and a content component that reads the search params and drives all logic.

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

### Purpose

A minimal shell component. Renders `<Navbar />` and wraps `<ExerciseDetailContent />` in a `<Suspense>` boundary — required because `ExerciseDetailContent` uses `useSearchParams()`, which needs `Suspense` in Next.js to avoid a build-time error.

The fallback renders a simple loading message while the content hydrates.

### Structure

```
<Navbar />
<Suspense fallback={<div><p>Loading...</p></div>}>
  <ExerciseDetailContent />
```

---

## ExerciseDetailContent.jsx

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
| `getExercise`, `getCategory` | `../../utils/exerciseProvider` |
| `getCompletedExercises`, `toggleExerciseCompletion` | `../../utils/exerciseStorage` |
| `ArrowLeftIcon`, `CheckCircleIcon`, `BoltIcon`, `WrenchScrewdriverIcon`, `UserIcon`, `CubeIcon`, `InformationCircleIcon`, `DocumentTextIcon`, `ListBulletIcon` | `@heroicons/react/24/outline` |
| `CheckCircleIcon` (as `CheckCircleSolid`) | `@heroicons/react/24/solid` |

### URL Parameter

| Param | Type | Description |
|---|---|---|
| `id` | string | The ID of the exercise to display |

### State

| Variable | Type | Initial Value | Description |
|---|---|---|---|
| `exercise` | `object \| null` | `null` | The full exercise object |
| `category` | `object \| null` | `null` | The category matching `exercise.categoryId` |
| `isCompleted` | `boolean` | `false` | Whether this exercise has been completed today |
| `dataSource` | `string` | `'loading'` | Source of exercise data (`'local'` or API) |

### Effects

**Effect — Load exercise data**
Runs when `exerciseId` or `router` changes. In order:

1. If `exerciseId` is falsy, redirects to `/exercises`.
2. Calls `getExercise(exerciseId)` — if unsuccessful or no data returned, redirects to `/exercises`.
3. Sets `exercise` and `dataSource` state.
4. Calls `getCategory(exercise.categoryId)` and sets `category`.
5. Reads `getCompletedExercises()` and sets `isCompleted` based on whether `exerciseId` is present.

### Functions

**`handleToggle()`**
Calls `toggleExerciseCompletion(exerciseId)`. On success, updates `isCompleted` from `result.completed`. Logs an error on failure.

### Completion Toggle States

| State | Banner style | Header button style | Action button style |
|---|---|---|---|
| Completed | `bg-green-50 border-green-200 text-green-800` + `CheckCircleSolid` | White bg, `CheckCircleSolid`, green text | `bg-green-600 hover:bg-green-700 text-white` |
| Not completed | `bg-amber-50 border-amber-200 text-amber-800` + `BoltIcon` | Glass white, `CheckCircleIcon` (outline), white text | `bg-teal-500 hover:bg-teal-600 text-white` |

### Page Structure

```
<div>                                  ← min-h-screen bg-gray-50
  <div>                                ← Green gradient header (from-teal-500 to-green-600)
    <div>                              ← max-w-7xl mx-auto px-6 md:px-10 py-8
      <Link> <ArrowLeftIcon />         ← "Back to Exercises"
      <div>                            ← Title row (flex col → sm:row)
        <div>
          <h1>                         ← exercise.name
          <span>                       ← category badge (bg-white/20)
        <button>                       ← Completion toggle
          <CheckCircleSolid /> or <CheckCircleIcon />
          "Completed Today" or "Mark as Complete"
  [if dataSource === 'local']
    <div>                              ← Offline notice (amber)
      <InformationCircleIcon />
      <span>
  <div>                                ← max-w-7xl mx-auto px-6 md:px-10 py-8
    <div>                              ← Status banner (green or amber)
      <CheckCircleSolid /> or <BoltIcon />
      <span>
    <div>                              ← lg:grid-cols-2 two-column layout
      ── LEFT COLUMN ──
      <div>                            ← lg:sticky lg:top-24
        <div>                          ← GIF card (bg-white rounded-2xl)
          <img />                      ← exercise.gifUrl
        <div>                          ← Metadata tiles (sm:grid-cols-3)
          <div> × 3                    ← Target / Equipment / Body Part
            <div>                      ← bg-teal-50 icon badge
              <UserIcon /> or <WrenchScrewdriverIcon /> or <CubeIcon />
            <div>
              <p>                      ← label (uppercase, tracking-wide)
              <p>                      ← value (capitalize)
      ── RIGHT COLUMN ──
      <div>                            ← flex flex-col gap-6
        <div>                          ← Description card (bg-white rounded-2xl)
          <h2> <DocumentTextIcon />
          <p>                          ← exercise.description
        <div>                          ← Instructions card (bg-white rounded-2xl)
          <h2> <ListBulletIcon />
          <div>                        ← bg-gray-50 border-l-4 border-teal-500
            exercise.instructions
        <div>                          ← Action buttons (flex col → sm:row)
          <button>                     ← Complete/Completed toggle
          <Link> <ArrowLeftIcon />     ← "Back to Exercises" (white/outlined)
```

### Two-Column Layout

The body below the header uses a responsive two-column grid that expands to fill the full screen width (`max-w-7xl`):

| Column | Contents |
|---|---|
| Left (`lg:sticky lg:top-24`) | Exercise GIF card + three metadata tiles (Target, Equipment, Body Part) |
| Right | Description card, Instructions card, action buttons |

On screens narrower than `lg` (1024px), the columns stack vertically with the GIF above the text content.

### Tailwind Patterns

| Element | Key Classes |
|---|---|
| Page background | `min-h-screen bg-gray-50` |
| Green header | `bg-gradient-to-r from-teal-500 to-green-600 text-white px-6 md:px-10 py-8` |
| Back link | `text-white/80 hover:text-white group` + `group-hover:-translate-x-0.5` on icon |
| Category badge | `bg-white/20 border border-white/30 text-white text-sm font-medium px-4 py-1 rounded-full` |
| Completion toggle (incomplete) | `bg-white/15 hover:bg-white/25 border-white/30 text-white rounded-xl` |
| Completion toggle (complete) | `bg-white text-green-700 border-white shadow-md rounded-xl` |
| Offline notice | `bg-amber-50 border border-amber-200 text-amber-800 rounded-xl` |
| Status banner | `flex items-center gap-3 px-5 py-3.5 rounded-xl border text-sm font-medium` |
| Two-column grid | `grid grid-cols-1 lg:grid-cols-2 gap-8 items-start` |
| GIF card | `bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden` |
| Metadata tile | `bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-start gap-3` |
| Metadata icon badge | `bg-teal-50 p-2 rounded-lg` |
| Section card (description/instructions) | `bg-white border border-gray-100 rounded-2xl shadow-sm p-6` |
| Instructions block | `bg-gray-50 border-l-4 border-teal-500 rounded-xl px-5 py-4 text-sm leading-relaxed whitespace-pre-line` |
| Primary action button | `bg-teal-500 hover:bg-teal-600 text-white rounded-xl hover:-translate-y-0.5 hover:shadow-md` |
| Secondary action button | `bg-white border border-gray-200 text-gray-600 rounded-xl hover:-translate-y-0.5 hover:shadow-sm` |

### Responsive Behaviour

| Change | Tailwind |
|---|---|
| Header title row — stack on mobile | `flex-col sm:flex-row` |
| Two-column layout — stack on mobile | `grid-cols-1 lg:grid-cols-2` |
| Metadata tiles — 3 cols on sm+ | `grid-cols-1 sm:grid-cols-3` |
| Action buttons — stack on mobile | `flex-col sm:flex-row` |
| GIF sticky positioning — desktop only | `lg:sticky lg:top-24` |