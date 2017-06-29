var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: './src/client/App.js',
    output: { 
        path: path.join(__dirname, 'dist/server/public/js'), 
        filename: 'idiot-box.js'
    },
    module: {
        loaders: [
            {
                test: /.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react'],
                    plugins: ['transform-class-properties', 'transform-object-rest-spread', ['import', { libraryName: 'antd' }]]
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({ // <-- key to reducing React's size
            'process.env': {
                'NODE_ENV': JSON.stringify('dev') // Change to 'production' to save space
            }
        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ]
};