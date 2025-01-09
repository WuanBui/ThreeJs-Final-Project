const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let currentAudio = null; // Track the currently playing audio
let currentScene = null; // Track the current scene number
let isAudioUnlocked = false; // Flag to track whether audio playback is allowed

let sceneCache = {};

const scenes = {
  1: { 
    module: './scene1.js', 
    init: 'initScene1', 
    audio: './sound/scene1.1.mp3', 
    name: 'Drift Cars',
    description: 'Drift cars are specially modified vehicles designed for controlled sliding around corners at high speeds. Built for precision and handling, they feature upgraded suspension, tires, and power delivery systems.' 
  },
  2: { 
    module: './scene2.js', 
    init: 'initScene2', 
    audio: './sound/scene2.1.mp3', 
    name: 'Grand Tourer Cars',
    description: 'Grand Tourer (GT) cars are high-performance vehicles designed for long-distance driving with a focus on comfort, style, and speed. Combining luxury with athleticism, they often feature powerful engines, refined interiors, and advanced technology.' 
  },
  3: { 
    module: './scene3.js', 
    init: 'initScene3', 
    audio: './sound/scene3.1.mp3', 
    name: 'Dirt Bikes',
    description: 'Dirt bikes are lightweight motorcycles designed for off-road riding on rough terrains like dirt trails, mud, and sand. Built for durability and agility, they feature knobby tires, long suspension travel, and high ground clearance.' 
  },
  4: { 
    module: './scene4.js', 
    init: 'initScene4', 
    audio: './sound/scene4.1.mp3', 
    name: 'Drag Cars',
    description: 'Drag cars are high-performance vehicles built for straight-line racing, typically over a quarter-mile distance. They are designed for maximum speed and acceleration, featuring powerful engines, lightweight frames, and specialized tires.' 
  },
};

// Function to unlock audio (needed for autoplay)
function unlockAudio() {
  if (!isAudioUnlocked) {
    console.log("Audio unlocked!");
    isAudioUnlocked = true;

    // Resume audio context if it's suspended
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    // Now that audio is unlocked, start playing the default scene's audio
    const savedScene = getSavedScene();  // Get the saved scene number
    const { audio } = scenes[savedScene];  // Get the audio associated with the saved scene

    if (audio) {
      crossfadeAudio(audio);  // Start playing the audio for the default scene
    }
  }
}

// Function to remove the current scene from the DOM
function clearScene() {
  const container = document.getElementById("my-container");
  if (!container) {
    console.error("Container element not found! Cannot clear scene.");
    return;
  }
  container.innerHTML = ""; // Completely clear the container
}

// Function to dispose of 3D scene resources (geometry, materials, textures)
function dispose3DScene(sceneNumber) {
  if (sceneCache[sceneNumber] && sceneCache[sceneNumber].dispose) {
    sceneCache[sceneNumber].dispose(); // Call the dispose function if defined
    delete sceneCache[sceneNumber]; // Remove from cache
    console.log(`Scene ${sceneNumber} resources disposed.`);
  }
}

// Function to load and initialize a scene
async function loadScene(sceneNumber) {
  if (!scenes[sceneNumber]) throw new Error(`Scene ${sceneNumber} not found.`);
  const { module, init, description } = scenes[sceneNumber];

  let sceneElement = document.createElement("div");
  sceneElement.id = `scene${sceneNumber}`;
  sceneElement.style.display = "none";
  sceneElement.classList.add("scene");

  const container = document.getElementById("my-container");
  container.appendChild(sceneElement);

  // Add the menu and description to the scene
  createSceneMenu(sceneElement);
  displaySceneDescription(description);

  const sceneModule = await import(module);
  sceneModule[init](sceneElement);
  sceneCache[sceneNumber] = sceneModule;
  return sceneElement;
}

function displaySceneDescription(description) {
  let descriptionElement = document.getElementById("scene-description");
  if (!descriptionElement) {
    descriptionElement = document.createElement("div");
    descriptionElement.id = "scene-description";
    descriptionElement.style.position = "absolute";
    descriptionElement.style.top = "10px"; // Position at the bottom
    descriptionElement.style.right = "10px"; // Align to the right
    descriptionElement.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    descriptionElement.style.color = "white";
    descriptionElement.style.padding = "10px";
    descriptionElement.style.borderRadius = "5px";
    descriptionElement.style.fontSize = "1.2em";
    descriptionElement.style.zIndex = "900";
    descriptionElement.style.maxWidth = "330px"; // Restrict width to make wrapping easier
    descriptionElement.style.wordWrap = "break-word"; // Ensure long words break properly
    descriptionElement.style.overflowWrap = "break-word"; // For better browser compatibility
    descriptionElement.style.whiteSpace = "normal"; // Allow wrapping
    document.body.appendChild(descriptionElement);
  }

  descriptionElement.textContent = description;
}

async function crossfadeAudio(newAudioFile) {
  if (currentAudio) {
    currentAudio.pause();  // Immediately stop the current audio
    currentAudio = null;  // Reset the current audio reference
    console.log('Old audio stopped.');
  }

  if (newAudioFile) {
    const newAudio = new Audio(newAudioFile);
    newAudio.loop = true;
    newAudio.play().catch(console.error);  // Start playing the new audio immediately

    console.log(`New audio started: ${newAudioFile}`);

    currentAudio = newAudio;  // Set the new audio as the current audio
  }
}

async function switchScene(sceneNumber) {
  const container = document.getElementById("my-container");
  if (!container) {
    console.error("Container not found!");
    return;
  }

  // Add fade-out effect
  container.style.transition = "opacity 2s, background-color 2s";
  container.style.opacity = "0";
  container.style.backgroundColor = "black";

  await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for the fade-out duration

  // Dispose and clear previous scenes
  if (currentScene !== null) dispose3DScene(currentScene);
  clearScene();

  // Load the new scene
  try {
    const sceneElement = await loadScene(sceneNumber);
    sceneElement.style.display = "block";
    currentScene = sceneNumber;

    // Play the audio for the new scene if available
    const { audio } = scenes[sceneNumber];
    console.log(`Switching to scene ${sceneNumber}, audio: ${audio}`);  // Debugging line
    if (audio && isAudioUnlocked) {
      crossfadeAudio(audio);  // Play the new audio immediately
    }

    saveCurrentScene(sceneNumber);  // Save the current scene to localStorage

    // Add fade-in effect
    container.style.opacity = "0"; // Ensure opacity is 0 before starting fade-in
    container.style.backgroundColor = "black";
    await new Promise((resolve) => setTimeout(resolve, 300)); // Small delay to trigger CSS transition

    container.style.transition = "opacity 2s";
    container.style.opacity = "1";
    container.style.backgroundColor = "black";

  } catch (error) {
    console.error("Error switching scene:", error);
  }
}

function saveCurrentScene(sceneNumber) {
  localStorage.setItem("currentScene", sceneNumber);
}

function getSavedScene() {
  return Number(localStorage.getItem("currentScene")) || 1;
}

function createSceneMenu(parentElement = document.body) {
  const menu = document.createElement("div");
  menu.id = "scene-menu";
  menu.style.position = "absolute";
  menu.style.top = "10px";
  menu.style.left = "50%";
  menu.style.transform = "translateX(-50%)";
  menu.style.zIndex = "1000";
  menu.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  menu.style.padding = "10px";
  menu.style.borderRadius = "5px";
  menu.style.color = "white";
  menu.style.textAlign = "center";

  const description = document.createElement("p");
  description.textContent = "Welcome to my 3D project! Select a scene to explore! Click a button below to switch scenes.";
  description.style.marginBottom = "7px";
  description.style.marginTop = "7px";

  description.style.textAlign = "center";
  description.style.fontSize = "1.1em";
  description.style.fontFamily = 'Arial, sans-serif';
  menu.appendChild(description);

  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "center";
  buttonContainer.style.gap = "10px";

  Object.keys(scenes).forEach((sceneNumber) => {
    const button = document.createElement("button");
    button.textContent = scenes[sceneNumber].name;
    button.style.margin = "5px";
    button.style.padding = "10px 20px";
    button.style.fontSize = "1.2em";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.backgroundColor = "#4d7358";
    button.style.color = "white";
    button.style.cursor = "pointer";
    button.style.fontFamily = "Arial, sans-serif";
    button.addEventListener("mouseover", () => {
      button.style.backgroundColor = "#45a049";
    });
    button.addEventListener("mouseout", () => {
      button.style.backgroundColor = "#4d7358";
    });
    button.addEventListener("click", () => switchScene(Number(sceneNumber)));
    buttonContainer.appendChild(button);
  });

  menu.appendChild(buttonContainer);
  parentElement.appendChild(menu);
}

// Initialize the scene
document.addEventListener("DOMContentLoaded", () => {

  const dummyClickEvent = new MouseEvent("click");
  document.body.dispatchEvent(dummyClickEvent);


  const container = document.createElement("div");
  container.id = "my-container";
  document.body.appendChild(container);

  const savedScene = getSavedScene();
  switchScene(savedScene);

  document.addEventListener("click", unlockAudio);
  document.addEventListener("keydown", unlockAudio);
});
