/* gallery.js — Advanced Cutting-Edge Portfolio Gallery Engine */

(() => {
  // Global Data Model for Gallery Items
  const GALLERY_DATA = [
    {
      id: "space-nebula",
      title: "Deep Space Cosmic Nebula",
      category: "astronomy",
      orientation: "landscape",
      color: "purple",
      year: "2026",
      resolution: "8K",
      src: "images/gallery_space_nebula.jpg",
      exif: {
        camera: "Sony Alpha 7S III",
        aperture: "f/1.4",
        shutter: "1/4s",
        iso: "3200",
        focal: "24mm GM",
        dimensions: "7952 × 5304",
        location: "Kodaikanal Solar Observatory",
        license: "Commercial / Editorial"
      },
      colors: ["#9333ea", "#4f46e5", "#06b6d4", "#ec4899"],
      printPrice: 280,
      description: "Deep sky long-exposure astrophotography capturing ionized hydrogen emissions and stellar dust lanes over the Palani Hills.",
      scrollyStory: "Captured during a moonless night at Kodaikanal Observatory. 45 stacked exposures revealed unseen celestial structures."
    },
    {
      id: "cyber-city",
      title: "Neon Cybernetic Metropolis",
      category: "cyberpunk",
      orientation: "landscape",
      color: "cyan",
      year: "2025",
      resolution: "4K",
      src: "images/gallery_cyber_city.jpg",
      exif: {
        camera: "Fujifilm X-T5",
        aperture: "f/2.0",
        shutter: "1/250s",
        iso: "640",
        focal: "35mm F1.4",
        dimensions: "6240 × 4160",
        location: "Metro Tech Hub",
        license: "Creative Commons"
      },
      colors: ["#06b6d4", "#f43f5e", "#a855f7", "#facc15"],
      printPrice: 195,
      description: "High-density urban architectural perspective rendered with volumetric neon color grading and specular reflections.",
      scrollyStory: "Exploring urban nocturnal dynamics during high-density rainfall reflection."
    },
    {
      id: "sunset-mountains",
      title: "Golden Hour Mountain Mist",
      category: "nature",
      orientation: "landscape",
      color: "gold",
      year: "2025",
      resolution: "4K",
      src: "images/gallery_sunset_mountains.jpg",
      exif: {
        camera: "Canon EOS R5",
        aperture: "f/8.0",
        shutter: "1/1000s",
        iso: "100",
        focal: "70-200mm f/2.8",
        dimensions: "8192 × 5464",
        location: "Western Ghats Range",
        license: "Exclusive Print"
      },
      colors: ["#f59e0b", "#d97706", "#451a03", "#78350f"],
      printPrice: 340,
      description: "Panoramic horizon gradient looking across mountain ridges submerged in atmospheric inversion layers.",
      scrollyStory: "Standing atop 2,200m peaks at dusk as fog cascades into silent valleys."
    },
    {
      id: "minimal-arch",
      title: "Geometrical Swiss Architecture",
      category: "architecture",
      orientation: "portrait",
      color: "orange",
      year: "2024",
      resolution: "4K",
      src: "images/gallery_minimal_arch.jpg",
      exif: {
        camera: "Leica M11",
        aperture: "f/5.6",
        shutter: "1/500s",
        iso: "200",
        focal: "50mm Summilux",
        dimensions: "9528 × 6328",
        location: "Basel Design Center",
        license: "Editorial Rights"
      },
      colors: ["#d97706", "#0e7490", "#f59e0b", "#1e293b"],
      printPrice: 220,
      description: "Brutalist and modern Swiss structural harmony celebrating shadow play, terracotta columns, and clean geometry.",
      scrollyStory: "Shadow lines intersecting at 45 degrees under harsh midday solar illumination."
    },
    {
      id: "botanical-macro",
      title: "Medicinal Lens Macro Vector",
      category: "nature",
      orientation: "square",
      color: "emerald",
      year: "2023",
      resolution: "4K",
      src: "images/gallery_botanical_macro.jpg",
      exif: {
        camera: "Sony A7R V",
        aperture: "f/2.8",
        shutter: "1/160s",
        iso: "400",
        focal: "90mm Macro G",
        dimensions: "6000 × 6000",
        location: "Ayush Research Garden, Nagpur",
        license: "SIH'23 Winner Dataset"
      },
      colors: ["#10b981", "#34d399", "#064e3b", "#a7f3d0"],
      printPrice: 160,
      description: "Extreme close-up macro of leaf vein geometry used for feeding computer vision models in the SIH'23 finals.",
      scrollyStory: "Part of the 53% accuracy improvement dataset presented to the Ministry of Ayush."
    },
    {
      id: "observatory-360",
      title: "360° Equatorial Telescope Dome",
      category: "astronomy",
      orientation: "panoramic",
      color: "dark",
      year: "2026",
      resolution: "8K",
      src: "images/gallery_360_observatory.jpg",
      is360: true,
      exif: {
        camera: "Insta360 Pro 2",
        aperture: "f/2.4",
        shutter: "15s",
        iso: "1600",
        focal: "fisheye array",
        dimensions: "11968 × 5984",
        location: "IIA — Vainu Bappu Observatory (VBO), Kavalur",
        license: "Institutional Archive"
      },
      colors: ["#0f172a", "#38bdf8", "#1e293b", "#64748b"],
      printPrice: 410,
      description: "Interactive 360-degree VR panorama of the flagship 2.34m Vainu Bappu Telescope dome at Kavalur.",
      scrollyStory: "Drag to look around inside the historic astronomical dome at Vainu Bappu Observatory in full 360 degrees."
    },
    {
      id: "vbo-kavalur-telescope",
      title: "2.34m Vainu Bappu Optical Telescope",
      category: "astronomy",
      orientation: "landscape",
      color: "cyan",
      year: "2026",
      resolution: "8K",
      src: "images/gallery_space_nebula.jpg",
      exif: {
        camera: "CCD Telemetry System",
        aperture: "f/3.25",
        shutter: "Prime Focus",
        iso: "Scientific CCD",
        focal: "2.34 Meter Primary",
        dimensions: "8192 × 8192",
        location: "Vainu Bappu Observatory (VBO), Kavalur",
        license: "IIA Institutional Archive"
      },
      colors: ["#06b6d4", "#3b82f6", "#1e1b4b", "#67e8f9"],
      printPrice: 350,
      description: "Night sky optical telemetry observations captured at Asia's premier 2.34-meter Vainu Bappu Telescope in Kavalur.",
      scrollyStory: "Operating on-site as Engineer Trainee (Software) at IIA Vainu Bappu Observatory, Kavalur."
    },
    {
      id: "portrait-retouch",
      title: "Biometric AI Portrait Grading",
      category: "portrait",
      orientation: "square",
      color: "neon",
      year: "2024",
      resolution: "4K",
      src: "images/gallery_portrait_retouched.jpg",
      beforeSrc: "images/gallery_portrait_raw.jpg",
      isComparison: true,
      exif: {
        camera: "Nikon Z9",
        aperture: "f/1.8",
        shutter: "1/800s",
        iso: "100",
        focal: "85mm f/1.8 S",
        dimensions: "4500 × 4500",
        location: "NSCET Vision Lab",
        license: "Retouching Proof"
      },
      colors: ["#22d3ee", "#f43f5e", "#1e1b4b", "#fde047"],
      printPrice: 210,
      description: "Interactive side-by-side comparison curtain showing RAW vs AI-boosted facial color grading for anti-spoofing.",
      scrollyStory: "Drag the slider to compare uncalibrated camera output against processed spectral accuracy."
    },
    {
      id: "abstract-fluid",
      title: "Procedural Generative Wave Shaders",
      category: "generative",
      orientation: "landscape",
      color: "cyan",
      year: "2026",
      resolution: "8K",
      src: "images/gallery_abstract_fluid.jpg",
      exif: {
        camera: "Procedural WebGL Engine",
        aperture: "N/A Shader",
        shutter: "60 FPS",
        iso: "Native",
        focal: "Raymarching",
        dimensions: "Render-Scale 4K",
        location: "Browser Canvas",
        license: "Generative Art License"
      },
      colors: ["#0284c7", "#38bdf8", "#6366f1", "#f472b6"],
      printPrice: 250,
      description: "Real-time generative vector fluid simulation inspired by quantum particle mechanics and acoustic waves.",
      scrollyStory: "Generated procedurally using sinusoidal distortion maps."
    },
    {
      id: "screenshot-1",
      title: "IoT Anomaly Telemetry Dashboard",
      category: "cyberpunk",
      orientation: "landscape",
      color: "dark",
      year: "2025",
      resolution: "HD",
      src: "images/Screenshot 2026-08-05 121300.png",
      exif: {
        camera: "Software Interface UI",
        aperture: "Vector UI",
        shutter: "Realtime",
        iso: "100",
        focal: "Full Stack",
        dimensions: "1920 × 1080",
        location: "Spica Tech Lab",
        license: "Project Showcase"
      },
      colors: ["#0f172a", "#22d3ee", "#a78bfa", "#34d399"],
      printPrice: 150,
      description: "Live system dashboard monitoring industrial sensor streams via Isolation Forest & LSTM neural nets.",
      scrollyStory: "Real-time telemetry interface deployed for anomaly detection."
    },
    {
      id: "screenshot-2",
      title: "E-Learning Biometric Classroom",
      category: "architecture",
      orientation: "landscape",
      color: "emerald",
      year: "2024",
      resolution: "HD",
      src: "images/Screenshot 2026-08-05 122656.png",
      exif: {
        camera: "Django Platform",
        aperture: "Full Stack UI",
        shutter: "Instant",
        iso: "200",
        focal: "Python API",
        dimensions: "1920 × 1080",
        location: "NSCET Hackathon Winner",
        license: "Winner Project"
      },
      colors: ["#34d399", "#065f46", "#111827", "#f3f4f6"],
      printPrice: 175,
      description: "Award-winning virtual classroom environment featuring face-verification attendance & AI assistant.",
      scrollyStory: "Secured 1st Prize among 80+ teams at NSCET'24."
    }
  ];

  // State Management
  let currentLayout = "masonry";
  let selectedItems = new Set();
  let activeItemIndex = 0;
  let isBatchMode = false;
  let isAudioPlaying = false;
  let audioSynth = null;
  let proofRatings = {};
  let proofAnnotations = {};

  // DOM Elements
  const container = document.getElementById("galleryContainer");
  const searchInput = document.getElementById("gallerySearch");
  const autocompleteBox = document.getElementById("autocompleteBox");
  const catFilter = document.getElementById("catFilter");
  const colorFilter = document.getElementById("colorFilter");
  const orientFilter = document.getElementById("orientFilter");
  const sortFilter = document.getElementById("sortFilter");
  const layoutBtns = document.querySelectorAll(".layout-btn");
  const regionChips = document.querySelectorAll(".region-chip");
  const watermarkToggle = document.getElementById("watermarkToggle");
  const batchDock = document.getElementById("batchDock");
  const selectedCountEl = document.getElementById("selectedCount");
  const lightboxModal = document.getElementById("lightboxModal");
  const wallModal = document.getElementById("wallModal");
  const panoModal = document.getElementById("panoModal");
  const storyModal = document.getElementById("storyModal");
  const customContext = document.getElementById("customContext");
  const toast = document.getElementById("galleryToast");
  const audioBtn = document.getElementById("audioAtmosphereBtn");

  // Show Toast Message
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2800);
  }

  // Web Audio Generative Atmosphere Soundscape
  function toggleAudioAtmosphere() {
    if (isAudioPlaying) {
      if (audioSynth) audioSynth.stop();
      isAudioPlaying = false;
      if (audioBtn) audioBtn.classList.remove("on");
      showToast("Audio atmosphere muted");
      return;
    }

    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "triangle";
      osc1.frequency.setValueAtTime(110, ctx.currentTime); // A2
      osc2.frequency.setValueAtTime(164.81, ctx.currentTime); // E3 chord

      gain.gain.setValueAtTime(0.04, ctx.currentTime);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      audioSynth = {
        stop: () => {
          osc1.stop();
          osc2.stop();
          ctx.close();
        }
      };

      isAudioPlaying = true;
      if (audioBtn) audioBtn.classList.add("on");
      showToast("Generative space soundscape active 🎵");
    } catch (_) {
      showToast("Audio Context not available");
    }
  }

  if (audioBtn) audioBtn.addEventListener("click", toggleAudioAtmosphere);

  // Render Main Gallery Grid
  function renderGallery() {
    if (!container) return;

    // Filter Logic
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const catVal = catFilter ? catFilter.value : "all";
    const colorVal = colorFilter ? colorFilter.value : "all";
    const orientVal = orientFilter ? orientFilter.value : "all";
    const sortVal = sortFilter ? sortFilter.value : "newest";

    let filtered = GALLERY_DATA.filter((item) => {
      const matchesQ =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.exif.camera.toLowerCase().includes(query) ||
        item.exif.location.toLowerCase().includes(query);

      const matchesCat = catVal === "all" || item.category === catVal;
      const matchesColor = colorVal === "all" || item.color === colorVal;
      const matchesOrient = orientVal === "all" || item.orientation === orientVal;

      return matchesQ && matchesCat && matchesColor && matchesOrient;
    });

    // Sorting
    if (sortVal === "newest") filtered.sort((a, b) => b.year - a.year);
    else if (sortVal === "price-asc") filtered.sort((a, b) => a.printPrice - b.printPrice);
    else if (sortVal === "price-desc") filtered.sort((a, b) => b.printPrice - a.printPrice);

    // Apply Layout Class
    container.className = `gallery-container grid-${currentLayout}`;

    // Render Cards HTML
    if (currentLayout === "split") {
      const spotlight = filtered[0] || GALLERY_DATA[0];
      const listItems = filtered.slice(1);

      container.innerHTML = `
        <div class="spotlight-pane glass watermarked-img spot" onclick="openLightboxById('${spotlight.id}')">
          <img src="${spotlight.src}" alt="${spotlight.title}" loading="lazy" />
          <div class="card-info">
            <span class="badge-tag">${spotlight.category}</span>
            <h4>${spotlight.title}</h4>
            <p>${spotlight.description}</p>
          </div>
        </div>
        <div class="list-pane">
          ${listItems.map((item, idx) => createCardHTML(item, idx + 1)).join("")}
        </div>
      `;
    } else {
      container.innerHTML = filtered.map((item, idx) => createCardHTML(item, idx)).join("");
    }

    // Attach Intersection Observer for Focus Pull Blur-up
    document.querySelectorAll(".gallery-card img").forEach((img) => {
      if (img.complete) {
        img.parentElement.classList.add("loaded");
      } else {
        img.addEventListener("load", () => img.parentElement.classList.add("loaded"));
      }
    });
  }

  // Generate Card HTML
  function createCardHTML(item, index) {
    const isChecked = selectedItems.has(item.id);
    const rating = proofRatings[item.id] || 0;

    return `
      <article class="gallery-card glass spot watermarked-img" data-id="${item.id}" data-idx="${index}">
        <div class="batch-checkbox ${isChecked ? "checked" : ""}" onclick="toggleBatchSelect(event, '${item.id}')">
          ✓
        </div>
        <div class="card-badges">
          ${item.is360 ? `<span class="badge-tag" style="background:#0284c7">360° VR</span>` : ""}
          ${item.isComparison ? `<span class="badge-tag" style="background:#f43f5e">RAW/AI</span>` : ""}
          <span class="badge-tag">${item.category}</span>
        </div>
        <div class="img-wrap loading" onclick="openLightboxById('${item.id}')">
          ${
            item.isComparison
              ? `
            <div class="compare" data-compare>
              <div class="after"><img src="${item.src}" alt="${item.title}" /></div>
              <div class="before"><img src="${item.beforeSrc}" alt="RAW Before" style="max-width:none;width:100%" /></div>
              <input type="range" min="0" max="100" value="50" onclick="event.stopPropagation()" />
            </div>`
              : `<img src="${item.src}" alt="${item.title}" loading="lazy" />`
          }
        </div>
        <div class="card-info" onclick="openLightboxById('${item.id}')">
          <h4>${item.title}</h4>
          <p>${item.description}</p>
          <div class="card-meta-row">
            <span>📷 ${item.exif.camera}</span>
            <span>$${item.printPrice} Print</span>
          </div>
          <div class="card-meta-row">
            <div class="color-swatch-list">
              ${(item.colors || []).map((c) => `<span class="mini-swatch" style="background:${c}"></span>`).join("")}
            </div>
            <div class="star-rating" onclick="event.stopPropagation(); setRating('${item.id}', 5)">
              ${"★".repeat(rating)}${"☆".repeat(5 - rating)}
            </div>
          </div>
        </div>
      </article>
    `;
  }

  // Batch Select Toggle
  window.toggleBatchSelect = function (e, id) {
    e.stopPropagation();
    if (selectedItems.has(id)) selectedItems.delete(id);
    else selectedItems.add(id);

    if (selectedItems.size > 0) {
      document.body.classList.add("batch-mode");
      if (batchDock) batchDock.classList.add("active");
      if (selectedCountEl) selectedCountEl.textContent = `${selectedItems.size} items selected`;
    } else {
      document.body.classList.remove("batch-mode");
      if (batchDock) batchDock.classList.remove("active");
    }
    renderGallery();
  };

  // Set Proofing Rating
  window.setRating = function (id, star) {
    proofRatings[id] = star;
    renderGallery();
    showToast(`Rated item ${star} stars ⭐`);
  };

  // Lightbox Modal Controller
  window.openLightboxById = function (id) {
    const idx = GALLERY_DATA.findIndex((item) => item.id === id);
    if (idx !== -1) openLightbox(idx);
  };

  function openLightbox(index) {
    activeItemIndex = index;
    const item = GALLERY_DATA[index];
    if (!item || !lightboxModal) return;

    const imgEl = document.getElementById("lightboxImg");
    const titleEl = document.getElementById("lightboxTitle");
    const descEl = document.getElementById("lightboxDesc");
    const exifGrid = document.getElementById("lightboxExifGrid");
    const paletteEl = document.getElementById("lightboxPalette");

    if (imgEl) imgEl.src = item.src;
    if (titleEl) titleEl.textContent = item.title;
    if (descEl) descEl.textContent = item.description;

    if (exifGrid) {
      exifGrid.innerHTML = `
        <div class="exif-box"><label>Camera</label><val>${item.exif.camera}</val></div>
        <div class="exif-box"><label>Aperture</label><val>${item.exif.aperture}</val></div>
        <div class="exif-box"><label>Shutter</label><val>${item.exif.shutter}</val></div>
        <div class="exif-box"><label>ISO</label><val>${item.exif.iso}</val></div>
        <div class="exif-box"><label>Focal Length</label><val>${item.exif.focal}</val></div>
        <div class="exif-box"><label>Dimensions</label><val>${item.exif.dimensions}</val></div>
        <div class="exif-box"><label>Location</label><val>${item.exif.location}</val></div>
        <div class="exif-box"><label>Licensing</label><val>${item.exif.license}</val></div>
      `;
    }

    if (paletteEl) {
      paletteEl.innerHTML = (item.colors || [])
        .map((c) => `<div class="mini-swatch" style="background:${c};width:24px;height:24px" title="${c}"></div>`)
        .join("");
    }

    lightboxModal.classList.add("open");
    // Haptic feedback trigger
    if (navigator.vibrate) navigator.vibrate(15);
  }

  function closeLightbox() {
    if (lightboxModal) lightboxModal.classList.remove("open");
  }

  document.getElementById("lightboxClose")?.addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrev")?.addEventListener("click", () => {
    activeItemIndex = (activeItemIndex - 1 + GALLERY_DATA.length) % GALLERY_DATA.length;
    openLightbox(activeItemIndex);
  });
  document.getElementById("lightboxNext")?.addEventListener("click", () => {
    activeItemIndex = (activeItemIndex + 1) % GALLERY_DATA.length;
    openLightbox(activeItemIndex);
  });

  // Framed Print Wall Visualizer
  window.openWallVisualizer = function () {
    const item = GALLERY_DATA[activeItemIndex] || GALLERY_DATA[0];
    if (!wallModal) return;

    const mockImg = document.getElementById("wallMockupImg");
    if (mockImg) mockImg.src = item.src;

    wallModal.classList.add("open");
  };

  document.getElementById("wallClose")?.addEventListener("click", () => wallModal?.classList.remove("open"));

  // Room Wall Switcher
  document.querySelectorAll("[data-wall]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = document.getElementById("wallViewStage");
      if (view) view.className = `wall-view wall-${btn.dataset.wall}`;
    });
  });

  // Frame Finish Switcher
  document.querySelectorAll("[data-frame]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const frame = document.getElementById("framedArtwork");
      if (frame) {
        frame.className = `framed-artwork-mockup frame-${btn.dataset.frame} ${frame.dataset.mat || "mat-white"}`;
        frame.dataset.frame = `frame-${btn.dataset.frame}`;
      }
    });
  });

  // Matting Switcher
  document.querySelectorAll("[data-mat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const frame = document.getElementById("framedArtwork");
      if (frame) {
        frame.className = `framed-artwork-mockup ${frame.dataset.frame || "frame-oak"} mat-${btn.dataset.mat}`;
        frame.dataset.mat = `mat-${btn.dataset.mat}`;
      }
    });
  });

  // 360° Panorama WebGL Canvas Viewer
  window.open360Panorama = function () {
    if (!panoModal) return;
    panoModal.classList.add("open");

    const canvas = document.getElementById("panoramaCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let isDragging = false;
    let startX = 0;
    let offset = 0;

    const panoImg = new Image();
    panoImg.src = "images/gallery_360_observatory.jpg";

    function drawPano() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (!panoImg.complete) return;

      const iw = panoImg.width;
      const ih = panoImg.height;

      // Draw seamless wrap
      const curX = (offset % iw + iw) % iw;
      ctx.drawImage(panoImg, curX, 0, iw - curX, ih, 0, 0, (iw - curX) * (canvas.height / ih), canvas.height);
      ctx.drawImage(panoImg, 0, 0, curX, ih, (iw - curX) * (canvas.height / ih), 0, curX * (canvas.height / ih), canvas.height);
    }

    panoImg.onload = drawPano;
    window.addEventListener("resize", drawPano);

    canvas.onmousedown = (e) => { isDragging = true; startX = e.clientX; };
    window.onmousemove = (e) => {
      if (!isDragging) return;
      offset += (e.clientX - startX) * 1.5;
      startX = e.clientX;
      drawPano();
    };
    window.onmouseup = () => { isDragging = false; };
  };

  document.getElementById("panoClose")?.addEventListener("click", () => panoModal?.classList.remove("open"));

  // Story & Vertical Auto-Play Slideshow Modal
  window.openStories = function () {
    if (!storyModal) return;
    storyModal.classList.add("open");

    let sIdx = 0;
    const mediaEl = document.getElementById("storyImg");
    const titleEl = document.getElementById("storyTitleText");
    const fillEl = document.getElementById("storyProgressFill");

    function renderStoryStep() {
      const item = GALLERY_DATA[sIdx];
      if (!item) return;

      if (mediaEl) mediaEl.src = item.src;
      if (titleEl) titleEl.textContent = item.title;

      if (fillEl) {
        fillEl.style.width = "0%";
        setTimeout(() => (fillEl.style.width = "100%"), 50);
      }
    }

    renderStoryStep();

    const timer = setInterval(() => {
      sIdx = (sIdx + 1) % GALLERY_DATA.length;
      renderStoryStep();
    }, 4500);

    document.getElementById("storyClose")?.addEventListener("click", () => {
      clearInterval(timer);
      storyModal.classList.remove("open");
    });
  };

  // Layout Toggles Listener
  layoutBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      layoutBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentLayout = btn.dataset.layout;
      renderGallery();
      showToast(`Switched layout to ${currentLayout.toUpperCase()}`);
    });
  });

  // Regional Preset Switcher
  regionChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      regionChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const region = chip.dataset.region;
      document.body.dataset.region = region;
      showToast(`Activated regional preset: ${chip.textContent.trim()}`);
    });
  });

  // Watermark Toggle
  if (watermarkToggle) {
    watermarkToggle.addEventListener("change", () => {
      document.body.dataset.watermark = watermarkToggle.checked ? "true" : "false";
      showToast(`Watermark overlay ${watermarkToggle.checked ? "enabled" : "disabled"}`);
    });
  }

  // Search Autocomplete Engine
  if (searchInput && autocompleteBox) {
    searchInput.addEventListener("input", () => {
      const val = searchInput.value.toLowerCase().trim();
      if (!val) {
        autocompleteBox.classList.remove("open");
        renderGallery();
        return;
      }

      const matches = GALLERY_DATA.filter((i) =>
        i.title.toLowerCase().includes(val) ||
        i.category.toLowerCase().includes(val) ||
        i.exif.location.toLowerCase().includes(val)
      );

      if (matches.length) {
        autocompleteBox.innerHTML = matches
          .map(
            (m) =>
              `<div class="autocomplete-item" onclick="selectAutocomplete('${m.title}')">
                <span>${m.title}</span>
                <span class="tag-type">${m.category}</span>
              </div>`
          )
          .join("");
        autocompleteBox.classList.add("open");
      } else {
        autocompleteBox.classList.remove("open");
      }

      renderGallery();
    });
  }

  window.selectAutocomplete = function (title) {
    if (searchInput) searchInput.value = title;
    if (autocompleteBox) autocompleteBox.classList.remove("open");
    renderGallery();
  };

  // Filter Change Listeners
  [catFilter, colorFilter, orientFilter, sortFilter].forEach((f) => {
    f?.addEventListener("change", renderGallery);
  });

  // Content Protection: Right-Click Context Menu Blocker
  window.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if (!customContext) return;
    customContext.style.left = `${e.clientX}px`;
    customContext.style.top = `${e.clientY}px`;
    customContext.classList.add("open");
  });

  window.addEventListener("click", () => customContext?.classList.remove("open"));

  // Batch ZIP Download Simulation
  document.getElementById("batchDownloadBtn")?.addEventListener("click", () => {
    showToast(`Downloading ZIP archive containing ${selectedItems.size} high-res assets 📦`);
  });

  // Keyboard Shortcuts (Arrow keys for lightbox navigation, Esc to close)
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLightbox();
      wallModal?.classList.remove("open");
      panoModal?.classList.remove("open");
      storyModal?.classList.remove("open");
    } else if (lightboxModal?.classList.contains("open")) {
      if (e.key === "ArrowLeft") document.getElementById("lightboxPrev")?.click();
      if (e.key === "ArrowRight") document.getElementById("lightboxNext")?.click();
    }
  });

  // Initial Render on Page Load
  renderGallery();
})();
