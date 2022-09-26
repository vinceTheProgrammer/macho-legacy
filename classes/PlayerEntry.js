const { Player } = require('./Player');

class PlayerEntry extends Player {
    constructor(name, id = null) {
        super(name, id);
        if (id != null) {
            this.id = id;
        }

        this.inventory = [null, null, null, null, null, null, null, null, null];

        this.stats = {
            vitals: {
                health: 10,
                stamina: 10
            },
            skills: {
                strength: 1,
                agility: 1,
                endurance: 1,
                intelligence: 1
            },
            statistics: {
                distanceTraveled: 0,
                itemsPickedUp: 0,
            }
        };

        this.abilities = {};

        this.effects = [];
    }
}

module.exports = {
    Player: PlayerEntry
}