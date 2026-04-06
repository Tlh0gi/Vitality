# Components

The `components/` directory contains reusable client-side UI components used across the Vitality application. These components are designed with a utility-first styling approach using Tailwind CSS, enabling rapid UI development, consistent design, and responsive behavior without maintaining separate CSS files.

---

## Design Approach

### Why Tailwind CSS?

The project uses Tailwind CSS instead of traditional CSS or component libraries (e.g. MUI) for the following reasons:

* **Utility-first workflow**
  Styling is applied directly in JSX via composable utility classes, eliminating context switching between CSS and component files.

* **Responsive design by default**
  Breakpoints (`md:`, `lg:`) are embedded inline, making it straightforward to define different layouts for mobile and desktop without duplicating components.

* **No CSS bloat or naming conflicts**
  Avoids global class collisions and unused CSS through atomic class usage.

* **Faster iteration**
  UI adjustments (spacing, colors, typography) can be made immediately without editing external stylesheets.

* **Consistent design system**
  Shared spacing, color gradients, and typography scales are enforced via Tailwind’s configuration.

---

## Files Overview

| File           | Purpose                                                             |
| -------------- | ------------------------------------------------------------------- |
| `Navbar.js`    | Global responsive navigation bar rendered across all pages          |
| `QuoteCard.js` | Dynamic motivational quote component with caching and refresh logic |

---

## Navbar.js

A **stateless client component** responsible for rendering the application's primary navigation. It is included in the root layout to ensure global availability.

### Key Characteristics

* Fully responsive using Tailwind breakpoints
* No internal state or side effects
* Purely presentational
* Optimized for reuse and consistency

### Directive

```js
'use client';
```

### Dependencies

| Import | Source      |
| ------ | ----------- |
| `Link` | `next/link` |

### Layout Structure

```
<nav>
  <div> (container)
    <div> (brand/logo)
    <ul> (navigation links)
```

### Tailwind Implementation Details

| Concern            | Implementation                                |
| ------------------ | --------------------------------------------- |
| Sticky positioning | `sticky top-0 z-50`                           |
| Visual hierarchy   | `shadow-lg`, gradient background              |
| Layout             | `flex`, `justify-between`, `items-center`     |
| Responsiveness     | `flex-col md:flex-row`                        |
| Spacing            | `px-5`, `py-4`, `gap-8`                       |
| Interaction        | `hover:bg-white/10`, `hover:-translate-y-0.5` |

### Navigation Links

| Label              | Route        |
| ------------------ | ------------ |
| Dashboard          | `/`          |
| Exercises          | `/exercises` |
| My Progress        | `/progress`  |
| Health & Nutrition | `/health`    |

### Design Notes

* Uses a gradient background (`from-green-600 to-teal-600`) to align with the app’s health/fitness theme.
* Mobile-first layout stacks elements vertically, then switches to horizontal on medium screens.
* Hover effects provide subtle feedback without introducing heavy animations.

### Props

None.

---

## QuoteCard.js

A **stateful client component** responsible for fetching, caching, and displaying a daily motivational quote. It includes both time-based automation and manual refresh capabilities.

### Responsibilities

* Retrieve a cached daily quote
* Fetch a new quote when needed
* Persist data in `localStorage`
* Automatically refresh at midnight
* Provide manual refresh interaction

### Directive

```js
'use client';
```

### Dependencies

| Import          | Source                  |
| --------------- | ----------------------- |
| React Hooks     | `react`                 |
| Quote utilities | `../utils/quoteService` |

### State Management

| State          | Type             | Purpose                       |
| -------------- | ---------------- | ----------------------------- |
| `quote`        | `object \| null` | Stores `{ text, author }`     |
| `isLoading`    | `boolean`        | Controls initial loading UI   |
| `isRefreshing` | `boolean`        | Controls refresh button state |

### Data Flow Architecture

```
Component Mount
   ↓
getDailyQuote()
   ↓
(localStorage OR API)
   ↓
setQuote()
   ↓
Render UI
```

### Side Effects

#### 1. Initial Load

* Executes once on mount
* Retrieves cached or fresh quote

#### 2. Midnight Synchronization

* Dynamically calculates time until next midnight
* Uses recursive `setTimeout` for long-term accuracy
* Prevents drift vs fixed intervals

#### 3. Fallback Interval Check

* Runs every 60 seconds
* Ensures correctness if:

  * Tab remains open overnight
  * Timeout fails or is throttled

### Core Functions

#### `loadQuote()`

* Fetches daily quote via `getDailyQuote`
* Handles errors with fallback content
* Updates loading state

#### `handleRefresh()`

* Fetches a new quote via API
* Updates local storage
* Provides user feedback with a temporary loading state

### Tailwind Implementation Details

| Concern           | Implementation                         |
| ----------------- | -------------------------------------- |
| Card design       | `rounded-2xl shadow-xl`                |
| Theme consistency | Same gradient as Navbar                |
| Typography        | `text-lg italic`, `text-sm opacity-90` |
| Layout            | `text-center`, `max-w-7xl mx-auto`     |
| Button states     | `hover`, `disabled`, `transition-all`  |
| Loading spinner   | `animate-spin`                         |

### Rendering States

#### Loading State

* Displays placeholder text
* Prevents layout shift by keeping structure consistent

#### Loaded State

* Displays quote and author
* Enables refresh interaction
* Shows metadata ("Updated daily at midnight")

### Design Decisions

* **LocalStorage caching** reduces unnecessary API calls and improves perceived performance.
* **Dual refresh strategy (timeout + interval)** ensures reliability across browser behaviors.
* **Optimistic UI updates** during refresh improve responsiveness.
* **Shared styling tokens (gradients, spacing)** maintain visual consistency with other components.

### Props

None.

---

## Summary

These components demonstrate a clear separation of concerns:

* `Navbar` → static, layout-focused
* `QuoteCard` → dynamic, logic-heavy

Both leverage Tailwind CSS to:

* Eliminate traditional CSS overhead
* Enable responsive design inline
* Maintain a consistent UI system
