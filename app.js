import * as THREE from 'three';

import { ARButton }
from 'three/addons/webxr/ARButton.js';


// -----------------------------

// ESCENA

// -----------------------------

const scene =
new THREE.Scene();

const camera =
new THREE.PerspectiveCamera();

const renderer =
new THREE.WebGLRenderer({

antialias:true,
alpha:true

});

renderer.setSize(

window.innerWidth,
window.innerHeight

);

renderer.xr.enabled = true;

document.body.appendChild(

renderer.domElement

);


// -----------------------------

// LUZ

// -----------------------------

const light =
new THREE.HemisphereLight(

0xffffff,
0xbbbbff,
1

);

scene.add(light);


// -----------------------------

// BOTÓN AR

// -----------------------------

document.body.appendChild(

ARButton.createButton(

renderer,

{

requiredFeatures:[

'hit-test'

]

}

)

);


// -----------------------------

// LOOP

// -----------------------------

renderer.setAnimationLoop(render);


// -----------------------------

// RENDER

// -----------------------------

const info =
document.getElementById("info");

const temp =
new THREE.Vector3();

function render(){

camera.getWorldPosition(temp);

info.innerHTML =

`
x : ${temp.x.toFixed(3)}<br>
y : ${temp.y.toFixed(3)}<br>
z : ${temp.z.toFixed(3)}
`;

renderer.render(

scene,
camera

);

}