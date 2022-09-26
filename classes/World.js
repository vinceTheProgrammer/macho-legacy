const fs = require('fs');
const { getSignOfNumber } = require('../utils/getSignOfNumber');
const { Item } = require('./Item');
const { Player } = require('./Player');
const { Scenery } = require('./Scenery');

class World {
    constructor(worldFile) {
        this.worldFile = worldFile;
        this.sync(this.worldFile);
    }
    sync() {
        let rawdata = fs.readFileSync(this.worldFile);
		this.world = JSON.parse(rawdata);
        this.origin = {x: Math.floor(this.world.space.length / 2), y: Math.floor(this.world.space[0].length / 2), type: 'array'};
    }
    add(object, x, y) {
        this.world.space[x][y].push(object);
    }

    worldSpace(coords, object) {
        //console.log(coords);
        switch(coords.type) {
            case 'array':
                //console.log('arrayed');
                let worldX = coords.x - this.origin.x;
                let worldY = (coords.y - this.origin.y) * -1;
                return {x: worldX, y: worldY, type: 'world'};
            case 'object':
                //console.log('objected');
                //console.log(object);
                const objectLocation = object.locate(this);
                console.log(objectLocation);
                let objectX = coords.x + objectLocation.x;
                let objectY = coords.y + objectLocation.y;
                console.log({ x: objectX, y: objectY, type: 'world'});
                return { x: objectX, y: objectY, type: 'world'};
            default:
                //console.log('defaulted');
                return {x:null,y:null,type:null};
        }
    }

    arraySpace(coords, object) {
        //.log('ARRAY:', coords);
        switch(coords.type) {
            case 'world':
                let arrayX = this.origin.x + coords.x;
                let arrayY = (this.origin.y + (coords.y * -1));
                return {x: arrayX, y: arrayY, type: 'array'};
            case 'object':
                //console.log(this.worldSpace(coords, object));
                return this.arraySpace(this.worldSpace(coords, object));
            default:
                return {x:null,y:null,type:null};
        }
    }

    expandWorld(directionX, directionY, amount) {

    }

    expandWorldUniform(amount) {
        this.world.space.push(new Array(this.world.space[0].length).fill([]));
        this.world.space.unshift(new Array(this.world.space[0].length).fill([]));
        this.world.space.forEach(column => {
            column.push([]);
            column.unshift([]);
        });
    }

    save() {
        let data = JSON.stringify(this.world);
		fs.writeFileSync(this.worldFile, data);
    }

    isOccupied(x, y) {
        let bool = this.world.space[x][y].filter(obj => { return obj.type == "player" || obj.type == "scenery"}).length > 0;
        return bool;
    }

    increasePlayerStat(amount) {
        this.world.stats.players += 1;
        if (this.world.stats.players >= this.world.stats.nextBorderIncrease) {
            this.expandWorldUniform(1);
            this.world.stats.nextBorderIncrease *= 2;
        }
    }

    findObjById(id, type) {
        let col = this.world.space.findIndex(col => col.findIndex(row => row.findIndex(obj => obj.id == id && obj.type == type) != -1) != -1);
        let row = -1;
        let z = -1;
        if (col != -1) {
            row = this.world.space[col].findIndex(row => row.findIndex(obj => obj.id == id && obj.type == type) != -1);
        }
        if (row != -1) {
            z = this.world.space[col][row].findIndex(obj => obj.id == id && obj.type == type);
            return { x: col, y: row , z: z, type: 'array'};
        } else {
            return { x: null, y: null, z: null, type: null};
        }
    }

    findObj(obj) {
        //console.log(obj);
        if (!obj.name || !obj.id || !obj.type) {
            return { x: null, y: null, z: null, type: null, note: 'An irregularly formatted object was passed to the findObj function.'};
        }
        let col = this.world.space.findIndex(col => col.findIndex(row => row.findIndex(el => el.name == obj.name && el.id == obj.id && el.type == obj.type) != -1) != -1);
        let row = -1;
        let z = -1;
        if (col != -1) {
            row = this.world.space[col].findIndex(row => row.findIndex(el => el.name == obj.name && el.id == obj.id && el.type == obj.type) != -1);
        }
        if (row != -1) {
            z = this.world.space[col][row].findIndex(el => el.name == obj.name && el.id == obj.id && el.type == obj.type);
            return { x: col, y: row, z: z, type: 'array'};
        } else {
            return { x: null, y: null, z: null, type: null};
        }
    }

    moveObjectTo(newX, newY, object) {
        let location = this.findObj(object);
        let x = location.x;
        let y = location.y;
        let z = location.z;

        if (this.world.space[newX] == undefined){
            return { x: null, y: null, type: null};
        } else if (this.world.space[newX][newY] == undefined) {
            return { x: null, y: null , type: null}
        }

        this.world.space[x][y].splice(z, 1);
        this.world.space[newX][newY].push(object);
        return {x: newX, y: newY, type: 'world'}
    }

    createObject(x, y, type, name, id = null) {
        let object;
        switch (type) {
            case "player":
                object = new Player(name, id);
                break;
            case "item":
                object = new Item(name, id)
                break;
            case "scenery":
                object = new Scenery(name, id)
                break;
            default:
                object = new Object(type, name, id);
        }

        //console.log(object);
        //console.log(this.world.space[x]);

        if (this.world.space[x] == undefined){
            return { x: null, y: null, type: null};
        } else if (this.world.space[x][y] == undefined) {
            //console.log(this.world.space[x][y]);
            return { x: null, y: null, type: null}
        }


        this.world.space[x][y].push(object);

        return { x: x, y: y, object: object, type: 'world'}
    }

    moveObjectInDirection(directionX, directionY, object, speed = 1) {
        let location = this.findObj(object);
        let x = location.x;
        let y = location.y;
        let z = location.z;
        let newX = x + getSignOfNumber(directionX) * speed;
        let newY = y + (getSignOfNumber(directionY) * -1) * speed;

        if (this.world.space[newX] == undefined){
            return { x: null, y: null, type: null};
        } else if (this.world.space[newX][newY] == undefined) {
            return { x: null, y: null, type: null}
        }

        this.world.space[x][y].splice(z, 1);
        this.world.space[newX][newY].push(object);

        return {x: newX, y: newY, type: 'array'}
    }

    getObjectsInDirection(directionX, directionY, object, distance = 1) {
        let location = this.findObj(object);
        let x = location.x;
        let y = location.y;
        let z = location.z;
        let newX = x + getSignOfNumber(directionX) * distance;
        let newY = y + (getSignOfNumber(directionY) * -1) * distance;

        if (this.world.space[newX] == undefined){
            return { x: null, y: null, type: null};
        } else if (this.world.space[newX][newY] == undefined) {
            return { x: null, y: null, type: null}
        }

        let objects = this.world.space[newX][newY];

        return {x: newX, y: newY, objects: objects, type: 'array'}
    }

    getObject(id, type) {
        let location = this.findObjById(id, type);
        return this.world.space[location.x][location.y][location.z];
    }  

    getWorldSpace() {
        return this.world.space;
    }
}

module.exports = {
    World
}