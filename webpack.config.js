var path = require('path');

module.exports = env => {
    var buildDir = 'dist/';
    var entryScript = './src/index.mjs';
    var outputFilename = 'predictionary.min.js';
    var libraryName = 'Predictionary';
    var mode = env && env.production ? 'production' : 'development';

    return {
        mode: mode,
        entry: entryScript,
        output: {
            path: path.resolve(__dirname, buildDir),
            publicPath: buildDir,
            filename: outputFilename,
            library: libraryName,
            libraryTarget: 'var'
        },
        module: {
            rules: [{
                test: /\.mjs$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['env', {
                                modules: false,
                                useBuiltIns: true,
                                targets: {
                                    browsers: [
                                        '> 1%',
                                        'last 2 versions',
                                        'Firefox ESR'
                                    ],
                                },
                            }],
                        ],
                    },
                },
            }
            ],
        }
    };
};