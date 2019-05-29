import Predictionary from './index.mjs'

let TESTKEY = 'TESTKEY';
let TESTKEY2 = 'TESTKEY2';
let fruits = ['Apple', 'Apricot', 'Avocado', 'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry', 'Boysenberry', 'Currant', 'Cherry', 'Cherimoya', 'Cloudberry', 'Coconut', 'Cranberry', 'Cucumber', 'Damson', 'Date', 'Dragonfruit', 'Durian', 'Elderberry', 'Feijoa', 'Fig', 'Goji', 'Gooseberry', 'GrapeRaisin', 'Grapefruit', 'Guava', 'Honeyberry', 'Huckleberry', 'Jabuticaba', 'Jackfruit', 'Jambul', 'Jujube', 'Kiwifruit', 'Kumquat', 'Lemon', 'Lime', 'Loquat', 'Longan', 'Lychee', 'Mango', 'Marionberry', 'Melon', 'Cantaloupe', 'Watermelon', 'Mulberry', 'Nectarine', 'Nance', 'Olive', 'Orange', 'Clementine', 'Mandarine', 'Tangerine', 'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Physalis', 'Plantain', 'Pineapple', 'Pomegranate', 'Pomelo', 'Quince', 'Raspberry', 'Salmonberry', 'Rambutan', 'Redcurrant', 'Salak', 'Satsuma', 'Soursop', 'Strawberry', 'Tamarillo', 'Tamarind', 'Yuzu'];
let verbs = ['ask', 'be', 'become', 'begin', 'call', 'can', 'come', 'could', 'do', 'feel', 'find', 'get', 'give', 'go', 'have', 'hear', 'help', 'keep', 'know', 'leave', 'let', 'like', 'live', 'look', 'make', 'may', 'mean', 'might', 'move', 'need', 'play', 'put', 'run', 'say', 'see', 'seem', 'should', 'show', 'start', 'take', 'talk', 'tell', 'think', 'try', 'turn', 'use', 'want', 'will', 'work', 'would'];
let predictionary = null;

beforeEach(() => {
    predictionary = Predictionary.instance();
});

test.skip('addDictionary, predict, performance', () => {
    predictionary.addWords(fruits);
    let startTime = new Date().getTime();
    for (var i = 0; i < 60000; i++) {
        expect(predictionary.predict('A')).toEqual(expect.arrayContaining(['Apple', 'Apricot', 'Avocado']));
    }
    console.log('needed time: ' + (new Date().getTime() - startTime) + 'ms')
});

test('addDictionary, predict', () => {
    predictionary.addWords(fruits, TESTKEY);
    expect(predictionary.predict('A')).toEqual(expect.arrayContaining(['Apple', 'Apricot', 'Avocado']));
    expect(predictionary.predict('a')).toEqual(expect.arrayContaining(['Apple', 'Apricot', 'Avocado']));
});

test('addDictionary, predict, sequence', () => {
    predictionary.addWords(fruits, TESTKEY);
    expect(predictionary.predict('a')).toEqual(expect.arrayContaining(['Apple', 'Apricot', 'Avocado']));
    expect(predictionary.predict('ap')).toEqual(expect.arrayContaining(['Apple', 'Apricot']));
    expect(predictionary.predict('app')).toEqual(expect.arrayContaining(['Apple']));
    expect(predictionary.predict('appl')).toEqual(expect.arrayContaining(['Apple']));
    expect(predictionary.predict('apple')).toEqual(expect.arrayContaining(['Apple']));
    expect(predictionary.predict('apple2')).toEqual(expect.arrayContaining(['Apple']));
    expect(predictionary.predict('appletreeflowerbanana')).toEqual(expect.arrayContaining(['Apple']));
    expect(predictionary.predict('', {maxPredicitons: 1000})).toEqual(expect.arrayContaining(fruits));
    expect(predictionary.predict('b')).toEqual(expect.arrayContaining(['Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry', 'Boysenberry']));
    expect(predictionary.predict('bl')).toEqual(expect.arrayContaining(['Blackberry', 'Blackcurrant', 'Blueberry']));
    expect(predictionary.predict('bla')).toEqual(expect.arrayContaining(['Blackberry', 'Blackcurrant']));
    expect(predictionary.predict('blap')).toEqual(expect.arrayContaining(['Blackberry', 'Blackcurrant']));
    expect(predictionary.predict('apple2')).toEqual(expect.arrayContaining(['Apple']));
    expect(predictionary.predict('blap')).toEqual(expect.arrayContaining(['Blackberry', 'Blackcurrant']));
});

test('predict, learn', () => {
    predictionary.addWords(fruits);
    expect(predictionary.predict('A')).toEqual(expect.arrayContaining(['Apple', 'Apricot', 'Avocado']));
    predictionary.learn('Apricot');
    expect(predictionary.predict('a')).toEqual(expect.arrayContaining(['Apricot', 'Apple', 'Avocado']));
    expect(predictionary.predict('a')[0]).toEqual('Apricot');
    predictionary.learn('Avocado');
    predictionary.learn('Avocado');
    expect(predictionary.predict('a')).toEqual(expect.arrayContaining(['Avocado', 'Apricot', 'Apple']));
    expect(predictionary.predict('a')[0]).toEqual('Avocado');
});

test('predict empty, learn', () => {
    predictionary.addWords(fruits);
    expect(predictionary.predict('', {maxPredicitons: 1000})).toEqual(expect.arrayContaining(fruits));
    predictionary.learn('Cherry');
    let result = predictionary.predict('', {maxPredicitons: 1000});
    expect(result).toEqual(expect.arrayContaining(fruits));
    expect(result[0]).toEqual('Cherry');
});

test('predict, option numberOfPredictions', () => {
    predictionary.addWords(fruits);
    let result = predictionary.predict('', {maxPredicitons: 5});
    expect(result.length).toEqual(5);
    expect(fruits).toEqual(expect.arrayContaining(result));
});

test('predict, option numberOfPredictions, learn', () => {
    predictionary.addWords(fruits);
    predictionary.learn('Cherry');
    predictionary.learn('Coconut');
    predictionary.learn('Coconut');
    let result = predictionary.predict('', {maxPredicitons: 5});
    expect(result.length).toEqual(5);
    expect(fruits).toEqual(expect.arrayContaining(result));
    expect(result[0]).toEqual('Coconut');
    expect(result[1]).toEqual('Cherry');
});

test('addWord, single string', () => {
    predictionary.addWords(fruits);
    predictionary.addWord('Test');
    expect(predictionary.predict('', {maxPredicitons: 1000})).toEqual(expect.arrayContaining(fruits.concat(['Test'])));
    predictionary.learn('Test');
    let result = predictionary.predict('', {maxPredicitons: 1000});
    expect(result).toEqual(expect.arrayContaining(fruits.concat(['Test'])));
    expect(result[0]).toEqual('Test');
});

test('addWord, with rank', () => {
    predictionary.addWords(fruits);
    predictionary.addWord({
        word: 'Test',
        rank: 1
    });
    let result = predictionary.predict('',{maxPredicitons: 1000});
    expect(result).toEqual(expect.arrayContaining(fruits.concat(['Test'])));
    expect(result[0]).toEqual('Test');
});

test('learn, with adding', () => {
    predictionary.addWords(fruits);
    predictionary.learn('Test');
    let result = predictionary.predict('', {maxPredicitons: 1});
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual('Test');
});

test('dictionariesToJSON, loadDictionaries', () => {
    predictionary.addWords(fruits);
    predictionary.addWord("Apple2");
    let json = predictionary.dictionariesToJSON();
    expect(json.length).toBeLessThan(2500);
    let newPredictionary = new Predictionary();
    newPredictionary.loadDictionaries(json);
    expect(predictionary.predict('A')).toEqual(expect.arrayContaining(['Apple2', 'Apple', 'Apricot', 'Avocado']));
});

test('dictionaryToJSON, loadDictionary', () => {
    predictionary.addWords(fruits);
    predictionary.addWord("Apple2");
    let json = predictionary.dictionaryToJSON();
    let newPredictionary = new Predictionary();
    newPredictionary.loadDictionary(json);
    expect(newPredictionary.predict('A')).toEqual(expect.arrayContaining(['Apple2', 'Apple', 'Apricot', 'Avocado']));
});

test('two dictionaries, predict', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    predictionary.addDictionary(TESTKEY2, verbs);
    expect(predictionary.predict('A')).toEqual(expect.arrayContaining(['ask', 'Apple', 'Apricot', 'Avocado']));
    expect(predictionary.predict('w')).toEqual(expect.arrayContaining(['would']));
    expect(predictionary.predict('y')).toEqual(expect.arrayContaining(['Yuzu']));
});

test('two dictionaries, predict, duplicates, unique items', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    predictionary.addDictionary(TESTKEY2, ['Apple', 'America']);
    predictionary.learn('Apple');
    expect(predictionary.predict('A', {maxPredicitons: 4})).toEqual(expect.arrayContaining(['Apple', 'Apricot', 'Avocado', 'America']));
});

test('two dictionaries, predict, learn', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    predictionary.addDictionary(TESTKEY2, verbs);
    predictionary.learn('ask');
    predictionary.learn('Apple');
    predictionary.learn('Apple');
    expect(predictionary.predict('A')[0]).toEqual('Apple');
    predictionary.learn('ask');
    predictionary.learn('ask');
    expect(predictionary.predict('A')[0]).toEqual('ask');
});

test('two dictionaries, dictionariesToJSON, loadDictionaries', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    predictionary.addDictionary(TESTKEY2, verbs);
    predictionary.addWord("Apple2", TESTKEY);
    let json = predictionary.dictionariesToJSON();
    let newPredictionary = new Predictionary();
    newPredictionary.loadDictionaries(json);
    expect(predictionary.predict('A')).toEqual(expect.arrayContaining(['ask', 'Apple2', 'Apple', 'Apricot', 'Avocado']));
});

test('two dictionaries, useDictionary, useAllDictionaries, useDictionaries', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    predictionary.addDictionary(TESTKEY2, verbs);
    predictionary.addWord("Apple2", TESTKEY);
    predictionary.useDictionary(TESTKEY);
    expect(predictionary.predict('A')).toEqual(expect.arrayContaining(['Apple2', 'Apple', 'Apricot', 'Avocado']));
    predictionary.useDictionary(TESTKEY2);
    expect(predictionary.predict('A')).toEqual(expect.arrayContaining(['ask']));
    predictionary.useDictionaries([TESTKEY, TESTKEY2]);
    expect(predictionary.predict('A')).toEqual(expect.arrayContaining(['ask', 'Apple2', 'Apple', 'Apricot', 'Avocado']));
    predictionary.useDictionaries([]);
    expect(predictionary.predict('A')).toEqual([]);
    predictionary.useAllDictionaries();
    expect(predictionary.predict('A')).toEqual(expect.arrayContaining(['ask', 'Apple2', 'Apple', 'Apricot', 'Avocado']));
});

test('useDictionaries, use default by default', () => {
    predictionary.addWord('ATestword');
    predictionary.addDictionary(TESTKEY, fruits);
    predictionary.addDictionary(TESTKEY2, verbs);
    predictionary.useDictionaries([TESTKEY]);
    expect(predictionary.predict('A')).toEqual(expect.arrayContaining(['ATestword', 'Apple', 'Apricot', 'Avocado']));
    predictionary.useDictionaries([TESTKEY2]);
    expect(predictionary.predict('A')).toEqual(expect.arrayContaining(['ask', 'ATestword']));
    predictionary.useDictionaries([]);
    expect(predictionary.predict('A')).toEqual(['ATestword']);
});

test('learn, with previous word, predict automatically', () => {
    predictionary.addWords(fruits);
    predictionary.learn('Banana', 'Apple');
    expect(predictionary.predict('app')).toEqual(expect.arrayContaining(['Apple']));
    expect(predictionary.predict('apple ')).toEqual(expect.arrayContaining(['Banana']));
    expect(predictionary.predict('Apple ')).toEqual(expect.arrayContaining(['Banana']));
});

test('learn, with previous word, different case, predict automatically', () => {
    predictionary.addWords(fruits);
    predictionary.learn('banana', 'apple');
    expect(predictionary.predict('app')).toEqual(expect.arrayContaining(['Apple']));
    expect(predictionary.predict('apple ')).toEqual(expect.arrayContaining(['Banana']));
    expect(predictionary.predict('Apple ')).toEqual(expect.arrayContaining(['Banana']));
});

test('learn, with previous word, different case, predict automatically, change order', () => {
    predictionary.addWords(fruits);
    predictionary.learn('banana', 'apple');
    predictionary.learn('Banana', 'apple');
    predictionary.learn('Apricot', 'Apple');
    expect(predictionary.predict('appl')).toEqual(expect.arrayContaining(['Apple']));
    expect(predictionary.predict('apple ')).toEqual(expect.arrayContaining(['Banana', 'Apricot']));
    expect(predictionary.predict('Apple ')).toEqual(expect.arrayContaining(['Banana', 'Apricot']));
    expect(predictionary.predict('Apple ')[0]).toEqual('Banana');
    predictionary.learn('Apricot', 'Apple');
    predictionary.learn('apricot', 'apple');
    expect(predictionary.predict('Apple ')[0]).toEqual('Apricot');
    expect(predictionary.predict('Apple ').length).toEqual(2);
});

test('learn, with previous word, predictNextWord', () => {
    predictionary.addWords(fruits);
    predictionary.learn('banana', 'apple');
    predictionary.learn('Apricot', 'Apple');
    expect(predictionary.predictNextWord('apple')).toEqual(expect.arrayContaining(['Banana', 'Apricot']));
    predictionary.learn('Banana', 'Apple');
    expect(predictionary.predictNextWord('Apple')).toEqual(expect.arrayContaining(['Banana', 'Apricot']));
    expect(predictionary.predictNextWord('Apple')[0]).toEqual('Banana');
});

test('learn, with previous word, predictCompleteWord', () => {
    predictionary.addWords(fruits);
    predictionary.learn('banana', 'apple');
    predictionary.learn('Apricot', 'Apple');
    expect(predictionary.predictCompleteWord('a')).toEqual(expect.arrayContaining(['Apple', 'Apricot', 'Avocado']));
    expect(predictionary.predictCompleteWord('appl').length).toEqual(1);
    expect(predictionary.predictCompleteWord('appl')[0]).toEqual('Apple');
    predictionary.learn('Apricot', 'Apple');
    expect(predictionary.predictCompleteWord('a')).toEqual(expect.arrayContaining(['Apple', 'Apricot', 'Avocado']));
    expect(predictionary.predictCompleteWord('a')[0]).toEqual('Apricot');
});

test('predictCompleteWord, with spaces', () => {
    predictionary.addWords(fruits);
    expect(predictionary.predictCompleteWord(' a  ')).toEqual(expect.arrayContaining(['Apple', 'Apricot', 'Avocado']));
    expect(predictionary.predictCompleteWord('  appl  ')).toEqual(['Apple']);
});

test('predictNextWord, with spaces', () => {
    predictionary.addWords(fruits);
    predictionary.learn('Apricot', 'Apple');
    expect(predictionary.predictNextWord(' apple  ')).toEqual(['Apricot']);
});

test('predictNextWord, with previous text', () => {
    predictionary.addWords(fruits);
    predictionary.learn('Apricot', 'Apple');
    expect(predictionary.predictNextWord('i want an apple  ')).toEqual(['Apricot']);
    expect(predictionary.predictNextWord('i want an apple')).toEqual(['Apricot']);
    expect(predictionary.predictNextWord('i want an appl')).toEqual([]);
});

test('predictCompleteWord, with previous text', () => {
    predictionary.addWords(fruits);
    expect(predictionary.predictCompleteWord('i want an apple  ')).toEqual(['Apple']);
    expect(predictionary.predictCompleteWord('i want an apple')).toEqual(['Apple']);
    expect(predictionary.predictCompleteWord('i want an ap')).toEqual(expect.arrayContaining(['Apple', 'Apricot']));
});

test('predict, with previous text, automatically', () => {
    predictionary.addWords(fruits);
    predictionary.learn('Apricot', 'Apple');
    expect(predictionary.predict('i want an apple  ')).toEqual(['Apricot']);
    expect(predictionary.predict('i want an apple')).toEqual(['Apple']);
    expect(predictionary.predict('i want an ap')).toEqual(expect.arrayContaining(['Apple', 'Apricot']));
});

test('predict, other separator', () => {
    predictionary.addWords(fruits);
    expect(predictionary.predict('i want no\nap')).toEqual(expect.arrayContaining(['Apple', 'Apricot']));
    expect(predictionary.predict('i want no!ap')).toEqual(expect.arrayContaining(['Apple', 'Apricot']));
    expect(predictionary.predict('i want no.ap')).toEqual(expect.arrayContaining(['Apple', 'Apricot']));
    expect(predictionary.predict('i want no?ap')).toEqual(expect.arrayContaining(['Apple', 'Apricot']));
});

test('predict, eliminate duplicate suggestions', () => {
    predictionary.addWords(fruits);
    predictionary.learn('Apricot');
    predictionary.addDictionary(TESTKEY2, ['Apple', 'Apricot', 'apple'])
    expect(predictionary.predict('ap')).toEqual(expect.arrayContaining(['Apple', 'Apricot', 'apple']));
    expect(predictionary.predict('ap').length).toEqual(3);
    expect(predictionary.predict('ap')[0]).toEqual('Apricot');
});

test('applyPrediction, automatically', () => {
    expect(predictionary.applyPrediction('i want an appl', 'Apple')).toEqual('i want an Apple ');
    expect(predictionary.applyPrediction('i want an Apple ', 'to')).toEqual('i want an Apple to ');
    expect(predictionary.applyPrediction('i want an Apple to e', 'eat')).toEqual('i want an Apple to eat ');
});

test('applyPrediction, manually', () => {
    expect(predictionary.applyPrediction('i want an appl', 'Apple', {shouldCompleteLastWord: true})).toEqual('i want an Apple ');
    expect(predictionary.applyPrediction('i want an appl', 'Apple', {shouldCompleteLastWord: false})).toEqual('i want an appl Apple ');
    expect(predictionary.applyPrediction('i want an appl ', 'Apple', {shouldCompleteLastWord: true})).toEqual('i want an Apple ');
    expect(predictionary.applyPrediction('i want an appl ', 'Apple', {shouldCompleteLastWord: false})).toEqual('i want an appl Apple ');
    expect(predictionary.applyPrediction('appl', 'Apple', {shouldCompleteLastWord: true})).toEqual('Apple ');
    expect(predictionary.applyPrediction('appl', 'Apple', {shouldCompleteLastWord: false})).toEqual('appl Apple ');
});

test('applyPrediction, test automatic learning', () => {
    predictionary.addWords(fruits);
    predictionary.learn('Apple');
    expect(predictionary.predict('ap', {maxPredicitons: 1})).toEqual(['Apple']);
    expect(predictionary.applyPrediction('i want an ap', 'Apricot')).toEqual('i want an Apricot ');
    predictionary.learn('Apricot'); //second time to chose Apricot
    expect(predictionary.predict('ap', {maxPredicitons: 2})).toEqual(['Apricot', 'Apple']);
});

test('applyPrediction, test automatic learning subsequent words', () => {
    predictionary.addWords(fruits);
    expect(predictionary.applyPrediction('i want an apple ', 'Apricot')).toEqual('i want an apple Apricot ');
    expect(predictionary.predict('apple ')).toEqual(['Apricot']);
});

test('applyPrediction, test automatic learning subsequent words, next word, new word add to dict', () => {
    predictionary.addWords(fruits);
    expect(predictionary.applyPrediction('i want no ', 'Apricot')).toEqual('i want no Apricot ');
    expect(predictionary.predict('i want no  ')).toEqual(['Apricot']);
    expect(predictionary.applyPrediction('i want no ', 'Apple')).toEqual('i want no Apple ');
});

test('applyPrediction, test automatic learning subsequent words, complete word, new word add to dict', () => {
    predictionary.addWords(fruits);
    expect(predictionary.applyPrediction('i want no ap', 'Apricot')).toEqual('i want no Apricot ');
    expect(predictionary.predict('i want no ')).toEqual(['Apricot']);
    expect(predictionary.applyPrediction('i want no ap', 'Apple')).toEqual('i want no Apple ');
});

test('applyPrediction, test automatic learning subsequent words, special inbetween chars', () => {
    predictionary.addWords(fruits);
    expect(predictionary.applyPrediction('i want all.', 'Apricot')).toEqual('i want all. Apricot ');
    expect(predictionary.predict('i want all ')).toEqual(['Apricot']);
    expect(predictionary.predict('i want all.')).toEqual(['Apricot']);
    expect(predictionary.predict('i want all. ')).toEqual(['Apricot']);
    expect(predictionary.predict('i want all! ')).toEqual(['Apricot']);
    expect(predictionary.predict('i want all? ')).toEqual(['Apricot']);
});

test('parseWords, default', () => {
    let importString = 'apple;banana;lemon';
    predictionary.parseWords(importString);
    expect(predictionary.predict('')).toEqual(expect.arrayContaining(['apple', 'banana', 'lemon']));
});

test('parseWords, custom separator', () => {
    let importString = 'apple\nbanana\nlemon';
    predictionary.parseWords(importString, {
        elementSeparator: '\n'
    });
    expect(predictionary.predict('')).toEqual(expect.arrayContaining(['apple', 'banana', 'lemon']));
});

test('parseWords, with rank, custom separators', () => {
    let importString = 'apple,3:banana,2:lemon,1';
    predictionary.parseWords(importString, {
        elementSeparator: ':',
        rankSeparator: ',',
        wordPosition: 0,
        rankPosition: 1
    });
    expect(predictionary.predict('')).toEqual(['lemon', 'banana', 'apple']);
});

test('parseWords, with rank, custom separators, different order', () => {
    let importString = 'apple,3:banana,2:lemon,1';
    predictionary.parseWords(importString, {
        elementSeparator: ':',
        rankSeparator: ',',
        wordPosition: 1,
        rankPosition: 0
    });
    expect(predictionary.predict('')).toEqual(expect.arrayContaining(['1', '2', '3']));
});

test('predict, fuzzyMatch correct order, two dictionaries', () => {
    predictionary.addDictionary(TESTKEY, ['Apple', 'Apricot', 'Ant']);
    predictionary.addDictionary(TESTKEY2, ['America']);
    expect(predictionary.predict('Am', {maxPredicitons: 1})).toEqual(['America']);
    expect(predictionary.predict('Am', {maxPredicitons: 4})).toEqual(expect.arrayContaining(['America', 'Apple', 'Apricot', 'Ant']));
});

test('getDictionaryKeys, isUsingOnlyDefaultDictionary, default', () => {
    expect(predictionary.isUsingOnlyDefaultDictionary()).toEqual(true);
    predictionary.addWords(fruits);
    expect(predictionary.getDictionaryKeys()).toEqual([predictionary.DEFAULT_DICTIONARY_KEY]);
    expect(predictionary.isUsingOnlyDefaultDictionary()).toEqual(true);
});

test('getDictionaryKeys, isUsingOnlyDefaultDictionary, custom', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    expect(predictionary.getDictionaryKeys()).toEqual([TESTKEY]);
    expect(predictionary.isUsingOnlyDefaultDictionary()).toEqual(false);
});

test('getDictionaryKeys, addWords', () => {
    predictionary.addWords(fruits, TESTKEY);
    predictionary.addWords(verbs, TESTKEY2);
    expect(predictionary.getDictionaryKeys()).toEqual(expect.arrayContaining([TESTKEY, TESTKEY2]));
    expect(predictionary.getDictionaryKeys(true)).toEqual(expect.arrayContaining([TESTKEY, TESTKEY2]));
    predictionary.useDictionary(TESTKEY);
    expect(predictionary.getDictionaryKeys(true)).toEqual(expect.arrayContaining([TESTKEY]));
});

test('learnFromInput', () => {
    predictionary.learnFromInput('He');
    predictionary.learnFromInput('Hello');
    predictionary.learnFromInput('Hello my');
    predictionary.learnFromInput('Hello my na');
    predictionary.learnFromInput('Hello my name ');
    expect(predictionary.predict('hello ')).toEqual(['my']);
    predictionary.learnFromInput('Hello my name is ');
    predictionary.learnFromInput('Hello my name is Mi');
    predictionary.learnFromInput('Hello my name is Michael ');
    predictionary.learnFromInput('Hello my name is Michael and ');
    predictionary.learnFromInput('Hello my name is Michael and my ');
    predictionary.learnFromInput('Hello my name is Michael and my house ');
    predictionary.learnFromInput('Hello my name is Michael and my house is ');
    predictionary.learnFromInput('Hello my name is Michael and my house is big.');
    predictionary.learnFromInput('Hello my name is Michael and my house is big. yeah.');
    expect(predictionary.predict('hello ')).toEqual(['my']);
    expect(predictionary.predict('hello my ')).toEqual(expect.arrayContaining(['name', 'house']));
    expect(predictionary.predict('This is ')).toEqual(expect.arrayContaining(['Michael', 'big']));
    expect(predictionary.predict('name ')).toEqual(['is']);
    expect(predictionary.predict('and ')).toEqual(['my']);
    expect(predictionary.predict('house ')).toEqual(['is']);
});

test('addWord, sanitize', () => {
    predictionary.addWord(" heiße !");
    expect(predictionary.predict('h')).toEqual(['heiße']);
    predictionary.addWord("but, ");
    expect(predictionary.predict('b')).toEqual(['but']);
    predictionary.addWord("Don't\n ");
    expect(predictionary.predict('d')).toEqual(["Don't"]);
    predictionary.addWord("didn`t");
    expect(predictionary.predict('di')).toEqual(["didn`t"]);
    predictionary.addWord("won’t");
    expect(predictionary.predict('w')).toEqual(["won’t"]);
    predictionary.addWord("Hello");
    expect(predictionary.predict('hel')).toEqual(["Hello"]);
});

test('getWords, default dictionary, additional dictionary', () => {
    predictionary.addWords(fruits);
    expect(predictionary.getWords()).toEqual(expect.arrayContaining(fruits));
    predictionary.addDictionary(TESTKEY, ['test']);
    expect(predictionary.getWords()).toEqual(expect.arrayContaining(fruits.concat(['test'])));
    expect(predictionary.getWords(TESTKEY)).toEqual(['test']);
    expect(predictionary.getWords(TESTKEY2)).toEqual([]);
});

test('getWords, one dictionary, learn to correct dictionary, unknown words', () => {
    predictionary.addWords(fruits, TESTKEY);
    expect(predictionary.getWords(TESTKEY)).toEqual(expect.arrayContaining(fruits));
    predictionary.learn('test', 'test2');
    expect(predictionary.getWords(TESTKEY)).toEqual(expect.arrayContaining(fruits));
    expect(predictionary.getWords().length).toEqual(fruits.length + 2);
});

test('getWords, one dictionary, learn to correct dictionary, known chosen word', () => {
    predictionary.addWords(fruits, TESTKEY);
    predictionary.learn('Apple', 'test');
    expect(predictionary.getWords(TESTKEY)).toEqual(expect.arrayContaining(fruits.concat(['test'])));
    expect(predictionary.getWords().length).toEqual(fruits.length + 1);
});

test('getWords, one dictionary, learn to correct dictionary, known previous word', () => {
    predictionary.addWords(fruits, TESTKEY);
    predictionary.learn('test', 'Apple');
    expect(predictionary.getWords(TESTKEY)).toEqual(expect.arrayContaining(fruits.concat(['test'])));
    expect(predictionary.getWords().length).toEqual(fruits.length + 1);
});

test('getWords, two dictionaries, learn to correct dictionary, word existing', () => {
    predictionary.addWords(fruits, TESTKEY);
    predictionary.addWords(verbs, TESTKEY2);
    predictionary.learn('Apple', 'an');
    expect(predictionary.getWords(TESTKEY)).toEqual(expect.arrayContaining(fruits.concat(['an'])));
    expect(predictionary.getWords(TESTKEY2).length).toEqual(verbs.length);
    expect(predictionary.getWords().length).toEqual(verbs.length + fruits.length + 1);
});

test('getWords, two dictionaries, learn to correct dictionary, word not existing', () => {
    predictionary.addWords(fruits, TESTKEY);
    predictionary.addWords(verbs, TESTKEY2);
    predictionary.learn('Flower', 'an');
    expect(predictionary.getWords(TESTKEY).length).toEqual(fruits.length);
    expect(predictionary.getWords(TESTKEY2).length).toEqual(verbs.length);
    expect(predictionary.getWords()).toEqual(expect.arrayContaining(fruits.concat(['an', 'Flower'])));
});

test('getWords, apply prediction to correct dictionary', () => {
    predictionary.addWords(fruits, TESTKEY);
    predictionary.addWords(verbs, TESTKEY2);
    predictionary.applyPrediction('i want an ap', 'Apple');
    expect(predictionary.getWords().length).toEqual(fruits.length + verbs.length + 1);
    expect(predictionary.getWords()).toEqual(expect.arrayContaining(fruits.concat(['an'])));
});

test('getWords, learn from input to correct dictionary', () => {
    predictionary.addWords(fruits, TESTKEY);
    predictionary.addWords(verbs, TESTKEY2);
    predictionary.learnFromInput('Hello ');
    predictionary.learnFromInput('Hello I ');
    predictionary.learnFromInput('Hello I want ');
    predictionary.learnFromInput('Hello I want an ');
    predictionary.learnFromInput('Hello I want an apple ');
    predictionary.learnFromInput('Hello I want an apple now ');
    expect(predictionary.getWords(TESTKEY2)).toEqual(expect.arrayContaining(verbs.concat(['I'])));
    expect(predictionary.getWords().length).toEqual(fruits.length + verbs.length + 5);
});

test('getWords, learn from input to correct dictionary', () => {
    predictionary.addWords(fruits, TESTKEY);
    predictionary.addWords(verbs, TESTKEY2);
    predictionary.learnFromInput('Apple ');
    predictionary.learnFromInput('Apple is ');
    predictionary.learnFromInput('Apple is a ');
    predictionary.learnFromInput('Apple is a fruit ');
    predictionary.learnFromInput('Play ');
    predictionary.learnFromInput('Play something ');
    predictionary.learnFromInput('Play something with ');
    predictionary.learnFromInput('Play something with me ');
    expect(predictionary.getWords(TESTKEY)).toEqual(expect.arrayContaining(fruits.concat(['is', 'a'])));
    expect(predictionary.getWords(TESTKEY2)).toEqual(expect.arrayContaining(verbs.concat(['something', 'with'])));
    expect(predictionary.getWords().length).toEqual(fruits.length + verbs.length + 4);
});

test('hasWord', () => {
    predictionary.addWords(fruits, TESTKEY);
    predictionary.addWords(verbs, TESTKEY2);
    expect(predictionary.hasWord('apple')).toEqual(true);
    expect(predictionary.hasWord('become')).toEqual(true);
    expect(predictionary.hasWord('become', TESTKEY)).toEqual(false);
    expect(predictionary.hasWord('become', TESTKEY2)).toEqual(true);
    expect(predictionary.hasWord('apple', TESTKEY)).toEqual(true);
    expect(predictionary.hasWord('apple', TESTKEY, true)).toEqual(false);
    expect(predictionary.hasWord('Apple', TESTKEY, true)).toEqual(true);
});