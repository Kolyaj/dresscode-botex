Botex.Template = Bricks.inherit(Bricks.Observer, {
    params: {
        content: ''
    },

    accumParams: {},

    constructor: function(params) {
        this._accums = {};
        Bricks.getPrototypeChainValues(this, 'accumParams').reverse().forEach(function(accums) {
            Pony.Object.assign(this._accums, accums);
        }, this);

        this._args = arguments;
        this._params = null;
    },

    toString: function() {
        return this._toString(this._getParams().content);
    },


    _getParams: function() {
        if (!this._params) {
            this._params = {};
            Bricks.getPrototypeChainValues(this, 'params').reverse().forEach(function(params) {
                this._mixin(this._params, params);
            }, this);
            for (var i = 0; i < this._args.length; i++) {
                this._mixin(this._params, this._args[i]);
            }
            Bricks.getPrototypeChainValues(this, '_render').forEach(function(render) {
                this._mixin(this._params, render.call(this, this._params));
            }, this);
        }
        return this._params;
    },

    _mixin: function(dst, src) {
        if (src) {
            Pony.Object.keys(src).forEach(function(key) {
                if (typeof src[key] !== 'undefined') {
                    if (this._accums[key] === 'array') {
                        if (!dst[key]) {
                            dst[key] = [];
                        }
                        if (Pony.Array.isArray(src[key])) {
                            [].push.apply(dst[key], src[key]);
                        } else {
                            dst[key].push(src[key]);
                        }
                    } else if (this._accums[key] === 'object') {
                        if (!dst[key]) {
                            dst[key] = {};
                        }
                        Pony.Object.assign(dst[key], src[key]);
                    } else {
                        dst[key] = src[key];
                    }
                }
            }, this);
        }
        return dst;
    },

    _toString: function(res) {
        if (res instanceof Quantum.Quant) {
            res = res.getValue();
        }
        if (Pony.Array.isArray(res)) {
            return res.map(this._toString, this).join('');
        }
        if (typeof res === 'string') {
            return Bricks.String.escapeHTML(res);
        }
        return [res].join('');
    }
});
