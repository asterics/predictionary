# Predictionary
JavaScript dictionary-based word prediction library with self-learning abilities.

## Installation
Drop the following into your page:

```html
<script src="https://unpkg.com/predictionary/dist/predictionary.min.js"></script>
```

or install the package via npm:

```
npm install predictionary --save
```

*Note:* to use inside a nodejs application use the flag `--experimental-modules` in order to be able to use Predictionary which is written as ES6 module. See [nodejs demo](https://github.com/asterics/predictionary/blob/master/demo/node-demo/app.mjs) which can be run with:

`node --experimental-modules demo/node-demo/app.mjs`

## Basic usage
Minimum working example for basic usage:

```javascript
import Predictionary from 'predictionary' //only if installed via npm

let predictionary = Predictionary.instance();
predictionary.addWords(['apple', 'apricot', 'banana']);
let suggestions = predictionary.predict('ap'); // == ['apple', 'apricot'];
```

## Demo
See working demo: [to live demo](https://asterics.github.io/predictionary/demo/)

## API Documentation
see full API documentation: [to API documentation](https://asterics.github.io/predictionary/docs/Predictionary.html)

## Acknowledgements
Word lists for demos are taken from the Centre for Translation Studies, University of Leeds, see http://corpus.leeds.ac.uk/list.html - thanks!
