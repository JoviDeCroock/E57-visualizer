const canvas = document.getElementById('my-canvas');
const gl = canvas.getContext("webgl");

if (gl === null) {
  throw new Error('WebGL not available');
}

function createShader (gl, sourceCode, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, sourceCode);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error('Could not compile WebGL program. \n\n' + gl.getShaderInfoLog(shader));
  }

  return shader;
}

gl.clearColor(0.0, 0.0, 0.0, 1.0);gl.clear(gl.COLOR_BUFFER_BIT);

var vertCode = 'attribute vec3 coordinates;'+
'attribute vec3 color;'+
'varying vec3 vColor;'+
'void main(void) {' +
   ' gl_Position = vec4(coordinates, 1.0);' +
   'vColor = color;'+
'}';


var fragCode = 'precision mediump float;'+
'varying vec3 vColor;'+
'void main(void) {'+
    'gl_FragColor = vec4(vColor, 1.);'+
'}';

const fragmentShader = createShader(gl, fragCode, gl.FRAGMENT_SHADER)
const vertexShader = createShader(gl, vertCode, gl.VERTEX_SHADER)

const program = gl.createProgram(vertexShader, fragmentShader);
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);
gl.useProgram(program);


if (!gl.getProgramParameter( program, gl.LINK_STATUS)) {
  var info = gl.getProgramInfoLog(program);
  throw new Error('Could not compile WebGL program. \n\n' + info);
}

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

      const vertices = [];
      const colors = [];
      for (let i = 0;i < amountOfPoints; i++) {
        const x = scan.x[i];
        const y = scan.y[i];
        const z = scan.z[i];
        const red = scan.red[i];
        const green = scan.green[i];
        const blue = scan.blue[i];

        vertices.push(x, y, z);
        colors.push(red, green, blue)
      }

      const verticesIndecesBuffer = gl.createBuffer();
      const points = new Float32Array(vertices);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, verticesIndecesBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, points, gl.STATIC_DRAW);

      const colorBuffer = gl.createBuffer();
      const colorsRay = new Float32Array(vertices);

      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, colorsRay, gl.STATIC_DRAW);

      console.log('drawing ', vertices.length, ' points');
      console.log('drawing ', colors.length, ' colors');
      gl.drawElements(gl.POINTS, vertices.length, gl.UNSIGNED_SHORT, 0);
    });
  })
