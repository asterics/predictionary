import Dictionary from "./dictionary.mjs";

let INBETWEEN_CHARS_REGEX = "[\\s\\.\\?!]";
let SENTENCE_END_CHARS_REGEX = "[\\.\\?!]";

function Predictionary() {
    let thiz = this;
    thiz.DEFAULT_DICTIONARY_KEY = 'DEFAULT_DICTIONARY_KEY';
    let PREDICT_METHOD_COMPLETE_WORD = 'PREDICT_METHOD_COMPLETE_WORD';
    let PREDICT_METHOD_NEXT_WORD = 'PREDICT_METHOD_NEXT_WORD';
    let _dicts = {};

    thiz.loadDictionary = function (dictionaryJSON, dictionaryKey) {
        if (!dictionaryJSON) {
            throw 'dictionaryJSON must be specified.';
        }
        dictionaryKey = dictionaryKey || thiz.DEFAULT_DICTIONARY_KEY;
        let dictionary = new Dictionary();
        dictionary.load(dictionaryJSON);
        _dicts[dictionaryKey] = dictionary;
    };

    thiz.loadDictionaries = function (dictionariesJSON) {
        if (!dictionariesJSON) {
            throw 'dictionariesJSON must be specified.';
        }
        _dicts = {};
        let list = JSON.parse(dictionariesJSON);
        list.forEach(element => {
            thiz.loadDictionary(element.json, element.key);
        })
    };

    thiz.dictionaryToJSON = function (dictionaryKey) {
        dictionaryKey = dictionaryKey || thiz.DEFAULT_DICTIONARY_KEY;
        let dict = _dicts[dictionaryKey];
        return dict ? dict.toJSON() : null;
    };

    thiz.dictionariesToJSON = function () {
        let list = [];
        Object.keys(_dicts).forEach(key => {
            list.push({
                key: key,
                json: _dicts[key].toJSON()
            })
        });
        return JSON.stringify(list);
    };

    thiz.useDictionary = function (dictionaryKey) {
        if (!dictionaryKey) {
            throw 'dictionaryKey must be specified.';
        }
        Object.keys(_dicts).forEach(key => {
            _dicts[key].disabled = dictionaryKey !== key;
        });
    };

    thiz.useDictionaries = function (dictionaryKeys) {
        if (!(dictionaryKeys instanceof Array)) {
            throw 'dictionaryKeys must be specified and of type Array.';
        }
        Object.keys(_dicts).forEach(key => {
            _dicts[key].disabled = !dictionaryKeys.includes(key);
        });
    };

    thiz.useAllDictionaries = function () {
        Object.keys(_dicts).forEach(key => {
            _dicts[key].disabled = false;
        });
    };

    thiz.addDictionary = function (dictionaryKey, words) {
        if (!dictionaryKey && _dicts[thiz.DEFAULT_DICTIONARY_KEY]) {
            throw 'dictionaryKey must be specified.';
        }
        dictionaryKey = dictionaryKey || thiz.DEFAULT_DICTIONARY_KEY;
        if (_dicts[dictionaryKey]) {
            throw 'dictionary already existing.';
        }
        _dicts[dictionaryKey] = new Dictionary();
        if (words && words instanceof Array) {
            words.forEach(element => {
                thiz.addWord(element, dictionaryKey);
            });
        }
    };

    thiz.addWord = function (element, dictionaryKey) {
        dictionaryKey = dictionaryKey || thiz.DEFAULT_DICTIONARY_KEY;
        if (!element) {
            throw 'element to add not specified.';
        }
        if (!_dicts[dictionaryKey]) {
            thiz.addDictionary(dictionaryKey);
        }
        let dict = _dicts[dictionaryKey];
        if (typeof element === 'string') {
            dict.addWord(element.trim());
        } else if (element.word && typeof element.word === 'string') {
            dict.addWord(element.word.trim(), element.rank);
        }
    };

    thiz.addWords = function (elements, dictionaryKey) {
        if (!(elements instanceof Array)) {
            throw 'elements to add must be instance of array specified.';
        }
        elements.forEach(element => {
            thiz.addWord(element, dictionaryKey);
        })
    };

    thiz.importWords = function (importString, options) {
        options = options || {};
        let elementSeparator = options.elementSeparator || ';';
        let rankSeparator = options.rankSeparator || ' ';
        let wordPosition = options.wordPosition || 0;
        let rankPosition = options.rankPosition;
        let addToDictionary = options.addToDictionary || thiz.DEFAULT_DICTIONARY_KEY;

        let lines = importString.split(elementSeparator);
        lines.forEach(line => {
            let elems = line.split(rankSeparator);
            let rank = parseInt(elems[rankPosition]);
            if (elems[wordPosition]) {
                let elementToAdd = {
                    word: elems[wordPosition].trim()
                };
                if (!isNaN(rank)) {
                    elementToAdd.rank = rank;
                }
                thiz.addWord(elementToAdd, addToDictionary);
            }
        });
    };

    thiz.predict = function (input, options) {
        return predictInternal(input, options);
    };

    thiz.predictCompleteWord = function (input, options) {
        return predictInternal(input, options, PREDICT_METHOD_COMPLETE_WORD);
    };

    thiz.predictNextWord = function (input, options) {
        return predictInternal(input, options, PREDICT_METHOD_NEXT_WORD);
    };

    thiz.applyPrediction = function (input, chosenPrediction, options) {
        options = options || {};
        let addToDictionary = options.addToDictionary || (thiz.isUsingOnlyDefaultDictionary() ? thiz.DEFAULT_DICTIONARY_KEY : null);
        let shouldCompleteLastWord = options.shouldCompleteLastWord !== undefined ? options.shouldCompleteLastWord : !isLastWordCompleted(input);
        let dontRefine = options.dontRefine;
        let lastWord = getLastWord(input);
        let preLastWord = getLastWord(input, 2);
        let temp = shouldCompleteLastWord ? input.substring(0, input.lastIndexOf(lastWord)) : input;
        if (temp.length > 0 && (!isLastWordCompleted(temp) || new RegExp(SENTENCE_END_CHARS_REGEX).test(temp[temp.length - 1]))) {
            temp += ' ';
        }
        if (!dontRefine) {
            thiz.refineDictionaries(chosenPrediction, !shouldCompleteLastWord ? lastWord : preLastWord, addToDictionary);
        }
        return temp + chosenPrediction + ' ';
    };

    thiz.refineDictionaries = function (chosenWord, previousWord, addToDictionary) {
        addToDictionary = addToDictionary === true ? thiz.DEFAULT_DICTIONARY_KEY : addToDictionary;
        Object.keys(_dicts).forEach(key => {
            let dict = _dicts[key];
            if (!dict.disabled) {
                dict.refine(chosenWord, previousWord, addToDictionary === key);
            }
        });
    };

    thiz.getDictionaryKeys = function () {
        return Object.keys(_dicts);
    };

    thiz.isUsingOnlyDefaultDictionary = function () {
        let keys = thiz.getDictionaryKeys();
        return keys.length === 0 || (keys.length === 1 && keys[0] === thiz.DEFAULT_DICTIONARY_KEY);
    };

    function predictInternal(input, options, predictType) {
        let predictions = [];
        options = options || {};
        Object.keys(_dicts).forEach(key => {
            let dict = _dicts[key];
            if (!dict.disabled) {
                let predictFn = predictType === PREDICT_METHOD_NEXT_WORD ? dict.predictNextWord : (predictType === PREDICT_METHOD_COMPLETE_WORD ? dict.predictCompleteWord : null);
                predictFn = predictFn || (isLastWordCompleted(input) ? dict.predictNextWord : dict.predictCompleteWord);
                predictions = predictions.concat(predictFn(getLastWord(input), options));
            }
        });
        predictions.sort((a, b) => {
            if (a.fuzzyMatch !== b.fuzzyMatch) {
                return a.fuzzyMatch ? 1 : -1;
            }
            if (a.frequency !== b.frequency) {
                return (a.frequency < b.frequency) ? 1 : -1;
            }
            if (a.rank !== b.rank) {
                if (a.rank && b.rank === undefined) return -1;
                if (b.rank && a.rank === undefined) return 1;
                return (a.rank < b.rank) ? -1 : 1
            }
            return 0;
        });
        let returnArray = predictions;
        if (options.maxPredicitons) {
            returnArray = predictions.slice(0, options.maxPredicitons);
        }
        return getUnique(returnArray, 'word').map(prediction => prediction.word);
    }
}

function getLastWord(text, index) {
    index = index || 1;
    let words = text.trim().split(new RegExp(INBETWEEN_CHARS_REGEX)).filter(word => !!word);
    let returnWord = words[words.length - index] || '';
    return returnWord.replace(new RegExp(INBETWEEN_CHARS_REGEX, 'g'), '');
}

function isLastWordCompleted(text) {
    return new RegExp(INBETWEEN_CHARS_REGEX).test(text[text.length - 1]);
}

function getUnique(array, compareKey) {

    let unique = array
        .map(e => e[compareKey])

        // store the keys of the unique objects
        .map((e, i, final) => final.indexOf(e) === i && i)

        // eliminate the dead keys & store unique objects
        .filter(e => array[e]).map(e => array[e]);

    return unique;
}

export default Predictionary;

export function instance() {
    return new Predictionary();
}