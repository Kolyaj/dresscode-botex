var path = require('path');

exports.compileCSS = async function(dresscode, fname, label) {
    fname = path.resolve(fname);
    var dirname = path.dirname(fname);
    var basename = path.basename(fname);
    var code;
    if (label) {
        code = `
            //#include ${basename}::
            Botex.CSS.clear();
            //#include ${basename}::${label}
            return Botex.CSS.compile();  
        `;
    } else {
        code = `
            //#include ${basename}::
            return Botex.CSS.compile();
        `;
    }
    var compiledCode = await dresscode.compileCode(path.join(dirname, '_'), code, {css: true});
    return new Function('module, exports', compiledCode)({}, {});
};
