const { SlashCommandBuilder } = require('@discordjs/builders');
const fsExtra = require('fs-extra');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear-cache')
		.setDescription('Clears MyMachoOnline\'s File Cache. (deletes temporary files that will be reaquired when needed)'),
	async execute(interaction, world) {
		fsExtra.emptyDirSync('./resources/cache/');
		return interaction.reply(`MyMachoOnline's File Cache has been cleared!`);
	},
};