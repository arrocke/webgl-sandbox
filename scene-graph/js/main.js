var GLInstance = require('./webgl/instance');
var loadPrograms = require('./loadPrograms');

var glinstance = new GLInstance({
    id: 'glcanvas'
});

loadPrograms(glinstance);
