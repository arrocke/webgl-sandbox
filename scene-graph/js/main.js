var GLInstance = require('./gl-instance');
var vShader = require('../glsl/vShader.glsl');
var fShader = require('../glsl/fShader.glsl');

var instance = new GLInstance({
    id: 'glcanvas'
});

instance.createProgram('testProgram', {
    vShader: vShader,
    fShader: fShader,
    attributes: [
        'a_position'
    ]
});
