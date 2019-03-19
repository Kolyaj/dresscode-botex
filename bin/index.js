#!/usr/bin/env node

var botex = require('..');

if (process.argv[2] === 'build-css') {
    botex.compileCSS(process.argv[3]).then(console.log).catch(console.error);
}
