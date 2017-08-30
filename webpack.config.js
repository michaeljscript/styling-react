// production webpack config file
process.env.NODE_ENV = 'production';

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

module.exports = {
    context: __dirname,
    devtool: false,
    entry: path.join(__dirname, 'src', 'index.js'),
    output: {
        path: path.join(__dirname, 'src'),
        filename: 'build.min.js'
    },
    module: {
        loaders: [
            {
                test: /(\.js|\.jsx)$/,
                loader: 'babel-loader',
                query: {
                    presets: ['babel-preset-react', 'babel-preset-es2015'].map(require.resolve),
                    plugins: [
                        'babel-plugin-transform-es2015-destructuring',
                        'babel-plugin-transform-object-rest-spread'
                    ].map(require.resolve),
                }
            },
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader'].map(require.resolve)
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new UglifyJSPlugin()
    ],
};