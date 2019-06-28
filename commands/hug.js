'use strict';

const Config = require('../config');
const Profiles = require('../profiles');
const Discord = require('discord.js');

module.exports = {
    name: 'hug',
    desc: 'Hug your partner til you die!!',
    usage: 'hug',
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
        userProfile.stats.hugs++;
        partnerProfile.stats.hugs++;
        const chance = Math.random() < .1;
        const embed = new Discord.RichEmbed()
            .setColor('#dfc4f6')
            .setTitle('Hug Cam')
            .setDescription(`${userProfile.name} ${msg.author} gave a big huggy wuggy :hugging: :hugging: to ${partnerProfile.name} ${partner} :yum:...`
                + `Kawaii!!! :cat:\n${chance ? ':sweat_drops: :flushed:\nUmmm... Let\'s not talk about this...pls' : ''}`);
        msg.channel.send(embed);
    }
};