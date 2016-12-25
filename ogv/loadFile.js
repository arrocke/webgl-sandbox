function loadVideo(callback) {
    var req = new XMLHttpRequest();
    req.responseType = 'arraybuffer';
    req.addEventListener('load', function () {
        callback(req.response);
    });
    req.open('GET', './pingpong_ball_cannon.ogv');
    req.send();
}

module.exports = loadVideo;
