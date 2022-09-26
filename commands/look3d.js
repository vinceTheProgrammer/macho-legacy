const { SlashCommandBuilder } = require('@discordjs/builders');
const { getCardinalDirection } = require('../utils/getCardinalDirection');
const { MessageAttachment, MessageEmbed} = require('discord.js');
const THREE = require('three');
const fs = require('fs');
const SoftwareRenderer = require("three-software-renderer");
const PNG = require("pngjs").PNG;
const request = require('request');
const { worldToScene } = require('../utils/worldToScene');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('look3d')
		.setDescription('Describes all objects in the specified direction.')
        .addStringOption(option => 
			option.setName('direction')
			.setDescription('one of the 8 cardinal directions')
			.setRequired(true)
			.addChoice('North', '0 1')
			.addChoice('South', '0 -1')
			.addChoice('East', '1 0')
			.addChoice('West', '-1 0')
			.addChoice('North-West', '-1 1')
			.addChoice('North-East', '1 1')
			.addChoice('South-West', '-1 -1')
			.addChoice('South-East', '1 -1')),
	async execute(interaction, world, client) {

		interaction.deferReply();

        const direction = interaction.options.getString('direction');
		const cardinalDir = getCardinalDirection(direction);
		let players = "";
		let items = "";
		let scenery = "";

        let directionObj = {
            x: direction.split(' ')[0],
            y: direction.split(' ')[1]
        }

        world.sync();

		let location = world.findObjById(interaction.user.id, "player");
		if (location.x == null && location.y == null) {
			return interaction.followUp("You are not present in the game world! Use `/spawn` to spawn in the game world!");
		}

        let objects = world.getObjectsInDirection(directionObj.x, directionObj.y, world.getObject(interaction.user.id, "player"));

		if (objects.x == null && objects.y == null) {
			return interaction.followUp("That space is outside of the world border.");
		}

		let playersArr = objects.objects.filter(obj => obj.type == "player");
		let itemsArr = objects.objects.filter(obj => obj.type == "item");
		let sceneryArr = objects.objects.filter(obj => obj.type == "scenery");

		if (playersArr.length == 0) {
			players = "None\n"
		} else {
			playersArr.forEach(player => {
				let playerName = player.name;
				let playerDiscordObj = client.users.cache.get(player.id);
				if (playerDiscordObj != undefined) {
					if (playerDiscordObj.tag != undefined) {
						playerName = playerDiscordObj.tag;
					}
				}
				players = players + playerName + "\n";
			});
		}
		if (itemsArr.length == 0) {
			items = "None\n"
		} else {
			itemsArr.forEach(item => {
				items = items + item.name + "\n";
			});
		}
		if (sceneryArr.length == 0) {
			scenery = "None\n"
		} else {
			sceneryArr.forEach(sceneryObj => {
				scenery = scenery + sceneryObj.name + "\n";
			});
		}

        let lookCoords = world.worldSpace(objects);

		drawWorld(interaction.user.id, world, directionObj, client).then(() => {
			console.log("Sending world!");
			const file = new MessageAttachment('./output/look.png');
			const embed = new MessageEmbed()
				.setTitle(`${cardinalDir}`)
				.addField(`(${lookCoords.x}, ${lookCoords.y})`, `E`)
				.setImage('attachment://look.png');

			if (players != 'None\n') {
				embed.addField('Players', players);
			}
			if (scenery != 'None\n') {
				embed.addField('Scenery', scenery);
			}
			if (items != 'None\n') {
				embed.addField('Items', items);
			}

			return interaction.editReply({ embeds: [embed], files: [file] });
		})
	},
};

async function drawWorld(id, world, directionObj, client) {
    return new Promise((resolve, reject) => {
		const renderDistance = 8;
		worldToScene(world, world.getObject(id, 'player'), renderDistance, client).then(parent => {
		const width = 1024;
        const height = 1024;

		const camera = new THREE.PerspectiveCamera(90, width / height, 0.001, 25000);
		camera.position.y = 300;
		camera.position.z = 0;
		camera.position.x = 0;
		camera.lookAt(directionObj.x * 100 + 0,250,-directionObj.y * 100 - 0);
		console.log(directionObj.x * 100, -directionObj.y * 100);
		//camera.rotation.x = 330 * Math.PI / 180;
		//camera.rotation.y = 10 * Math.PI / 180;

		// Create pfp material
		//console.log(it.width);
		//console.log(it.height);
		/*
		let dataTex = new THREE.DataTexture(Uint8Array.from(it.data), side1, side2, THREE.RGBAFormat, THREE.UnsignedByteType, THREE.UVMapping);
		const material = new THREE.MeshBasicMaterial({
			map: dataTex
		})
		*/

		let scene = new THREE.Scene();

		// Create a simple red cube
		//const geometry = new THREE.BoxGeometry(200, 200, 200);
		//const material = new THREE.MeshLambertMaterial({color: 0xff0000});
		//const mesh = new THREE.Mesh(geometry, material);
		//const mesh2 = new THREE.Mesh(geometry, material);

		
		// Rotate the cube a bit
		//mesh.rotation.x += Math.random();
		//mesh.rotation.y += Math.random();
		
		//const parent = await worldToScene(world, world.getObject(id, 'player'), renderDistance);

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
		scene.add(ambientLight);


		const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
		dirLight.position.set(10, 20, 0); // x, y, z
		scene.add(dirLight);

		//const scene = new THREE.Scene();
		//mesh2.position.set(300, 1, 2);
		//mesh.position.set(100, 3, 5);
		//parent.add(mesh2);
		//parent.add(mesh);

		

		scene.add(parent);

		
		const renderer = new SoftwareRenderer({
			alpha: false
			});
		renderer.setSize(width, height);

		var imagedata = renderer.render(scene, camera);

		// Create a PNG from the array
		const png = new PNG({
			width: width,
			height: height,
			filterType: -1
		});
		
		// Copy byte array to png object  
		for(var i=0;i<imagedata.data.length;i++) {
		png.data[i] = imagedata.data[i];
		}
		
		// Write PNG to disk
		if (!fs.existsSync("output")) {
		fs.mkdirSync("output");
		}
		let stream = png.pack().pipe(fs.createWriteStream("output/look.png"));

		stream.on("finish", () => {
			console.log("Drew world!");
			resolve();
		});
		stream.on('error', reject);


		});
    })
}
