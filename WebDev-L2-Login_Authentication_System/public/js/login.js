// TaskHub - Login Client Logic

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const identifierInput = document.getElementById('identifier');
  const passwordInput = document.getElementById('password');
  const alertBox = document.getElementById('alertBox');
  const alertMessage = document.getElementById('alertMessage');
  const submitBtn = document.getElementById('loginSubmitBtn');
  const btnText = document.getElementById('btnText');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  const googleLoginBtn = document.getElementById('googleLoginBtn');

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

  // Hide alert on input
  [identifierInput, passwordInput].forEach(input => {
    input.addEventListener('input', () => {
      if (alertBox.classList.contains('show')) {
        hideAlert();
      }
    });
  });

  // Handle Form Submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();

    const identifier = identifierInput.value.trim();
    const password = passwordInput.value;

    // 1. Client-side empty validation
    if (!identifier || !password) {
      showAlert('Please fill in all fields.', 'error');
      if (!identifier) {
        identifierInput.focus();
      } else {
        passwordInput.focus();
      }
      return;
    }

    // Set loading state
    submitBtn.disabled = true;
    const originalText = btnText.textContent;
    btnText.innerHTML = '<div class="spinner"></div> Logging in...';

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ identifier, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showAlert('Login successful! Redirecting to Dashboard...', 'success');
        setTimeout(() => {
          window.location.href = data.redirectUrl || '/dashboard';
        }, 600);
      } else {
        showAlert(data.error || 'Invalid username/email or password.', 'error');
        submitBtn.disabled = false;
        btnText.textContent = originalText;
        passwordInput.value = '';
        passwordInput.focus();
      }
    } catch (err) {
      console.error('Login error:', err);
      showAlert('Unable to connect to the server. Please try again.', 'error');
      submitBtn.disabled = false;
      btnText.textContent = originalText;
    }
  });

  // Demo features feedback
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', () => {
      showAlert('Password reset is not enabled in this demo. Please use your registered credentials.', 'error');
    });
  }

  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => {
      showAlert('Google sign-in is disabled in this demo. Please login using your username/email and password.', 'error');
    });
  }
});
