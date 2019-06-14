Botex.ElemsObserver = Bricks.inherit(Bricks.Component, {
    store: null,

    name: '',

    onAdd: null,

    onRemove: null,

    ctx: null,

    constructor: function() {
        Botex.ElemsObserver.superclass.constructor.apply(this, arguments);
        this.store.getElems(this.name).forEach(function(elem) {
            this.onAdd.call(this.ctx, elem);
        }, this);
        this._on(this.store, 'addelem', this.$$_onAddElem);
        this._on(this.store, 'removeelem', this.$$_onRemoveElem);
    },

    destroy: function() {
        this.store.getElems(this.name).forEach(function(elem) {
            this.onRemove.call(this.ctx, elem);
        }, this);
        Botex.ElemsObserver.superclass.destroy.apply(this, arguments);
    },


    $$_onAddElem: function(evt) {
        if (evt.name === this.name) {
            this.onAdd.call(this.ctx, evt.elem);
        }
    },

    $$_onRemoveElem: function(evt) {
        if (evt.name === this.name) {
            this.onRemove.call(this.ctx, evt.elem);
        }
    }
});
