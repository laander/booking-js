'use strict';

var webpack = require('webpack');

module.exports = {
    entry: './src/main.js',
    devtool: 'source-map',
    output: {
        path: './dist',
        filename: 'booking.js',
        libraryTarget: 'umd',
        library: 'TimekitBooking'
    },
    externals: {
        'jquery': 'jQuery'
    },
    module: {
        loaders: [
            { test: /\.html$/, loader: 'mustache' },
            { test: /\.css$/, loaders: ['style?singleton', 'css?minimize'] },
            { test: /\.scss$/, loaders: ['style?singleton', 'css?minimize', 'sass'] },
            { test: /\.svg$/, loader: 'svg-inline' }
        ]
    },
    plugins: [
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-gb/)
    ]
};
