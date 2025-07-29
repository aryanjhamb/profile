// DOM Elements
const cursorFollower = document.querySelector(".cursor-follower")
const scrollProgress = document.querySelector(".scroll-progress")
const backToTopBtn = document.getElementById("backToTop")
const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav-menu")
const typingText = document.querySelector(".typing-text")
const particlesContainer = document.querySelector(".particles-container")

// Typing Animation
const texts = ["Frontend Developer", "Problem Solver", "Tech Enthusiast"]
let textIndex = 0
let charIndex = 0
let isDeleting = false

function typeWriter() {
  const currentText = texts[textIndex]

  if (isDeleting) {
    typingText.textContent = currentText.substring(0, charIndex - 1)
    charIndex--
  } else {
    typingText.textContent = currentText.substring(0, charIndex + 1)
    charIndex++
  }

  if (!isDeleting && charIndex === currentText.length) {
    setTimeout(() => (isDeleting = true), 1000)
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false
    textIndex = (textIndex + 1) % texts.length
  }

  const typingSpeed = isDeleting ? 50 : 100
  setTimeout(typeWriter, typingSpeed)
}

// Start typing animation
typeWriter()

// Cursor Follower
let mouseX = 0
let mouseY = 0
let cursorX = 0
let cursorY = 0

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX
  mouseY = e.clientY
})

function animateCursor() {
  const speed = 0.1
  cursorX += (mouseX - cursorX) * speed
  cursorY += (mouseY - cursorY) * speed

  cursorFollower.style.left = cursorX + "px"
  cursorFollower.style.top = cursorY + "px"

  requestAnimationFrame(animateCursor)
}

animateCursor()

// Interactive elements cursor effect
const interactiveElements = document.querySelectorAll("a, button, .interactive")
interactiveElements.forEach((element) => {
  element.addEventListener("mouseenter", () => {
    cursorFollower.style.transform = "scale(2)"
  })

  element.addEventListener("mouseleave", () => {
    cursorFollower.style.transform = "scale(1)"
  })
})

// Scroll Progress
window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset
  const docHeight = document.body.offsetHeight - window.innerHeight
  const scrollPercent = (scrollTop / docHeight) * 100

  scrollProgress.style.width = scrollPercent + "%"

  // Back to top button
  if (scrollTop > 300) {
    backToTopBtn.classList.add("visible")
  } else {
    backToTopBtn.classList.remove("visible")
  }
})

// Back to top functionality
backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
})

// Mobile Navigation
hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active")
  hamburger.classList.toggle("active")
})

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
    // Close mobile menu if open
    navMenu.classList.remove("active")
    hamburger.classList.remove("active")
  })
})

// Floating Particles
function createParticle() {
  const particle = document.createElement("div")
  particle.className = "particle"
  particle.style.left = Math.random() * 100 + "%"
  particle.style.animationDuration = Math.random() * 10 + 10 + "s"
  particle.style.animationDelay = Math.random() * 5 + "s"

  particlesContainer.appendChild(particle)

  // Remove particle after animation
  setTimeout(() => {
    if (particle.parentNode) {
      particle.parentNode.removeChild(particle)
    }
  }, 20000)
}

// Create particles periodically
setInterval(createParticle, 2000)

// Initial particles
for (let i = 0; i < 10; i++) {
  setTimeout(createParticle, i * 200)
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"

      // Animate skill bars
      if (entry.target.classList.contains("skill-card")) {
        const progressBar = entry.target.querySelector(".skill-progress")
        const width = progressBar.getAttribute("data-width")
        setTimeout(() => {
          progressBar.style.width = width
        }, 200)
      }

      // Animate progress rings
      if (entry.target.classList.contains("achievement-card")) {
        const progressCircle = entry.target.querySelector(".progress-ring-circle")
        const progress = progressCircle.getAttribute("data-progress")
        const circumference = 2 * Math.PI * 35
        const offset = circumference - (progress / 100) * circumference

        setTimeout(() => {
          progressCircle.style.strokeDashoffset = offset
        }, 500)
      }

      // Animate counters
      if (entry.target.classList.contains("stat-number")) {
        animateCounter(entry.target)
      }

      observer.unobserve(entry.target)
    }
  })
}, observerOptions)

// Observe elements for animation
document
  .querySelectorAll(".skill-card, .achievement-card, .project-card, .stat-card, .testimonial-card")
  .forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(50px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })

// Counter Animation
function animateCounter(element) {
  const target = Number.parseInt(element.getAttribute("data-target"))
  const duration = 600 // was 2000, now much faster
  const step = target / (duration / 12)
  let current = 0

  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = Math.floor(current) + (element.textContent.includes("%") ? "%" : "+")
  }, 16)
}

// Testimonials Carousel
let currentTestimonial = 0
const testimonialCards = document.querySelectorAll(".testimonial-card")
const testimonialDots = document.querySelectorAll(".dot")

function showTestimonial(index) {
  testimonialCards.forEach((card, i) => {
    card.classList.toggle("active", i === index)
  })

  testimonialDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index)
  })
}

// Auto-rotate testimonials
setInterval(() => {
  currentTestimonial = (currentTestimonial + 1) % testimonialCards.length
  showTestimonial(currentTestimonial)
}, 5000)

// Dot navigation
testimonialDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentTestimonial = index
    showTestimonial(currentTestimonial)
  })
})

// Parallax Effect
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const parallaxElements = document.querySelectorAll(".hero-background")

  parallaxElements.forEach((element) => {
    const speed = 0.5
    element.style.transform = `translateY(${scrolled * speed}px)`
  })
})

// Magnetic Effect for buttons and cards
function addMagneticEffect(elements) {
  elements.forEach((element) => {
    element.addEventListener("mousemove", (e) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      const strength = 0.3
      element.style.transform = `translate(${x * strength}px, ${y * strength}px) scale(1.05)`
    })

    element.addEventListener("mouseleave", () => {
      element.style.transform = "translate(0px, 0px) scale(1)"
    })
  })
}

// Apply magnetic effect to interactive elements
addMagneticEffect(document.querySelectorAll(".btn, .social-link, .achievement-card, .project-card"))

// Glitch Effect for special text
function glitchText(element, intensity = 5, duration = 100) {
  const originalText = element.textContent
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()"

  const glitch = () => {
    let glitchedText = ""
    for (let i = 0; i < originalText.length; i++) {
      if (Math.random() < 0.1) {
        glitchedText += chars[Math.floor(Math.random() * chars.length)]
      } else {
        glitchedText += originalText[i]
      }
    }
    element.textContent = glitchedText

    setTimeout(() => {
      element.textContent = originalText
    }, duration)
  }

  for (let i = 0; i < intensity; i++) {
    setTimeout(glitch, i * (duration + 50))
  }
}

// Add glitch effect to logo on hover
document.querySelector(".nav-logo").addEventListener("mouseenter", function () {
  glitchText(this, 3, 150)
})

// Tilt Effect for cards
function addTiltEffect(elements) {
  elements.forEach((element) => {
    element.addEventListener("mousemove", (e) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10

      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
    })

    element.addEventListener("mouseleave", () => {
      element.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
    })
  })
}

// Apply tilt effect to project cards
addTiltEffect(document.querySelectorAll(".project-card"))

// Floating Animation for profile elements
function floatingAnimation() {
  const floatingElements = document.querySelectorAll(".floating-element")

  floatingElements.forEach((element, index) => {
    const amplitude = 20 + index * 5
    const frequency = 0.02 + index * 0.01
    const phase = (index * Math.PI) / 3

    function animate() {
      const time = Date.now() * frequency
      const y = Math.sin(time + phase) * amplitude
      const x = Math.cos(time * 0.5 + phase) * (amplitude * 0.5)

      element.style.transform = `translate(${x}px, ${y}px)`
      requestAnimationFrame(animate)
    }

    animate()
  })
}

// Start floating animation
floatingAnimation()

// Scroll-triggered animations
function handleScrollAnimations() {
  const elements = document.querySelectorAll("[data-animate]")

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top
    const elementVisible = 150

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("animate")
    }
  })
}

window.addEventListener("scroll", handleScrollAnimations)

// Matrix Rain Effect (Easter Egg)
function createMatrixRain() {
  const canvas = document.createElement("canvas")
  canvas.style.position = "fixed"
  canvas.style.top = "0"
  canvas.style.left = "0"
  canvas.style.width = "100%"
  canvas.style.height = "100%"
  canvas.style.pointerEvents = "none"
  canvas.style.zIndex = "-1"
  canvas.style.opacity = "0.1"

  document.body.appendChild(canvas)

  const ctx = canvas.getContext("2d")
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()"
  const fontSize = 14
  const columns = Math.floor(canvas.width / fontSize)
  const drops = new Array(columns).fill(1)

  function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "#00ff00"
    ctx.font = `${fontSize}px monospace`

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)]
      ctx.fillText(text, i * fontSize, drops[i] * fontSize)

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0
      }
      drops[i]++
    }
  }

  setInterval(draw, 33)

  // Remove matrix after 10 seconds
  setTimeout(() => {
    document.body.removeChild(canvas)
  }, 10000)
}

// Trigger matrix rain on Konami code
let konamiCode = []
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65] // ↑↑↓↓←→←→BA

document.addEventListener("keydown", (e) => {
  konamiCode.push(e.keyCode)

  if (konamiCode.length > konamiSequence.length) {
    konamiCode.shift()
  }

  if (konamiCode.join(",") === konamiSequence.join(",")) {
    createMatrixRain()
    konamiCode = []
  }
})

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Apply throttling to scroll events
window.addEventListener(
  "scroll",
  throttle(() => {
    // Scroll-dependent animations here
  }, 16),
)

// Lazy loading for images
function lazyLoadImages() {
  const images = document.querySelectorAll("img[data-src]")
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// Initialize lazy loading
lazyLoadImages()

// Add SVG gradient for progress rings
function addSVGGradients() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.style.position = "absolute"
  svg.style.width = "0"
  svg.style.height = "0"

  svg.innerHTML = `
        <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
            </linearGradient>
        </defs>
    `

  document.body.appendChild(svg)
}

// Initialize SVG gradients
addSVGGradients()

// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

function setDarkMode(enabled) {
  if (enabled) {
    body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'true');
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'false');
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
}

darkModeToggle.addEventListener('click', () => {
  setDarkMode(!body.classList.contains('dark-mode'));
});

// On page load, set dark mode if user previously enabled it
if (localStorage.getItem('darkMode') === 'true') {
  setDarkMode(true);
} else {
  setDarkMode(false);
}

// Console Easter Egg
console.log(`
    ╔══════════════════════════════════════╗
    ║          Welcome to my website!      ║
    ║                                      ║
    ║  Built with ❤️ by Aryan Jhamb        ║
    ╚══════════════════════════════════════╝
`)

// Initialize all animations when page loads
document.addEventListener("DOMContentLoaded", () => {
  // Add initial animations
  setTimeout(() => {
    document.body.classList.add("loaded")
  }, 100)

  // Trigger initial scroll animations
  handleScrollAnimations()
})

// Handle window resize
window.addEventListener(
  "resize",
  throttle(() => {
    // Recalculate positions and sizes
    const canvas = document.querySelector("canvas")
    if (canvas) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
  }, 250),
)

// Service Worker Registration (for PWA capabilities)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}
