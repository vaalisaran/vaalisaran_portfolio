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
  const installBtn = document.getElementById("installBtn");
  const year = document.getElementById("year");

  year.textContent = new Date().getFullYear();

  const saved = localStorage.getItem("theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (systemDark ? "dark" : "light"), false);

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) applyTheme(e.matches ? "dark" : "light", false);
  });

  themeToggle.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    applyTheme(next, true);
    themeToggle.classList.add("pop");
    setTimeout(() => themeToggle.classList.remove("pop"), 280);
  });

  function applyTheme(mode, persist) {
    root.dataset.theme = mode;
    const color = mode === "light" ? "#efe8dc" : "#070714";
    document.querySelector('meta[name="theme-color"]').setAttribute("content", color);
    if (persist) localStorage.setItem("theme", mode);
  }

  window.addEventListener("load", () => {
    setTimeout(() => skeleton.classList.add("hide"), 900);
  });
  setTimeout(() => skeleton.classList.add("hide"), 2200);

  menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));

  document.querySelectorAll("[data-page]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href?.startsWith("#")) return;
      e.preventDefault();
      navLinks.classList.remove("open");
      wipe.classList.add("on");
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
        history.pushState(null, "", href);
      }, 280);
      setTimeout(() => wipe.classList.remove("on"), 720);
    });
  });

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
    { threshold: 0.16 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  const sections = [...document.querySelectorAll("section[id]")];
  const navAnchors = [...document.querySelectorAll(".nav-links a")];
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
      });
    },
    { rootMargin: "-40% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  let lastY = 0;
  window.addEventListener(
    "scroll",
    () => {
      nav.classList.toggle("compact", window.scrollY > 40);
      const y = window.scrollY;
      document.querySelectorAll("[data-speed]").forEach((layer) => {
        const speed = Number(layer.dataset.speed);
        layer.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });
      lastY = y;
    },
    { passive: true }
  );

  const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  const ring = { x: mouse.x, y: mouse.y };
  const dot = cursor.querySelector(".cursor-dot");
  const ringEl = cursor.querySelector(".cursor-ring");
  const bubbles = Array.from({ length: 8 }, () => {
    const b = document.createElement("span");
    b.className = "trail";
    trails.appendChild(b);
    return { el: b, x: mouse.x, y: mouse.y };
  });

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    window.dispatchEvent(new CustomEvent("pointer-gl", { detail: mouse }));

    if (giant) {
      const dx = (e.clientX / innerWidth - 0.5) * 18;
      const dy = (e.clientY / innerHeight - 0.5) * 10;
      giant.style.transform = `translate(${dx}px, ${dy}px) skewX(${dx * 0.12}deg)`;
    }
  });

  document.querySelectorAll("a, button, .field, .tile, .magnetic").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("hover");
      el.style.transform = "";
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

  function tick() {
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
      b.el.style.opacity = String(0.5 - i * 0.05);
      b.el.style.transform = `translate(-50%, -50%) scale(${1 - i * 0.08})`;
    });
    requestAnimationFrame(tick);
  }
  tick();

  let deferredPrompt;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.hidden = false;
  });
  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.hidden = true;
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js");
  }
})();
