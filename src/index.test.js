import predicitionary from './index.mjs'

let TESTKEY = 'TESTKEY';
let fruits = ['Apple', 'Apricot', 'Avocado', 'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry', 'Boysenberry', 'Currant', 'Cherry', 'Cherimoya', 'Cloudberry', 'Coconut', 'Cranberry', 'Cucumber', 'Damson', 'Date', 'Dragonfruit', 'Durian', 'Elderberry', 'Feijoa', 'Fig', 'Goji', 'Gooseberry', 'GrapeRaisin', 'Grapefruit', 'Guava', 'Honeyberry', 'Huckleberry', 'Jabuticaba', 'Jackfruit', 'Jambul', 'Jujube', 'Kiwifruit', 'Kumquat', 'Lemon', 'Lime', 'Loquat', 'Longan', 'Lychee', 'Mango', 'Marionberry', 'Melon', 'Cantaloupe', 'Watermelon', 'Mulberry', 'Nectarine', 'Nance', 'Olive', 'Orange', 'Clementine', 'Mandarine', 'Tangerine', 'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Physalis', 'Plantain', 'Pineapple', 'Pomegranate', 'Pomelo', 'Quince', 'Raspberry', 'Salmonberry', 'Rambutan', 'Redcurrant', 'Salak', 'Satsuma', 'Soursop', 'Strawberry', 'Tamarillo', 'Tamarind', 'Yuzu'];

test('addDictionary, predict', () => {
    predicitionary.addDictionary(TESTKEY, fruits);
    expect(predicitionary.predict('A')).toEqual(['Apple', 'Apricot', 'Avocado']);
    expect(predicitionary.predict('a')).toEqual(['Apple', 'Apricot', 'Avocado']);
    expect(predicitionary.predict('ap')).toEqual(['Apple', 'Apricot']);
    expect(predicitionary.predict('app')).toEqual(['Apple']);
});

test('predict, refine', () => {
    predicitionary.addDictionary(TESTKEY, fruits);
    expect(predicitionary.predict('A')).toEqual(['Apple', 'Apricot', 'Avocado']);
    predicitionary.refineDictionaries('Apricot');
    expect(predicitionary.predict('a')).toEqual(['Apricot', 'Apple', 'Avocado']);
    predicitionary.refineDictionaries('Avocado');
    predicitionary.refineDictionaries('Avocado');
    expect(predicitionary.predict('a')).toEqual(['Avocado', 'Apricot', 'Apple']);
});

test('predict empty, refine', () => {
    predicitionary.addDictionary(TESTKEY, fruits);
    expect(predicitionary.predict('')).toEqual(expect.arrayContaining(fruits));
    predicitionary.refineDictionaries('Cherry');
    let result = predicitionary.predict('');
    expect(result).toEqual(expect.arrayContaining(fruits));
    expect(result[0]).toEqual('Cherry');
});

test('predict, option numberOfPredictions', () => {
    predicitionary.addDictionary(TESTKEY, fruits);
    let result = predicitionary.predict('', {maxPredicitons: 5});
    expect(result.length).toEqual(5);
    expect(fruits).toEqual(expect.arrayContaining(result));
});

test('predict, option numberOfPredictions, refine', () => {
    predicitionary.addDictionary(TESTKEY, fruits);
    predicitionary.refineDictionaries('Cherry');
    predicitionary.refineDictionaries('Coconut');
    predicitionary.refineDictionaries('Coconut');
    let result = predicitionary.predict('', {maxPredicitons: 5});
    expect(result.length).toEqual(5);
    expect(fruits).toEqual(expect.arrayContaining(result));
    expect(result[0]).toEqual('Coconut');
    expect(result[1]).toEqual('Cherry');
});

test('addWord, single string', () => {
    predicitionary.addDictionary(TESTKEY, fruits);
    predicitionary.addWord(TESTKEY, 'Test');
    expect(predicitionary.predict('')).toEqual(expect.arrayContaining(fruits.concat(['Test'])));
    predicitionary.refineDictionaries('Test');
    let result = predicitionary.predict('');
    expect(result).toEqual(expect.arrayContaining(fruits.concat(['Test'])));
    expect(result[0]).toEqual('Test');
});

test('addWord, with frequency', () => {
    predicitionary.addDictionary(TESTKEY, fruits);
    predicitionary.addWord(TESTKEY, {
        word: 'Test',
        frequency: 2
    });
    let result = predicitionary.predict('');
    expect(result).toEqual(expect.arrayContaining(fruits.concat(['Test'])));
    expect(result[0]).toEqual('Test');
});

test('refine, with adding', () => {
    predicitionary.addDictionary(TESTKEY, fruits);
    predicitionary.refineDictionaries('Test', null, TESTKEY);
    let result = predicitionary.predict('', {maxPredicitons: 1});
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual('Test');
});