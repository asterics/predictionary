import itemFactory from "./itemFactory.mjs";

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

    thiz.predict = function (input, options) {
        input = input || '';
        options = options || {}; //maxPredicitons, predictionMinDepth, predictionMaxDepth, compareFn
        if (!_lastPredictionInput || input.indexOf(_lastPredictionInput) !== 0) {
            _predictionCache = [];
            Object.keys(_dict).forEach(key => {
                if (key.toLowerCase().indexOf(input.toLowerCase()) === 0) {
                    _predictionCache.push(_dict[key]);
                }
            });
        }
        if (_predictionCache.length === 0 && input !== '') {
            return thiz.predict(input.substring(0, input.length - 1), options);
        }
        _lastPredictionInput = input;
        return _predictionCache.map(element => {
            return {
                word: element.w,
                score: element.f
            };
        });
    };

    thiz.refine = function (chosenWord, previousWord, addIfNotExisting) {
        if (!chosenWord || (!thiz.contains(chosenWord) && !addIfNotExisting)) {
            return;
        }
        if (addIfNotExisting && chosenWord && !thiz.contains(chosenWord)) {
            thiz.addWord(chosenWord);
        }
        if (addIfNotExisting && previousWord && !thiz.contains(previousWord)) {
            thiz.addWord(previousWord);
        }
        let chosenWordItem = _dict[chosenWord];
        chosenWordItem.f++;
        let previousWordItem = _dict[previousWord];
        if (previousWordItem) {
            if (previousWordItem.t[chosenWord]) {
                previousWordItem.t[chosenWord]++;
            } else {
                previousWordItem.t[chosenWord] = 1;
            }
        }
    };
}

export default Dictionary;