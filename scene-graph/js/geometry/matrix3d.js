var matrix = {
    perspective: function (fov, aspect, near, far) {
        var f = Math.tan((Math.PI - fov) / 2);
        var rangeInv = 1 / (near - far);
        return [
            f / aspect,  0, 0,                         0,
            0,           f, 0,                         0,
            0,           0, (near + far) * rangeInv,  -1,
            0,           0, near * far * rangeInv * 2, 0,
        ];
    },
    translation: function (dx, dy, dz) {
        return [
             1,  0,  0,  0,
             0,  1,  0,  0,
             0,  0,  1,  0,
            dx, dy, dz,  1
        ];
    },
    xRotation: function (t) {
        var c = Math.cos(t);
        var s = Math.sin(t);
        return [
            1,  0, 0, 0,
            0,  c, s, 0,
            0, -s, c, 0,
            0,  0, 0, 1,
        ];
    },
    yRotation: function (t) {
        var c = Math.cos(t);
        var s = Math.sin(t);
        return [
            c, 0, -s, 0,
            0, 1,  0, 0,
            s, 0,  c, 0,
            0, 0,  0, 1
        ];
    },
    zRotation: function (t) {
        var c = Math.cos(t);
        var s = Math.sin(t);
        return [
             c, s, s, 0,
            -s, c, 0, 0,
             0, 0, 1, 0,
             0, 0, 0, 1
        ];

    },
    scaling: function (dx, dy, dz) {
        return [
            dx,  0,  0, 0,
             0, dy,  0, 0,
             0,  0, dz, 0,
             0,  0,  0, 1
        ];
    },
    multiply: function (m1, m2) {
        var r = [];
        for (var k = 0; k < 16; k++) {
            var i = Math.floor(k / 4);
            var j = k % 4;
            var rx = 0;
            for (var a = 0; a < 4; a++) {
                var x = m1[4 * i + a];
                var y = m2[j + 4 * a];
                rx += x * y;
            }
            r.push(rx);
        }
        return r;
    },
    translate: function (m, dx, dy, dz) {
        return this.multiply(this.translation(dx, dy, dz), m);
    },
    xRotate: function (m, t) {
        return this.multiply(this.xRotation(t), m);
    },
    yRotate: function (m, t) {
        return this.multiply(this.yRotation(t), m);
    },
    zRotate: function (m, t) {
        return this.multiply(this.zRotation(t), m);
    },
    scale: function (m, dx, dy, dz) {
        return this.multiply(this.scale(dx, dy, dz), m);
    },
    ignoreCell: function (m, i, j) {
        var n = Math.sqrt(m.length);
        var r = [];
        for (var k = 0; k < m.length; k++) {
            var i2 = Math.floor(k / n);
            var j2 = k % n;
            if (i2 != i && j2 != j)
                r.push(m[k]);
        }
        return r;
    },
    determinant2: function (m) {
        return m[0] * m[3] - m[1] * m[2];
    },
    determinant3: function (m) {
        return m[0] * this.determinant2(this.ignoreCell(m, 0, 0))
             - m[1] * this.determinant2(this.ignoreCell(m, 0, 1))
             + m[2] * this.determinant2(this.ignoreCell(m, 0, 2));
    },
    determinant4: function (m) {
        return m[0] * this.determinant3(this.ignoreCell(m, 0, 0))
             - m[1] * this.determinant3(this.ignoreCell(m, 0, 1))
             + m[2] * this.determinant3(this.ignoreCell(m, 0, 2))
             - m[3] * this.determinant3(this.ignoreCell(m, 0, 3))
    },
    transpose: function (m) {
        var r = [];
        for (var k1 = 0; k1 < 16; k1++) {
            var i = Math.floor(k1 / 4);
            var j = k1 % 4;
            var k2 = 4 * j + i;
            r[k2] = m[k1];
        }
        return r;
    },
    inverse: function (m) {
        var det = this.determinant4(m);
        var r = [];
        for (var k = 0; k < 16; k++) {
            var i = Math.floor(k / 4);
            var j = k % 4;
            var mij = this.determinant3(this.ignoreCell(m, i, j)) / det;
            if ((i + j) % 2 != 0) {
                mij *= -1;
            }
            r.push(mij);
        }
        return this.transpose(r);
    }
};

module.exports = matrix;
