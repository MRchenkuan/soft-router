
const path = require('path');

module.exports = {
    entry: path.resolve(__dirname,'src','main.js'),
    output: {
        filename: 'bundle.js',
        libraryTarget: "umd"
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }
    // mode: 'development'
};