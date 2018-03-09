var path = require("path");
var webpack = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;

module.exports = {
    devtool: "source-map",
    entry: "./src/client/App.js",
    output: {
        path: path.join(__dirname, "dist/server/public/js/idiotbox"),
        filename: "idiotbox.build.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["env", "react"],
                        plugins: [
                            "transform-class-properties",
                            "transform-object-rest-spread"
                        ]
                    }
                }
            }
        ]
    },
    externals: {
        react: "React",
        "react-dom": "ReactDOM",
        immutable: "Immutable",
        moment: "moment",
        lodash: "_",
        antd: "antd"
    },
    plugins: [new BundleAnalyzerPlugin()]
};
