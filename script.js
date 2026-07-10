// ============================================
// Footer year
// ============================================
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================
// Live Eswatini clock (SAST, shared offset with Africa/Johannesburg)
// ============================================
const clockEl = document.getElementById('clock');
function updateClock() {
  const now = new Date();
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Johannesburg',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(now);
  clockEl.textContent = `MATSAPHA · ${time} SAST`;
}
updateClock();
setInterval(updateClock, 1000);

// ============================================
// Mobile nav toggle
// ============================================
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// ============================================
// Header shadow / background on scroll
// ============================================
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.style.borderBottomColor = window.scrollY > 20 ? 'var(--line)' : 'transparent';
}, { passive: true });

// ============================================
// Reveal timeline stops on scroll
// ============================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const stops = document.querySelectorAll('.stop');

if (prefersReducedMotion) {
  stops.forEach(stop => stop.classList.add('in-view'));
} else {
  const stopObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.35, rootMargin: '0px 0px -10% 0px' });

  stops.forEach(stop => stopObserver.observe(stop));
}

// ============================================
// Route progress line — fills as the user scrolls through the timeline
// ============================================
const timeline = document.getElementById('timeline');
const timelineProgress = document.getElementById('timelineProgress');

function updateTimelineProgress() {
  const rect = timeline.getBoundingClientRect();
  const viewportH = window.innerHeight;

  // Progress starts when top of timeline reaches bottom of viewport,
  // completes when bottom of timeline reaches middle of viewport.
  const start = viewportH * 0.9;
  const end = viewportH * 0.4;
  const total = rect.height + start - end;
  const traveled = start - rect.top;

  const progress = Math.min(1, Math.max(0, traveled / total));
  timelineProgress.style.height = `${progress * 100}%`;
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateTimelineProgress();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

updateTimelineProgress();

// ============================================
// Generic section reveal (ventures, toolkit, press)
// ============================================
const revealTargets = document.querySelectorAll('.venture-card, .toolkit-panel, .repo-item, .repo-item--featured, .press-list li');

revealTargets.forEach(el => {
  el.style.opacity = prefersReducedMotion ? '1' : '0';
  el.style.transform = prefersReducedMotion ? 'none' : 'translateY(16px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));
}
