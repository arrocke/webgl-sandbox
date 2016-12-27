var encodings = require('../util/encodings');
var BufferIterator = require('../util/bufferIterator');
var math = require('../util/math');

var SetupHeader = function (buffer) {
    this._buffer = buffer;
    this._iterator = new BufferIterator(buffer);

    this.decode();
};

SetupHeader.prototype.decode = function () {
    this.HEADERTYPE = this._iterator.getBits(8);

    if (this.HEADERTYPE != 0x82) {
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

    this.decodeLoopFilterLimitTable();
    this.decodeQuanitizationTables();
    this.decodeHuffmanTables();
};

SetupHeader.prototype.decodeLoopFilterLimitTable = function () {
    this.LFLIMS = [];
    var NBITS = this._iterator.getBits(3);

    for (var qi = 0; qi < 64; qi++) {
        this.LFLIMS[qi] = this._iterator.getBits(NBITS);
    }
}

SetupHeader.prototype.decodeQuanitizationTables = function () {
    this.ACSCALE = [];
    var NBITS = 1 + this._iterator.getBits(4);
    for (var qi = 0; qi < 64; qi++) {
        this.ACSCALE[qi] = this._iterator.getBits(NBITS);
    }

    this.DCSCALE = [];
    NBITS = 1 + this._iterator.getBits(4);
    for (var qi = 0; qi < 64; qi++) {
        this.DCSCALE[qi] = this._iterator.getBits(NBITS);
    }

    this.NBMS = 1 + this._iterator.getBits(9);
    if (this.NBMS > 384) {
        return;
    }

    this.BMS = [];
    for (var bmi = 0; bmi < this.NBMS; bmi++) {
        this.BMS[bmi] = [];
        for (var ci = 0; ci < 64; ci++) {
            this.BMS[bmi][ci] = this._iterator.getBits(8);
        }
    }

    var NEWQR;
    this.QRBMIS = [];
    this.QRSIZES = [];
    this.NQRS = [];
    for (var qti = 0; qti < 2; qti++) {
        this.QRBMIS[qti] = [];
        this.QRSIZES[qti] = [];
        this.NQRS[qti] = [];
        for (var pli = 0; pli < 3; pli++) {
            this.QRBMIS[qti][pli] = [];
            this.QRSIZES[qti][pli] = [];
            this.NQRS[qti][pli] = [];

            if (qti > 0 || pli > 0) {
                NEWQR = this._iterator.getBits(1);
            }
            else {
                NEWQR = 1;
            }

            if (NEWQR == 0) {
                var RPQR;
                var qtj;
                var plj;

                if (qti > 0) {
                    RPQR = this._iterator.getBits(1);
                }
                else {
                    RPQR = 0;
                }

                if (RPQR == 1) {
                    qtj = qti - 1;
                    plj = pli;
                }
                else {
                    qtj = math.intDiv(3 * qti + pli - 1, 3);
                    plj = (pli + 2) % 3;
                }

                this.NQRS[qti][pli] = this.NQRS[qtj][plj];
                this.QRSIZES[qti][pli] = this.QRSIZES[qtj][plj];
                this.QRBMIS[qti][pli] = this.QRBMIS[qtj][plj];
            }
            else {
                var qri = 0;
                var qi = 0;

                var qrbmis = this._iterator.getBits(math.ilog(this.NBMS - 1));
                if (qrbmis >= this.NBMS) {
                    return;
                }
                this.QRBMIS[qti][pli][qri] = qrbmis;

                while (qi < 63) {
                    var qrsize = 1 + this._iterator.getBits(math.ilog(62 - qi));
                    this.QRSIZES[qti][pli][qri] = qrsize;
                    qi += qrsize;
                    qri++;
                    this.QRBMIS[qti][pli][qri] = this._iterator.getBits(math.ilog(this.NBMS - 1));
                }

                if (qi > 63) {
                    return;
                }

                this.NQRS[qti][pli] = qri;
            }
        }
    }
};

SetupHeader.prototype.decodeHuffmanTables = function () {
    var isDecodable = true;
    var decodeNode = (function (HBITS, table) {
        if (HBITS.length > 32) {
            isDecodable = false;
            return;
        }

        var ISLEAF = this._iterator.getBits(1);

        if (ISLEAF == 1) {
            if (Object.keys(table).length > 32) {
                isDecodable = false;
                return;
            }
            var TOKEN = this._iterator.getBits(5);
            table[HBITS] = TOKEN;
        }
        else {
            decodeNode(HBITS + '0', table);
            decodeNode(HBITS + '1', table);
        }
    }).bind(this);

    this.HTS = [];

    for (var hti = 0; hti < 80; hti++) {
        this.HTS[hti] = {};
        decodeNode('', this.HTS[hti]);
        if (!isDecodable) {
            return;
        }
    }
};

module.exports = SetupHeader;
