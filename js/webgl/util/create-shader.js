module.exports = function (gl, type, source) {
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
};
