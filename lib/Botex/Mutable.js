Botex.Mutable = Bricks.inherit(Bricks.Observer, {
    constructor: function(value) {
        Botex.Mutable.superclass.constructor.apply(this, arguments);
        this._value = value;
        this._dependents = [];
    },

    setValue: function(value) {
        if (this._value !== value) {
            this._fireEvent('beforechange', {
                value: this._value,
                nextValue: value
            });
            this._value = value;
            this._dependents.forEach(function(item) {
                item.dependent.setValue(item.callback.call(item.ctx, this._value));
            }, this);
            this._fireEvent('change', {
                value: this._value
            });
        }
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
    mutables.forEach(function(mutable) {
        if (!(mutable instanceof Botex.Mutable)) {
            throw new TypeError('Arguments of Botex.Mutable.combine must be instances of Botex.Mutable.');
        }
    });
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
