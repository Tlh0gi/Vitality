# Utils

The `utils/` directory contains all the data and logic that powers the Vitality app. With the ExerciseDB API integration, it now includes eight files with clear responsibilities — from API integration and data adaptation, to static fallback data, localStorage management, quote delivery, and progress analytics.

---

## Files Overview

| File | Purpose |
|---|---|
| `exerciseDbApi.js` | **NEW** - ExerciseDB API integration via RapidAPI |
| `exerciseAdapter.js` | **NEW** - Converts API format to Vitality app format |
| `exerciseProvider.js` | **NEW** - Smart provider with API-first, fallback logic |
| `exerciseData.js` | Static exercise and category data (fallback) |
| `exerciseStorage.js` | localStorage read/write for exercise completions and streaks |
| `nutritionData.js` | Static nutrition tips and food data per workout category |
| `quoteService.js` | Daily motivational quote logic with localStorage caching |
| `stats.js` | Progress analytics derived from exercise history |

---

## 🆕 ExerciseDB API Integration

### `exerciseDbApi.js`

Handles all API calls to ExerciseDB via RapidAPI. **No caching** - fresh requests per API terms.

#### Configuration

```javascript
const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'exercisedb.p.rapidapi.com';
```

**API Plan:** BASIC (180p resolution GIFs)

#### Core Functions

**`fetchFromAPI(endpoint)`** *(private)*
Generic fetch wrapper that handles all API communication, error codes, and quota tracking.

**`isAPIAvailable()`**
Returns `true` if API key exists and quota hasn't been exceeded.

**`resetAPIAvailability()`**
Resets the quota flag for retry logic.

#### Exercise Endpoints

**`getAllExercises(limit, offset)`**
Gets all exercises with pagination. Default: all exercises (limit=0).

**`getExerciseById(exerciseId)`**
Retrieves a single exercise by its ID.

**`getExercisesByBodyPart(bodyPart)`**
Filters exercises by body part (e.g., 'back', 'chest', 'waist', 'cardio').

**`getExercisesByTarget(target)`**
Filters by target muscle (e.g., 'biceps', 'abs', 'glutes').

**`getExercisesByEquipment(equipment)`**
Filters by equipment type (e.g., 'dumbbell', 'barbell', 'body weight').

**`searchExercisesByName(name)`**
Searches exercises by name string.

#### List Endpoints

**`getBodyPartList()`**
Returns array of all available body parts.

**`getTargetList()`**
Returns array of all target muscles.

**`getEquipmentList()`**
Returns array of all equipment types.

#### Helper Functions

**`getExerciseGifUrl(exerciseId)`**
Constructs the image URL with 180p resolution (BASIC plan).

```javascript
// Returns:
`https://exercisedb.p.rapidapi.com/image?exerciseId=${id}&resolution=180&rapidapi-key=${key}`
```

**`getFeaturedExercisesByCategories(bodyParts)`**
Batch fetches exercises from multiple categories. Returns 4 per category.

**`universalSearch(query)`**
Searches across all exercise attributes (name, target, body part, equipment).

**`getRecommendedExercises(bodyPart)`**
Returns curated exercises filtered for beginner-friendly equipment.

#### Error Handling

| Status Code | Meaning | Action |
|-------------|---------|--------|
| 200 | Success | Return data |
| 429 | Quota exceeded | Disable API, use fallback |
| 401 | Invalid API key | Return error |
| 500 | Server error | Retry or fallback |

---

### `exerciseAdapter.js`

Converts ExerciseDB API format to Vitality app format. Ensures compatibility with existing completion tracking.

#### Body Part Mapping

```javascript
const BODY_PART_TO_CATEGORY = {
  'back': 1,           // Upper Body
  'chest': 1,          // Upper Body
  'shoulders': 1,      // Upper Body
  'upper arms': 1,     // Upper Body
  'lower arms': 2,     // Lower Body
  'lower legs': 2,     // Lower Body
  'waist': 3,          // Core
  'cardio': 4,         // Cardio
  'neck': 1            // Upper Body
};
```

#### Core Functions

**`adaptExercise(apiExercise)`**
Converts single API exercise object to Vitality format.

**API Format:**
```javascript
{
  id: "0001",
  name: "3/4 sit-up",
  bodyPart: "waist",
  target: "abs",
  equipment: "body weight",
  gifUrl: "https://..."
}
```

**Vitality Format:**
```javascript
{
  id: "0001",
  name: "3/4 Sit-up",           // Capitalized
  categoryId: 3,                // Mapped from bodyPart
  description: "Targets abs...", // Generated
  instructions: "...",           // Generated
  bodyPart: "waist",
  target: "abs",
  equipment: "body weight",
  gifUrl: "/api/exercise?url=...", // Proxied
  source: "api"
}
```

**`adaptExercises(apiExercises)`**
Converts array of API exercises.

**`capitalizeExerciseName(name)`** *(private)*
Capitalizes exercise names properly: "push-up" → "Push-up"

**`generateInstructions(exercise)`** *(private)*
Creates basic instructions from exercise metadata.

#### Utility Functions

**`getCategoryBodyParts(categoryId)`**
Returns ExerciseDB body parts for a Vitality category.

**`getCategoryName(categoryId)`**
Returns category name (Upper Body, Lower Body, Core, Cardio).

**`groupByCategory(exercises)`**
Groups exercises by Vitality category ID.

**`filterExercises(exercises, query)`**
Filters exercises by search query.

**`sortExercisesByName(exercises, ascending)`**
Sorts exercises alphabetically.

**`getUniqueEquipment(exercises)`**
Extracts unique equipment types.

**`getUniqueTargets(exercises)`**
Extracts unique target muscles.

**`adaptLocalExercise(localExercise)`**
Converts local fallback exercises to API-compatible format.

---

### `exerciseProvider.js`

Smart exercise provider with API-first strategy and automatic fallback to local data.

#### Session Cache

```javascript
{
  usingAPI: true,          // Whether to try API
  lastAPICheck: null,      // Last API check timestamp
  bodyParts: null,         // Cached body parts list
  targets: null,           // Cached targets list
  equipment: null          // Cached equipment list
}
```

**Note:** In-memory only (not localStorage) per API terms.

#### Strategy

1. **Try ExerciseDB API first**
2. **On failure (quota/error)** → Switch to local data
3. **Session flag persists** → No further API calls until reload

#### Core Functions

**`getAllExercisesForApp(limit)`**
Gets all exercises (API or local). Returns adapted format.

**`getFeaturedExercises()`**
Gets 4 exercises per category for homepage display.

**`getExercise(exerciseId)`**
Gets single exercise by ID (tries API, falls back to local).

**`searchExercises(query)`**
Searches exercises across all attributes.

**`getExercisesByAppCategory(categoryId)`**
Gets all exercises for a Vitality category (1-4).

**`getFilterOptions()`**
Gets available body parts, targets, and equipment for filters.

**`getCategories()`**
Returns the 4 main Vitality categories (always local).

**`getCategory(categoryId)`**
Gets single category by ID.

**`getDataSource()`**
Returns current data source: `'api'` or `'local'`.

**`resetSession()`**
Resets session cache (for testing/retry).

#### Response Format

All provider functions return:
```javascript
{
  success: true,
  data: [...],
  source: 'api' | 'local'
}
```

---

## 📁 Existing Files (Updated Context)

### `exerciseData.js`

**Role:** Static fallback data when API is unavailable.

Holds all static exercise content. Now serves as the **fallback datasource** when ExerciseDB API quota is exceeded or unavailable.

#### Data

**`EXERCISE_CATEGORIES`** — 4 category objects:

| ID | Name | Description |
|---|---|---|
| 1 | Upper Body | Arms, chest, shoulders, and back |
| 2 | Lower Body | Legs, glutes, and hips |
| 3 | Core | Core strength and stability |
| 4 | Cardio | Endurance and cardiovascular fitness |

**`EXERCISES`** — 20 fallback exercise objects:

| Field | Type | Description |
|---|---|---|
| `id` | number | Unique identifier |
| `name` | string | Exercise name |
| `categoryId` | number | Links to `EXERCISE_CATEGORIES` |
| `description` | string | Short summary |
| `instructions` | string | Step-by-step instructions |

#### Functions

**`getExercisesByCategory(categoryId)`**
Returns all local exercises for a category.

**`getExerciseById(exerciseId)`**
Returns single local exercise by ID.

**`getCategoryById(categoryId)`**
Returns category object by ID.

**`truncateWords(text, maxWords)`**
Truncates text to max words with `...`.

---

### `exerciseStorage.js`

**No changes** - Works seamlessly with both API and local exercises.

Manages exercise completion tracking in `localStorage`. Works with both API exercise IDs and local exercise IDs.

#### Storage Keys

| Key | Value |
|---|---|
| `exerciseCompletions` | Array of `{ exerciseId, date, timestamp }` |
| `exerciseStats` | `{ completions, streak }` for current day |

#### Functions

**`getCompletedExercises()`**
Returns array of exercise IDs completed today.

**`toggleExerciseCompletion(exerciseId)`**
Adds/removes completion. Works with any exercise ID (API or local).

**`updateExerciseStats()`**
Recalculates today's stats and streak.

**`calculateStreak(completions)`** *(private)*
Counts consecutive exercise days.

**`getExerciseHistory()`**
Returns full completion history.

**`cleanupOldCompletions()`**
Removes entries older than 90 days.

---

### `nutritionData.js`

**No changes** - Independent of exercise data source.

Contains static nutrition content for Health & Nutrition page.

#### Data

**`NUTRITION_DATA`** — 5 nutrition sections:

| Key | Title | Focus |
|---|---|---|
| `general` | General Fitness Nutrition | Overall health |
| `upper_body` | Upper Body Nutrition | Muscle building |
| `lower_body` | Lower Body Nutrition | Energy & endurance |
| `core` | Core Nutrition | Fat reduction |
| `cardio` | Cardio Nutrition | Cardiovascular health |

Each section: `{ title, icon, description, tips[], foods[] }`

#### Functions

**`getNutritionSection(sectionKey)`**
Returns single section or null.

**`getAllFoods()`**
Returns deduplicated sorted food list.

**`getTipsByCategory(category)`**
Returns tips, optionally filtered.

**`getSectionKeys()`**
Returns all section keys.

---

### `quoteService.js`

**No changes** - Independent of exercise data source.

Handles daily motivational quotes with localStorage caching.

#### Data

**`FALLBACK_QUOTES`** — 10 motivational quotes.

#### Storage

| Key | Value |
|---|---|
| `dailyQuote` | `{ quote: { text, author }, date }` |

#### Functions

**`getTodayDateString()`**
Returns `YYYY-MM-DD` format date.

**`getRandomFallbackQuote()`**
Picks random quote.

**`saveQuoteToLocalStorage(quote, date)`**
Persists quote.

**`getQuoteFromLocalStorage()`**
Retrieves stored quote.

**`shouldFetchNewQuote()`**
Checks if quote needs refresh.

**`getDailyQuote()`** *(async)*
Main function - returns cached or new quote.

**`fetchQuoteFromAPIs()`** *(async)*
Manual refresh function.

---

### `stats.js`

**Updated** - Works with both API and local exercise IDs.

Derives progress statistics from exercise completion history. Now works seamlessly with exercises from either source.

#### Functions

**`calculateStreak()`**
Calculates consecutive-day streak (capped at 365 days).

**`getWeeklyCompletions()`**
Returns completions in last 7 days.

**`getMonthlyCompletions()`**
Returns completions in last 30 days.

**`getTotalCompletions()`**
Returns all-time total.

**`getCategoryBreakdown(daysBack)`**
Returns category stats with percentages.

**`getRecentActivity(limit)`**
Returns recent completions with exercise details.

**`formatDate(dateString)`**
Formats dates for display ('Today', 'Yesterday', etc.).

**`getAllProgressStats()`**
Convenience function returning all stats:

```javascript
{
  currentStreak,
  weeklyCompletions,
  monthlyCompletions,
  totalExercises,
  categoryStats,
  recentActivities
}
```

---

## 🔄 Data Flow

### Exercise Display Flow

```
User Action
    ↓
exerciseProvider.js (Smart Router)
    ↓
Try ExerciseDB API?
    ├─ YES → exerciseDbApi.js → API Request
    │            ↓
    │        Success? → exerciseAdapter.js → Convert Format
    │            ↓
    │        Return Adapted Data
    │
    └─ NO/FAILED → exerciseData.js → Local Fallback
                        ↓
                   adaptLocalExercise()
                        ↓
                   Return Compatible Data
```

### Completion Tracking Flow

```
User Marks Complete
    ↓
exerciseStorage.js
    ↓
Save to localStorage (works with any ID)
    ↓
Update Stats
    ↓
stats.js reads completions
    ↓
exerciseProvider.getExercise(id)
    ↓
Display in Progress Page
```

---

## 🔑 Key Integration Points

### How Components Use Utils

#### Exercises Page
```javascript
import { 
  getFeaturedExercises,
  searchExercises,
  getExercisesByAppCategory 
} from './exerciseProvider';
```

#### Exercise Detail Page
```javascript
import { getExercise } from './exerciseProvider';
```

#### Completion Tracking (All Pages)
```javascript
import { 
  getCompletedExercises,
  toggleExerciseCompletion 
} from './exerciseStorage';
```

#### Progress Page
```javascript
import { getAllProgressStats } from './stats';
```

---

## 📊 API vs Local Data

### When API is Used
- ✅ App loads normally
- ✅ API key present in environment
- ✅ Quota not exceeded (429 error)
- ✅ API responding successfully

**Result:** 1300+ exercises with GIF animations

### When Local Data is Used
- ⚠️ API quota exceeded (429 error)
- ⚠️ API key missing
- ⚠️ API unavailable/error
- ⚠️ Network failure

**Result:** 20 hardcoded exercises (no GIFs)

### User Experience

**API Mode:**
- Full exercise library
- 180p GIF demonstrations
- Search across 1300+ exercises
- All categories populated

**Local Mode:**
- Amber banner: "Using offline exercises"
- 20 core exercises
- All features still work
- Completion tracking unaffected
- Progress stats still accurate

---

## 🔧 Environment Configuration

### Required Environment Variable

```bash
# .env.local
NEXT_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key_here
```

**Plan:** BASIC (180p resolution)

### Validation

```javascript
// Check if API is configured
import { isAPIAvailable } from './exerciseDbApi';

if (isAPIAvailable()) {
  console.log('API configured ✅');
} else {
  console.log('Using local data ⚠️');
}
```

---

## 📝 localStorage Keys (Complete List)

| Key | Source | Contents |
|-----|--------|----------|
| `exerciseCompletions` | exerciseStorage.js | Completion history |
| `exerciseStats` | exerciseStorage.js | Daily stats & streak |
| `dailyQuote` | quoteService.js | Daily motivational quote |
| `username` | Dashboard (read-only) | User's display name |

**Note:** No exercise data cached per API terms.

---

## 🎯 Summary

The utils directory now provides:

1. **API Integration** (exerciseDbApi.js)
2. **Data Adaptation** (exerciseAdapter.js)
3. **Smart Routing** (exerciseProvider.js)
4. **Fallback Data** (exerciseData.js)
5. **Completion Tracking** (exerciseStorage.js)
6. **Progress Analytics** (stats.js)
7. **Nutrition Content** (nutritionData.js)
8. **Daily Quotes** (quoteService.js)

All working together to provide:
- ✅ 1300+ exercises when API available
- ✅ Seamless fallback to 20 local exercises
- ✅ Consistent completion tracking
- ✅ Accurate progress statistics
- ✅ Zero data loss on API failure