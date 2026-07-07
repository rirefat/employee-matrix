# Employee Matrix 📊

Employee Matrix is a professional, high-performance web portal for managers to log, track, and analyze employee metrics. Built with a full-stack architecture (React/Vite with Tailwind CSS + Express.js backend + MongoDB persistence) and integrated with Gemini AI, Employee Matrix turns raw workplace data into actionable, monthly talent development roadmaps and team trend visualizations.

---

## 🚀 Core Features

### 1. Roster Database & Corporate Records
* **Profile Synchronization**: Maintains employee cards securely with active tracking states.
* **Employee Directory**: Easy searching and filtering of direct reports, roles, and security IDs.
* **Interactive Profiles**: Switch between employees seamlessly from the Left Navigation panel.

### 2. Precise Monthly-Wise Attendance Tracker
* **Exact Day Logging**: Record the exact number of:
  * **Working Days** in the target month (e.g., 22 days)
  * **Days Present (Attended)**
  * **Days Absent**
  * **Approved Leaves / Other Days**
* **Average Attendance Calculation**: Calculates the exact average attendance percentage dynamically (`(Present Days / Working Days) * 100`).
* **Instant Discrepancy Warnings**: Warns the manager if the sum of present, absent, and leave days does not match the month's total working days, ensuring zero data inaccuracies.

### 3. Month-over-Month Individual Progress Trends
* **Dynamic Line Charts**: Track how an employee's attendance and shipped project values fluctuate over time.
* **Custom Metric Tooltips**: Highly responsive, styling-matched charts using **recharts** to gauge career progression metrics.

### 4. AI-Powered Monthly Development Center
* **One-Click Synthesis**: Connects directly to the server-side Gemini AI model using the modern `@google/genai` SDK to evaluate monthly performance.
* **Smart Context Injection**: Injects detailed metrics (exact attendance counts, conducted meetings, projects delivered, and estimated project values) to build highly personalized evaluations.
* **Data-driven Sections**:
  * **Executive Summary**: Generous, high-level evaluation of the target month.
  * **Core Strengths**: Highlights key performance milestones.
  * **Areas of Growth**: Pinpoints training or developmental opportunities.
  * **Recommended Pathing**: Actionable goals tailored to the department focus (Engineering, Sales, CS, etc.).

### 5. Interactive Team Trend Dashboard
* **Aggregation Engines**: Group metrics and analyze top departments or top performers instantly.
* **Aggregated Charts**: Interactive, visually aligned graphs highlighting corporate sync counts, attendance averages, and overall delivered pipeline values.

---

## 🛠️ Project Architecture

```
├── server/
│   ├── db.ts          # MongoDB/Mongoose connector & schemas
│   └── gemini.ts      # Server-side Gemini API client (safe API key proxy)
├── src/
│   ├── components/
│   │   ├── DBStatusBanner.tsx   # DB connectivity & live updates state indicator
│   │   ├── DashboardTab.tsx     # Team-wide trends & metrics charts
│   │   └── ReportViewer.tsx     # Printable AI roadmap markdown renderer
│   ├── App.tsx        # Responsive desktop-first multi-tab workspace
│   ├── index.css      # Core Inter/JetBrains typography setup & Tailwind layout styles
│   └── types.ts       # Shared TypeScript model definitions
├── server.ts          # Express production server & development Vite middleware
└── metadata.json      # Platform application manifest
```

---

## 🏁 Getting Started

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **MongoDB connection string** (falls back to clean memory adapter automatically)
* **Gemini API Key** (configured securely on server-side)

### Installation
1. Install base dependencies:
   ```bash
   npm install
   ```

2. Run the application in development mode:
   ```bash
   npm run dev
   ```
   The portal will be served locally at `http://localhost:3000`.

3. Build the application for production:
   ```bash
   npm run build
   ```
   This generates compiled client-side assets in `dist/` and bundles the Express server using `esbuild` into a CJS-safe `dist/server.cjs` file to bypass relative import checks.

4. Start the production server:
   ```bash
   npm run start
   ```

---

## 🎨 Visual Identity & Styling
Employee Matrix features a Swiss/Modern responsive grid utilizing:
* **Inter** typography for sleek user interfaces and **JetBrains Mono** for numerical values and system codes.
* Highly contrasting background panels, custom card states, active glowing rings, and clear validation banners to ensure an executive aesthetic.
* Staggered hover animations and layout fades using `motion` for polished view state transitions.
