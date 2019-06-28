'use strict';

const Config = require('../config');
const Profiles = require('../profiles');
const Discord = require('discord.js');

const userRegex = /^<@!?(\d+)>$/;

module.exports = {
    name: 'view',
    desc: 'View someone\'s profile.',
    usage: 'view <user>',
    validate(msg, { args }) {
        if (args.length !== 1) {
            msg.channel.send(`Correct usage is \`${Config.prefix}${this.usage}\`. :face_palm:`);
            return false;
        }
        const match = userRegex.exec(args[0]);
        if (match) {
            const guildId = msg.guild.id;
            const userId = match[1];
            const userProfile = Profiles.getUser(guildId, userId);
            if (userProfile) {
                return true;
            } else {
                msg.channel.send('The user does not have a profile. :broken_heart: ');
            }
        } else {
            msg.channel.send('You must specify a valid user. :shrug:');
        }
        return false;
    },
    execute(msg, { args }) {
        const match = userRegex.exec(args[0]);
        const guildId = msg.guild.id;
        const userId = match[1];
        const userProfile = Profiles.getUser(guildId, userId);
        userProfile.stats.views++;
        const user = msg.guild.members.get(userId).user;
        const embed = new Discord.RichEmbed()
            .setColor('#bbaaee')
            .setTitle(`:two_hearts: ${userProfile.name}'s Profile :sparkling_heart:`)
            .setThumbnail(user.displayAvatarURL)
            .setDescription(userProfile.description)
            .addField(':e_mail: Discord', `${user}`, true)
            .addField(`${userProfile.stats.current ? ':kissing_heart:' : ':rolling_eyes:'} Status`, userProfile.stats.current ? `In a relationship with ${msg.guild.members.get(userProfile.stats.current)}` : 'Single', true)
            .addField(':eyes: Age & Gender', userProfile.age + ' ' + userProfile.gender, true)
            .addField(':tools: Hobbies', userProfile.hobbies, true)
            .addField(':heart_eyes: Type', userProfile.type, true)
            .addField(':shrug: Sexuality', userProfile.sexuality, true)
            .setTimestamp()
            .setFooter(`Requested by ${msg.author.tag}`);
        msg.channel.send(embed);
    }
}