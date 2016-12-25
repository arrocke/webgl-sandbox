var BufferIterator = require('../util/bufferIterator');
var encodings = require('../util/encodings');
var concatBuffers = require('../util/concatBuffers');

var PageDecoder = function (buffer) {
    this._buffer = buffer;
    this._iterator = new BufferIterator(buffer);
    this._pages = [];
    this._packets = [];

    while (this.hasNext) {
        this.decodePage();
    }
};

Object.defineProperties(PageDecoder.prototype, {
    hasNext: {
        get: function () {
            return this._iterator.hasNext;
        }
    },
    pages: {
        get: function () {
            return this._pages.slice();
        }
    },
    packets: {
        get: function () {
            return this._packets.slice();
        }
    }
});

PageDecoder.prototype.decodePage = function () {
    // first 4 bytes must equal "OggS"
    if (this._iterator.getBits(8) != encodings.O ||
        this._iterator.getBits(8) != encodings.g ||
        this._iterator.getBits(8) != encodings.g ||
        this._iterator.getBits(8) != encodings.S) {
        return;
    }

    // page information
    var page = {};

    page.STREAM_STRUCTRE_VERSION = this._iterator.getBits(8);
    page.HEADER_TYPE_FLAG = this._iterator.getBits(8);

    page.CONTINUED_PACKET = (page.HEADER_TYPE_FLAG & 1) == 1;
    page.BOS = (page.HEADER_TYPE_FLAG & 2) == 2;
    page.EOS = (page.HEADER_TYPE_FLAG & 4) == 4;

    page.ABSOULTE_GRANULE_POSITON = this._iterator.getBuffer(8);
    page.STREAM_SERIAL_NUMBER = this._iterator.getBits(32);
    page.PAGE_SEQUENCE_NUMBER = this._iterator.getBits(32);
    page.PACKET_CHECKSUM = this._iterator.getBits(32);
    page.PAGE_SEGMENTS = this._iterator.getBits(8);
    page.SEGMENT_TABLE = [];


    var dataStart = this._iterator.bytePosition;
    var pageSize = 0;
    var packetSizes = [0];
    var pi = 0;

    for (var si = 0; si < page.PAGE_SEGMENTS; si++) {
        // get each segment length
        var segmentSize = this._iterator.getBits(8);
        // append to segment table
        page.SEGMENT_TABLE.push(segmentSize);
        // add to page size
        pageSize += segmentSize;
        // add to packet size
        packetSizes[pi] += segmentSize;
        // if last segment in packet
        if (segmentSize < 255) {
            // go to the next packet
            pi++;
            // set the next packet size to 0
            packetSizes[pi] = 0;
        }
    }

    // if this page has a continued packet
    if (page.CONTINUED_PACKET) {
        // get the position of the last packet
        var lastPacketPos = this._packets.length - 1;
        // set the last packet to the concated buffer of the previous page's last packet and this page's first packet
        this._packets[lastPacketPos] = concatBuffers(this._packets[lastPacketPos], this._iterator.getBuffer(packetSizes[0]));
        // remove the first packet size;
        packetSizes.splice(0, 1);
        // reset the continued packet flag
        this._continuedPacket = false;
    }

    // get the buffers for each of the remaining packets
    for (var pi2 = 0; pi2 < packetSizes.length; pi2++) {
        if (packetSizes[pi2] > 0) {
            this._packets.push(this._iterator.getBuffer(packetSizes[pi2]));
        }
    }

    this._pages.push(page);

    return page;
};

module.exports = PageDecoder;
