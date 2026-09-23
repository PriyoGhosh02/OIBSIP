/**
 * Temperature Converter
 * Vanilla JavaScript Implementation
 */

// DOM Element References
const tempInput = document.getElementById('tempInput');
const unitSelect = document.getElementById('unitSelect');
const convertBtn = document.getElementById('convertBtn');
const clearBtn = document.getElementById('clearBtn');
const errorArea = document.getElementById('errorArea');
const errorMessage = document.getElementById('errorMessage');
const resultsSection = document.getElementById('resultsSection');
const celsiusValue = document.getElementById('celsiusValue');
const fahrenheitValue = document.getElementById('fahrenheitValue');
const kelvinValue = document.getElementById('kelvinValue');

// Absolute Zero constants
const ABSOLUTE_ZERO = {
  celsius: -273.15,
  fahrenheit: -459.67,
  kelvin: 0
};

/**
 * Display an error message and ensure results are hidden.
 * @param {string} msg - The error message text to display.
 */
function showError(msg) {
  errorMessage.textContent = msg;
  errorArea.classList.remove('hidden');
  resultsSection.classList.add('hidden');
}

/**
 * Clear and hide any visible error messages.
 */
function clearError() {
  errorMessage.textContent = '';
  errorArea.classList.add('hidden');
}

/**
 * Validate user input against empty, non-numeric, and absolute zero conditions.
 * @param {string} rawValue - Raw string value from input.
 * @param {string} unit - Selected unit ('celsius', 'fahrenheit', 'kelvin').
 * @returns {number|null} - Parsed float temperature if valid, otherwise null.
 */
function validateInput(rawValue, unit) {
  // Check empty input
  if (rawValue.trim() === '') {
    showError('Please enter a temperature.');
    return null;
  }

  // Check valid numeric value
  const numValue = Number(rawValue);
  if (isNaN(numValue) || !isFinite(numValue)) {
    showError('Please enter a valid numeric temperature.');
    return null;
  }

  // Check absolute zero thresholds
  if (unit === 'celsius' && numValue < ABSOLUTE_ZERO.celsius) {
    showError('Temperature cannot be below absolute zero (−273.15°C).');
    return null;
  }

  if (unit === 'fahrenheit' && numValue < ABSOLUTE_ZERO.fahrenheit) {
    showError('Temperature cannot be below absolute zero (−273.15°C).');
    return null;
  }

  if (unit === 'kelvin' && numValue < ABSOLUTE_ZERO.kelvin) {
    showError('Temperature cannot be below absolute zero (−273.15°C).');
    return null;
  }

  return numValue;
}

/**
 * Format a number to at most 2 decimal places without trailing zeros.
 * @param {number} val - Temperature value.
 * @returns {string} - Formatted string representation.
 */
function formatTemperature(val) {
  // Round to at most 2 decimal places to avoid floating point representation issues (e.g. 0.00000000000004)
  const rounded = Math.round((val + Number.EPSILON) * 100) / 100;
  return rounded.toString();
}

/**
 * Display conversion results on the page.
 * @param {number} c - Temperature in Celsius.
 * @param {number} f - Temperature in Fahrenheit.
 * @param {number} k - Temperature in Kelvin.
 */
function displayResults(c, f, k) {
  celsiusValue.textContent = `${formatTemperature(c)} °C`;
  fahrenheitValue.textContent = `${formatTemperature(f)} °F`;
  kelvinValue.textContent = `${formatTemperature(k)} K`;

  clearError();
  resultsSection.classList.remove('hidden');
}

/**
 * Main conversion function triggered on button click or Enter key.
 */
function convertTemperature() {
  const rawValue = tempInput.value;
  const unit = unitSelect.value;

  const validTemp = validateInput(rawValue, unit);
  if (validTemp === null) {
    return;
  }

  let c, f, k;

  switch (unit) {
    case 'celsius':
      c = validTemp;
      f = (validTemp * 9 / 5) + 32;
      k = validTemp + 273.15;
      break;

    case 'fahrenheit':
      c = (validTemp - 32) * 5 / 9;
      f = validTemp;
      k = (validTemp - 32) * 5 / 9 + 273.15;
      break;

    case 'kelvin':
      c = validTemp - 273.15;
      f = (validTemp - 273.15) * 9 / 5 + 32;
      k = validTemp;
      break;

    default:
      showError('Invalid unit selected.');
      return;
  }

  displayResults(c, f, k);
}

/**
 * Reset and clear the entire converter state.
 */
function clearConverter() {
  tempInput.value = '';
  unitSelect.value = 'celsius';
  clearError();
  resultsSection.classList.add('hidden');
  celsiusValue.textContent = '--';
  fahrenheitValue.textContent = '--';
  kelvinValue.textContent = '--';
  tempInput.focus();
}

// Event Listeners
convertBtn.addEventListener('click', convertTemperature);
clearBtn.addEventListener('click', clearConverter);

// Allow pressing 'Enter' inside the temperature input to convert
tempInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    convertTemperature();
  }
});
