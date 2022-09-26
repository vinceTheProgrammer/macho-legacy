const { SlashCommandBuilder } = require('@discordjs/builders');
const { getCardinalDirection } = require('../utils/getCardinalDirection');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('look')
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
			return interaction.reply("You are not present in the game world! Use `/spawn` to spawn in the game world!");
		}

        let objects = world.getObjectsInDirection(directionObj.x, directionObj.y, world.getObject(interaction.user.id, "player"));

		if (objects.x == null && objects.y == null) {
			return interaction.reply("That space is outside of the world border.");
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
		return interaction.reply(`The space to the ${cardinalDir} of you at (${lookCoords.x}, ${lookCoords.y}) is occupied by:\n**Players:**\n${players}\n**Items:**\n${items}\n**Scenery:**\n${scenery}`);
	},
};