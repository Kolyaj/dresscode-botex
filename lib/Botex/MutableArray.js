Botex.MutableArray = Bricks.inherit(Bricks.Observer, {
    constructor: function(value) {
        Botex.MutableArray.superclass.constructor.apply(this, arguments);
        this._value = value ? value.slice(0) : [];
        this._count = new Quantum.Quant(this._value.length);
        this._dependents = [];
    },

    append: function(items) {
        this.splice(this._value.length, 0, items);
    },

    prepend: function(items) {
        this.splice(0, 0, items);
    },

    push: function() {
        this.splice(this._value.length, 0, [].slice.call(arguments, 0));
    },

    shift: function() {
        this.splice(0, 0, [].slice.call(arguments, 0));
    },

    splice: function(start, deleteCount, insertItems) {
        start = start || 0;
        deleteCount = deleteCount || 0;
        insertItems = insertItems || [];
        for (var i = 0; i < deleteCount; i++) {
            var index = start + i;
            if (index < this._value.length) {
                this._fireEvent('remove', {
                    index: index,
                    item: this._value[index]
                });
            }
        }
        insertItems.forEach(function(item, i) {
            this._fireEvent('insert', {
                index: start + i,
                item: item,
                nextItem: this._value[start + deleteCount]
            });
        }, this);
        this._value.splice.apply(this._value, [start, deleteCount].concat(insertItems));
        this._count.setValue(this._value.length);
        this._dependents.forEach(function(dependent) {
            dependent.dependent.splice(start, deleteCount, insertItems.map(dependent.callback, dependent.ctx));
        }, this);
        this._fireEvent('change');
    },

    getCount: function() {
        return this._count;
    },

    getItem: function(index) {
        return this._value[index];
    },

    getFirstItem: function() {
        return this._value[0];
    },

    getLastItem: function() {
        return this._value[this._value.length - 1];
    },

    map: function(callback, ctx) {
        return this._value.map(function(item) {
            return callback ? callback.call(ctx, item) : item;
        }, this);
    },

    getValue: function() {
        return this._value;
    },

    filter: function(callback, ctx) {
        for (var i = 0; i < this._value.length; i++) {
            if (!callback.call(ctx, this._value[i])) {
                this.splice(i, 1);
                i--;
            }
        }
    },

    transform: function(callback, ctx) {
        var dependent = new Botex.MutableArray();
        dependent.append(this._value.map(function(item) {
            return callback.call(ctx, item);
        }, this));
        this._dependents.push({
            dependent: dependent,
            callback: callback,
            ctx: ctx
        });
        return dependent;
    }
});
