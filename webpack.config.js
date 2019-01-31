
const path = require('path');

module.exports = {
    entry: path.resolve(__dirname,'src','main.js'),
    output: {
        filename: 'dist/bundle.js'
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }
};