var GLProgram = require('./program');

/**
 *  @arg options
 *  @arg options.id - HTML id of canvas element
 */
var GLInstance = function (options) {
    options = options || {};
    options.clearColor = options.clearColor || [];

    this._canvas = document.getElementById(options.id);
    if (!this._canvas) {
        console.error('GLInstance needs a canvas.');
        return;
    }

    this._gl = this._canvas.getContext('webgl') || this._canvas.getContext('experimental-webgl');
    if (!this._gl) {
        console.error('GLInstance could not initialize WebGL.');
        return;
    }

    this._programs = {};

    this._clearColor = [];
    this._clearColor[0] = options.clearColor[0] || 0;
    this._clearColor[1] = options.clearColor[1] || 0;
    this._clearColor[2] = options.clearColor[2] || 0;
    this._clearColor[3] = options.clearColor[3] || 0;

    this._gl.clear.apply(this._gl, this._clearColor);


};

GLInstance.prototype.createProgram = function (options) {
    options = options || {};
    options.gl = this._gl;
    var name = options.name;
    this._programs[name] = new GLProgram(options);
    var self = this;

    if (!this[name]) {
        Object.defineProperty(this, name, {
            get: (function (name) {
                return this._programs[name];
            }).bind(self, name)
        });
    }
};

GLInstance.prototype.clear = function () {
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this_gl.DEPTH_BUFFER_BIT);
};

module.exports = GLInstance;
