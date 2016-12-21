/**
 *  @arg options
 *  @arg options.gl - WebGL object
 *  @arg options.vShader - vertex shader source
 *  @arg options.fShader - fragment shader source
 *  @arg options.uniforms - array of uniform names
 *  @arg options.attributes - array of attribute names
 */
var Program = function(options) {
    options = options || {};
    options.uniforms = options.uniforms || [];
    options.attributes = options.attributes || [];

    this._gl = options.gl;

    // create the shaders
    this._vShader = this.createShader(this._gl.VERTEX_SHADER, options.vShader);
    this._fShader = this.createShader(this._gl.FRAGMENT_SHADER, options.fShader);

    // create the program
    this.createProgram();

    if (!this.initialized) {
        console.error('Error creating program.');
        return;
    }

    var self = this;

    // get uniform locations
    this._uniformLocations = {};
    // function to find a uniform location
    var uniformGetter = function (name) {
        return this._uniformLocations[name];
    };
    // find all of the uniforms
    for (var i = 0; i < options.uniforms.length; i++) {
        var name = options.uniforms[i];
        var location = this._gl.getUniformLocation(this._program, name);
        if (location != undefined) {
            this._uniformLocations[name] = location
            Object.defineProperty(this, name, {
                get: uniformGetter.bind(self, name)
            });
        }
    };

    // get attribute locations
    this._attributeLocations = {};
    // function to find an attribute location
    var attributeGetter = function (name) {
        return this._attributeLocations[name];
    }
    // find all of the attributes
    for (var i = 0; i < options.attributes.length; i++) {
        var name = options.attributes[i];
        var location = this._gl.getAttribLocation(this._program, name);
        if (location != undefined) {
            this._attributeLocations[name] = location
            Object.defineProperty(this, name, {
                get: attributeGetter.bind(self, name)
            });
        }
    };
};

Object.defineProperties(Program.prototype, {
    initialized: {
        get: function () {
            return !!this._vShader && !!this._fShader && !!this._program;
        }
    }
})

Program.prototype.createShader = function (type, source) {
    // create and compile the shader
    var shader = this._gl.createShader(type);
    this._gl.shaderSource(shader, source);
    this._gl.compileShader(shader);

    // verify success and print errors otherwise
    var success = this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    else {
        console.error(this._gl.getShaderInfoLog(shader));
        this._gl.deleteShader(shader);
    }
};

Program.prototype.createProgram = function () {
    // create and link the program
    var program = this._gl.createProgram();
    this._gl.attachShader(program, this._vShader);
    this._gl.attachShader(program, this._fShader);
    this._gl.linkProgram(program);

    var success = this._gl.getProgramParameter(program, this._gl.LINK_STATUS);
    if (success) {
        this._program = program;
        return program;
    }
    else {
        console.error(this._gl.getProgramInfoLog(program));
        this._gl.deleteProgram(program);
    }
};

Program.prototype.use = function () {
    this._gl.useProgram(this._program);
};

module.exports = Program;
