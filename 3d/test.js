var util = require('../js/webgl/util');
var matrix = require('./matrix');
var vShaderSource = require('./shader.vs');
var fShaderSource = require('./shader.fs');

var xRotateRange = document.getElementById('rotate-x');
var yRotateRange = document.getElementById('rotate-y');
var zRotateRange = document.getElementById('rotate-z');

var xTranslateRange = document.getElementById('translate-x');
var yTranslateRange = document.getElementById('translate-y');
var zTranslateRange = document.getElementById('translate-z');

var xScaleRange = document.getElementById('scale-x');
var yScaleRange = document.getElementById('scale-y');
var zScaleRange = document.getElementById('scale-z');

var fudgeRange = document.getElementById('fudge');

var canvas = util.getCanvas('glcanvas');
var gl = util.initWebGL(canvas);

gl.clear(0, 0, 0, 0);

var vShader = util.createShader(gl, gl.VERTEX_SHADER, vShaderSource);
var fShader = util.createShader(gl, gl.FRAGMENT_SHADER, fShaderSource);
var program = util.createProgram(gl, vShader, fShader);

var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
setGeometry(gl);

var colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
setColors(gl);

var positionLocation = gl.getAttribLocation(program, 'a_position');
var colorLocation = gl.getAttribLocation(program, 'a_color');

var transformLocation = gl.getUniformLocation(program, 'u_transform');

var depth = 400;

function update() {
  util.resizeCanvas(canvas);
  util.fitViewport(gl);

  var xRotate = 2 * Math.PI * parseFloat(xRotateRange.value);
  var yRotate = 2 * Math.PI * parseFloat(yRotateRange.value);
  var zRotate = 2 * Math.PI * parseFloat(zRotateRange.value);

  var xTranslate = parseFloat(xTranslateRange.value) * canvas.clientWidth;
  var yTranslate = parseFloat(yTranslateRange.value) * canvas.clientHeight;
  var zTranslate = parseFloat(zTranslateRange.value) * depth;

  var xScale = parseFloat(xScaleRange.value);
  var yScale = parseFloat(yScaleRange.value);
  var zScale = parseFloat(zScaleRange.value);

  var fudge = parseFloat(fudgeRange.value);

  var transformation = matrix.perspective(fudge);
  transformation = matrix.multiply(matrix.orthographic(0, gl.canvas.clientWidth, gl.canvas.clientHeight, 0, -depth / 2, depth / 2), transformation);
  transformation = matrix.translate(transformation, xTranslate, yTranslate, zTranslate);
  transformation = matrix.xRotate(transformation, xRotate);
  transformation = matrix.yRotate(transformation, yRotate);
  transformation = matrix.zRotate(transformation, zRotate);
  transformation = matrix.scale(transformation, xScale, yScale, zScale);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionBuffer);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.enableVertexAttribArray(colorLocation);
  gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);

  gl.uniformMatrix4fv(transformLocation, false, transformation);

  gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);
}

function setGeometry(gl) {
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    // left column front
      0,   0,  0,
      0, 150,  0,
     30,   0,  0,
      0, 150,  0,
     30, 150,  0,
     30,   0,  0,

    // top rung front
     30,   0,  0,
     30,  30,  0,
    100,   0,  0,
     30,  30,  0,
    100,  30,  0,
    100,   0,  0,

    // middle rung front
     30,  60,  0,
     30,  90,  0,
     67,  60,  0,
     30,  90,  0,
     67,  90,  0,
     67,  60,  0,

    // left column back
      0,   0,  30,
     30,   0,  30,
      0, 150,  30,
      0, 150,  30,
     30,   0,  30,
     30, 150,  30,

    // top rung back
     30,   0,  30,
    100,   0,  30,
     30,  30,  30,
     30,  30,  30,
    100,   0,  30,
    100,  30,  30,

    // middle rung back
     30,  60,  30,
     67,  60,  30,
     30,  90,  30,
     30,  90,  30,
     67,  60,  30,
     67,  90,  30,

    // top
      0,   0,   0,
    100,   0,   0,
    100,   0,  30,
      0,   0,   0,
    100,   0,  30,
      0,   0,  30,

    // top rung right
    100,   0,   0,
    100,  30,   0,
    100,  30,  30,
    100,   0,   0,
    100,  30,  30,
    100,   0,  30,

    // under top rung
    30,   30,   0,
    30,   30,  30,
    100,  30,  30,
    30,   30,   0,
    100,  30,  30,
    100,  30,   0,

    // between top rung and middle
    30,   30,   0,
    30,   60,  30,
    30,   30,  30,
    30,   30,   0,
    30,   60,   0,
    30,   60,  30,

    // top of middle rung
    30,   60,   0,
    67,   60,  30,
    30,   60,  30,
    30,   60,   0,
    67,   60,   0,
    67,   60,  30,

    // right of middle rung
    67,   60,   0,
    67,   90,  30,
    67,   60,  30,
    67,   60,   0,
    67,   90,   0,
    67,   90,  30,

    // bottom of middle rung.
    30,   90,   0,
    30,   90,  30,
    67,   90,  30,
    30,   90,   0,
    67,   90,  30,
    67,   90,   0,

    // right of bottom
    30,   90,   0,
    30,  150,  30,
    30,   90,  30,
    30,   90,   0,
    30,  150,   0,
    30,  150,  30,

    // bottom
    0,   150,   0,
    0,   150,  30,
    30,  150,  30,
    0,   150,   0,
    30,  150,  30,
    30,  150,   0,

    // left side
    0,   0,   0,
    0,   0,  30,
    0, 150,  30,
    0,   0,   0,
    0, 150,  30,
    0, 150,   0,
  ]), gl.STATIC_DRAW);
}

function setColors(gl) {
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array([
      // left column front
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,

      // top rung front
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,

      // middle rung front
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,

      // left column back
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,

      // top rung back
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,

      // middle rung back
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,

      // top
    70, 200, 210,
    70, 200, 210,
    70, 200, 210,
    70, 200, 210,
    70, 200, 210,
    70, 200, 210,

      // top rung right
    200, 200, 70,
    200, 200, 70,
    200, 200, 70,
    200, 200, 70,
    200, 200, 70,
    200, 200, 70,

      // under top rung
    210, 100, 70,
    210, 100, 70,
    210, 100, 70,
    210, 100, 70,
    210, 100, 70,
    210, 100, 70,

      // between top rung and middle
    210, 160, 70,
    210, 160, 70,
    210, 160, 70,
    210, 160, 70,
    210, 160, 70,
    210, 160, 70,

      // top of middle rung
    70, 180, 210,
    70, 180, 210,
    70, 180, 210,
    70, 180, 210,
    70, 180, 210,
    70, 180, 210,

      // right of middle rung
    100, 70, 210,
    100, 70, 210,
    100, 70, 210,
    100, 70, 210,
    100, 70, 210,
    100, 70, 210,

      // bottom of middle rung.
    76, 210, 100,
    76, 210, 100,
    76, 210, 100,
    76, 210, 100,
    76, 210, 100,
    76, 210, 100,

      // right of bottom
    140, 210, 80,
    140, 210, 80,
    140, 210, 80,
    140, 210, 80,
    140, 210, 80,
    140, 210, 80,

      // bottom
    90, 130, 110,
    90, 130, 110,
    90, 130, 110,
    90, 130, 110,
    90, 130, 110,
    90, 130, 110,

      // left side
    160, 160, 220,
    160, 160, 220,
    160, 160, 220,
    160, 160, 220,
    160, 160, 220,
    160, 160, 220
  ]), gl.STATIC_DRAW);
};

xRotateRange.addEventListener('input', update);
yRotateRange.addEventListener('input', update);
zRotateRange.addEventListener('input', update);

xTranslateRange.addEventListener('input', update);
yTranslateRange.addEventListener('input', update);
zTranslateRange.addEventListener('input', update);

xScaleRange.addEventListener('input', update);
yScaleRange.addEventListener('input', update);
zScaleRange.addEventListener('input', update);

fudgeRange.addEventListener('input', update);

xRotateRange.addEventListener('change', update);
yRotateRange.addEventListener('change', update);
zRotateRange.addEventListener('change', update);

xTranslateRange.addEventListener('change', update);
yTranslateRange.addEventListener('change', update);
zTranslateRange.addEventListener('change', update);

xScaleRange.addEventListener('change', update);
yScaleRange.addEventListener('change', update);
zScaleRange.addEventListener('change', update);

fudgeRange.addEventListener('change', update);

update();
