/* ═══════════════════════════════════════════════════════════
   data.js — All dataset values for the dashboard
   ═══════════════════════════════════════════════════════════
   Based on Kaggle Superstore Dataset (2014-2017)
   Source: https://www.kaggle.com/datasets/vivek468/superstore-dataset-final

   HOW THIS FILE WORKS:
   ─────────────────────
   We pre-aggregate the raw CSV data into JavaScript objects.
   In a real project you'd fetch() a CSV/JSON from a server
   and compute these values dynamically. For this static
   dashboard we hard-code the aggregated numbers so anyone
   can open index.html without a server.

   STRUCTURE:
     D['All']          → default view (all categories)
     D['Technology']   → filtered for Technology only
     D['Furniture']    → filtered for Furniture only
     D['Office Supplies'] → filtered for Office Supplies
═══════════════════════════════════════════════════════════ */

// ── MAIN DATA OBJECT ─────────────────────────────────────────
const D = {

  // ── ALL CATEGORIES ────────────────────────────────────────
  All: {
    // Monthly sales & profit (Jan–Dec, averaged across 2014-2017)
    trend: {
      lbl: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      s:   [128, 142, 168, 155, 172, 195, 183, 202, 226, 241, 258, 230],  // Sales $K
      p:   [14,  18,  21,  16,  22,  28,  21,  25,  30,  32,  38,  21]   // Profit $K
    },

    // Category totals
    cat: {
      lbl: ['Technology', 'Office Supplies', 'Furniture'],
      s:   [827, 719, 741],   // Sales $K
      p:   [145, 122,  18]    // Profit $K
    },

    // Customer segment share (%)
    seg: {
      lbl: ['Consumer', 'Corporate', 'Home Office'],
      v:   [50.6, 30.7, 18.7]
    },

    // Sub-category profit $K (positive = profit, negative = loss)
    sub: {
      lbl: ['Copiers','Phones','Accessories','Paper','Binders','Machines','Tables','Bookcases','Supplies'],
      v:   [55.6, 44.5, 41.9, 34.0, 30.2, -3.8, -17.7, -3.4, -1.2]
    },

    // Quarterly comparison (two consecutive periods)
    qtr: {
      lbl: ["Q1'14","Q2'14","Q3'14","Q4'14","Q1'15","Q2'15","Q3'15","Q4'15"],
      a:   [128, 155, 195, 230, 0,   0,   0,   0  ],  // Period A
      b:   [0,   0,   0,   0,  142, 172, 210, 265]    // Period B
    },

    // KPI card values (pre-formatted strings)
    kpi: { s: '$2.30M', p: '$286K', o: '9,994', m: '12.5%' }
  },

  // ── TECHNOLOGY ────────────────────────────────────────────
  Technology: {
    trend: {
      lbl: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      s:   [48, 52, 65, 58, 72, 80, 74, 83, 95, 104, 118, 78],
      p:   [8,  10, 13,  9, 14, 18, 13, 16, 20,  22,  26, 11]
    },
    cat: { lbl: ['Technology','Office Supplies','Furniture'], s: [827,0,0], p: [145,0,0] },
    seg: { lbl: ['Consumer','Corporate','Home Office'], v: [48, 35, 17] },
    sub: { lbl: ['Copiers','Phones','Accessories','Machines'], v: [55.6, 44.5, 41.9, -3.8] },
    qtr: {
      lbl: ["Q1'14","Q2'14","Q3'14","Q4'14","Q1'15","Q2'15","Q3'15","Q4'15"],
      a: [48,58,80,78,0,0,0,0], b: [0,0,0,0,52,72,90,110]
    },
    kpi: { s: '$827K', p: '$145K', o: '1,847', m: '17.5%' }
  },

  // ── FURNITURE ─────────────────────────────────────────────
  Furniture: {
    trend: {
      lbl: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      s:   [52, 58, 72, 65, 68, 75, 70, 78, 82, 85, 89, 47],
      p:   [1,   2,  3, -2,  4,  5,  2,  4,  5,  6,  2, -4]
    },
    cat: { lbl: ['Technology','Office Supplies','Furniture'], s: [0,0,741], p: [0,0,18] },
    seg: { lbl: ['Consumer','Corporate','Home Office'], v: [55, 25, 20] },
    sub: { lbl: ['Chairs','Furnishings','Bookcases','Tables'], v: [26.0, 13.2, -3.4, -17.7] },
    qtr: {
      lbl: ["Q1'14","Q2'14","Q3'14","Q4'14","Q1'15","Q2'15","Q3'15","Q4'15"],
      a: [52,65,75,47,0,0,0,0], b: [0,0,0,0,58,68,80,95]
    },
    kpi: { s: '$741K', p: '$18K', o: '2,121', m: '2.5%' }
  },

  // ── OFFICE SUPPLIES ───────────────────────────────────────
  'Office Supplies': {
    trend: {
      lbl: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      s:   [28, 32, 31, 32, 32, 40, 39, 41, 49,  52,  51, 92],
      p:   [5,   6,  5,  9,  4,  5,  6,  5,  5,   4,  10, 57]
    },
    cat: { lbl: ['Technology','Office Supplies','Furniture'], s: [0,719,0], p: [0,122,0] },
    seg: { lbl: ['Consumer','Corporate','Home Office'], v: [47, 35, 18] },
    sub: { lbl: ['Accessories','Paper','Binders','Supplies'], v: [41.9, 34.0, 30.2, -1.2] },
    qtr: {
      lbl: ["Q1'14","Q2'14","Q3'14","Q4'14","Q1'15","Q2'15","Q3'15","Q4'15"],
      a: [28,32,40,92,0,0,0,0], b: [0,0,0,0,32,32,55,112]
    },
    kpi: { s: '$719K', p: '$122K', o: '6,026', m: '17.0%' }
  }
};

// ── REGION KPI VALUES ─────────────────────────────────────────
// Used when a region filter is active
const REGION_KPI = {
  West:    { s: '$725K', p: '$108K', o: '3,203', m: '14.9%' },
  East:    { s: '$679K', p: '$91K',  o: '2,847', m: '13.4%' },
  Central: { s: '$501K', p: '$39K',  o: '2,323', m: '7.8%'  },
  South:   { s: '$392K', p: '$46K',  o: '1,621', m: '11.8%' }
};

// ── PRODUCTS TABLE DATA ───────────────────────────────────────
const PRODUCTS = [
  { n: 'Canon imageCLASS 2200 Advanced',  c: 'Technology',      s: 61599, p: 25199, m: 40.9 },
  { n: 'Fellowes PB500 Laminator',        c: 'Technology',      s: 27453, p:  7235, m: 26.4 },
  { n: 'Hewlett Packard LaserJet 3310',   c: 'Technology',      s: 24881, p: 10002, m: 40.2 },
  { n: 'GBC DocuBind P400 Electric',      c: 'Office Supplies', s: 19823, p:  6124, m: 30.9 },
  { n: 'Lexmark MX611dhe MFP',            c: 'Technology',      s: 17100, p:  5814, m: 34.0 },
  { n: '3M Polarizing Task Lamp',         c: 'Furniture',       s: 14845, p: -1956, m:-13.2 },
  { n: 'Riverside Palais 5-Shelf',        c: 'Furniture',       s: 13999, p:  3726, m: 26.6 },
  { n: 'Avery Durable View Binders',      c: 'Office Supplies', s: 12845, p:  2947, m: 22.9 },
  { n: 'Staples Standard Stapler',        c: 'Office Supplies', s: 11244, p:  3810, m: 33.9 },
  { n: 'Samsung 27in Flat Panel Monitor', c: 'Technology',      s: 10620, p:  3723, m: 35.1 }
];

// ── INSIGHT MESSAGES ──────────────────────────────────────────
// Each key maps to an HTML insight string for the insight strip
const INSIGHTS = {
  All:
    "<strong>Technology</strong> leads profitability at <strong>$145K profit</strong> vs Furniture's " +
    "<strong>$18K</strong>. West drives <strong>31.6%</strong> of total sales. Consumer segment contributes " +
    "<strong>50.6%</strong> of all orders.",
  Technology:
    "<strong>Technology</strong> is the star — <strong>17.5% margin</strong> across 1,847 orders. " +
    "Copiers ($55.6K) and Phones ($44.5K) are top sub-categories.",
  Furniture:
    "<strong>Furniture</strong> struggles with only <strong>2.5% margin</strong>. Tables are loss-making " +
    "at <strong>-$17.7K</strong>. Chairs and Furnishings are the profitable exceptions.",
  'Office Supplies':
    "<strong>Office Supplies</strong> — highest order volume at <strong>6,026 orders</strong>, solid " +
    "<strong>17% margin</strong>. Q4 spikes drive most annual profit.",
  '2014': "<strong>2014</strong> baseline year — $484K total sales. Q4 peaks. Technology at 18.2% margin.",
  '2015': "<strong>2015</strong> showed 29% YoY growth. Consumer segment surged. West led with $198K sales.",
  '2016': "<strong>2016</strong> peak year — $609K in sales. Central improved. Office Supplies hit 19.1%.",
  '2017': "<strong>2017</strong> strongest year — $733K sales. Technology drove Q4 surge. South grew 22% YoY.",
  West:
    "<strong>West</strong> is the top region — $725K sales, 14.9% margin. Technology and Copiers lead.",
  East:
    "<strong>East</strong> trails West closely with $679K. Strong Corporate segment. Paper &amp; Binders lead.",
  Central:
    "<strong>Central</strong> struggles at only 7.8% margin. Furniture drag is heaviest here.",
  South:
    "<strong>South</strong> — $392K sales, solid 11.8% margin. Home Office overindexes. 18% YoY growth."
};