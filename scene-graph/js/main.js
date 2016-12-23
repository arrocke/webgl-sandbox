var GLInstance = require('./webgl/instance');
var loadPrograms = require('./loadPrograms');
var m4 = require('./geometry/matrix3d');
var F = require('./objects/f.js');

var glinstance = new GLInstance({
    id: 'glcanvas'
});

loadPrograms(glinstance);

var f1 = new F({
    gl: glinstance.gl,
    program: glinstance.program3d
});
var f2 = new F({
    gl: glinstance.gl,
    program: glinstance.program3d
});

f1.localTransform = m4.translation(-100, 0, 0);
f2.localTransform = m4.translation(100, 0, 0);

glinstance.addObject({
    name: 'f1',
    object: f1
});
glinstance.addObject({
    name: 'f2',
    object: f2
});

var t = 0;

setInterval(function () {
    t = (t + 1) % 30;
    glinstance.render(12 * t / 360 * 2 * Math.PI);
}, 1000 / 29.97)
