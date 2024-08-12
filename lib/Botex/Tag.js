Botex.Tag = Bricks.inherit(Botex.Template, {
    params: {
        tagName: 'div',
        hasRoot: true,
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
        var cls = this._normalizeClassName($.className);
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
            content: Botex.if($.hasRoot, {
                then: function() {
                    return [
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
                    ];
                },
                else: function() {
                    return $.content;
                }
            }),
            meta: {
                tagName: $.tagName,
                className: $.className,
                style: $.style,
                attrs: $.attrs,
                props: $.props,
                content: $.content
            }
        };
    },

    _normalizeClassName: function(classNames) {
        if (Pony.Array.isArray(classNames)) {
            return Bricks.String.trim(Bricks.Array.flatten(classNames).map(function(cls) {
                if (cls instanceof Quantum.Quant) {
                    return this._normalizeClassName(cls.getValue());
                } else {
                    return cls;
                }
            }, this).join(' '));
        } else {
            return [classNames].join('');
        }
    }
});
