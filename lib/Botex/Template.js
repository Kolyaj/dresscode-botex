//#require Bricks.create

//#require Botex.JSON2VDOM.js
//#require Bricks2.mixin
//#require Bricks.String.escapeHTML
//#require Bricks.getPrototypeChain
//#require Pony.Array.isArray
//#require Pony.Object.keys

Botex.Template = Bricks.create({
    content: null,

    singletonTags: {
        area: true,
        base: true,
        br: true,
        col: true,
        command: true,
        embed: true,
        hr: true,
        img: true,
        input: true,
        keygen: true,
        link: true,
        meta: true,
        param: true,
        source: true,
        track: true,
        wbr: true
    },

    constructor: function(cfg) {
        Bricks2.mixin(this, cfg);
        this._transformer = new Botex.JSON2VDOM();

        this._transformer.addTransformer({
            validate: function(item) {
                return typeof item === 'object' && item instanceof Botex.Template;
            },
            transform: function(item) {
                return item.render();
            }
        });
    },

    render: function() {
        var ctx = {};
        for (var prop in this) {
            if (prop.indexOf('_') !== 0 && typeof this[prop] !== 'function') {
                ctx[prop] = this[prop];
            }
        }
        Bricks.getPrototypeChain(this, '_render').forEach(function(obj) {
            Bricks2.mixin(ctx, obj._render.call(this, ctx));
        }, this);
        return this._transformer.transform(ctx.content);
    },

    toString: function() {
        return this._vdomToString(this.render());
    },


    _render: function(ctx) {
        return ctx;
    },

    _vdomToString: function(vdom) {
        if (Pony.Array.isArray(vdom)) {
            return vdom.map(this._vdomToString, this).join('');
        } else if (typeof vdom === 'string') {
            return vdom;
        } else if (typeof vdom === 'object' && vdom !== null) {
            var tagName = vdom.tag;
            var result = ['<', tagName];
            if (vdom.cls.length) {
                result.push(' class="' + Bricks.String.escapeHTML(vdom.cls.join(' ')), '"');
            }
            Pony.Object.keys(vdom.attrs).forEach(function(attrName) {
                result.push(' ', attrName, '="' + Bricks.String.escapeHTML(vdom.attrs[attrName]) + '"');
            });
            if (this.singletonTags[tagName]) {
                result.push('/>');
            } else {
                result.push('>', vdom.content ? this._vdomToString(vdom.content) : '', '</', tagName, '>');
            }
            return result.join('');
        } else {
            return '';
        }
    }
});
