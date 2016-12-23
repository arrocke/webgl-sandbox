var GLObject = require('../webgl/object');

var Rectangle = function (options) {
    options = options || {};
    GLObject.call(this, options);

    this._positionBuffer = this._gl.createBuffer();
    this.setGeometry();
};

Rectangle.prototype = Object.create(GLObject.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.setGeometry = function () {
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._positionBuffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array([
        -0.5, -0.5,
         0.5, -0.5,
        -0.5,  0.5,
         0.5, -0.5,
         0.5,  0.5,
        -0.5,  0.5,
    ]), this._gl.STATIC_DRAW);
    this._vertexCount = 6;
    this._vectorSize = 2;
};

Rectangle.prototype.render = function () {
    this._program.use();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._positionBuffer);
    this._gl.enableVertexAttribArray(this._program.a_position);
    this._gl.vertexAttribPointer(this._program.a_position, this._vectorSize, this._gl.FLOAT, false, 0, 0);
    this._gl.drawArrays(this._gl.TRIANGLES, 0, this._vertexCount);
};

module.exports =  Rectangle;
