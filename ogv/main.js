var loadFile = require('./util/loadFile');
var PageDecoder = require('./ogg/pageDecoder');
var IdentificationHeader = require('./ogg/identificationHeader');
var CommentHeader = require('./ogg/commentHeader');
var SetupHeader = require('./ogg/setupHeader');

loadFile(processVideo);

function processVideo(buffer) {
    var pageDecoder = new PageDecoder(buffer);
    var packets = pageDecoder.packets;
    var idHeader = new IdentificationHeader(packets[0]);
    var commentHeader = new CommentHeader(packets[1]);
    var setupHeader = new SetupHeader(packets[2]);
}
