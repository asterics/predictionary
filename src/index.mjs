import Dictionary from "./dictionary.mjs";

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
    if (!_dicts[dictionaryKey] || !element) {
        throw 'dictionary not existing or word to add not specified.';
    }
    let dict = _dicts[dictionaryKey];
    if (typeof element === 'string') {
        dict.addWord(element);
    } else if (element.word && typeof element.word === 'string') {
        dict.addWord(element.word, element.frequency);
    }
};

predictionary.predict = function (input, options) {
    let predictions = [];
    options = options || {};
    Object.keys(_dicts).forEach(key => {
        let dict = _dicts[key];
        predictions = predictions.concat(dict.predict(input, options));
    });
    predictions.sort((a, b) => {
        if (a.score === b.score) {
            return 0;
        }
        return (a.score < b.score) ? 1 : -1
    });
    let returnArray = predictions;
    if (options.maxPredicitons) {
        returnArray = predictions.slice(0, options.maxPredicitons);
    }
    return returnArray.map(prediction => prediction.word);
};

predictionary.refineDictionaries = function (chosenWord, previousWord, addToDictionaryKey) {
    Object.keys(_dicts).forEach(key => {
        let dict = _dicts[key];
        dict.refine(chosenWord, previousWord, addToDictionaryKey === key);
    });
};


export default predictionary;