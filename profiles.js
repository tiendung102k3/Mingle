'use strict';

const Profiles = require('./profiles.json');
const Logger = require('./logger');

const Moment = require('moment');
const fs = require('fs');

const pf = {};

pf.save = () => {
    Logger.log('Saving profiles.json');
    fs.writeFileSync('./profiles.json', JSON.stringify(Profiles, null, 2), {});
    Logger.log('Succesfully saved profiles.json');
};

pf.getGuild = guildId => Profiles[guildId];

pf.getUser = (guildId, userId) => {
    const guild = pf.getGuild(guildId);
    if (guild)
        return guild[userId];
    return undefined;
};

pf.addGuild = guildId => {
    if (!Profiles[guildId]) {
        Profiles[guildId] = {};
        return true;
    }
    return false;
};

pf.addUser = (guildId, userId) => {
    pf.addGuild(guildId);
    const guild = pf.getGuild(guildId);
    if (!guild[userId]) {
        guild[userId] = {};
        return true;
    }
    return false;
};

pf.removeGuild = guildId => {
    if (pf.getGuild(guildId)) {
        delete Profiles[guildId];
        return true;
    }
    return false;
};

pf.removeUser = (guildId, userId) => {
    pf.addGuild(guildId);
    const guild = pf.getGuild(guildId);
    if (guild[userId]) {
        delete guild[userId];
        return true;
    }
    return false;
};

module.exports = pf;