/* ═══════════════════════════════════════════════════════════
   charts.js — Chart.js configuration and rendering
   ═══════════════════════════════════════════════════════════
   This file handles ALL chart creation and updating.
   Each chart is created once then updated when filters change.

   CHART.JS CONCEPTS USED:
   ─────────────────────────
   • Chart() constructor  — creates a chart on a <canvas>
   • datasets             — array of data series
   • options.scales       — configure axes
   • options.plugins      — tooltip, legend customisation
   • chart.data = ...     — update data
   • chart.update()       — re-render after data change
═══════════════════════════════════════════════════════════ */

// ── GLOBAL CHART.JS DEFAULTS ─────────────────────────────────
// These apply to EVERY chart on the page
Chart.defaults.color           = '#6b6b80';              // axis tick color
Chart.defaults.font.family     = "'DM Sans', sans-serif"; // base font
Chart.defaults.plugins.legend.display = false;            // hide legends by default

// Shared constants
const GC = 'rgba(255,255,255,0.04)';  // grid line color
const TC = '#6b6b80';                  // tick label color

// Shared tooltip style (applied to each chart)
const TT = {
  backgroundColor: '#1c1c26',
  borderColor:     'rgba(255,255,255,0.08)',
  borderWidth:     1,
  titleColor:      '#f0f0f8',
  bodyColor:       '#9090a8',
  padding:         10
};

// Registry of chart instances — so we can destroy & recreate on filter change
const CH = {};

/* ─────────────────────────────────────────────────────────────
   HELPER: mk(id, type, data, opts)
   Creates (or replaces) a Chart.js chart on canvas with given id.
   We destroy the old chart first to avoid "canvas already in use" errors.
───────────────────────────────────────────────────────────── */
function mk(id, type, data, opts = {}) {
  if (CH[id]) CH[id].destroy();                // remove previous instance
  const ctx = document.getElementById(id).getContext('2d');
  CH[id] = new Chart(ctx, { type, data, options: { responsive: true, ...opts } });
  return CH[id];
}

/* ─────────────────────────────────────────────────────────────
   HELPER: grad(id, color)
   Creates a vertical gradient fill for line charts.
   Top = semi-transparent, Bottom = fully transparent.
   This gives the "filled area" look under line charts.
───────────────────────────────────────────────────────────── */
function grad(id, color) {
  const ctx = document.getElementById(id).getContext('2d');
  const g   = ctx.createLinearGradient(0, 0, 0, 220);
  g.addColorStop(0, color + '40');   // 40 = 25% opacity in hex
  g.addColorStop(1, color + '00');   // 00 = 0%  opacity
  return g;
}

/* ─────────────────────────────────────────────────────────────
   MAIN: buildAll(key)
   Rebuilds ALL 6 charts using data from D[key].
   Called on page load and whenever a category filter changes.
───────────────────────────────────────────────────────────── */
function buildAll(key) {
  const d = D[key] || D.All;  // fallback to 'All' if key not found

  buildTrendChart(d);
  buildRegionChart();         // region chart always uses full data
  buildCategoryChart(d);
  buildSegmentChart(d);
  buildSubCategoryChart(d);
  buildQuarterlyChart(d);
}

/* ─────────────────────────────────────────────────────────────
   CHART 1: Sales & Profit Trend (Dual-Axis Line Chart)
   ─────────────────────────────────────────────────────────────
   WHY DUAL AXIS?
   Sales values (~200K) are much larger than Profit (~30K).
   Without a second Y axis, the profit line would be a flat
   line at the bottom. Two axes let both lines use full height.
───────────────────────────────────────────────────────────── */
function buildTrendChart(d) {
  mk('tc', 'line', {
    labels: d.trend.lbl,
    datasets: [
      {
        label:           'Sales ($K)',
        data:            d.trend.s,
        borderColor:     '#00e5a0',
        backgroundColor: grad('tc', '#00e5a0'), // gradient fill under line
        borderWidth:     2,
        pointRadius:     3,
        pointBackgroundColor: '#00e5a0',
        tension:         0.4,   // smooth curves (0 = straight, 1 = very curved)
        fill:            true,
        yAxisID:         'y'    // LEFT axis
      },
      {
        label:           'Profit ($K)',
        data:            d.trend.p,
        borderColor:     '#7c6bff',
        backgroundColor: grad('tc', '#7c6bff'),
        borderWidth:     2,
        pointRadius:     3,
        pointBackgroundColor: '#7c6bff',
        tension:         0.4,
        fill:            true,
        yAxisID:         'y1'   // RIGHT axis
      }
    ]
  }, {
    interaction: { mode: 'index', intersect: false },  // tooltip shows both values
    plugins: {
      legend: {
        display: true, position: 'top',
        labels: { color: '#9090a8', font: { size: 10 }, boxWidth: 8, padding: 14 }
      },
      tooltip: { ...TT, callbacks: { label: c => ` ${c.dataset.label}: $${c.raw}K` } }
    },
    scales: {
      x:  { grid: { color: GC }, ticks: { color: TC, font: { size: 10 } } },
      y:  { grid: { color: GC }, ticks: { color: TC, font: { size: 10 }, callback: v => '$' + v + 'K' } },
      y1: { position: 'right', grid: { display: false }, ticks: { color: TC, font: { size: 10 }, callback: v => '$' + v + 'K' } }
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   CHART 2: Region Sales (Doughnut)
   ─────────────────────────────────────────────────────────────
   cutout: '68%' — makes it a donut (ring) not a full pie.
   The higher the %, the thinner the ring.
───────────────────────────────────────────────────────────── */
function buildRegionChart() {
  mk('rc', 'doughnut', {
    labels: ['West', 'East', 'Central', 'South'],
    datasets: [{
      data:            [725, 678, 501, 391],
      backgroundColor: ['#00e5a0', '#7c6bff', '#ff6b6b', '#ffd166'],
      borderWidth:     0,         // no white gaps between segments
      hoverOffset:     6          // expand segment slightly on hover
    }]
  }, {
    cutout:  '68%',
    plugins: { tooltip: { ...TT, callbacks: { label: c => ` ${c.label}: $${c.raw}K` } } }
  });
}

/* ─────────────────────────────────────────────────────────────
   CHART 3: Profit by Category (Grouped Bar)
   ─────────────────────────────────────────────────────────────
   Two datasets (Sales + Profit) side by side per category.
   borderRadius gives the bars rounded tops.
───────────────────────────────────────────────────────────── */
function buildCategoryChart(d) {
  mk('cc', 'bar', {
    labels: d.cat.lbl,
    datasets: [
      {
        label: 'Sales ($K)', data: d.cat.s,
        backgroundColor: 'rgba(0,229,160,0.22)', borderColor: '#00e5a0',
        borderWidth: 1.5, borderRadius: 6, yAxisID: 'y'
      },
      {
        label: 'Profit ($K)', data: d.cat.p,
        backgroundColor: 'rgba(124,107,255,0.32)', borderColor: '#7c6bff',
        borderWidth: 1.5, borderRadius: 6, yAxisID: 'y'
      }
    ]
  }, {
    plugins: {
      legend: { display: true, position: 'top', labels: { color: '#9090a8', font: { size: 10 }, boxWidth: 8, padding: 12 } },
      tooltip: { ...TT }
    },
    scales: {
      x: { grid: { color: GC }, ticks: { color: TC, font: { size: 10 } } },
      y: { grid: { color: GC }, ticks: { color: TC, font: { size: 10 }, callback: v => '$' + v + 'K' } }
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   CHART 4: Customer Segments (Pie)
   ─────────────────────────────────────────────────────────────
   Same as doughnut but cutout is 0 (full pie, not a ring).
───────────────────────────────────────────────────────────── */
function buildSegmentChart(d) {
  mk('sc', 'pie', {
    labels: d.seg.lbl,
    datasets: [{
      data:            d.seg.v,
      backgroundColor: ['#00e5a0', '#7c6bff', '#ffd166'],
      borderWidth:     0,
      hoverOffset:     6
    }]
  }, {
    plugins: { tooltip: { ...TT, callbacks: { label: c => ` ${c.label}: ${c.raw}%` } } }
  });
}

/* ─────────────────────────────────────────────────────────────
   CHART 5: Sub-Category Profit (Horizontal Bar)
   ─────────────────────────────────────────────────────────────
   indexAxis: 'y' flips the chart horizontal.
   Negative values (losses) get a red color, positives get green.
───────────────────────────────────────────────────────────── */
function buildSubCategoryChart(d) {
  // Dynamically color each bar based on positive/negative value
  const colors  = d.sub.v.map(v => v >= 0 ? 'rgba(0,229,160,0.65)' : 'rgba(255,107,107,0.65)');
  const borders = d.sub.v.map(v => v >= 0 ? '#00e5a0' : '#ff6b6b');

  mk('scc', 'bar', {
    labels: d.sub.lbl,
    datasets: [{
      label: 'Profit ($K)', data: d.sub.v,
      backgroundColor: colors, borderColor: borders,
      borderWidth: 1.5, borderRadius: 4
    }]
  }, {
    indexAxis: 'y',   // ← THIS flips it horizontal
    plugins:   { tooltip: { ...TT, callbacks: { label: c => ` $${c.raw}K` } } },
    scales: {
      x: { grid: { color: GC }, ticks: { color: TC, font: { size: 10 }, callback: v => '$' + v + 'K' } },
      y: { grid: { color: GC }, ticks: { color: TC, font: { size: 10 } } }
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   CHART 6: Quarterly Sales Growth (Grouped Bar)
   ─────────────────────────────────────────────────────────────
   Compares two consecutive years side by side per quarter.
   Zeros are used to "hide" the other year's bar in each half.
───────────────────────────────────────────────────────────── */
function buildQuarterlyChart(d) {
  mk('qc', 'bar', {
    labels: d.qtr.lbl,
    datasets: [
      {
        label: 'Yr A', data: d.qtr.a,
        backgroundColor: 'rgba(0,229,160,0.38)', borderColor: '#00e5a0',
        borderWidth: 1.5, borderRadius: 5
      },
      {
        label: 'Yr B', data: d.qtr.b,
        backgroundColor: 'rgba(124,107,255,0.38)', borderColor: '#7c6bff',
        borderWidth: 1.5, borderRadius: 5
      }
    ]
  }, {
    plugins: {
      legend: { display: true, position: 'top', labels: { color: '#9090a8', font: { size: 10 }, boxWidth: 8, padding: 12 } },
      tooltip: { ...TT, callbacks: { label: c => ` $${c.raw}K` } }
    },
    scales: {
      x: { grid: { color: GC }, ticks: { color: TC, font: { size: 10 } } },
      y: { grid: { color: GC }, ticks: { color: TC, font: { size: 10 }, callback: v => '$' + v + 'K' } }
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   FUNCTION: buildTable(catFilter)
   Renders the products table. Filters by category if provided.
   Uses template literals to generate HTML rows dynamically.
───────────────────────────────────────────────────────────── */
function buildTable(catFilter) {
  // Filter products array
  let rows = (catFilter && catFilter !== 'All')
    ? PRODUCTS.filter(p => p.c === catFilter)
    : PRODUCTS;

  const maxProfit = 25199;  // used to scale the progress bar widths

  document.getElementById('ptb').innerHTML = rows.map((p, i) => {
    const cc  = p.c === 'Technology' ? 'tag-t' : p.c === 'Furniture' ? 'tag-f' : 'tag-o';
    const neg = p.p < 0;
    const pct = Math.abs(p.p) / maxProfit * 100;

    return `<tr>
      <td class="rnk">${String(i + 1).padStart(2, '0')}</td>
      <td style="max-width:190px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.n}</td>
      <td><span class="tag-cat ${cc}">${p.c}</span></td>
      <td style="font-family:'DM Mono',monospace;font-size:12px">$${p.s.toLocaleString()}</td>
      <td>
        <div class="pb">
          <div class="pbt">
            <div class="pbf" style="width:${pct}%;background:${neg ? '#ff6b6b' : '#00e5a0'}"></div>
          </div>
          <span style="font-family:'DM Mono',monospace;font-size:11px;
                       color:${neg ? '#ff6b6b' : '#00e5a0'};min-width:56px;text-align:right">
            ${neg ? '-' : ''}$${Math.abs(p.p).toLocaleString()}
          </span>
        </div>
      </td>
      <td style="font-family:'DM Mono',monospace;font-size:11px;
                 color:${p.m < 0 ? '#ff6b6b' : '#9090a8'}">${p.m}%</td>
    </tr>`;
  }).join('');
}

/* ─────────────────────────────────────────────────────────────
   HELPER: setKPI(key)
   Updates the 4 KPI card values from D[key].kpi or REGION_KPI
───────────────────────────────────────────────────────────── */
function setKPI(key) {
  const kpi = (D[key] || D.All).kpi;
  document.getElementById('k1').textContent = kpi.s;
  document.getElementById('k2').textContent = kpi.p;
  document.getElementById('k3').textContent = kpi.o;
  document.getElementById('k4').textContent = kpi.m;
}

/* ─────────────────────────────────────────────────────────────
   HELPER: setInsight(key)
   Puts the matching insight message into the insight strip
───────────────────────────────────────────────────────────── */
function setInsight(key) {
  document.getElementById('ins').innerHTML = INSIGHTS[key] || INSIGHTS.All;
}