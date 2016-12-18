module.exports = {
  translation: function (dx, dy, dz) {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      dx, dy, dz, 1
    ];
  },
  xRotation: function (angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);

    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1
    ];
  },
  yRotation: function (angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);

    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1
    ];
  },
  zRotation: function (angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);

    return [
      c, s, 0, 0,
      -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  },
  scaling: function (dx, dy, dz) {
    return [
      dx, 0, 0, 0,
      0, dy, 0, 0,
      0, 0, dz, 0,
      0, 0, 0, 1
    ];
  },
  projection: function (width, height, depth) {
    return [
      2 / width, 0, 0, 0,
      0, -2 / height, 0, 0,
      0, 0, 2 / depth, 0,
      -1, 1, 0, 1
    ];
  },
  orthographic: function (left, right, bottom, top, near, far) {
      return [
        2 / (right - left), 0, 0, 0,
        0, 2 / (top - bottom), 0, 0,
        0, 0, 2 / (far - near), 0,
        (left + right) / (left - right),
        (bottom + top) / (bottom - top),
        (near + far) / (near - far),
        1
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
  xRotate: function (m, angle) {
    return this.multiply(this.xRotation(angle), m);
  },
  yRotate: function (m, angle) {
    return this.multiply(this.yRotation(angle), m);
  },
  zRotate: function (m, angle) {
    return this.multiply(this.zRotation(angle), m);
  },
  scale: function (m, dx, dy, dz) {
    return this.multiply(this.scaling(dx, dy, dz), m);
  }
};
