const path = require("path");
const buildPath = path.resolve(__dirname, "dist");

const { DefinePlugin, IgnorePlugin } = require("webpack");
const RemoveFilesPlugin = require("remove-files-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const nodeExternals = require("webpack-node-externals");

const server = {
    entry: "./src/server/index.ts",
    cache: false,
    target: "node",
    node: {
        __dirname: true,
    },
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
        new DefinePlugin({ "global.GENTLY": false }),
        new RemoveFilesPlugin({
            before: {
                include: [path.resolve(buildPath, "server")],
            },
            watch: {
                include: [path.resolve(buildPath, "server")],
            },
        }),
        new IgnorePlugin({
            resourceRegExp: /^cardinal$/,
            contextRegExp: /./,
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
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
    watchOptions: {
        poll: true,
        ignored: ["**/node_modules", "**/ui"],
    },
    externals: [
        nodeExternals(),
        ({ context, request }, callback) => {
            const moduleList = {
                "@/natuna.config.js": "./natuna.config.js",
                "@/package.json": "./package.json",
            };

            if (moduleList[request]) {
                return callback(null, "commonjs " + moduleList[request]);
            }

            return callback();
        },
    ],
};

const client = {
    entry: "./src/client/index.ts",
    cache: false,
    target: "web",
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
        new RemoveFilesPlugin({
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
        minimizer: [new TerserPlugin()],
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
    watchOptions: {
        poll: true,
        ignored: ["**/node_modules", "**/ui"],
    },
};

module.exports = [server, client];
