import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';

// 1. ESCENA
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

// 2. RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.xr.enabled = true; // Fundamental para que AR funcione
document.body.appendChild(renderer.domElement);

// 3. LUZ
const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
scene.add(light);

// 4. BOTÓN DE AR
// Pedimos 'local-floor' para tener un sistema de coordenadas estable respecto al suelo
document.body.appendChild(ARButton.createButton(renderer, { 
    requiredFeatures: ['hit-test', 'local-floor'] 
}));

// 5. LOOP DE RENDERIZADO
// WebXR requiere un loop especial que recibe el 'frame' en cada iteración
renderer.setAnimationLoop((timestamp, frame) => {
    if (frame) {
        // Obtenemos la sesión y el espacio de referencia (el suelo)
        const session = renderer.xr.getSession();
        const referenceSpace = renderer.xr.getReferenceSpace();
        
        // Obtenemos la posición del dispositivo en el espacio
        const pose = frame.getViewerPose(referenceSpace);

        if (pose) {
            const pos = pose.transform.position;
            
            // Actualizamos la información en pantalla
            const info = document.getElementById("info");
            info.innerHTML = `
                X: ${pos.x.toFixed(3)}<br>
                Y: ${pos.y.toFixed(3)}<br>
                Z: ${pos.z.toFixed(3)}
            `;
        }
    }

    renderer.render(scene, camera);
});

// Ajuste automático al cambiar el tamaño de la ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});