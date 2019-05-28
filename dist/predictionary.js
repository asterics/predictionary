var Predictionary =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.mjs");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/dictionary.mjs":
/*!****************************!*\
  !*** ./src/dictionary.mjs ***!
  \****************************/
/*! exports provided: default */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _itemFactory_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./itemFactory.mjs */ \"./src/itemFactory.mjs\");\n\n\nfunction Dictionary() {\n    var thiz = this;\n    var _dict = {};\n\n    thiz.load = function (dictionaryJSON) {\n        var importDict = JSON.parse(dictionaryJSON);\n        Object.keys(importDict).forEach(function (key) {\n            importDict[key].w = key;\n        });\n        _dict = importDict;\n    };\n\n    thiz.toJSON = function () {\n        var copy = JSON.parse(JSON.stringify(_dict));\n        Object.keys(copy).forEach(function (key) {\n            delete copy[key].w;\n        });\n        return JSON.stringify(copy);\n    };\n\n    thiz.addWord = function (word, rank) {\n        if (!word) {\n            return;\n        }\n        if (!_dict[word]) {\n            _dict[word] = _itemFactory_mjs__WEBPACK_IMPORTED_MODULE_0__[\"default\"].createItem(word, rank);\n        }\n    };\n\n    thiz.addWords = function (words) {\n        if (!(words instanceof Array) || words.length === 0) {\n            throw 'words to add must be an array with at least one element.';\n        }\n        words.forEach(function (word) {\n            thiz.addWord(word);\n        });\n    };\n\n    thiz.contains = function (word, matchCase) {\n        if (matchCase) {\n            return !!_dict[word];\n        } else {\n            return !!getBestFittingItem(word);\n        }\n    };\n\n    thiz.predictCompleteWord = function (input, options) {\n        input = input || '';\n        options = options || {}; //maxPredicitons, predictionMinDepth, predictionMaxDepth, compareFn\n        var possiblePredictions = [];\n        Object.keys(_dict).forEach(function (key) {\n            if (key.toLowerCase().indexOf(input.toLowerCase()) === 0) {\n                possiblePredictions.push(_dict[key]);\n            }\n        });\n\n        if (possiblePredictions.length === 0 && input !== '') {\n            var result = thiz.predictCompleteWord(input.substring(0, input.length - 1), options);\n            result.forEach(function (element) {\n                element.fuzzyMatch = true;\n            });\n            return result;\n        }\n        return possiblePredictions.map(function (element) {\n            return {\n                word: element.w,\n                frequency: element.f,\n                rank: element.r\n            };\n        });\n    };\n\n    thiz.predictNextWord = function (previousWord, options) {\n        var items = getDictItemsAnyCase(previousWord);\n        var predictions = [];\n        items.forEach(function (item) {\n            Object.keys(item.t).forEach(function (key) {\n                predictions.push({\n                    word: key,\n                    frequency: item.t[key]\n                });\n            });\n        });\n        return predictions;\n    };\n\n    thiz.learn = function (chosenWord, previousWord, addIfNotExisting) {\n        if (!chosenWord || !thiz.contains(chosenWord) && !addIfNotExisting) {\n            return;\n        }\n        if (addIfNotExisting && chosenWord && !thiz.contains(chosenWord)) {\n            thiz.addWord(chosenWord);\n        }\n        if (addIfNotExisting && previousWord && !thiz.contains(previousWord)) {\n            thiz.addWord(previousWord);\n        }\n        var previousWordItem = getBestFittingItem(previousWord);\n        var chosenWordItem = getBestFittingItem(chosenWord);\n        chosenWordItem.f++;\n        if (previousWordItem) {\n            if (previousWordItem.t[chosenWordItem.w]) {\n                previousWordItem.t[chosenWordItem.w]++;\n            } else {\n                previousWordItem.t[chosenWordItem.w] = 1;\n            }\n        }\n    };\n\n    thiz.getWords = function () {\n        return Object.keys(_dict);\n    };\n\n    function getDictItemsAnyCase(word) {\n        if (!word) {\n            return [];\n        }\n        var items = [];\n        if (_dict[word]) items.push(_dict[word]);\n        if (_dict[word.toLowerCase()] && !items.includes(_dict[word.toLowerCase()])) items.push(_dict[word.toLowerCase()]);\n        if (_dict[word.toUpperCase()] && !items.includes(_dict[word.toUpperCase()])) items.push(_dict[word.toUpperCase()]);\n        if (_dict[capitalize(word)] && !items.includes(_dict[capitalize(word)])) items.push(_dict[capitalize(word)]);\n        return items;\n    }\n\n    function getBestFittingItem(word) {\n        var items = getDictItemsAnyCase(word);\n        return items.length > 0 ? items[0] : null;\n    }\n\n    function capitalize(string) {\n        return string.charAt(0).toUpperCase() + string.slice(1);\n    }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Dictionary);\n\n//# sourceURL=webpack://Predictionary/./src/dictionary.mjs?");

/***/ }),

/***/ "./src/index.mjs":
/*!***********************!*\
  !*** ./src/index.mjs ***!
  \***********************/
/*! exports provided: default, instance */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"instance\", function() { return instance; });\n/* harmony import */ var _dictionary_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dictionary.mjs */ \"./src/dictionary.mjs\");\n\n\nvar INBETWEEN_CHARS_REGEX = \"[\\\\s\\\\.\\\\?!,]\";\nvar SENTENCE_END_CHARS_REGEX = \"[\\\\.\\\\?!,]\";\n\nfunction Predictionary() {\n    var thiz = this;\n    thiz.DEFAULT_DICTIONARY_KEY = 'DEFAULT_DICTIONARY_KEY';\n    var PREDICT_METHOD_COMPLETE_WORD = 'PREDICT_METHOD_COMPLETE_WORD';\n    var PREDICT_METHOD_NEXT_WORD = 'PREDICT_METHOD_NEXT_WORD';\n    var _dicts = {};\n    var _lastChosenWord = null;\n\n    thiz.loadDictionary = function (dictionaryJSON, dictionaryKey) {\n        if (!dictionaryJSON) {\n            throw 'dictionaryJSON must be specified.';\n        }\n        dictionaryKey = dictionaryKey || thiz.DEFAULT_DICTIONARY_KEY;\n        var dictionary = new _dictionary_mjs__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n        dictionary.load(dictionaryJSON);\n        _dicts[dictionaryKey] = dictionary;\n    };\n\n    thiz.loadDictionaries = function (dictionariesJSON) {\n        if (!dictionariesJSON) {\n            throw 'dictionariesJSON must be specified.';\n        }\n        _dicts = {};\n        var list = JSON.parse(dictionariesJSON);\n        list.forEach(function (element) {\n            thiz.loadDictionary(element.json, element.key);\n        });\n    };\n\n    thiz.dictionaryToJSON = function (dictionaryKey) {\n        dictionaryKey = dictionaryKey || thiz.DEFAULT_DICTIONARY_KEY;\n        var dict = _dicts[dictionaryKey];\n        return dict ? dict.toJSON() : null;\n    };\n\n    thiz.dictionariesToJSON = function () {\n        var list = [];\n        Object.keys(_dicts).forEach(function (key) {\n            list.push({\n                key: key,\n                json: _dicts[key].toJSON()\n            });\n        });\n        return JSON.stringify(list);\n    };\n\n    thiz.useDictionary = function (dictionaryKey) {\n        if (!dictionaryKey) {\n            throw 'dictionaryKey must be specified.';\n        }\n        Object.keys(_dicts).forEach(function (key) {\n            _dicts[key].disabled = dictionaryKey !== key;\n        });\n    };\n\n    thiz.useDictionaries = function (dictionaryKeys) {\n        if (!(dictionaryKeys instanceof Array)) {\n            throw 'dictionaryKeys must be specified and of type Array.';\n        }\n        Object.keys(_dicts).forEach(function (key) {\n            _dicts[key].disabled = !dictionaryKeys.includes(key) && key !== thiz.DEFAULT_DICTIONARY_KEY;\n        });\n    };\n\n    thiz.useAllDictionaries = function () {\n        Object.keys(_dicts).forEach(function (key) {\n            _dicts[key].disabled = false;\n        });\n    };\n\n    thiz.addDictionary = function (dictionaryKey, words) {\n        if (!dictionaryKey && _dicts[thiz.DEFAULT_DICTIONARY_KEY]) {\n            throw 'dictionaryKey must be specified.';\n        }\n        dictionaryKey = dictionaryKey || thiz.DEFAULT_DICTIONARY_KEY;\n        if (_dicts[dictionaryKey]) {\n            throw 'dictionary already existing.';\n        }\n        _dicts[dictionaryKey] = new _dictionary_mjs__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n        if (words && words instanceof Array) {\n            words.forEach(function (element) {\n                thiz.addWord(element, dictionaryKey);\n            });\n        }\n    };\n\n    thiz.addWord = function (element, dictionaryKey) {\n        dictionaryKey = dictionaryKey || thiz.DEFAULT_DICTIONARY_KEY;\n        if (!element) {\n            throw 'element to add not specified.';\n        }\n        if (!_dicts[dictionaryKey]) {\n            thiz.addDictionary(dictionaryKey);\n        }\n        var dict = _dicts[dictionaryKey];\n        if (typeof element === 'string') {\n            dict.addWord(sanitize(element));\n        } else if (element.word && typeof element.word === 'string') {\n            dict.addWord(sanitize(element.word), element.rank);\n        }\n    };\n\n    thiz.addWords = function (elements, dictionaryKey) {\n        if (!(elements instanceof Array)) {\n            throw 'elements to add must be instance of array specified.';\n        }\n        elements.forEach(function (element) {\n            thiz.addWord(element, dictionaryKey);\n        });\n    };\n\n    thiz.parseWords = function (importString, options) {\n        options = options || {};\n        var elementSeparator = options.elementSeparator || ';';\n        var rankSeparator = options.rankSeparator || ' ';\n        var wordPosition = options.wordPosition || 0;\n        var rankPosition = options.rankPosition;\n        var addToDictionary = options.addToDictionary || thiz.DEFAULT_DICTIONARY_KEY;\n\n        var lines = importString.split(elementSeparator);\n        lines.forEach(function (line) {\n            var elems = line.split(rankSeparator);\n            var rank = parseInt(elems[rankPosition]);\n            if (elems[wordPosition]) {\n                var elementToAdd = {\n                    word: elems[wordPosition].trim()\n                };\n                if (!isNaN(rank)) {\n                    elementToAdd.rank = rank;\n                }\n                thiz.addWord(elementToAdd, addToDictionary);\n            }\n        });\n    };\n\n    thiz.getWords = function (dictionaryKey) {\n        var words = [];\n        if (!dictionaryKey) {\n            thiz.getDictionaryKeys().forEach(function (key) {\n                words = words.concat(_dicts[key].getWords());\n            });\n        } else if (_dicts[dictionaryKey]) {\n            words = _dicts[dictionaryKey].getWords();\n        }\n        return words;\n    };\n\n    thiz.hasWord = function (word, dictionaryKey, matchCase) {\n        var allElementsString = \" \" + thiz.getWords(dictionaryKey).join(\" \") + \" \";\n        var flag = matchCase ? \"\" : \"i\";\n        return new RegExp(\" \" + word + \" \", flag).test(allElementsString);\n    };\n\n    thiz.predict = function (input, options) {\n        return predictInternal(input, options);\n    };\n\n    thiz.predictCompleteWord = function (input, options) {\n        return predictInternal(input, options, PREDICT_METHOD_COMPLETE_WORD);\n    };\n\n    thiz.predictNextWord = function (input, options) {\n        return predictInternal(input, options, PREDICT_METHOD_NEXT_WORD);\n    };\n\n    thiz.applyPrediction = function (input, chosenPrediction, options) {\n        options = options || {};\n        var addToDictionary = options.addToDictionary || (thiz.isUsingOnlyDefaultDictionary() ? thiz.DEFAULT_DICTIONARY_KEY : null);\n        var shouldCompleteLastWord = options.shouldCompleteLastWord !== undefined ? options.shouldCompleteLastWord : !isLastWordCompleted(input);\n        var dontLearn = options.dontLearn;\n        var lastWord = getLastWord(input);\n        var preLastWord = getLastWord(input, 2);\n        var temp = shouldCompleteLastWord ? input.substring(0, input.lastIndexOf(lastWord)) : input;\n        if (temp.length > 0 && (!isLastWordCompleted(temp) || new RegExp(SENTENCE_END_CHARS_REGEX).test(temp[temp.length - 1]))) {\n            temp += ' ';\n        }\n        if (!dontLearn) {\n            thiz.learn(chosenPrediction, !shouldCompleteLastWord ? lastWord : preLastWord, addToDictionary);\n        }\n        return temp + chosenPrediction + ' ';\n    };\n\n    thiz.learn = function (chosenWord, previousWord, addToDictionary) {\n        if (thiz.getDictionaryKeys(true).length > 0 && (!addToDictionary || !_dicts[addToDictionary])) {\n            var currentHighscore = 0;\n            thiz.getDictionaryKeys(true).forEach(function (key) {\n                var score = 0;\n                if (thiz.hasWord(chosenWord, key)) {\n                    score += 2;\n                }\n                if (thiz.hasWord(previousWord, key)) {\n                    score++;\n                }\n                if (score > 0 && score >= currentHighscore) {\n                    currentHighscore = score;\n                    addToDictionary = key;\n                }\n            });\n        }\n        addToDictionary = addToDictionary || thiz.DEFAULT_DICTIONARY_KEY;\n        if (!_dicts[addToDictionary]) {\n            thiz.addDictionary(addToDictionary);\n        }\n        Object.keys(_dicts).forEach(function (key) {\n            var dict = _dicts[key];\n            if (!dict.disabled) {\n                dict.learn(chosenWord, previousWord, addToDictionary === key);\n            }\n        });\n    };\n\n    thiz.learnFromInput = function (input, dictionaryKey) {\n        if (isLastWordCompleted(input)) {\n            var chosenWord = getLastWord(input, 2);\n            var previousWord = getLastWord(input, 3);\n            if (chosenWord && chosenWord !== _lastChosenWord) {\n                _lastChosenWord = chosenWord;\n                thiz.learn(chosenWord, previousWord, dictionaryKey);\n            }\n        }\n    };\n\n    thiz.getDictionaryKeys = function (onlyEnabled) {\n        if (onlyEnabled) {\n            return Object.keys(_dicts).filter(function (element) {\n                return !_dicts[element].disabled;\n            });\n        }\n        return Object.keys(_dicts);\n    };\n\n    thiz.isUsingOnlyDefaultDictionary = function () {\n        var keys = thiz.getDictionaryKeys();\n        return keys.length === 0 || keys.length === 1 && keys[0] === thiz.DEFAULT_DICTIONARY_KEY;\n    };\n\n    function predictInternal(input, options, predictType) {\n        var predictions = [];\n        options = options || {};\n        options.maxPredicitons = options.maxPredicitons || 100000;\n        Object.keys(_dicts).forEach(function (key) {\n            var dict = _dicts[key];\n            if (!dict.disabled) {\n                var predictFn = predictType === PREDICT_METHOD_NEXT_WORD ? dict.predictNextWord : predictType === PREDICT_METHOD_COMPLETE_WORD ? dict.predictCompleteWord : null;\n                predictFn = predictFn || (isLastWordCompleted(input) ? dict.predictNextWord : dict.predictCompleteWord);\n                predictions = predictions.concat(predictFn(getLastWord(input), options));\n            }\n        });\n        predictions.sort(function (a, b) {\n            if (a.fuzzyMatch !== b.fuzzyMatch) {\n                return a.fuzzyMatch ? 1 : -1;\n            }\n            if (a.frequency !== b.frequency) {\n                return a.frequency < b.frequency ? 1 : -1;\n            }\n            if (a.rank !== b.rank) {\n                if (a.rank && b.rank === undefined) return -1;\n                if (b.rank && a.rank === undefined) return 1;\n                return a.rank < b.rank ? -1 : 1;\n            }\n            return 0;\n        });\n        var returnArray = [];\n        for (var i = 0; i < predictions.length && returnArray.length < options.maxPredicitons; i++) {\n            if (returnArray.indexOf(predictions[i].word) === -1) {\n                //de-duplicate\n                returnArray.push(predictions[i].word);\n            }\n        }\n        return returnArray;\n    }\n}\n\nfunction getLastWord(text, index) {\n    index = index || 1;\n    var words = text.trim().split(new RegExp(INBETWEEN_CHARS_REGEX)).filter(function (word) {\n        return !!word;\n    });\n    var returnWord = words[words.length - index] || '';\n    return returnWord.replace(new RegExp(INBETWEEN_CHARS_REGEX, 'g'), '');\n}\n\nfunction isLastWordCompleted(text) {\n    return new RegExp(INBETWEEN_CHARS_REGEX).test(text[text.length - 1]);\n}\n\nfunction sanitize(word) {\n    word = word || '';\n    return word.replace(/[^a-z0-9áéíóúñüäöß'`´’]/gim, '');\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Predictionary);\n\nfunction instance() {\n    return new Predictionary();\n}\n\n//# sourceURL=webpack://Predictionary/./src/index.mjs?");

/***/ }),

/***/ "./src/itemFactory.mjs":
/*!*****************************!*\
  !*** ./src/itemFactory.mjs ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nvar itemFactory = {};\n\nitemFactory.createItem = function (word, rank) {\n    if (!word) {\n        throw 'parameter \"word\" must be specified.';\n    }\n    var rankInt = parseInt(rank);\n    var returnObject = {\n        w: word, //the word\n        f: 0, //frequency how often the user has used this word\n        t: {} //transitions to other words\n    };\n    if (isInteger(rankInt)) {\n        returnObject.r = rankInt; //an inital rank of the word -> lower means more common\n    }\n    return returnObject;\n};\n\nfunction isInteger(value) {\n    return value == parseInt(value);\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (itemFactory);\n\n//# sourceURL=webpack://Predictionary/./src/itemFactory.mjs?");

/***/ })

/******/ });