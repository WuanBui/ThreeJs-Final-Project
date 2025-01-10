import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js";

const animationMixers = [];
const clock = new THREE.Clock();

let scene, camera, renderer, orbitControls, particles;

const particleNum = 5000;
const maxRange = 700;
const minRange = maxRange / 2;
const textureSize = 32.0;


function setupSkybox() {
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    "./assets/w2c_skybox/cube_front.png", // Positive X
    "./assets/w2c_skybox/cube_back.png", // Negative X
    "./assets/w2c_skybox/cube_up.png", // Positive Y
    "./assets/w2c_skybox/cube_down.png", // Negative Y
    "./assets/w2c_skybox/cube_right.png", // Positive Z
    "./assets/w2c_skybox/cube_left.png", // Negative Z
  ]);

  scene.background = texture; // Set as the background for the scene
}

function setupLights() {
  const ambientLight = new THREE.AmbientLight(0x89aaff, 1); // Cool ambient light
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xddeeff, 1.5);
  directionalLight.position.set(500, 1000, -300);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
}

function setupScene1() {
  const gltfLoader = new GLTFLoader();
  const snowmanModelPath = "./assets/scene1/scene.gltf";

  gltfLoader.load(
    snowmanModelPath,
    (gltf) => {
      const snowmanModel = gltf.scene;
      snowmanModel.scale.set(10, 10, 10);
      snowmanModel.position.set(-20, -30, -20); // Adjust the position as needed
      snowmanModel.rotation.y = Math.PI;

      scene.add(snowmanModel);

      // Check for animations in the loaded model
      if (gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(snowmanModel);
        const action = mixer.clipAction(gltf.animations[1]); // Use the first animation
        action.play();

        // Add the mixer to an array for updating during rendering
        animationMixers.push(mixer);
      }
    },
    undefined,
    (error) => {
      console.error("Error loading snowmann model:", error);
    }
  );
}

function setupCar1() {
  const gltfLoader = new GLTFLoader();
  const snowmanModelPath = "./assets/car1/scene.gltf";

  gltfLoader.load(
    snowmanModelPath,
    (gltf) => {
      const snowmanModel = gltf.scene;
      snowmanModel.scale.set(15, 15, 15);
      snowmanModel.position.set(40, -17.5, -5); // Adjust the position as needed
      snowmanModel.rotation.y = Math.PI / 1.25;

      scene.add(snowmanModel);

      // Check for animations in the loaded model
      if (gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(snowmanModel);
        const action = mixer.clipAction(gltf.animations[0]); // Use the first animation
        action.play();

        // Add the mixer to an array for updating during rendering
        animationMixers.push(mixer);
      }
    },
    undefined,
    (error) => {
      console.error("Error loading snowmann model:", error);
    }
  );
}

function setupCar2() {
  const gltfLoader = new GLTFLoader();
  const snowmanModelPath = "./assets/car5/scene.gltf";

  gltfLoader.load(
    snowmanModelPath,
    (gltf) => {
      const snowmanModel = gltf.scene;
      snowmanModel.scale.set(25, 25, 25);
      snowmanModel.position.set(-7, -17.8, -30); // Adjust the position as needed
      snowmanModel.rotation.y = Math.PI / 1;

      scene.add(snowmanModel);

      // Check for animations in the loaded model
      if (gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(snowmanModel);
        const action = mixer.clipAction(gltf.animations[0]); // Use the first animation
        action.play();

        // Add the mixer to an array for updating during rendering
        animationMixers.push(mixer);
      }
    },
    undefined,
    (error) => {
      console.error("Error loading snowmann model:", error);
    }
  );
}

function setupBrandon() {
  const gltfLoader = new GLTFLoader();
  const snowmanModelPath = "./assets/brandon/scene.gltf";

  gltfLoader.load(
    snowmanModelPath,
    (gltf) => {
      const snowmanModel = gltf.scene;
      snowmanModel.scale.set(19, 19, 19);
      snowmanModel.position.set(28, -17.8, -40); // Adjust the position as needed
      snowmanModel.rotation.y = Math.PI / 1.3;

      scene.add(snowmanModel);

      // Check for animations in the loaded model
      if (gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(snowmanModel);
        const action = mixer.clipAction(gltf.animations[0]); // Use the first animation
        action.timeScale = 0.99;
        action.play();

        // Add the mixer to an array for updating during rendering
        animationMixers.push(mixer);
      }
    },
    undefined,
    (error) => {
      console.error("Error loading snowmann model:", error);
    }
  );
}


function disposeScene() {
  // Dispose renderer
  renderer.dispose();

  // Dispose particles
  if (particles) {
    particles.geometry.dispose();
    particles.material.dispose();
  }

  // Dispose animation mixers
  animationMixers.forEach((mixer) => mixer.uncacheRoot(mixer.getRoot()));

  // Traverse the scene and dispose of geometries and materials
  scene.traverse((object) => {
    if (object.isMesh) {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((mat) => mat.dispose());
        } else {
          object.material.dispose();
        }
      }
    }
  });
}

function drawRadialGradation(ctx, canvasRadius, canvasW, canvasH) {
  ctx.save();
  const gradient = ctx.createRadialGradient(
    canvasRadius,
    canvasRadius,
    0,
    canvasRadius,
    canvasRadius,
    canvasRadius
  );
  gradient.addColorStop(0, "rgba(255,255,255,1.0)");
  gradient.addColorStop(0.5, "rgba(255,255,255,0.5)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasW, canvasH);
  ctx.restore();
}

function getTexture() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const diameter = textureSize;
  canvas.width = diameter;
  canvas.height = diameter;
  const canvasRadius = diameter / 2;
  drawRadialGradation(ctx, canvasRadius, canvas.width, canvas.height);
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}


function setupSnowParticles() {
  const pointGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleNum * 3);
  const velocities = [];

  for (let i = 0; i < particleNum; i++) {
    positions[i * 3] = Math.random() * maxRange - minRange;
    positions[i * 3 + 1] = Math.random() * maxRange;
    positions[i * 3 + 2] = Math.random() * maxRange - minRange;

    velocities.push(new THREE.Vector3(0, -Math.random() * 0.05 - 0.02, 0));
  }

  pointGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  const snowTexture = getTexture();
  const pointMaterial = new THREE.PointsMaterial({
    size: 8,
    color: 0xffffff,
    map: snowTexture,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  });

  particles = new THREE.Points(pointGeometry, pointMaterial);
  particles.geometry.velocities = velocities;
  scene.add(particles);
}

function updateSnowParticles(timeStamp) {
  const posArr = particles.geometry.attributes.position.array;
  const velArr = particles.geometry.velocities;

  for (let i = 0; i < particleNum; i++) {
    posArr[i * 3 + 1] += velArr[i].y;

    if (posArr[i * 3 + 1] < -minRange) {
      posArr[i * 3 + 1] = minRange;
    }
  }

  particles.geometry.attributes.position.needsUpdate = true;
}

function render(timeStamp) {
  orbitControls.update();
  updateSnowParticles(timeStamp);

  const delta = clock.getDelta();
  animationMixers.forEach((mixer) => mixer.update(delta));

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

export function initScene1() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    33,
    window.innerWidth / window.innerHeight,
    0.1,
    4000
  );
  camera.position.set(220, 60, -350);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true;
  orbitControls.minDistance = 50;
  orbitControls.maxDistance = 140;
  orbitControls.dampingFactor = 0.5;

  orbitControls.minPolarAngle = Math.PI / 4; // Limit vertical rotation (down)
  orbitControls.maxPolarAngle = Math.PI / 2; // Limit vertical rotation (up)

  orbitControls.update();

  setupLights();
  setupScene1();
  setupCar1();
  setupCar2();
  setupSkybox();
  setupSnowParticles();
  setupBrandon();
  disposeScene();

  window.addEventListener("resize", onResize);
  document.getElementById("my-container").appendChild(renderer.domElement);

  document.addEventListener("keydown", (event) => {
    if (event.key === "r") {
      // Reset camera
      camera.position.set(220, 60, -350);
      orbitControls.update();
    }
  });

  requestAnimationFrame(render);
}

document.addEventListener("DOMContentLoaded", initScene1);
