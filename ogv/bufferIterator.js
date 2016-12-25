var BufferIterator = function (buffer) {
    this._buffer = buffer;
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
    _bytePosition: {
        get: function () {
            return Math.floor(this._position / 8);
        }
    },
    _bitOffset: {
        get: function () {
            return this._position % 8;
        }
    }
});

BufferIterator.prototype.getBits = function (nBits) {
    if ((nBits + this._bitOffset) <= 32 && (this._position + nBits) <= this.bitLength) {
        var data;
        var left;
        if (this.bitLength - this._position <= 8) {
            data = this._view.getUint8(this._bytePosition);
            left = 24 + this._bitOffset;
        }
        else if (this.bitLength - this._position <= 16) {
            data = this._view.getUint16(this._bytePosition);
            left = 16 + this._bitOffset;
        }
        else if (this.bitLength - this._position <= 24) {
            data = this._view.getUint8(this._bytePosition) * Math.pow(2, 16) + this._view.getUint16(this._bytePosition + 1);
            left = 8 + this._bitOffset;
        }
        else {
            data = this._view.getUint32(this._bytePosition);
            left = this._bitOffset; 
        }

        if (this._bitOffset) {
            data = data << left;
        }

        data = data >>> 32 - nBits;
        this._position += nBits;
        return data;
    }
};

BufferIterator.prototype.getBuffer = function (nBytes) {
    if (this._bitOffset == 0 && (this._bytePosition + nBytes) <= this.byteLength) {
        var buffer = this._buffer.slice(this._bytePosition, this._bytePosition + nBytes);
        this._position += nBytes * 8;
        return buffer;
    }
}

module.exports = BufferIterator;
