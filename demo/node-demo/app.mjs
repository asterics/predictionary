import * as Path from 'path' //<-- instead of require('path'), other common modules now also have to be imported with ES6 syntax
import Predictionary from '../../src/index.mjs'

let predictionary = Predictionary.instance();
predictionary.addWords(['apple', 'apricot', 'banana']);
let suggestions = predictionary.predict('ap'); // == ['apple', 'apricot'];
console.log(suggestions);
console.log(Path.default.extname('index.html'));