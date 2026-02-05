document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const nav = document.querySelector(".site-header");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav__link");
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle?.querySelector(".theme-toggle__icon") || null;
  const particleLayer = document.getElementById("particle-layer");
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const yearSpan = document.getElementById("year");

  const musicToggle = document.getElementById("music-toggle");
  const musicIcon = musicToggle?.querySelector(".music-toggle__icon") || null;
  const bgMusic = document.getElementById("bg-music");

  let particlesEnabled = false;

  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }

  if (bgMusic) {
    try {
      bgMusic.volume = 0.6;
    } catch (e) {}
  }

  const createParticles = () => {
    if (!particleLayer || particlesEnabled) return;
    particlesEnabled = true;

    const count = window.innerWidth < 640 ? 35 : 70;

    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "particle";

      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const duration = 12 + Math.random() * 10;
      const delay = -Math.random() * duration;
      const tx = (Math.random() - 0.5) * 80;
      const ty = -60 - Math.random() * 140;

      p.style.left = left + "%";
      p.style.top = top + "%";
      p.style.animationDuration = duration + "s";
      p.style.animationDelay = delay + "s";
      p.style.setProperty("--tx", tx + "px");
      p.style.setProperty("--ty", ty + "px");

      particleLayer.appendChild(p);
    }
  };

  const clearParticles = () => {
    if (!particleLayer) return;
    particleLayer.innerHTML = "";
    particlesEnabled = false;
  };

  const applyTheme = (theme) => {
    body.classList.remove("dark", "light", "galaxy");

    if (theme === "light") {
      clearParticles();
      body.classList.add("light");
      if (themeIcon) themeIcon.textContent = "THEME";
    } else if (theme === "galaxy") {
      body.classList.add("galaxy");
      if (themeIcon) themeIcon.textContent = "THEME";
      createParticles();
    } else {
      clearParticles();
      body.classList.add("dark");
      if (themeIcon) themeIcon.textContent = "THEME";
    }
  };

  const savedTheme = window.localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "galaxy" || savedTheme === "dark") {
    applyTheme(savedTheme);
  } else {
    applyTheme("dark");
  }

  const getCurrentTheme = () => {
    if (body.classList.contains("light")) return "light";
    if (body.classList.contains("galaxy")) return "galaxy";
    return "dark";
  };

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = getCurrentTheme();
      let next = "dark";
      if (current === "dark") next = "light";
      else if (current === "light") next = "galaxy";
      else if (current === "galaxy") next = "dark";

      applyTheme(next);
      window.localStorage.setItem("theme", next);
    });
  }

  const setMusicState = (on) => {
    if (bgMusic) {
      if (on) {
        const playPromise = bgMusic.play();
        if (playPromise && typeof playPromise.then === "function") {
          playPromise.catch(() => {
          });
        }
      } else {
        bgMusic.pause();
      }
    }
    if (musicIcon) {
      musicIcon.textContent = on ? "ON" : "OFF";
    }
    try {
      window.localStorage.setItem("musicOn", on ? "1" : "0");
    } catch (e) {}
  };

  let musicOnSaved = false;
  try {
    musicOnSaved = window.localStorage.getItem("musicOn") === "1";
  } catch (e) {
    musicOnSaved = false;
  }
  setMusicState(musicOnSaved);

  if (musicToggle) {
    musicToggle.addEventListener("click", () => {
      let currentlyOn = false;
      try {
        currentlyOn = window.localStorage.getItem("musicOn") === "1";
      } catch (e) {
        currentlyOn = musicIcon?.textContent === "🔊";
      }
      setMusicState(!currentlyOn);
    });
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("is-open");
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu && navMenu.classList.contains("is-open")) {
        navMenu.classList.remove("is-open");
      }
    });
  });

  window.addEventListener("scroll", () => {
    if (!nav) return;
    if (window.scrollY > 8) {
      nav.classList.add("site-header--scrolled");
    } else {
      nav.classList.remove("site-header--scrolled");
    }
  });

  const revealElements = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  const sections = document.querySelectorAll("section[id]");
  const navLinksMap = {};

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      const id = href.slice(1);
      navLinksMap[id] = link;
    }
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const link = navLinksMap[id];
        if (!link) return;

        if (entry.isIntersecting) {
          Object.values(navLinksMap).forEach((l) => l.classList.remove("nav__link--active"));
          link.classList.add("nav__link--active");
        }
      });
    },
    { threshold: 0.45 }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      formStatus.textContent = "Thanks! Your message has been sent (demo only).";
      contactForm.reset();
      setTimeout(() => {
        formStatus.textContent = "";
      }, 4000);
    });
  }
});
