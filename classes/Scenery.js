const Object = require('./Object');

class Scenery extends Object {
    constructor(name, id = null) {
        super("scenery", name, id);
    }
}

module.exports = {
    Scenery
}