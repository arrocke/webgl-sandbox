var render = require('./render');
var util = require('../../../js/webgl/util');

var angleRangeId = 'rotate';
var xRangeId = 'translate-x';
var yRangeId = 'translate-y';
var widthRangeId = 'width';
var heightRangeId = 'height';
var redRangeId = 'red';
var greenRangeId = 'green';
var blueRangeId = 'blue';
var canvasId = 'glcanvas';

if (render) {
    var angleRange = document.getElementById(angleRangeId);
    var xRange = document.getElementById(xRangeId);
    var yRange = document.getElementById(yRangeId);
    var widthRange = document.getElementById(widthRangeId);
    var heightRange = document.getElementById(heightRangeId);
    var redRange = document.getElementById(redRangeId);
    var greenRange = document.getElementById(greenRangeId);
    var blueRange = document.getElementById(blueRangeId);
    var canvas = util.getCanvas(canvasId);

    util.resizeCanvas(canvas);

    function update() {
        var rotate = [Math.sin(2 * Math.PI * parseFloat(angleRange.value)), Math.cos(2 * Math.PI * parseFloat(angleRange.value))];
        var translate = [parseFloat(xRange.value) * canvas.width, parseFloat(yRange.value) * canvas.height];
        var width = parseFloat(widthRange.value) * canvas.width;
        var height = parseFloat(heightRange.value) * canvas.height;
        var color = [parseFloat(redRange.value), parseFloat(greenRange.value), parseFloat(blueRange.value), 1];

        render(rotate, translate, width, height, color);
    }

    angleRange.addEventListener('input', update);
    xRange.addEventListener('input', update);
    yRange.addEventListener('input', update);
    widthRange.addEventListener('input', update);
    heightRange.addEventListener('input', update);
    redRange.addEventListener('input', update);
    greenRange.addEventListener('input', update);
    blueRange.addEventListener('input', update);

    update();
}
