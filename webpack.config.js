// production webpack config file
process.env.NODE_ENV = '"production"';

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const createEntries = (names) => {
    const result = {};
    names.forEach(name => result[name] = path.join(__dirname, 'src', name, 'index.js'));
    return result;
};

const entries = {
    ...createEntries(['styled-components', 'glamorous', 'radium', 'sass', 'css']),
};

const output = {
    path: path.join(__dirname, "./src/"),
    filename: "./[name]/build.min.js"
};


module.exports = {
    context: __dirname,
    devtool: false,
    entry: entries,
    output,
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
                loaders: ['style-loader', 'css-loader'].map(require.resolve)
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new UglifyJSPlugin()
    ],
};