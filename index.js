var path = require('path');

exports.compileCSS = async function(dresscode, fname) {
    fname = path.resolve(fname);
    var basename = path.basename(fname);
    var code = `
            //#include ${basename}::
            //#layer css
            return typeof Botex !== 'undefined' && Botex.CSS && Botex.CSS.compile() || '';
            //#endlayer
        `;
    var compiledCode = await dresscode.compileCode(`${fname}.css`, code, {}, [], 'css');
    return new Function('module, exports', compiledCode)({}, {});
};
