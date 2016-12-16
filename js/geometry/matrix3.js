module.exports = {
    translation: function (x, y) {
        return [
            1, 0, 0,
            0, 1, 0,
            x, y, 1
        ];
    },
    rotation: function (angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        return [
            c,-s, 0,
            s, c, 0,
            0, 0, 1
        ];
    },
    scaling: function (x, y) {
        return [
            x, 0, 0,
            0, y, 0,
            0, 0, 1
        ];
    },
    multiply: function (m1, m2){
        var r = [
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        ];
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                for (var k = 0; k < 3; k++) {
                    r[j * 3 + i] += m1[j * 3 + k] * m2[k * 3 + i];
                }
            }
        }

        return r;
    },
    identity: function () {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ];
    }
};
