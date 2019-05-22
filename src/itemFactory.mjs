let itemFactory = {};

itemFactory.createItem = function (word, rank) {
    if (!word) {
        throw 'parameter "word" must be specified.';
    }
    let rankInt = parseInt(rank);
    let returnObject = {
        w: word, //the word
        f: 0, //frequency how often the user has used this word
        t: {} //transitions to other words
    };
    if (isInteger(rankInt)) {
        returnObject.r = rankInt; //an inital rank of the word -> lower means more common
    }
    return returnObject;
};

function isInteger(value) {
    return value == parseInt(value);
}

export default itemFactory;