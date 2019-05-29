Botex.WidgetMutable = Bricks.inherit(Botex.Widget, {
    params: {
        mutable: null
    },

    constructor: function() {
        Botex.WidgetMutable.superclass.constructor.apply(this, arguments);
        this._on(this._getParams().mutable, 'change', this.$$_onChange);
    },


    _render: function($) {
        return {
            hasRoot: false,
            content: $.mutable.getValue()
        };
    },

    $$_onChange: function(evt) {
        if (this._mounted) {
            this._destroyContent();
            this._appendContent(this._lastEl.parentNode, this._lastEl, evt.value);
        }
    }
});
