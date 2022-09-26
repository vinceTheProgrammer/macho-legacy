const { SlashCommandBuilder } = require('@discordjs/builders');
const { Player } = require('../classes/Player');
const { randomIntFromInterval } = require('../utils/randomIntFromInterval');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('spawn')
		.setDescription('Spawns you somewhere in the game world.'),
	async execute(interaction, world, client, players) {

		world.sync();

		let spawnX;
		let spawnY;

		let playerLocation = world.findObjById(interaction.user.id, "player");
		if ( playerLocation.x !== null && playerLocation.y !== null) {
			playerLocation = world.worldSpace(playerLocation);
			return interaction.reply(`You are already present in the world at (${playerLocation.x}, ${playerLocation.y})! No need to use /spawn.`);
		}

		for(i=0;i<1000;i++){
			spawnX = randomIntFromInterval(0, world.world.space.length - 1);
			spawnY = randomIntFromInterval(0, world.world.space[spawnX].length - 1);
			if (!world.isOccupied(spawnX, spawnY)) {
				break;
			}
			if (i == 999) {
				return interaction.reply(`We tried to spawn you at a random location in the game world 1000 times but failed! This could either mean all spaces are occupied, or you are very unlucky. Feel free to try the spawn command again.`);
			}
		}

		let player = new Player(interaction.user.tag, interaction.user.id);
		world.add(player, spawnX, spawnY);
		players.addPlayer(interaction.user.tag, interaction.user.id)
		world.increasePlayerStat(1);
		world.save();


		let coords = world.worldSpace({x: spawnX, Y: spawnY, type: 'array'});
		return interaction.reply(`Spawned you at (${coords.x}, ${coords.y})!`);
	},
};