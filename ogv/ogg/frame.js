var BufferIterator = require('../util/bufferIterator');
var huffmanCodes = require('./huffmanCodes');

var Frame = function (buffer, video) {
    this._buffer = buffer;
    this._iterator = new BufferIterator(buffer);
    this._video = video;

    this.decode();
}

Frame.prototype.decode = function () {
    var success;

    success = this.decodeHeader();

    if (!success) {
        this._decoded = false;
        return;
    }

    this.decodeCodedBlockFlags();
    this.decodeMacroBlockCodingModes();

    this._decoded = true;
};

Frame.prototype.decodeHeader = function () {
    // data packets' first bit is set to 0
    if (0 != this._iterator.getBits(1)) {
        return false;
    }

    // decode the frame type
    // 0 - intra frame
    // 1 - inter frame
    this.FTYPE = this._iterator.getBits(1);

    // if the frame is the first it must be an intra frame
    if (this._video.frameCount == 0 && this.FTYPE != 0) {
        return false;
    }

    // deocde QI values
    this.QIS = [];

    this.QIS[0] = this._iterator.getBits(6);
    var MOREQIS = this._iterator.getBits(1);

    if (MOREQIS == 0) {
        this.NQIS = 1;
    }
    else {
        this.QIS[1] = this._iterator.getBits(6);
        MOREQIS = this._iterator.getBits(1);

        if (MOREQIS == 0) {
            this.NQIS = 2;
        }
        else {
            this.QIS[2] = this._iterator.getBits(6);
            this.NQIS = 3;
        }
    }

    // if the frame is an intra frame ensure these 3 bits are 0, they are reserved.
    if (this._iterator.getBits(3) != 0) {
        return false;
    }

    return true;
};

Frame.prototype.decodeCodedBlockFlags = function () {
    var NBS = this._video._identificationHeader.NBS;
    var NSBS = this._video._identificationHeader.NSBS;

    this.BCODED = [];

    // for intra frames
    if (this.FTYPE == 0) {
        for (var bi = 0; bi < NBS; bi++) {
            this.BCODED[bi] = 1;
        }
    }
    // for inter frames
    else {
        var SBPCODED = [];
        var BITS = this.decodeLongRunBitString(NSBS);
        var NBITS = 0;
        for (var sbi = 0; sbi < NSBS; sbi++) {
            SBPCODED[sbi] = BITS.splice(0, 1);
            if (BITS[sbi] == 0) {
                NBITS++;
            }
        }

        BITS = this.decodeLongRunBitString(NBITS);
        var SBFCODED = [];
        NBITS = 0;
        for (var sbi = 0; sbi < NSBS; sbi++) {
            if (SBPCODED[sbi] == 0) {
                SBFCODED[sbi] = BITS.splice(0, 1);
            }
            else {
                NBITS++;
            }
        }

        BITS = this._iterator.getBits(NBITS);
        this.BCODED = [];
        for (var bi = 0; bi < NBS; bi++) {
            var sbi = Math.floor(bi / 16);
            if (SBPCODED[sbi] == 0) {
                BCODED[bi] = SBFCODED[sbi];
            }
            else {
                BCODED[bi] = BITS.splice(0, 1);
            }
        }

    }
};

Frame.prototype.decodeLongRunBitString = function (NBITS) {
    var LEN = 0;
    var BITS = '';

    if (LEN == NBITS) {
        return BITS;
    }

    var BIT = this._iterator.getBits(1).toString();

    while (LEN != NBITS) {
        var code = this._iterator.getBits(1).toString();
        while (huffmanCodes.longRunBitString[code] != undefined) {
            code += this._iterator.getBits(1).toString();
        }

        var codeValues = huffmanCodes.longRunBitString[code];
        var ROFFS = this._iterator.getBits(codeValues.NBITS);
        var RLEN = RSTART + ROFFS;

        for (var i = 0; i < RLEN; i++) {
            BITS += BIT.toString();
        }
        LEN += RLEN;

        if (RLEN == 4129) {
            BIT = this._iterator.getBits(1);
        }
        else {
            BIT = 1 - BIT;
        }
    }

    return BITS;
};

Frame.prototype.decodeShortRunBitString = function (NBITS) {
    var LEN = 0;
    var BITS = '';

    if (LEN == NBITS) {
        return BITS;
    }

    var BIT = this._iterator.getBits(1).toString();

    while (LEN != NBITS) {
        var code = this._iterator.getBits(1).toString();
        while (huffmanCodes.shortRunBitString[code] != undefined) {
            code += this._iterator.getBits(1).toString();
        }

        var codeValues = huffmanCodes.shortRunBitString[code];
        var ROFFS = this._iterator.getBits(codeValues.NBITS);
        var RLEN = RSTART + ROFFS;

        for (var i = 0; i < RLEN; i++) {
            BITS += BIT.toString();
        }
        LEN += RLEN;

        BIT = 1 - BIT;
    }

    return BITS;
}

Frame.prototype.decodeMacroBlockCodingModes = function () {
    var NBS = this._video._identificationHeader.NBS;
    var macroBlockCount = NBS / 4;

    this.MBMODES = []

    // for intra frames
    if (this.FTYPE == 0) {
        for (var mbi = 0; mbi < macroBlockCount; mbi++) {
            this.MBMODES[mbi] = 1;
        }
    }
    // for inter frames
    else {
        this.MSCHEME = this._iterator.getBits(3);
        this.ALPHABET;
        if (this.MSCHEME == 0) {
            this.MALPHABET = {};
            for (var mode = 0; mode < 7; mode++) {
                this.MALPHABET[this._iterator.getBits(3).toString(2)] = mode;
            }
        }
        else if (this.MSCHEME != 7) {
            this.MALPHABET = huffmanCodes.macroBlockCodingSchemes[this.MSCHEME - 1];
        }

        for (var mbi = 0; mbi < macroBlockCount; mbi++) {
            var isLumaCoded = false;
            for (var bi = 4 * mbi; bi <  4 * (mbi + 1); bi++) {
                if (this.BCODED[bi] == 1) {
                    isLumaCoded = true;
                    break;
                }
            }

            if (isLumaCoded) {
                if (this.MSCHEME != 7) {
                    var codeString = this._iterator.getBits(1).toString();
                    while (this.ALPHABET[codeString] == undefined) {
                        codeString += this._iterator.getBits(1).toString();
                    }
                    this.MBMODES[mbi] = this.ALPHABET[codeString];
                }
                else {
                    this.MBMODES[mbi] = this._iterator.getBits(3);
                }
            }
            else {
                this.MBMODES[mbi] = 0;
            }
        }
    }
}

module.exports = Frame;
