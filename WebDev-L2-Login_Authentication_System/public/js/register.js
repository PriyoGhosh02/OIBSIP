// TaskHub - Registration Client Logic

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const alertBox = document.getElementById('alertBox');
  const alertMessage = document.getElementById('alertMessage');
  const submitBtn = document.getElementById('registerSubmitBtn');
  const btnText = document.getElementById('btnText');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');

  // Requirement elements
  const reqLength = document.getElementById('reqLength');
  const reqNumber = document.getElementById('reqNumber');
  const reqCombo = document.getElementById('reqCombo');

  const checkSvg = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  `;

  const circleSvg = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9"></circle>
    </svg>
  `;

  function setRequirementState(element, isValid) {
    const iconContainer = element.querySelector('.requirement-icon');
    if (isValid) {
      element.classList.add('valid');
      iconContainer.innerHTML = checkSvg;
    } else {
      element.classList.remove('valid');
      iconContainer.innerHTML = circleSvg;
    }
  }

  // Live password validation checklist update
  function updatePasswordRequirements() {
    const val = passwordInput.value;
    const hasLength = val.length >= 8;
    const hasNumber = /\d/.test(val);
    const hasLettersAndNumbers = /[a-zA-Z]/.test(val) && /\d/.test(val);

    setRequirementState(reqLength, hasLength);
    setRequirementState(reqNumber, hasNumber);
    setRequirementState(reqCombo, hasLettersAndNumbers);
  }

  passwordInput.addEventListener('input', updatePasswordRequirements);

  // Helper to show alert notifications
  function showAlert(message, type = 'error') {
    alertBox.className = `alert-box alert-${type} show`;
    alertMessage.textContent = message;
  }

  function hideAlert() {
    alertBox.className = 'alert-box';
    alertMessage.textContent = '';
  }

  // Toggle password visibility
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      
      togglePasswordBtn.innerHTML = isPassword
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
            <line x1="2" y1="2" x2="22" y2="22"></line>
           </svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
            <circle cx="12" cy="12" r="3"></circle>
           </svg>`;
    });
  }

  // Clear alert on input
  [usernameInput, emailInput, passwordInput].forEach(input => {
    input.addEventListener('input', () => {
      if (alertBox.classList.contains('show')) {
        hideAlert();
      }
    });
  });

  // Handle Form Submission
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // 1. Empty field validation
    if (!username || !email || !password) {
      showAlert('Please fill in all fields.', 'error');
      if (!username) usernameInput.focus();
      else if (!email) emailInput.focus();
      else passwordInput.focus();
      return;
    }

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert('Please enter a valid email address.', 'error');
      emailInput.focus();
      return;
    }

    // 3. Password requirements (min 8 characters, at least 1 number)
    if (password.length < 8 || !/\d/.test(password)) {
      showAlert('Password must be at least 8 characters and contain at least 1 number.', 'error');
      passwordInput.focus();
      return;
    }

    // Set loading state
    submitBtn.disabled = true;
    const originalText = btnText.textContent;
    btnText.innerHTML = '<div class="spinner"></div> Creating account...';

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showAlert('Account created successfully! Redirecting to login...', 'success');
        setTimeout(() => {
          window.location.href = data.redirectUrl || '/login';
        }, 1200);
      } else {
        showAlert(data.error || 'Registration failed. Please check your details.', 'error');
        submitBtn.disabled = false;
        btnText.textContent = originalText;
      }
    } catch (err) {
      console.error('Registration error:', err);
      showAlert('Unable to connect to the server. Please try again.', 'error');
      submitBtn.disabled = false;
      btnText.textContent = originalText;
    }
  });
});
