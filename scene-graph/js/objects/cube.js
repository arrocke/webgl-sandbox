var GLObject = require('../webgl/object');
var m4 = require('../geometry/matrix3d');

var Cube = function (options) {
    options = options || {};
    GLObject.call(this, options);

    this._positionBuffer = this._gl.createBuffer();
    this.setGeometry();

    this._transform = m4.identity();

};

Cube.prototype = Object.create(GLObject.prototype);
Cube.prototype.constructor = Cube;

Object.defineProperties(Cube.prototype, {
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

Cube.prototype.getTransform = function (viewMatrix) {
    return m4.multiply(this._transform, viewMatrix);
}

Cube.prototype.render = function (viewMatrix) {
    this._program.use();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._positionBuffer);
    this._gl.enableVertexAttribArray(this._program.a_position);
    this._gl.vertexAttribPointer(this._program.a_position, this._vectorSize, this._gl.FLOAT, false, 0, 0);
    this._gl.uniformMatrix4fv(this._program.u_transform, false, this.getTransform(viewMatrix));
    this._gl.drawArrays(this._gl.TRIANGLES, 0, this._vertexCount);
};

module.exports = Cube;

Cube.prototype.setGeometry = function () {
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._positionBuffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array([
        // front
         0,  0,  0,
         0, 30,  0,
        30,  0,  0,
        30,  0,  0,
         0, 30,  0,
        30, 30,  0,

        // top
         0, 30,  0,
         0, 30, 30,
        30, 30,  0,
        30, 30,  0,
         0, 30, 30,
        30, 30, 30,

        // right
        30,  0,  0,
        30, 30,  0,
        30,  0, 30,
        30,  0, 30,
        30, 30,  0,
        30, 30, 30,

        // back
        30,  0, 30,
        30, 30, 30,
         0,  0, 30,
         0,  0, 30,
        30, 30, 30,
         0, 30, 30,

        // left
         0,  0, 30,
         0, 30, 30,
         0,  0,  0,
         0,  0,  0,
         0, 30, 30,
         0, 30,  0,

        // bottom
         0,  0, 30,
         0,  0,  0,
        30,  0, 30,
        30,  0, 30,
         0,  0,  0,
         0, 30,  0,
    ]), this._gl.STATIC_DRAW);
    this._vertexCount = 6 * 6;
    this._vectorSize = 3;
};
