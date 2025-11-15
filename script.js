// ✨ Custom Cursor Movement with GSAP
const cursor = document.querySelector(".custom-cursor");
const landDiv = document.querySelector("#cursor-land");

document.addEventListener("mousemove", (e) => {
  gsap.to(cursor, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.2,
    ease: "power2.out",
  });
});

// Ensure `landDiv` exists before adding event listeners
if (landDiv) {
  landDiv.addEventListener("mouseenter", () => {
    cursor.innerHTML = "Explore More";
    gsap.to(cursor, { scale: 2.2, duration: 0.2, ease: "power2.out" });
  });

  landDiv.addEventListener("mouseleave", () => {
    cursor.innerHTML = "";
    gsap.to(cursor, { scale: 1, duration: 0.2, ease: "power2.out" });
  });
}

// ✨ GSAP Animations
var tl = gsap.timeline();

tl.from(".nav-Container h3", {
  x: -100,
  opacity: 0,
  duration: 0.8,
  ease: "power2.out",
})
  .from(
    ".nav-Container .fa-circle-user",
    { x: 100, opacity: 0, duration: 0.8, ease: "power2.out" },
    "-=0.8"
  )
  .from(
    ".nav-Container a",
    { y: -50, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" },
    "-=0.5"
  )
  .from(
    ".nav-Container .search-Area",
    { y: -50, opacity: 0, duration: 0.8, ease: "power2.out" },
    "-=0.4"
  )
  .from(
    ".nav-Container i:not(.fa-circle-user)",
    { y: -50, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" },
    "-=0.5"
  );

// ✨ Break Text Function (Optimized)
function breakText() {
  var h1 = document.querySelector(".landing-container h1");
  var button = document.querySelector(".landing-container button");

  if (!h1 || !button) return;

  var text = h1.textContent.trim();
  h1.innerHTML = text
    .split("")
    .map((letter) => `<span>${letter}</span>`)
    .join("");

  gsap.from(".landing-container h1 span", {
    y: 50,
    opacity: 0,
    duration: 1.5,
    delay: 0.5,
    stagger: 0.1,
    ease: "power2.out",
  });

  gsap.set("button", { opacity: 0, y: 50 });

  // Animate smoothly without jitter
    gsap.to("button", {
        opacity: 1,
        y: 0,
        duration: .2,
        delay: 1.5,
        ease: "power2.out",
    });

}

document.addEventListener("DOMContentLoaded", breakText);

// login and signup
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("authModal");
  const userButton = document.getElementById("userButton");
  const closeModal = document.querySelector(".close");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const showSignup = document.getElementById("showSignup");
  const showLogin = document.getElementById("showLogin");

  // Open modal when user button is clicked
  userButton.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // Close modal when clicking 'X'
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close modal when clicking outside of it
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Switch to signup form
  showSignup.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
  });

  // Switch back to login form
  showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
  });
});
document.getElementById('submitd').addEventListener('click', function() {
  window.location.href = "./dashboard/index.html";
});


function togglePassword(fieldId, element) {
  const passwordField = document.getElementById(fieldId);
  const toggleIcon = element.querySelector("i");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
  } else {
    passwordField.type = "password";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
  }
}
function validateLogin() {
  const usernameField = document.getElementById("loginUsername");
  const passwordField = document.getElementById("loginPassword");
  const errorMsg = document.getElementById("loginError");

  const username = usernameField.value.trim();
  const password = passwordField.value.trim();

  if (username === "" || password === "") {
    errorMsg.innerText = "Please enter both username and password.";
    errorMsg.style.color = "red";
  } else {
    errorMsg.innerText = "";
    showToast("Login successful!");

    usernameField.value = "";
    passwordField.value = "";
  }
}

function validateSignup() {
  const username = document.getElementById("signupUsername").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const errorMsg = document.getElementById("signupError");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (username === "" || email === "" || password === "") {
    errorMsg.innerText = "All fields are required.";
    errorMsg.style.color = "red";
  } else if (!emailPattern.test(email)) {
    errorMsg.innerText = "Please enter a valid email address.";
    errorMsg.style.color = "red";
  } else {
    errorMsg.innerText = "";
    showToast("Signup successful! Welcome, " + username + "!");
  }
}

function showToast(message) {
  const toastContainer = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.innerText = message;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toastContainer.removeChild(toast), 500);
  }, 2000);
}

/// happy customer scroll

document.addEventListener("DOMContentLoaded", () => {
  const marqueeInner = document.querySelector(".marquee-inner");
  const testimonials = Array.from(marqueeInner.children);

  // Duplicate testimonials dynamically to ensure infinite scrolling
  testimonials.forEach((testimonial) => {
    const clone = testimonial.cloneNode(true);
    marqueeInner.appendChild(clone);
  });
});



