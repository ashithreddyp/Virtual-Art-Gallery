// auth.js

// Get logged-in user from localStorage
function getLoggedInUser() {
  const userJSON = localStorage.getItem('user');
  if (!userJSON) return null;
  try {
    const parsed = JSON.parse(userJSON);
    return parsed?.user || parsed; // handles both {user: {...}} and plain {...}
  } catch {
    return null;
  }
}

// Check if user is logged in (used in add-to-cart / buy-now logic)
function checkUserLoggedIn() {
  const user = getLoggedInUser();
  return user && user._id;
}

// Save user to localStorage and update UI
function saveLoggedInUser(userData) {
  localStorage.setItem('user', JSON.stringify(userData)); // store plain user object
  updateLoginUI();
}

// Check if user is admin
function isUserAdmin() {
  const user = getLoggedInUser();
  return user && user.role === 'admin';
}

// Update UI elements based on login state
function updateLoginUI() {
  const user = getLoggedInUser();

  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const adminPanelLink = document.getElementById('adminPanelLink');
  const profileLink = document.getElementById('profileLink');
  const userDisplay = document.getElementById('userDisplay');

  if (user) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    if (profileLink) profileLink.style.display = 'inline-block';

    if (adminPanelLink) {
      adminPanelLink.style.display = isUserAdmin() ? 'inline-block' : 'none';
    }

    if (userDisplay) {
      userDisplay.textContent = `Hello, ${user.username}`;
      userDisplay.style.display = 'inline-block';
    }

  } else {
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (signupBtn) signupBtn.style.display = 'inline-block';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (profileLink) profileLink.style.display = 'none';
    if (adminPanelLink) adminPanelLink.style.display = 'none';

    if (userDisplay) {
      userDisplay.textContent = '';
      userDisplay.style.display = 'none';
    }
  }
}

// Logout user: clear storage and update UI
function logoutUser() {
  localStorage.removeItem('user');
  updateLoginUI();
  window.location.href = '/paintings.html'; // or redirect elsewhere if needed
}

// Setup logout button
function setupLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await fetch('/logout', {
          method: 'POST',
          credentials: 'include'
        });
      } catch (err) {
        console.error('Logout failed:', err);
      }
      logoutUser();
    });
  }
}

// Initialize auth system (call this on each page load)
function initAuthUI() {
  updateLoginUI();
  setupLogout();
}
