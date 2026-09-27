/**
 * Everyday Calculator - Vanilla JavaScript Implementation
 * Arithmetic evaluation without eval(), full event listener architecture,
 * and robust input validation.
 */

// DOM References
const expressionDisplay = document.getElementById('expressionDisplay');
const currentDisplay = document.getElementById('currentDisplay');
const keypad = document.querySelector('.calculator-buttons');

// Calculator State
let currentInput = '0';
let expressionTokens = [];
let isCalculated = false;
let hasError = false;

/**
 * Format a number cleanly for display, avoiding floating point artifacts
 * @param {number} val - Numeric value to format
 * @returns {string} - Formatted number string
 */
function formatResult(val) {
  // Round to at most 10 decimal places to eliminate floating point imprecision
  const rounded = Math.round((val + Number.EPSILON) * 1e10) / 1e10;
  return rounded.toString();
}

/**
 * Update the calculator display elements
 */
function updateDisplay() {
  if (hasError) {
    currentDisplay.classList.add('error-text');
    return;
  }
  currentDisplay.classList.remove('error-text');

  // Update ongoing expression line
  if (expressionTokens.length > 0) {
    if (isCalculated) {
      expressionDisplay.textContent = expressionTokens.join(' ');
    } else {
      expressionDisplay.textContent = expressionTokens.join(' ') + (currentInput !== '' ? ` ${currentInput}` : '');
    }
  } else {
    expressionDisplay.textContent = '';
  }

  // Update current number line
  currentDisplay.textContent = currentInput === '' ? '0' : currentInput;
}

/**
 * Display an error message and lock until reset or fresh input
 * @param {string} message - Error description
 */
function showError(message) {
  hasError = true;
  currentDisplay.textContent = message;
  currentDisplay.classList.add('error-text');
  if (expressionTokens.length > 0) {
    expressionDisplay.textContent = expressionTokens.join(' ') + ' =';
  }
}

/**
 * Append a numeric digit (0-9) to the current input
 * @param {string} digit - Digit string
 */
function appendNumber(digit) {
  if (hasError) {
    clearCalculator();
  }

  if (isCalculated) {
    // Start fresh calculation if typing number immediately after calculation
    currentInput = digit;
    expressionTokens = [];
    isCalculated = false;
    updateDisplay();
    return;
  }

  if (currentInput === '0') {
    currentInput = digit;
  } else {
    currentInput += digit;
  }

  updateDisplay();
}

/**
 * Append a decimal point to the current input, ensuring no duplicates
 */
function appendDecimal() {
  if (hasError) {
    clearCalculator();
  }

  if (isCalculated) {
    currentInput = '0.';
    expressionTokens = [];
    isCalculated = false;
    updateDisplay();
    return;
  }

  if (currentInput === '') {
    currentInput = '0.';
  } else if (!currentInput.includes('.')) {
    currentInput += '.';
  }

  updateDisplay();
}

/**
 * Choose an arithmetic operator (+, −, ×, ÷)
 * @param {string} operator - Standard symbol (+, −, ×, ÷)
 */
function chooseOperator(operator) {
  if (hasError) {
    return;
  }

  if (isCalculated) {
    // Continue calculating using previous result as initial operand
    expressionTokens = [currentInput, operator];
    currentInput = '';
    isCalculated = false;
    updateDisplay();
    return;
  }

  if (currentInput !== '') {
    // Add current number and operator to token list
    expressionTokens.push(currentInput);
    expressionTokens.push(operator);
    currentInput = '';
  } else if (expressionTokens.length > 0) {
    // Operator chaining / replacement: update the last operator
    expressionTokens[expressionTokens.length - 1] = operator;
  } else {
    // Default initial 0 operand if operator is clicked first
    expressionTokens.push('0');
    expressionTokens.push(operator);
  }

  updateDisplay();
}

/**
 * Delete the last entered character (Backspace functionality)
 */
function deleteLast() {
  if (hasError) {
    clearCalculator();
    return;
  }

  if (isCalculated) {
    // If result was calculated, clear expression and allow editing result
    expressionTokens = [];
    isCalculated = false;
  }

  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
  } else if (currentInput.length === 1) {
    currentInput = '0';
  }

  updateDisplay();
}

/**
 * Completely reset the calculator state
 */
function clearCalculator() {
  currentInput = '0';
  expressionTokens = [];
  isCalculated = false;
  hasError = false;
  currentDisplay.classList.remove('error-text');
  updateDisplay();
}

/**
 * Evaluate arithmetic expression tokens according to standard mathematical
 * precedence (multiplication & division before addition & subtraction)
 * without using eval().
 * @param {Array<string>} tokens - Array of numbers and operators
 * @returns {Object} - Object containing result or error string
 */
function evaluateTokens(tokens) {
  const t = [...tokens];

  // First Pass: Multiplication (×) and Division (÷)
  let i = 0;
  while (i < t.length) {
    const op = t[i];
    if (op === '×' || op === '÷') {
      const left = parseFloat(t[i - 1]);
      const right = parseFloat(t[i + 1]);

      if (isNaN(left) || isNaN(right)) {
        return { error: 'Error' };
      }

      if (op === '÷' && right === 0) {
        return { error: 'Cannot divide by zero' };
      }

      const res = op === '×' ? left * right : left / right;
      t.splice(i - 1, 3, res.toString());
      i = i - 1;
    } else {
      i++;
    }
  }

  // Second Pass: Addition (+) and Subtraction (−)
  i = 0;
  while (i < t.length) {
    const op = t[i];
    if (op === '+' || op === '−') {
      const left = parseFloat(t[i - 1]);
      const right = parseFloat(t[i + 1]);

      if (isNaN(left) || isNaN(right)) {
        return { error: 'Error' };
      }

      const res = op === '+' ? left + right : left - right;
      t.splice(i - 1, 3, res.toString());
      i = i - 1;
    } else {
      i++;
    }
  }

  const finalVal = parseFloat(t[0]);
  if (isNaN(finalVal) || !isFinite(finalVal)) {
    return { error: 'Error' };
  }

  return { result: formatResult(finalVal) };
}

/**
 * Calculate the final expression upon pressing Equals (=)
 */
function calculate() {
  if (hasError) {
    return;
  }

  if (isCalculated) {
    return;
  }

  // Finalize tokens with current input if available
  if (currentInput !== '') {
    expressionTokens.push(currentInput);
  } else if (expressionTokens.length > 0) {
    // If expression ends with an operator, pop trailing operator
    expressionTokens.pop();
  }

  if (expressionTokens.length === 0) {
    return;
  }

  const expressionCopy = [...expressionTokens];
  const evalOutcome = evaluateTokens(expressionTokens);

  if (evalOutcome.error) {
    showError(evalOutcome.error);
    return;
  }

  expressionTokens = expressionCopy;
  currentInput = evalOutcome.result;
  isCalculated = true;
  updateDisplay();
}

/**
 * Handle keypad button clicks via event delegation
 * @param {MouseEvent} event - Click event
 */
function handleButtonClick(event) {
  const target = event.target.closest('button');
  if (!target) return;

  const action = target.dataset.action;
  const value = target.dataset.value;

  switch (action) {
    case 'number':
      appendNumber(value);
      break;
    case 'decimal':
      appendDecimal();
      break;
    case 'operator':
      chooseOperator(value);
      break;
    case 'calculate':
      calculate();
      break;
    case 'clear':
      clearCalculator();
      break;
    case 'backspace':
      deleteLast();
      break;
  }
}

/**
 * Handle physical keyboard input
 * @param {KeyboardEvent} event - Keydown event
 */
function handleKeyboardInput(event) {
  const key = event.key;

  if (key >= '0' && key <= '9') {
    appendNumber(key);
  } else if (key === '.' || key === ',') {
    appendDecimal();
  } else if (key === '+') {
    chooseOperator('+');
  } else if (key === '-') {
    chooseOperator('−');
  } else if (key === '*') {
    chooseOperator('×');
  } else if (key === '/') {
    event.preventDefault(); // Prevent browser shortcut
    chooseOperator('÷');
  } else if (key === 'Enter' || key === '=') {
    event.preventDefault();
    calculate();
  } else if (key === 'Backspace') {
    event.preventDefault();
    deleteLast();
  } else if (key === 'Escape' || key.toLowerCase() === 'c') {
    clearCalculator();
  }
}

// Attach Event Listeners
keypad.addEventListener('click', handleButtonClick);
window.addEventListener('keydown', handleKeyboardInput);

// Initial display setup
updateDisplay();
