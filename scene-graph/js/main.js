var GLInstance = require('./webgl/instance');
var loadPrograms = require('./loadPrograms');
var F = require('./objects/f.js');

var glinstance = new GLInstance({
    id: 'glcanvas'
});

loadPrograms(glinstance);

var f = new F({
    gl: glinstance.gl,
    program: glinstance.program3d
});

glinstance.addObject({
    name: 'f',
    object: f
});

glinstance.render();
