class Object {
    constructor(type = "object", name, id = null) {
        this.type = type;
        if (id != null) {
            this.id = id;
        } else {
            this.id = this.generateObjId();
        }
        this.name = name;
    }

    generateObjId() {
        return Date.now();
    }

    locate(world) {
        let location = world.findObj(this);
        return world.worldSpace(location);
    }

    objectSpace(coords, world) {
        let x = coords.x;
        let y = coords.y;

        switch(coords.type) {
            case 'world':
                break;
            case 'array':
                x = world.worldSpace(coords).x;
                y = world.worldSpace(coords).y;
                break;
            default:
                return {x:null,y:null,type:null};
        }

        const objectLocation = this.locate(world);
        let objectX = x + (-1 * objectLocation.x);
        let objectY = y + (-1 * objectLocation.y);

        return { x: objectX, y: objectY, type: 'object'};
    }
}

module.exports = Object