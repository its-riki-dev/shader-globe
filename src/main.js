import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import getStarfield from './getStarfield.js';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 4);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

const raycaster = new THREE.Raycaster();
const pointerPos = new THREE.Vector2();
const globeUV = new THREE.Vector2();

const textureLoader = new THREE.TextureLoader();
const starSprite = textureLoader.load('./assets/circle.png');
const otherMap = textureLoader.load('./assets/04_rainbow1k.jpg');
const colorMap = textureLoader.load('./assets/00_earthmap1k.jpg');
const elevMap = textureLoader.load('./assets/01_earthbump1k.jpg');
const alphaMap = textureLoader.load('./assets/02_earthspec1k.jpg');

const globeGroup = new THREE.Group();
scene.add(globeGroup);

// Wireframe globe
const wireGeo = new THREE.IcosahedronGeometry(1, 16);
const wireMat = new THREE.MeshBasicMaterial({
  color: 0x0099ff,
  wireframe: true,
  transparent: true,
  opacity: 0.1,
});
const globe = new THREE.Mesh(wireGeo, wireMat);
globeGroup.add(globe);

// Points globe
const detail = 120;
const pointsGeo = new THREE.IcosahedronGeometry(1, detail);

const uniforms = {
  size: { value: 4.0 },
  colorTexture: { value: colorMap },
  otherTexture: { value: otherMap },
  elevTexture: { value: elevMap },
  alphaTexture: { value: alphaMap },
  mouseUV: { value: new THREE.Vector2(0.0, 0.0) },
};

const pointsMat = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  transparent: true,
});

const points = new THREE.Points(pointsGeo, pointsMat);
globeGroup.add(points);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x080820, 3);
scene.add(hemiLight);

const stars = getStarfield({ numStars: 4500, sprite: starSprite });
scene.add(stars);

// Handle raycasting + Update globeUV
function handleRaycast() {
  raycaster.setFromCamera(pointerPos, camera);
  const intersects = raycaster.intersectObjects([globe], false);
  if (intersects.length > 0) {
    globeUV.copy(intersects[0].uv);
  }
  uniforms.mouseUV.value = globeUV;
}

const clock = new THREE.Clock();

// Animation loop
function animate() {
  renderer.render(scene, camera);
  handleRaycast();
  requestAnimationFrame(animate);
  controls.update();

  const elapsedTime = clock.getElapsedTime();
  globeGroup.rotation.y = elapsedTime * 0.05;
}
animate();

// Handle mouse movement
window.addEventListener('mousemove', (evt) => {
  pointerPos.set(
    (evt.clientX / window.innerWidth) * 2 - 1,
    -(evt.clientY / window.innerHeight) * 2 + 1
  );
});

// Resize canvas
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
