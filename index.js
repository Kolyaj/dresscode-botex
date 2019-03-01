var {DressCode} = require('dresscodejs');

exports.compileCSS = async function(fname, dresscode) {
    dresscode = dresscode || new DressCode(true);
    var code = await dresscode.compile(fname, {css: true});
    return new Function('', `(function(){${code})();return typeof Botex !== 'undefined' && Botex.CSS && Botex.CSS.compile(); || ''`)();
};
