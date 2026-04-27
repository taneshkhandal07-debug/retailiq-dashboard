/* ═══════════════════════════════════════════════════════════
   filters.js — Filter button logic and state management
   ═══════════════════════════════════════════════════════════
   This file handles all three filter groups:
     • Year filter    → updates insight text only
     • Category filter → rebuilds all charts + KPIs
     • Region filter  → updates KPIs only

   STATE:
   activeCat tracks which category is currently selected
   so that region filters know what KPI to reset back to.
═══════════════════════════════════════════════════════════ */

// ── STATE ─────────────────────────────────────────────────────
let activeCat = 'All';  // tracks active category filter

/* ─────────────────────────────────────────────────────────────
   fy(year) — Year Filter Handler
   ─────────────────────────────────────────────────────────────
   HOW IT WORKS:
   1. Find all buttons in the #yf group
   2. Add 'active' class to the clicked one, remove from others
   3. Update the insight strip text for that year

   In a real project with raw data you would:
   ─ filter the dataset to that year's rows
   ─ re-aggregate totals
   ─ then rebuild all charts
───────────────────────────────────────────────────────────── */
function fy(year) {
  // Toggle active class on year buttons
  setActiveBtn('#yf', year);

  // Show year-specific insight, or fall back to category insight
  setInsight(year === 'All' ? activeCat : year);
}

/* ─────────────────────────────────────────────────────────────
   fc(cat) — Category Filter Handler
   ─────────────────────────────────────────────────────────────
   This is the main filter — it changes:
   ✓ All chart data
   ✓ KPI card values
   ✓ Products table (filtered by category)
   ✓ Insight strip text
───────────────────────────────────────────────────────────── */
function fc(cat) {
  activeCat = cat;             // update global state
  setActiveBtn('#cf', cat);    // highlight the clicked button

  buildAll(cat);               // rebuild all 6 charts with new data
  buildTable(cat);             // rebuild products table
  setKPI(cat);                 // update KPI cards
  setInsight(cat);             // update insight message
}

/* ─────────────────────────────────────────────────────────────
   fr(region) — Region Filter Handler
   ─────────────────────────────────────────────────────────────
   Only updates KPI cards and insight text.
   Charts stay the same (could be extended to filter chart data too).
───────────────────────────────────────────────────────────── */
function fr(region) {
  setActiveBtn('#rf', region);

  if (region === 'All') {
    // Reset to the currently active category data
    setKPI(activeCat);
    setInsight(activeCat);
  } else {
    // Pull values from the REGION_KPI lookup table in data.js
    const r = REGION_KPI[region];
    document.getElementById('k1').textContent = r.s;
    document.getElementById('k2').textContent = r.p;
    document.getElementById('k3').textContent = r.o;
    document.getElementById('k4').textContent = r.m;
    setInsight(region);
  }
}

/* ─────────────────────────────────────────────────────────────
   HELPER: setActiveBtn(groupSelector, value)
   ─────────────────────────────────────────────────────────────
   Finds all buttons inside groupSelector,
   adds 'active' to the one whose text matches value,
   removes 'active' from all others.

   This is the standard pattern for toggle button groups.
───────────────────────────────────────────────────────────── */
function setActiveBtn(groupSelector, value) {
  document.querySelectorAll(groupSelector + ' .filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim() === value);
  });
}