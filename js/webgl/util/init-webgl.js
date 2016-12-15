module.exports = function (canvas) {
    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) {
        alert('Error loading WebGL, your browser may not support it.');
    }

    return gl;
};