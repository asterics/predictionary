let itemFactory = {};

itemFactory.createItem = function (word, frequency) {
    if (!word) {
        throw 'parameter "word" must be specified.';
    }
    let frequencyInt = parseInt(frequency);
    return {
        w: word,
        f: isNaN(frequencyInt) ? 0 : frequencyInt,
        t: {}
    }
};

export default itemFactory;