const path = require('path');
const webapck = require("webpack");

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'WThree.bundle.js',
        libraryTarget: "umd",
        libraryExport: 'default'
    },
    plugins: [
        new webapck.ProvidePlugin({
            THREE: 'three',
            TWEEN: '@tweenjs/tween.js',
            OrbitControls: 'three-orbitcontrols'
        }),
    ]
};
