var util = require('../../../js/webgl/util');
var rectangle = require('../../../js/geometry/rectangle');
var matrix3 = require('../../../js/geometry/matrix3');

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
    var transformationLocation = gl.getUniformLocation(program, 'u_transformation');

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
        gl.enableVertexAttribArray(positionocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        var translationMatrix = matrix3.translation(translation[0], translation[1]);
        var rotationMatrix = matrix3.rotation(rotation);
        var scaleMatrix = matrix3.scaling(scale[0], scale[1]);
        var moveOriginMatrix = matrix3.translation(-width / 2, -height / 2);

        var transformationMatrix = matrix3.identity();
        transformationMatrix = matrix3.multiply(transformationMatrix, scaleMatrix);
        transformationMatrix = matrix3.multiply(transformationMatrix, moveOriginMatrix);
        transformationMatrix = matrix3.multiply(transformationMatrix, rotationMatrix);
        transformationMatrix = matrix3.multiply(transformationMatrix, translationMatrix);

        // set the transformation uniform
        gl.uniformMatrix3fv(transformationLocation, false, transformationMatrix);

        // set the resolution uniform
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

        // set the color uniform
        gl.uniform4fv(colorLocation, color);

        // execute program
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
}
