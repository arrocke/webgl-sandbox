var GLObject = require('../webgl/object');
var m4 = require('../geometry/matrix3d');

var F = function (options) {
    options = options || {};
    GLObject.call(this, options);

    this._positionBuffer = this._gl.createBuffer();
    this.setGeometry();

    this._transform = m4.identity();

};

F.prototype = Object.create(GLObject.prototype);
F.prototype.constructor = F;

Object.defineProperties(F.prototype, {
    localTransform: {
        get: function () {
            return this._transform.slice();
        },
        set: function (val) {
            if (val instanceof Array && val.length == 16) {
                this._transform = val;
            }
        }
    }
});

F.prototype.getTransform = function (viewMatrix) {
    return m4.multiply(this._transform, viewMatrix);
}

F.prototype.render = function (viewMatrix) {
    this._program.use();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._positionBuffer);
    this._gl.enableVertexAttribArray(this._program.a_position);
    this._gl.vertexAttribPointer(this._program.a_position, this._vectorSize, this._gl.FLOAT, false, 0, 0);
    this._gl.uniformMatrix4fv(this._program.u_transform, false, this.getTransform(viewMatrix));
    this._gl.drawArrays(this._gl.TRIANGLES, 0, this._vertexCount);
};

module.exports = F;

F.prototype.setGeometry = function () {
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._positionBuffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array([
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
    ]), this._gl.STATIC_DRAW);
    this._vertexCount = 16 * 6;
    this._vectorSize = 3;
};
