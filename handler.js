'use strict';

const Config = require('./config');
const Commands = require('./commands');

module.exports = {
    getArgs(content) {
        let arr;
        if (typeof content === 'string') {
            arr = content.substring(Config.prefix.length).split(/\s+/);
        } else {
            arr = content.slice();
        }
        return {
            base: arr.shift().toLowerCase(),
            args: arr
        };
    },
    handle(msg, obj, commands = Commands) {
        if (commands.has(obj.base)) {
            const command = commands.get(obj.base);
            if (command.validate(msg, obj)) {
                command.execute(msg, obj);
                return true;
            }
        } else {
            msg.channel.send(`Command not found. Use \`${Config.prefix}help\` to see available commands.`);
        }
        return false;
    }
};