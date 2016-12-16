module.exports = {
    entry: {
        bundle: './js/main.js',
        translation2D: './examples/2d/translation/main.js',
        rotation2D: './examples/2d/rotation/main.js',
        scale2D: './examples/2d/scale/main.js'
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
