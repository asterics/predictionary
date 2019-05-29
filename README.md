# Predictionary
JavaScript dictionary-based word prediction library with self-learning abilities.

# Installation and basic usage

## Include built script bundle
Drop the following into your page:

`<script src="https://unpkg.com/predictionary/dist/predictionary.min.js"></script>`

afterwards initialize and use Predictionary:

```
let predictionary = Predictionary.instance();
predictionary.addWords(['apple', 'apricot', 'banana']);
let suggestions = predictionary.predict('ap'); // == ['apple', 'apricot'];
```

## Use with npm
Install the package:

`npm install predictionary --save`


afterwards initialize and use Predictionary:

```
import Predictionary from 'predictionary'

let predictionary = new Predictionary();
predictionary.addWords(['apple', 'apricot', 'banana']);
let suggestions = predictionary.predict('ap'); // == ['apple', 'apricot'];
```

# Demo
See working demo: [to live demo](https://asterics.github.io/predictionary/demo/)

# API Documentation
see full API documentation: [to API documentation](https://asterics.github.io/predictionary/docs/Predictionary.html)

# Acknowledgements
Word lists for demos are taken from http://corpus.leeds.ac.uk/list.html - thanks!
