const THREE = require('three');
const Object = require('../classes/Object');
const randomColor = require('random-color');
const PNG = require("pngjs").PNG;
const fs = require('fs');
const request = require('request');

function worldToScene(world, originObject, radius, client) {
    return new Promise((resolve, reject) => {
        let parent = new THREE.Object3D();
        let sceneArray = [];
        let promises = [];
        //let promises2 = [];


        //scene.add({type:'player'},100, 0);
        //scene.add({type:'player'},200, 0);

        /*
        promises.push(
            new Promise((resolvee, reject) => {
                const skyboxArr = [
                    './resources/images/skybox/sky_ft.png',
                    './resources/images/skybox/sky_bk.png',
                    './resources/images/skybox/sky_lf.png',
                    './resources/images/skybox/sky_rt.png',
                    './resources/images/skybox/sky_up.png',
                    './resources/images/skybox/sky_dn.png'
                ]
                let front;
                let back;
                let left;
                let right;
                let up;
                let down;
                promises2.push(loadPNGPath(skyboxArr[0]).then(it => front = it));
                promises2.push(loadPNGPath(skyboxArr[1]).then(it => back = it));
                promises2.push(loadPNGPath(skyboxArr[2]).then(it => left = it));
                promises2.push(loadPNGPath(skyboxArr[3]).then(it => right = it));
                promises2.push(loadPNGPath(skyboxArr[4]).then(it => up = it));
                promises2.push(loadPNGPath(skyboxArr[5]).then(it => down = it));

                Promise.all(promises2).then(() => {
                    let dataTexF = new THREE.DataTexture(Uint8Array.from(front.data), front.width, front.height, THREE.RGBAFormat, THREE.UnsignedByteType, THREE.UVMapping);
                    const frontMat = new THREE.MeshBasicMaterial({
                        map: dataTexF
                    })
                    let dataTexB = new THREE.DataTexture(Uint8Array.from(back.data), back.width, back.height, THREE.RGBAFormat, THREE.UnsignedByteType, THREE.UVMapping);
                    const backMat = new THREE.MeshBasicMaterial({
                        map: dataTexB
                    })
                    let dataTexL = new THREE.DataTexture(Uint8Array.from(left.data), left.width, left.height, THREE.RGBAFormat, THREE.UnsignedByteType, THREE.UVMapping);
                    const leftMat = new THREE.MeshBasicMaterial({
                        map: dataTexL
                    })
                    let dataTexR = new THREE.DataTexture(Uint8Array.from(right.data), right.width, right.height, THREE.RGBAFormat, THREE.UnsignedByteType, THREE.UVMapping);
                    const rightMat = new THREE.MeshBasicMaterial({
                        map: dataTexR
                    })
                    let dataTexU = new THREE.DataTexture(Uint8Array.from(up.data), up.width, up.height, THREE.RGBAFormat, THREE.UnsignedByteType, THREE.UVMapping);
                    const upMat = new THREE.MeshBasicMaterial({
                        map: dataTexU
                    })
                    let dataTexD = new THREE.DataTexture(Uint8Array.from(down.data), down.width, down.height, THREE.RGBAFormat, THREE.UnsignedByteType, THREE.UVMapping);
                    const downMat = new THREE.MeshBasicMaterial({
                        map: dataTexD
                    })

                    let sizo = 300

                    const skyboxGeoU = new THREE.BoxGeometry(sizo,10,sizo);
                    const skyboxGeoD = new THREE.BoxGeometry(sizo,10,sizo);
                    const skyboxGeoL = new THREE.BoxGeometry(10,sizo,sizo);
                    const skyboxGeoR = new THREE.BoxGeometry(10,sizo,sizo);
                    const skyboxGeoF = new THREE.BoxGeometry(sizo,sizo,10);
                    const skyboxGeoB = new THREE.BoxGeometry(sizo,sizo,10);
                    let upMesh = new THREE.Mesh(skyboxGeoU, upMat);
                    let downMesh = new THREE.Mesh(skyboxGeoD, downMat);
                    let leftMesh = new THREE.Mesh(skyboxGeoL, leftMat);
                    let rightMesh = new THREE.Mesh(skyboxGeoR, rightMat);
                    let frontMesh = new THREE.Mesh(skyboxGeoF, frontMat);
                    let backMesh = new THREE.Mesh(skyboxGeoB, backMat);


                    upMesh.frustumCulled = false;
                    downMesh.frustumCulled = false;
                    leftMesh.frustumCulled = false;
                    rightMesh.frustumCulled = false;
                    frontMesh.frustumCulled = false;
                    backMesh.frustumCulled = false;

                    upMesh.visible = true;
                    downMesh.visible = true;
                    leftMesh.visible = true;
                    rightMesh.visible = true;
                    frontMesh.visible = true;
                    backMesh.visible = true;


                    //downMesh.geometry.computeBoundingBox();
                    //downMesh.geometry.computeBoundingSphere();
                    //downMesh.geometry.boundingSphere.radius = 100000;
                    console.log('RADIUS', downMesh.geometry);

                    upMesh.position.set(0, 350, 0);
                    downMesh.position.set(0, -8, 0);
                    leftMesh.position.set(-150, 200, 0);
                    rightMesh.position.set(150, 200, 0);
                    frontMesh.position.set(0, 200, 150);
                    backMesh.position.set(0, 200, -150);

                    
                    parent.add(upMesh);
                    parent.add(downMesh);
                    parent.add(leftMesh);
                    parent.add(rightMesh);
                    parent.add(frontMesh);
                    parent.add(backMesh);

                    console.log('DONE!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

                    resolvee();
                })
            })
        )
        */
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
		parent.add(ambientLight);


		const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
		dirLight.position.set(10, 20, 0); // x, y, z
		parent.add(dirLight);


        //const skyboxGeo = new THREE.BoxGeometry(50,50,50);
        //const skyboxMat = new THREE.MeshLambertMaterial({ color: 0x66cbff });
        //const skyboxMesh = new THREE.Mesh(skyboxGeo, skyboxMat);

        world.sync();

        let worldSpace = world.getWorldSpace();

        let x;
        let y;
        originObject = new Object(originObject.type, originObject.name, originObject.id);
        //console.log(originObject);
        const location = world.arraySpace({x:Math.floor(-radius),y:Math.floor(radius),type:'object'}, originObject);
        //console.log(location);

        for(let i = 0;i < radius * 2 + 1;i++) {
            sceneArray.push([]);
            x = location.x + i;
            for(let j = 0;j < radius * 2 + 1;j++) {
                sceneArray[i].push([]);
                y = location.y + j;
                //console.log(x,y);
                let space;
                if (worldSpace[x] != undefined) {
                    space = worldSpace[x][y];
                } else {
                    space = undefined;
                }
                //console.log(space);
                if (space == undefined) {
                    sceneArray[i][j] = null;
                } else {
                    sceneArray[i][j] = space;
                }
            }
        }

        //console.log("FINAL ARRAY:",sceneArray);

        sceneArray.forEach((col, cIndex) => {
            col.forEach((row, rIndex) => {
                if (row == null) {
                    //parent = addBoundry(cIndex, rIndex, scene);
                } else {
                    promises.push(createGround(playerWorldSpace({x:cIndex,y:rIndex,type:'player-array'}, radius), './resources/images/grass.png').then(mesh => {
                        parent.add(mesh);
                    }));
                    row.forEach(obj => {
                        if (obj.type == 'player') {
                            promises.push(new Promise((resolve, reject) => {
                                downloadAvatar(obj.id, client).then(() => {
                                    createObject(obj,playerWorldSpace({x:cIndex,y:rIndex,type:'player-array'}, radius)).then(mesh => {
                                        parent.add(mesh);
                                        //console.log('resolved bro');
                                        resolve();
                                    });
                                });
                            }));
                        }
                    })
                }
            })
        })
    //console.log(scene);

        Promise.all(promises).then(() => {
            //console.log('resolved bro')
            resolve(parent);
        })
    });
}

function addBoundry(x, y, scene) {
    return scene;
}

function createObject(obj, coords) {
    return new Promise((resolve, reject) => {
        loadPNG(obj.id).then(it => {
            const side1 = it.width;
		    const side2 = it.height;
            let dataTex = new THREE.DataTexture(Uint8Array.from(it.data), side1, side2, THREE.RGBAFormat, THREE.UnsignedByteType, THREE.UVMapping);
            const material = new THREE.MeshBasicMaterial({
                map: dataTex
            })
            color = randomColor().rgbString();
            //material = new THREE.MeshLambertMaterial({color: color});
            const geometry = new THREE.BoxGeometry(200, 200, 200);
            const mesh = new THREE.Mesh(geometry, material);
            //console.log(coords.x,coords.y);
            mesh.position.x = coords.x * 300 * 1;
            mesh.position.z = coords.y * 300 * -1;
            //console.log(mesh.position);
            resolve(mesh);
        });
    });
}

function createObjectPath(obj, coords) {
    return new Promise((resolve, reject) => {
        loadPNG(obj.id).then(it => {
            const side1 = it.width;
		    const side2 = it.height;
            let dataTex = new THREE.DataTexture(Uint8Array.from(it.data), side1, side2, THREE.RGBAFormat, THREE.UnsignedByteType, THREE.UVMapping);
            const material = new THREE.MeshBasicMaterial({
                map: dataTex
            })
            color = randomColor().rgbString();
            //material = new THREE.MeshLambertMaterial({color: color});
            const geometry = new THREE.BoxGeometry(200, 200, 200);
            const mesh = new THREE.Mesh(geometry, material);
            //console.log(coords.x,coords.y);
            mesh.position.x = coords.x * 300 * 1;
            mesh.position.z = coords.y * 300 * -1;
            //console.log(mesh.position);
            resolve(mesh);
        });
    });
}

function playerWorldSpace(coords, radius) {
    origin = {x: Math.floor((radius * 2 + 1) / 2), y: Math.floor((radius * 2 + 1) / 2), type: 'player-array'};
    //console.log(origin);
    let worldX = coords.x - origin.x;
    let worldY = (coords.y - origin.y) * -1;
    return {x: worldX, y: worldY, type: 'player-world'};
}

async function loadPNG(id) {
	return new Promise((resolve, reject) => {
		fs.createReadStream(`./resources/cache/${id}.png`)
		.pipe(
			new PNG({
			filterType: -1,
			})
		)
		.on("parsed", function () {
			resolve(this);
		})
	})
}

function downloadAvatar(id, client) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(`./resources/cache/${id}.png`)) {
            //console.log(`${id} already present!`);
            resolve;
        }
        client.users.fetch(id).then(user => {
            let stream = request.get(user.displayAvatarURL({format:'png', size: 64}))
            .on('error', console.error)
            .pipe(fs.createWriteStream(`./resources/cache/${id}.png`));
            stream.on("finish", resolve);
            stream.on('error', reject);
        });
    });
}

async function loadPNGPath(path) {
	return new Promise((resolve, reject) => {
		fs.createReadStream(path)
		.pipe(
			new PNG({
			filterType: -1,
			})
		)
		.on("parsed", function () {
            console.log('AYO WE DONE');
			resolve(this);
		})
	})
}

function createMultiMaterialObject( geometry, materials ) {

    const group = new THREE.Group();

    for ( let i = 0, l = materials.length; i < l; i ++ ) {

        group.add( new THREE.Mesh( geometry, materials[ i ] ) );

    }

    return group;

}

function createGround(coords, texturePath) {
    return new Promise((resolve, reject) => {
        loadPNGPath(texturePath).then(it => {
            let groundGeo = new THREE.BoxGeometry(300, 5, 300);
            const side1 = it.width;
		    const side2 = it.height;
            let dataTex = new THREE.DataTexture(Uint8Array.from(it.data), side1, side2, THREE.RGBAFormat, THREE.UnsignedByteType, THREE.UVMapping);
            const groundTex = new THREE.MeshBasicMaterial({
                map: dataTex
            })
            let groundMesh = new THREE.Mesh(groundGeo, groundTex);
            groundMesh.position.set(coords.x * 300 * 1, -150, coords.y * 300 * -1);

            console.log('ground bro');
            //console.log(obj.name);
            console.log(groundMesh.position);
            resolve(groundMesh);
        });
    });
}


module.exports = {
    worldToScene
}