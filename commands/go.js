const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('go')
		.setDescription('Moves you in the specified direction in the game world.')
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
	async execute(interaction, world) {

        const direction = interaction.options.getString('direction');

        let directionObj = {
            x: direction.split(' ')[0],
            y: direction.split(' ')[1]
        }

        world.sync();

        let location = world.findObjById(interaction.user.id, "player");
		if (location.x == null && location.y == null) {
			return interaction.reply("You are not present in the game world! Use `/spawn` to spawn in the game world!");
		}
        let newLocation = world.moveObjectInDirection(directionObj.x, directionObj.y, world.getObject(interaction.user.id, "player"));

        if (newLocation.x === null && newLocation.y === null) {
            return interaction.reply('The space you are attempting to travel to is outside of the world boundary, so you have not been moved.');
        }

		world.sync();

		if (world.isOccupied(newLocation.x, newLocation.y)) {
			return interaction.reply('The space you are attempting to travel to is occupied by another player, so you have not been moved.');
		}

		newLocation = world.moveObjectInDirection(directionObj.x, directionObj.y, world.getObject(interaction.user.id, "player"));

        world.save();

		console.log(newLocation);

        let newCoords = world.worldSpace(newLocation);
		console.log(newCoords);
        let coords = world.worldSpace(location);
		return interaction.reply(`Moved you from (${coords.x}, ${coords.y}) to (${newCoords.x}, ${newCoords.y})!`);
	},
};