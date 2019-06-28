'use strict';

const Config = require('../config');
const Profiles = require('../profiles');
const Discord = require('discord.js');

module.exports = {
    name: 'create',
    desc: 'Create your profile.',
    usage: 'create',
    validate(msg, obj) {
        const guildId = msg.guild.id;
        const userId = msg.author.id;
        const userProfile = Profiles.getUser(guildId, userId);
        if (userProfile) {
            msg.channel.send(`:cop: You already have a profile. Use \`${Config.prefix}delete\` to delete your current profile ` +
                `or \`${Config.prefix}change <category>\` to change something specific on your profile.`);
            return false;
        }
        return true;
    },
    execute(msg, obj) {
        msg.author.send(`Let's start creating your profile.\nFirst question: What is your name? :grinning:`)
            .then(message => {
                const guildId = msg.guild.id;
                const userId = msg.author.id;
                Profiles.addUser(guildId, userId);
                const user = Profiles.getUser(guildId, userId);
                user.name = '';
                user.gender = '';
                user.age = '';
                user.description = '';
                user.hobbies = '';
                user.type = '';
                user.sexuality = '';
                user.stats = {
                    current: null,
                    dates: 0,
                    kisses: 0,
                    hugs: 0,
                    stolen: 0,
                    rejectedYou: 0,
                    rejectedOthers: 0,
                    views: 0
                };
                const collector = new Discord.MessageCollector(message.channel, m => m.author.id === msg.author.id, { time: 600000 /* 10 min */ });
                let count = 0;
                collector.on('collect', userMsg => {
                    switch (count) {
                        case 0:
                            user.name = userMsg.content;
                            userMsg.author.send(':man: What is your gender? :woman:');
                            break;
                        case 1:
                            user.gender = userMsg.content;
                            userMsg.author.send(':baby: How old are you? :older_man:');
                            break;
                        case 2:
                            user.age = userMsg.content;
                            userMsg.author.send(':hushed: Please describe yourself in a few sentences.');
                            break;
                        case 3:
                            user.description = userMsg.content;
                            userMsg.author.send(':video_game: What are your hobbies? :art: ');
                            break;
                        case 4:
                            user.hobbies = userMsg.content;
                            userMsg.author.send(':dollar: What types of people are you interested in? :prince: ');
                            break;
                        case 5:
                            user.type = userMsg.content;
                            userMsg.author.send(':girl: :boy: What sexuality are you? :bear:');
                            break;
                        case 6:
                            user.sexuality = userMsg.content;
                            userMsg.author.send(`:grin: Thank you for answering these questions! Your profile will now be added to **${msg.guild.name}**.`);
                            collector.stop();
                            break;
                    }
                    count++;
                });
                collector.on('end', collected => {
                    if (!user.name || !user.gender || !user.age || !user.description || !user.hobbies || !user.type || !user.sexuality) {
                        Profiles.removeUser(guildId, userId);
                        console.log(`Profile incomplete, removed ${msg.author.username} from ${msg.guild.name}`);
                    }
                });
            });
    }
};