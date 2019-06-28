'use strict';

const Config = require('../config');
const Profiles = require('../profiles');
const Discord = require('discord.js');

const userRegex = /^<@!?(\d+)>$/;

module.exports = {
    name: 'reject',
    desc: 'Reject them, reject them all! FEEL SHAME PEASANTS!!! hahAHAHAHAHAHAAA...',
    usage: 'reject <user>',
    validate(msg, { args }) {
        if (args.length !== 1) {
            msg.channel.send(`Correct usage is \`${Config.prefix}${this.usage}\`. :face_palm:`);
            return false;
        }
        const guildId = msg.guild.id;
        const userId = msg.author.id;
        const userProfile = Profiles.getUser(guildId, userId);
        if (userProfile) {
            const match = userRegex.exec(args[0]);
            if (match) {
                const otherId = match[1];
                if (otherId !== msg.author.id) {
                    const otherPf = Profiles.getUser(guildId, otherId);
                    if (otherPf) {
                        return true;
                    } else {
                        msg.channel.send('The user does not have a profile; therefore, you cannot reject them. :broken_heart:\nIt makes sense trust me...');
                    }
                } else {
                    msg.channel.send('Why would you reject yourself???? Now I feel bad, here take this :cheese: I\'m sure it\'ll make you feel *gouda*...');
                }
            } else {
                msg.channel.send('You must specify a valid user. :shrug:');
            }
        } else {
            msg.channel.send(`You do not have a profile setup. Use \`${Config.prefix}create\` to create your profile. :thumbsup:`);
        }
        return false;
    },
    execute(msg, { args }) {
        const guildId = msg.guild.id;
        const userId = msg.author.id;
        const userProfile = Profiles.getUser(guildId, userId);
        const match = userRegex.exec(args[0]);
        const otherId = match[1];
        const other = msg.guild.members.get(otherId).user;
        const otherPf = Profiles.getUser(guildId, otherId);
        userProfile.stats.rejectedOthers++;
        otherPf.stats.rejectedYou++;
        const chance = Math.random() < .3;
        const embed = new Discord.RichEmbed()
            .setColor('#8d698d')
            .setTitle('No Chill')
            .setDescription(`:sunglasses: <o/${chance ? ` <- that's a dab btw` : ''} ${userProfile.name} ${msg.author} just straight up rejected :x: ${otherPf.name} ${other}\nwtf... not cool bro :thumbsdown:`);
        msg.channel.send(embed);
    }
};