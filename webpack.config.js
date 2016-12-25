module.exports = {
    entry: {
        bundle: './js/main.js',
        translation2D: './examples/2d/translation/main.js',
        rotation2D: './examples/2d/rotation/main.js',
        scale2D: './examples/2d/scale/main.js',
        'transformation-matrix2d': './examples/2d/transformation-matrix/main.js',
        'move-origin2d': './examples/2d/move-origin/main.js',
        hierarchical2d: './examples/2d/hierarchical/main.js',
        test3d: './3d/test.js',
        'scene-graph': './scene-graph/js/main.js',
        ogv: './ogv/main.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist'
    },
    module: {
        loaders: [
            {
                test: /\.(glsl|vs|fs)$/,
                loader: 'shader'
            }
        ]
    },
    glsl: {
        chunkPath: './glsl/chunks'
    }
};
