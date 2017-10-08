//#require Bricks.create

//#require Bricks.String.escapeHTML
//#require Pony.Array.isArray

Botex.JSON2VDOM = Bricks.create({
    constructor: function() {
        this._transformers = [];

        this.addTransformer({
            validate: function(item) {
                return Pony.Array.isArray(item);
            },
            transform: function(item) {
                return item.map(this.transform, this).filter(Boolean);
            }
        });

        this.addTransformer({
            validate: function(item) {
                return typeof item === 'string';
            },
            transform: function(item) {
                return Bricks.String.escapeHTML(item);
            }
        });

        this.addTransformer({
            validate: function(item) {
                return typeof item === 'number' || (typeof item === 'object' && Object.prototype.toString.call(item) === '[object String]');
            },
            transform: function(item) {
                return String(item);
            }
        });

        this.addTransformer({
            validate: function(item) {
                return typeof item === 'object' && '$if' in item;
            },
            transform: function(item) {
                return this.transform(item['$if'] ? item['$then'] : item['$else']);
            }
        });

        this.addTransformer({
            validate: function(item) {
                if (typeof item === 'object' && '$' in item) {
                    var selectorParts = item['$'].match(/^([a-z0-9]*)((?:\.[-_a-z0-9]+)*)((?:\[[-a-z]+(?:=[^\]]*)?])*)$/i);
                    if (selectorParts) {
                        return selectorParts;
                    } else {
                        throw new Error('Invalid selector: ' + item['$']);
                    }
                }
            },
            transform: function(item, selectorParts) {
                var result = {
                    tag: item.tag || selectorParts[1] || 'div',
                    cls: selectorParts[2] ? selectorParts[2].split('.').slice(1) : [],
                    attrs: {}
                };
                if (item.cls) {
                    if (Pony.Array.isArray(item.cls)) {
                        [].push.apply(result.cls, item.cls);
                    } else {
                        result.cls.push(item.cls);
                    }
                }
                if (item._) {
                    result.content = this.transform(item._);
                }
                if (selectorParts[3]) {
                    var attrs = selectorParts[3].slice(1, -1).split('][');
                    attrs.forEach(function(attr) {
                        if (attr.indexOf('=') > -1) {
                            var attrParts = attr.split('=');
                            var attrValue = attrParts[1].replace(/#\{([a-z0-9_]+)}/ig, function(tpl, name) {
                                var value = item[name];
                                return value === null || value === undefined ? '' : value;
                            });
                            if (attrValue) {
                                result.attrs[attrParts[0]] = attrValue;
                            }
                        } else {
                            result.attrs[attr] = attr;
                        }
                    });
                }
                return result;
            }
        });
    },

    addTransformer: function(transformer) {
        this._transformers.unshift(transformer);
    },

    transform: function(item) {
        if (item !== null && item !== undefined) {
            var ctx = item.ctx || this;
            for (var i = 0; i < this._transformers.length; i++) {
                var transformer = this._transformers[i];
                var validateResult = transformer.validate.call(ctx, item);
                if (validateResult) {
                    return transformer.transform.call(ctx, item, validateResult);
                }
            }
        }
        return null;
    }
});
