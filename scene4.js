import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js";

const animationMixers = [];
const clock = new THREE.Clock();

let scene, camera, renderer, orbitControls, particles;
const particleNum = 10000;
const maxRange = 700;
const minRange = maxRange / 2;
const textureSize = 64.0;

function setupSkybox() {
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    "./assets/scene4_skybox/cube_front.png", // Positive X
    "./assets/scene4_skybox/cube_back.png", // Negative X
    "./assets/scene4_skybox/cube_up.png", // Positive Y
    "./assets/scene4_skybox/cube_down.png", // Negative Y
    "./assets/scene4_skybox/cube_right.png", // Positive Z
    "./assets/scene4_skybox/cube_left.png", // Negative Z
  ]);

  scene.background = texture; // Set as the background for the scene
}

function setupLights() {
  // General ambient light for the whole scene
  const ambientLight = new THREE.AmbientLight(0x666666, 1.5);
  scene.add(ambientLight);

  // Directional light for simulating sunlight
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(500, 100, -300);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Point light for localized lighting effects
  const pointLight = new THREE.PointLight(0xffffff, 0.5, 450); // Golden tone for warmth
  pointLight.position.set(0, 200, 100);
  scene.add(pointLight);
}

function setupScene4() {
  const gltfLoader = new GLTFLoader();
  const snowmanModelPath = "./assets/scene4/scene.gltf";

  gltfLoader.load(
    snowmanModelPath,
    (gltf) => {
      const snowmanModel = gltf.scene;
      snowmanModel.scale.set(20, 20, 20);
      snowmanModel.position.set(-20, 40, 1800); // Adjust the position as needed
      // snowmanModel.rotation.y = Math.PI / 1.5;

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

function setupCar5() {
  const gltfLoader = new GLTFLoader();
  const snowmanModelPath = "./assets/car2/scene.gltf";

  gltfLoader.load(
    snowmanModelPath,
    (gltf) => {
      const snowmanModel = gltf.scene;
      snowmanModel.scale.set(4.5, 4.5, 4.5);
      snowmanModel.position.set(17, 3.8, -45); // Adjust the position as needed
      snowmanModel.rotation.y = Math.PI / 30;

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

function setupCar6() {
  const gltfLoader = new GLTFLoader();
  const snowmanModelPath = "./assets/car6/scene.gltf";

  gltfLoader.load(
    snowmanModelPath,
    (gltf) => {
      const snowmanModel = gltf.scene;
      snowmanModel.scale.set(5.5, 5.5, 5.5);
      snowmanModel.position.set(620, -23, -665); // Adjust the position as needed
      // snowmanModel.rotation.y = Math.PI / 2 ;

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

function setupDriver() {
  const gltfLoader = new GLTFLoader();
  const snowmanModelPath = "./assets/brandon4/scene.gltf";

  gltfLoader.load(
    snowmanModelPath,
    (gltf) => {
      const snowmanModel = gltf.scene;
      snowmanModel.scale.set(9, 9, 9);
      snowmanModel.position.set(57, 6.5, -191); // Adjust the position as needed
      snowmanModel.rotation.y = Math.PI / -0.9;

      scene.add(snowmanModel);

      // Check for animations in the loaded model
      if (gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(snowmanModel);
        const action = mixer.clipAction(gltf.animations[0]); // Use the first animation

        // action.timeScale = 1;
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
    1,
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

function initRain() {
  const pointGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleNum * 3); // Particle positions
  const velocities = []; // Velocities for particles

  // Initialize particle positions and velocities
  for (let i = 0; i < particleNum; i++) {
    positions[i * 3] = Math.random() * maxRange - minRange; // X
    positions[i * 3 + 1] = Math.random() * maxRange; // Y (falling from higher)
    positions[i * 3 + 2] = Math.random() * maxRange - minRange; // Z

    // Increased fall speed for more intense rain
    velocities.push(new THREE.Vector3(0, -Math.random() * 2.0 - 0.4, 0)); // Increased speed
  }

  pointGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  const pointMaterial = new THREE.PointsMaterial({
    size: 2, // Small raindrops
    color: 0x87ceeb, // Light blue for raindrops
    transparent: true,
    opacity: 0.8, // Slight transparency
    map: getTexture(),
    depthWrite: false,
  });

  particles = new THREE.Points(pointGeometry, pointMaterial);
  particles.geometry.velocities = velocities;
  scene.add(particles);
}

function renderRain(timeStamp) {
  const delta = clock.getDelta();
  orbitControls.update();

  const posArr = particles.geometry.attributes.position.array;
  const velArr = particles.geometry.velocities;

  for (let i = 0; i < particleNum; i++) {
    // Update particle positions based on velocity
    posArr[i * 3 + 1] += velArr[i].y; // Y movement

    // Reset particle position if it falls below threshold
    if (posArr[i * 3 + 1] < -minRange) {
      posArr[i * 3] = Math.random() * maxRange - minRange; // X
      posArr[i * 3 + 1] = maxRange; // Reset to top
      posArr[i * 3 + 2] = Math.random() * maxRange - minRange; // Z
    }
  }

  particles.geometry.attributes.position.needsUpdate = true;

  animationMixers.forEach((mixer) => mixer.update(delta));

  renderer.render(scene, camera);
  requestAnimationFrame(renderRain);
}

function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

export function initScene4() {
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000036, 0, minRange * 3);

  camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    4000
  );
  camera.position.set(150, 130, -900);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true;
  orbitControls.minDistance = 100;
  orbitControls.maxDistance = 300;
  orbitControls.dampingFactor = 0.5;

  orbitControls.update();

  setupLights();
  setupScene4();
  setupCar5();
  setupCar6();
  setupSkybox();
  setupDriver();
  disposeScene();
  initRain();

  window.addEventListener("resize", onResize);
  document.getElementById("my-container").appendChild(renderer.domElement);
  document.addEventListener("keydown", (event) => {
    if (event.key === "r") {
      // Reset camera
      camera.position.set(150, 130, -900);
      orbitControls.update();
    }
  });
  requestAnimationFrame(renderRain);
}

document.addEventListener("DOMContentLoaded", initScene4);
