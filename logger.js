'use strict';

const moment = require('moment');

const timestamp = () => `[${moment().format('hh:mm:ss A')}]`;

module.exports = {
    log(args) {
        console.log(`${timestamp()} ${args}`);
    },
    error(args) {
        console.error(`${timestamp()} ${args}`);
    },
    realError(args) {
        console.log(timestamp());
        console.error(args);
    }
};