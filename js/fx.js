(() => {
  const EMAIL = "saran152004s@gmail.com";
  const GH = "vaalisaran";
  const root = document.documentElement;

  const savedAccent = localStorage.getItem("accent") || "cyan";
  root.dataset.accent = savedAccent;
  let soundOn = localStorage.getItem("sound") !== "off";
  const soundBtn = document.getElementById("soundToggle");
  if (soundBtn) soundBtn.classList.toggle("on", soundOn);

  let audioCtx;
  function beep(type) {
    if (!soundOn) return;
    try {
      audioCtx = audioCtx || new AudioContext();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.connect(g);
      g.connect(audioCtx.destination);
      const now = audioCtx.currentTime;
      const map = { click: [880, 0.04], pop: [520, 0.07], whoosh: [180, 0.12], toggle: [1240, 0.05] };
      const [f, d] = map[type] || map.click;
      o.frequency.setValueAtTime(f, now);
      o.type = type === "whoosh" ? "triangle" : "sine";
      g.gain.setValueAtTime(0.05, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + d);
      o.start(now);
      o.stop(now + d);
    } catch (_) { /* ignore */ }
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-sound], button, a.btn, .chip-btn, .swatch");
    if (t) beep(t.dataset.sound || "click");
  });

  soundBtn?.addEventListener("click", () => {
    soundOn = !soundOn;
    localStorage.setItem("sound", soundOn ? "on" : "off");
    soundBtn.classList.toggle("on", soundOn);
    beep("toggle");
  });

  document.querySelectorAll("[data-accent]").forEach((btn) => {
    btn.addEventListener("click", () => {
      root.dataset.accent = btn.dataset.accent;
      localStorage.setItem("accent", btn.dataset.accent);
      window.dispatchEvent(new CustomEvent("accent-change"));
    });
  });

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
    const mainNav = document.getElementById("nav");
    if (mainNav) mainNav.classList.toggle("compact", y > 30);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const clock = document.getElementById("localTime");
  function tickClock() {
    const t = new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" });
    if (clock) clock.textContent = `${t} IST`;
  }
  tickClock();
  setInterval(tickClock, 30000);

  const roles = ["Developer", "Problem Solver", "Django builder", "SIH’23 Finalist", "Engineer Trainee"];
  const typeEl = document.getElementById("typeTarget");
  let ri = 0, ci = 0, del = false;
  function typeLoop() {
    if (!typeEl) return;
    const word = roles[ri];
    typeEl.textContent = word.slice(0, ci);
    if (!del && ci < word.length) ci += 1;
    else if (!del && ci === word.length) {
      del = true;
      setTimeout(typeLoop, 1200);
      return;
    } else if (del && ci > 0) ci -= 1;
    else {
      del = false;
      ri = (ri + 1) % roles.length;
    }
    setTimeout(typeLoop, del ? 40 : 80);
  }
  typeLoop();

  document.querySelectorAll(".spot").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  const steps = [...document.querySelectorAll(".story-step")];
  const title = document.getElementById("storyTitle");
  const body = document.getElementById("storyBody");
  const kicker = document.getElementById("storyKicker");
  const metrics = document.getElementById("storyMetrics");
  const sio = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      steps.forEach((s) => s.classList.remove("on"));
      en.target.classList.add("on");
      const d = en.target.dataset;
      if (kicker) kicker.textContent = d.kicker;
      if (title) title.textContent = d.title;
      if (body) body.textContent = d.body;
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
  }, { threshold: 0.55 });
  steps.forEach((s) => sio.observe(s));

  const preview = document.getElementById("hoverPreview");
  document.querySelectorAll("[data-hover], [data-preview]").forEach((el) => {
    el.addEventListener("mouseenter", (e) => {
      if (!preview) return;
      preview.textContent = el.dataset.hover || el.dataset.preview || "";
      preview.classList.add("on");
    });
    el.addEventListener("mousemove", (e) => {
      preview.style.left = `${e.clientX}px`;
      preview.style.top = `${e.clientY}px`;
    });
    el.addEventListener("mouseleave", () => preview?.classList.remove("on"));
  });

  document.querySelectorAll("[data-compare]").forEach((box) => {
    const range = box.querySelector("input");
    const before = box.querySelector(".before");
    range?.addEventListener("input", () => {
      before.style.width = `${range.value}%`;
    });
  });

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

  document.querySelectorAll(".road-item").forEach((item) => {
    item.addEventListener("click", () => item.classList.toggle("open"));
  });

  const radar = document.getElementById("radar");
  function drawRadar() {
    if (!radar) return;
    const ctx = radar.getContext("2d");
    const w = radar.width;
    const cx = w / 2;
    const labels = ["Python", "Web", "ML", "Cloud", "Agile", "SQL"];
    const vals = [0.92, 0.8, 0.72, 0.62, 0.85, 0.78];
    ctx.clearRect(0, 0, w, w);
    ctx.strokeStyle = "rgba(127,127,160,.35)";
    for (let r = 0.25; r <= 1; r += 0.25) {
      ctx.beginPath();
      labels.forEach((_, i) => {
        const a = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
        const x = cx + Math.cos(a) * cx * 0.8 * r;
        const y = cx + Math.sin(a) * cx * 0.8 * r;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.closePath();
      ctx.stroke();
    }
    const accent = getComputedStyle(root).getPropertyValue("--accent").trim() || "#22d3ee";
    ctx.beginPath();
    vals.forEach((v, i) => {
      const a = (Math.PI * 2 * i) / vals.length - Math.PI / 2;
      const x = cx + Math.cos(a) * cx * 0.8 * v;
      const y = cx + Math.sin(a) * cx * 0.8 * v;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = accent + "55";
    ctx.strokeStyle = accent;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = getComputedStyle(root).getPropertyValue("--ink").trim();
    ctx.font = "11px Outfit, sans-serif";
    labels.forEach((lb, i) => {
      const a = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
      ctx.fillText(lb, cx + Math.cos(a) * cx * 0.9 - 14, cx + Math.sin(a) * cx * 0.9);
    });
  }
  drawRadar();
  window.addEventListener("accent-change", drawRadar);

  const barIo = new IntersectionObserver((ents) => {
    ents.forEach((en) => {
      if (en.isIntersecting) {
        document.querySelectorAll(".fill").forEach((f) => {
          f.style.width = `${f.dataset.w}%`;
        });
      }
    });
  });
  const bars = document.getElementById("skillBars");
  if (bars) barIo.observe(bars);

  async function github() {
    try {
      const user = await fetch(`https://api.github.com/users/${GH}`).then((r) => r.json());
      const repos = await fetch(`https://api.github.com/users/${GH}/repos?sort=updated&per_page=6`).then((r) => r.json());
      const meta = document.getElementById("ghMeta");
      if (meta && user.login) {
        meta.textContent = `${user.public_repos} repos · ${user.followers} followers · ${user.following} following`;
      }
      const tip = document.getElementById("ghTip");
      if (tip && user.followers != null) tip.textContent = `${user.followers} followers · ${user.public_repos} repos`;
      const list = document.getElementById("repoList");
      if (list && Array.isArray(repos)) {
        list.innerHTML = repos
          .slice(0, 5)
          .map(
            (r) =>
              `<a class="repo glass" href="${r.html_url}" target="_blank" rel="noopener"><strong>${r.name}</strong><br><span style="color:var(--muted);font-size:.85rem">${r.description || "Repository"} · ★ ${r.stargazers_count}</span></a>`
          )
          .join("");
      }
      let weeks = [];
      try {
        const c = await fetch(`https://github-contributions-api.jogruber.de/v4/${GH}`).then((r) => r.json());
        weeks = (c.contributions || []).slice(-84);
      } catch (_) { /* fallback */ }
      const heat = document.getElementById("heat");
      if (heat) {
        const cells = weeks.length
          ? weeks
          : Array.from({ length: 84 }, () => ({ count: Math.floor(Math.random() * 4) }));
        heat.innerHTML = cells
          .map((d) => {
            const n = Math.min(3, d.count || d.intensity || 0);
            return `<i data-n="${n}"></i>`;
          })
          .join("");
      }
    } catch (_) {
      const meta = document.getElementById("ghMeta");
      if (meta) meta.textContent = "GitHub profile: vaalisaran (15 repositories)";
    }
  }
  github();

  const quotes = [...document.querySelectorAll("#quotes .quote")];
  let qi = 0;
  function showQuote() {
    quotes.forEach((q, i) => {
      q.style.display = i === qi ? "block" : "none";
    });
  }
  showQuote();
  document.getElementById("quoteNext")?.addEventListener("click", () => {
    qi = (qi + 1) % quotes.length;
    showQuote();
  });
  document.getElementById("quotePrev")?.addEventListener("click", () => {
    qi = (qi - 1 + quotes.length) % quotes.length;
    showQuote();
  });

  const viewsKey = "saran-views";
  const n = Number(localStorage.getItem(viewsKey) || 0) + 1;
  localStorage.setItem(viewsKey, String(n));
  const vc = document.getElementById("viewCount");
  if (vc) vc.textContent = String(n);

  const guestKey = "saran-guest";
  const guestList = document.getElementById("guestList");
  function renderGuest() {
    const notes = JSON.parse(localStorage.getItem(guestKey) || "[]");
    if (guestList) {
      guestList.innerHTML = notes
        .slice()
        .reverse()
        .map((g) => `<div class="guest glass">${g.text} <span style="color:var(--muted)">· ${g.at}</span></div>`)
        .join("");
    }
  }
  renderGuest();
  document.getElementById("guestForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = new FormData(e.target).get("note").toString().trim();
    if (!text) return;
    const notes = JSON.parse(localStorage.getItem(guestKey) || "[]");
    notes.push({ text, at: new Date().toLocaleDateString() });
    localStorage.setItem(guestKey, JSON.stringify(notes.slice(-40)));
    e.target.reset();
    renderGuest();
    beep("pop");
  });

  document.getElementById("copyEmail")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      const c = document.getElementById("copied");
      if (c) {
        c.hidden = false;
        setTimeout(() => (c.hidden = true), 1600);
      }
    } catch (_) {
      prompt("Copy email", EMAIL);
    }
  });

  const form = document.getElementById("contactForm");
  const ta = form?.querySelector("textarea");
  ta?.addEventListener("input", () => {
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  });
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    const fd = new FormData(form);
    let ok = true;
    const checks = {
      name: (v) => v.trim().length >= 2 || "Enter your name",
      email: (v) => /^\S+@\S+\.\S+$/.test(v) || "Enter a valid email",
      message: (v) => v.trim().length >= 8 || "Write a bit more"
    };
    Object.entries(checks).forEach(([k, fn]) => {
      const msg = fn(String(fd.get(k) || ""));
      const err = form.querySelector(`[data-for="${k}"]`);
      const good = msg === true;
      if (err) err.textContent = good ? "" : msg;
      if (!good) ok = false;
    });
    if (!ok) return;
    document.getElementById("formOk") && (document.getElementById("formOk").style.display = "block");
    const note = document.getElementById("formNote");
    if (note) note.hidden = false;
    const subject = encodeURIComponent(`Portfolio note from ${fd.get("name")}`);
    const bodyTxt = encodeURIComponent(`${fd.get("message")}\n\n— ${fd.get("name")} · ${fd.get("email")}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${bodyTxt}`;
  }, true);

  const slots = document.getElementById("slots");
  if (slots) {
    const hours = ["10:00", "11:30", "15:00", "16:30"];
    const day = new Date();
    day.setDate(day.getDate() + 1);
    const ds = day.toISOString().slice(0, 10);
    slots.innerHTML = hours
      .map(
        (h) =>
          `<a class="icon-btn glass" href="mailto:${EMAIL}?subject=${encodeURIComponent("15-min intro")}&body=${encodeURIComponent(`Hi Saran, can we talk ${ds} at ${h} IST?`)}">${ds} ${h} IST</a>`
      )
      .join("");
  }

  const cmdk = document.getElementById("cmdk");
  const cmdkInput = document.getElementById("cmdkInput");
  const cmdkList = document.getElementById("cmdkList");
  const cmds = [
    ["Home", "#home"],
    ["About", "#about"],
    ["Experience", "#work"],
    ["Projects", "#projects"],
    ["Skills", "#projects"],
    ["GitHub lab", "#lab"],
    ["Contact", "#contact"],
    ["Resume", "resume"],
    ["Terminal", "term"],
    ["Mini game", "play"],
    ["Toggle theme", "theme"]
  ];
  function renderCmds(q = "") {
    const items = cmds.filter((c) => c[0].toLowerCase().includes(q.toLowerCase()));
    cmdkList.innerHTML = items.map((c, i) => `<li data-go="${c[1]}" class="${i === 0 ? "active" : ""}">${c[0]}</li>`).join("");
  }
  function openCmd(on) {
    cmdk.classList.toggle("open", on);
    if (on) {
      renderCmds();
      cmdkInput.value = "";
      cmdkInput.focus();
    }
  }
  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openCmd(!cmdk.classList.contains("open"));
    }
    if (e.key === "Escape") {
      openCmd(false);
      document.getElementById("resumeModal")?.classList.remove("open");
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
    else document.querySelector(go)?.scrollIntoView({ behavior: "smooth" });
  }

  document.getElementById("resumeView")?.addEventListener("click", () => {
    document.getElementById("resumeModal")?.classList.add("open");
  });
  document.getElementById("resumeClose")?.addEventListener("click", () => {
    document.getElementById("resumeModal")?.classList.remove("open");
  });
  document.getElementById("resumeModal")?.addEventListener("click", (e) => {
    if (e.target.id === "resumeModal") e.target.classList.remove("open");
  });

  const seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let si = 0;
  window.addEventListener("keydown", (e) => {
    si = e.key === seq[si] ? si + 1 : 0;
    if (si === seq.length) {
      si = 0;
      document.getElementById("term")?.classList.add("open");
      document.getElementById("termIn")?.focus();
      beep("whoosh");
    }
  });

  const termIn = document.getElementById("termIn");
  const termOut = document.getElementById("termOut");
  termIn?.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const cmd = termIn.value.trim();
    termIn.value = "";
    const log = (t) => {
      termOut.innerHTML += `<div>${t}</div>`;
    };
    log(`$ ${cmd}`);
    if (cmd === "help") log("play · theme · mute · resume · exit");
    else if (cmd === "play") startGame();
    else if (cmd === "theme") document.getElementById("themeToggle")?.click();
    else if (cmd === "mute") soundBtn?.click();
    else if (cmd === "resume") document.getElementById("resumeModal")?.classList.add("open");
    else if (cmd === "exit") document.getElementById("term")?.classList.remove("open");
    else {
      log("unknown — try help");
      document.body.classList.toggle("terminal-mode", cmd === "matrix");
    }
  });

  function startGame() {
    const wrap = document.getElementById("game");
    const cv = document.getElementById("gameCanvas");
    wrap.classList.add("open");
    const ctx = cv.getContext("2d");
    let orbs = Array.from({ length: 6 }, () => ({
      x: Math.random() * 400 + 10,
      y: Math.random() * 240 + 10,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3
    }));
    let score = 0;
    let raf;
    cv.onclick = (e) => {
      const r = cv.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      orbs = orbs.filter((o) => {
        const hit = Math.hypot(o.x - x, o.y - y) < 16;
        if (hit) score += 1;
        return !hit;
      });
      if (!orbs.length) {
        wrap.classList.remove("open");
        cancelAnimationFrame(raf);
      }
    };
    function loop() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = "#fff";
      ctx.fillText(`score ${score}`, 10, 16);
      orbs.forEach((o) => {
        o.x += o.vx;
        o.y += o.vy;
        if (o.x < 8 || o.x > 412) o.vx *= -1;
        if (o.y < 8 || o.y > 272) o.vy *= -1;
        ctx.beginPath();
        ctx.arc(o.x, o.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = getComputedStyle(root).getPropertyValue("--accent");
        ctx.fill();
      });
      raf = requestAnimationFrame(loop);
    }
    loop();
  }
})();
