# 🧮 Everyday Arithmetic Calculator Web Application

<div align="center">

  <h1>🧮 Simple • Fast • Accurate ✨</h1>

  <p><strong>A modern, clean, and responsive browser-based Arithmetic Calculator built with pure HTML5, CSS3 Grid, and Vanilla JavaScript.</strong></p>

  <p>
    <a href="https://reliable-dragon-48858c.netlify.app/" target="_blank">
      <img src="https://img.shields.io/badge/Live_Demo-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Live Demo on Netlify" />
    </a>
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
    <img src="https://img.shields.io/badge/CSS_Grid-005A9C?style=for-the-badge" alt="CSS Grid" />
    <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="Vanilla JavaScript" />
    <img src="https://img.shields.io/badge/Responsive-Design-2563EB?style=for-the-badge" alt="Responsive Design" />
  </p>

  <h3>
    🌐 <strong>Live Website:</strong> 
    <a href="https://reliable-dragon-48858c.netlify.app/" target="_blank">
      https://reliable-dragon-48858c.netlify.app/
    </a>
  </h3>

</div>

---

## 📌 Developer Information

- **Developer:** Priyo Ghosh ([@PriyoGhosh02](https://github.com/PriyoGhosh02))
- **Role:** Web Developer & Frontend Engineer
- **Internship:** Oasis Infobyte (OIBSIP) Web Development and Designing Internship
- **Task:** Level 2 — Task 1 (Arithmetic Calculator)
- **Live Deployment:** [https://reliable-dragon-48858c.netlify.app/](https://reliable-dragon-48858c.netlify.app/)

---

## 🎯 1. Objective

The primary objective of this project is to engineer an intuitive, robust, and visually appealing **Arithmetic Calculator** web application as part of **Task 1 (Level 2)** of the **Oasis Infobyte (OIBSIP)** Web Development and Designing Internship.

Key technical and design objectives include:
- Designing a centered, responsive card interface powered by **semantic HTML5**, modern **CSS3 Grid**, and pure **Vanilla JavaScript (ES6+)** without any third-party frameworks or libraries.
- Supporting fundamental arithmetic operations: **Addition (+)**, **Subtraction (−)**, **Multiplication (×)**, **Division (÷)**, and **Decimal Computations**.
- Implementing strict mathematical operator precedence (PEMDAS) through a custom tokenizer/evaluator while strictly prohibiting dangerous `eval()` execution.
- Preventing common calculation errors through real-time input sanitization, **division-by-zero protection**, **duplicate decimal suppression**, and **seamless operator chaining**.
- Delivering full accessibility with dual-line display feedback, ARIA attributes, tactile button states, and full **physical keyboard support**.

---

## 💡 2. Motivation

The digital calculator is a cornerstone utility in software engineering, demonstrating essential front-end competencies: state machines, event listener delegation, string manipulation, tokenization, arithmetic evaluation, and responsive design.

Most basic web calculators are either overly simplistic, prone to edge-case bugs (e.g., displaying `Infinity` or crashing on division by zero), or rely on unsafe shortcuts like JavaScript's native `eval()` function.

The core motivation behind building this calculator was to achieve:
1. **Security & Clean Code**: Build a manual arithmetic parsing engine without `eval()`, ensuring maximum security and execution predictability.
2. **Mathematical Rigor**: Enforce true operator precedence ($5 + 3 \times 2 = 11$, rather than naive sequential $16$), while supporting fluid operator chaining for subsequent calculations.
3. **Ergonomic & Modern Aesthetics**: Recreate a high-end physical calculator aesthetic using soft drop shadows, a high-contrast dark OLED-style display screen, clean typography via Google Font Inter, and tactile CSS Grid button arrangements.
4. **Universal Accessibility**: Support both touch/click navigation and seamless physical keyboard entry for power users.

---

## 🛠️ 3. Tools & Technologies Used

- **Markup & Structure:** Semantic **HTML5** (`<main>`, `<header>`, `<div>`, `<button>`, `<footer>`, SVG vector icons, ARIA live regions).
- **Styling & Layout:** Vanilla **CSS3** with **CSS Grid** (`repeat(4, 1fr)`), CSS Custom Properties (Variables), hover/active micro-interactions, and mobile media queries.
- **Typography:** **Google Fonts** (`Inter` — 400 Regular, 500 Medium, 600 Semi-Bold, 700 Bold, 800 Extra-Bold).
- **Logic & Event Handling:** **Vanilla JavaScript (ES6+)** with modular state architecture, event delegation, and input sanitization.
- **Deployment & Hosting:** **Netlify** for continuous automated deployment and live web hosting.
- **Development Tools:** Visual Studio Code, Git, GitHub, and Chrome DevTools.

---

## 📋 4. Process (Development Workflow)

The project was constructed following a structured, phased engineering methodology:

```text
User enters numeric values / operators
        ↓
Input Validation & State Sanitization
   ├── Number entry ─────────────► Append digit / reset after previous calculation
   ├── Decimal entry ────────────► Append '.' only if no decimal exists in current token
   ├── Operator entry ───────────► Push to expression token queue / replace previous operator
   └── Backspace (⌫) ────────────► Slice last character (or reset to 0 if single digit)
        ↓
User presses Equals (=) or Enter
        ↓
Custom Token Evaluation (Zero eval)
   ├── Pass 1: Multiplication (×) & Division (÷) [Left-to-Right]
   │     └── Division by Zero Check ──► Display "Cannot divide by zero"
   └── Pass 2: Addition (+) & Subtraction (−) [Left-to-Right]
        ↓
Floating-point formatting (rounds cleanly up to 10 decimals, strips trailing zeros)
        ↓
Update Display:
   ├── Expression Line ──────────► Shows historical formula (e.g., 5 + 3 × 2)
   └── Main Result Line ─────────► Shows evaluated answer (e.g., 11)
```

### Key Engineering Phases:

1. **Ergonomic Keypad Design (CSS Grid Architecture):**
   - Configured a 4-column CSS Grid with dedicated row and column spans:
     - The **`=` Button** occupies Column 4, spanning 2 vertical rows (`grid-row: span 2`).
     - The **`0` Button** occupies Row 5, spanning 2 horizontal columns (`grid-column: span 2`).
     - The **`C` Button** is styled with a prominent coral red accent (`#EF4444`) for immediate reset recognition.
     - The **Backspace (`⌫`) Button** features a custom SVG outline icon with an accessible `aria-label`.

2. **Custom Arithmetic Engine (No `eval()`):**
   - Built a safe, two-pass mathematical evaluator function `evaluateTokens(tokens)`:
     - **Pass 1:** Evaluates all high-precedence operators (`×` and `÷`). Automatically detects division by zero and interrupts evaluation gracefully.
     - **Pass 2:** Evaluates all low-precedence operators (`+` and `−`).
     - Safely converts results and eliminates floating-point imprecision using `Math.round((val + Number.EPSILON) * 1e10) / 1e10`.

3. **State Management & Chaining Logic:**
   - Supports continuous chained calculations: when an operator is pressed immediately after calculating a result, the result serves as the first operand of the new equation.
   - Allows operator replacement if the user changes their mind before entering the second operand.

4. **Event Delegation & Physical Keyboard Navigation:**
   - Keypad clicks are handled via efficient event delegation on the container.
   - Comprehensive `keydown` listener maps physical keyboard keys (`0-9`, `.`, `+`, `-`, `*`, `/`, `Enter`, `=`, `Backspace`, `Escape`) to their respective calculator actions.

5. **Production Deployment:**
   - Deployed on **Netlify** with SSL certification and global CDN caching.

---

## ⚙️ 5. Functional Information

### Key Features Matrix

| Feature | Description | Example Interaction |
| :--- | :--- | :--- |
| **Basic Arithmetic** | Flawless addition, subtraction, multiplication, and division | `10 ÷ 2 = 5` |
| **Decimal Precision** | Supports floating-point numbers with clean rounding | `5.5 + 2.5 = 8` |
| **Duplicate Decimal Prevention** | Restricts more than one decimal point per number operand | `5.5.5` &rarr; blocked to `5.5` |
| **Operator Precedence (PEMDAS)** | Multiplication & division execute before addition & subtraction | `5 + 3 × 2 = 11` |
| **Operator Chaining** | Continue calculations seamlessly without clearing memory | `5 + 3 = 8` &rarr; `× 2 = 16` |
| **Operator Replacement** | Changing operators midway overrides the pending operator | `5 +` then `×` &rarr; becomes `5 ×` |
| **Division by Zero Protection** | Catches divide-by-zero errors safely without crashing | `10 ÷ 0 = Cannot divide by zero` |
| **Backspace (`⌫`)** | Deletes the last entered character; resets to `0` when empty | `123` &rarr; `12` &rarr; `1` &rarr; `0` |
| **Master Clear (`C`)** | Completely resets all state variables and display to `0` | Instant reset to `0` |
| **Dual-Line Display** | Top line displays formula; bottom line displays active input/result | `5 + 3 × 2` / `11` |
| **Physical Keyboard Support** | Full keyboard support for digits, operators, Enter, and Escape | Enter calculations from keyboard |

---

## ⌨️ 6. Keyboard Shortcuts Guide

| Physical Key | Calculator Action |
| :--- | :--- |
| `0` – `9` | Input Numbers |
| `.` or `,` | Input Decimal Point |
| `+` | Addition Operator |
| `-` | Subtraction Operator (`−`) |
| `*` | Multiplication Operator (`×`) |
| `/` | Division Operator (`÷`) |
| `Enter` or `=` | Calculate Result |
| `Backspace` | Delete Last Character (`⌫`) |
| `Escape` or `c` / `C` | Clear All State (`C`) |

---

## 🏆 7. Verification Test Results

All conversion formulas and boundary rules were verified:

| Test Scenario | Action Sequence | Expected Display | Test Status |
| :--- | :--- | :--- | :---: |
| **Basic Addition** | `5` &rarr; `+` &rarr; `3` &rarr; `=` | `8` | ✅ PASSED |
| **Basic Subtraction** | `8` &rarr; `−` &rarr; `3` &rarr; `=` | `5` | ✅ PASSED |
| **Basic Multiplication** | `5` &rarr; `×` &rarr; `3` &rarr; `=` | `15` | ✅ PASSED |
| **Basic Division** | `10` &rarr; `÷` &rarr; `2` &rarr; `=` | `5` | ✅ PASSED |
| **Decimals Calculation** | `5.5` &rarr; `+` &rarr; `2.5` &rarr; `=` | `8` | ✅ PASSED |
| **Operator Precedence** | `5` &rarr; `+` &rarr; `3` &rarr; `×` &rarr; `2` &rarr; `=` | `11` | ✅ PASSED |
| **Sequential Chaining** | `5` &rarr; `+` &rarr; `3` &rarr; `=` &rarr; `×` &rarr; `2` &rarr; `=` | `16` | ✅ PASSED |
| **Division by Zero** | `10` &rarr; `÷` &rarr; `0` &rarr; `=` | `Cannot divide by zero` | ✅ PASSED |
| **Duplicate Decimal Check** | `5.5.5` | `5.5` (second decimal blocked) | ✅ PASSED |
| **Backspace Flow** | `123` &rarr; `⌫` &rarr; `⌫` &rarr; `⌫` | `12` &rarr; `1` &rarr; `0` | ✅ PASSED |
| **Clear Flow** | Type numbers &rarr; press `C` | Resets display & memory to `0` | ✅ PASSED |

### Live Production Deployment:
👉 **[https://reliable-dragon-48858c.netlify.app/](https://reliable-dragon-48858c.netlify.app/)**

---

## 📁 8. File Structure

```text
OIBSIP/
└── WebDev-L2-Calculator/
    ├── index.html       # Semantic HTML5 layout, display screen & button keypad
    ├── style.css        # CSS Grid layout, button themes, card shadows & responsive styles
    ├── script.js        # Pure Vanilla JS arithmetic engine, event listeners & keyboard support
    └── README.md        # Comprehensive project documentation
```

---

## 💻 9. Getting Started Locally

To run this project on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PriyoGhosh02/OIBSIP.git
   ```

2. **Navigate to the Calculator folder:**
   ```bash
   cd OIBSIP/WebDev-L2-Calculator
   ```

3. **Open in your browser:**
   - Double-click `index.html` to open it directly in Chrome, Edge, Firefox, or Safari, OR
   - Run a lightweight local server:
     ```bash
     # Using Python 3
     python -m http.server 8000
     ```
   - Open `http://localhost:8000` in your web browser.

---

## 📜 10. License & Credits

- **Author**: Priyo Ghosh ([@PriyoGhosh02](https://github.com/PriyoGhosh02))
- **Program**: Oasis Infobyte (OIBSIP) Web Development and Designing Internship
- **Task**: Level 2 — Task 1 (Arithmetic Calculator)
- **Live URL**: [https://reliable-dragon-48858c.netlify.app/](https://reliable-dragon-48858c.netlify.app/)

<div align="center">
  <sub>Engineered with precision, clean CSS Grid, and zero eval()! 🧮⚡</sub>
</div>
