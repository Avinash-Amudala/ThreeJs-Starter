import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import * as dat from 'lil-gui';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Textures
const textureLoader = new THREE.TextureLoader();

const torusKnotGeometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16);

// Define metal and plastic materials
const metalMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 1, roughness: 0.5 });
const plasticMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0, roughness: 0.6 });

// Set up lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Add torus knot with metal material
const torusKnotMetal = new THREE.Mesh(torusKnotGeometry, metalMaterial);
torusKnotMetal.position.set(-1.5, 0, 0);
scene.add(torusKnotMetal);

// Add more torus knots
for (let i = 1; i <= 5; i++) {
    const torusKnot = new THREE.Mesh(torusKnotGeometry, metalMaterial);
    torusKnot.position.set(-1.5 + i * 0.5, 0, 0);
    scene.add(torusKnot);
}

let textMesh;

// FontLoader
const fontLoader = new FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
    const textGeometry = new TextGeometry('Testing Object!', {
        font: font,
        size: 0.5,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    });
    textMesh = new THREE.Mesh(textGeometry, metalMaterial);
    textMesh.position.set(2, 0, 0);
    scene.add(textMesh);
});

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 2;
camera.position.y = 2;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0xdddddd);

// Base
const baseGeometry = new THREE.PlaneGeometry(10, 10);
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
const base = new THREE.Mesh(baseGeometry, baseMaterial);
base.rotation.x = -Math.PI / 2;
base.position.y = -5;
scene.add(base);

// Animate
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};

tick();

// GUI Controls
const gui = new dat.GUI();
const materialFolder = gui.addFolder('Metal');
materialFolder.addColor(metalMaterial, 'color'); // color control for metal material
materialFolder.add(metalMaterial, 'metalness').min(0).max(1).step(0.01);
materialFolder.add(metalMaterial, 'roughness').min(0).max(1).step(0.01);
materialFolder.open();

const plasticFolder = gui.addFolder('Plastic');
plasticFolder.add(plasticMaterial, 'metalness').min(0).max(1).step(0.01);
plasticFolder.add(plasticMaterial, 'roughness').min(0).max(1).step(0.01);
plasticFolder.open();

const baseFolder = gui.addFolder('Base');
baseFolder.addColor(baseMaterial, 'color');  // Base color control
baseFolder.open();
