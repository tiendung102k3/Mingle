'use strict';

const Discord = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'help',
    desc: `Shows the available commands.`,
    usage: 'help',
    validate(msg, obj) {
        return true;
    },
    execute(msg, obj) {
        msg.channel.send(helpEmbed);
    }
};

const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
let description = '';
for (const file of commandFiles) {
    const command = require(`./${file}`);
    if (command.name)
        description += `\`${command.usage}\` ${command.desc}\n`;
}
const helpEmbed = new Discord.RichEmbed()
    .setColor('#f7aec2')
    .setTitle(`:notepad_spiral: Commands | Prefix: ${config.prefix}`)
    .setDescription(description);