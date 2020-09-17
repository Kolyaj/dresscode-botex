Botex.Textbox = Bricks.inherit(Botex.Widget, {
    params: {
        value: new Quantum.Quant('')
    },

    constructor: function() {
        Botex.Textbox.superclass.constructor.apply(this, arguments);
        this._on('change,input', this.$$_onChange);
    },

    _render: function($) {
        var lastValue;
        return {
            props: {
                value: Quantum.combine([this._getEl(), $.value]).spread(function(el, value) {
                    if (!el || el.value !== value) {
                        lastValue = new String(value);
                    }
                    return lastValue;
                })
            }
        };
    },

    $$_onChange: function() {
        this._getParams().value.setValue(this._getEl().getValue().value);
    }
});
