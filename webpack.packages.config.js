// production webpack config file
process.env.NODE_ENV = '"production"';

const webpack = require('webpack');
const path = require('path');

module.exports = {
    context: __dirname,
    devtool: false,
    entry: {
        'styled-components': './src/simple/styled-components.js',
        css: './src/simple/css.js',
        radium: './src/simple/radium.js',
        sass: './src/simple/sass.js',
        glamorous: './src/simple/glamorous.js',
    },
    output: {
        path: path.join(__dirname, './src/'),
        filename: './simple/simple.[name].build.min.js'
    },
    externals: [
        {
            "react": {
                root: "React",
                commonjs2: "react",
                commonjs: "react",
                amd: "react"
            }
        }
    ],
    module: {
        loaders: [
            {
                test: /(\.js|\.jsx)$/,
                loader: 'babel-loader',
                query: {}
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
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
    ],
};