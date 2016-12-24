var vector = {
    cross: function (u, v) {
        return [
            u[1] * v[2] - u[2] * v[1],
            u[2] * v[0] - u[0] * v[2],
            u[0] * v[1] - u[1] * v[0]
        ];
    },
    dot: function (u, v) {
    },
    subtract: function (u, v) {
        return [
            u[0] - v[0],
            u[1] - v[1],
            u[2] - v[2]
        ];
    },
    normalize: function (v) {
        var magnitude = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        if (magnitude > 0.00001) {
            return [
                v[0] / magnitude,
                v[1] / magnitude,
                v[2] / magnitude
            ];
        }
        else {
            return [0, 0, 0];
        }
    }
};

module.exports = vector;
