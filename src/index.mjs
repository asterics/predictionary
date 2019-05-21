import Dictionary from "./dictionary";

let predictionary = {};

let _dicts = {};

predictionary.loadDictionary = function (dictionaryKey, dictionaryJSON) {
    if (!dictionaryKey || !dictionaryJSON) {
        throw 'dictionaryKey and dictionaryJSON must be specified.';
    }
    let dictionary = new Dictionary();
    dictionary.load(dictionaryJSON);
    _dicts[dictionaryKey] = dictionary;
};

predictionary.loadDictionaries = function (dictionariesJSON) {
    throw 'not yet implemented.';
};

predictionary.dictionaryToJSON = function (dictionaryKey) {
    let dict = _dicts[dictionaryKey];
    return dict ? dict.toJSON() : null;
};

predictionary.dictionariesToJSON = function () {
    throw 'not yet implemented.';
};

predictionary.useDictionaries = function (dictionaryKeys) {
    throw 'not yet implemented.';
};

predictionary.addDictionary = function (dictionaryKey, words) {
    if (!dictionaryKey) {
        throw 'dictionaryKey must be specified.';
    }
    _dicts[dictionaryKey] = new Dictionary();
    if (words && words instanceof Array) {
        words.forEach(element => {
            predictionary.addWord(dictionaryKey, element);
        });
    }
};

predictionary.addWord = function (dictionaryKey, element) {
    if (!_dicts[dictionaryKey] || !word) {
        throw 'dictionary not existing or word to add not specified.';
    }
    let dict = _dicts[dictionaryKey];
    if (typeof element === 'string') {
        dict.addWord(element);
    } else if (element.word && typeof element.word === 'string') {
        dict.addWord(element.word, element.frequency);
    }
};

predictionary.predict = function (input, numberOfPredictions, predictionMinDepth, predictionMaxDepth, compareFn) {
    let predictions = [];
    Object.keys(_dicts).forEach(key => {
        let dict = _dicts[key];
        predictions = predictions.concat(dict.predict(input, numberOfPredictions, predictionMinDepth, predictionMaxDepth, compareFn));
    });
    predictions.sort((a, b) => (a.score > b.score) ? 1 : -1);
    return predictions.slice(0, numberOfPredictions).map(prediction => prediction.word);
};

predictionary.refineDictionaries = function (chosenWord, previousWord) {
    Object.keys(_dicts).forEach(key => {
        let dict = _dicts[key];
        dict.refine(chosenWord, previousWord);
    });
};


export default predictionary;