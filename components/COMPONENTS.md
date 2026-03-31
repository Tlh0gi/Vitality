# Components

The `components/` directory contains two shared React components used across the Vitality app. Both are client components rendered on the browser side.

---

## Files Overview

| File | Purpose |
|---|---|
| `Navbar.js` | Global navigation bar rendered on every page |
| `QuoteCard.js` | Daily motivational quote card with auto-refresh and manual refresh |

---

## `Navbar.js`

A static client component that renders the top navigation bar. It is included in the root `layout.js` so it appears on every page of the app.

### Directive

```js
'use client';
```

### Dependencies

| Import | Source |
|---|---|
| `Link` | `next/link` |

### Structure

Renders a `<nav>` element with the following layout:

```
<nav.navbar>
  <div.nav-container>
    <div.nav-brand>        ← "Vitality" heading, links to "/"
    <ul.nav-menu>
      <li.nav-item>        ← Dashboard        → "/"
      <li.nav-item>        ← Exercises        → "/exercises"
      <li.nav-item>        ← My Progress      → "/progress"
      <li.nav-item>        ← Health & Nutrition → "/health"
```

### Navigation Links

| Label | Route |
|---|---|
| Dashboard | `/` |
| Exercises | `/exercises` |
| My Progress | `/progress` |
| Health & Nutrition | `/health` |

### CSS Classes

| Class | Element |
|---|---|
| `.navbar` | `<nav>` wrapper |
| `.nav-container` | Inner layout container |
| `.nav-brand` | Brand/logo area |
| `.nav-menu` | `<ul>` link list |
| `.nav-item` | Each `<li>` |
| `.nav-link` | Each `<Link>` anchor |

### Props

None. This is a static presentational component with no props or state.

---

## `QuoteCard.js`

A client component that displays the daily motivational quote on the Dashboard. It handles initial loading, automatic midnight refresh, a one-minute interval fallback check, and a manual refresh button.

### Directive

```js
'use client';
```

### Dependencies

| Import | Source |
|---|---|
| `useState`, `useEffect` | `react` |
| `getDailyQuote` | `../utils/quoteService` |
| `fetchQuoteFromAPIs` | `../utils/quoteService` |
| `saveQuoteToLocalStorage` | `../utils/quoteService` |
| `getTodayDateString` | `../utils/quoteService` |

### State

| Variable | Type | Initial Value | Description |
|---|---|---|---|
| `quote` | `object \| null` | `null` | The currently displayed quote `{ text, author }` |
| `isLoading` | `boolean` | `true` | Controls the loading skeleton display |
| `isRefreshing` | `boolean` | `false` | Controls the refresh button's loading state |

### Lifecycle & Effects

**Effect 1 — Initial load**
Runs once on mount. Calls `loadQuote()` to fetch or retrieve the cached daily quote.

**Effect 2 — Midnight timeout**
Calculates the milliseconds until the next midnight and sets a `setTimeout` to call `loadQuote()` when it fires. Recursively resets itself after each midnight so it continues to work across multiple days. Clears the timeout on unmount.

**Effect 3 — One-minute interval fallback**
Sets a `setInterval` that checks every 60 seconds whether the stored quote's date differs from today's date. If the date has changed (e.g. the tab was left open overnight), it calls `loadQuote()` to refresh. Clears the interval on unmount.

### Functions

**`loadQuote()`** *(async)*
Calls `getDailyQuote()` and sets the `quote` state. On error, falls back to a hardcoded quote. Sets `isLoading` to `false` when done.

**`handleRefresh()`** *(async)*
Triggered by the refresh button. Calls `fetchQuoteFromAPIs()` to get a new random quote, saves it to `localStorage` via `saveQuoteToLocalStorage`, and updates `quote` state. Sets `isRefreshing` to `true` for the duration and resets it after 2 seconds on success.

### Rendered Output

**Loading state** — shown while `isLoading` is `true` or `quote` is `null`:

```
<section.quote-section>
  <div.container>
    <div.quote-card>
      <h3> Daily Motivation
      <blockquote.daily-quote>
        <p> Loading...
```

**Loaded state:**

```
<section.quote-section>
  <div.container>
    <div.quote-card>
      <h3> Daily Motivation
      <blockquote.daily-quote>
        <p #quote-text>     ← quote.text
        <cite #quote-author> ← "- quote.author"
      <button.refresh-quote-btn>
        → Refreshing: <span.loading-spinner> + "Loading..."
        → Idle: "🔄 New Quote"
      <div.quote-last-updated> ← "Updated daily at midnight"
```

### CSS Classes

| Class | Element |
|---|---|
| `.quote-section` | `<section>` wrapper |
| `.container` | Inner layout container |
| `.quote-card` | Card wrapper |
| `.daily-quote` | `<blockquote>` element |
| `.refresh-quote-btn` | Refresh button |
| `.loading-spinner` | Spinner `<span>` shown during refresh |
| `.quote-last-updated` | Footer note below the button |

### IDs

| ID | Element | Content |
|---|---|---|
| `#quote-text` | `<p>` | The quote body text |
| `#quote-author` | `<cite>` | The quote author, prefixed with `"-"` |

### Props

None. All data is sourced internally via `quoteService.js`.