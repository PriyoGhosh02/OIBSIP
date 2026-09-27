# 📝 To-Do Web Application — Organize Your Day with Ease

<div align="center">

  <h1>📝 Plan • Track • Accomplish ✨</h1>

  <p><strong>A modern, clean, and responsive To-Do Web Application built with pure HTML5, CSS3, and Vanilla JavaScript with LocalStorage persistence.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
    <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="Vanilla JavaScript" />
    <img src="https://img.shields.io/badge/Storage-localStorage-2563EB?style=for-the-badge" alt="LocalStorage" />
    <img src="https://img.shields.io/badge/Responsive-Design-16A34A?style=for-the-badge" alt="Responsive Design" />
  </p>

</div>

---

## 📌 Developer Information

- **Developer:** Priyo Ghosh ([@PriyoGhosh02](https://github.com/PriyoGhosh02))
- **Role:** Web Developer & Frontend Engineer
- **Internship:** Oasis Infobyte (OIBSIP) Web Development and Designing Internship
- **Task:** Level 2 — Task 3 (To-Do Web App)

---

## 🎯 1. Objective

The primary objective of this project is to build an intuitive, distraction-free, and fully functional **To-Do Web Application** as part of **Task 3 (Level 2)** of the **Oasis Infobyte (OIBSIP)** Web Development and Designing Internship.

Key technical and pedagogical goals include:
- Demonstrating fundamental **DOM manipulation**, dynamic element generation, and **event listener management** in Vanilla JavaScript without any external frameworks or runtime libraries.
- Implementing comprehensive **CRUD operations** (Create, Read, Update, Delete) with a dual-list workflow separating **Pending Tasks** and **Completed Tasks**.
- Providing seamless **inline task editing** directly within the task cards with instantaneous validation and state synchronization.
- Recording and formatting **accurate timestamps** (`Added:` and `Completed:`) using JavaScript's native `Date` API.
- Integrating browser **`localStorage` persistence** to ensure user tasks, statuses, and timestamps survive page reloads and browser restarts.
- Designing a polished, accessible, and responsive interface matching modern UI/UX design standards.

---

## 💡 2. Motivation & Design Philosophy

Task and time management applications are a cornerstone benchmark in modern frontend engineering. While many tutorials build basic checklist widgets, they often overlook vital real-world UX principles such as clear visual hierarchy, error validation, inline editing, and empty state guidance.

This application was engineered around the following core design principles:
1. **Clarity Over Complexity**: A clean, single-page dual-column layout dividing active obligations from accomplished achievements without distracting modal dialogues or multiple pages.
2. **Instant Visual Feedback**: Real-time counters, interactive hover states, micro-animations, and distinct styling between pending cards (clean white) and completed cards (soft green checkmark styling).
3. **Resilient Data State**: Centralized JavaScript state array with automated JSON serialization into browser `localStorage`, protected by error fallbacks.

---

## 🛠️ 3. Tools & Technologies Used

- **Markup & Structure:** Semantic **HTML5** (`<header>`, `<main>`, `<section>`, `<form>`, `<label>`, `<input>`, `<button>`, `<ul>`, `<li>`, `<footer>`, ARIA live regions).
- **Styling & Visual Design:** Modern **CSS3** (CSS Custom Properties / Variables, CSS Grid, Flexbox, radial background patterns, responsive typography, soft elevation shadows).
- **Typography:** **Google Fonts Inter** (`400`, `500`, `600`, `700`, `800`) for crisp readability across all display resolutions.
- **Client Logic & State:** Pure **Vanilla JavaScript (ES6+)** (IIFE closure, state management, event delegation, DOM nodes, Date formatting, LocalStorage API).
- **Icons & Graphics:** Lightweight inline SVG vector icons for zero network latency and pixel-sharp scaling.

---

## 📋 4. Architecture & Data Structure

Every task is represented as a lightweight, serializable JavaScript object:

```javascript
{
  id: "task-k3x8a1b2c",              // Unique alphanumeric identifier
  text: "Complete internship assignment", // Task description string
  completed: false,                  // Boolean completion flag
  createdAt: "2026-09-27T10:30:00.000Z", // ISO 8601 creation timestamp
  completedAt: null                  // ISO 8601 completion timestamp (or null)
}
```

When a task is marked complete:
```javascript
{
  id: "task-k3x8a1b2c",
  text: "Complete internship assignment",
  completed: true,
  createdAt: "2026-09-27T10:30:00.000Z",
  completedAt: "2026-09-27T11:45:00.000Z"
}
```

---

## ✨ 5. Key Features Breakdown

### 1. ➕ Task Creation & Empty Input Validation
- Accepts task descriptions up to 150 characters.
- Supports both **clicking "+ Add Task"** and pressing the **Enter** key.
- Strict input validation: Rejects blank inputs or strings consisting only of whitespace (`"   "`).
- Displays a friendly inline warning message (*"Please enter a task."*) accompanied by a subtle red border shake animation.

### 2. ⏳ Pending Tasks Management
- Lists all active tasks with an empty checkbox circle, task text, and creation timestamp.
- **`[✓ Complete]` button / Checkbox toggle**: Immediately moves the task to the Completed list, calculates `completedAt`, and updates counters.
- **`[✏ Edit]` button**: Triggers inline editing.
- **`[🗑 Delete]` button**: Permanently removes the task.

### 3. ✏️ Inline Task Editing
- Clicking **Edit** transforms the card content directly into an input field pre-filled with the current task text.
- Provides **`[Save]`** and **`[Cancel]`** buttons.
- Keyboard support: **Enter** saves changes; **Escape** cancels.
- Empty edit validation: Prevents blank updates with an inline error message (*"Task cannot be empty."*).
- Preserves the original `createdAt` timestamp upon saving.

### 4. ✅ Completed Tasks Section
- Completed tasks display with a filled green checkmark badge, strikethrough text styling, and dual timestamps (`Added:` and `Completed:`).
- Includes **`[🗑 Delete]`** button to clear finished tasks individually.
- Clicking the green checkmark badge allows users to reopen/uncomplete a task if marked by mistake.

### 5. 📊 Real-Time Dynamic Task Counters
- Dual pill badges displaying `X pending` (blue) and `X completed` (green).
- Recalculated dynamically on every add, edit, complete, or delete operation without page reloads.

### 6. 📅 Date & Timestamp Formatting
- Formats ISO dates into human-readable timestamps: `MMM DD, YYYY • hh:mm A` (e.g., `Sep 27, 2026 • 10:30 AM`).

### 7. 💾 Browser `localStorage` Persistence
- All tasks are serialized under the storage key `todoTasks`.
- Automatically reloaded and reconstructed when the page is reopened or refreshed.
- Fallback support: If localStorage is unavailable, the application continues to run in memory without breaking.

### 8. 🎈 Empty States & Motivational Cards
- When pending tasks reach zero: Displays `🎉 No pending tasks. You're all caught up!`.
- When completed tasks reach zero: Displays `📋 No completed tasks yet. Finish a task to see it here.`.
- Contextual motivational widgets: *"You've got this!"* on pending tasks, and *"Great job! You've completed all available tasks"* celebration box.

---

## 🔄 6. Application Workflow

```text
User enters task description
            ↓
Clicks "Add Task" or presses [Enter]
            ↓
    [Input Validation]
     ├── Empty / Spaces? ──→ Displays "Please enter a task." (Shake animation)
     └── Valid text?
            ↓
    New Task Object Created
    (id, text, completed: false, createdAt)
            ↓
    Prepend to Pending Tasks List
    Save to localStorage & Update Counters
            ↓
┌─────────────────────── User Actions ───────────────────────┐
│                                                            │
│   [Mark Complete]            [Edit]           [Delete]    │
│          ↓                     ↓                 ↓         │
│  Set completed = true    Inline Form      Remove task      │
│  Record completedAt       Save / Cancel    from array      │
│  Move to Completed List   Update Text     Update storage   │
│  Update Counters         Update storage   Update Counters  │
└────────────────────────────────────────────────────────────┘
```

---

## 📁 7. File Structure

```text
WebDev-L2-To-Do_Web_App/
│
├── index.html     # Semantic HTML5 layout, ARIA attributes & SVG icons
├── style.css      # Custom styling, Inter typography, cards & responsive media queries
├── script.js      # Vanilla JavaScript state, DOM CRUD methods & LocalStorage persistence
└── README.md      # Comprehensive technical documentation
```

---

## 💻 8. How to Run Locally

1. Clone or download the repository:
   ```bash
   git clone https://github.com/PriyoGhosh02/OIBSIP.git
   ```
2. Navigate to the project directory:
   ```bash
   cd OIBSIP/WebDev-L2-To-Do_Web_App
   ```
3. Open `index.html` in any modern web browser:
   - Double click `index.html` directly from your file explorer.
   - Or run a local development server:
     ```bash
     # Using Python 3
     python -m http.server 5500
     ```
   - Open [http://localhost:5500](http://localhost:5500) in your browser.

---

## 📱 9. Responsive Layout Breakpoints

| Viewport Width | Layout Presentation |
| :--- | :--- |
| **Desktop (> 900px)** | 2 side-by-side columns (Pending Tasks on left, Completed Tasks on right) |
| **Tablet (641px – 900px)** | Single-column stacked layout with full-width cards |
| **Mobile (≤ 640px)** | Compact stacked input and actions, touch-friendly tap targets |

---

<div align="center">
  <sub>Built with ❤️ by <strong>Priyo Ghosh</strong> for the <strong>Oasis Infobyte (OIBSIP) Internship</strong> &bull; Level 2 Task 3</sub>
</div>
