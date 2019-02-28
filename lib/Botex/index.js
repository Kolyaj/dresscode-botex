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
            attributes.match(/\[[-a-z0-9]+(=[^\]]*)?]/g).forEach(function(attributeSelector) {
                var parts = attributeSelector.substr(1, attributeSelector.length - 2).split('=');
                selectorParams.attrs[parts[0]] = parts[1] || parts[0];
            });
        }
        if (!params || typeof params !== 'object' || Pony.Array.isArray(params) || params instanceof String || params instanceof Botex.Template) {
            params = {
                content: params
            };
        }
        return new Botex.Tag(selectorParams, params);
    } else {
        throw new TypeError('Invalid selector ' + selector);
    }
};
