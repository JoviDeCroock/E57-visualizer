import * as THREE from 'https://unpkg.com/three@latest/build/three.module.js';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );

const scene = new THREE.Scene();

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
        geometry.colors.push(new THREE.Color(red, green, blue));
      }
      const material = new THREE.PointsMaterial( { size: 1, vertexColors: THREE.VertexColors } );
      const cloud = new THREE.Line(geometry, material);
      scene.add(cloud);
    });

    renderer.render(scene, camera);
  })
