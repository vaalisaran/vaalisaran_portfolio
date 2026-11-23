(() => {
  const root = document.documentElement;
  const skeleton = document.getElementById("skeleton");
  const nav = document.getElementById("nav");
  const themeToggle = document.getElementById("themeToggle");
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  const cursor = document.getElementById("cursor");
  const trails = document.getElementById("trails");
  const giant = document.querySelector(".giant .name");
  const wipe = document.querySelector(".page-wipe");
  const year = document.getElementById("year");

  if (year) year.textContent = new Date().getFullYear();

  // Theme Management
  const saved = localStorage.getItem("theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (systemDark ? "dark" : "light"), false);

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) applyTheme(e.matches ? "dark" : "light", false);
  });

  themeToggle?.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    applyTheme(next, true);
    themeToggle.classList.add("pop");
    setTimeout(() => themeToggle.classList.remove("pop"), 280);
  });

  function applyTheme(mode, persist) {
    root.dataset.theme = mode;
    const color = mode === "light" ? "#f4f6fb" : "#070714";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", color);
    if (persist) localStorage.setItem("theme", mode);
    window.dispatchEvent(new CustomEvent("theme-change", { detail: { mode } }));
  }

  // Skeleton Loader Fadeout
  window.addEventListener("load", () => {
    setTimeout(() => skeleton?.classList.add("hide"), 600);
  });
  setTimeout(() => skeleton?.classList.add("hide"), 1800);

  // Mobile Navigation Drawer Toggle
  menuBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    navLinks?.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (navLinks?.classList.contains("open") && !nav?.contains(e.target)) {
      navLinks.classList.remove("open");
    }
  });

  // Smooth Scroll & Page Transitions
  document.querySelectorAll("[data-page]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href?.startsWith("#")) return;
      e.preventDefault();
      navLinks?.classList.remove("open");
      if (wipe) {
        wipe.classList.add("on");
        setTimeout(() => {
          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
          history.pushState(null, "", href);
        }, 280);
        setTimeout(() => wipe.classList.remove("on"), 720);
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Scroll Reveal Animations
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.setProperty("--d", entry.target.dataset.delay || 0);
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // Animated Number Counters for Stats
  const counterIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.target || el.textContent);
          const suffix = el.dataset.suffix || "";
          const decimals = parseInt(el.dataset.decimals || "0", 10);
          const duration = 1600;
          const startTime = performance.now();

          function updateCount(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutExpo
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = target * ease;
            el.textContent = current.toFixed(decimals) + suffix;
            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              el.textContent = target.toFixed(decimals) + suffix;
            }
          }
          requestAnimationFrame(updateCount);
          counterIo.unobserve(el);
        }
      });
    },
    { threshold: 0.2 }
  );
  document.querySelectorAll(".stat[data-target]").forEach((el) => counterIo.observe(el));

  // Active Navigation Spy
  const sections = [...document.querySelectorAll("section[id]")];
  const navAnchors = [...document.querySelectorAll(".nav-links a")];
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
      });
    },
    { rootMargin: "-35% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  // Sticky Navbar Compact on Scroll
  function checkNavScroll() {
    const y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    if (nav) nav.classList.toggle("compact", y > 30);
    document.querySelectorAll("[data-speed]").forEach((layer) => {
      const speed = Number(layer.dataset.speed);
      layer.style.transform = `translate3d(0, ${y * speed}px, 0)`;
    });
  }
  window.addEventListener("scroll", checkNavScroll, { passive: true });
  checkNavScroll();

  // Custom Cursor & Magnetic Physics
  const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  const ring = { x: mouse.x, y: mouse.y };
  const dot = cursor?.querySelector(".cursor-dot");
  const ringEl = cursor?.querySelector(".cursor-ring");
  const bubbles = Array.from({ length: 8 }, () => {
    const b = document.createElement("span");
    b.className = "trail";
    trails?.appendChild(b);
    return { el: b, x: mouse.x, y: mouse.y };
  });

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    window.dispatchEvent(new CustomEvent("pointer-gl", { detail: mouse }));

    if (giant) {
      const dx = (e.clientX / innerWidth - 0.5) * 16;
      const dy = (e.clientY / innerHeight - 0.5) * 10;
      giant.style.transform = `translate(${dx}px, ${dy}px) skewX(${dx * 0.1}deg)`;
    }
  });

  document.querySelectorAll("a, button, .field, .tile, .magnetic, .chip-btn, .h-card, .case").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor?.classList.add("hover"));
    el.addEventListener("mouseleave", () => {
      cursor?.classList.remove("hover");
      if (el.classList.contains("magnetic")) el.style.transform = "";
    });
  });

  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
      ring.x += (e.clientX - ring.x) * 0.35;
      ring.y += (e.clientY - ring.y) * 0.35;
    });
  });

  // 3D Card Perspective Tilt on Hover (for fine pointers / desktop)
  if (window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".case, .tile, .h-card, .time-card, .cert, .job").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5.5;
        const rotateY = ((x - centerX) / centerX) * 5.5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.setProperty("--mx", `${x}px`);
        card.style.setProperty("--my", `${y}px`);
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      });
    });
  }

  // Horizontal Scroll Strip Navigation Controls
  const hScroll = document.getElementById("hScrollContainer");
  const leftBtn = document.getElementById("hScrollLeft");
  const rightBtn = document.getElementById("hScrollRight");
  if (hScroll && leftBtn && rightBtn) {
    leftBtn.addEventListener("click", () => {
      hScroll.scrollBy({ left: -360, behavior: "smooth" });
    });
    rightBtn.addEventListener("click", () => {
      hScroll.scrollBy({ left: 360, behavior: "smooth" });
    });
  }

  // Cursor Trail Tick Loop
  function tick() {
    if (dot && ringEl) {
      ring.x += (mouse.x - ring.x) * 0.16;
      ring.y += (mouse.y - ring.y) * 0.16;
      ringEl.style.left = `${ring.x}px`;
      ringEl.style.top = `${ring.y}px`;
      dot.style.left = `${mouse.x}px`;
      dot.style.top = `${mouse.y}px`;
      bubbles.forEach((b, i) => {
        const t = (i + 1) * 0.12;
        b.x += (mouse.x - b.x) * t;
        b.y += (mouse.y - b.y) * t;
        b.el.style.left = `${b.x}px`;
        b.el.style.top = `${b.y}px`;
        b.el.style.opacity = String(0.48 - i * 0.05);
        b.el.style.transform = `translate(-50%, -50%) scale(${1 - i * 0.08})`;
      });
    }
    requestAnimationFrame(tick);
  }
  tick();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
})();
