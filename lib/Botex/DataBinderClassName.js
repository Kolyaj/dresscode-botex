Botex.DataBinderClassName = Bricks.inherit(Botex.DataBinder, {
    _render: function(value) {
        value.forEach(function(cls) {
            Bricks.DOM.addClassName(this._container, cls);
            this._fireEvent('addclass', {
                el: this._container,
                className: cls
            });
        }, this);
    },

    _update: function(value, lastValue) {
        lastValue.forEach(function(cls) {
            if (value.indexOf(cls) === -1) {
                Bricks.DOM.removeClassName(this._container, cls);
                this._fireEvent('removeclass', {
                    el: this._container,
                    className: cls
                });
            }
        }, this);
        value.forEach(function(cls) {
            if (lastValue.indexOf(cls) === -1) {
                Bricks.DOM.addClassName(this._container, cls);
                this._fireEvent('addclass', {
                    el: this._container,
                    className: cls
                });
            }
        }, this);
    },

    _prepareValue: function(value) {
        value = Bricks.String.trim(value);
        return value ? value.split(/\s+/) : [];
    }
});
