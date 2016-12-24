var GLInstance = require('./webgl/instance');
var loadPrograms = require('./loadPrograms');
var m4 = require('./geometry/matrix3d');
var F = require('./objects/f');
var Cube = require('./objects/cube');

var glinstance = new GLInstance({
    id: 'glcanvas'
});

loadPrograms(glinstance);

var cube = new Cube({
    gl: glinstance.gl,
    program: glinstance.program3d
});
var f = new F({
    gl: glinstance.gl,
    program: glinstance.program3d
});

f.localTransform = m4.translation(-200, -15, -15);
//f1.localTransform = m4.yRotate(f1.localTransform, Math.PI / 6);
cube.localTransform = m4.translation(-15, -15, -15);
//f2.localTransform = m4.yRotate(f2.localTransform, Math.PI / 6);

glinstance.addObject({
    name: 'f',
    object: f
});
glinstance.addObject({
    name: 'cube',
    object: cube
});

var t = 0;
setInterval(function () {
    t = (t + 1) % 60;
    var angle = 6 * t / 360 * 2 * Math.PI;

    var camera = m4.yRotation(angle);
    camera = m4.translate(camera, 0, 200, 300);
    camera = m4.lookAt(camera.slice(12, 15), [0, 0, 0], [0, 1, 0]);

    glinstance.camera = camera;

    glinstance.render();
}, 1000 / 29.97)
