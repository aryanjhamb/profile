// Advanced JavaScript animations and interactions

// Particle System Class
class ParticleSystem {
  constructor(canvas, options = {}) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.particles = []
    this.options = {
      particleCount: options.particleCount || 50,
      particleSize: options.particleSize || 2,
      particleSpeed: options.particleSpeed || 1,
      particleColor: options.particleColor || "#3b82f6",
      connectionDistance: options.connectionDistance || 100,
      ...options,
    }

    this.init()
    this.animate()
  }

  init() {
    // Resize canvas to full screen
    this.resizeCanvas()
    window.addEventListener("resize", () => this.resizeCanvas())

    // Create particles
    for (let i = 0; i < this.options.particleCount; i++) {
      this.particles.push(this.createParticle())
    }
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * this.options.particleSpeed,
      vy: (Math.random() - 0.5) * this.options.particleSpeed,
      size: Math.random() * this.options.particleSize + 1,
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx
      particle.y += particle.vy

      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1

      // Keep particles in bounds
      particle.x = Math.max(0, Math.min(this.canvas.width, particle.x))
      particle.y = Math.max(0, Math.min(this.canvas.height, particle.y))
    })
  }

  drawParticles() {
    this.ctx.fillStyle = this.options.particleColor
    this.particles.forEach((particle) => {
      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      this.ctx.fill()
    })
  }

  drawConnections() {
    this.ctx.strokeStyle = this.options.particleColor
    this.ctx.lineWidth = 0.5

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x
        const dy = this.particles[i].y - this.particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < this.options.connectionDistance) {
          const opacity = 1 - distance / this.options.connectionDistance
          this.ctx.globalAlpha = opacity * 0.3
          this.ctx.beginPath()
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y)
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y)
          this.ctx.stroke()
        }
      }
    }
    this.ctx.globalAlpha = 1
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.updateParticles()
    this.drawConnections()
    this.drawParticles()
    requestAnimationFrame(() => this.animate())
  }
}

// Matrix Rain Effect
class MatrixRain {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()"
    this.fontSize = 14
    this.columns = Math.floor(canvas.width / this.fontSize)
    this.drops = new Array(this.columns).fill(1)

    this.animate()
  }

  animate() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.fillStyle = "#00ff00"
    this.ctx.font = `${this.fontSize}px monospace`

    for (let i = 0; i < this.drops.length; i++) {
      const text = this.chars[Math.floor(Math.random() * this.chars.length)]
      this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize)

      if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0
      }
      this.drops[i]++
    }

    requestAnimationFrame(() => this.animate())
  }
}

// Magnetic Mouse Effect
class MagneticEffect {
  constructor(element, strength = 0.3) {
    this.element = element
    this.strength = strength
    this.rect = element.getBoundingClientRect()

    this.init()
  }

  init() {
    this.element.addEventListener("mouseenter", (e) => this.onMouseEnter(e))
    this.element.addEventListener("mousemove", (e) => this.onMouseMove(e))
    this.element.addEventListener("mouseleave", (e) => this.onMouseLeave(e))

    window.addEventListener("resize", () => {
      this.rect = this.element.getBoundingClientRect()
    })
  }

  onMouseEnter(e) {
    this.element.style.transition = "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
  }

  onMouseMove(e) {
    const { left, top, width, height } = this.rect
    const centerX = left + width / 2
    const centerY = top + height / 2

    const deltaX = (e.clientX - centerX) * this.strength
    const deltaY = (e.clientY - centerY) * this.strength

    this.element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`
  }

  onMouseLeave(e) {
    this.element.style.transform = "translate(0px, 0px) scale(1)"
  }
}

// Parallax Scroll Effect
class ParallaxScroll {
  constructor() {
    this.elements = document.querySelectorAll("[data-parallax]")
    this.init()
  }

  init() {
    window.addEventListener("scroll", () => this.updateParallax())
    this.updateParallax()
  }

  updateParallax() {
    const scrollTop = window.pageYOffset

    this.elements.forEach((element) => {
      const speed = Number.parseFloat(element.dataset.parallax) || 0.5
      const yPos = -(scrollTop * speed)
      element.style.transform = `translateY(${yPos}px)`
    })
  }
}

// Smooth Scroll with Easing
class SmoothScroll {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault()
        const target = document.querySelector(anchor.getAttribute("href"))
        if (target) {
          this.scrollTo(target.offsetTop, 1000)
        }
      })
    })
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  }

  scrollTo(to, duration) {
    const start = window.pageYOffset
    const change = to - start
    const startTime = performance.now()

    const animateScroll = (currentTime) => {
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      const easedProgress = this.easeInOutCubic(progress)

      window.scrollTo(0, start + change * easedProgress)

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }

    requestAnimationFrame(animateScroll)
  }
}

// Text Animation Effects
class TextAnimations {
  static typeWriter(element, text, speed = 50) {
    let i = 0
    element.innerHTML = ""

    const timer = setInterval(() => {
      if (i < text.length) {
        element.innerHTML += text.charAt(i)
        i++
      } else {
        clearInterval(timer)
      }
    }, speed)
  }

  static scrambleText(element, finalText, duration = 2000) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()"
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      let result = ""
      for (let i = 0; i < finalText.length; i++) {
        if (progress * finalText.length > i) {
          result += finalText[i]
        } else {
          result += chars[Math.floor(Math.random() * chars.length)]
        }
      }

      element.textContent = result

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }

  static glitchText(element, intensity = 5, duration = 100) {
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
}

// 3D Card Flip Effect
class Card3D {
  constructor(element) {
    this.element = element
    this.isFlipped = false
    this.init()
  }

  init() {
    this.element.addEventListener("click", () => this.flip())
    this.element.style.transformStyle = "preserve-3d"
    this.element.style.transition = "transform 0.6s"
  }

  flip() {
    this.isFlipped = !this.isFlipped
    this.element.style.transform = this.isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
  }
}

// Intersection Observer for Animations
class ScrollAnimations {
  constructor() {
    this.observer = new IntersectionObserver((entries) => this.handleIntersection(entries), {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    })

    this.init()
  }

  init() {
    document.querySelectorAll("[data-animate]").forEach((element) => {
      this.observer.observe(element)
    })
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const animation = entry.target.dataset.animate
        this.triggerAnimation(entry.target, animation)
        this.observer.unobserve(entry.target)
      }
    })
  }

  triggerAnimation(element, animation) {
    switch (animation) {
      case "fadeInUp":
        element.style.opacity = "0"
        element.style.transform = "translateY(50px)"
        element.style.transition = "opacity 0.6s ease, transform 0.6s ease"
        setTimeout(() => {
          element.style.opacity = "1"
          element.style.transform = "translateY(0)"
        }, 100)
        break

      case "slideInLeft":
        element.style.opacity = "0"
        element.style.transform = "translateX(-100px)"
        element.style.transition = "opacity 0.8s ease, transform 0.8s ease"
        setTimeout(() => {
          element.style.opacity = "1"
          element.style.transform = "translateX(0)"
        }, 100)
        break

      case "scaleIn":
        element.style.opacity = "0"
        element.style.transform = "scale(0.8)"
        element.style.transition = "opacity 0.5s ease, transform 0.5s ease"
        setTimeout(() => {
          element.style.opacity = "1"
          element.style.transform = "scale(1)"
        }, 100)
        break

      case "rotateIn":
        element.style.opacity = "0"
        element.style.transform = "rotate(-180deg) scale(0.5)"
        element.style.transition = "opacity 0.8s ease, transform 0.8s ease"
        setTimeout(() => {
          element.style.opacity = "1"
          element.style.transform = "rotate(0deg) scale(1)"
        }, 100)
        break
    }
  }
}

// Mouse Trail Effect
class MouseTrail {
  constructor() {
    this.trail = []
    this.maxTrail = 20
    this.init()
  }

  init() {
    document.addEventListener("mousemove", (e) => this.addTrailPoint(e))
    this.animate()
  }

  addTrailPoint(e) {
    this.trail.push({
      x: e.clientX,
      y: e.clientY,
      life: 1,
    })

    if (this.trail.length > this.maxTrail) {
      this.trail.shift()
    }
  }

  animate() {
    // Remove existing trail elements
    document.querySelectorAll(".mouse-trail-point").forEach((el) => el.remove())

    // Create new trail elements
    this.trail.forEach((point, index) => {
      const element = document.createElement("div")
      element.className = "mouse-trail-point"
      element.style.cssText = `
        position: fixed;
        left: ${point.x}px;
        top: ${point.y}px;
        width: ${10 - index * 0.5}px;
        height: ${10 - index * 0.5}px;
        background: radial-gradient(circle, rgba(59, 130, 246, ${point.life}) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
      `
      document.body.appendChild(element)

      // Fade out the point
      point.life -= 0.05
    })

    // Remove dead points
    this.trail = this.trail.filter((point) => point.life > 0)

    requestAnimationFrame(() => this.animate())
  }
}

// Initialize all animations when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize particle system if canvas exists
  const particleCanvas = document.getElementById("particle-canvas")
  if (particleCanvas) {
    new ParticleSystem(particleCanvas)
  }

  // Initialize matrix rain if canvas exists
  const matrixCanvas = document.getElementById("matrix-canvas")
  if (matrixCanvas) {
    new MatrixRain(matrixCanvas)
  }

  // Initialize magnetic effects
  document.querySelectorAll(".magnetic").forEach((element) => {
    new MagneticEffect(element)
  })

  // Initialize 3D cards
  document.querySelectorAll(".card-3d").forEach((element) => {
    new Card3D(element)
  })

  // Initialize scroll animations
  new ScrollAnimations()
  new ParallaxScroll()
  new SmoothScroll()
  new MouseTrail()

  // Add some interactive text effects
  const glitchElements = document.querySelectorAll(".glitch-text")
  glitchElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      TextAnimations.glitchText(element, 3, 150)
    })
  })

  // Add typewriter effect to specific elements
  const typewriterElements = document.querySelectorAll(".typewriter-text")
  typewriterElements.forEach((element) => {
    const text = element.textContent
    element.addEventListener("mouseenter", () => {
      TextAnimations.typeWriter(element, text, 100)
    })
  })
})

console.log("Advanced animations loaded successfully!")
