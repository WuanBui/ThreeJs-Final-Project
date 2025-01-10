import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js";

const animationMixers = [];
const clock = new THREE.Clock();

let scene, camera, renderer, orbitControls, particles, planeMesh;
let audioListener;
const particleNum = 1000;
const maxRange = 500;
const minRange = maxRange / 2;
const textureSize = 30.0;

function setupSkybox() {
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    "./assets/scene3_skybox/cube_front.png", // Positive X
    "./assets/scene3_skybox/cube_back.png", // Negative X
    "./assets/scene3_skybox/cube_up.png", // Positive Y
    "./assets/scene3_skybox/cube_down.png", // Negative Y
    "./assets/scene3_skybox/cube_right.png", // Positive Z
    "./assets/scene3_skybox/cube_left.png", // Negative Z
  ]);

  scene.background = texture;
}

function setupLights() {
  const ambientLight = new THREE.AmbientLight(0x666666, 1);
  scene.add(ambientLight);

  // SpotLight for directional highlights
  const spotLight = new THREE.SpotLight(0xffffff, 0.5);
  spotLight.position.set(-1000, 700, 1700);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 2048;
  spotLight.shadow.mapSize.height = 2048;
  scene.add(spotLight);

  // Directional light for simulating sunlight
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(500, 1000, -300);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Point light for localized lighting effects
  const pointLight = new THREE.PointLight(0xffffff, 1, 500); // Golden tone for warmth
  pointLight.position.set(300, 200, 100);
  scene.add(pointLight);
}

function setupScene3() {
  const gltfLoader = new GLTFLoader();
  const snowmanModelPath = "./assets/scene3/scene.gltf";

  gltfLoader.load(
    snowmanModelPath,
    (gltf) => {
      const snowmanModel = gltf.scene;
      snowmanModel.scale.set(25, 25, 25);
      snowmanModel.position.set(-150, 0, -80); // Adjust the position as needed
      // snowmanModel.rotation.y = Math.PI;

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

function setupDirtbike() {
  const gltfLoader = new GLTFLoader();
  const snowmanModelPath = "./assets/dirtbike/scene.gltf";

  gltfLoader.load(
    snowmanModelPath,
    (gltf) => {
      const snowmanModel = gltf.scene;
      snowmanModel.scale.set(4.5, 4.5, 4.5);
      snowmanModel.position.set(160, 1, 45); // Adjust the position as needed
      snowmanModel.rotation.y = Math.PI / 2;

      scene.add(snowmanModel);

      if (gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(snowmanModel);
        const action = mixer.clipAction(gltf.animations[0]); // Use the first animation
        action.play();

        animationMixers.push(mixer);
      }
    },
    undefined,
    (error) => {
      console.error("Error loading snowmann model:", error);
    }
  );
}

function setupDirtbike1() {
  const gltfLoader = new GLTFLoader();
  const snowmanModelPath = "./assets/dirtbike1/scene.gltf";

  gltfLoader.load(
    snowmanModelPath,
    (gltf) => {
      const snowmanModel = gltf.scene;
      snowmanModel.scale.set(2.3, 2.3, 2.3);
      snowmanModel.position.set(230, 0, -7); // Adjust the position as needed
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

function setupHelmet() {
  const gltfLoader = new GLTFLoader();
  const snowmanModelPath = "./assets/helmet/scene.gltf";

  gltfLoader.load(
    snowmanModelPath,
    (gltf) => {
      const model = gltf.scene;
      model.scale.set(12, 12, 12);
      model.position.set(240, 9, 95);
      model.rotation.y = Math.PI / -2.5;
      scene.add(model);
      if (gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(model);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
        animationMixers.push(mixer);
      }
    },
    undefined,
    (error) => {
      console.error("Error loading model:", error);
    }
  );
}

function setupBrandon() {
  const gltfLoader = new GLTFLoader();
  const snowmanModelPath = "./assets/brandon1/scene.gltf";

  gltfLoader.load(
    snowmanModelPath,
    (gltf) => {
      const model = gltf.scene;
      model.scale.set(40, 40, 40);
      model.position.set(200, -31, 55);
      model.rotation.y = Math.PI / 1.5;
      scene.add(model);
      if (gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(model);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
        animationMixers.push(mixer);
      }
    },
    undefined,
    (error) => {
      console.error("Error loading model:", error);
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

function makeRoughGround(mesh) {
  const time = Date.now();

  mesh.geometry.verticesNeedUpdate = true;
  mesh.geometry.computeVertexNormals();
}

function render(timeStamp) {
  orbitControls.update();
  makeRoughGround(planeMesh);

  const delta = clock.getDelta(); // Calculate delta time
  animationMixers.forEach((mixer) => {
    mixer.update(delta);
  });

  const posArr = particles.geometry.attributes.position.array;
  const velArr = particles.geometry.velocities;

  for (let i = 0; i < particleNum; i++) {
    const velocity = velArr[i];
    const velX = Math.sin(timeStamp * 0.001 * velocity.x) * 0.1;
    const velZ = Math.cos(timeStamp * 0.0015 * velocity.z) * 0.1;
    posArr[i * 3] += velX;
    posArr[i * 3 + 1] += velocity.y;
    posArr[i * 3 + 2] += velZ;

    if (posArr[i * 3 + 1] < -minRange) {
      posArr[i * 3 + 1] = minRange;
    }
  }

  particles.geometry.attributes.position.needsUpdate = true;
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

export function initScene3() {
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000036, 0, minRange * 3);

  // scene.background = new THREE.Color(0xcaeef9);

  camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    4000
  );
  camera.position.set(800, 50, 150);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true;
  orbitControls.minDistance = 100;
  orbitControls.maxDistance = 380;
  orbitControls.dampingFactor = 0.5;

  orbitControls.minPolarAngle = Math.PI / 4; // Limit vertical rotation (down)
  orbitControls.maxPolarAngle = Math.PI / 2; // Limit vertical rotation (up)

  orbitControls.update();

  const planeGeometry = new THREE.PlaneGeometry(0, 0, 50, 50);
  const planeMaterial = new THREE.MeshLambertMaterial({
    color: 0x111934,
    side: THREE.DoubleSide,
  });
  planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
  planeMesh.rotation.x = -0.5 * Math.PI;
  planeMesh.position.set(170, -100, 50);
  scene.add(planeMesh);

  const pointGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleNum * 3);
  const velocities = [];

  for (let i = 0; i < particleNum; i++) {
    positions[i * 3] = Math.random() * maxRange - minRange;
    positions[i * 3 + 1] = Math.random() * maxRange - minRange;
    positions[i * 3 + 2] = Math.random() * maxRange - minRange;
    velocities.push(
      new THREE.Vector3(
        Math.random() * 6 - 3,
        -Math.random() * 0.05,
        Math.random() * 6 - 3
      )
    );
  }

  pointGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  const pointMaterial = new THREE.PointsMaterial({
    size: 5,
    color: 0x111934,
    map: getTexture(),
    transparent: true,
    fog: true,
    depthWrite: false,
  });

  particles = new THREE.Points(pointGeometry, pointMaterial);
  particles.geometry.velocities = velocities;
  scene.add(particles);

  audioListener = new THREE.AudioListener();
  camera.add(audioListener);

  setupLights();
  setupScene3();
  setupDirtbike();
  setupDirtbike1();
  setupHelmet();
  setupSkybox();
  setupBrandon();
  disposeScene();

  window.addEventListener("resize", onResize);
  document.getElementById("my-container").appendChild(renderer.domElement);
  document.addEventListener("keydown", (event) => {
    if (event.key === "r") {
      // Reset camera
      camera.position.set(800, 50, 150);
      orbitControls.update();
    }
  });
  requestAnimationFrame(render);
}

document.addEventListener("DOMContentLoaded", initScene3);
