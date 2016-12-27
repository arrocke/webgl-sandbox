var BufferIterator = function (buffer) {
    this._buffer = buffer
    this._view = new DataView(buffer);

    this._position = 0;
}

Object.defineProperties(BufferIterator.prototype, {
    byteLength: {
        get: function () {
            return this._view.byteLength;
        }
    },
    bitLength: {
        get: function () {
            return this.byteLength * 8;
        }
    },
    hasNext: {
        get: function () {
            return this._position < this.bitLength;
        }
    },
    bytePosition: {
        get: function () {
            return Math.floor(this._position / 8);
        }
    },
    bitOffset: {
        get: function () {
            return this._position % 8;
        }
    }
});

BufferIterator.prototype.getBits = function (nBits) {
    if (nBits == 0) {
        return 0;
    }
    else if ((nBits + this.bitOffset) <= 32 && (this._position + nBits) <= this.bitLength) {
        var data;
        var left;
        if (this.bitLength - this._position <= 8) {
            data = this._view.getUint8(this.bytePosition);
            left = 24 + this.bitOffset;
        }
        else if (this.bitLength - this._position <= 16) {
            data = this._view.getUint16(this.bytePosition);
            left = 16 + this.bitOffset;
        }
        else if (this.bitLength - this._position <= 24) {
            data = this._view.getUint8(this.bytePosition) * Math.pow(2, 16) + this._view.getUint16(this.bytePosition + 1);
            left = 8 + this.bitOffset;
        }
        else {
            data = this._view.getUint32(this.bytePosition);
            left = this.bitOffset;
        }

        if (this.bitOffset) {
            data = data << left;
        }

        data = data >>> 32 - nBits;
        this._position += nBits;
        return data;
    }
};

BufferIterator.prototype.getBuffer = function (nBytes) {
    if (this.bitOffset == 0 && (this.bytePosition + nBytes) <= this.byteLength) {
        var buffer = this._buffer.slice(this.bytePosition, this.bytePosition + nBytes);
        this._position += nBytes * 8;
        return buffer;
    }
}

module.exports = BufferIterator;
