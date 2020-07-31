import * as THREE from 'https://unpkg.com/three@latest/build/three.module.js';
import { OrbitControls } from './OrbitControls.js';
import { addLoading, removeLoading } from './utils.js';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls( camera, renderer.domElement );

controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.screenSpacePanning = false;

controls.minDistance = 100;
controls.maxDistance = 500;

controls.maxPolarAngle = Math.PI / 2;

const scene = new THREE.Scene();

function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}

addLoading(renderer.domElement)

fetch('http://localhost:3000/parse', { credentials: 'omit' })
  .then(res => {
    if (!res.ok) {
      throw new Error('Invalid result: ' + res.status + ' ' + res.statusText + ' ' + res.body);
    }

    return res.json();
  })
  .then(data => {
    data.forEach(scan => {
      const amountOfPoints = scan.x.length;
      const geometry = new THREE.Geometry();

      for (let i = 0;i < amountOfPoints; i++) {
        geometry.vertices.push(new THREE.Vector3(scan.x[i], scan.y[i], scan.z[i]))
        geometry.colors.push(new THREE.Color(`rgb(${scan.red[i]}, ${scan.green[i]}, ${scan.blue[i]})`));
      }

      scene.add(new THREE.Points(geometry, new THREE.PointsMaterial({ size: 1, vertexColors: THREE.VertexColors })));
    });

    removeLoading();
  });

animate();
