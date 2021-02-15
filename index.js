var path = require('path');

exports.compileCSS = async function(dresscode, fname) {
    fname = path.resolve(fname);
    var dirname = path.dirname(fname);
    var basename = path.basename(fname);
    var code = `
            //#include ${basename}::
            //#layer css
            return typeof Botex !== 'undefined' && Botex.CSS && Botex.CSS.compile() || '';
            //#endlayer
        `;
    var compiledCode = await dresscode.compileCode(path.join(dirname, '_'), code, {}, [], 'css');
    return new Function('module, exports', compiledCode)({}, {});
};
