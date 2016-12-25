function concatBuffers (buffer1, buffer2) {
    var returnBuffer = new ArrayBuffer(buffer1.byteLength + buffer2.byteLength);
    var view = new DataView(returnBuffer);
    var view1 = new DataView(buffer1);
    var view2 = new DataView(buffer2);

    for (var i = 0; i < buffer1.byteLength; i++) {
        view.setUint8(i, view1.getUint8(i));
    }

    view = new DataView(returnBuffer, buffer1.byteLength);

    for (var i = 0; i < buffer2.byteLength; i++) {
        view.setUint8(i, view2.getUint8(i));
    }

    return returnBuffer;
}

module.exports = concatBuffers;
