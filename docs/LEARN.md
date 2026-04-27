# 📚 LEARN.md — How This Dashboard Was Built

A complete, beginner-friendly guide explaining every decision made when building RetailIQ.

---

## Table of Contents

1. [The Big Picture — How It All Connects](#1-the-big-picture)
2. [Step 1 — HTML Structure](#2-step-1--html-structure)
3. [Step 2 — CSS Design Tokens](#3-step-2--css-design-tokens)
4. [Step 3 — Background & Topbar](#4-step-3--background--topbar)
5. [Step 4 — KPI Cards](#5-step-4--kpi-cards)
6. [Step 5 — Grid Layouts](#6-step-5--grid-layouts)
7. [Step 6 — Chart.js Basics](#7-step-6--chartjs-basics)
8. [Step 7 — Each Chart Explained](#8-step-7--each-chart-explained)
9. [Step 8 — Filter System](#9-step-8--filter-system)
10. [Step 9 — Data Layer](#10-step-9--data-layer)
11. [How to Think Like a Dashboard Developer](#11-how-to-think-like-a-dashboard-developer)

---

## 1. The Big Picture

Think of the dashboard in 3 layers:

```
┌──────────────────────────────────────────────────┐
│  LAYER 3: LOGIC (filters.js)                     │
│  "When user clicks a filter button,              │
│   update these things"                           │
├──────────────────────────────────────────────────┤
│  LAYER 2: CHARTS (charts.js)                     │
│  "Take this data and draw these charts"          │
├──────────────────────────────────────────────────┤
│  LAYER 1: DATA (data.js)                         │
│  "Here are all the numbers from the dataset"     │
└──────────────────────────────────────────────────┘
        ↑
        All displayed inside index.html + style.css
```

When a user clicks "Technology" filter:
1. `filters.js` catches the click
2. Calls `buildAll('Technology')` in `charts.js`
3. `charts.js` reads data from `D['Technology']` in `data.js`
4. Redraws all 6 charts with the new data

---

## 2. Step 1 — HTML Structure

The HTML only does one job: **define where things go**.
It does NOT do any logic or styling.

```html
<!-- index.html structure -->

<div class="topbar">           <!-- Logo + badges at top -->

<div class="main">             <!-- Everything below topbar -->

  <div class="filter-bar">    <!-- Year / Category / Region buttons -->

  <div class="insight-strip"> <!-- Dynamic text insight -->

  <div class="kpi-grid">      <!-- 4 KPI cards in a row -->

  <div class="chart-row r2">  <!-- Row 1: Line chart + Donut -->

  <div class="chart-row r3">  <!-- Row 2: Bar + Pie + H-Bar -->

  <div class="chart-row r2b"> <!-- Row 3: Table + Grouped Bar -->
```

**Rule**: Every section is a `<div>` with a class. The class does the styling. The HTML is just structure.

---

## 3. Step 2 — CSS Design Tokens

**Design tokens** = variables for colors, spacing, fonts.

```css
/* At the very TOP of style.css */
:root {
  --bg:      #0a0a0f;   /* background */
  --accent:  #00e5a0;   /* main green */
  --accent2: #7c6bff;   /* purple */
}
```

**Why use variables?** If you want to change the green accent from `#00e5a0` to `#ff0000`, you change it in ONE place and it updates everywhere. Without variables, you'd have to find and change 50+ occurrences.

**Usage throughout the CSS:**
```css
.logo-dot  { background: var(--accent); }   /* uses the green */
.kpi-value { color:      var(--accent); }   /* same green */
.badge     { border:     1px solid rgba(0,229,160,0.2); } /* same green, transparent */
```

---

## 4. Step 3 — Background & Topbar

### The Grid Pattern
The subtle grid behind the dashboard is pure CSS — no image file needed:

```css
body::before {
  content: '';           /* creates a fake element */
  position: fixed;       /* covers the whole screen */
  inset: 0;
  background-image:
    /* horizontal lines every 40px */
    linear-gradient(rgba(0,229,160,0.03) 1px, transparent 1px),
    /* vertical lines every 40px */
    linear-gradient(90deg, rgba(0,229,160,0.03) 1px, transparent 1px);
  background-size: 40px 40px;  /* spacing between lines */
  pointer-events: none;         /* let clicks pass through */
  z-index: 0;                   /* behind everything */
}
```

### Sticky Topbar
```css
.topbar {
  position: sticky;     /* sticks to top when you scroll */
  top: 0;
  z-index: 100;         /* sits above charts */
  backdrop-filter: blur(12px);  /* frosted glass blur effect */
}
```

### Animated Logo Dot
```css
.logo-dot {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.6; transform: scale(0.8); }
}
```
`@keyframes` defines the animation. `animation: pulse 2s infinite` plays it forever, 2 seconds per cycle.

---

## 5. Step 4 — KPI Cards

### The Glow Effect
Each card has a soft colored blob in its corner:

```css
.kpi-card::before {
  content: '';
  position: absolute;      /* positioned inside the card */
  top: -20px; right: -20px;
  width: 80px; height: 80px;
  border-radius: 50%;      /* make it circular */
  filter: blur(28px);      /* blur it into a glow */
  opacity: 0.25;           /* very subtle */
}

/* Each card gets a different color */
.kpi-card:nth-child(1)::before { background: var(--accent);  }  /* green */
.kpi-card:nth-child(2)::before { background: var(--accent2); }  /* purple */
```

`::before` is a "pseudo-element" — it's a CSS-only element you didn't write in HTML.
`overflow: hidden` on the card clips the blob so it doesn't spill out.

### Fade-in Animation (Staggered)
```css
.kpi-card { animation: fi 0.45s ease forwards; }

/* Different delay for each card = staggered effect */
.kpi-card:nth-child(1) { animation-delay: 0.04s; }
.kpi-card:nth-child(2) { animation-delay: 0.08s; }
.kpi-card:nth-child(3) { animation-delay: 0.12s; }
.kpi-card:nth-child(4) { animation-delay: 0.16s; }

@keyframes fi {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## 6. Step 5 — Grid Layouts

CSS Grid is what arranges charts side by side.

```css
/* 3-column layout */
.r3 { grid-template-columns: 1fr 1fr 1fr; }

/* Unequal 2-column: left gets 2/3, right gets 1/3 */
.r2 { grid-template-columns: 2fr 1fr; }

/* Equal 2-column */
.r2b { grid-template-columns: 1fr 1fr; }
```

`1fr` means "1 fraction of available space". Three `1fr` columns = three equal columns.
`2fr 1fr` = left gets twice as much space as right.

### Responsive Breakpoints
At smaller screens, columns stack vertically:
```css
@media (max-width: 1100px) {
  .r2 { grid-template-columns: 1fr; }  /* single column */
  .r3 { grid-template-columns: 1fr 1fr; }  /* 2 columns */
}
```

---

## 7. Step 6 — Chart.js Basics

### How to Create Any Chart

```javascript
// 1. Get the canvas element
const ctx = document.getElementById('myChart').getContext('2d');

// 2. Create the chart
const chart = new Chart(ctx, {
  type: 'line',      // 'bar', 'pie', 'doughnut', 'line'
  data: {
    labels: ['Jan', 'Feb', 'Mar'],   // X axis labels
    datasets: [{
      label: 'Sales',
      data:  [100, 150, 120],        // Y axis values
      borderColor: '#00e5a0',        // line color
      backgroundColor: '#00e5a040', // fill color
    }]
  },
  options: {
    responsive: true,               // resize with window
    plugins: { legend: { display: false } }
  }
});
```

### How to Update a Chart
```javascript
chart.data.datasets[0].data = [200, 300, 250];  // new values
chart.update();  // re-render
```

### The `mk()` Helper Function
Instead of writing all the above every time, we wrote a helper:

```javascript
function mk(id, type, data, opts = {}) {
  if (CH[id]) CH[id].destroy();   // remove old chart
  const ctx = document.getElementById(id).getContext('2d');
  CH[id] = new Chart(ctx, { type, data, options: { responsive: true, ...opts } });
}

// Usage — much shorter:
mk('tc', 'line', { labels: [...], datasets: [...] }, { scales: {...} });
```

---

## 8. Step 7 — Each Chart Explained

### Chart 1: Dual-Axis Line Chart
**Problem**: Sales (~$200K) and Profit (~$30K) are very different scales.
**Solution**: Two Y-axes — left for sales, right for profit.

```javascript
datasets: [
  { data: salesData,  yAxisID: 'y'  },  // left axis
  { data: profitData, yAxisID: 'y1' },  // right axis
],
scales: {
  y:  { position: 'left'  },
  y1: { position: 'right' }
}
```

### Chart 2: Doughnut
`cutout: '68%'` controls the hole size. 0% = full pie, 100% = invisible.

### Chart 3: Horizontal Bar
`indexAxis: 'y'` flips the chart. That's literally all it takes to turn a vertical bar chart horizontal.

### Chart 4: Dynamic Colors
We color each bar based on whether the value is positive or negative:

```javascript
const colors = data.map(v => v >= 0
  ? 'rgba(0,229,160,0.65)'    // green for profit
  : 'rgba(255,107,107,0.65)'  // red for loss
);
```

### Gradient Fills (Line Charts)
```javascript
function grad(id, color) {
  const ctx = document.getElementById(id).getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 220);  // top to bottom
  g.addColorStop(0, color + '40');  // 40 = hex for 25% opacity
  g.addColorStop(1, color + '00');  // 00 = hex for 0%  opacity
  return g;
}
```

---

## 9. Step 8 — Filter System

### State Management
```javascript
let activeCat = 'All';  // tracks current category
```

This is "state" — a variable that remembers what the user has selected. When the region filter changes, we need to know the active category so we can reset back to it properly.

### Button Toggle Pattern
```javascript
function setActiveBtn(groupSelector, value) {
  document.querySelectorAll(groupSelector + ' .filter-btn').forEach(btn => {
    // toggle adds 'active' if condition is true, removes if false
    btn.classList.toggle('active', btn.textContent.trim() === value);
  });
}
```

This is the cleanest way to handle "only one button active at a time" groups.

### What Each Filter Does

| Filter | Updates |
|---|---|
| Year | Insight text only |
| Category | All 6 charts + KPIs + table + insight |
| Region | KPIs + insight only |

---

## 10. Step 9 — Data Layer

### Why Separate data.js?
If data and chart code are mixed together, it's hard to:
- Change a value without breaking chart logic
- Find where a specific number comes from
- Add a new dataset later

By putting all data in `data.js`, the chart code is clean and the data is easy to find/edit.

### Data Structure Pattern
```javascript
const D = {
  'All': {
    trend: { lbl: [...months], s: [...sales], p: [...profit] },
    kpi:   { s: '$2.30M', p: '$286K', o: '9,994', m: '12.5%' }
  },
  'Technology': {
    // same structure but filtered values
  }
};
```

We pre-aggregate the CSV data into this structure. In a real production app, you'd:
1. Load the raw CSV with `fetch('data.csv')`
2. Parse it with PapaParse or d3.csv
3. Compute aggregates with Array methods (`.filter()`, `.reduce()`)

---

## 11. How to Think Like a Dashboard Developer

### The 5 Questions to Ask Before Writing Code

1. **What data do I have?**
   → Look at the CSV columns. What can be aggregated?

2. **What does the user need to know?**
   → Identify 3-5 key business questions the dashboard answers.

3. **Which chart type answers each question?**
   - Trend over time → Line chart
   - Part of a whole → Pie / Donut
   - Comparison between categories → Bar chart
   - Ranking → Sorted horizontal bar or table
   - Correlation → Scatter plot

4. **What filters make sense?**
   → Think about how a manager would want to slice the data.

5. **What's the most important number?**
   → Put it in a KPI card, big and prominent.

### Common Mistakes (And How to Avoid Them)
| Mistake | Fix |
|---|---|
| Too many charts | Pick the 5-6 most important. More = noise |
| Charts without titles | Every chart needs a clear title |
| Raw numbers without context | Show % change vs previous period |
| Colors with no meaning | Green = good, Red = bad, consistently |
| No interactivity | Filters make dashboards 10x more useful |

---

*Happy building! — The best way to learn is to change one thing at a time and see what happens.*