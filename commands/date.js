'use strict';

const Config = require('../config');
const Profiles = require('../profiles');
const Discord = require('discord.js');

const userRegex = /^<@!?(\d+)>$/;

module.exports = {
    name: 'date',
    desc: 'Form a relationship with someone.',
    usage: 'date <user> <message?>',
    validate(msg, { args }) {
        if (args.length < 1) {
            msg.channel.send(`Correct usage is \`${Config.prefix}${this.usage}\`. :face_palm:`);
            return false;
        }
        const guildId = msg.guild.id;
        const userId = msg.author.id;
        const userProfile = Profiles.getUser(guildId, userId);
        if (userProfile) {
            const match = userRegex.exec(args[0]);
            if (match) {
                const guildId = msg.guild.id;
                const partnerId = match[1];
                if (userProfile.stats.current !== partnerId) {
                    if (partnerId !== msg.author.id) {
                        const partnerProfile = Profiles.getUser(guildId, partnerId);
                        if (partnerProfile) {
                            return true;
                        } else {
                            msg.channel.send('The user does not have a profile. :broken_heart: ');
                        }
                    } else {
                        msg.channel.send(`You can't date yourself! :stuck_out_tongue_winking_eye:`);
                    }
                } else {
                    msg.channel.send('You are already dating this person. :thinking:');
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
        const copy = args.slice();
        const match = userRegex.exec(copy.shift());
        const guildId = msg.guild.id;
        const partnerId = match[1];
        const partnerProfile = Profiles.getUser(guildId, partnerId);
        const partner = msg.guild.members.get(partnerId).user;
        const userId = msg.author.id;
        const userProfile = Profiles.getUser(guildId, userId);
        let description = 'Will you go out with me? :kissing_heart:';
        if (copy.length > 0)
            description = copy.join(' ');
        const embed = new Discord.RichEmbed()
            .setColor('#c2f2d0')
            .setTitle(`:purple_heart: ${partnerProfile.name}'s Proposal :gift_heart:`)
            .setDescription(description)
            .addField('ᅠ', `${partnerProfile.name} ${partner}, react with 💖 to accept the proposal or 💔 to decline within 10 minutes.`)
            .setTimestamp()
            .setFooter(`Your lover, ${userProfile.name} (${msg.author.tag})`);
        msg.channel.send(embed)
            .then(message => {
                message.react('💖')
                    .then(() => message.react('💔'))
                    .then(() => {
                        const filter = (reaction, user) => (reaction.emoji.name === '💖' || reaction.emoji.name === '💔') && user.id === partnerId;
                        message.awaitReactions(filter, { max: 1, time: 600000 /* 10 min */, errors: ['time'] })
                            .then(collected => {
                                embed.fields = [];
                                let fieldValue = '';
                                if (collected.has('💖')) {
                                    fieldValue += `:revolving_hearts: ${partnerProfile.name} ${partner} accepted! :cupid:`;
                                    if (partnerProfile.stats.current) {
                                        const otherPf = Profiles.getUser(guildId, partnerProfile.stats.current);
                                        fieldValue += `\n${partnerProfile.name} just dumped ${otherPf.name} for ${userProfile.name}! :hushed:`;
                                        otherPf.stats.current = null;
                                        otherPf.stats.rejectedYou++;
                                        partnerProfile.stats.rejectedOthers++;
                                    }
                                    partnerProfile.stats.current = userId;
                                    partnerProfile.stats.dates++;
                                    if (userProfile.stats.current) {
                                        const otherPf = Profiles.getUser(guildId, userProfile.stats.current);
                                        fieldValue += `\n${userProfile.name} just dumped ${otherPf.name} for ${partnerProfile.name}! :worried:`;
                                        otherPf.stats.current = null;
                                        otherPf.stats.rejectedYou++;
                                        userProfile.stats.rejectedOthers++;
                                        userProfile.stats.stolen++;
                                    }
                                    userProfile.stats.current = partnerId;
                                    userProfile.stats.dates++;
                                } else {
                                    fieldValue += `:broken_heart: ${partnerProfile.name} ${partner} declined! :sob:`;
                                    partnerProfile.stats.rejectedOthers++;
                                    userProfile.stats.rejectedYou++;
                                }
                                embed.addField('ᅠ', fieldValue);
                                message.edit(embed);
                            })
                            .catch(collected => {
                                embed.fields = [];
                                embed.addField('ᅠ', `:fearful: ${partnerProfile.name} ${partner} did not respond in time. :interrobang:`);
                                message.edit(embed);
                            });
                    });
            });
    }
};