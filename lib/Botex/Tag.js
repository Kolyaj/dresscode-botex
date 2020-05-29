Botex.Tag = Bricks.inherit(Botex.Template, {
    params: {
        tagName: 'div',
        className: '',
        attrs: {},
        props: {},
        style: {},
        content: ''
    },

    accumParams: {
        className: 'array',
        attrs: 'object',
        props: 'object',
        style: 'object'
    },

    getMeta: function() {
        return this._getParams().meta;
    },

    _render: function($) {
        var attrs = Pony.Object.assign({}, $.attrs);
        var cls = Bricks.String.trim($.className.map(function(cls) {
            return cls instanceof Quantum.Quant ? cls.getValue() : cls;
        }).join(' '));
        if (cls) {
            attrs['class'] = cls;
        }
        var style = Pony.Object.keys($.style).map(function(name) {
            var value = $.style[name];
            if (value instanceof Quantum.Quant) {
                value = value.getValue();
            }
            return value !== null && value !== undefined ? name + ':' + value + ';' : '';
        }, this).join('');
        if (style) {
            attrs['style'] = style;
        }
        var attrsHTML = Pony.Object.keys(attrs).map(function(name) {
            var value = attrs[name];
            if (value instanceof Quantum.Quant) {
                value = value.getValue();
            }
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
                    then: function() {
                        return new String('/>');
                    },
                    else: function() {
                        return [new String('>'), $.content, new String('</'), $.tagName, new String('>')];
                    }
                }, this)
            ],
            meta: {
                tagName: $.tagName,
                className: $.className,
                style: $.style,
                attrs: $.attrs,
                props: $.props,
                content: $.content
            }
        };
    }
});
