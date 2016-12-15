module.exports = {
    entry: './js/main.js',
    output: {
        filename: 'bundle.js',
        path: './dist'
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
