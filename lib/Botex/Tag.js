Botex.Tag = Bricks.inherit(Botex.Template, {
    params: {
        tagName: 'div',
        className: '',
        attrs: {},
        style: {},
        content: '',
        as: ''
    },

    accumParams: {
        className: 'array',
        attrs: 'object',
        style: 'object'
    },

    getMeta: function() {
        return this._getParams().meta;
    },

    _render: function($) {
        var attrs = Pony.Object.assign({}, $.attrs);
        var clearAttrs = Pony.Object.assign({}, attrs);
        var cls = Bricks.String.trim($.className.join(' '));
        if (cls) {
            attrs['class'] = cls;
        }
        var style = Pony.Object.keys($.style).map(function(name) {
            return name + ':' + $.style[name] + ';';
        }, this).join('');
        if (style) {
            attrs['style'] = style;
        }
        var attrsHTML = Pony.Object.keys(attrs).map(function(name) {
            var value = attrs[name];
            if (!value) {
                return '';
            }
            if (typeof value === 'boolean') {
                value = name;
            }
            return [' ', name, new String('="'), value, new String('"')];
        }, this);

        return {
            content: [
                new String('<'),
                $.tagName,
                attrsHTML,
                Botex.if(/^(br|col|embed|hr|img|input|link|meta|param|wbr)$/i.test($.tagName), {
                    then: new String('/>'),
                    else: [new String('>'), $.content, new String('</'), $.tagName, new String('>')]
                })
            ],
            meta: {
                tagName: $.tagName,
                className: $.className,
                style: style ? $.style : null,
                attrs: clearAttrs,
                content: $.content,
                as: $.as
            }
        };
    }
});
