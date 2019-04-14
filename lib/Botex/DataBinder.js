Botex.DataBinder = Bricks.inherit(Bricks.Observer, {
    constructor: function(mutable, container) {
        Botex.DataBinder.superclass.constructor.apply(this, arguments);
        this._container = container;
        this._lastValue = this._prepareValue(mutable.getValue());
        this._render(this._lastValue);
        mutable.when(this.$$_onChange, this);
    },


    _prepareValue: function(value) {
        return value;
    },


    $$_onChange: function(value) {
        value = this._prepareValue(value);
        this._update(value, this._lastValue);
        this._lastValue = value;
    }
});
