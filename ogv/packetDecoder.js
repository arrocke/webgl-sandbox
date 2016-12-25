var BufferIterator = require('./bufferIterator');
var encodings = require('./encodings');

var PacketDecoder = function (buffer) {
    this._buffer = buffer;
    this._iterator = new BufferIterator(buffer);
    this._packets = [];
};

Object.defineProperties(PacketDecoder.prototype, {
    hasNext: {
        get: function () {
            return this._iterator.hasNext;
        }
    },
    packets: {
        get: function () {
            return this._packets.slice();
        }
    }
})

PacketDecoder.prototype.decodePacket = function () {
    // first 4 bytes must equal "OggS"
    if (this._iterator.getBits(8) != encodings.O ||
        this._iterator.getBits(8) != encodings.g ||
        this._iterator.getBits(8) != encodings.g ||
        this._iterator.getBits(8) != encodings.S) {
        return;
    }

    // packet information
    var packet = {};

    packet.STREAM_STRUCTRE_VERSION = this._iterator.getBits(8);
    packet.HEADER_TYPE_FLAG = this._iterator.getBits(8);
    packet.ABSOULTE_GRANULE_POSITON = this._iterator.getBuffer(8);
    packet.STREAM_SERIAL_NUMBER = this._iterator.getBits(32);
    packet.PAGE_SEQUENCE_NUMBER = this._iterator.getBits(32);
    packet.PACKET_CHECKSUM = this._iterator.getBits(32);
    packet.PAGE_SEGMENTS = this._iterator.getBits(8);
    packet.SEGMENT_TABLE = [];

    var dataSize = 0;

    for (var i = 0; i < packet.PAGE_SEGMENTS; i++) {
        var segmentSize = this._iterator.getBits(8);
        packet.SEGMENT_TABLE.push(segmentSize);
        dataSize += segmentSize;
    }
    packet.DATA_BUFFER = this._iterator.getBuffer(dataSize);

    this._packets.push(packet);

    return packet;
};

module.exports = PacketDecoder;
