import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Create the scene
const scene = new THREE.Scene();

// Create the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 2, 5); // Initial camera position

// Create the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadow type
document.body.appendChild(renderer.domElement);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Load textures
const wallTexture = new THREE.TextureLoader().load('texture/wall-texture.jpg');
const floorTexture = new THREE.TextureLoader().load('texture/floor-texture.avif');
const windowTexture = new THREE.TextureLoader().load('texture/window-texture.jpg'); // Load the window texture

// Create room materials (window texture removed from the front wall)
const roomMaterials = [
  new THREE.MeshStandardMaterial({ map: wallTexture, side: THREE.BackSide }), // left wall
  new THREE.MeshStandardMaterial({ map: wallTexture, side: THREE.BackSide }), // right wall
  new THREE.MeshStandardMaterial({ color: 0x000000, side: THREE.BackSide }), // ceiling
  new THREE.MeshStandardMaterial({ map: floorTexture, side: THREE.BackSide }), // floor
  new THREE.MeshStandardMaterial({ map: wallTexture, side: THREE.BackSide }), // front wall
  new THREE.MeshStandardMaterial({ map: wallTexture, side: THREE.BackSide }), // back wall
];

// Create room
const roomGeometry = new THREE.BoxGeometry(12, 5, 10);
const room = new THREE.Mesh(roomGeometry, roomMaterials);
room.position.set(1, 1, 0);
room.receiveShadow = true; // Room can receive shadows
scene.add(room);

// Create the window as a separate plane
const windowGeometry = new THREE.PlaneGeometry(3.4, 2.3); // Adjust size of the window here
const windowMaterial = new THREE.MeshBasicMaterial({
  map: windowTexture,
  transparent: true, // Allows transparency if window texture has transparency
});
const windowPlane = new THREE.Mesh(windowGeometry, windowMaterial);

// Position the window in the center of the front wall
windowPlane.position.set(0, 0.1, -4.9); // Z-position should match the front wall position
room.add(windowPlane);

// Create table
const tableTopGeometry = new THREE.BoxGeometry(4, 0.2, 2);
const tableTopTexture = new THREE.TextureLoader().load('texture/table-texture.jpg');
const tableTopMaterial = new THREE.MeshStandardMaterial({ map: tableTopTexture });
const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial);
tableTop.receiveShadow = true; // Table top can receive shadows
tableTop.castShadow = true; // Table top can cast shadows

const legGeometry = new THREE.BoxGeometry(0.2, 2, 0.2);
const legMaterial = new THREE.MeshStandardMaterial({ map: tableTopTexture });
const leg1 = new THREE.Mesh(legGeometry, legMaterial);
leg1.position.set(-1.8, -1, -0.8);
leg1.castShadow = true;
leg1.receiveShadow = true;

const leg2 = leg1.clone();
leg2.position.set(1.8, -1, -0.8);
scene.add(leg2);

const leg3 = leg1.clone();
leg3.position.set(-1.8, -1, 0.8);
scene.add(leg3);

const leg4 = leg1.clone();
leg4.position.set(1.8, -1, 0.8);
scene.add(leg4);

const tableGroup = new THREE.Group();
tableGroup.add(tableTop, leg1, leg2, leg3, leg4);
tableGroup.position.set(0, 0, -2);
scene.add(tableGroup);

// Create chair
const chairSeatGeometry = new THREE.BoxGeometry(0.9, 0.1, 1);
const chairSeatTexture = new THREE.TextureLoader().load('texture/chair.jpg');
const chairSeatMaterial = new THREE.MeshStandardMaterial({ map: chairSeatTexture });
const chairSeat = new THREE.Mesh(chairSeatGeometry, chairSeatMaterial);
chairSeat.position.set(0, -0.5, 1);
chairSeat.castShadow = true; // Enable casting shadows
chairSeat.receiveShadow = true; // Enable receiving shadows

const chairBackGeometry = new THREE.BoxGeometry(0.9, 1.1, 0.1);
const chairBackTexture = new THREE.TextureLoader().load('texture/chair.jpg');
const chairBackMaterial = new THREE.MeshStandardMaterial({ map: chairBackTexture });
const chairBack = new THREE.Mesh(chairBackGeometry, chairBackMaterial);
chairBack.position.set(0, 0, 1.5);
chairBack.castShadow = true; // Enable casting shadows
chairBack.receiveShadow = true; // Enable receiving shadows

// Create chair legs with textures
const chairLegGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
const chairLegTexture = new THREE.TextureLoader().load('texture/chair.jpg');
const chairLegMaterials = [
    new THREE.MeshStandardMaterial({ map: chairLegTexture }), // right
    new THREE.MeshStandardMaterial({ map: chairLegTexture }), // left
    new THREE.MeshStandardMaterial({ color: 0x808080 }),      // top (no texture)
    new THREE.MeshStandardMaterial({ color: 0x808080 }),      // bottom (no texture)
    new THREE.MeshStandardMaterial({ map: chairLegTexture }), // front
    new THREE.MeshStandardMaterial({ map: chairLegTexture })  // back
];

// Create chair legs
const chairLeg1 = new THREE.Mesh(chairLegGeometry, chairLegMaterials);
chairLeg1.position.set(-0.4, -1, 0.55);
chairLeg1.castShadow = true; // Enable casting shadows
chairLeg1.receiveShadow = true; // Enable receiving shadows

const chairLeg2 = chairLeg1.clone();
chairLeg2.position.set(0.4, -1, 0.55);
chairLeg2.castShadow = true; // Enable casting shadows
chairLeg2.receiveShadow = true; // Enable receiving shadows

const chairLeg3 = chairLeg1.clone();
chairLeg3.position.set(-0.4, -1, 1.5);
chairLeg3.castShadow = true; // Enable casting shadows
chairLeg3.receiveShadow = true; // Enable receiving shadows

const chairLeg4 = chairLeg1.clone();
chairLeg4.position.set(0.4, -1, 1.5);
chairLeg4.castShadow = true; // Enable casting shadows
chairLeg4.receiveShadow = true; // Enable receiving shadows

// Create chair group and add chair parts
const chairGroup = new THREE.Group();
chairGroup.add(chairSeat, chairBack, chairLeg1, chairLeg2, chairLeg3, chairLeg4);
chairGroup.position.set(0, 0, -2); // Adjust position as needed
scene.add(chairGroup);

// Create CPU with different textures for front and back faces
const cpuGeometry = new THREE.BoxGeometry(0.5, 1.3, 0.5);
const cpuFrontTexture = new THREE.TextureLoader().load('texture/cpu-front.jpg');
const cpuBackTexture = new THREE.TextureLoader().load('texture/cpu-back.png');
const cpuSideTexture = new THREE.TextureLoader().load('texture/cpu-side.jpg');

// Create materials for each face
const cpuMaterials = [
    new THREE.MeshStandardMaterial({ map: cpuSideTexture }), // right
    new THREE.MeshStandardMaterial({ map: cpuSideTexture }), // left
    new THREE.MeshStandardMaterial({ map: cpuSideTexture }), // top
    new THREE.MeshStandardMaterial({ map: cpuSideTexture }), // bottom
    new THREE.MeshStandardMaterial({ map: cpuFrontTexture }), // front
    new THREE.MeshStandardMaterial({ map: cpuBackTexture })  // back
];

// Apply materials to the CPU geometry
const cpu = new THREE.Mesh(cpuGeometry, cpuMaterials);
cpu.position.set(-1.5, 0.7, 0);
cpu.castShadow = true; // Enable casting shadows
cpu.receiveShadow = true; // Enable receiving shadows
tableGroup.add(cpu);

// Create keyboard with different textures for the top face
const keyboardGeometry = new THREE.BoxGeometry(1.5, 0.05, 0.5);
const keyboardTopTexture = new THREE.TextureLoader().load('texture/keyboard-top.png');
const keyboardOtherTexture = new THREE.TextureLoader().load('texture/cpu-side.jpg');

// Create materials for each face
const keyboardMaterials = [
    new THREE.MeshStandardMaterial({ map: keyboardOtherTexture }), // right
    new THREE.MeshStandardMaterial({ map: keyboardOtherTexture }), // left
    new THREE.MeshStandardMaterial({ map: keyboardTopTexture }),   // top
    new THREE.MeshStandardMaterial({ map: keyboardOtherTexture }), // bottom
    new THREE.MeshStandardMaterial({ map: keyboardOtherTexture }), // front
    new THREE.MeshStandardMaterial({ map: keyboardOtherTexture })  // back
];

// Apply materials to the keyboard geometry
const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterials);
keyboard.position.set(0, 0.12, 0.5);
keyboard.castShadow = true; // Enable casting shadows
keyboard.receiveShadow = true; // Enable receiving shadows
tableGroup.add(keyboard);

// Create monitor with different textures for the front face
const monitorGeometry = new THREE.BoxGeometry(2, 1.2, 0.1);
const monitorTextures = [
    new THREE.TextureLoader().load('texture/monitor-front.jpg'),
    new THREE.TextureLoader().load('texture/monitor-front-1.jpg'),
    new THREE.TextureLoader().load('texture/monitor-front-2.png'),
    new THREE.TextureLoader().load('texture/monitor-front-3.jpg')
];
let currentTextureIndex = 0;

const monitorOtherTexture = new THREE.TextureLoader().load('texture/cpu-side.jpg');

// Create materials for each face
const monitorMaterials = [
    new THREE.MeshStandardMaterial({ map: monitorOtherTexture }), // right
    new THREE.MeshStandardMaterial({ map: monitorOtherTexture }), // left
    new THREE.MeshStandardMaterial({ map: monitorOtherTexture }), // top
    new THREE.MeshStandardMaterial({ map: monitorOtherTexture }), // bottom
    new THREE.MeshStandardMaterial({ map: monitorTextures[currentTextureIndex] }), // front
    new THREE.MeshStandardMaterial({ map: monitorOtherTexture })  // back
];

// Apply materials to the monitor geometry
const monitor = new THREE.Mesh(monitorGeometry, monitorMaterials);
monitor.position.set(0, 0.8, -0.5);
monitor.castShadow = true; // Enable casting shadows
monitor.receiveShadow = true; // Enable receiving shadows

// Create monitor stand
const standBaseGeometry = new THREE.BoxGeometry(0.4, 0.05, 0.4);
const standBase = new THREE.Mesh(standBaseGeometry, new THREE.MeshStandardMaterial({ map: monitorOtherTexture }));
standBase.position.set(0, 0.1, -0.5);
standBase.castShadow = true; // Enable casting shadows
standBase.receiveShadow = true; // Enable receiving shadows

const standPoleGeometry = new THREE.BoxGeometry(0.05, 0.3, 0.05);
const standPole = new THREE.Mesh(standPoleGeometry, new THREE.MeshStandardMaterial({ map: monitorOtherTexture }));
standPole.position.set(0, 0.1, -0.5);
standPole.castShadow = true; // Enable casting shadows
standPole.receiveShadow = true; // Enable receiving shadows

const monitorGroup = new THREE.Group();
monitorGroup.add(monitor, standBase, standPole);
tableGroup.add(monitorGroup);

// Load mouse model
const loader = new GLTFLoader();
loader.load('model/mouse.glb', function(gltf) {
    const mouse = gltf.scene;
    mouse.scale.set(0.01, 0.01, 0.01); // Scale the model appropriately
    mouse.position.set(0.8, 0.1, 0.7); // Position on the table

    // Enable shadows for the mouse model
    mouse.traverse(function(child) {
        if (child.isMesh) {
            child.castShadow = true; // Enable casting shadows
            child.receiveShadow = true; // Enable receiving shadows
        }
    });

    tableGroup.add(mouse);
});

// Raycaster
const raycaster = new THREE.Raycaster();
const mouseVector = new THREE.Vector2();

// Variables for camera orbiting
let theta = 0;
let radius = 5;
let cameraHeight = 2;

// Function to update monitor texture
function updateMonitorTexture() {
    currentTextureIndex = (currentTextureIndex + 1) % monitorTextures.length;
    monitor.material[4].map = monitorTextures[currentTextureIndex];
    monitor.material[4].needsUpdate = true;
}

// Mouse interaction
document.addEventListener('click', (event) => {
    mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouseVector, camera);
    const intersects = raycaster.intersectObjects([monitor]);

    if (intersects.length > 0) {
        updateMonitorTexture();
    }
});

// Keyboard interaction for orbiting around the table
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        theta -= 0.05; // Rotate left
    } else if (event.key === 'ArrowRight') {
        theta += 0.05; // Rotate right
    } else if (event.key === 'ArrowUp') {
        cameraHeight += 0.1; // Move up
    } else if (event.key === 'ArrowDown') {
        cameraHeight -= 0.1; // Move down
    }

    // Update camera position based on polar coordinates
    camera.position.x = radius * Math.sin(theta);
    camera.position.z = radius * Math.cos(theta);
    camera.position.y = cameraHeight;

    // Ensure the camera is always looking at the center of the table
    camera.lookAt(tableGroup.position);
});

// Create the white PointLight
const whiteLight = new THREE.PointLight(0xffffff, 30, 100); // White light
whiteLight.position.set(10, 0, 10);
whiteLight.castShadow = true; // Light will cast shadows
whiteLight.shadow.mapSize.width = 1024; // Shadow quality
whiteLight.shadow.mapSize.height = 1024;
scene.add(whiteLight);

// Animate the white light rotation around the table
function animateLight() {
  const time = Date.now() * 0.001;
  whiteLight.position.x = Math.sin(time) * 3; // Radius of rotation on the X-axis
  whiteLight.position.z = Math.cos(time) * 3; // Radius of rotation on the Z-axis
  whiteLight.position.y = 3; // Keep the light at a constant height
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  animateLight();
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation
animate();
