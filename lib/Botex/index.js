var Botex = {};

Botex.if = function(cond, blocks, ctx) {
    if (typeof blocks === 'function') {
        blocks = {
            then: blocks
        };
    }
    if (cond) {
        if (typeof blocks.then === 'function') {
            return blocks.then.call(ctx);
        }
    } else {
        if (typeof blocks.else === 'function') {
            return blocks.else.call(ctx);
        }
    }
};

Botex.zen = function(selector, params) {
    selector = selector || '';
    if (selector.match(/^([a-z0-9]*)((?:\.[-_a-z0-9]+)*)((?:\[[-a-z0-9]+(=[^\]]*)?])*)$/i)) {
        var tagName = RegExp.$1 || 'div';
        var classNames = RegExp.$2 || '';
        var attributes = RegExp.$3 || '';
        var selectorParams = {
            tagName: tagName,
            className: Bricks.String.trim(classNames.replace(/\./g, ' ')),
            attrs: {}
        };
        if (attributes) {
            attributes.match(/\[[-a-z0-9]+(=[^\]]*)?]/ig).forEach(function(attributeSelector) {
                var parts = attributeSelector.substr(1, attributeSelector.length - 2).split('=');
                selectorParams.attrs[parts[0]] = parts[1] || parts[0];
            });
        }
        if (!params || typeof params !== 'object' || Pony.Array.isArray(params) || params instanceof String || params instanceof Botex.Template || params instanceof Quantum.Quant || params instanceof Botex.MutableArray) {
            params = {
                content: params
            };
        }
        return new Botex.Tag(selectorParams, params);
    } else {
        throw new TypeError('Invalid selector ' + selector);
    }
};

Botex.replace = function(str, search, callback, ctx) {
    var result = [];
    var prevLastIndex = 0;
    str.replace(search, function(substr) {
        var offset = arguments[arguments.length - 2];
        if (offset > prevLastIndex) {
            result.push(str.substring(prevLastIndex, offset));
        }
        prevLastIndex = offset + substr.length;
        result.push(typeof callback === 'function' ? callback.apply(ctx, arguments) : callback);
    });
    if (prevLastIndex < str.length) {
        result.push(str.substr(prevLastIndex));
    }
    return result;
};

Botex.format = function(tpl) {
    var args = [].slice.call(arguments, 1);
    return Botex.replace(tpl, /(\\)?(#\{(\d+)(?: +([^}]+) *)?\})/g, function(wholeMatch, prefix, placeholder, number, arg) {
        if (prefix) {
            return placeholder;
        } else {
            var value = args[number];
            return typeof value === 'function' ? value(arg || '') : value;
        }
    });
};

Botex.plural = function(number) {
    return function(forms) {
        var hideNumber = false;
        if (forms.indexOf('!') === 0) {
            hideNumber = true;
            forms = forms.substr(1);
        }
        return Bricks.Number.plural(number, forms, hideNumber);
    };
};
