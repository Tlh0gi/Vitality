# Health & Nutrition Page

**Route:** `/health`
**Files:** `app/health/page.jsx`

The Health & Nutrition page displays categorised nutrition tips and recommended foods for each workout type. Content is driven entirely by `nutritionData.js` — no API calls are made on this page.

---

## page.jsx

### Directive

```js
'use client';
```

### Dependencies

| Import | Source |
|---|---|
| `useState` | `react` |
| `Navbar` | `../../components/Navbar` |
| `NUTRITION_DATA`, `getSectionKeys` | `../../utils/nutritionData` |
| `BoltIcon`, `TrophyIcon`, `ArrowUpIcon`, `ArrowDownIcon`, `FireIcon`, `HeartIcon`, `LightBulbIcon`, `BeakerIcon`, `ClockIcon`, `SparklesIcon`, `CheckCircleIcon`, `ListBulletIcon` | `@heroicons/react/24/outline` |

### State

| Variable | Type | Initial Value | Description |
|---|---|---|---|
| `activeSection` | `string` | `'general'` | The currently displayed nutrition section key |

### Module-Level Constants

**`SECTION_ICONS`** — Maps each section key to a Heroicon component, replacing the previous emoji labels in the navigation and section headers:

| Section Key | Icon |
|---|---|
| `general` | `TrophyIcon` |
| `upper_body` | `ArrowUpIcon` |
| `lower_body` | `ArrowDownIcon` |
| `core` | `FireIcon` |
| `cardio` | `HeartIcon` |

**`SECTION_LABELS`** — Maps section keys to plain text nav labels (no emojis).

**`quickFacts`** — Static array of four fact objects, each with `number`, `label`, and an `icon` (Heroicon component). Replaces the previous hardcoded emoji-prefixed JSX:

| Number | Label | Icon |
|---|---|---|
| `60%` | of your body is water | `BeakerIcon` |
| `2–3L` | of water daily | `SparklesIcon` |
| `30 min` | post-workout protein window | `ClockIcon` |
| `5–6` | small meals per day | `ListBulletIcon` |

### Functions

**`showSection(sectionKey)`**
Sets `activeSection` to the given key and, after a 100ms delay, smoothly scrolls to the matching section element via `document.getElementById(sectionKey + '-section')`.

### Page Structure

```
<Navbar />
<main>
  <section>                          ← Hero — teal-to-green gradient, HeartIcon
  <div>                              ← max-w-5xl mx-auto px-5
    <section>                        ← Quick Facts — teal gradient banner
      <h3> <LightBulbIcon />
      <div>                          ← 2×2 / 4-col grid
        <div> × 4                    ← fact tile: Icon + number + label
    <section>                        ← Sticky nav — bg-white rounded-2xl shadow-sm
      <div>                          ← flex-wrap gap-2
        <button> × 5                 ← SectionIcon + label; bg-teal-500 when active
    {sectionKeys.map(...)}
      [if activeSection === sectionKey]
        <section>                    ← Nutrition section card
          <div>                      ← Section header: icon tile + title + description
            <SectionIcon />
            <h2> + <p>
          <div>                      ← 2-col content grid
            <div>                    ← Tips panel — border-l-4 border-teal-500
              <h3> <LightBulbIcon />
              <div> × N              ← Tip card
                <div>                ← SparklesIcon badge + tip.title
                <p>                  ← tip.content
            <div>                    ← Foods panel — border-l-4 border-green-500
              <h3> <ListBulletIcon />
              <ul>
                <li> × N             ← CheckCircleIcon + food name
```


### Tailwind Patterns

| Element | Key Classes |
|---|---|
| Hero section | `bg-gradient-to-r from-teal-500 to-green-600 text-white py-16 text-center` |
| Quick facts banner | `bg-gradient-to-r from-teal-500 to-green-600 rounded-2xl p-7 text-white` |
| Fact tile | `bg-white/15 rounded-xl p-4 text-center backdrop-blur-sm` |
| Sticky nav | `bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sticky top-[80px] z-10` |
| Inactive nav button | `bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100 rounded-xl` |
| Active nav button | `bg-teal-500 text-white shadow-sm rounded-xl` |
| Section card | `bg-white border border-gray-100 rounded-2xl shadow-sm p-8` |
| Section icon tile | `inline-flex items-center justify-center w-14 h-14 bg-teal-50 rounded-2xl` |
| Tips panel | `bg-gray-50 border-l-4 border-teal-500 rounded-2xl p-6` |
| Foods panel | `bg-gray-50 border-l-4 border-green-500 rounded-2xl p-6` |
| Tip card | `bg-white border border-gray-100 rounded-xl p-4 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200` |
| Tip icon badge | `w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center` (contains `SparklesIcon`) |
| Food list item | `flex items-center gap-3 bg-white border-l-[3px] border-green-400 rounded-xl px-4 py-3 hover:bg-green-50 hover:translate-x-1 transition-all duration-200` (contains `CheckCircleIcon`) |

### Responsive Behaviour

| Change | Tailwind |
|---|---|
| Quick facts — 2 cols mobile, 4 cols desktop | `grid-cols-2 md:grid-cols-4` |
| Nav buttons — wrap naturally | `flex flex-wrap` |
| Content grid — 1 col mobile, 2 cols desktop | `grid-cols-1 md:grid-cols-2` |