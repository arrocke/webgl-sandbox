var GLObject = function (options) {
    options = options || {};

    this._gl = options.gl;
    this._program = options.program;
};

GLObject.prototype.render = function () {

};

module.exports = GLObject;
