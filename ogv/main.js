var loadFile = require('./util/loadFile');
var PageDecoder = require('./ogg/pageDecoder');
var IdentificationHeader = require('./ogg/identificationHeader');
//var CommentHeader = require('../ogg/commentHeader');

loadFile(processVideo);

function processVideo(buffer) {
    var pageDecoder = new PageDecoder(buffer);
    var packets = pageDecoder.packets;
    var idHeader = new IdentificationHeader(packets[0]);
}
