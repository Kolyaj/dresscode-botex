var Botex = {};

Botex.if = function(cond, blocks) {
    return cond ? blocks.then : blocks.else;
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
        if (!params || typeof params !== 'object' || Pony.Array.isArray(params) || params instanceof String || params instanceof Botex.Template || params instanceof Botex.Mutable) {
            params = {
                content: params
            };
        }
        return new Botex.Tag(selectorParams, params);
    } else {
        throw new TypeError('Invalid selector ' + selector);
    }
};

Botex.format = function(tpl) {
    var result = [];
    var regexp = /((\\)?(#\{(\d+)(?: +([^}]+) *)?\}))/g;
    var prevLastIndex = 0;
    while (regexp.exec(tpl)) {
        var wholeMatch = RegExp.$1;
        var prefix = RegExp.$2;
        var placeholder = RegExp.$3;
        var number = Number(RegExp.$4);
        var arg = RegExp.$5;
        if (regexp.lastIndex - wholeMatch.length > prevLastIndex) {
            result.push(tpl.substring(prevLastIndex, regexp.lastIndex - wholeMatch.length));
        }
        prevLastIndex = regexp.lastIndex;
        if (prefix) {
            result.push(placeholder);
        } else {
            var value = arguments[number + 1];
            result.push(typeof value === 'function' ? value(arg || '') : value);
        }
    }
    if (prevLastIndex < tpl.length) {
        result.push(tpl.substr(prevLastIndex));
    }
    return result;
};
