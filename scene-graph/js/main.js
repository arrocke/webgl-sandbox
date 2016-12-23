var GLInstance = require('./instance');
var vShader = require('../glsl/vShader.glsl');
var fShader = require('../glsl/fShader.glsl');

var instance = new GLInstance({
    id: 'glcanvas'
});

instance.createProgram(, {
    name: 'testProgram',
    vShader: vShader,
    fShader: fShader,
    attributes: [
        'a_position'
    ]
});
