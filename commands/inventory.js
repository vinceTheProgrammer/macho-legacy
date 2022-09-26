const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inventory')
		.setDescription('Shows your current inventory.'),
	async execute(interaction, world, client, players) {
        players.sync();
		return interaction.reply(`You are at (${coords.x}, ${coords.y}).`);
	},
};