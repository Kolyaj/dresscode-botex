Botex.DataBinderAttr = Bricks.inherit(Botex.DataBinder, {
    constructor: function(mutable, container, attr) {
        this._attr = attr;
        Botex.DataBinderAttr.superclass.constructor.apply(this, arguments);
    },

    _render: function(value) {
        this._container[this._attr] = value;
    },

    _update: function(value, lastValue) {
        if (value !== lastValue) {
            this._container[this._attr] = value;
        }
    }
});
