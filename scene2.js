import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js";
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js';
import { createNoise2D } from 'https://cdn.jsdelivr.net/npm/simplex-noise/dist/esm/simplex-noise.js';
let currentScene = "Derby Cars";
const raycaster = new THREE.Raycaster();
const animationMixers = [];
const clock = new THREE.Clock();

let scene, camera, renderer, orbitControls, particles, planeMesh;
let audioListener, backgroundMusic, audioLoader;
let isPlaying = false;
const particleNum = 5000;
const maxRange = 700;
const minRange = maxRange / 2;
const textureSize = 64.0;
const noise = createNoise2D();


function setupSkybox() {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        './assets/scene2_skybox/cube_front.png', // Positive X
        './assets/scene2_skybox/cube_back.png', // Negative X
        './assets/scene2_skybox/cube_up.png', // Positive Y
        './assets/scene2_skybox/cube_down.png', // Negative Y
        './assets/scene2_skybox/cube_right.png', // Positive Z
        './assets/scene2_skybox/cube_left.png', // Negative Z
    ]);

    scene.background = texture;
}

function setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffd27f, 1.5);
    sunLight.position.set(300, 400, -200);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    const backLight = new THREE.DirectionalLight(0xcce7ff, 0.5);
    backLight.position.set(-200, 100, 300);
    scene.add(backLight);


}

function setupScene2() {
    const gltfLoader = new GLTFLoader();
    const snowmanModelPath = "./assets/scene2/scene.gltf";

    gltfLoader.load(
        snowmanModelPath,
        (gltf) => {
            const snowmanModel = gltf.scene;
            snowmanModel.scale.set(20, 20, 20);
            snowmanModel.position.set(-30, 45, -120); // Adjust the position as needed

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

function setupSidewalk() {
    const gltfLoader = new GLTFLoader();
    const snowmanModelPath = "./assets/sidewalk/scene.gltf";

    gltfLoader.load(
        snowmanModelPath,
        (gltf) => {
            const snowmanModel = gltf.scene;
            snowmanModel.scale.set(50, 50, 50);
            snowmanModel.position.set(50, -12, -16); // Adjust the position as needed
            // snowmanModel.rotation.y = Math.PI / -0.3  ;

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

function setupCar3() {
    const gltfLoader = new GLTFLoader();
    const snowmanModelPath = "./assets/car8/scene.gltf";

    gltfLoader.load(
        snowmanModelPath,
        (gltf) => {
            const snowmanModel = gltf.scene;
            snowmanModel.scale.set(24, 24, 24);
            snowmanModel.position.set(10, -1, -170); // Adjust the position as needed
            snowmanModel.rotation.y = Math.PI / 2;


            scene.add(snowmanModel);

            // Check for animations in the loaded model
            if (gltf.animations.length > 0) {
                const mixer = new THREE.AnimationMixer(snowmanModel);
                const action = mixer.clipAction(gltf.animations[0]); // Use the first animation


                action.timeScale = 0.5;
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

function setupCar4() {
    const gltfLoader = new GLTFLoader();
    const snowmanModelPath = "./assets/car9/scene.gltf";

    gltfLoader.load(
        snowmanModelPath,
        (gltf) => {
            const snowmanModel = gltf.scene;
            snowmanModel.scale.set(3, 3, 3);
            snowmanModel.position.set(70, 0, -160); // Adjust the position as needed
            snowmanModel.rotation.y = Math.PI / 1.1;

            
            scene.add(snowmanModel);

            // Check for animations in the loaded model
            if (gltf.animations.length > 0) {
                const mixer = new THREE.AnimationMixer(snowmanModel);
                const action = mixer.clipAction(gltf.animations[0]); // Use the first animation

                action.timeScale = 2;
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


function setupGirl() {
    const gltfLoader = new GLTFLoader();
    const snowmanModelPath = "./assets/girl/scene.gltf";

    gltfLoader.load(
        snowmanModelPath,
        (gltf) => {
            const snowmanModel = gltf.scene;
            snowmanModel.scale.set(4, 4, 4);
            snowmanModel.position.set(-55, 0, 45); // Adjust the position as needed
            snowmanModel.rotation.y = Math.PI / -3.2;


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



function drawRadialGradation(ctx, canvasRadius, canvasW, canvasH) {
    ctx.save();
    const gradient = ctx.createRadialGradient(canvasRadius, canvasRadius, 1, canvasRadius, canvasRadius, canvasRadius);
    gradient.addColorStop(0, 'rgba(255,255,255,1.0)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasW, canvasH);
    ctx.restore();
}

function getTexture() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
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
    // mesh.geometry.vertices.forEach((vertex) => {
    //     const noise1 = noise(vertex.x * 0.01 + time * 0.0002, vertex.y * 0.00 + time * 0.0003) ;
    //     const noise2 = noise(vertex.x * 0.02 + time * 0.00012, vertex.y * 0.00 + time * 0.0002) ;
    //     const noise3 = noise(vertex.x * 0.009 + time * 0.00015, vertex.y * 0.010 + time * 0.00003) ;
    //     vertex.z = noise1 + noise2 + noise3;
    // });
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


export function initScene2() {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000036, 0, minRange * 3);

    // scene.background = new THREE.Color(0xcaeef9);

    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 4000);
    camera.position.set(235, 100, -900);


    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.minDistance = 100;
    orbitControls.maxDistance = 295;
    orbitControls.dampingFactor = 0.5;

    orbitControls.minPolarAngle = Math.PI / 4;    // Limit vertical rotation (down)
    orbitControls.maxPolarAngle = Math.PI / 2;    // Limit vertical rotation (up)

    orbitControls.update();

    

    const planeGeometry = new THREE.PlaneGeometry(0, 0, 50, 50);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x111934, side: THREE.DoubleSide });
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
        velocities.push(new THREE.Vector3(Math.random() * 6 - 3, -Math.random() * 0.05, Math.random() * 6 - 3));
    }

    pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pointMaterial = new THREE.PointsMaterial({
        size: 3,
        color: 0xeae374,
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
    setupScene2();
    setupSidewalk();
    setupCar3();
    setupCar4();
    setupSkybox();


    window.addEventListener('resize', onResize);
    document.getElementById('my-container').appendChild(renderer.domElement);
    requestAnimationFrame(render);
}

document.addEventListener('DOMContentLoaded', initScene2);
