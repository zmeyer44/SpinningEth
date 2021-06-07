import "./style.css";
import obj from "./Ethereum.obj?url";

import * as THREE from "three";

import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

let camera, controls, scene, renderer, effect;

let eth;
let mouseX = 0;
let targetX = 0;
let raycaster, mouse, intersects;
const start = Date.now();

init();

animate();

function init() {
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.y = 200;
  camera.position.z = 750;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0, 0, 0);

  const pointLight1 = new THREE.PointLight(0xffffff);
  pointLight1.position.set(500, 500, 500);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xffffff, 0.25);
  pointLight2.position.set(-500, -500, -500);
  scene.add(pointLight2);

  ////test cube
  // let geometry = new THREE.BoxGeometry(100, 100, 100);

  // let material = new THREE.MeshLambertMaterial({ color: 0xffffff });

  // let cube = new THREE.Mesh(geometry, material);

  // scene.add(cube);

  // cube.position.x = 4;
  // cube.position.z = 400;
  // instantiate a loader
  const loader = new OBJLoader();

  // load a resource
  loader.load(
    // resource URL
    obj,
    // called when resource is loaded
    function (object) {
      eth = object;
      scene.add(eth);
    },
    // called when loading is in progresses
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // called when loading has errors
    function (error) {
      console.log("An error happened");
    }
  );

  renderer = new THREE.WebGLRenderer();

  //   renderer = new THREE.WebGLRenderer({
  //     canvas: document.querySelector("#bg"),
  //   });
  renderer.setSize(window.innerWidth, window.innerHeight);

  effect = new AsciiEffect(renderer, " .:-+*=%@#", { invert: true });
  effect.setSize(window.innerWidth, window.innerHeight);
  effect.domElement.style.color = "white";
  effect.domElement.style.backgroundColor = "black";

  // Special case: append effect.domElement, instead of renderer.domElement.
  // AsciiEffect creates a custom domElement (a div container) where the ASCII elements are placed.

  document.body.appendChild(effect.domElement);

  controls = new TrackballControls(camera, effect.domElement);

  raycaster = new THREE.Raycaster();

  mouse = new THREE.Vector2();

  document.addEventListener("mousemove", onMouseMove);

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  effect.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
  requestAnimationFrame(animate);

  render();
}

function render() {
  // raycaster.setFromCamera(mouse, camera);

  // intersects = raycaster.intersectObjects(scene.children);
  // console.log(intersects);
  // console.log(mouse);

  // for (var i = 0; i < intersects.length; i++) {
  //   console.log(mouse);

  //   intersects[i].object.rotation.z += 0.002;
  // }

  const timer = Date.now() - start;

  eth.position.y = Math.abs(Math.sin(timer * 0.002)) * 130 - 100;
  eth.rotation.y = Math.sin(timer * 0.001) * 0.3;
  eth.rotation.x = Math.sin(timer * 0.001) * 0.00005;
  eth.rotation.z = Math.sin(timer * 0.003) * 0.07;

  eth.rotation.y += mouse.x * 0.5;
  eth.rotation.x -= mouse.y * 0.5;

  controls.update();

  effect.render(scene, camera);
}

let mouseY = 0;

let targetY = 0;

// const windowX = window.innerWidth / 2;
const windowY = window.innerHeight / 2;

function onMouseMove(event) {
  console.log("moved");

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
