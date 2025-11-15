
document.addEventListener('DOMContentLoaded', function() {
  const cursor = document.querySelector('.custom-cursor');
  
  document.addEventListener('mousemove', function(e) {
      cursor.style.left = e.pageX + 'px';
      cursor.style.top = e.pageY + 'px';
  });

  // GSAP animations for landing section
  gsap.from("#cursor-land h1", {
      y: 100,
      opacity: 0,
      duration: 1.5,
      ease: "power3.out"
  });
  
  gsap.from("#cursor-land button", {
      y: 50,
      opacity: 0,
      duration: 1.5,
      delay: 0.5,
      ease: "power3.out"
  });
  
  gsap.from("#cursor-land p", {
      y: 50,
      opacity: 0,
      duration: 1.5,
      delay: 0.8,
      ease: "power3.out"
  });

  // Init authentication functionality
  initAuth();
});
function initAuth() {
  const userButton = document.getElementById('userButton');
  const authModal = document.getElementById('authModal');
  const closeBtn = document.querySelector('.close');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const showSignupLink = document.getElementById('showSignup');
  const showLoginLink = document.getElementById('showLogin');

  const API_URL = 'http://localhost:5000';


  userButton.addEventListener('click', () => {
      const token = localStorage.getItem('token');
      
      if (token) {
          if (confirm('Do you want to log out?')) {
              localStorage.removeItem('token');
              showToast('Logged out successfully');
              updateUIForLoggedInUser();
          }
      } else {
          authModal.style.display = 'block';
      }
  });

  closeBtn.addEventListener('click', () => {
      authModal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
      if (event.target === authModal) {
          authModal.style.display = 'none';
      }
  });

  // Toggle between login and signup forms
  showSignupLink.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.classList.add('hidden');
      signupForm.classList.remove('hidden');
  });

  showLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      signupForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
  });

  // Check login status on page load
  updateUIForLoggedInUser();

  // Set up form submission handlers
  document.getElementById('loginForm').addEventListener('submit', function(e) {
      e.preventDefault();
      validateLogin();
  });

  document.getElementById('signupForm').addEventListener('submit', function(e) {
      e.preventDefault();
      validateSignup();
  });
}


function togglePassword(inputId, element) {
  const passwordInput = document.getElementById(inputId);
  const icon = element.querySelector('i');
  
  if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
  } else {
      passwordInput.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
  }
}

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  const container = document.getElementById('toastContainer');
  container.appendChild(toast);
  
  setTimeout(() => {
      toast.classList.add('show');
  }, 100);
  
  setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
          container.removeChild(toast);
      }, 300);
  }, 3000);
}

// Form validation and API calls
async function validateSignup() {
  const username = document.getElementById('signupUsername').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value.trim();
  const errorElement = document.getElementById('signupError');
  
  // Reset error message
  errorElement.textContent = '';
  
  // Basic validation
  if (!username || !email || !password) {
      errorElement.textContent = 'All fields are required';
      return;
  }
  
  if (password.length < 6) {
      errorElement.textContent = 'Password must be at least 6 characters';
      return;
  }
  
  if (!validateEmail(email)) {
      errorElement.textContent = 'Please enter a valid email address';
      return;
  }
  
  try {
      const response = await fetch(`${API_URL}/signup`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
          throw new Error(data.error || 'Signup failed');
      }
      
      // Show success message
      showToast('Account created successfully!');
      
      // Switch to login form
      signupForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
      
  } catch (error) {
      errorElement.textContent = error.message;
  }
}

async function validateLogin() {
  const email = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const errorElement = document.getElementById('loginError');
  
  // Reset error message
  errorElement.textContent = '';
  
  // Basic validation
  if (!email || !password) {
      errorElement.textContent = 'All fields are required';
      return;
  }
  
  try {
      const response = await fetch(`${API_URL}/signin`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
          throw new Error(data.error || 'Login failed');
      }
      
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      
      // Show success message
      showToast('Login successful!');
      
      // Close modal
      authModal.style.display = 'none';
      
      // Update UI to show logged in state
      updateUIForLoggedInUser();
      
  } catch (error) {
      errorElement.textContent = error.message;
  }
}

// Helper function to validate email format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Update UI when user is logged in
function updateUIForLoggedInUser() {
  const token = localStorage.getItem('token');
  
  if (token) {
      userButton.innerHTML = '<i class="fa-solid fa-user-check"></i>';
      // You can add more UI changes for logged-in state here
  } else {
      userButton.innerHTML = '<i class="fa-solid fa-circle-user"></i>';
  }
}

// Function to fetch protected data (dashboard)
async function fetchDashboardData() {
  const token = localStorage.getItem('token');
  const API_URL = 'http://localhost:5000';
  
  if (!token) {
      showToast('Please log in to view dashboard', 'error');
      return;
  }
  
  try {
      const response = await fetch(`${API_URL}/dashboard`, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch dashboard');
      }
      
      // Handle dashboard data here
      console.log('Dashboard data:', data);
      // Update UI with dashboard info
      
  } catch (error) {
      console.error('Dashboard error:', error);
      
      if (error.message === 'Invalid Token') {
          // Token expired or invalid
          localStorage.removeItem('token');
          updateUIForLoggedInUser();
          showToast('Session expired. Please log in again', 'error');
      } else {
          showToast(error.message, 'error');
      }
  }
}

// Category animations
document.addEventListener('DOMContentLoaded', function() {
  const categoryCards = document.querySelectorAll('.category-card');
  
  categoryCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
          gsap.to(this, {scale: 1.05, duration: 0.3, ease: "power2.out"});
      });
      
      card.addEventListener('mouseleave', function() {
          gsap.to(this, {scale: 1, duration: 0.3, ease: "power2.out"});
      });
  });
});