var Botex = {};

Botex.if = function(cond, blocks, ctx) {
    if (typeof blocks === 'function') {
        blocks = {
            then: blocks
        };
    }

    var resolve = function(cond) {
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

    if (cond instanceof Quantum.Quant) {
        return cond.when(function(cond) {
            return resolve(cond);
        });
    } else {
        return resolve(cond);
    }
};

Botex.join = function(array, separator) {
    var result = [];
    array.forEach(function(item, index) {
        if (index > 0) {
            result.push(separator);
        }
        result.push(item);
    });
    return result;
};

Botex.switch = function(value, cases, ctx) {
    if (value instanceof Quantum.Quant) {
        return value.whenNotNull(function(scalarValue) {
            return cases[scalarValue] && cases[scalarValue].call(ctx);
        });
    } else {
        return cases[value] && cases[value].call(ctx);
    }
};

Botex.ifNot = function(cond, fn, ctx) {
    return Botex.if(cond, {else: fn}, ctx)
};

Botex.zen = function(ctor, selector, params) {
    if (arguments.length < 3) {
        params = selector;
        selector = ctor;
        ctor = Botex.Tag;
    }
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
                var name = parts.shift();
                var value = parts.join('=');
                selectorParams.attrs[name] = value || name;
            });
        }
        if (!params || typeof params !== 'object' || Pony.Array.isArray(params) || params instanceof String || params instanceof Botex.Template || params instanceof Quantum.Quant || params instanceof Botex.MutableArray) {
            params = {
                content: params
            };
        }
        return new ctor(selectorParams, params);
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
