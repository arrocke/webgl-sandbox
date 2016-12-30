var loadFile = require('../util/loadFile');
var PageDecoder = require('./pageDecoder');
var IdentificationHeader = require('./identificationHeader');
var CommentHeader = require('./commentHeader');
var SetupHeader = require('./setupHeader');
var Frame = require('./frame');

var Video = function (url) {

    this._frames = [];

    loadFile(url, function (buffer) {
        this._buffer = buffer;
        this.decode();
    }.bind(this));
};

Object.defineProperties(Video.prototype, {
    frameCount: {
        get: function () {
            return this._frames.length;
        }
    },
    frames: {
        get: function () {
            return this._frames.slice();
        }
    }
});

Video.prototype.decode = function () {
    var pageDecoder = new PageDecoder(this._buffer);
    this._packets = pageDecoder.packets;

    this._identificationHeader = new IdentificationHeader(this._packets[0]);
    this._commentHeader = new CommentHeader(this._packets[1]);
    this._setupHeader = new SetupHeader(this._packets[2]);

    var frame = new Frame(this._packets[3], this);

}

module.exports = Video;
