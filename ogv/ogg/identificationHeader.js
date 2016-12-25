var encodings = require('../util/encodings');
var BufferIterator = require('../util/bufferIterator');

var IdentificationHeader = function (packet) {
    this._packet = packet;
    this._iterator = new BufferIterator(packet.DATA_BUFFER);

    this.decode();
};

IdentificationHeader.prototype.decode = function () {
    this.HEADERTYPE = this._iterator.getBits(8);

    if (this.HEADERTYPE != 0x80) {
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

    this.VMAJ = this._iterator.getBits(8);
    if (this.VMAJ != 3) {
        return;
    }

    this.VMIN = this._iterator.getBits(8);
    if (this.VMIN != 2) {
        return;
    }

    this.VREV = this._iterator.getBits(8);

    this.FMBW = this._iterator.getBits(16);
    this.FMBH = this._iterator.getBits(16);

    this.PICW = this._iterator.getBits(24);
    if (this.PICW > this.FMBW * 16) {
        return;
    }

    this.PICH = this._iterator.getBits(24);
    if (this.PICH > this.FMBH * 16) {
        return;
    }

    this.PICX = this._iterator.getBits(8);
    if (this.PICX > this.FMBW * 16 - this.PICW) {
        return;
    }

    this.PICY = this._iterator.getBits(8);
    if (this.PICY > this.FMBH * 16 - this.PICY) {
        return;
    }

    this.FRN = this._iterator.getBits(32);
    if (this.FRN <= 0) {
        return;
    }

    this.FRD = this._iterator.getBits(32);
    if (this.FRD <= 0) {
        return;
    }

    this.PARN = this._iterator.getBits(24);
    if (this.PARN <= 0) {
        return;
    }

    this.PARD = this._iterator.getBits(24);
    if (this.PARD <= 0) {
        return;
    }

    this.CS = this._iterator.getBits(8);
    this.NOMBR = this._iterator.getBits(24);
    this.QUAL = this._iterator.getBits(6);
    this.KFGSHIFT = this._iterator.getBits(5);
    this.PF = this._iterator.getBits(2);

    var reserved = this._iterator.getBits(3);
    if (reserved != 0) {
        return;
    }

    switch (this.PF) {
        case 0:
            this.NSBS = (Math.floor((this.FMBW + 1) / 2) * Math.floor((this.FMBH + 1) / 2))
                + 2 * (Math.floor((this.FMBW + 3) / 4) * Math.floor((this.FMBH + 3) / 4));
            this.NBS = 6 * this.FMBW * this.FMBH;
            break;
        case 2:
            this.NSBS = (Math.floor((this.FMBW + 1) / 2) * Math.floor((this.FMBH + 1) / 2))
                + 2 * (Math.floor((this.FMBW + 3) / 4) * Math.floor((this.FMBH + 1) / 2));
            this.NBS = 8 * this.FMBW * this.FMBH;
            break;
        case 3:
            this.NSBS = 3 * (Math.floor((this.FMBW + 1) / 2) * Math.floor((this.FMBH + 1) / 2))
            this.NBS = 12 * this.FMBW * this.FMBH;
            break;
    }
};

module.exports = IdentificationHeader;
