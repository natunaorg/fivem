const webpack = require("webpack");
const path = require("path");
const RemovePlugin = require("remove-files-webpack-plugin");

const buildPath = path.resolve(__dirname, "dist");

const server = {
    entry: "./src/server/main.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ["ts-loader"],
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({ "global.GENTLY": false }),
        new RemovePlugin({
            before: {
                include: [path.resolve(buildPath, "server")],
            },
            watch: {
                include: [path.resolve(buildPath, "server")],
            },
        }),
    ],
    optimization: {
        minimize: true,
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            "@": path.resolve(__dirname),
            "@server": path.resolve(__dirname, "src/server/"),
        },
    },
    output: {
        filename: "[contenthash].server.js",
        path: path.resolve(buildPath, "server"),
    },
    target: "node",
    node: {},
};

const client = {
    entry: "./src/client/main.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ["ts-loader"],
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new RemovePlugin({
            before: {
                include: [path.resolve(buildPath, "client")],
            },
            watch: {
                include: [path.resolve(buildPath, "client")],
            },
        }),
    ],
    optimization: {
        minimize: true,
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            "@client": path.resolve(__dirname, "src/client/"),
        },
    },
    output: {
        filename: "[contenthash].client.js",
        path: path.resolve(buildPath, "client"),
    },
};

module.exports = [server, client];
