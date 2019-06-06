import Dictionary from "./dictionary.mjs";

let INBETWEEN_CHARS_REGEX = "[\\s\\.\\?!,]";
let PHRASE_END_CHARS_REGEX = "[\\.\\?!,]";
let SENTENCE_END_CHARS_REGEX = "[\\.\\?!]";

/**
 * Constructs a Predictionary word prediction class. It's possible to manage multiple internal dictionaries, retrieve predictions
 * (suggestions) for a given input and learn/refine the dictionaries from user input.
 *
 * @constructor
 */
function Predictionary() {
    /**
     * Default dictionary key, if no key is specified.
     * @type {string}
     */
    this.DEFAULT_DICTIONARY_KEY = 'DEFAULT_DICTIONARY_KEY';

    let thiz = this;
    let PREDICT_METHOD_COMPLETE_WORD = 'PREDICT_METHOD_COMPLETE_WORD';
    let PREDICT_METHOD_NEXT_WORD = 'PREDICT_METHOD_NEXT_WORD';
    let _dicts = {};
    let _lastChosenWord = null;

    /**
     * Loads a single dictionary from a JSON string that was previously exported by {@link Predictionary#dictionaryToJSON}.
     * If the given dictionaryKey already exists, the existing dictionary is replaced.
     *
     * @param {string} dictionaryJSON json string representing a dictionary, exported by {@link Predictionary#dictionaryToJSON}
     * @param {string} [dictionaryKey={@link Predictionary#DEFAULT_DICTIONARY_KEY}] the key for which the dictionary should
     *         be imported.
     */
    this.loadDictionary = function (dictionaryJSON, dictionaryKey) {
        if (!dictionaryJSON) {
            throw 'dictionaryJSON must be specified.';
        }
        dictionaryKey = dictionaryKey || thiz.DEFAULT_DICTIONARY_KEY;
        let dictionary = new Dictionary();
        dictionary.load(dictionaryJSON);
        _dicts[dictionaryKey] = dictionary;
    };

    /**
     * Loads all dictionaries from a JSON string that was previously exported by {@link Predictionary#dictionariesToJSON}.
     * This method replaces/deletes all currently loaded dictionaries!
     * @param {string} dictionariesJSON json string representing dictionaries, exported by {@link Predictionary#dictionariesToJSON}
     */
    this.loadDictionaries = function (dictionariesJSON) {
        if (!dictionariesJSON) {
            throw 'dictionariesJSON must be specified.';
        }
        _dicts = {};
        let list = JSON.parse(dictionariesJSON);
        list.forEach(element => {
            thiz.loadDictionary(element.json, element.key);
        })
    };

    /**
     * Exports a single dictionary to a JSON string. Subsequently the dictionary can be imported using the resulting string
     * and {@link Predictionary#loadDictionary}.
     *
     * @param {string} [dictionaryKey={@link Predictionary#DEFAULT_DICTIONARY_KEY}] the key of the dictionary to export.
     * @return {string} JSON string representing the currently loaded dictionary with specified dictionaryKey.
     */
    this.dictionaryToJSON = function (dictionaryKey) {
        dictionaryKey = dictionaryKey || thiz.DEFAULT_DICTIONARY_KEY;
        let dict = _dicts[dictionaryKey];
        return dict ? dict.toJSON() : null;
    };

    /**
     * Exports all dictionaries to a JSON string. Subsequently the dictionaries can be imported using the resulting string
     * and {@link Predictionary#loadDictionaries}.
     *
     * @return {string} JSON string representing all currently loaded dictionaries.
     */
    this.dictionariesToJSON = function () {
        let list = [];
        Object.keys(_dicts).forEach(key => {
            list.push({
                key: key,
                json: _dicts[key].toJSON()
            })
        });
        return JSON.stringify(list);
    };

    /**
     * Use only a singe loaded dictionary for predictions.
     *
     * @param {string} dictionaryKey the key of the dictionary to use
     */
    this.useDictionary = function (dictionaryKey) {
        if (!dictionaryKey) {
            throw 'dictionaryKey must be specified.';
        }
        Object.keys(_dicts).forEach(key => {
            _dicts[key].disabled = dictionaryKey !== key;
        });
    };

    /**
     * Use a set of dictionaries for predictions, specified by an array of dictionaryKeys.
     *
     * @param {Array} dictionaryKeys an array of strings, specifying the dictionaryKeys to use
     */
    this.useDictionaries = function (dictionaryKeys) {
        if (!(dictionaryKeys instanceof Array)) {
            throw 'dictionaryKeys must be specified and of type Array.';
        }
        Object.keys(_dicts).forEach(key => {
            _dicts[key].disabled = dictionaryKeys.indexOf(key) === -1 && key !== thiz.DEFAULT_DICTIONARY_KEY;
        });
    };

    /**
     * Use all currently loaded dictionaries for predictions.
     */
    this.useAllDictionaries = function () {
        Object.keys(_dicts).forEach(key => {
            _dicts[key].disabled = false;
        });
    };

    /**
     * Add a new internal dictionary for predictions.
     *
     * @param {string} dictionaryKey the key of the dictionary to add
     * @param {Array} [words] Optional array of words (string) that should be added to the new dictionary.
     */
    this.addDictionary = function (dictionaryKey, words) {
        if (!dictionaryKey) {
            throw 'dictionaryKey must be specified.';
        }
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

    /**
     * Add a single new word/element to a dictionary.
     *
     * @param {string|Object} element the element to add, can be either a plain word as a string or an object containing
     *        the properties object.word (word to add as string) and object.rank (number specifying the rank of the word,
     *        a lower rank causes the word to be ranked to front as a suggestion).
     * @param {string} [dictionaryKey={@link Predictionary#DEFAULT_DICTIONARY_KEY}] optional key of the dictionary to add the element.
     */
    this.addWord = function (element, dictionaryKey) {
        dictionaryKey = dictionaryKey || thiz.DEFAULT_DICTIONARY_KEY;
        if (!element) {
            throw 'element to add not specified.';
        }
        if (!_dicts[dictionaryKey]) {
            thiz.addDictionary(dictionaryKey);
        }
        let dict = _dicts[dictionaryKey];
        if (typeof element === 'string') {
            dict.addWord(sanitize(element));
        } else if (element.word && typeof element.word === 'string') {
            dict.addWord(sanitize(element.word), element.rank);
        }
    };

    /**
     * Add multiple new words/elements to a dictionary.
     *
     * @param {string|Object} elements the elements to add, can be an Array of either plain words (string) or of objects containing
     *        the properties object.word (word to add as string) and object.rank (number specifying the rank of the word,
     *        a lower rank causes the word to be ranked to front as a suggestion).
     * @param {string} [dictionaryKey={@link Predictionary#DEFAULT_DICTIONARY_KEY}] optional key of the dictionary to add the element.
     */
    this.addWords = function (elements, dictionaryKey) {
        if (!(elements instanceof Array)) {
            throw 'elements to add must be instance of array specified.';
        }
        elements.forEach(element => {
            thiz.addWord(element, dictionaryKey);
        })
    };

    /**
     * Deletes a single word from one or all dictionaries.
     *
     * @param {string} inputOrWord a single word or longer string where the last word will be deleted in the dictionaries.
     * @param {Object} [options] Object for options
     * @param {string} [options.dictionaryKey] the key of the dictionary where the word should be deleted. If not
     *        specified the word is deleted in all dictionaries.
     * @param {string} [options.ignoreCase] if false or undefined (default) only words with matching cases are
     *        deleted, otherwise also words with non-matching case.
     */
    this.delete = function (inputOrWord, options) {
        let word = getLastWord(inputOrWord);
        options = options || {};
        if (word) {
            if (!options.dictionaryKey) {
                thiz.getDictionaryKeys().forEach(key => {
                    _dicts[key].deleteWord(word, options.ignoreCase);
                });
            } else if (_dicts[options.dictionaryKey]) {
                _dicts[options.dictionaryKey].deleteWord(word, options.ignoreCase);
            }
        }
    };

    /**
     * Import words from a plain string (e.g. text file).
     *
     * @param {string} importString a plain text string (e.g. from a text file)
     * @param {Object} [options] options object containing additional properties. The default properties are suited for
     *        a plain text string in format: "word1;word2;word3;...", setting rankPosition=1 would be suited for
     *        a plain text in format: "word1 rank1;word2 rank2;word3 rank3;...".
     * @param {string} [options.elementSeparator=;] separator to split the elements from the importString
     * @param {string} [options.rankSeparator=<space>] separator to split a single element into word and rank
     * @param {string} [options.wordPosition=0] position of the word in the element (0-based)
     * @param {string} [options.rankPosition] position of the rank in the element (0-based)
     * @param {string} [options.addToDictionary={@link Predictionary#DEFAULT_DICTIONARY_KEY}] key of the dictionary where
     *        the words should be added.
     */
    this.parseWords = function (importString, options) {
        options = options || {};
        let elementSeparator = options.elementSeparator || ';';
        let rankSeparator = options.rankSeparator || ' ';
        let wordPosition = options.wordPosition || 0;
        let wordPosition2 = options.wordPosition2;
        let rankPosition = options.rankPosition;
        let addToDictionary = options.addToDictionary || thiz.DEFAULT_DICTIONARY_KEY;

        let lines = importString.split(elementSeparator);
        lines.forEach(line => {
            let elems = line.split(rankSeparator);
            let rank = parseInt(elems[rankPosition]);
            if (wordPosition !== undefined && wordPosition2 !== undefined) {
                let word1 = elems[wordPosition];
                let word2 = elems[wordPosition2];
                if (word1 && word2) {
                    thiz.learn(word2, word1, addToDictionary);
                }
            } else if (elems[wordPosition]) {
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

    /**
     * Retrieves saved words of a single or all loaded dictionaries.
     *
     * @param {string} [dictionaryKey] key of the dictionary from which the words should be retrieved, if not set all
     *        dictionaries are used.
     * @return {string[]} array of saved words (string) for the dictionary with the given key.
     */
    this.getWords = function (dictionaryKey) {
        let words = [];
        if (!dictionaryKey) {
            thiz.getDictionaryKeys().forEach(key => {
                words = words.concat(_dicts[key].getWords())
            });
        } else if (_dicts[dictionaryKey]) {
            words = _dicts[dictionaryKey].getWords();
        }
        return words;
    };

    /**
     * Test if a given word exists a single or all loaded dictionaries.
     *
     * @param {string} word to test if existing
     * @param {string} [dictionaryKey] key of the dictionary to check, if not set all dictionaries are used
     * @param {boolean} [matchCase] if set (true) the word is searched case-sensitive, otherwise case-insensitive (default)
     * @return {boolean} true if the given word is existing
     */
    this.hasWord = function (word, dictionaryKey, matchCase) {
        let allElementsString = " " + thiz.getWords(dictionaryKey).join(" ") + " ";
        let flag = matchCase ? "" : "i";
        return new RegExp(" " + word + " ", flag).test(allElementsString);
    };

    /**
     * Returns word suggestions for a given input. Automatically detects if the last word should be completed (last
     * character is not space) or if a next word should be suggested (last character is space).
     *
     * @param {string} input string for which the predictions should be calculated, e.g. the value of a text input
     *        where the user is typing.
     * @param {Object} [options] options object containing additional properties.
     * @param {number} [options.maxPredictions=10] number of suggestions that should be retrieved maximally //TODO maxPredictions
     * @param {boolean} [options.applyToInput] if true the suggestions are applied to the original input before being returned
     * @return {string[]} list of words that are predictions/suggestions for the given input, ordered by relevance.
     */
    this.predict = function (input, options) {
        return predictInternal(input, options);
    };

    /**
     * Returns word suggestions for a given input. Last word is assumed to be incomplete and has to be completed.
     *
     * @param {string} input string for which the predictions should be calculated, e.g. the value of a text input
     *        where the user is typing.
     * @param {Object} [options] options object containing additional properties.
     * @param {number} [options.maxPredictions=10] number of suggestions that should be retrieved maximally
     * @param {boolean} [options.applyToInput] if true the suggestions are applied to the original input before being returned
     * @return {string[]} list of words that are predictions/suggestions for the given input, ordered by relevance.
     */
    this.predictCompleteWord = function (input, options) {
        return predictInternal(input, options, PREDICT_METHOD_COMPLETE_WORD);
    };

    /**
     * Returns word suggestions for a given input. Last word is assumed to be complete and suggestions for the next words
     * are calculated.
     *
     * @param {string} input string for which the predictions should be calculated, e.g. the value of a text input
     *        where the user is typing.
     * @param {Object} [options] options object containing additional properties.
     * @param {number} [options.maxPredictions=10] number of suggestions that should be retrieved maximally
     * @param {boolean} [options.applyToInput] if true the suggestions are applied to the original input before being returned
     * @return {string[]} list of words that are predictions/suggestions for the given input, ordered by relevance.
     */
    this.predictNextWord = function (input, options) {
        return predictInternal(input, options, PREDICT_METHOD_NEXT_WORD);
    };

    /**
     * Apply chosen suggestion to a given input, e.g. input = "this is an ap" and chosenPrediction = "Apple" results in
     * "this is an Apple". Calling this function automatically refines the saved frequency of the chosen word making it
     * more likely to be suggested in the future.
     *
     * @param {string} input the current input string (e.g. from textfield)
     * @param {string} chosenPrediction the chosen prediction which should be applied to the input string
     * @param {Object} [options] options object containing additional properties.
     * @param {string} [options.addToDictionary] the key of the dictionary where new learned words should be added. If not
     *        set the dictionary to add is automatically determined.
     * @param {number} [options.shouldCompleteLastWord] if true the last word is completed, if false the chosen prediction
     *        is added as new word. If not set this decision is done automatically (last character is space -> new word).
     * @param {boolean} [options.dontLearn] if true the chosen predictions are not added or their frequencies updated
     * @return {string} the given input with the applied suggestion
     */
    this.applyPrediction = function (input, chosenPrediction, options) {
        options = options || {};
        let addToDictionary = options.addToDictionary || (thiz.isUsingOnlyDefaultDictionary() ? thiz.DEFAULT_DICTIONARY_KEY : null);
        let shouldCompleteLastWord = options.shouldCompleteLastWord !== undefined ? options.shouldCompleteLastWord : !isLastWordCompleted(input);
        let dontLearn = options.dontLearn;
        let lastWord = getLastWord(input);
        let preLastWord = getLastWord(input, 2);
        let temp = shouldCompleteLastWord ? input.substring(0, input.lastIndexOf(lastWord)) : input;
        if (temp.length > 0 && (!isLastWordCompleted(temp) || new RegExp(PHRASE_END_CHARS_REGEX).test(temp[temp.length - 1]))) {
            temp += ' ';
        }
        if (!dontLearn) {
            thiz.learn(chosenPrediction, !shouldCompleteLastWord ? lastWord : preLastWord, addToDictionary);
        }
        return temp + chosenPrediction + ' ';
    };

    /**
     * Updates the frequencies for given words, making them to be more likely suggested in the future.
     *
     * @param {string} chosenWord a suggestion/word the user has chosen
     * @param {string} [previousWord] the previous word of the chosen suggestion
     * @param {string} [addToDictionary] the key of the dictionary where new words should be added. Automatically determined, if not specified.
     */
    this.learn = function (chosenWord, previousWord, addToDictionary) {
        chosenWord = sanitize(chosenWord);
        previousWord = sanitize(previousWord);
        let dictKeys = thiz.getDictionaryKeys(true);
        addToDictionary = dictKeys.length === 1 ? dictKeys[0] : addToDictionary;
        if (dictKeys.length > 0 && (!addToDictionary || !_dicts[addToDictionary])) {
            let currentHighscore = 0;
            dictKeys.forEach(key => {
                let score = 0;
                if (thiz.hasWord(chosenWord, key)) {
                    score += 2;
                }
                if (thiz.hasWord(previousWord, key)) {
                    score++;
                }
                if (score > 0 && score >= currentHighscore) {
                    currentHighscore = score;
                    addToDictionary = key;
                }
            });
        }
        addToDictionary = addToDictionary || thiz.DEFAULT_DICTIONARY_KEY;
        if (!_dicts[addToDictionary]) {
            thiz.addDictionary(addToDictionary);
        }
        Object.keys(_dicts).forEach(key => {
            let dict = _dicts[key];
            if (!dict.disabled) {
                dict.learn(chosenWord, previousWord, addToDictionary === key);
            }
        });
    };

    /**
     * Learns from input text while the user is typing. This method can be called with e.g. the value of a text input
     * field for every character the user is typing.
     *
     * @param {string} input the text string to learn with. The second last and third last words are learned.
     * @param {string} [dictionaryKey] the key of the dictionary where new words should be added. Automatically determined, if not specified.
     * @return {boolean} true if something was learned, false if not
     */
    this.learnFromInput = function (input, dictionaryKey) {
        if (isLastWordCompleted(input)) {
            let chosenWord = getLastWord(input, 2);
            let previousWord = getLastWord(input, 3);
            if (chosenWord && chosenWord !== _lastChosenWord) {
                _lastChosenWord = chosenWord;
                thiz.learn(chosenWord, previousWord, dictionaryKey);
                return true;
            }
        }
        return false;
    };

    /**
     * Learns words and transitions from a given text/phrase.
     *
     * @param {string} text the text to learn from
     * @param {string} [dictionaryKey={@link Predictionary#DEFAULT_DICTIONARY_KEY}] the key of the dictionary where the words should
     *         be learned/added.
     */
    this.learnFromText = function (text, dictionaryKey) {
        text = text.replace(/\s\s/g, ' ');
        let sentences = text.split(new RegExp(SENTENCE_END_CHARS_REGEX));
        sentences.forEach(sentence => {
            let words = sentence.split(' ');
            for (let i = 0; i < words.length - 1; i++) {
                this.learn(words[i + 1], words[i], dictionaryKey);
            }
        });
    };

    /**
     * Returns a list of currently loaded dictionary keys.
     *
     * @param {boolean} [onlyEnabled] if true only keys of dictionaries that are enabled are returned. See e.g.
     *        {@link Predictionary#useDictionaries}
     * @return {string[]}
     */
    this.getDictionaryKeys = function (onlyEnabled) {
        if (onlyEnabled) {
            return Object.keys(_dicts).filter(element => !_dicts[element].disabled);
        }
        return Object.keys(_dicts);
    };

    /**
     * Returns true if only the default dictionary is used (key {@link Predictionary#DEFAULT_DICTIONARY_KEY}).
     * @return {boolean}
     */
    this.isUsingOnlyDefaultDictionary = function () {
        let keys = thiz.getDictionaryKeys();
        return keys.length === 0 || (keys.length === 1 && keys[0] === thiz.DEFAULT_DICTIONARY_KEY);
    };

    function predictInternal(input, options, predictType) {
        let predictions = [];
        options = options || {};
        options.maxPredictions = options.maxPredictions || options.maxPredicitons || 10;
        options.applyToInput = options.applyToInput || false;
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
        let returnArray = [];
        for (let i = 0; i < predictions.length && returnArray.length < options.maxPredictions; i++) {
            if (returnArray.indexOf(predictions[i].word) === -1) { //de-duplicate
                if (options.applyToInput) {
                    returnArray.push(thiz.applyPrediction(input, predictions[i].word, {dontLearn: true}));
                } else {
                    returnArray.push(predictions[i].word);
                }
            }
        }
        return returnArray;
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

function sanitize(word) {
    word = word || '';
    return word.replace(/[^a-z0-9áéíóúñüäöß'`´’]/gim, '');
}

/**
 * Constructs a new instance of Predictionary
 *
 * @return {Predictionary}
 */
Predictionary.instance = function () {
    return new Predictionary();
};

export default Predictionary;

export function instance() {
    return new Predictionary();
}