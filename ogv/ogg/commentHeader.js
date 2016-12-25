var encodings = require('../util/encodings');
var BufferIterator = require('../util/bufferIterator');

var CommentHeader = function (packet) {
    this._packet = packet;
    this._iterator = new BufferIterator(packet.DATA_BUFFER);

    this.decode();
};

CommentHeader.prototype.decodeLEN = function () {
    var LEN0 = this._iterator.getBits(8);
    var LEN1 = this._iterator.getBits(8);
    var LEN2 = this._iterator.getBits(8);
    var LEN3 = this._iterator.getBits(8);

    return LEN0 + (LEN1 << 8) + (LEN2 << 16) + (LEN3 << 24);
};

CommentHeader.prototype.decode = function () {
    this.HEADERTYPE = this._iterator.getBits(8);

    if (this.HEADERTYPE != 0x81) {
        return;
    }

    if (this._iterator.getBits(8) != encodings.t ||
        this._iterator.getBits(8) != encodings.h ||
        this._iterator.getBits(8) != encodings.e ||
        this._iterator.getBits(8) != encodings.o ||
        this._iterator.getBits(8) != encodings.r ||
        this._iterator.getBits(8) != encodings.a) {
        return;
    }

    var LEN = this.decodeLEN();

    this.VENDOR = '';

    for (var i = 0; i < LEN; i++) {
        this.VENDOR += String.fromCharCode(this._iterator.getBits(8));
    }

    this.NCOMMENTS = this.decodeLEN();

};

module.exports = CommentHeader;
