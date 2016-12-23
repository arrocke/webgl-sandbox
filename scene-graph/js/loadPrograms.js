var vShader = require('../glsl/3dShader.vs');
var fShader = require('../glsl/blackShader.fs');

function loadPrograms(glinstance) {
    glinstance.createProgram({
        name: 'program3d',
        vShader: vShader,
        fShader: fShader,
        attributes: [
            'a_position'
        ],
        uniforms: [
            'u_transform'
        ]
    });
}

module.exports = loadPrograms;
