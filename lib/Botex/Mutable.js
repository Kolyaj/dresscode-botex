Botex.Mutable = Bricks.inherit({
    constructor: function(value) {
        this._value = value;
        this._dependents = [];
    },

    setValue: function(value) {
        this._value = value;
        this._dependents.forEach(function(item) {
            item.dependent.setValue(item.callback.call(item.ctx, this._value));
        }, this);
    },

    getValue: function() {
        return this._value;
    },

    when: function(callback, ctx) {
        var dependent = new Botex.Mutable(callback.call(ctx, this._value));
        this._dependents.push({
            dependent: dependent,
            callback: callback,
            ctx: ctx
        });
        return dependent;
    }
});

Botex.Mutable.combine = function(mutables) {
    var combinator = new Botex.Mutable();
    var onChange = function() {
        combinator.setValue(mutables.map(function(mutable) {
            return mutable.getValue();
        }));
    };
    onChange();
    mutables.forEach(function(mutable) {
        mutable.when(onChange);
    });
    return combinator;
};
