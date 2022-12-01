var path = require("path");
var webpack = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;

module.exports = {
    entry: "./src/client/App.js",
    output: {
        path: path.join(__dirname, "dist/server/public/js/idiotbox"),
        filename: "idiotbox.build.js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/env", "@babel/react"],
                    },
                },
            },
        ],
    },
    externals: {
        lodash: "_",
        immutable: "Immutable",
        moment: "moment",
        react: "React",
        "react-dom": "ReactDOM",
        "@mui/material": "MaterialUI",
    },
    plugins: [
        /**
         * Bundle Analyzer will load a browser window to view the map.
         */
        //new BundleAnalyzerPlugin(),
    ],
};
