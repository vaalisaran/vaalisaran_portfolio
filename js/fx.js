(() => {
  const EMAIL = "saran152004s@gmail.com";
  const GH = "vaalisaran";
  const root = document.documentElement;

  // Accent Management
  const savedAccent = localStorage.getItem("accent") || "cyan";
  root.dataset.accent = savedAccent;

  // Sound Engine (Web Audio API)
  let soundOn = localStorage.getItem("sound") !== "off";
  const soundBtn = document.getElementById("soundToggle");
  if (soundBtn) soundBtn.classList.toggle("on", soundOn);

  let audioCtx;
  function beep(type) {
    if (!soundOn) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.connect(g);
      g.connect(audioCtx.destination);
      const now = audioCtx.currentTime;
      const map = {
        click: [880, 0.04, "sine"],
        pop: [540, 0.07, "sine"],
        whoosh: [200, 0.14, "triangle"],
        toggle: [1240, 0.05, "sine"],
        chime: [980, 0.22, "sine"]
      };
      const [f, d, wave] = map[type] || map.click;
      o.frequency.setValueAtTime(f, now);
      o.type = wave || "sine";
      g.gain.setValueAtTime(0.045, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + d);
      o.start(now);
      o.stop(now + d);
    } catch (_) { /* ignore */ }
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-sound], button, a.btn, .chip-btn, .swatch, .road-item");
    if (t) beep(t.dataset.sound || "click");
  });

  soundBtn?.addEventListener("click", () => {
    soundOn = !soundOn;
    localStorage.setItem("sound", soundOn ? "on" : "off");
    soundBtn.classList.toggle("on", soundOn);
    beep("toggle");
    showToast(soundOn ? "Audio feedback enabled ♪" : "Audio muted");
  });

  document.querySelectorAll("[data-accent]").forEach((btn) => {
    btn.addEventListener("click", () => {
      root.dataset.accent = btn.dataset.accent;
      localStorage.setItem("accent", btn.dataset.accent);
      window.dispatchEvent(new CustomEvent("accent-change"));
      showToast(`Accent set to ${btn.dataset.accent}`);
    });
  });

  // Toast Notification Helper
  let toastTimer;
  function showToast(msg) {
    let toast = document.getElementById("toastNotification");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toastNotification";
      toast.className = "toast-notice";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2400);
  }
  window.showToast = showToast;

  // Reading Progress Bar & Ring
  const bar = document.getElementById("progressBar");
  const arc = document.getElementById("ringArc");
  const pct = document.getElementById("ringPct");
  const circ = 2 * Math.PI * 18;

  function onScroll() {
    const y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max <= 0 ? 0 : Math.min(1, y / max);
    if (bar) bar.style.width = `${p * 100}%`;
    if (arc) arc.style.strokeDashoffset = String(circ * (1 - p));
    if (pct) pct.textContent = `${Math.round(p * 100)}%`;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Dual Clocks (IST & UTC) & Observatory Telemetry
  const clock = document.getElementById("localTime");
  const hudClocks = document.getElementById("hudClocks");
  function tickClock() {
    const now = new Date();
    const ist = now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const utc = now.toLocaleTimeString("en-GB", { timeZone: "UTC", hour: "2-digit", minute: "2-digit" });
    if (clock) clock.textContent = `${ist.slice(0, 5)} IST`;
    if (hudClocks) hudClocks.textContent = `${ist} IST · ${utc} UTC`;
  }
  tickClock();
  setInterval(tickClock, 1000);

  // Animated Typing Effect for Rotating Roles
  const roles = [
    "Software Developer",
    "Engineer Trainee @ IIA VBO",
    "Python & Django Builder",
    "SIH’23 National Finalist",
    "Observatory Data Engineer",
    "NSCET’24 Hackathon Winner"
  ];
  const typeEl = document.getElementById("typeTarget");
  let ri = 0, ci = 0, del = false;
  function typeLoop() {
    if (!typeEl) return;
    const word = roles[ri];
    typeEl.textContent = word.slice(0, ci);
    if (!del && ci < word.length) {
      ci += 1;
    } else if (!del && ci === word.length) {
      del = true;
      setTimeout(typeLoop, 1600);
      return;
    } else if (del && ci > 0) {
      ci -= 1;
    } else {
      del = false;
      ri = (ri + 1) % roles.length;
    }
    setTimeout(typeLoop, del ? 38 : 75);
  }
  typeLoop();

  // Spotlight Cursor Glow for .spot Elements
  document.querySelectorAll(".spot").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  // Scrollytelling Chapter Observation
  const steps = [...document.querySelectorAll(".story-step")];
  const title = document.getElementById("storyTitle");
  const body = document.getElementById("storyBody");
  const kicker = document.getElementById("storyKicker");
  const counter = document.getElementById("storyStepCounter");
  const metrics = document.getElementById("storyMetrics");

  const sio = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      steps.forEach((s) => s.classList.remove("on"));
      en.target.classList.add("on");
      const d = en.target.dataset;
      const index = steps.indexOf(en.target) + 1;
      if (kicker) kicker.textContent = d.kicker || `Chapter 0${index}`;
      if (counter) counter.textContent = `${index} / ${steps.length}`;
      if (title) title.textContent = d.title || "";
      if (body) body.textContent = d.body || "";
      if (metrics) {
        metrics.innerHTML = (d.metrics || "")
          .split(",")
          .map((pair) => {
            const [a, b] = pair.split("|");
            return `<div class="metric"><b>${a}</b><span>${b || ""}</span></div>`;
          })
          .join("");
      }
    });
  }, { threshold: 0.45 });
  steps.forEach((s) => sio.observe(s));

  // Case Studies Filtering
  const filters = document.getElementById("filters");
  filters?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    filters.querySelectorAll(".chip-btn").forEach((b) => b.classList.toggle("on", b === btn));
    const f = btn.dataset.filter;
    document.querySelectorAll("#gallery .case").forEach((card) => {
      const ok = f === "all" || card.dataset.cats.includes(f);
      card.classList.toggle("show", ok);
    });
  });

  // Career Roadmap Accordion
  document.querySelectorAll(".road-item").forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("open");
      beep("pop");
    });
  });

  // High-DPI Canvas Radar Chart
  const radar = document.getElementById("radar");
  function drawRadar() {
    if (!radar) return;
    const dpr = window.devicePixelRatio || 1;
    const cssSize = 280;
    radar.width = cssSize * dpr;
    radar.height = cssSize * dpr;
    radar.style.width = `${cssSize}px`;
    radar.style.height = `${cssSize}px`;

    const ctx = radar.getContext("2d");
    ctx.scale(dpr, dpr);
    const cx = cssSize / 2;
    const labels = ["Python", "Web APIs", "AI / ML", "Docker/Cloud", "Agile SDLC", "SQL Data"];
    const vals = [0.94, 0.86, 0.78, 0.72, 0.92, 0.84];

    ctx.clearRect(0, 0, cssSize, cssSize);

    // Web Grids
    ctx.strokeStyle = root.dataset.theme === "light" ? "rgba(15, 23, 42, 0.12)" : "rgba(255, 255, 255, 0.14)";
    ctx.lineWidth = 1;
    for (let r = 0.25; r <= 1; r += 0.25) {
      ctx.beginPath();
      labels.forEach((_, i) => {
        const a = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
        const x = cx + Math.cos(a) * (cx * 0.74) * r;
        const y = cx + Math.sin(a) * (cx * 0.74) * r;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.closePath();
      ctx.stroke();
    }

    // Axis Lines
    labels.forEach((_, i) => {
      const a = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cx);
      ctx.lineTo(cx + Math.cos(a) * (cx * 0.74), cx + Math.sin(a) * (cx * 0.74));
      ctx.stroke();
    });

    // Value Polygon
    const accent = getComputedStyle(root).getPropertyValue("--accent").trim() || "#22d3ee";
    ctx.beginPath();
    vals.forEach((v, i) => {
      const a = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
      const x = cx + Math.cos(a) * (cx * 0.74) * v;
      const y = cx + Math.sin(a) * (cx * 0.74) * v;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = root.dataset.theme === "light" ? "rgba(2, 132, 199, 0.28)" : "rgba(34, 211, 238, 0.28)";
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Data Points
    vals.forEach((v, i) => {
      const a = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
      const x = cx + Math.cos(a) * (cx * 0.74) * v;
      const y = cx + Math.sin(a) * (cx * 0.74) * v;
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();
    });

    // Labels
    ctx.fillStyle = getComputedStyle(root).getPropertyValue("--ink").trim() || "#f8fafc";
    ctx.font = "600 11px Outfit, sans-serif";
    labels.forEach((lb, i) => {
      const a = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
      const lx = cx + Math.cos(a) * (cx * 0.92);
      const ly = cx + Math.sin(a) * (cx * 0.92);
      ctx.textAlign = Math.abs(Math.cos(a)) < 0.2 ? "center" : Math.cos(a) > 0 ? "left" : "right";
      ctx.textBaseline = "middle";
      ctx.fillText(lb, lx, ly);
    });
  }
  drawRadar();
  window.addEventListener("accent-change", drawRadar);
  window.addEventListener("theme-change", drawRadar);

  // Skill Bars Animated Fill
  const barIo = new IntersectionObserver((ents) => {
    ents.forEach((en) => {
      if (en.isIntersecting) {
        document.querySelectorAll(".fill").forEach((f) => {
          f.style.width = `${f.dataset.w}%`;
        });
        barIo.unobserve(en.target);
      }
    });
  }, { threshold: 0.2 });
  const bars = document.getElementById("skillBars");
  if (bars) barIo.observe(bars);

  // Copy Email with Toast Feedback
  document.getElementById("copyEmail")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      showToast("Email saran152004s@gmail.com copied to clipboard!");
      const c = document.getElementById("copied");
      if (c) {
        c.hidden = false;
        setTimeout(() => (c.hidden = true), 2200);
      }
      beep("pop");
    } catch (_) {
      prompt("Copy email:", EMAIL);
    }
  });

  // Contact Form Validation
  const form = document.getElementById("contactForm");
  const ta = form?.querySelector("textarea");
  ta?.addEventListener("input", () => {
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  });
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    let ok = true;
    const checks = {
      name: (v) => v.trim().length >= 2 || "Please enter your name",
      email: (v) => /^\S+@\S+\.\S+$/.test(v) || "Please enter a valid email",
      message: (v) => v.trim().length >= 8 || "Please write a brief message"
    };
    Object.entries(checks).forEach(([k, fn]) => {
      const msg = fn(String(fd.get(k) || ""));
      const err = form.querySelector(`[data-for="${k}"]`);
      const good = msg === true;
      if (err) err.textContent = good ? "" : msg;
      if (!good) ok = false;
    });
    if (!ok) return;
    const okState = document.getElementById("formOk");
    if (okState) okState.style.display = "block";
    const note = document.getElementById("formNote");
    if (note) note.hidden = false;
    beep("chime");
    showToast("Launching your mail app to send note...");
    const subject = encodeURIComponent(`Portfolio inquiry from ${fd.get("name")}`);
    const bodyTxt = encodeURIComponent(`${fd.get("message")}\n\n— ${fd.get("name")} (${fd.get("email")})`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${bodyTxt}`;
  });

  // Booking Slots
  const slots = document.getElementById("slots");
  if (slots) {
    const hours = ["10:30", "12:00", "15:00", "16:30", "18:00"];
    const day = new Date();
    day.setDate(day.getDate() + 1);
    const ds = day.toISOString().slice(0, 10);
    slots.innerHTML = hours
      .map(
        (h) =>
          `<a class="icon-btn glass" href="mailto:${EMAIL}?subject=${encodeURIComponent("15-Min Intro Request")}&body=${encodeURIComponent(`Hi Saran,\n\nWould you be open for a 15-minute sync on ${ds} around ${h} IST to discuss software opportunities?\n\nBest,`)}" data-sound="click">${ds} ${h} IST</a>`
      )
      .join("");
  }

  // Command Palette (Ctrl+K)
  const cmdk = document.getElementById("cmdk");
  const cmdkInput = document.getElementById("cmdkInput");
  const cmdkList = document.getElementById("cmdkList");
  const cmds = [
    ["Jump to Home", "#home"],
    ["Jump to About & Bento", "#about"],
    ["Jump to Experience & IIA", "#work"],
    ["Jump to Filterable Projects", "#projects"],
    ["Jump to Contact & Booking", "#contact"],
    ["GitHub · @vaalisaran", "https://github.com/vaalisaran"],
    ["LinkedIn · @vaalisaran", "https://www.linkedin.com/in/vaalisaran/"],
    ["Instagram · @vaalisaran", "https://www.instagram.com/vaalisaran/"],
    ["Twitter / X · @vaalisaran", "https://x.com/vaalisaran"],
    ["View Resume Modal", "resume"],
    ["Launch Hacker Terminal", "term"],
    ["Play Orb Mini-Game", "play"],
    ["Switch Theme (Light/Dark)", "theme"],
    ["Toggle Audio Atmosphere", "sound"]
  ];

  function renderCmds(q = "") {
    if (!cmdkList) return;
    const items = cmds.filter((c) => c[0].toLowerCase().includes(q.toLowerCase()));
    cmdkList.innerHTML = items.map((c, i) => `<li data-go="${c[1]}" class="${i === 0 ? "active" : ""}"><span>${c[0]}</span> <span style="font-size:0.75rem;color:var(--muted)">↵</span></li>`).join("");
  }

  function openCmd(on) {
    if (!cmdk) return;
    cmdk.classList.toggle("open", on);
    if (on) {
      renderCmds();
      if (cmdkInput) {
        cmdkInput.value = "";
        cmdkInput.focus();
      }
      beep("whoosh");
    }
  }

  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openCmd(!cmdk?.classList.contains("open"));
    }
    if (e.key === "Escape") {
      openCmd(false);
      document.getElementById("resumeModal")?.classList.remove("open");
      document.getElementById("projectModal")?.classList.remove("open");
      document.getElementById("term")?.classList.remove("open");
      document.getElementById("game")?.classList.remove("open");
    }
  });

  cmdk?.addEventListener("click", (e) => {
    if (e.target === cmdk) openCmd(false);
  });
  cmdkInput?.addEventListener("input", () => renderCmds(cmdkInput.value));
  cmdkList?.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (li) runCmd(li.dataset.go);
  });

  function runCmd(go) {
    openCmd(false);
    if (go === "resume") document.getElementById("resumeModal")?.classList.add("open");
    else if (go === "term") document.getElementById("term")?.classList.add("open");
    else if (go === "play") startGame();
    else if (go === "theme") document.getElementById("themeToggle")?.click();
    else if (go === "sound") soundBtn?.click();
    else if (go.startsWith("http")) window.open(go, "_blank", "noopener,noreferrer");
    else if (go.endsWith(".html")) window.location.href = go;
    else document.querySelector(go)?.scrollIntoView({ behavior: "smooth" });
  }

  // Resume Modal
  document.getElementById("resumeView")?.addEventListener("click", () => {
    document.getElementById("resumeModal")?.classList.add("open");
    beep("whoosh");
  });
  document.getElementById("resumeClose")?.addEventListener("click", () => {
    document.getElementById("resumeModal")?.classList.remove("open");
  });
  document.getElementById("resumeModal")?.addEventListener("click", (e) => {
    if (e.target.id === "resumeModal") e.target.classList.remove("open");
  });

  // Project Specs & Architecture Modal Database
  const projectDb = {
    "iot-anomaly": {
      title: "IoT Time-Series Anomaly Detection",
      badge: "Machine Learning / Predictive IoT",
      repo: "https://github.com/vaalisaran/Time-Series-Anomaly-Detection-for-IoT-Sensor-Data",
      desc: "End-to-end telemetry anomaly detection framework deployed for industrial IoT sensors. Eliminates catastrophic breakdowns via predictive maintenance.",
      arch: "Sensor Ingestion (MQTT / REST) → Pandas Feature Resampling → Isolation Forest (Micro-Outlier Pruning) → LSTM Autoencoder (Temporal Reconstruction Loss) → Real-Time Alert Engine.",
      metrics: ["LSTM Reconstruction Loss: <0.024", "Zero Unplanned Downtime", "Processed 1M+ Telemetry Datapoints"],
      stack: ["Python", "TensorFlow / Keras", "Scikit-Learn", "Pandas", "NumPy", "Matplotlib"]
    },
    "tablet-id": {
      title: "Medicinal Plant & Tablet Identification",
      badge: "SIH’23 National Finalist",
      repo: "https://github.com/vaalisaran/Tablet-Identification-System",
      desc: "Architected for the Ministry of Ayush during Smart India Hackathon 2023 at Nagpur. High-speed computer vision recognition of botanical flora and unlabeled medical tablets.",
      arch: "Camera / Image Input → OpenCV Preprocessing (CLAHE + Edge Filtering) → Dual-Head CNN Backbone (ResNet + MobileNet) → Ayush Medicinal Botanical Index → Fast JSON API.",
      metrics: ["+53% Accuracy Improvement", "SIH ’23 National Finals @ Nagpur", "5000+ Sample Validation Benchmark"],
      stack: ["Python", "OpenCV", "TensorFlow", "FastAPI", "Dataset Pipelines"]
    },
    "elearning-anti-spoof": {
      title: "E-Learning Platform with Anti-Spoofing AI",
      badge: "NSCET’24 Hackathon 1st Prize Winner",
      repo: "https://github.com/vaalisaran/Inventory-Management-System-Advanced",
      desc: "Django virtual classroom platform equipped with face-liveness biometrics to eliminate proxy attendance and provide intelligent AI chatbot assistance.",
      arch: "Django MVC Core → WebRTC Camera Feed → dlib / OpenCV Liveness Blink Detector → Cosine Embedding Facial Matcher → Integrated NLP Student Assistance Bot.",
      metrics: ["1st Prize out of 80+ Teams (480+ participants)", "98% Authentication Accuracy", "<250ms Liveness Inference"],
      stack: ["Django", "Python", "OpenCV", "Biometrics", "SQLite / MySQL", "WebRTC"]
    },
    "ksonightsky": {
      title: "Kodaikanal Night Sky (`ksonightsky`)",
      badge: "Observatory / Astronomy Web Engine",
      repo: "https://github.com/vaalisaran/ksonightsky",
      desc: "Calculates celestial object ephemeris, planetary orbital trajectories, and twilight observation windows tailored for the Kodaikanal Solar Observatory coordinates.",
      arch: "Client Web Interface → Astro Mathematical Engine (Keplerian Orbital Elements) → Visibility Matrix (Altitude, Azimuth, Apparent Magnitude) → Dynamic Interactive Canvas Sky Plotter.",
      metrics: ["KSO Observatory Public Portal", "Real-time Multi-Planet Visibility", "Sub-arcminute Accuracy"],
      stack: ["Python", "JavaScript", "Celestial Mechanics", "HTML5 Canvas", "CSS3"]
    },
    "radio-data-gui": {
      title: "Kodaikanal Radio Data GUI Visualizer",
      badge: "Radio Astronomy GUI Suite",
      repo: "https://github.com/vaalisaran/Kodaikanal-Radio-Data-GUI",
      desc: "Desktop scientific visualization suite parsing raw solar radio frequency telemetry, solar burst sweeps, and spectral telemetry curves.",
      arch: "Binary Radio Telemetry Parser → FFT Frequency Spectrum Extractor → Noise Floor Thresholding → Matplotlib / PyQt Dynamic Waterfall Spectrogram.",
      metrics: ["IIA / KSO Research Tooling", "Real-Time Spectrum Rendering", "Automated Burst Detection"],
      stack: ["Python", "PyQt / Tkinter", "NumPy", "Matplotlib", "Solar Physics"]
    },
    "iia-management": {
      title: "IIA Observatory Management Portal",
      badge: "Institutional Management Platform",
      repo: "https://github.com/vaalisaran/IIA-Observatory-Management-System",
      desc: "Centralized administrative and operational task portal engineered for Indian Institute of Astrophysics observatory personnel and digital records.",
      arch: "Role-Based Authentication → Observatory Maintenance Logs → Equipment Status Tracker → Report Generator.",
      metrics: ["Institutional Software", "Centralized Logging", "Full Responsive Support"],
      stack: ["Python", "HTML5", "CSS3", "JavaScript", "SQL"]
    },
    "physio-booking": {
      title: "Saipulla Physiotherapy Booking Platform",
      badge: "Production Freelance Portal",
      repo: "https://github.com/vaalisaran/Saipulla-physiotherapy",
      desc: "Complete digital presence and patient booking engine for a private physiotherapy clinic, increasing digital appointment bookings.",
      arch: "Responsive Landing Architecture → Dynamic Appointment Booking Grid → Form Automation → Clinic Dashboard.",
      metrics: ["Production Deployment", "+120% Digital Appointments", "Mobile First"],
      stack: ["HTML5", "CSS3", "JavaScript", "Form Automation"]
    },
    "vmgbhss-portal": {
      title: "VMGBHSS Complete School System",
      badge: "School Management Production",
      repo: "https://github.com/vaalisaran/VMGBHSS---Website",
      demo: "https://vmgbhss.pythonanywhere.com/",
      desc: "Digital portal deployed on PythonAnywhere for Victoria Memorial Government Boys Higher Secondary School, featuring academic notices, student enrollment, and public info.",
      arch: "Django Core Architecture → PythonAnywhere Cloud Deployment → SQLite Persistence → Responsive Administration Suite.",
      metrics: ["Live Production on Cloud", "Serving Alma Mater", "Complete CMS"],
      stack: ["Django", "Python", "PythonAnywhere", "Bootstrap / Custom CSS"]
    },
    "ai-model-suite": {
      title: "Vaali Saran AI Model Architecture Suite",
      badge: "Deep Learning Benchmarks",
      repo: "https://github.com/vaalisaran/Vaali-Saran-AI",
      desc: "Collection of reproduction models, synthetic generation pipelines, and neural architecture benchmarks.",
      arch: "Modular PyTorch / TensorFlow Blocks → Synthetic Data Generation → Training Loss Curves → Model Profiling.",
      metrics: ["Clean Code Architectures", "Multi-Domain Models", "Open Source Benchmark"],
      stack: ["PyTorch", "TensorFlow", "Scikit-Learn", "NumPy", "Pandas"]
    },
    "travel-crew": {
      title: "Travel Crew Collaborative Trip Planner",
      badge: "Collaborative Full-Stack",
      repo: "https://github.com/vaalisaran",
      desc: "Group vacation planner combining real-time chat, collaborative itinerary boards, shared pinboards, and AI recommendations.",
      arch: "Frontend SPA → WebSocket Broadcast Relay → Geo Mapping API → AI Itinerary Suggestion Engine.",
      metrics: ["Real-Time Collaboration", "Location Geofencing", "Internship Showcase"],
      stack: ["Full Stack", "WebSockets", "Maps API", "Python Backend"]
    }
  };

  // Open Project Modal Handler
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".inspect-btn");
    if (!btn) return;
    const pid = btn.dataset.project;
    const data = projectDb[pid];
    if (!data) return;

    const modal = document.getElementById("projectModal");
    const mTitle = document.getElementById("modalTitle");
    const mBadge = document.getElementById("modalBadge");
    const mBody = document.getElementById("modalBody");
    const mRepo = document.getElementById("modalRepoLink");
    const mDemo = document.getElementById("modalDemoLink");

    if (mTitle) mTitle.textContent = data.title;
    if (mBadge) mBadge.textContent = data.badge;
    if (mRepo) mRepo.href = data.repo;
    if (mDemo) {
      if (data.demo) {
        mDemo.href = data.demo;
        mDemo.style.display = "inline-flex";
      } else {
        mDemo.style.display = "none";
      }
    }
    if (mBody) {
      mBody.innerHTML = `
        <p style="font-size:1.05rem;color:var(--ink);margin-top:0">${data.desc}</p>
        <div style="margin:16px 0;padding:14px;background:rgba(255,255,255,0.03);border:1px solid var(--glass-border);border-radius:18px">
          <strong style="color:var(--cyan);font-size:0.85rem;text-transform:uppercase;letter-spacing:0.1em;display:block;margin-bottom:6px">System Architecture & Pipeline</strong>
          <code style="font-family:ui-monospace,Consolas,monospace;font-size:0.88rem;color:var(--ink);display:block">${data.arch}</code>
        </div>
        <div style="margin:16px 0">
          <strong style="color:var(--cyan);font-size:0.85rem;text-transform:uppercase;letter-spacing:0.1em;display:block;margin-bottom:8px">Key Engineering Benchmarks</strong>
          <div style="display:flex;flex-wrap:wrap;gap:8px">
            ${data.metrics.map(m => `<span class="badge" style="background:rgba(34,211,238,0.12);color:var(--cyan)">${m}</span>`).join("")}
          </div>
        </div>
        <div>
          <strong style="color:var(--cyan);font-size:0.85rem;text-transform:uppercase;letter-spacing:0.1em;display:block;margin-bottom:8px">Tech Stack</strong>
          <div class="stack">
            ${data.stack.map(s => `<span>${s}</span>`).join("")}
          </div>
        </div>
      `;
    }
    modal?.classList.add("open");
    beep("whoosh");
  });

  document.getElementById("projectModalClose")?.addEventListener("click", () => {
    document.getElementById("projectModal")?.classList.remove("open");
  });
  document.getElementById("modalCloseBtn")?.addEventListener("click", () => {
    document.getElementById("projectModal")?.classList.remove("open");
  });
  document.getElementById("projectModal")?.addEventListener("click", (e) => {
    if (e.target.id === "projectModal") e.target.classList.remove("open");
  });

  // Konami Code Secret Trigger for Hacker Terminal
  const seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let si = 0;
  window.addEventListener("keydown", (e) => {
    si = e.key === seq[si] ? si + 1 : 0;
    if (si === seq.length) {
      si = 0;
      document.getElementById("term")?.classList.add("open");
      document.getElementById("termIn")?.focus();
      beep("whoosh");
      showToast("Access Granted · Hacker Terminal Unlocked 🚀");
    }
  });

  const termIn = document.getElementById("termIn");
  const termOut = document.getElementById("termOut");
  termIn?.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const cmd = termIn.value.trim().toLowerCase();
    termIn.value = "";
    const log = (t) => {
      termOut.innerHTML += `<div>${t}</div>`;
      termOut.scrollTop = termOut.scrollHeight;
    };
    log(`$ ${cmd}`);
    if (cmd === "help") log("Available: play · theme · mute · resume · clear · exit · iia · stats");
    else if (cmd === "play") startGame();
    else if (cmd === "theme") document.getElementById("themeToggle")?.click();
    else if (cmd === "mute") soundBtn?.click();
    else if (cmd === "resume") document.getElementById("resumeModal")?.classList.add("open");
    else if (cmd === "clear") termOut.innerHTML = "";
    else if (cmd === "iia") log("IIA Vainu Bappu Observatory (VBO), Kavalur · 2.34m VBT Telescope Facility · Lat 12.57° N, Lon 78.82° E");
    else if (cmd === "stats") log("SIH'23 Finalist · NSCET'24 Winner · Proxy'24 Finalist · 8.1 CGPA B.E. CSE Honors · 16+ Repos");
    else if (cmd === "exit") document.getElementById("term")?.classList.remove("open");
    else log("Unknown command. Type 'help' for available actions.");
  });

  // Catch-the-Orbs Interactive Mini-Game
  function startGame() {
    const wrap = document.getElementById("game");
    const cv = document.getElementById("gameCanvas");
    if (!wrap || !cv) return;
    wrap.classList.add("open");
    const ctx = cv.getContext("2d");
    let orbs = Array.from({ length: 7 }, () => ({
      x: Math.random() * (cv.width - 40) + 20,
      y: Math.random() * (cv.height - 40) + 20,
      vx: (Math.random() - 0.5) * 3.5,
      vy: (Math.random() - 0.5) * 3.5,
      r: Math.random() * 6 + 8
    }));
    let score = 0;
    let raf;

    cv.onclick = (e) => {
      const r = cv.getBoundingClientRect();
      const x = (e.clientX - r.left) * (cv.width / r.width);
      const y = (e.clientY - r.top) * (cv.height / r.height);
      orbs = orbs.filter((o) => {
        const hit = Math.hypot(o.x - x, o.y - y) < o.r + 8;
        if (hit) {
          score += 10;
          beep("pop");
        }
        return !hit;
      });
      if (!orbs.length) {
        wrap.classList.remove("open");
        cancelAnimationFrame(raf);
        showToast(`Victory! High Score: ${score} points 🎉`);
        beep("chime");
      }
    };

    function loop() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = "#fff";
      ctx.font = "14px Outfit, sans-serif";
      ctx.fillText(`Score: ${score} · Click remaining: ${orbs.length}`, 16, 24);

      const accent = getComputedStyle(root).getPropertyValue("--accent").trim() || "#22d3ee";
      orbs.forEach((o) => {
        o.x += o.vx;
        o.y += o.vy;
        if (o.x < o.r || o.x > cv.width - o.r) o.vx *= -1;
        if (o.y < o.r + 20 || o.y > cv.height - o.r) o.vy *= -1;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.shadowColor = accent;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      raf = requestAnimationFrame(loop);
    }
    loop();
  }

  // 2D Interactive Constellation Particle Canvas in Background
  const cCanvas = document.getElementById("constellationCanvas");
  if (cCanvas) {
    const ctx = cCanvas.getContext("2d");
    let cWidth, cHeight;
    const numStars = Math.min(65, Math.floor(window.innerWidth / 22));
    const stars = [];
    const pMouse = { x: -1000, y: -1000 };

    function resizeConstellation() {
      cWidth = cCanvas.width = window.innerWidth;
      cHeight = cCanvas.height = window.innerHeight;
    }
    resizeConstellation();
    window.addEventListener("resize", resizeConstellation);

    window.addEventListener("mousemove", (e) => {
      pMouse.x = e.clientX;
      pMouse.y = e.clientY;
    });

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.5 + 0.8
      });
    }

    function animateConstellation() {
      ctx.clearRect(0, 0, cWidth, cHeight);
      const isLight = root.dataset.theme === "light";
      const starColor = isLight ? "rgba(15, 23, 42, 0.45)" : "rgba(255, 255, 255, 0.65)";
      const lineColor = isLight ? "15, 23, 42" : "34, 211, 238";

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;

        if (s.x < 0) s.x = cWidth;
        if (s.x > cWidth) s.x = 0;
        if (s.y < 0) s.y = cHeight;
        if (s.y > cHeight) s.y = 0;

        // Gentle repulsion from cursor
        const dx = s.x - pMouse.x;
        const dy = s.y - pMouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 90) {
          s.x += (dx / dist) * 1.2;
          s.y += (dy / dist) * 1.2;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = starColor;
        ctx.fill();

        // Connect nearby stars with delicate constellation lines
        for (let j = i + 1; j < stars.length; j++) {
          const s2 = stars[j];
          const d = Math.hypot(s.x - s2.x, s.y - s2.y);
          if (d < 120) {
            const alpha = (1 - d / 120) * (isLight ? 0.08 : 0.16);
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateConstellation);
    }
    requestAnimationFrame(animateConstellation);
  }
})();
