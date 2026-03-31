# Vitality — Project Overview

Vitality is a Next.js fitness tracking web app that helps users browse exercises, log daily completions, track progress over time, and read category-specific nutrition guidance. All user data is stored locally in the browser via `localStorage` — there is no backend or database.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Rendering | Client-side (`'use client'` throughout) |
| Styling | Custom CSS per route (no utility framework) |
| State | React `useState` / `useEffect` |
| Persistence | Browser `localStorage` |
| Deployment | Vercel |

---

## Project Structure

```
vitality/
├── app/
│   ├── page.js                    # Dashboard (home)
│   ├── home.css
│   ├── layout.js                  # Root layout
│   ├── globals.css
│   ├── exercises/
│   │   ├── page.js                # Exercise list
│   │   └── exercise.css
│   ├── exercise_detail/
│   │   ├── page.js                # Detail shell (Suspense wrapper)
│   │   ├── ExerciseDetailContent.js
│   │   └── exercise_detail.css
│   ├── progress/
│   │   ├── page.js                # Progress & stats
│   │   └── progress.css
│   └── health/
│       ├── page.js                # Health & Nutrition
│       └── health.css
├── components/
│   ├── Navbar.js
│   └── QuoteCard.js
└── utils/
    ├── exerciseData.js
    ├── exerciseStorage.js
    ├── nutritionData.js
    ├── quoteService.js
    └── stats.js
```

---

## Utils

The `utils/` directory holds all data and business logic. No utility file makes external API calls — all data is either hardcoded or read from `localStorage`.

### `exerciseData.js`
The single source of truth for all exercise content. Exports a static list of **4 categories** and **20 exercises** (5 per category: Upper Body, Lower Body, Core, Cardio). Provides lookup helpers — `getExercisesByCategory`, `getExerciseById`, `getCategoryById` — used by both the exercise list and detail pages. Also exports `truncateWords` for keeping card descriptions a consistent length.

### `exerciseStorage.js`
Manages reading and writing exercise completion data to `localStorage`. The key functions are `toggleExerciseCompletion` (marks an exercise done or undone for today) and `getCompletedExercises` (returns today's completed exercise IDs). Also calculates and saves a running streak and daily completion count to a separate `exerciseStats` key whenever a completion is toggled.

### `quoteService.js`
Serves a daily motivational quote from a hardcoded list of 10. Quotes are cached in `localStorage` with today's date so the same quote persists all day. Provides `getDailyQuote` for the initial load and `fetchQuoteFromAPIs` for manual refresh. Also exports `getTodayDateString`, which is shared across other utils for consistent date formatting.

### `stats.js`
Derives all the statistics shown on the Progress page by reading from `exerciseStorage`. Calculates current streak, weekly and monthly completion counts, total all-time completions, a per-category breakdown with percentages, and a recent activity list with exercise names and dates. All stats are available in one call via `getAllProgressStats`.

### `nutritionData.js`
Contains all static nutrition content — tips and recommended foods — for five sections matching the exercise categories (General, Upper Body, Lower Body, Core, Cardio). Provides helper functions to retrieve a single section, all foods deduplicated, or tips filtered by category.

---

## Components

### `Navbar`
A static navigation bar rendered on every page via `layout.js`. Contains the **Vitality** brand link and four navigation links: Dashboard (`/`), Exercises (`/exercises`), My Progress (`/progress`), and Health & Nutrition (`/health`). Styled with a green gradient background and a sticky position.

### `QuoteCard`
Displayed on the Dashboard. Shows the daily motivational quote with the author, sourced from `quoteService.js`. Automatically refreshes at midnight (via a `setTimeout` to the next midnight, with a 60-second interval as a fallback). Includes a **🔄 New Quote** button for manual refresh, which picks a new random quote and saves it to `localStorage`.

---

## Routes

### `/` — Dashboard
The home screen. Greets the user and provides an at-a-glance overview of the app. Displays the `QuoteCard` component and four navigation cards: **Exercises**, **My Progress**, **Health & Nutrition**, and a **Today's Summary** card showing exercises completed today and the current streak. Stats are read directly from the `exerciseStats` `localStorage` key on mount.

### `/exercises` — Exercise List
Lists all 20 exercises grouped under their 4 category headers. Each exercise card shows the name, a truncated description, and a checkbox to mark it complete. Completion state is loaded from `localStorage` on mount and updated in real time as the user ticks exercises off. Each card links through to the detail page via `/exercise_detail?id={id}`.

### `/exercise_detail` — Exercise Detail
Reached from the exercise list via a `?id=` query parameter. Displays the full exercise name, category badge, complete description, and step-by-step instructions. Includes a completion toggle in the header that syncs with `localStorage`. If the `id` param is missing or invalid, the user is redirected back to `/exercises`. The page uses a `Suspense` boundary around the content component due to Next.js requirements for `useSearchParams`.

### `/progress` — My Progress
Shows the user's fitness statistics derived from their full exercise history. Displays four summary stats (current streak, this week, this month, all-time total), a category breakdown with animated progress bars showing the percentage split between Upper Body, Lower Body, Core, and Cardio, and a recent activity log. If no exercises have been completed, an empty state is shown with a link to start a workout. A motivational banner appears at the top when the user has an active streak.

### `/health` — Health & Nutrition
Presents nutrition guidance organised into five sections matching the exercise categories. A sticky navigation bar at the top lets users switch between sections; the active section fades in with a smooth animation. Each section contains a list of nutrition tips (with icons and explanations) and a list of recommended foods. Four static quick-fact stats are shown at the top of the page.

---

## Data Flow

```
exerciseData.js         ──► Exercises page (list + cards)
        │                         │
        └──► ExerciseDetailContent (full view)
                                  │
exerciseStorage.js  ◄─── toggle ──┘
        │
        ├──► getCompletedExercises  ──► Exercises page (checkbox state)
        ├──► updateExerciseStats    ──► localStorage (exerciseStats key)
        └──► getExerciseHistory     ──► stats.js
                                              │
                                              └──► Progress page (all stats)

quoteService.js  ──► QuoteCard  ──► Dashboard

nutritionData.js  ──► Health page (tips + foods)
```

---

## localStorage Keys

| Key | Written by | Read by | Contents |
|---|---|---|---|
| `exerciseCompletions` | `exerciseStorage.js` | `exerciseStorage.js`, `stats.js` | Array of `{ exerciseId, date, timestamp }` |
| `exerciseStats` | `exerciseStorage.js` | `app/page.js` (Dashboard) | `{ completions, streak }` for today |
| `dailyQuote` | `quoteService.js` | `quoteService.js` | `{ quote: { text, author }, date }` |
| `username` | Not set in-app* | `app/page.js` (Dashboard) | String username displayed in welcome message |

> \* The `username` key is read on the Dashboard but there is no UI in the current app to set it. It defaults to `"Guest"` if not present.