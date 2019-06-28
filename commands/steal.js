'use strict';

const Config = require('../config');
const Profiles = require('../profiles');
const Discord = require('discord.js');

const userRegex = /^<@!?(\d+)>$/;

module.exports = {
    name: 'steal',
    desc: `Try to steal someone that's already in a relationship. Will it work?? hmmm....`,
    usage: 'steal <user>',
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
                    if (otherId !== userProfile.stats.current) {
                        const otherPf = Profiles.getUser(guildId, otherId);
                        if (otherPf) {
                            if (otherPf.stats.current) {
                                return true;
                            } else {
                                msg.channel.send('User has no relationship. What\'s the point in stealing? Just ask for a date. :ok_hand:');
                            }
                        } else {
                            msg.channel.send('The user does not have a profile. :broken_heart:');
                        }
                    } else {
                        msg.channel.send(':raised_hand: You can\'t steal your own partner my dude. Sorry but that doesn\'t make you cool...Just some advice, try stealing someone else.');
                    }
                } else {
                    msg.channel.send('Are you seriously trying to steal yourself? :neutral_face: Dude. Not gonna happen.');
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
        const probability = .01 + userProfile.stats.stolen / 500 + userProfile.stats.dates / 2000 + (userProfile.stats.rejectedYou + userProfile.stats.rejectedOthers) / 10000;
        const embed = new Discord.RichEmbed()
            .setColor('#e1fcff')
            .setTitle('So you think you can steal?');
        if (Math.random() < probability) {
            let description = `:stuck_out_tongue_winking_eye: ${userProfile.name} ${msg.author} used steal on ${otherPf.name} ${other}.\nAND IT WORKED!!! <o/ :trophy: \\o>\n`;
            let partnerId = otherPf.stats.current;
            let partner = msg.guild.members.get(partnerId).user;
            let partnerPf = Profiles.getUser(guildId, partnerId);
            partnerPf.stats.current = null;
            partnerPf.stats.rejectedYou++;
            otherPf.stats.rejectedOthers++;
            description += `:heart_eyes: ${otherPf.name} fell for ${userProfile.name} and dumped ${partnerPf.name} ${partner}! :open_mouth:\n`;
            otherPf.stats.current = userId;
            if (userProfile.stats.current) {
                partnerId = userProfile.stats.current;
                partner = msg.guild.members.get(partnerId).user;
                partnerPf = profiles.getUser(guildId, partnerId);
                partnerPf.stats.current = null;
                partnerPf.stats.rejectedYou++;
                userProfile.stats.current = otherId;
                userProfile.stats.rejectedOthers++;
                description += `${userProfile.name} dumped :rotating_light: ${partnerPf.name} ${partner} just to get ${otherPf.name}! What an animal! :bear:`;
            }
            embed.setDescription(description);
        } else {
            embed.setDescription(`:stuck_out_tongue_winking_eye: ${userProfile.name} ${msg.author} used steal on ${otherPf.name} ${other}.\nBut it failed...:flag_white:`);
        }
        msg.channel.send(embed);
    }
};