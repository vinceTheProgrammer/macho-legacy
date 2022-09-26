const Object = require('./Object');

class Player extends Object {
    constructor(name, id = null) {
        super("player", name, id);
        if (id != null) {
            this.id = id;
        }
    }
}

module.exports = {
    Player
}