'use strict';

const Config = require('../config');
const Profiles = require('../profiles');
const Discord = require('discord.js');

module.exports = {
    name: 'kiss',
    desc: 'Make kissing faces to your partner. :3',
    usage: 'kiss',
    validate(msg, obj) {
        const guildId = msg.guild.id;
        const userId = msg.author.id;
        const userProfile = Profiles.getUser(guildId, userId);
        if (userProfile) {
            if (userProfile.stats.current) {
                return true;
            } else {
                msg.channel.send(`You are not in a relationship with anyone! :no_mouth:`);
            }
        } else {
            msg.channel.send(`You do not have a profile setup. Use \`${Config.prefix}create\` to create your profile. :thumbsup:`);
        }
        return false;
    },
    execute(msg, obj) {
        const guildId = msg.guild.id;
        const userId = msg.author.id;
        const userProfile = Profiles.getUser(guildId, userId);
        const partnerId = userProfile.stats.current;
        const partner = msg.guild.members.get(partnerId).user;
        const partnerProfile = Profiles.getUser(guildId, partnerId);
        userProfile.stats.kisses++;
        partnerProfile.stats.kisses++;
        const chance = Math.random() < .1;
        const embed = new Discord.RichEmbed()
            .setColor('#fbe0d2')
            .setTitle('Kiss Cam')
            .setDescription(`${userProfile.name} ${msg.author} blew a kiss :kissing_closed_eyes: to ${partnerProfile.name} ${partner} :blush:~~\n\n:couplekiss: Awwww... How romantic!!!`
                + `\n\n${chance ? ':poop: oops, I did it again...my bad :rolling_eyes:' : ''}`);
        msg.channel.send(embed);
    }
};