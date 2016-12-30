function loadVideo(url, callback) {
    var req = new XMLHttpRequest();
    req.responseType = 'arraybuffer';
    req.addEventListener('load', function () {
        callback(req.response);
    });
    req.open('GET', url);
    req.send();
}

module.exports = loadVideo;
