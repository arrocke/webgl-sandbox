var util = require('../../../js/webgl/util');
var rectangle = require('../../../js/geometry/rectangle');

// init the canvas and webgl
var canvas = util.getCanvas('glcanvas');
var gl = util.initWebGL(canvas);

if (gl) {
    // set clear color
    gl.clearColor(0, 0, 0, 0);

    // compile and link the shaders to the program.
    var vertexShaderSource = require('./vertex-shader.vs');
    var fragmentShaderSource = require('./fragment-shader.fs');
    var vertexShader = util.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = util.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    var program = util.createProgram(gl, vertexShader, fragmentShader);

    // create buffers
    var positionBuffer = gl.createBuffer();

    // find the glsl variable locations.
    var positionLocation = gl.getAttribLocation(program, 'a_position');
    var resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    var colorLocation = gl.getUniformLocation(program, 'u_color');
    var translationLocation = gl.getUniformLocation(program, 'u_translation');
    var rotationLocation = gl.getUniformLocation(program, 'u_rotation');
    var scaleLocation = gl.getUniformLocation(program, 'u_scale');

    module.exports = function render(rotation, translation, scale, width, height, color) {
        // load the program
        gl.useProgram(program);

        // resize the canvas
        util.resizeCanvas(canvas);
        util.fitViewport(gl);

        // clear the canvas
        gl.clear(gl.COLOR_BUFFER_BIT);

        // bind and populate the position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, rectangle.asTriangles(0, 0, width, height), gl.STATIC_DRAW);

        // bind to position attribute
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // set the rotation uniform
        gl.uniform2fv(rotationLocation, rotation);

        // set the translation uniform
        gl.uniform2fv(translationLocation, translation);

        // set the scale uniform
        gl.uniform2fv(scaleLocation, scale);

        // set the resolution uniform
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

        // set the color uniform
        gl.uniform4fv(colorLocation, color);

        // execute program
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
}