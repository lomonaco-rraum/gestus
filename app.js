import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';

// --- CONFIGURACIÓN Y ESTADO ---
let pathPoints = [];
let lastPoint = new THREE.Vector3(0, 0, 0);
const TOLERANCIA_DISTANCIA = 0.05; // 5 cm

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);

// Botón de inicio con AR
document.body.appendChild(ARButton.createButton(renderer, { 
    requiredFeatures: ['hit-test', 'local-floor'] 
}));

// --- LÓGICA DE TRACKING ---
function registrarPunto(pos) {
    const distancia = lastPoint.distanceTo(pos);
    
    if (distancia >= TOLERANCIA_DISTANCIA) {
        const punto = { x: pos.x, y: pos.y, z: pos.z, time: Date.now() };
        pathPoints.push(punto);
        lastPoint.copy(pos);
        
        console.log("Punto registrado en Gestus:", punto);
        actualizarUI(punto);
    }
}

function actualizarUI(p) {
    const info = document.getElementById("info");
    if(info) {
        info.innerHTML = `Puntos: ${pathPoints.length}<br>Último: X:${p.x.toFixed(2)} Y:${p.y.toFixed(2)} Z:${p.z.toFixed(2)}`;
    }
}

// --- LOOP DE RENDERIZADO ---
renderer.setAnimationLoop((timestamp, frame) => {
    if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const pose = frame.getViewerPose(referenceSpace);

        if (pose) {
            const pos = pose.transform.position;
            const vectorPos = new THREE.Vector3(pos.x, pos.y, pos.z);
            
            // Aquí es donde sucede la magia del registro
            registrarPunto(vectorPos);
        }
    }
    renderer.render(scene, camera);
});