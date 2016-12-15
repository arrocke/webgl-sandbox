(function () {
    var canvasId = 'glcanvas';
    var vertexShaderId = 'shader-vs';
    var fragmentShaderId = 'shader-fs';

    function start() {
        var image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = 'me.jpg';
        image.addEventListener('load', function () {
            render(image);
        });
    }

    function render(image) {

        var canvas = document.getElementById(canvasId);
        var gl = initWebGL(canvas);

        var vertexShader = createShader(gl, gl.VERTEX_SHADER, getShaderSource(vertexShaderId));
        var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, getShaderSource(fragmentShaderId));
        var program = createProgram(gl, vertexShader, fragmentShader);

        var positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
        var texCoordAttributeLocation = gl.getAttribLocation(program, 'a_texCoord');
        var resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');

        var positionBuffer = gl.createBuffer();
        var textureBuffer = gl.createBuffer();

        // bind position buffer and fill
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        setRectangle(gl, 0, 0, image.width, image.height);

        // bind texture buffer and fill
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 0,
            1, 0,
            0, 1,
            0, 1,
            1, 0,
            1, 1
        ]), gl.STATIC_DRAW);

        // create the texture
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // set texture parameters
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        // load the image into the texture
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        // resize and clear the canvas
        resizeCanvas(gl);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // tell gl to use the program
        gl.useProgram(program);

        // turn the attribute on
        gl.enableVertexAttribArray(positionAttributeLocation);

        // bind the position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // tell the attribute how to get data out of the position buffer
        var size = 2;           // 2 components per iteration
        var type = gl.FLOAT;    // the data is 32 bit floas
        var normalize = false;  // don't normalize the data
        var stride = 0;         // move forward size * sizeof(type) each iteration
        var offset = 0;         // start at the beginning of the buffer
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

        // turn the attribute on
        gl.enableVertexAttribArray(texCoordAttributeLocation);

        // bind the position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);

        // tell the attribute how to get data out of the position buffer
        size = 2;           // 2 components per iteration
        type = gl.FLOAT;    // the data is 32 bit floas
        normalize = false;  // don't normalize the data
        stride = 0;         // move forward size * sizeof(type) each iteration
        offset = 0;         // start at the beginning of the buffer
        gl.vertexAttribPointer(texCoordAttributeLocation, size, type, normalize, stride, offset);

        // set the resolution
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

        // execute GLSL program
        var primitiveType = gl.TRIANGLES;
        offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
    }

    function drawScene() {
        var canvas = document.getElementById(canvasId);
        var gl = initWebGL(canvas);

        // compile and link program
        var vertexShader = createShader(gl, gl.VERTEX_SHADER, getShaderSource(vertexShaderId));
        var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, getShaderSource(fragmentShaderId));
        var program = createProgram(gl, vertexShader, fragmentShader);

        // get shader variable locations
        var positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
        var texCoordAttributeLocation = gl.getAttribLocation(program, 'a_texCoord');
        var resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');

        // resize and clear the canvas
        resizeCanvas(gl);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // tell gl to use the program
        gl.useProgram(program);



    };

    function initWebGL(canvas) {
        var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!gl) {
            alert('Error loading WebGL, your browser may not support it.');
        }

        return gl;
    }

    function createShader(gl, type, source) {
        // create and compile the shader
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        // verify shader was compiled
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        // log errors and delete shader
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    function getShaderSource(id) {
        return document.getElementById(id).text;
    }

    function createProgram(gl, vertexShader, fragmentShader) {
        // create and link the program
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        // verify program setup correctly
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }

        // log errors and delete program
        console.log(gl.getProgramInfoLog(shader));
        gl.deleteProgram(program);
    }

    function resizeCanvas(gl) {
        gl.canvas.width = gl.canvas.clientWidth;
        gl.canvas.height = gl.canvas.clientHeight;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    function setRectangle(gl, x, y, width, height) {
        var x1 = x;
        var x2 = x + width;
        var y1 = y;
        var y2 = y + height;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2
        ]), gl.STATIC_DRAW);
    }

    start();
})();
