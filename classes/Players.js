const fs = require('fs');
const PlayerEntry = require('./PlayerEntry');

class Players {
    constructor(playersFile) {
        this.playersFile = playersFile;
        this.sync(this.playersFile);
    }
    sync() {
        let rawdata = fs.readFileSync(this.playersFile);
		this.players = JSON.parse(rawdata);
    }
    addPlayer(name, id) {
        this.players.players.push(new PlayerEntry(name, id));
    }
    save() {
        let data = JSON.stringify(this.players);
		fs.writeFileSync(this.playersFile, data);
    }
}

module.exports = {
    Players
}