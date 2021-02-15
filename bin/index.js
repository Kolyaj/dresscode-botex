#!/usr/bin/env node

var botex = require('..');

var fs = require('fs-extra');
var {DressCode} = require('dresscodejs');

var args = [];
var params = {
    'private-dict': '',
    'bundle': ''
};
process.argv.slice(3).forEach((arg) => {
    if (arg.match(/^--(.+?)=(.*)$/)) {
        params[RegExp.$1] = RegExp.$2;
    } else if (arg.indexOf('-') === 0) {
        context[arg.substr(1)] = true;
    } else {
        args.push(arg);
    }
});

if (!args[0]) {
    console.log('Usage: botex compile-css <input file> <output file> [--bundle=label_name] [--private-dict=path/to/dict.json]');
    process.exit(1);
}

if (process.argv[2] === 'compile-css') {
    var dresscode = new DressCode(!params['private-dict']);
    Promise.resolve().then(() => {
        if (params['private-dict']) {
            return fs.readJson(params['private-dict']).then((dict) => {
                dresscode.setPrivateNamesDict(dict);
            });
        }
    }).then(() => {
        return botex.compileCSS(dresscode, args[0], params['bundle']).then((result) => {
            if (args[1]) {
                return fs.outputFile(args[1], result, 'utf8');
            } else {
                console.log(result);
            }
        });
    }).then(() => {
        if (params['private-dict']) {
            return fs.writeJson(params['private-dict'], dresscode.getPrivateNamesDict());
        }
    }).catch((err) => {
        console.error(err.stack);
        process.exit(1);
    });
}
