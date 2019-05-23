import Predictionary from './index.mjs'

let TESTKEY = 'TESTKEY';
let TESTKEY2 = 'TESTKEY2';
let fruits = ['Apple', 'Apricot', 'Avocado', 'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry', 'Boysenberry', 'Currant', 'Cherry', 'Cherimoya', 'Cloudberry', 'Coconut', 'Cranberry', 'Cucumber', 'Damson', 'Date', 'Dragonfruit', 'Durian', 'Elderberry', 'Feijoa', 'Fig', 'Goji', 'Gooseberry', 'GrapeRaisin', 'Grapefruit', 'Guava', 'Honeyberry', 'Huckleberry', 'Jabuticaba', 'Jackfruit', 'Jambul', 'Jujube', 'Kiwifruit', 'Kumquat', 'Lemon', 'Lime', 'Loquat', 'Longan', 'Lychee', 'Mango', 'Marionberry', 'Melon', 'Cantaloupe', 'Watermelon', 'Mulberry', 'Nectarine', 'Nance', 'Olive', 'Orange', 'Clementine', 'Mandarine', 'Tangerine', 'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Physalis', 'Plantain', 'Pineapple', 'Pomegranate', 'Pomelo', 'Quince', 'Raspberry', 'Salmonberry', 'Rambutan', 'Redcurrant', 'Salak', 'Satsuma', 'Soursop', 'Strawberry', 'Tamarillo', 'Tamarind', 'Yuzu'];
let verbs = ['ask', 'be', 'become', 'begin', 'call', 'can', 'come', 'could', 'do', 'feel', 'find', 'get', 'give', 'go', 'have', 'hear', 'help', 'keep', 'know', 'leave', 'let', 'like', 'live', 'look', 'make', 'may', 'mean', 'might', 'move', 'need', 'play', 'put', 'run', 'say', 'see', 'seem', 'should', 'show', 'start', 'take', 'talk', 'tell', 'think', 'try', 'turn', 'use', 'want', 'will', 'work', 'would'];
let predictionary = null;

beforeEach(() => {
    predictionary = new Predictionary();
});

test.skip('addDictionary, predict, performance', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    let startTime = new Date().getTime();
    for (var i = 0; i < 60000; i++) {
        expect(predictionary.predict('A')).toEqual(expect.arrayContaining(['Apple', 'Apricot', 'Avocado']));
    }
    console.log('needed time: ' + (new Date().getTime() - startTime) + 'ms')
});

test('addDictionary, predict', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    expect(predictionary.predict('A')).toEqual(expect.arrayContaining(['Apple', 'Apricot', 'Avocado']));
    expect(predictionary.predict('a')).toEqual(expect.arrayContaining(['Apple', 'Apricot', 'Avocado']));
});

test('addDictionary, predict, sequence', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    expect(predictionary.predict('a')).toEqual(expect.arrayContaining(['Apple', 'Apricot', 'Avocado']));
    expect(predictionary.predict('ap')).toEqual(expect.arrayContaining(['Apple', 'Apricot']));
    expect(predictionary.predict('app')).toEqual(expect.arrayContaining(['Apple']));
    expect(predictionary.predict('appl')).toEqual(expect.arrayContaining(['Apple']));
    expect(predictionary.predict('apple')).toEqual(expect.arrayContaining(['Apple']));
    expect(predictionary.predict('apple2')).toEqual(expect.arrayContaining(['Apple']));
    expect(predictionary.predict('appletreeflowerbanana')).toEqual(expect.arrayContaining(['Apple']));
    expect(predictionary.predict('')).toEqual(expect.arrayContaining(fruits));
    expect(predictionary.predict('b')).toEqual(expect.arrayContaining(['Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry', 'Boysenberry']));
    expect(predictionary.predict('bl')).toEqual(expect.arrayContaining(['Blackberry', 'Blackcurrant', 'Blueberry']));
    expect(predictionary.predict('bla')).toEqual(expect.arrayContaining(['Blackberry', 'Blackcurrant']));
    expect(predictionary.predict('blap')).toEqual(expect.arrayContaining(['Blackberry', 'Blackcurrant']));
    expect(predictionary.predict('apple2')).toEqual(expect.arrayContaining(['Apple']));
    expect(predictionary.predict('blap')).toEqual(expect.arrayContaining(['Blackberry', 'Blackcurrant']));
});

test('predict, refine', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    expect(predictionary.predict('A')).toEqual(expect.arrayContaining(['Apple', 'Apricot', 'Avocado']));
    predictionary.refineDictionaries('Apricot');
    expect(predictionary.predict('a')).toEqual(expect.arrayContaining(['Apricot', 'Apple', 'Avocado']));
    expect(predictionary.predict('a')[0]).toEqual('Apricot');
    predictionary.refineDictionaries('Avocado');
    predictionary.refineDictionaries('Avocado');
    expect(predictionary.predict('a')).toEqual(expect.arrayContaining(['Avocado', 'Apricot', 'Apple']));
    expect(predictionary.predict('a')[0]).toEqual('Avocado');
});

test('predict empty, refine', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    expect(predictionary.predict('')).toEqual(expect.arrayContaining(fruits));
    predictionary.refineDictionaries('Cherry');
    let result = predictionary.predict('');
    expect(result).toEqual(expect.arrayContaining(fruits));
    expect(result[0]).toEqual('Cherry');
});

test('predict, option numberOfPredictions', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    let result = predictionary.predict('', {maxPredicitons: 5});
    expect(result.length).toEqual(5);
    expect(fruits).toEqual(expect.arrayContaining(result));
});

test('predict, option numberOfPredictions, refine', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    predictionary.refineDictionaries('Cherry');
    predictionary.refineDictionaries('Coconut');
    predictionary.refineDictionaries('Coconut');
    let result = predictionary.predict('', {maxPredicitons: 5});
    expect(result.length).toEqual(5);
    expect(fruits).toEqual(expect.arrayContaining(result));
    expect(result[0]).toEqual('Coconut');
    expect(result[1]).toEqual('Cherry');
});

test('addWord, single string', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    predictionary.addWord(TESTKEY, 'Test');
    expect(predictionary.predict('')).toEqual(expect.arrayContaining(fruits.concat(['Test'])));
    predictionary.refineDictionaries('Test');
    let result = predictionary.predict('');
    expect(result).toEqual(expect.arrayContaining(fruits.concat(['Test'])));
    expect(result[0]).toEqual('Test');
});

test('addWord, with rank', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    predictionary.addWord(TESTKEY, {
        word: 'Test',
        rank: 1
    });
    let result = predictionary.predict('');
    expect(result).toEqual(expect.arrayContaining(fruits.concat(['Test'])));
    expect(result[0]).toEqual('Test');
});

test('refine, with adding', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    predictionary.refineDictionaries('Test', null, TESTKEY);
    let result = predictionary.predict('', {maxPredicitons: 1});
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual('Test');
});

test('dictionariesToJSON, loadDictionaries', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    predictionary.addWord(TESTKEY, "Apple2");
    let json = predictionary.dictionariesToJSON();
    let newPredictionary = new Predictionary();
    newPredictionary.loadDictionaries(json);
    expect(predictionary.predict('A')).toEqual(expect.arrayContaining(['Apple2', 'Apple', 'Apricot', 'Avocado']));
});

test('dictionaryToJSON, loadDictionary', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    predictionary.addWord(TESTKEY, "Apple2");
    let json = predictionary.dictionaryToJSON(TESTKEY);
    let newPredictionary = new Predictionary();
    newPredictionary.loadDictionary(TESTKEY, json);
    expect(predictionary.predict('A')).toEqual(expect.arrayContaining(['Apple2', 'Apple', 'Apricot', 'Avocado']));
});

test('two dictionaries, predict', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    predictionary.addDictionary(TESTKEY2, verbs);
    expect(predictionary.predict('A')).toEqual(expect.arrayContaining(['ask', 'Apple', 'Apricot', 'Avocado']));
    expect(predictionary.predict('w')).toEqual(expect.arrayContaining(['would']));
    expect(predictionary.predict('y')).toEqual(expect.arrayContaining(['Yuzu']));
});

test('two dictionaries, predict, refine', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    predictionary.addDictionary(TESTKEY2, verbs);
    predictionary.refineDictionaries('ask');
    predictionary.refineDictionaries('Apple');
    predictionary.refineDictionaries('Apple');
    expect(predictionary.predict('A')[0]).toEqual('Apple');
    predictionary.refineDictionaries('ask');
    predictionary.refineDictionaries('ask');
    expect(predictionary.predict('A')[0]).toEqual('ask');
});

test('two dictionaries, dictionariesToJSON, loadDictionaries', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    predictionary.addDictionary(TESTKEY2, verbs);
    predictionary.addWord(TESTKEY, "Apple2");
    let json = predictionary.dictionariesToJSON();
    let newPredictionary = new Predictionary();
    newPredictionary.loadDictionaries(json);
    expect(predictionary.predict('A')).toEqual(expect.arrayContaining(['ask', 'Apple2', 'Apple', 'Apricot', 'Avocado']));
});

test('two dictionaries, useDictionary, useAllDictionaries, useDictionaries', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    predictionary.addDictionary(TESTKEY2, verbs);
    predictionary.addWord(TESTKEY, "Apple2");
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

test('refineDictionaries, with previous word, predict automatically', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    predictionary.refineDictionaries('Banana', 'Apple');
    expect(predictionary.predict('app')).toEqual(expect.arrayContaining(['Apple']));
    expect(predictionary.predict('apple ')).toEqual(expect.arrayContaining(['Banana']));
    expect(predictionary.predict('Apple ')).toEqual(expect.arrayContaining(['Banana']));
});

test('refineDictionaries, with previous word, different case, predict automatically', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    predictionary.refineDictionaries('banana', 'apple');
    expect(predictionary.predict('app')).toEqual(expect.arrayContaining(['Apple']));
    expect(predictionary.predict('apple ')).toEqual(expect.arrayContaining(['Banana']));
    expect(predictionary.predict('Apple ')).toEqual(expect.arrayContaining(['Banana']));
});

test('refineDictionaries, with previous word, different case, predict automatically, change order', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    predictionary.refineDictionaries('banana', 'apple');
    predictionary.refineDictionaries('Banana', 'apple');
    predictionary.refineDictionaries('Apricot', 'Apple');
    expect(predictionary.predict('appl')).toEqual(expect.arrayContaining(['Apple']));
    expect(predictionary.predict('apple ')).toEqual(expect.arrayContaining(['Banana', 'Apricot']));
    expect(predictionary.predict('Apple ')).toEqual(expect.arrayContaining(['Banana', 'Apricot']));
    expect(predictionary.predict('Apple ')[0]).toEqual('Banana');
    predictionary.refineDictionaries('Apricot', 'Apple');
    predictionary.refineDictionaries('apricot', 'apple');
    expect(predictionary.predict('Apple ')[0]).toEqual('Apricot');
    expect(predictionary.predict('Apple ').length).toEqual(2);
});

test('refineDictionaries, with previous word, predictNextWord', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    predictionary.refineDictionaries('banana', 'apple');
    predictionary.refineDictionaries('Apricot', 'Apple');
    expect(predictionary.predictNextWord('apple')).toEqual(expect.arrayContaining(['Banana', 'Apricot']));
    predictionary.refineDictionaries('Banana', 'Apple');
    expect(predictionary.predictNextWord('Apple')).toEqual(expect.arrayContaining(['Banana', 'Apricot']));
    expect(predictionary.predictNextWord('Apple')[0]).toEqual('Banana');
});

test('refineDictionaries, with previous word, predictCompleteWord', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    predictionary.refineDictionaries('banana', 'apple');
    predictionary.refineDictionaries('Apricot', 'Apple');
    expect(predictionary.predictCompleteWord('a')).toEqual(expect.arrayContaining(['Apple', 'Apricot', 'Avocado']));
    expect(predictionary.predictCompleteWord('appl').length).toEqual(1);
    expect(predictionary.predictCompleteWord('appl')[0]).toEqual('Apple');
    predictionary.refineDictionaries('Apricot', 'Apple');
    expect(predictionary.predictCompleteWord('a')).toEqual(expect.arrayContaining(['Apple', 'Apricot', 'Avocado']));
    expect(predictionary.predictCompleteWord('a')[0]).toEqual('Apricot');
});

test('predictCompleteWord, with spaces', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    expect(predictionary.predictCompleteWord(' a  ')).toEqual(expect.arrayContaining(['Apple', 'Apricot', 'Avocado']));
    expect(predictionary.predictCompleteWord('  appl  ')).toEqual(['Apple']);
});

test('predictNextWord, with spaces', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    predictionary.refineDictionaries('Apricot', 'Apple');
    expect(predictionary.predictNextWord(' apple  ')).toEqual(['Apricot']);
});

test('predictNextWord, with previous text', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    predictionary.refineDictionaries('Apricot', 'Apple');
    expect(predictionary.predictNextWord('i want an apple  ')).toEqual(['Apricot']);
    expect(predictionary.predictNextWord('i want an apple')).toEqual(['Apricot']);
    expect(predictionary.predictNextWord('i want an appl')).toEqual([]);
});

test('predictCompleteWord, with previous text', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    expect(predictionary.predictCompleteWord('i want an apple  ')).toEqual(['Apple']);
    expect(predictionary.predictCompleteWord('i want an apple')).toEqual(['Apple']);
    expect(predictionary.predictCompleteWord('i want an ap')).toEqual(expect.arrayContaining(['Apple', 'Apricot']));
});

test('predict, with previous text, automatically', () => {
    predictionary.addDictionary(TESTKEY, fruits);
    predictionary.refineDictionaries('Apricot', 'Apple');
    expect(predictionary.predict('i want an apple  ')).toEqual(['Apricot']);
    expect(predictionary.predict('i want an apple')).toEqual(['Apple']);
    expect(predictionary.predict('i want an ap')).toEqual(expect.arrayContaining(['Apple', 'Apricot']));
});