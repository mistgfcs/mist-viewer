const path = require('path');


// const main = {
//     target: 'electron-main',
//     entry: './main.js',
//     cache: true,
//     mode: 'development', // "production" | "development" | "none"
//     devtool: 'source-map',
//     output: {
//         path: path.join(__dirname, 'dist'),
//         filename: 'main.js'
//     },
//     module: {
//         rules: [{
//             test: /\.tsx?$/,
//             use: 'ts-loader'
//         }, {
//             test: /\.tsx?$/,
//             enforce: 'pre',
//             loader: 'tslint-loader',
//             options: {
//                 configFile: './tslint.json',
//                 typeCheck: true,
//             },
//         }],
//     },
//     resolve: {
//         extensions: [
//             '.ts',
//             '.tsx',
//             '.js',
//         ]
//     },
// }

const preload = {
    target: 'electron-preload',
    entry: './preload.ts',
    cache: true,
    mode: 'development', // "production" | "development" | "none"
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'preload.js'
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader'
        }, {
            test: /\.tsx?$/,
            enforce: 'pre',
            loader: 'tslint-loader',
            options: {
                configFile: './tslint.json',
                typeCheck: true,
            },
        }],
    },
    resolve: {
        extensions: [
            '.ts',
            '.tsx',
            '.js',
        ]
    },
}

const renderer = {
    target: 'web',
    entry: './app/index.tsx',
    cache: true,
    mode: 'development', // "production" | "development" | "none"
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'index.js'
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader'
        }, {
            test: /\.tsx?$/,
            enforce: 'pre',
            loader: 'tslint-loader',
            options: {
                configFile: './tslint.json',
                typeCheck: true,
            },
        }, {
            test: /\.css/,
            use: [
                "style-loader",
                {
                    loader: "css-loader",
                    options: { url: false }
                }
            ]
        }],
    },
    resolve: {
        extensions: [
            '.ts',
            '.tsx',
            '.js',
        ]
    },
}

module.exports = [
    // main,
    preload,
    renderer,
];