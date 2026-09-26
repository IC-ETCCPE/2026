/* =============================================
   IC-ETCCPE 2026 — Interactive Scripts
   Department of Chemical Engineering, IIT Jodhpur
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation Bar
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // 2. Mobile Drawer Toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
    });

    // Close menu when link clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  // 3. Scroll Reveal Animations (Intersection Observer)
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // 4. Invited Speaker Carousel
  const speakerStage = document.querySelector('.speaker-stage');
  const speakerSlides = Array.from(document.querySelectorAll('.speaker-slide'));
  const speakerPages = Array.from(document.querySelectorAll('.speaker-page'));
  if (speakerStage && speakerSlides.length && speakerPages.length === 3) {
    const speakerCards = speakerSlides.flatMap(slide => Array.from(slide.querySelectorAll('.speaker-card')));
    const speakerTrack = document.createElement('div');
    speakerTrack.className = 'speaker-track';
    speakerCards.forEach(card => speakerTrack.append(card));
    speakerCards.slice(0, 4).forEach(card => {
      const copy = card.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      copy.inert = true;
      speakerTrack.append(copy);
    });
    speakerStage.replaceChildren(speakerTrack);

    let currentPosition = 0;
    let speakerResetTimer;

    function showSpeakerPosition(position, animate = true) {
      currentPosition = position;
      const mobileLayout = window.matchMedia('(max-width: 768px)').matches;
      if (mobileLayout) {
        Array.from(speakerTrack.children).forEach((card, cardIndex) => {
          const isVisible = cardIndex >= position && cardIndex < position + 4;
          const wasVisible = card.classList.contains('is-visible');
          card.classList.toggle('is-visible', isVisible);
          card.classList.toggle('is-entering', isVisible && animate && !wasVisible);
          card.setAttribute('aria-hidden', String(!isVisible));
          card.inert = !isVisible;
        });
      } else {
        const offset = speakerTrack.children[position].offsetLeft;
        if (!animate) speakerTrack.style.transition = 'none';
        speakerTrack.style.transform = `translateX(-${offset}px)`;
        if (!animate) {
          speakerTrack.offsetHeight;
          speakerTrack.style.removeProperty('transition');
        }

        Array.from(speakerTrack.children).forEach((card, cardIndex) => {
          const isVisible = cardIndex >= position && cardIndex < position + 4;
          card.setAttribute('aria-hidden', String(!isVisible));
          card.inert = !isVisible;
        });
      }

      const activePage = Math.floor((position % speakerCards.length) / 3);
      speakerPages.forEach((page, pageIndex) => {
        const isActive = pageIndex === activePage;
        page.classList.toggle('is-active', isActive);
        if (isActive) page.setAttribute('aria-current', 'true');
        else page.removeAttribute('aria-current');
      });
    }

    function advanceSpeakerPosition() {
      if (currentPosition === speakerCards.length - 1) {
        showSpeakerPosition(speakerCards.length, true);
        speakerResetTimer = window.setTimeout(() => showSpeakerPosition(0, false), 620);
      } else {
        showSpeakerPosition(currentPosition + 1);
      }
    }

    showSpeakerPosition(0, false);
    let speakerTimer = window.setInterval(advanceSpeakerPosition, 3000);
    speakerPages.forEach((page, pageIndex) => {
      page.addEventListener('click', () => {
        window.clearTimeout(speakerResetTimer);
        showSpeakerPosition(pageIndex * 3);
        window.clearInterval(speakerTimer);
        speakerTimer = window.setInterval(advanceSpeakerPosition, 3000);
      });
    });

    window.addEventListener('resize', () => showSpeakerPosition(currentPosition, false));
  }

  // 4. Live Countdown Timer to December 19, 2026
  const conferenceDate = new Date('2026-12-19T09:00:00+05:30').getTime();

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = conferenceDate - now;

    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      const label = document.querySelector('.countdown-label');
      if (label) label.textContent = '🎉 IC-ETCCPE 2026 is Live Now!';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minsEl.textContent = pad(minutes);
    secsEl.textContent = pad(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 5. Hero Particle Canvas Animation (Molecular Nodes & Connections)
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 22), 65);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2.5 + 1.5;
        this.color = Math.random() > 0.4 ? 'rgba(6, 182, 212, ' : 'rgba(13, 148, 136, ';
        this.alpha = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#06b6d4';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Connect near particles with chemical bond lines
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.35 * (1 - dist / 130)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  }
});
