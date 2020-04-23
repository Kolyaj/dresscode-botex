Botex.CSS = {
    _styles: [],

    add: function(css) {
        this._styles.push(css);
    },

    compile: function() {
        return this._styles.map(function(css) {
            return this._compileRule('', css);
        }, this).join('');
    },

    clear: function() {
        this._styles.length = 0;
    },

    mount: function(doc) {
        if (doc.$$__stylesLen !== this._styles.length && this._styles.length > 0) {
            var styleEl = Bricks.DOM.getEl('$$__style', doc);
            if (!styleEl) {
                styleEl = doc.createElement('style');
                styleEl.type = 'text/css';
                styleEl.id = '$$__style';
                doc.getElementsByTagName('head')[0].appendChild(styleEl);
            }
            styleEl.innerHTML = this.compile();
            doc.$$__stylesLen = this._styles.length;
        }
    },

    _compileRule: function(rule, properties) {
        var cascades = [];
        var propStrings = [];
        for (var property in properties) {
            if (properties.hasOwnProperty(property)) {
                var value = properties[property];
                if (Array.isArray(value)) {
                    value.forEach(function(subvalue) {
                        propStrings.push('    ', property, ': ', this._prepareValue(subvalue), ';\n');
                    }, this);
                } else if (typeof value === 'object') {
                    if (/^@(media|keyframes) /.test(property)) {
                        cascades.push([property, ' {\n', this._compileRule(rule, value), '}'].join(''));
                    } else {
                        cascades.push(this._compileRule(rule + (property.indexOf(':') === 0 ? '' : ' ') + property, value));
                    }
                } else {
                    propStrings.push('    ', property, ': ', this._prepareValue(value), ';\n');
                }
            }
        }
        return (rule ? [rule, ' {\n', propStrings.join(''), '}'].join('') : '') + '\n' + cascades.join('');
    },

    _prepareValue: function(value) {
        return typeof value === 'number' ? value + 'px' : String(value);
    }
};
