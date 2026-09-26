import * as THREE from "three";

const canvas = document.getElementById("gl");
if (!canvas) throw new Error("Missing WebGL canvas");

// 1. Scene & Camera Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(0, 0, 7.5);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: "high-performance"
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const group = new THREE.Group();
scene.add(group);

function getAccentHex() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#22d3ee";
  return parseInt(raw.replace("#", "0x"));
}

// 2. Central 3D Object: Quantum Sci-Fi Torus Knot Core
const coreGeo = new THREE.TorusKnotGeometry(1.1, 0.34, 180, 32, 2, 5);
const coreMat = new THREE.MeshStandardMaterial({
  color: getAccentHex(),
  metalness: 0.7,
  roughness: 0.15,
  emissive: 0x3b0764,
  emissiveIntensity: 0.45,
  flatShading: false
});
const coreMesh = new THREE.Mesh(coreGeo, coreMat);
coreMesh.position.set(-1.0, 0, 0);
group.add(coreMesh);

// Outer Holographic Wireframe Cage
const wireGeo = new THREE.DodecahedronGeometry(1.75, 1);
const wireMat = new THREE.MeshBasicMaterial({
  color: 0xf472b6,
  wireframe: true,
  transparent: true,
  opacity: 0.35
});
const wireMesh = new THREE.Mesh(wireGeo, wireMat);
wireMesh.position.set(-1.0, 0, 0);
group.add(wireMesh);

// 3. Floating Holographic Glass Photo Card (saran_pro.png)
const textureLoader = new THREE.TextureLoader();
const photoTexture = textureLoader.load("images/saran_pro.png");

const photoGeo = new THREE.PlaneGeometry(1.5, 1.8);
const photoMat = new THREE.MeshStandardMaterial({
  map: photoTexture,
  side: THREE.DoubleSide,
  roughness: 0.15,
  metalness: 0.1
});
const photoMesh = new THREE.Mesh(photoGeo, photoMat);
photoMesh.position.set(1.25, 0.1, 0.4);
photoMesh.rotation.y = -Math.PI / 8;

const frameBackGeo = new THREE.BoxGeometry(1.62, 1.92, 0.06);
const frameBackMat = new THREE.MeshStandardMaterial({
  color: 0x22d3ee,
  metalness: 0.85,
  roughness: 0.15,
  emissive: 0x0284c7,
  emissiveIntensity: 0.4
});
const frameBackMesh = new THREE.Mesh(frameBackGeo, frameBackMat);
frameBackMesh.position.set(1.25, 0.1, 0.35);
frameBackMesh.rotation.y = -Math.PI / 8;

const photoGroup = new THREE.Group();
photoGroup.add(frameBackMesh);
photoGroup.add(photoMesh);
group.add(photoGroup);

// 4. Triple Gyroscopic Laser Rings
const ringMat1 = new THREE.MeshStandardMaterial({
  color: 0x22d3ee,
  metalness: 0.9,
  roughness: 0.1,
  emissive: 0x0284c7,
  emissiveIntensity: 0.4,
  side: THREE.DoubleSide
});
const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.05, 16, 120), ringMat1);
ring1.rotation.x = Math.PI / 3;
group.add(ring1);

const ringMat2 = new THREE.MeshStandardMaterial({
  color: 0xa78bfa,
  metalness: 0.8,
  roughness: 0.1,
  emissive: 0x7c3aed,
  emissiveIntensity: 0.4,
  side: THREE.DoubleSide
});
const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.04, 16, 120), ringMat2);
ring2.rotation.y = Math.PI / 4;
ring2.rotation.x = -Math.PI / 6;
group.add(ring2);

const ringMat3 = new THREE.MeshStandardMaterial({
  color: 0xf472b6,
  metalness: 0.8,
  roughness: 0.1,
  emissive: 0xdb2777,
  emissiveIntensity: 0.4,
  side: THREE.DoubleSide
});
const ring3 = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.03, 16, 120), ringMat3);
ring3.rotation.z = Math.PI / 5;
group.add(ring3);

// Orbiting Tech Spheres
const moonGroup = new THREE.Group();
group.add(moonGroup);
const moons = [];
const moonColors = [0x22d3ee, 0xf472b6, 0xa78bfa, 0x34d399, 0xfbbf24];

for (let i = 0; i < 5; i++) {
  const mMat = new THREE.MeshStandardMaterial({
    color: moonColors[i],
    emissive: moonColors[i],
    emissiveIntensity: 0.7,
    roughness: 0.1
  });
  const mMesh = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), mMat);
  const angle = (i * Math.PI * 2) / 5;
  mMesh.position.set(Math.cos(angle) * 3.4, Math.sin(angle) * 1.8, Math.sin(angle * 2) * 0.9);
  moonGroup.add(mMesh);
  moons.push({ mesh: mMesh, angle, speed: 0.018 + i * 0.007 });
}

// 5. Spiral Cosmic Galaxy Particle Swarm
const particleCount = 500;
const particlePositions = new Float32Array(particleCount * 3);
const particleOriginals = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  const radius = 1.5 + Math.random() * 5.5;
  const theta = Math.random() * Math.PI * 2;
  const phi = (Math.random() - 0.5) * 1.5;

  const x = radius * Math.cos(theta);
  const y = radius * Math.sin(theta) * 0.6;
  const z = radius * Math.sin(phi);

  particlePositions[i * 3] = x;
  particlePositions[i * 3 + 1] = y;
  particlePositions[i * 3 + 2] = z;

  particleOriginals[i * 3] = x;
  particleOriginals[i * 3 + 1] = y;
  particleOriginals[i * 3 + 2] = z;
}

const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
const particleMat = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.045,
  transparent: true,
  opacity: 0.65,
  blending: THREE.AdditiveBlending
});
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// 6. Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
scene.add(ambientLight);

const light1 = new THREE.PointLight(0x22d3ee, 30, 30);
light1.position.set(5, 4, 5);
scene.add(light1);

const light2 = new THREE.PointLight(0xf472b6, 25, 25);
light2.position.set(-5, -4, 4);
scene.add(light2);

window.addEventListener("accent-change", () => {
  const hex = getAccentHex();
  coreMat.color.setHex(hex);
  frameBackMat.color.setHex(hex);
  light1.color.setHex(hex);
});

// 7. Interactive Kinetic Orbit & Touch Controls
let isDragging = false;
let previousPointer = { x: 0, y: 0 };
let velocity = { x: 0.005, y: 0.005 };
let rotationTarget = { x: 0, y: 0 };
let scalePulse = 1;

canvas.style.touchAction = "none";
canvas.style.cursor = "grab";

canvas.addEventListener("pointerdown", (e) => {
  isDragging = true;
  canvas.style.cursor = "grabbing";
  previousPointer.x = e.clientX;
  previousPointer.y = e.clientY;
  canvas.setPointerCapture(e.pointerId);
});

canvas.addEventListener("pointermove", (e) => {
  if (!isDragging) return;
  const deltaX = e.clientX - previousPointer.x;
  const deltaY = e.clientY - previousPointer.y;

  velocity.x = deltaX * 0.008;
  velocity.y = deltaY * 0.008;

  rotationTarget.y += velocity.x;
  rotationTarget.x += velocity.y;

  previousPointer.x = e.clientX;
  previousPointer.y = e.clientY;

  // Particle Shockwave Burst
  scalePulse = 1.15;
  const posArr = particleGeo.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    posArr[i * 3] += (Math.random() - 0.5) * 0.06;
    posArr[i * 3 + 1] += (Math.random() - 0.5) * 0.06;
  }
  particleGeo.attributes.position.needsUpdate = true;
});

canvas.addEventListener("pointerup", () => {
  isDragging = false;
  canvas.style.cursor = "grab";
});

// Double Click Color Cycle & Pulse Transformation
canvas.addEventListener("dblclick", () => {
  const currentHex = coreMat.color.getHex();
  const nextColors = [0x22d3ee, 0xf472b6, 0x34d399, 0xfbbf24, 0xa78bfa];
  const nextColor = nextColors[(nextColors.indexOf(currentHex) + 1) % nextColors.length];
  coreMat.color.setHex(nextColor);
  frameBackMat.color.setHex(nextColor);
  scalePulse = 1.35;
});

// Window Resize Handling
function onResize() {
  const parent = canvas.parentElement;
  if (!parent) return;
  const width = parent.clientWidth;
  const height = parent.clientHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
onResize();
window.addEventListener("resize", onResize);

// Scroll Parallax Sync
let scrollOffset = 0;
window.addEventListener("scroll", () => {
  scrollOffset = window.scrollY * 0.0008;
}, { passive: true });

// 8. Animation Render Loop
function animate(time) {
  const t = time * 0.001;

  if (!isDragging) {
    velocity.x *= 0.95;
    velocity.y *= 0.95;
    rotationTarget.y += velocity.x + 0.004;
    rotationTarget.x += velocity.y;
  }

  group.rotation.y += (rotationTarget.y - group.rotation.y) * 0.1;
  group.rotation.x += (rotationTarget.x + scrollOffset - group.rotation.x) * 0.1;

  // Rotations
  coreMesh.rotation.y = t * 0.5;
  coreMesh.rotation.x = Math.sin(t * 0.4) * 0.3;
  wireMesh.rotation.y = -t * 0.35;
  wireMesh.rotation.z = t * 0.2;

  photoGroup.position.y = Math.sin(t * 1.5) * 0.12;
  photoGroup.rotation.z = Math.cos(t * 1.2) * 0.05;

  ring1.rotation.z = t * 0.3;
  ring2.rotation.z = -t * 0.4;
  ring3.rotation.x = t * 0.2;

  moons.forEach((m) => {
    m.angle += m.speed;
    m.mesh.position.x = Math.cos(m.angle) * 3.3;
    m.mesh.position.y = Math.sin(m.angle * 1.4) * 1.7;
    m.mesh.position.z = Math.cos(m.angle * 2) * 1.1;
  });

  scalePulse += (1 - scalePulse) * 0.08;
  coreMesh.scale.setScalar(scalePulse);
  wireMesh.scale.setScalar(scalePulse * 1.05);

  const posArr = particleGeo.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    const idx = i * 3;
    posArr[idx] += (particleOriginals[idx] - posArr[idx]) * 0.02;
    posArr[idx + 1] += (particleOriginals[idx + 1] - posArr[idx + 1]) * 0.02;
    posArr[idx + 2] += (particleOriginals[idx + 2] - posArr[idx + 2]) * 0.02;
  }
  particleGeo.attributes.position.needsUpdate = true;
  particles.rotation.y = t * 0.04;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
