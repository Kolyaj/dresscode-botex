Botex.DataBinderStyle = Bricks.inherit(Botex.DataBinder, {
    constructor: function(mutable, container, prop) {
        this._prop = prop;
        Botex.DataBinderStyle.superclass.constructor.apply(this, arguments);
    },

    _render: function(value) {
        var propValue = Bricks.DOM.normalizeCSSProperty(this._prop, value);
        this._container.style[propValue[0]] = propValue[1];
    },

    _update: function(value, lastValue) {
        if (value !== lastValue) {
            var propValue = Bricks.DOM.normalizeCSSProperty(this._prop, value);
            this._container.style[propValue[0]] = propValue[1];
        }
    }
});
