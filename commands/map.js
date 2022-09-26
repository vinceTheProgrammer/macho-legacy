const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed} = require('discord.js');
const pureimage = require('pureimage');
const fs = require('fs');
const request = require('request');

const { drawGrid } = require('../utils/drawGrid');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('map')
		.setDescription('Gives you the current map of the game world.'),
	async execute(interaction, world, client) {
    
        world.sync();

        let worldSpace = world.getWorldSpace();
        let xSize = worldSpace.length;
        let ySize = worldSpace[0].length;

        const width = 500;
        const height = 500;

        const img = pureimage.make(width, height);
        const ctx = img.getContext('2d');

        ctx.fillStyle = 'white';
        ctx.fillRect(0,0,width,height);

        drawGrid(ctx, width, height, width / xSize);

        let promises = [];

        worldSpace.forEach(col => {
            col.forEach(row => {
                row.forEach(obj => {
                    if (obj.type == 'player') {
                        promises.push(
                            downloadAvatar(obj.id, client)
                        );
                    }
                })
            })
        })

        Promise.all(promises).then(() => {
            let promises = [];
            let x;
            let y;

            worldSpace.forEach((col, i) => {
                x = i;
                col.forEach((row, i) => {
                    y = i;
                    row.forEach(obj => {
                        if (obj.type == 'player') {
                            promises.push(
                                drawAvatar(obj.id, ctx, x, y, width, height, xSize, ySize)
                            );
                        }
                    })
                })
            })

            Promise.all(promises).then(() => {
                pureimage.encodePNGToStream(img, fs.createWriteStream('./output/out.png')).then(() => {
                    console.log("wrote out the png file to out.png");
                    const file = new MessageAttachment('./output/out.png');
                    const embed = new MessageEmbed()
                        .setTitle('World Map')
                        .addField('Size', `${xSize}x${ySize}`)
                        .setImage('attachment://out.png');

                    return interaction.reply({ embeds: [embed], files: [file] });
                }).catch((e)=>{
                    console.log("there was an error writing");
                    return;
                });
            });
        });
	},
};

function downloadAvatar(id, client) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(`./resources/cache/${id}.png`)) {
            console.log(`${id} already present!`);
            resolve;
        }
        client.users.fetch(id).then(user => {
            let stream = request.get(user.displayAvatarURL({format:'png'}))
            .on('error', console.error)
            .pipe(fs.createWriteStream(`./resources/cache/${id}.png`));
            stream.on("finish", resolve);
            stream.on('error', reject);
        });
    });
}

function drawAvatar(id, ctx, x, y, width, height, xSize, ySize) {
    return new Promise((resolve, reject) => {
        pureimage.decodePNGFromStream(fs.createReadStream(`./resources/cache/${id}.png`)).then((img) => {
            console.log("size is",img.width,img.height);
            console.log("location is",x,y)
            ctx.drawImage(img,
                0, 0, img.width, img.height, // source dimensions
                x * (width / xSize) + (((width / xSize) / 10) / 2) , y * (height / ySize) + (((height / ySize) / 10) / 2), width / xSize - ((width / xSize) / 10), height / ySize - ((height / ySize) / 10)               // destination dimensions
            );
            console.log('drewImage!');
            resolve();
        }).catch(err => reject(err));
    })
}