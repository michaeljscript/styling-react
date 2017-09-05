const webpack = require('webpack');
const path = require('path');

const createEntries = (names) => {
    const result = {};
    names.forEach(name => result[name] = `./src/simple/${name}.js`);
    return result;
}

module.exports = {
    context: __dirname,
    devtool: false,
    entry: createEntries(['styled-components', 'css', 'radium', 'sass', 'glamorous']),
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