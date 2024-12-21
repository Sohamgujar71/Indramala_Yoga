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

  document.getElementById('video-container').addEventListener('click', function () {
    const videoContainer = this;

    // Toggle fullscreen mode
    videoContainer.classList.toggle('fullscreen');
});

document.getElementById('close-btn').addEventListener('click', function (event) {
  event.stopPropagation();
  const videoContainer = document.getElementById('video-container');
  const iframe = document.getElementById('embedded-video');
  const videoSrc = iframe.src;
  iframe.src = ''; // Temporarily clear the src to stop playback
  iframe.src = videoSrc; // Reset the src for potential reuse

  // Hide the video container
  videoContainer.style.display = 'none';
});


// Add keyboard support (Escape to close fullscreen)
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        const videoContainer = document.getElementById('video-container');
        if (videoContainer.classList.contains('fullscreen')) {
            videoContainer.classList.remove('fullscreen');
        }
    }
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

  document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    let lastScrollTop = 0;
    let isMenuOpen = false; // Track whether the menu is open via hamburger click
  
    // Only apply the scroll hide behavior on mobile screens
    const isMobile = window.innerWidth <= 1024; // Check if the screen width is 1024px or less
  
    if (isMobile) {
      // Initially hide the navLinks on mobile
      navLinks.classList.add('hide');
  
      // Handle scroll to hide the nav menu on scroll down for mobile screens only
      window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
        if (scrollTop > lastScrollTop) {
          // Hide nav menu only on scroll down
          navLinks.classList.add('hide');
        } else {
          // Don't show the menu when scrolling up unless hamburger is clicked
          if (!isMenuOpen) {
            navLinks.classList.add('hide');
          }
        }
  
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Update last scroll position
      });
    }
  
    // Handle hamburger click to toggle the menu visibility
    hamburger.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen; // Toggle the menu open/close state
  
      if (isMenuOpen) {
        navLinks.classList.remove('hide'); // Show the menu when hamburger is clicked
      } else {
        navLinks.classList.add('hide'); // Hide the menu when hamburger is clicked again
      }
    });
  });
  