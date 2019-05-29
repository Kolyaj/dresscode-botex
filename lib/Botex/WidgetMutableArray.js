Botex.WidgetMutableArray = Bricks.inherit(Botex.Widget, {
    params: {
        mutable: null
    },

    constructor: function() {
        Botex.WidgetMutableArray.superclass.constructor.apply(this, arguments);
        var internalMutable = this._getParams().internalMutable;
        this._on(internalMutable, 'insert', this.$$_onInsertItem);
        this._on(internalMutable, 'remove', this.$$_onRemoveItem);
    },

    _render: function($) {
        var internalMutable = $.mutable.transform(function(item) {
            return new Botex.Widget({
                hasRoot: false,
                content: item
            });
        }, this);
        return {
            hasRoot: false,
            internalMutable: internalMutable,
            content: internalMutable.map()
        };
    },


    $$_onInsertItem: function(evt) {
        if (this._mounted) {
            this._registerChild(evt.item);
            evt.item.mount(this._firstEl.parentNode, evt.nextItem ? evt.nextItem.getFirstEl() : this._lastEl);
        }
    },

    $$_onRemoveItem: function(evt) {
        if (this._mounted) {
            evt.item.destroy();
        }
    }
});
