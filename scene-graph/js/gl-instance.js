var Program = require('./program');

/**
 *  @arg options
 *  @arg options.id - HTML id of canvas element
 */
var GLInstance = function (options) {
    options = options || {};

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
};

GLInstance.prototype.createProgram = function (name, options) {
    options = options || {};
    options.gl = this._gl;
    this._programs[name] = new Program(options);
    var self = this;

    if (!this[name]) {
        Object.defineProperty(this, name, {
            get: (function (name) {
                return this._programs[name];
            }).bind(self, name)
        });
    }
};

module.exports = GLInstance;
