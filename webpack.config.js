module.exports = {
    entry: {
        bundle: './js/main.js',
        translation2D: './examples/2d/translation/main.js'
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
