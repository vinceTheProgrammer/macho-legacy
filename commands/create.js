const { SlashCommandBuilder } = require('@discordjs/builders');
const { getCardinalDirection } = require('../utils/getCardinalDirection');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Creates a player, item, or scenery object in the game world.')
        .addStringOption(option => 
			option.setName('type')
			.setDescription('one of the 3 object types')
			.setRequired(true)
			.addChoice('Item', 'item')
			.addChoice('Scenery', 'scenery'))
        .addIntegerOption(option =>
            option.setName('x-coordinate')
            .setDescription('X-coordinate to create object at')
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName('y-coordinate')
            .setDescription('Y-coordinate to create object at')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('name')
            .setDescription('Name of object')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
            .setDescription('Optional description of the object')
            .setRequired(false)),
	async execute(interaction, world, client) {

        const type = interaction.options.getString('type');
        const x = interaction.options.getInteger('x-coordinate');
        const y = interaction.options.getInteger('y-coordinate');
        const name = interaction.options.getString('name');
        const description = interaction.options.getString('description');

        let typeCharArr = type.split('');
        let firstChar = typeCharArr[0];
        firstChar = firstChar.toUpperCase();
        typeCharArr.shift();
        typeCharArr.unshift(firstChar);
        const typeCapitalized = typeCharArr.join('');
        
        const arraySpaceLocation = world.arraySpace({x: x, y: y, type: 'world'});

        console.log(arraySpaceLocation.x, arraySpaceLocation.y);

        world.sync();

        let result = world.createObject(arraySpaceLocation.x, arraySpaceLocation.y, type, name);

        if (result.x == null & result.y == null) {
            return interaction.reply('That space is outside of the world border.')
        }

        if (result.object.type == 'player') {
            world.increasePlayerStat(1);
        }

        world.save();

		return interaction.reply(`${typeCapitalized} "${name}" created at (${x}, ${y}) with an ID of ${result.object.id}`);
	},
};