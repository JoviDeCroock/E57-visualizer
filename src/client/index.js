import * as THREE from 'https://unpkg.com/three@latest/build/three.module.js';
import { OrbitControls } from './OrbitControls';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );

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

const loading = document.createElement('div');
loading.innerText = 'LOADING...';
document.body.insertBefore(loading, renderer.domElement);

fetch('http://localhost:3000/parse', { credentials: 'omit' })
  .then(res => {
    if (!res.ok) {
      throw new Error('Invalid result: ' + res.status + ' ' + res.statusText + ' ' + res.body);
    }

    return res.json();
  })
  .then(data => {
    data.forEach((scan, i) => {
      const amountOfPoints = scan.x.length;

      const geometry = new THREE.Geometry();
      console.log(geometry);
      for (let i = 0;i < amountOfPoints; i++) {
        const x = scan.x[i];
        const y = scan.y[i];
        const z = scan.z[i];
        const red = scan.red[i];
        const green = scan.green[i];
        const blue = scan.blue[i];

        geometry.vertices.push(new THREE.Vector3(x, y, z))
        geometry.colors.push(new THREE.Color(`rgb(${red}, ${green}, ${blue})`));
      }

      const cloud = new THREE.Points(geometry, new THREE.PointsMaterial({ size: 1, vertexColors: THREE.VertexColors }));
      scene.add(cloud);
    });

    document.body.removeChild(loading)
    // renderer.render(scene, camera);
  });

animate();