var render = require('./render');
var util = require('../../../js/webgl/util');

var xRangeId = 'translate-x';
var yRangeId = 'translate-y';
var redRangeId = 'red';
var greenRangeId = 'green';
var blueRangeId = 'blue';
var canvasId = 'glcanvas';

if (render) {
    var xRange = document.getElementById(xRangeId);
    var yRange = document.getElementById(yRangeId);
    var redRange = document.getElementById(redRangeId);
    var greenRange = document.getElementById(greenRangeId);
    var blueRange = document.getElementById(blueRangeId);
    var canvas = util.getCanvas(canvasId);

    util.resizeCanvas(canvas);

    function update() {
        var translate = [parseFloat(xRange.value) * canvas.width, parseFloat(yRange.value) * canvas.height];
        var width = 200;
        var height = 200;
        var color = [parseFloat(redRange.value), parseFloat(greenRange.value), parseFloat(blueRange.value), 1];

        render(translate, width, height, color);
    }

    xRange.addEventListener('input', update);
    yRange.addEventListener('input', update);
    redRange.addEventListener('input', update);
    greenRange.addEventListener('input', update);
    blueRange.addEventListener('input', update);

    update();
}
