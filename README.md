# Predictionary
JavaScript dictionary-based word prediction library with self-learning abilities.

## Installation
Drop the following into your page:

`<script src="https://unpkg.com/predictionary/dist/predictionary.min.js"></script>`

or install the package via npm:

`npm install predictionary --save`


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
Word lists for demos are taken from http://corpus.leeds.ac.uk/list.html - thanks!
