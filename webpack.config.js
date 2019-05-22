var path = require('path');

module.exports = env => {
    var buildDir = 'build/';
    var entryScript = './src/index.mjs';
    var outputFilename = 'predictionary.js';
    var mode = env && env.production ? 'production' : 'development';

    return {
        mode: mode,
        entry: entryScript,
        output: {
            path: path.resolve(__dirname, buildDir),
            publicPath: buildDir,
            filename: outputFilename
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