// TaskHub - Dashboard Client Logic

document.addEventListener('DOMContentLoaded', () => {
  const welcomeHeading = document.getElementById('welcomeHeading');
  const navUserEmail = document.getElementById('navUserEmail');
  const accountUsername = document.getElementById('accountUsername');
  const accountEmail = document.getElementById('accountEmail');
  const accountCreated = document.getElementById('accountCreated');
  const logoutBtn = document.getElementById('logoutBtn');
  const sidebarItems = document.querySelectorAll('.sidebar-nav-item');

  // Load current user profile from server session
  async function loadUserProfile() {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        // If not authenticated, redirect to login page immediately
        window.location.href = '/login';
        return;
      }

      const data = await response.json();
      if (data && data.user) {
        const { username, email, created_at } = data.user;
        
        // Update welcome banner
        welcomeHeading.textContent = `Welcome, ${username}!`;
        
        // Update nav badge
        navUserEmail.textContent = email;
        
        // Update Account Information card
        accountUsername.textContent = username;
        accountEmail.textContent = email;
        
        if (created_at) {
          const date = new Date(created_at);
          accountCreated.textContent = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        } else {
          accountCreated.textContent = 'Today';
        }
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
      window.location.href = '/login';
    }
  }

  // Handle Logout flow
  logoutBtn.addEventListener('click', async () => {
    try {
      logoutBtn.disabled = true;
      logoutBtn.innerHTML = `
        <div class="spinner" style="width: 14px; height: 14px; border-color: rgba(220, 38, 38, 0.3); border-top-color: #dc2626;"></div>
        <span>Logging out...</span>
      `;

      const response = await fetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      // Redirect to login page
      window.location.href = data.redirectUrl || '/login';
    } catch (err) {
      console.error('Logout error:', err);
      window.location.href = '/login';
    }
  });

  // Sidebar item tab switching
  sidebarItems.forEach(item => {
    item.addEventListener('click', (e) => {
      sidebarItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Initialize
  loadUserProfile();
});
