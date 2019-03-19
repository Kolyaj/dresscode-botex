var {DressCode} = require('dresscodejs');

exports.compileCSS = async function(fname) {
    var code = await new DressCode(true).compile(fname, {css: true, debug: true});
    return new Function('module, exports', `${code};return typeof Botex !== 'undefined' && Botex.CSS && Botex.CSS.compile() || ''`)({}, {});
};
