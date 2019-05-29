import itemFactory from "./itemFactory.mjs";

function Dictionary() {
    let thiz = this;
    let _dict = {};

    thiz.load = function (dictionaryJSON) {
        let importDict = JSON.parse(dictionaryJSON);
        Object.keys(importDict).forEach(key => {
            importDict[key].w = key;
        });
        _dict = importDict;
    };

    thiz.toJSON = function () {
        let copy = JSON.parse(JSON.stringify(_dict));
        Object.keys(copy).forEach(key => {
            delete copy[key].w;
        });
        return JSON.stringify(copy);
    };

    thiz.addWord = function (word, rank) {
        if (!word) {
            return;
        }
        if (!_dict[word]) {
            _dict[word] = itemFactory.createItem(word, rank);
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

    thiz.deleteWord = function (word, ignoreCase) {
        Object.keys(_dict).forEach(dictWord => {
            let equalWord = ignoreCase ? word.toUpperCase() === dictWord.toUpperCase() : word === dictWord;
            if (equalWord) {
                delete _dict[dictWord];
            } else {
                let dictElement = _dict[dictWord];
                Object.keys(dictElement.t).forEach(transistionWord => {
                    let equalTransitionWord = ignoreCase ? word.toUpperCase() === transistionWord.toUpperCase() : word === transistionWord;
                    if (equalTransitionWord) {
                        delete dictElement.t[transistionWord];
                    }
                })
            }
        });
    };

    thiz.contains = function (word, matchCase) {
        if (matchCase) {
            return !!_dict[word];
        } else {
            return !!getBestFittingItem(word);
        }
    };

    thiz.predictCompleteWord = function (input, options) {
        input = input || '';
        options = options || {}; //maxPredicitons, predictionMinDepth, predictionMaxDepth, compareFn
        let possiblePredictions = [];
        Object.keys(_dict).forEach(key => {
            if (key.toLowerCase().indexOf(input.toLowerCase()) === 0) {
                possiblePredictions.push(_dict[key]);
            }
        });

        if (possiblePredictions.length === 0 && input !== '') {
            let result = thiz.predictCompleteWord(input.substring(0, input.length - 1), options);
            result.forEach(element => {
                element.fuzzyMatch = true;
            });
            return result;
        }
        return possiblePredictions.map(element => {
            return {
                word: element.w,
                frequency: element.f,
                rank: element.r
            };
        });
    };

    thiz.predictNextWord = function (previousWord, options) {
        let items = getDictItemsAnyCase(previousWord);
        let predictions = [];
        items.forEach(item => {
            Object.keys(item.t).forEach(key => {
                predictions.push({
                    word: key,
                    frequency: item.t[key]
                });
            });
        });
        return predictions;
    };

    thiz.learn = function (chosenWord, previousWord, addIfNotExisting) {
        if (!chosenWord || (!thiz.contains(chosenWord) && !addIfNotExisting)) {
            return;
        }
        if (addIfNotExisting && chosenWord && !thiz.contains(chosenWord)) {
            thiz.addWord(chosenWord);
        }
        if (addIfNotExisting && previousWord && !thiz.contains(previousWord)) {
            thiz.addWord(previousWord);
        }
        let previousWordItem = getBestFittingItem(previousWord);
        let chosenWordItem = getBestFittingItem(chosenWord);
        chosenWordItem.f++;
        if (previousWordItem) {
            if (previousWordItem.t[chosenWordItem.w]) {
                previousWordItem.t[chosenWordItem.w]++;
            } else {
                previousWordItem.t[chosenWordItem.w] = 1;
            }
        }
    };

    thiz.getWords = function () {
        return Object.keys(_dict);
    };

    function getDictItemsAnyCase(word) {
        if (!word) {
            return [];
        }
        let items = [];
        if (_dict[word]) items.push(_dict[word]);
        if (_dict[word.toLowerCase()] && items.indexOf(_dict[word.toLowerCase()]) === -1) items.push(_dict[word.toLowerCase()]);
        if (_dict[word.toUpperCase()] && items.indexOf(_dict[word.toUpperCase()]) === -1) items.push(_dict[word.toUpperCase()]);
        if (_dict[capitalize(word)] && items.indexOf(_dict[capitalize(word)]) === -1) items.push(_dict[capitalize(word)]);
        return items;
    }

    function getBestFittingItem(word) {
        let items = getDictItemsAnyCase(word);
        return items.length > 0 ? items[0] : null;
    }

    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

export default Dictionary;