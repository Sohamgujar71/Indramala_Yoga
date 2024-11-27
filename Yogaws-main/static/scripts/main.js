 // Toggle nav links on hamburger click
  document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");

    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  });

  // Modal handling
  document.getElementById('openModal').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('modal').style.display = 'flex';
  });

  document.querySelector('.close-button').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'none';
  });

  window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('modal')) {
      document.getElementById('modal').style.display = 'none';
    }
  });

  // Navbar hide on scroll down
  document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('nav');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop) {
        navbar.classList.add('hide');
      } else {
        navbar.classList.remove('hide');
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
  });

  // Password validation
  function validateForm() {
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmpassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return false;
    } else {
      return true;
    }
  }

  // Video container handling
  document.getElementById('video-container').addEventListener('click', function() {
    const videoContainer = this;

    // Toggle fullscreen mode
    videoContainer.classList.toggle('fullscreen');
  });

  document.getElementById('close-btn').addEventListener('click', function(event) {
    event.stopPropagation();
    const videoContainer = document.getElementById('video-container');
    const video = document.getElementById('minimized-video');

    video.pause();
    video.currentTime = 0;
    videoContainer.style.display = 'none';
  });

  // Floating links visibility based on footer
  window.addEventListener('scroll', function() {
    const footer = document.querySelector('.footer');
    const floatingLinks = document.querySelector('.floating-social-links');

    const footerRect = footer.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (footerRect.top <= windowHeight) {
      floatingLinks.style.display = 'none';
    } else {
      floatingLinks.style.display = 'flex';
    }
  });
