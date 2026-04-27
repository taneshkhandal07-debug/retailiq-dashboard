# 📊 RetailIQ — Retail Sales & Profit Dashboard

A fully interactive retail analytics dashboard built with **vanilla HTML, CSS, and JavaScript** using the Superstore dataset. No frameworks, no build tools — just open `index.html` in a browser.

![Dashboard Preview](assets/screenshots/preview.png)

---

## 🚀 Live Demo

> Open `index.html` in any modern browser. No server needed.

Or view it on GitHub Pages:
`https://taneshkhandal07-debug.github.io/retailiq-dashboard`

---

## 📁 Project Structure

```
retailiq-dashboard/
│
├── index.html          ← Main HTML file (layout & markup)
│
├── src/
│   ├── style.css       ← All CSS styles & design tokens
│   ├── data.js         ← Dataset values & insight messages
│   ├── charts.js       ← Chart.js configuration & rendering
│   └── filters.js      ← Filter button logic & state
│
├── docs/
│   ├── LEARN.md        ← Step-by-step guide (how it was built)
│   └── CONCEPTS.md     ← Key web dev concepts explained
│
├── assets/
│   └── screenshots/    ← Dashboard preview images
│
└── README.md           ← This file
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 📈 Sales Trend | Dual-axis line chart — monthly sales & profit |
| 🍩 Region Donut | Geographic split with region stat cards |
| 📊 Category Bar | Grouped bar — sales vs profit per category |
| 🥧 Segment Pie | Customer segment share with progress bars |
| ↔ Sub-Category | Horizontal bar — top & loss-making sub-categories |
| 🏆 Products Table | Ranked table with inline profit bars |
| 📅 Quarterly | Year-over-year grouped bar comparison |
| 🔍 Filters | Year / Category / Region filter buttons |
| 💡 Insights | Dynamic insight strip that updates with filters |

---

## 🧰 Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| HTML5 | — | Structure & layout |
| CSS3 | — | Styling, animations, grid |
| JavaScript (ES6) | — | Interactivity & logic |
| [Chart.js](https://www.chartjs.org/) | 4.4.1 | All chart rendering |
| [Google Fonts](https://fonts.google.com/) | — | Syne, DM Sans, DM Mono |

---

## 📦 Dataset

**Kaggle Superstore Dataset**
- Source: [https://www.kaggle.com/datasets/vivek468/superstore-dataset-final](https://www.kaggle.com/datasets/vivek468/superstore-dataset-final)
- Period: 2014–2017
- Records: 9,994 orders
- Fields used: Order Date, Sales, Profit, Category, Region, Customer Segment

---

## 🔧 How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/retailiq-dashboard.git

# 2. Navigate to the folder
cd retailiq-dashboard

# 3. Open in browser (double-click or use a local server)
open index.html

# Or use VS Code Live Server extension for hot reload
```

---

## 📖 How to Learn From This Project

Read **[docs/LEARN.md](docs/LEARN.md)** — a complete step-by-step guide covering:

1. How the folder structure is organised
2. CSS variables and design tokens
3. CSS Grid for dashboard layouts
4. Chart.js — creating each chart type
5. Filter logic and state management
6. The data layer — how data flows to charts

---

## 🎨 Customisation

### Change the color scheme
Edit the `:root` variables at the top of `src/style.css`:
```css
:root {
  --accent:  #00e5a0;   /* change to any color */
  --accent2: #7c6bff;
  --bg:      #0a0a0f;   /* change for light mode */
}
```

### Add your own data
Edit `src/data.js` — replace the values in `D.All.trend.s` (sales) and `.p` (profit) arrays with your own numbers.

### Add a new chart
1. Add a `<canvas id="myChart">` in `index.html`
2. Write a `buildMyChart(d)` function in `src/charts.js`
3. Call it inside `buildAll()`

---

## 📊 Key Insights from the Data

- **Technology** is the most profitable category ($145K profit, 17.5% margin)
- **Furniture** barely breaks even — Tables sub-category loses $17.7K
- **West region** leads in sales (31.6% of total)
- **Consumer segment** drives 50.6% of all orders
- **Q4** consistently outperforms other quarters

---

## 🙋 About This Project

Built as a **Data Analytics portfolio project** demonstrating:
- Real-world data visualization skills
- Clean, maintainable code structure
- Responsive UI/UX design
- Interactive dashboard development

---

## 📝 License

MIT License — free to use, modify, and share.

---

*Made with ❤️ as a learning project*
