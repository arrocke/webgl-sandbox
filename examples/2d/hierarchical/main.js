var render = require('./render');
var util = require('../../../js/webgl/util');

var angleRangeId = 'rotate';
var xRangeId = 'translate-x';
var yRangeId = 'translate-y';
var scaleXRangeId = 'scale-x';
var scaleYRangeId = 'scale-y';
var redRangeId = 'red';
var greenRangeId = 'green';
var blueRangeId = 'blue';
var canvasId = 'glcanvas';

if (render) {
    var angleRange = document.getElementById(angleRangeId);
    var xRange = document.getElementById(xRangeId);
    var yRange = document.getElementById(yRangeId);
    var scaleXRange = document.getElementById(scaleXRangeId);
    var scaleYRange = document.getElementById(scaleYRangeId);
    var redRange = document.getElementById(redRangeId);
    var greenRange = document.getElementById(greenRangeId);
    var blueRange = document.getElementById(blueRangeId);
    var canvas = util.getCanvas(canvasId);

    util.resizeCanvas(canvas);

    function update() {
        var rotate = 2 * Math.PI * parseFloat(angleRange.value);
        var translate = [parseFloat(xRange.value) * canvas.width, parseFloat(yRange.value) * canvas.height];
        var scale = [parseFloat(scaleXRange.value), parseFloat(scaleYRange.value)];
        var width = 200;
        var height = 200;
        var color = [parseFloat(redRange.value), parseFloat(greenRange.value), parseFloat(blueRange.value), 1];

        render(rotate, translate, scale, width, height, color);
    }

    angleRange.addEventListener('input', update);
    xRange.addEventListener('input', update);
    yRange.addEventListener('input', update);
    scaleXRange.addEventListener('input', update);
    scaleYRange.addEventListener('input', update);
    redRange.addEventListener('input', update);
    greenRange.addEventListener('input', update);
    blueRange.addEventListener('input', update);

    update();
}
