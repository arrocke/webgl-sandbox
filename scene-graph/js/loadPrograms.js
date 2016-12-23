var vShader = require('../glsl/vShader.glsl');
var fShader = require('../glsl/fShader.glsl');

function loadPrograms(glinstance) {
    glinstance.createProgram({
        name: 'program2d',
        vShader: vShader,
        fShader: fShader,
        attributes: [
            'a_position'
        ]
    });
}

module.exports = loadPrograms;
