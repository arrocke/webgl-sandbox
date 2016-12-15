var util = require('./webgl/util');

// init the canvas and webGL
var canvas = util.getCanvas('glcanvas');
var gl = util.initWebGL(canvas);

if (gl) {
    // rerender when the window is resized
    window.addEventListener('resize', function () {
        render();
    });

    // compile and link the shaders into the program
    var vertexShaderSource = require('../glsl/basic-vertex-shader.vs');
    var fragmentShaderSource = require('../glsl/basic-fragment-shader.fs');
    var vertexShader = util.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = util.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    var program = util.createProgram(gl, vertexShader, fragmentShader);

    // find the location of shader variables
    var positionLocation = gl.getAttribLocation(program, 'a_position');
    var resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    var colorLocation = gl.getUniformLocation(program, 'u_color');

    function render() {
        // load the program
        gl.useProgram(program);

        // resize the canvas
        util.resizeCanvas(canvas);
        util.fitViewport(gl);

        // clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // create and populate the position buffer
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 0,
            gl.canvas.width, 0,
            gl.canvas.width / 2, gl.canvas.height
        ]), gl.STATIC_DRAW);

        // bind to position attribute
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // set the resolution uniform
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

        // set the color uniform
        gl.uniform4f(colorLocation, 0, 0, 0, 1);

        // execute program
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    render();
}
