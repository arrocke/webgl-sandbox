var loadFile = require('./loadFile');
var PacketDecoder = require('./packetDecoder');
var IdentificationHeader = require('./identificationHeader');

loadFile(processVideo);

function processVideo(buffer) {
    var packetDecoder = new PacketDecoder(buffer);

    var packet1 = packetDecoder.decodePacket();

    var identificationHeader = new IdentificationHeader(packet1);
}
