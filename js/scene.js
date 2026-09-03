import * as THREE from "three";

const canvas = document.getElementById("gl");
if (!canvas) throw new Error("Missing WebGL canvas");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.z = 6.2;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

const group = new THREE.Group();
scene.add(group);

function accentHex() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#22d3ee";
  return Number.parseInt(raw.replace("#", "0x"));
}

const geo = new THREE.IcosahedronGeometry(1.55, 1);
const mat = new THREE.MeshStandardMaterial({
  color: accentHex(),
  metalness: 0.35,
  roughness: 0.25,
  emissive: 0x4c1d95,
  emissiveIntensity: 0.35
});
const core = new THREE.Mesh(geo, mat);
group.add(core);

const wire = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.72, 1),
  new THREE.MeshBasicMaterial({ color: 0xf472b6, wireframe: true, transparent: true, opacity: 0.55 })
);
group.add(wire);

const torus = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.55, 0.16, 128, 16),
  new THREE.MeshStandardMaterial({
    color: 0xa78bfa,
    metalness: 0.6,
    roughness: 0.2,
    emissive: accentHex(),
    emissiveIntensity: 0.2
  })
);
torus.position.set(2.1, 0.9, 0.4);
group.add(torus);

window.addEventListener("accent-change", () => {
  const c = accentHex();
  mat.color.setHex(c);
  torus.material.emissive.setHex(c);
});

const lights = [
  new THREE.AmbientLight(0xffffff, 0.45),
  new THREE.PointLight(0x22d3ee, 18, 20),
  new THREE.PointLight(0xf472b6, 14, 18)
];
lights[1].position.set(4, 3, 4);
lights[2].position.set(-4, -2, 3);
lights.forEach((l) => scene.add(l));

const particles = new THREE.Points(
  (() => {
    const g = new THREE.BufferGeometry();
    const n = 180;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  })(),
  new THREE.PointsMaterial({ color: 0xffffff, size: 0.035, transparent: true, opacity: 0.55 })
);
scene.add(particles);

const target = { x: 0, y: 0 };
let extra = { x: 0, y: 0 };
window.addEventListener("pointer-gl", (e) => {
  target.x = (e.detail.x / innerWidth - 0.5) * 0.8;
  target.y = (e.detail.y / innerHeight - 0.5) * 0.5;
});

let dragging = false;
let lx = 0;
let ly = 0;
canvas.style.touchAction = "none";
canvas.addEventListener("pointerdown", (e) => {
  dragging = true;
  lx = e.clientX;
  ly = e.clientY;
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener("pointerup", () => { dragging = false; });
canvas.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  extra.x += (e.clientX - lx) * 0.012;
  extra.y += (e.clientY - ly) * 0.012;
  lx = e.clientX;
  ly = e.clientY;
});
window.addEventListener("deviceorientation", (e) => {
  if (e.gamma == null || e.beta == null) return;
  extra.x = e.gamma / 40;
  extra.y = (e.beta - 40) / 50;
});

function resize() {
  const { clientWidth: w, clientHeight: h } = canvas.parentElement;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
resize();
window.addEventListener("resize", resize);

let scrollT = 0;
window.addEventListener("scroll", () => {
  scrollT = window.scrollY * 0.0015;
}, { passive: true });

function frame(t) {
  const time = t * 0.001;
  group.rotation.y += (target.x + extra.x + scrollT - group.rotation.y) * 0.05;
  group.rotation.x += (-target.y * 0.6 + extra.y - group.rotation.x) * 0.05;
  core.rotation.y = time * 0.35;
  wire.rotation.y = -time * 0.22;
  torus.rotation.x = time * 0.8;
  torus.rotation.y = time * 0.4;
  particles.rotation.y = time * 0.05;
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
