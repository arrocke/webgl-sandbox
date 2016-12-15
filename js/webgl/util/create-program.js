module.exports = function (gl, vertexShader, fragmentShader) {
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
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
};