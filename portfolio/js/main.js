/* ==========================================================================
   SOC/SIEM ANALYST PORTFOLIO - MAIN JS
   ========================================================================== */

// Initialize AOS (Animate on Scroll)
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-quad',
      once: true,
      offset: 50
    });
  
    // Start processes
    initBootSequence();
    updateSystemTime();
    setInterval(updateSystemTime, 1000);
    initCursorGlow();
    initTypewriter();
    initLiveLogs();
    initRadarChart();
    initParticles();
    initCounters();
    initMobileMenu();
    initScrollProgress();
    initScrollSpy();
    initContactForm();
    initCredentialRadar();
  });
  
  /* ==========================================================================
     BOOT SEQUENCE
     ========================================================================== */
  const bootLines = [
    "[ OK ] Loading kernel modules...",
    "[ OK ] Mounting virtual filesystems...",
    "[ OK ] Initializing network interfaces...",
    "[ OK ] Starting SOC Environment telemetry...",
    "User: midhun@soc-lab",
    "Clearance: LEVEL_GREEN",
    "Role: Cybersecurity Student | Aspiring SOC Analyst",
    "Loading modules: [██████████████████] 100%",
    "SYSTEM ONLINE. Welcome, Analyst."
  ];
  
  function initBootSequence() {
    const bootText = document.getElementById('boot-text');
    const overlay = document.getElementById('boot-sequence');
    
    // Skip boot sequence if already visited in session
    if (sessionStorage.getItem('booted')) {
      overlay.style.display = 'none';
      return;
    }
  
    let lineIdx = 0;
    
    function typeLine() {
      if (lineIdx < bootLines.length) {
        bootText.innerHTML += bootLines[lineIdx] + "\n";
        lineIdx++;
        
        let delay = Math.random() * 200 + 50; // Random delay 50-250ms
        if (lineIdx === bootLines.length - 1) delay = 600; // Pause before last line
        
        setTimeout(typeLine, delay);
      } else {
        setTimeout(() => {
          overlay.classList.add('hide');
          sessionStorage.setItem('booted', 'true');
          setTimeout(() => { overlay.style.display = 'none'; }, 1000);
        }, 800);
      }
    }
    
    setTimeout(typeLine, 500);
  }
  
  /* ==========================================================================
     SYSTEM NAV BAR
     ========================================================================== */
  function updateSystemTime() {
    const timeEl = document.getElementById('sys-time');
    if (!timeEl) return;
    
    const now = new Date();
    // Format: HH:MM:SS UTC
    const hh = String(now.getUTCHours()).padStart(2, '0');
    const mm = String(now.getUTCMinutes()).padStart(2, '0');
    const ss = String(now.getUTCSeconds()).padStart(2, '0');
    
    timeEl.textContent = `${hh}:${mm}:${ss} UTC`;
  }
  
  /* ==========================================================================
     CURSOR GLOW TRACKING
     ========================================================================== */
  function initCursorGlow() {
    const glow = document.querySelector('.cursor-glow');
    if (!glow) {
      return;
    }
  
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    document.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    function animateGlow() {
      // Smooth easing
      glowX += (mouseX - glowX) * 0.15;
      glowY += (mouseY - glowY) * 0.15;
      
      // Use transform for better performance (no reflow)
      glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(animateGlow);
    }
    
    animateGlow();
  }
  
  /* ==========================================================================
     TYPEWRITER ROLE
     ========================================================================== */
  function initTypewriter() {
    const roles = [
      "Cybersecurity Student",
      "Aspiring SOC Analyst",
      "Threat Detection Learner",
      "Blue Team Enthusiast"
    ];
    const el = document.getElementById('role-typewriter');
    if (!el) return;
  
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
  
    function type() {
      const currentRole = roles[roleIdx];
      
      if (isDeleting) {
        el.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
      } else {
        el.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
      }
  
      let typeSpeed = isDeleting ? 50 : 100;
  
      if (!isDeleting && charIdx === currentRole.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typeSpeed = 500; // Pause before new word
      }
  
      setTimeout(type, typeSpeed);
    }
  
    type();
  }
  
  /* ==========================================================================
     STAT COUNTERS
     ========================================================================== */
  function initCounters() {
    const counters = document.querySelectorAll('.stat-value');
    const speed = 200; // Higher is slower
  
    const animate = (counter) => {
      const value = +counter.getAttribute('data-target');
      let data = 0;
      
      const step = () => {
        const time = value / speed;
        data += time;
        if (data < value) {
          counter.innerText = Math.ceil(data);
          requestAnimationFrame(step);
        } else {
          counter.innerText = value + "+";
        }
      };
      
      requestAnimationFrame(step);
    }
  
    // Intersection Observer to start animation when in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
  
    counters.forEach(counter => observer.observe(counter));
  }
  
  /* ==========================================================================
     LIVE LOG SIMULATOR
     ========================================================================== */
  function initLiveLogs() {
    const logContainer = document.getElementById('live-logs');
    if (!logContainer) return;
  
    const logEvents = [
      { msg: "Firewall: Blocked inbound connection from 192.168.1.45", level: "info" },
      { msg: "IDS: Detected possible SQLi payload in HTTP GET", level: "warn" },
      { msg: "Auth: Failed login attempt for user 'admin'", level: "warn" },
      { msg: "System: Antivirus signatures updated successfully", level: "info" },
      { msg: "Network: Unusual outbound traffic spike to Port 4444", level: "crit" },
      { msg: "Honeypot: SSH brute force attempt logged", level: "warn" },
      { msg: "SIEM: New alert rule deployed", level: "info" }
    ];
  
    function addLog() {
      const event = logEvents[Math.floor(Math.random() * logEvents.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
      
      // DOM element creation for security (avoid innerHTML)
      const p = document.createElement('p');
      p.className = `log-line ${event.level}`;
      
      const timestampSpan = document.createElement('span');
      timestampSpan.className = 'timestamp';
      timestampSpan.textContent = `[${timeStr}]`;
      
      const msgText = document.createTextNode(` ${event.msg}`);
      
      p.appendChild(timestampSpan);
      p.appendChild(msgText);
      
      logContainer.appendChild(p);
      
      // Keep only last 6 logs
      if (logContainer.children.length > 6) {
        logContainer.removeChild(logContainer.firstChild);
      }
  
      // Random delay for next log
      setTimeout(addLog, Math.random() * 3000 + 1000);
    }
  
    addLog();
  }
  
  /* ==========================================================================
     RADAR CHART (Chart.js)
     ========================================================================== */
  function initRadarChart() {
    const ctx = document.getElementById('skillsRadar');
    if (!ctx) return;
  
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Log Analysis', 'Incident Response', 'Threat Hunting', 'Cloud Security', 'Networking', 'Tool Dev (Python)'],
        datasets: [{
          label: 'Learning Progress',
          data: [80, 70, 75, 65, 85, 75],
          backgroundColor: 'rgba(0, 255, 204, 0.2)',
          borderColor: 'rgba(0, 255, 204, 1)',
          pointBackgroundColor: 'rgba(0, 191, 255, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(0, 191, 255, 1)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            pointLabels: {
              color: '#94a3b8',
              font: { family: "'Share Tech Mono', monospace", size: 11 }
            },
            ticks: { display: false, min: 0, max: 100 }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
  
  /* ==========================================================================
     PARTICLES.JS BACKGROUND
     ========================================================================== */
  function initParticles() {
    if (typeof particlesJS !== 'undefined') {
      particlesJS('particles-js', {
        particles: {
          number: { value: 40, density: { enable: true, value_area: 800 } },
          color: { value: "#00ffcc" },
          shape: { type: "circle" },
          opacity: { value: 0.3, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
          size: { value: 3, random: true },
          line_linked: { enable: true, distance: 150, color: "#00ffcc", opacity: 0.1, width: 1 },
          move: { enable: true, speed: 1, direction: "top", random: true, straight: false, out_mode: "out", bounce: false }
        },
        interactivity: {
          detect_on: "canvas",
          events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
          modes: { grab: { distance: 140, line_linked: { opacity: 0.5 } }, push: { particles_nb: 4 } }
        },
        retina_detect: true
      });
    }
  }

  /* ==========================================================================
     MOBILE MENU
     ========================================================================== */
  function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    if (!menuBtn || !navLinks) return;
    
    const icon = menuBtn.querySelector('i');
    
    menuBtn.addEventListener('click', () => {
      const isActive = navLinks.classList.toggle('active');
      menuBtn.setAttribute('aria-expanded', isActive);
      
      // Toggle icon
      if (isActive) {
        if(icon) { icon.classList.remove('bx-menu'); icon.classList.add('bx-x'); }
      } else {
        if(icon) { icon.classList.remove('bx-x'); icon.classList.add('bx-menu'); }
      }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        if(icon) { icon.classList.remove('bx-x'); icon.classList.add('bx-menu'); }
      });
    });
  }

  /* ==========================================================================
     SCROLL PROGRESS INDICATOR
     ========================================================================== */
  function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
          const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const scrolled = (winScroll / height) * 100;
          progressBar.style.width = scrolled + "%";
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ==========================================================================
     SCROLL SPY (Active Nav Link)
     ========================================================================== */
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[data-section], header[data-section]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    if (!sections.length || !navLinks.length) return;
    
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Trigger when section is nicely in view
      threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active-link');
            }
          });
        }
      });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
  }

  /* ==========================================================================
     CONTACT FORM & EMAILJS INTEGRATION
     ========================================================================== */
  function initContactForm() {
    // Initialize EmailJS (User needs to replace these with actual keys)
    // emailjs.init("YOUR_PUBLIC_KEY");

    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
    const loaderIcon = submitBtn ? submitBtn.querySelector('.loader-icon') : null;
    const statusDiv = document.getElementById('formStatus');

    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Basic validation
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // UI State: Loading
      submitBtn.disabled = true;
      btnText.textContent = "TRANSMITTING...";
      loaderIcon.style.display = 'inline-block';
      statusDiv.style.display = 'none';
      statusDiv.className = 'terminal-status';

      // Prepare parameters for EmailJS
      const templateParams = {
        from_name: document.getElementById('senderName').value,
        from_email: document.getElementById('senderEmail').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
      };

      // EmailJS Send Call
      // REPLACE 'YOUR_SERVICE_ID' AND 'YOUR_TEMPLATE_ID'
      /*
      emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(function(response) {
          handleResponse(true);
        }, function(error) {
          handleResponse(false, error);
        });
      */

      // Simulated delay for UI demonstration if EmailJS isn't fully configured
      setTimeout(() => {
        // Assume success for demo if emailjs is not active
        if (typeof emailjs === 'undefined' || !emailjs.send) {
           handleResponse(true);
        }
      }, 2000);

      function handleResponse(success, error) {
        submitBtn.disabled = false;
        btnText.textContent = "TRANSMIT_DATA()";
        loaderIcon.style.display = 'none';
        
        statusDiv.style.display = 'block';
        if (success) {
          statusDiv.className = 'terminal-status success';
          statusDiv.innerHTML = "<i class='bx bx-check-shield'></i> SECURE CHANNEL ESTABLISHED: Message transmitted successfully.";
          form.reset();
        } else {
          statusDiv.className = 'terminal-status error';
          statusDiv.innerHTML = "<i class='bx bx-error-alt'></i> TRANSMISSION FAILED: Connection interrupted. Please try again.";
          console.error('EmailJS Error:', error);
        }

        // Hide status after 5 seconds
        setTimeout(() => {
          statusDiv.style.display = 'none';
        }, 5000);
      }
    });
  }

/* ==========================================================================
   CREDENTIAL RADAR COMMAND CENTER
   ========================================================================== */
function initCredentialRadar() {

  // ---------- Config ----------
  const ORBIT_CONFIG = {
    inner:  { selector: '#orbit-inner',  speed: 0.0007, dir: 1  },
    middle: { selector: '#orbit-middle', speed: 0.0005, dir: -1 },
    outer:  { selector: '#orbit-outer',  speed: 0.0003, dir: 1  }
  };

  // Collect orbits: { el, nodes, angle, speed, dir }
  const orbits = [];

  Object.values(ORBIT_CONFIG).forEach(cfg => {
    const el = document.querySelector(cfg.selector);
    if (!el) return;
    const nodes = Array.from(el.querySelectorAll('.badge-node'));
    const count = nodes.length;
    // Spread nodes evenly around the ring from a random start angle
    const startAngle = Math.random() * Math.PI * 2;
    const angleStep  = (Math.PI * 2) / count;

    nodes.forEach((node, i) => {
      // Store initial angle per node (offset evenly)
      node._orbitAngle = startAngle + angleStep * i;
    });

    orbits.push({ el, nodes, speed: cfg.speed, dir: cfg.dir });
  });

  // ---------- Position badge nodes on ring edge ----------
  function positionNode(node, orbit) {
    // Orbit el is square, centred at 50% 50% of radar-container
    // radius = 50% of orbit el (i.e. half its CSS width)
    const r = orbit.el.offsetWidth / 2;
    const x = Math.cos(node._orbitAngle) * r + r; // px from left of orbit el
    const y = Math.sin(node._orbitAngle) * r + r; // px from top  of orbit el
    node.style.left = x + 'px';
    node.style.top  = y + 'px';
  }

  // ---------- Hover / focus pause ----------
  const pausedNodes = new Set();

  orbits.forEach(orbit => {
    orbit.nodes.forEach(node => {
      node.addEventListener('mouseenter', () => pausedNodes.add(node));
      node.addEventListener('mouseleave', () => pausedNodes.delete(node));
      node.addEventListener('focus',      () => pausedNodes.add(node));
      node.addEventListener('blur',       () => pausedNodes.delete(node));
    });
  });

  // ---------- Animation loop ----------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastTime = null;

  function animateOrbits(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime;
    lastTime = timestamp;

    if (!prefersReducedMotion) {
      orbits.forEach(orbit => {
        orbit.nodes.forEach(node => {
          if (!pausedNodes.has(node)) {
            node._orbitAngle += orbit.speed * orbit.dir * delta;
          }
          positionNode(node, orbit);
        });
      });
    } else {
      // Reduced motion: just position once without rotating
      orbits.forEach(orbit => {
        orbit.nodes.forEach(node => positionNode(node, orbit));
      });
    }

    radarRAF = requestAnimationFrame(animateOrbits);
  }

  let radarRAF = requestAnimationFrame(animateOrbits);

  // Pause animation when radar is out of viewport (performance)
  const radarContainer = document.getElementById('credentialRadar');
  if (radarContainer) {
    const visObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!radarRAF) radarRAF = requestAnimationFrame(animateOrbits);
        } else {
          cancelAnimationFrame(radarRAF);
          radarRAF = null;
          lastTime = null;
        }
      });
    }, { threshold: 0.05 });
    visObs.observe(radarContainer);
  }

  // ---------- Modal ----------
  const modal       = document.getElementById('badgeModal');
  const modalClose  = document.getElementById('modalCloseBtn');
  const modalImg    = document.getElementById('modalBadgeImg');
  const modalName   = document.getElementById('modalBadgeName');
  const modalIssuer = document.getElementById('modalIssuer');
  const modalCat    = document.getElementById('modalCategory');

  if (!modal) return;

  function openModal(node) {
    const img = node.querySelector('img');
    modalImg.src    = img ? img.src    : '';
    modalImg.alt    = img ? img.alt    : '';
    modalName.textContent   = node.dataset.name    || '';
    modalIssuer.textContent = node.dataset.issuer  || '';
    modalCat.textContent    = node.dataset.category || '';

    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus the close button for keyboard accessibility
    setTimeout(() => modalClose && modalClose.focus(), 50);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Badge node click → open modal
  document.querySelectorAll('.badge-node').forEach(node => {
    node.addEventListener('click', () => openModal(node));
    // Keyboard: Enter / Space
    node.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(node);
      }
    });
  });

  // Close button
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // Click backdrop to close
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  // Escape key closes modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}
