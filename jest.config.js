module.exports = {
    "verbose": true,
        "transform": {
        "^.+\\.(js|mjs)": "babel-jest",
    },
    "globals": {
        "NODE_ENV": "test"
    },
    "moduleFileExtensions": [
        "js",
        "mjs"
    ],
        "moduleDirectories": [
        "src", "node_modules"
    ]
};