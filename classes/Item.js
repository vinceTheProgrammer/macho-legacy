const Object = require('./Object');

class Item extends Object {
    constructor(name, id = null) {
        super("item", name, id);
    }
}

module.exports = {
    Item
}