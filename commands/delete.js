'use strict';

const Config = require('../config');
const Profiles = require('../profiles');

module.exports = {
    name: 'delete',
    desc: 'Delete your profile.',
    usage: 'delete',
    validate(msg, obj) {
        const guildId = msg.guild.id;
        const userId = msg.author.id;
        const userProfile = Profiles.getUser(guildId, userId);
        if (userProfile)
            return true;
        msg.channel.send(`You do not have a profile setup. Use \`${Config.prefix}create\` to create your profile. :thumbsup:`);
        return false;
    },
    execute(msg, obj) {
        const guildId = msg.guild.id;
        const userId = msg.author.id;
        const userPf = Profiles.getUser(guildId, userId);
        if (userPf.stats.current) {
            const partnerId = userPf.stats.current;
            const partnerProfile = Profiles.getUser(guildId, partnerId);
            userPf.stats.current = null;
            userPf.stats.rejectedOthers++;
            partnerProfile.stats.current = null;
            partnerProfile.stats.rejectedYou++;
        }
        Profiles.removeUser(guildId, userId);
        msg.channel.send(`Your profile has been deleted. :frowning2:`);
    }
}