let itemFactory = {};

itemFactory.createItem = function (word, frequency) {
    if (!word) {
        throw 'parameter "word" must be specified.';
    }
    let frequencyInt = parseInt(frequency);
    return {
        word: word,
        frequency: isNaN(frequencyInt) ? 0 : frequencyInt,
        transitions: {}
    }
};

export default itemFactory;