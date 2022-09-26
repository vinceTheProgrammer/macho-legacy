const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('location')
		.setDescription('Gives your current location in the game world.'),
	async execute(interaction, world) {
        world.sync();
        let location = world.findObjById(interaction.user.id, "player");
		if (location.x == null && location.y == null) {
			return interaction.reply("You are not present in the game world! Use `/spawn` to spawn in the game world!");
		}
        let coords = world.worldSpace(location);
		return interaction.reply(`You are at (${coords.x}, ${coords.y}).`);
	},
};