# 🌡️ Temperature Converter Web Application

<div align="center">

  <h1>🌡️ Simple • Accurate • Instant ✨</h1>

  <p><strong>A modern, clean, and responsive Temperature Converter web application built with pure HTML5, CSS3, and Vanilla JavaScript.</strong></p>

  <p>
    <a href="https://superlative-quokka-678743.netlify.app/" target="_blank">
      <img src="https://img.shields.io/badge/Live_Demo-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Live Demo on Netlify" />
    </a>
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
    <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="Vanilla JavaScript" />
    <img src="https://img.shields.io/badge/Responsive-Design-EF6280?style=for-the-badge" alt="Responsive Design" />
  </p>

  <h3>
    🌐 <strong>Live Website:</strong> 
    <a href="https://superlative-quokka-678743.netlify.app/" target="_blank">
      https://superlative-quokka-678743.netlify.app/
    </a>
  </h3>

</div>

---

## 🎯 1. Objective

The primary objective of this project is to develop a simple, clean, accurate, and fully functional **Temperature Converter Website** as part of **Task 3 (Level 1)** of the **Oasis Infobyte (OIBSIP)** Web Development and Designing Internship.

Key goals include:
- Providing simultaneous, multi-directional temperature conversions across **Celsius (°C)**, **Fahrenheit (°F)**, and **Kelvin (K)** from a single input.
- Implementing rigorous client-side validation to handle empty input, non-numeric values, and scientific physical constraints (temperatures below **Absolute Zero**).
- Designing a sleek, distraction-free user interface utilizing **semantic HTML5**, modern **vanilla CSS3**, and **pure JavaScript** without any external libraries or heavy frameworks.
- Delivering a mobile-responsive layout that offers consistent usability across desktop monitors, tablets, and smartphones.

---

## 💡 2. Motivation

Temperature measurement is a cornerstone of daily life, weather forecasting, scientific inquiry, cooking, travel, and international commerce. However, different regions and disciplines rely on distinct temperature scales:
- **Celsius (°C)** is the international standard used worldwide for weather and everyday life.
- **Fahrenheit (°F)** is the primary scale in the United States and select territories.
- **Kelvin (K)** is the fundamental SI thermodynamic scale utilized by scientists and engineers globally.

Many existing online temperature converters suffer from visual clutter, invasive advertisements, complex multi-step forms, or a lack of scientific validation (such as allowing physically impossible temperatures below absolute zero). 

The motivation behind this project was to craft a lightweight, zero-dependency utility that provides:
1. **Instant Clarity**: Convert to all three scales at once with a single click.
2. **Scientific Accuracy**: Enforce real-world thermodynamic laws with absolute zero boundary checks.
3. **Refined Aesthetics**: Deliver a clean, modern card layout with subtle gradients, soft shadows, and color-coded scale cards that make reading results effortless.

---

## 🛠️ 3. Tools & Technologies Used

- **Markup & Structure:** Semantic **HTML5** (`<header>`, `<main>`, `<form>`, `<label>`, `<input>`, `<select>`, `<button>`, `<section>`, ARIA roles for accessibility).
- **Styling & Visual Design:** Vanilla **CSS3** (CSS Custom Properties / Variables, Flexbox, CSS Grid, custom select chevron, responsive media queries, card elevation shadows).
- **Typography:** **Google Fonts** (`Inter` — 400 Regular, 500 Medium, 600 Semi-Bold, 700 Bold, 800 Extra-Bold).
- **Behavior & Logic:** **Vanilla JavaScript (ES6+)** (Event listeners, DOM manipulation, input sanitization, math rounding, error state handling).
- **Vector Icons:** Clean inline SVG icons (thermometers, warning indicator, chevron, and info badge).
- **Deployment & Hosting:** **Netlify** for continuous automated deployment and live web hosting.
- **Development Tools:** Visual Studio Code, Git, GitHub, and Chrome DevTools.

---

## 📋 4. Process (Development Workflow)

The project was executed systematically following modern web engineering practices:

```text
User enters temperature
        ↓
Selects input unit (Celsius, Fahrenheit, or Kelvin)
        ↓
Clicks "Convert Temperature" (or presses Enter)
        ↓
Input Validation
   ├── Is input empty? ───────────► Show "Please enter a temperature."
   ├── Is input non-numeric? ─────► Show "Please enter a valid numeric temperature."
   └── Below Absolute Zero? ──────► Show "Temperature cannot be below absolute zero (−273.15°C)."
        ↓ (All checks passed)
Simultaneous Calculation:
   ├── Compute Celsius (°C)
   ├── Compute Fahrenheit (°F)
   └── Compute Kelvin (K)
        ↓
Display 3 Color-Coded Result Cards (with rounded clean formatting)
```

### Detailed Workflow Steps:

1. **Requirement Analysis & Mathematical Formulation:**
   - Established standard conversion formulas between Celsius, Fahrenheit, and Kelvin.
   - Identified physical boundary constraints for Absolute Zero (−273.15°C / −459.67°F / 0 K).

2. **Semantic HTML5 Architecture (`index.html`):**
   - Centered page wrapper with descriptive header eyebrow (`SIMPLE • ACCURATE • INSTANT`).
   - Clean card container with side-by-side inputs (numeric field and dropdown selector).
   - Dedicated primary ("Convert Temperature") and secondary ("Clear") action buttons.
   - Dedicated error alert banner (`role="alert"`) and a 3-column results grid.

3. **CSS3 Design System & UI Hierarchy (`style.css`):**
   - Created a curated color palette: Slate `#0F172A`, Slate Gray `#64748B`, Primary Blue `#2563EB`, Light Blue `#EFF6FF`, Mint Green `#F0FDF4`, Warm Amber `#FFFBEB`, and Coral Red `#DC2626`.
   - Designed custom focus states (`box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15)`).
   - Crafted distinctive badges for each unit with matching thermometer icons.
   - Built a fluid, mobile-responsive layout that stacks columns gracefully on small screens without horizontal scrolling.

4. **Vanilla JavaScript Engineering (`script.js`):**
   - Modular functional architecture:
     - `convertTemperature()`: Primary controller triggering validation and conversion.
     - `validateInput(rawValue, unit)`: Multi-layer input validation and boundary checking.
     - `formatTemperature(val)`: Floating-point precision limiter rounding cleanly up to 2 decimal places without trailing `.00`.
     - `displayResults(c, f, k)`: Updates DOM values and displays the results card.
     - `showError(msg)` & `clearError()`: Accessible error banner management.
     - `clearConverter()`: Complete form reset, unit restoration to Celsius, and input refocusing.
   - Added keyboard accessibility allowing users to press **Enter** to convert immediately.

5. **Testing & Edge-Case Verification:**
   - Tested positive numbers, negative numbers, and floating-point decimal values.
   - Tested boiling points, freezing points, and scale-crossing temperatures (e.g., −40° where °C and °F are equal).
   - Verified that invalid inputs (empty, letters, symbols, sub-absolute zero) trigger appropriate error alerts.

6. **Production Deployment on Netlify:**
   - Linked repository and deployed to Netlify with global CDN distribution and SSL certification.

---

## ⚙️ 5. Functional Information

### Mathematical Conversion Formulas

| From Unit | To Celsius (°C) | To Fahrenheit (°F) | To Kelvin (K) |
| :--- | :--- | :--- | :--- |
| **Celsius (°C)** | $C = C$ | $F = (C \times \frac{9}{5}) + 32$ | $K = C + 273.15$ |
| **Fahrenheit (°F)** | $C = (F - 32) \times \frac{5}{9}$ | $F = F$ | $K = (F - 32) \times \frac{5}{9} + 273.15$ |
| **Kelvin (K)** | $C = K - 273.15$ | $F = (K - 273.15) \times \frac{9}{5} + 32$ | $K = K$ |

---

### Absolute Zero Thresholds & Validation

Absolute zero represents the lowest theoretically possible temperature where thermodynamic entropy and molecular motion reach a minimum. The application enforces this law across all input scales:

| Scale | Absolute Zero Limit | Behavior on Values Below Limit |
| :--- | :--- | :--- |
| **Celsius** | `< −273.15 °C` | Reject & Display: *"Temperature cannot be below absolute zero (−273.15°C)."* |
| **Fahrenheit** | `< −459.67 °F` | Reject & Display: *"Temperature cannot be below absolute zero (−273.15°C)."* |
| **Kelvin** | `< 0 K` | Reject & Display: *"Temperature cannot be below absolute zero (−273.15°C)."* |

---

### Key Features Summary

- **Simultaneous Tri-Unit Output**: View Celsius, Fahrenheit, and Kelvin in parallel without having to perform multiple separate conversions.
- **Smart Formatting**: Clean decimal handling avoids ugly floating-point representation bugs (e.g., `25` displays as `25 °C`, `77` displays as `77 °F`, and `298.15` displays as `298.15 K`).
- **Accessible Error Handling**: Visual banner with SVG warning icon and semantic `aria-live="polite"` feedback for screen readers.
- **One-Click Reset (Clear)**: Instantly resets the temperature field, restores the dropdown to Celsius, removes error banners, hides the results panel, and refocuses the cursor.
- **Keyboard Friendly**: Pressing the `Enter` key within the temperature input instantly triggers conversion.
- **100% Zero-Dependency**: Zero external frameworks, zero CDNs for scripts, and zero bloated packages.

---

## 🏆 6. Results & Verification

### Live Deployment
The web application is live and accessible worldwide:  
👉 **[https://superlative-quokka-678743.netlify.app/](https://superlative-quokka-678743.netlify.app/)**

### Verification Test Matrix

All conversion formulas and boundary rules were comprehensively verified:

| Test Scenario | Input Value | Input Unit | Celsius Result | Fahrenheit Result | Kelvin Result | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Room Temperature** | `25` | Celsius | `25 °C` | `77 °F` | `298.15 K` | ✅ PASSED |
| **Body Temperature** | `98.6` | Fahrenheit | `37 °C` | `98.6 °F` | `310.15 K` | ✅ PASSED |
| **Freezing Point of Water** | `0` | Celsius | `0 °C` | `32 °F` | `273.15 K` | ✅ PASSED |
| **Boiling Point of Water** | `212` | Fahrenheit | `100 °C` | `212 °F` | `373.15 K` | ✅ PASSED |
| **Kelvin Standard** | `300` | Kelvin | `26.85 °C` | `80.33 °F` | `300 K` | ✅ PASSED |
| **Scale Equality Point** | `-40` | Celsius | `-40 °C` | `-40 °F` | `233.15 K` | ✅ PASSED |
| **Absolute Zero (Exact)** | `-273.15` | Celsius | `-273.15 °C` | `-459.67 °F` | `0 K` | ✅ PASSED |
| **Empty Input Check** | *empty* | Any | *Blocked: "Please enter a temperature."* | ✅ PASSED |
| **Non-Numeric Check** | `abc` | Any | *Blocked: "Please enter a valid numeric temperature."* | ✅ PASSED |
| **Below Absolute Zero (C)** | `-300` | Celsius | *Blocked: "Temperature cannot be below absolute zero (−273.15°C)."* | ✅ PASSED |
| **Below Absolute Zero (F)** | `-500` | Fahrenheit | *Blocked: "Temperature cannot be below absolute zero (−273.15°C)."* | ✅ PASSED |
| **Below Absolute Zero (K)** | `-5` | Kelvin | *Blocked: "Temperature cannot be below absolute zero (−273.15°C)."* | ✅ PASSED |
| **Clear Functionality** | - | - | *Input cleared, dropdown reset, results hidden* | ✅ PASSED |

---

## 📁 7. File Structure

```text
OIBSIP/
└── WebDev-L1-Temperature_Converter/
    ├── index.html       # Main semantic HTML structure & accessible form controls
    ├── style.css        # Clean CSS3 design system, responsive rules & card themes
    ├── script.js        # Vanilla JS conversion logic, validation & DOM updates
    └── README.md        # Comprehensive project documentation
```

---

## 💻 8. Getting Started Locally

To run this project on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PriyoGhosh02/OIBSIP.git
   ```

2. **Navigate into the project directory:**
   ```bash
   cd OIBSIP/WebDev-L1-Temperature_Converter
   ```

3. **Open `index.html` in your browser:**
   - Double-click `index.html` to open it directly in any modern browser (Chrome, Edge, Firefox, Safari), OR
   - Run a lightweight local server:
     ```bash
     # Using Python 3
     python -m http.server 8000
     ```
   - Open `http://localhost:8000` in your web browser.

---

## 📜 9. License & Credits

- **Author**: Priyo Ghosh ([@PriyoGhosh02](https://github.com/PriyoGhosh02))
- **Program**: Oasis Infobyte (OIBSIP) Web Development and Designing Internship
- **Task**: Level 1 — Task 3 (Temperature Converter Website)
- **Live URL**: [https://superlative-quokka-678743.netlify.app/](https://superlative-quokka-678743.netlify.app/)

<div align="center">
  <sub>Built with precision, clean code, and passion for web development! 🌡️⚡</sub>
</div>
