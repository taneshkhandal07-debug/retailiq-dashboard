# 🧠 CONCEPTS.md — Key Concepts Reference

Quick-reference guide for the web development concepts used in this project.

---

## CSS Concepts

### CSS Variables (Custom Properties)
```css
:root { --my-color: #ff0000; }          /* define */
p { color: var(--my-color); }           /* use */
```
Variables defined in `:root` are available everywhere on the page.

### CSS Grid
```css
.container { display: grid; }

/* 3 equal columns */
grid-template-columns: 1fr 1fr 1fr;

/* 2 unequal columns (left = twice as wide) */
grid-template-columns: 2fr 1fr;

/* Gap between grid items */
gap: 16px;
```

### CSS Pseudo-elements
```css
/* ::before adds a fake element BEFORE the element's content */
.card::before {
  content: '';           /* required — even if empty */
  display: block;
  background: red;
}

/* ::after adds one AFTER */
.card::after { content: '→'; }
```

### CSS Animations
```css
/* Define the animation */
@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Apply it */
.element {
  animation: slideIn 0.4s ease forwards;
  /*         name    duration easing fill-mode */
}

/* fill-mode: forwards = stay at the final keyframe state */
```

### nth-child Selector
```css
/* Target specific children */
.card:nth-child(1) { color: red; }    /* first child */
.card:nth-child(2) { color: blue; }   /* second child */
.card:nth-child(odd)  { background: #eee; }
.card:nth-child(even) { background: #fff; }
```

### Media Queries (Responsive Design)
```css
/* Apply styles only when screen is 768px or narrower */
@media (max-width: 768px) {
  .grid { grid-template-columns: 1fr; }  /* single column */
}
```

### Sticky Positioning
```css
.header {
  position: sticky;
  top: 0;              /* sticks when it reaches the top */
  z-index: 100;        /* sits above other content */
}
```

---

## JavaScript Concepts

### Template Literals
```javascript
// Old way (messy):
const html = '<tr><td>' + name + '</td><td>$' + price + '</td></tr>';

// Template literal (clean):
const html = `<tr><td>${name}</td><td>$${price}</td></tr>`;
// Backticks ` allow multiline strings and ${} for variables
```

### Array Methods
```javascript
const numbers = [5, -3, 8, -1, 4];

// filter: keep only items matching condition
const positives = numbers.filter(n => n > 0);     // [5, 8, 4]

// map: transform every item
const doubled = numbers.map(n => n * 2);          // [10,-6,16,-2,8]

// forEach: run code for every item (no return value)
numbers.forEach(n => console.log(n));

// find: get first match
const first = numbers.find(n => n < 0);           // -3
```

### classList Methods
```javascript
const el = document.getElementById('btn');

el.classList.add('active');              // add a class
el.classList.remove('active');           // remove a class
el.classList.toggle('active');           // add if absent, remove if present
el.classList.toggle('active', true);     // force-add
el.classList.toggle('active', false);    // force-remove
el.classList.contains('active');         // returns true/false
```

### querySelectorAll + forEach
```javascript
// Select ALL elements matching a CSS selector
document.querySelectorAll('.btn').forEach(btn => {
  btn.classList.remove('active');  // do something to each
});
```

### Spread Operator
```javascript
const defaults = { color: 'red', size: 12 };
const custom   = { size: 16, weight: 'bold' };

// Merge objects (custom overwrites defaults where they overlap)
const result = { ...defaults, ...custom };
// { color: 'red', size: 16, weight: 'bold' }
```
Used in charts.js as `{ responsive: true, ...opts }` to merge chart options.

### Default Parameters
```javascript
function greet(name = 'World') {
  console.log(`Hello, ${name}!`);
}

greet('Alice');   // Hello, Alice!
greet();          // Hello, World!  ← uses default
```

### Short-Circuit Evaluation
```javascript
// If left side is falsy, use right side
const data = D[key] || D.All;
// → If D[key] doesn't exist (undefined = falsy), use D.All

// Conditional class
const cls = isNegative ? 'red' : 'green';
```

---

## Chart.js Concepts

### Basic Structure
```javascript
new Chart(canvasElement.getContext('2d'), {
  type: 'bar',          // chart type
  data: {
    labels: [],         // X-axis labels
    datasets: [{ data: [], backgroundColor: '' }]
  },
  options: {
    responsive: true,   // auto-resize
    plugins: {},        // tooltip, legend settings
    scales: {}          // axis settings
  }
});
```

### Chart Types
| type | Chart |
|---|---|
| `'line'` | Line chart |
| `'bar'` | Vertical bar |
| `'bar'` + `indexAxis: 'y'` | Horizontal bar |
| `'pie'` | Full pie |
| `'doughnut'` | Ring chart |

### Tooltip Customization
```javascript
plugins: {
  tooltip: {
    callbacks: {
      // Change what the tooltip label says
      label: (context) => ` Sales: $${context.raw}K`
    }
  }
}
```

### Axis Formatting
```javascript
scales: {
  y: {
    ticks: {
      // Add $ prefix and K suffix to axis labels
      callback: (value) => '$' + value + 'K'
    }
  }
}
```

### Destroying and Recreating Charts
```javascript
if (existingChart) {
  existingChart.destroy();  // MUST destroy before creating new one on same canvas
}
const newChart = new Chart(ctx, { ... });
```

---

## Git & GitHub Concepts

### Basic Git Workflow
```bash
git init                          # start tracking a folder
git add .                         # stage all changed files
git commit -m "Add dashboard"     # save a snapshot with a message
git push origin main              # upload to GitHub
```

### Useful Commands
```bash
git status           # see what files have changed
git log --oneline    # see commit history (short)
git diff             # see what changed in files
git checkout -b new-feature   # create and switch to a new branch
```

### Good Commit Message Examples
```
✅ "Add region filter to dashboard"
✅ "Fix KPI cards not updating on mobile"
✅ "Add Technology category chart data"

❌ "fix stuff"
❌ "update"
❌ "changes"
```

### GitHub Pages (Free Hosting)
1. Push code to GitHub repo
2. Go to repo Settings → Pages
3. Source: main branch, / (root) folder
4. Site live at `https://yourusername.github.io/repo-name`

---

## Data Analytics Concepts

### KPIs (Key Performance Indicators)
Metrics that measure how a business is performing.
- **Total Sales** — overall revenue
- **Profit Margin** = (Profit ÷ Sales) × 100 — efficiency
- **Order Volume** — how many transactions

### Aggregation
Summarizing many rows into one number:
- `SUM(Sales)` → total sales
- `AVG(Margin)` → average margin
- `COUNT(Orders)` → number of orders
- `MAX(Profit)` → best single day

### Why Charts Beat Tables
| Situation | Use |
|---|---|
| Spot a trend over time | Line chart |
| Compare 3-5 categories | Bar chart |
| See what fraction each part is | Pie chart |
| Find outliers quickly | Scatter plot |
| Show exact values with precision | Table |
| Give an at-a-glance headline number | KPI card |

---

*Tip: The best way to understand any concept is to change one thing in the code and see what breaks.*