# 🌟 API Integration Hub

API Integration Hub is a stunning, high-fidelity single-page web dashboard featuring three keyless, high-utility integrations. Built with modern, glassmorphic aesthetics, fluid micro-animations, robust error-handling, and responsive grids using standard web technology (HTML5, Vanilla CSS3, and modern Vanilla ES6 JavaScript).

---

## 🔗 Live Demo

Access the live web application on GitHub Pages here:
👉 **[https://prajwalchaple.github.io/synent-task6-APIintegrationProject-Prajwal/](https://prajwalchaple.github.io/synent-task6-APIintegrationProject-Prajwal/)**

---

## 🚀 Key Features

### 1. 🔍 GitHub User Explorer
- Search for any active GitHub user.
- **Detailed Metrics**: Dynamic rendering of avatar, bio, location, followers, following, and public repositories count.
- **Top Repositories**: Grid list of recent/top active repositories, complete with primary programming language badges, star counts, fork counts, and direct repository links.
- **Sleek UX**: Custom-designed pulse skeleton loading screens that preview structure while data is being fetched.
- **Error resilience**: Beautiful error feedback states for network timeouts, rate limit hits, or non-existent usernames.

### 2. 🌤️ Weather Station (Keyless Open-Meteo API)
- **Keyless Architecture**: Integrates the robust, open-source **Open-Meteo Geocoding & Weather Forecast API**—no API tokens required.
- **Dynamic Search**: Instant coordinate resolution for any city worldwide, plus pre-configured standard global cities (Mumbai, New York, London, Tokyo, Paris).
- **Current Stats**: Showcases exact temperatures, real-time wind speed, humidity indexes, and mapped custom-styled weather descriptions.
- **5-Day Forecast Grid**: Modern forecasts with custom SVG graphics depicting sunny, stormy, cloudy, rainy, or snowy intervals.

### 3. 💬 Inspirational Quote Generator
- **Daily Inspiration**: Fetches dynamic random quotes and authors from a public endpoint.
- **Utility Tools**:
  - **Copy to Clipboard**: Quick-copy icon button with floating "Copied!" notification feedback.
  - **Social Sharing**: One-click sharing options (e.g. sharing on Twitter/X).
- **Resilient Fallback**: Integrated static collection fallback that guarantees elegant content delivery even when completely offline.

---

## 🎨 Design System & Aesthetics
- **Theme-Engine**: Native system-aware Light/Dark toggler with active state preservation in browser `localStorage`.
- **Modern Colorways**: Deep slate-blue dark themes matched with vibrant teal, sapphire, and amber HSL gradients.
- **Glassmorphism**: Elegant translucent navigation headers and cards utilizing native CSS `backdrop-filter: blur(12px)`.
- **Aesthetic Typography**: Styled fully around the premium `Inter` sans-serif variable font weights.
- **Micro-Animations**: Fluid CSS transitions on form elements, state switches, interactive buttons, and loader skeletons.

---

## 🛠️ Technology Stack
- **Structure**: Semantic HTML5 layout.
- **Styling**: Vanilla CSS3 custom variables, grid templates, Flexbox, custom scrolls, keyframe animations.
- **Logic**: Vanilla ECMAScript 6, modern `async/await` Fetch API, granular error try/catch structures.

---

## 📂 Project Structure

```
├── .gitignore         # OS and IDE configuration ignores
├── README.md          # Technical documentation
├── index.html         # SPA Structure & static views
├── style.css          # Design tokens, variables, responsive styling
├── app.js             # Main control manager (Tabs, Theme, Toasts)
├── quotes.js          # Quote API Fetch & Renders
├── weather.js         # Weather API / Geocoding Fetch & SVG Renders
└── github.js          # GitHub Search & Profile/Repo Grid Renders
```

---

## ⚙️ How to Run Locally

Since this dashboard uses native ES6 JavaScript modules for component styling, you need a local development server to run it due to browser CORS security rules around `file://` protocols.

1. **Option A: Python (Built-in)**
   If you have Python installed, run this command in the project directory:
   ```bash
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your web browser.

2. **Option B: Node.js / npm (http-server)**
   If you use Node, start a static server instantly:
   ```bash
   npx http-server ./ -p 8000
   ```
   Then open `http://localhost:8000` in your web browser.

3. **Option C: VS Code extension**
   Install the "Live Server" extension, open the directory, and click the "Go Live" status bar button.
