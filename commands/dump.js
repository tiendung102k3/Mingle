'use strict';

const Config = require('../config');
const Profiles = require('../profiles');
const Discord = require('discord.js');

module.exports = {
    name: 'dump',
    desc: 'Dumps your partner in an instant. D:',
    usage: 'dump',
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
        userProfile.stats.current = null;
        userProfile.stats.rejectedOthers++;
        partnerProfile.stats.current = null;
        partnerProfile.stats.rejectedYou++;
        const description = `${userProfile.name} ${msg.author} just dumped ${partnerProfile.name} ${partner}!!!` +
            `\n\nThis is so sad. :weary: Alexa, play despacito :musical_note:`;
        const embed = new Discord.RichEmbed()
            .setColor('#ff403a')
            .setTitle(':newspaper: News')
            .setDescription(description)
            .setTimestamp();
        msg.channel.send(embed);
    }
};