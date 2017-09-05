const webpack = require('webpack');
const path = require('path');

const createEntries = (names) => {
    const result = {};
    names.forEach(name => result[name] = path.join(__dirname, 'src', name, 'index.js'));
    return result;
};

module.exports = {
    context: __dirname,
    devtool: false,
    entry: createEntries(['styled-components', 'glamorous', 'radium', 'sass', 'css', 'inline']),
    output: {
        path: path.join(__dirname, './src/'),
        filename: './[name]/build.min.js'
    },
    externals: [],
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
                    ].map(require.resolve)
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