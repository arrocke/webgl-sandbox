var GLInstance = require('./webgl/instance');
var loadPrograms = require('./loadPrograms');
var Rectangle = require('./objects/rectangle');

var glinstance = new GLInstance({
    id: 'glcanvas'
});

loadPrograms(glinstance);

var rect1 = new Rectangle({
    gl: glinstance.gl,
    program: glinstance.program2d
});

glinstance.addObject({
    name: 'rect1',
    object: rect1
});

glinstance.render();
