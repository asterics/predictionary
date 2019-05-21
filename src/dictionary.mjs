import itemFactory from "./itemFactory";

function Dictionary() {
    let thiz = this;
    let _dict = {};
    let _predictionCache = [];
    let _lastPredictionInput = null;

    thiz.load = function (dictionaryJSON) {
        _dict = JSON.parse(dictionaryJSON);
    };

    thiz.toJSON = function () {
        return JSON.stringify(_dict);
    };

    thiz.addWord = function (word, frequency) {
        if (!word) {
            throw 'word to add must not be empty.';
        }
        if (!_dict[word]) {
            _dict[word] = itemFactory.createItem(word, frequency);
        }
    };

    thiz.addWords = function (words) {
        if (!(words instanceof Array) || words.length === 0) {
            throw 'words to add must be an array with at least one element.';
        }
        words.forEach(word => {
            thiz.addWord(word);
        });
    };

    thiz.contains = function (word) {
        return !!_dict[word];
    };

    thiz.predict = function (input, numberOfPredictions, predictionMinDepth, predictionMaxDepth, compareFn) {
        if (_lastPredictionInput && input.indexOf(_lastPredictionInput) === 0) {
            //TODO use _predictionCache
        }
        _predictionCache = [];
        Object.keys(_dict).forEach(key => {
            if (key.indexOf(input) === 0) {
                _predictionCache.push(_dict[key]);
            }
        });
        _predictionCache.sort((a, b) => (a.frequency > b.frequency) ? 1 : -1);
        return _predictionCache.slice(0, numberOfPredictions).map(element => {
            return {
                word: element.word,
                score: element.frequency
            };
        });
    };

    thiz.refine = function (chosenWord, previousWord) {
        if (!thiz.contains(chosenWord)) {
            return;
        }
        let chosenWordItem = _dict[chosenWord];
        chosenWordItem.frequency++;
        let previousWordItem = _dict[previousWord];
        if (previousWordItem) {
            if (previousWordItem.transitions[chosenWord]) {
                previousWordItem.transitions[chosenWord]++;
            } else {
                previousWordItem.transitions[chosenWord] = 1;
            }
        }
    };
}

export default Dictionary;