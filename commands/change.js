'use strict';

const Config = require('../config');
const Profiles = require('../profiles');

const fix = string => {
    return string[0].toUpperCase() + string.substr(1);
};

module.exports = {
    name: 'change',
    desc: 'Change a category in your profile.',
    usage: 'change <category> <value>',
    validate(msg, { args }) {
        if (args.length < 2) {
            msg.channel.send(`Correct usage is \`${Config.prefix}${this.usage}\`. :face_palm:`);
            return false;
        }
        const guildId = msg.guild.id;
        const userId = msg.author.id;
        const userProfile = Profiles.getUser(guildId, userId);
        if (!userProfile) {
            msg.channel.send(`You do not have a profile setup. Use \`${Config.prefix}create\` to create your profile. :blue_heart:`);
            return false;
        }
        switch (args[0].toLowerCase()) {
            case 'name':
            case 'gender':
            case 'age':
            case 'description':
            case 'hobbies':
            case 'type':
            case 'sexuality':
                return true;
            default:
                msg.channel.send(`:thinking: Category not found. Category must be one of the following: ` +
                    `\`name\`, \`gender\`, \`age\`, \`description\`, \`hobbies\`, \`type\`, or \`sexuality\`.`);
                return false;
        }
    },
    execute(msg, { args }) {
        const guildId = msg.guild.id;
        const userId = msg.author.id;
        const userProfile = Profiles.getUser(guildId, userId);
        const copy = args.slice();
        const category = copy.shift().toLowerCase();
        userProfile[category] = fix(copy.join(' '));
        msg.channel.send('Your profile has been changed. :information_desk_person:');
    }
};