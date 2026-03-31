# Utils

The `utils/` directory contains all the data and logic that powers the Vitality app. It is split into five files, each with a clear single responsibility — from static exercise and nutrition data, to localStorage management, to quote delivery and progress analytics.

---

## Files Overview

| File | Purpose |
|---|---|
| `exerciseData.js` | Static exercise and category data + lookup helpers |
| `exerciseStorage.js` | localStorage read/write for exercise completions and streaks |
| `nutritionData.js` | Static nutrition tips and food data per workout category |
| `quoteService.js` | Daily motivational quote logic with localStorage caching |
| `stats.js` (progressStats.js) | Progress analytics derived from exercise history |

---

## `exerciseData.js`

Holds all static exercise content used throughout the app. It exports two data arrays and four helper functions.

### Data

**`EXERCISE_CATEGORIES`** — An array of 4 category objects, each with an `id`, `name`, and `description`:

| ID | Name | Description |
|---|---|---|
| 1 | Upper Body | Arms, chest, shoulders, and back |
| 2 | Lower Body | Legs, glutes, and hips |
| 3 | Core | Core strength and stability |
| 4 | Cardio | Endurance and cardiovascular fitness |

**`EXERCISES`** — An array of 20 exercise objects. Each exercise has:

| Field | Type | Description |
|---|---|---|
| `id` | number | Unique identifier |
| `name` | string | Exercise name |
| `categoryId` | number | Links to an `EXERCISE_CATEGORIES` entry |
| `description` | string | Short summary of the exercise |
| `instructions` | string | Step-by-step instructions including sets and reps |

### Functions

**`getExercisesByCategory(categoryId)`**
Returns all exercises belonging to the given category ID.

**`getExerciseById(exerciseId)`**
Returns a single exercise object by its ID. Parses the ID as an integer so string inputs are handled safely.

**`getCategoryById(categoryId)`**
Returns a single category object by its ID.

**`truncateWords(text, maxWords = 20)`**
Truncates a string to a maximum number of words and appends `...` if the text exceeds the limit. Defaults to 20 words. Used to keep exercise descriptions concise in list views.

---

## `exerciseStorage.js`

Manages all reading and writing of exercise completion data in `localStorage`. Depends on `getTodayDateString` from `quoteService.js`. All functions guard against server-side rendering by checking `typeof window === 'undefined'` before accessing `localStorage`.

### Storage Keys

| Key | Value |
|---|---|
| `exerciseCompletions` | JSON array of completion objects `{ exerciseId, date, timestamp }` |
| `exerciseStats` | JSON object `{ completions, streak }` for the current day |

### Functions

**`getCompletedExercises()`**
Returns an array of exercise IDs completed today. Filters the full completions array to only today's date.

**`toggleExerciseCompletion(exerciseId)`**
Adds or removes a completion entry for the given exercise on today's date. Returns `{ completed: boolean, success: boolean }`. Automatically calls `updateExerciseStats()` after each toggle.

**`updateExerciseStats()`**
Recalculates and saves today's completion count and current streak to `localStorage`. Returns the updated stats object.

**`calculateStreak(completions)`** *(private)*
Internal helper that counts consecutive days of exercise backwards from today using a sorted list of unique date strings.

**`getExerciseHistory()`**
Returns the full raw completions array from `localStorage`, or an empty array if none exists.

**`cleanupOldCompletions()`**
Removes any completion entries older than 90 days. Should be called periodically to keep `localStorage` lean.

---

## `nutritionData.js`

Contains all static nutrition content for the Health & Nutrition page, organised by workout category. Exports one data object and four utility functions.

### Data

**`NUTRITION_DATA`** — A keyed object with five sections:

| Key | Title | Focus |
|---|---|---|
| `general` | General Fitness Nutrition | Overall health and balanced eating |
| `upper_body` | Upper Body Nutrition | Muscle building and recovery |
| `lower_body` | Lower Body Nutrition | Energy, bones, and endurance |
| `core` | Core Nutrition | Fat reduction and digestion |
| `cardio` | Cardio Nutrition | Endurance and electrolyte balance |

Each section contains:

| Field | Type | Description |
|---|---|---|
| `title` | string | Display name |
| `icon` | string | Emoji icon |
| `description` | string | Short summary |
| `tips` | array | List of `{ title, content, icon }` tip objects |
| `foods` | array | List of recommended food strings |

### Functions

**`getNutritionSection(sectionKey)`**
Returns a single nutrition section by key (e.g. `'cardio'`), or `null` if the key doesn't exist.

**`getAllFoods()`**
Returns a deduplicated, alphabetically sorted array of all food items across every section. Uses a `Set` internally to eliminate duplicates.

**`getTipsByCategory(category = null)`**
Returns all tips across all sections, each enriched with `category` (the section key) and `categoryTitle`. If a `category` key is provided, returns only tips from that section.

**`getSectionKeys()`**
Returns an array of all section keys: `['general', 'upper_body', 'lower_body', 'core', 'cardio']`.

---

## `quoteService.js`

Handles the daily motivational quote shown on the Dashboard. Quotes are served from a hardcoded local list and cached in `localStorage` so the same quote persists for the full day.

### Data

**`FALLBACK_QUOTES`** — An array of 10 motivational quote objects, each with `text` and `author` fields.

### Storage Key

| Key | Value |
|---|---|
| `dailyQuote` | JSON object `{ quote: { text, author }, date: 'YYYY-MM-DD' }` |

### Functions

**`getTodayDateString()`**
Returns today's date as a `YYYY-MM-DD` string. Shared across multiple utils files for consistent date comparison.

**`getRandomFallbackQuote()`**
Picks and returns a random quote from `FALLBACK_QUOTES`.

**`saveQuoteToLocalStorage(quote, date)`**
Persists a quote and its date to `localStorage`. No-ops in non-browser environments.

**`getQuoteFromLocalStorage()`**
Retrieves and parses the stored quote object, or returns `null` if none exists or parsing fails.

**`shouldFetchNewQuote()`**
Returns `true` if no quote is stored or if the stored quote's date doesn't match today. Drives the cache invalidation logic.

**`getDailyQuote()`** *(async)*
Main function used by UI components. Returns the cached quote for today if valid, otherwise picks a new random quote, saves it, and returns it.

**`fetchQuoteFromAPIs()`** *(async)*
Returns a random hardcoded quote. Originally intended for external API calls; now serves as a manual refresh helper that bypasses the daily cache.

---

## `stats.js` (progressStats.js)

Derives all progress statistics displayed on the My Progress page. Depends on `quoteService.js` (for `getTodayDateString`), `exerciseStorage.js` (for `getExerciseHistory`), and `exerciseData.js` (for `getExerciseById`).

### Helper

**`getDateDaysAgo(daysAgo)`** *(private)*
Returns a `YYYY-MM-DD` string for a date `N` days before today. Used to define rolling time windows for weekly and monthly stats.

### Functions

**`calculateStreak()`**
Calculates the current consecutive-day exercise streak by walking backwards from today through the exercise history. Caps at 365 days.

**`getWeeklyCompletions()`**
Returns the total number of exercises completed in the last 7 days.

**`getMonthlyCompletions()`**
Returns the total number of exercises completed in the last 30 days.

**`getTotalCompletions()`**
Returns the all-time total number of exercise completions.

**`getCategoryBreakdown(daysBack = 30)`**
Returns an array of category stats for the given time window. Each entry contains:

| Field | Description |
|---|---|
| `name` | Category name (e.g. `'Upper Body'`) |
| `count` | Number of completions in that category |
| `percentage` | Share of total completions, rounded to the nearest whole number |

Results are sorted by count, highest first.

**`getRecentActivity(limit = 10)`**
Returns the most recent `N` exercise completions with enriched data — exercise name, category name, date, and timestamp. Null entries (from deleted exercises) are filtered out.

**`formatDate(dateString)`**
Formats a date string for display. Returns `'Today'` or `'Yesterday'` for recent dates, or a short locale string (e.g. `'Jun 5'`) for older ones. Includes the year if the date is from a previous calendar year.

**`getAllProgressStats()`**
Convenience function that calls all the above and returns a single object:

```js
{
  currentStreak,
  weeklyCompletions,
  monthlyCompletions,
  totalExercises,
  categoryStats,
  recentActivities
}
```