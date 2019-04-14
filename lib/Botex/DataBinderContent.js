Botex.DataBinderContent = Bricks.inherit(Botex.DataBinder, {
    constructor: function(mutable, container, beforeEl, renderer, rendererCtx) {
        this._doc = container.ownerDocument;
        this._contentBeforeEl = null;
        this._contentAfterEl = null;
        this._beforeEl = beforeEl;
        this._renderer = renderer;
        this._rendererCtx = rendererCtx;
        this._children = [];
        Botex.DataBinderContent.superclass.constructor.apply(this, arguments);
    },

    _render: function(value) {
        this._contentBeforeEl = this._doc.createComment('');
        this._contentAfterEl = this._doc.createComment('');
        this._container.insertBefore(this._contentBeforeEl, this._beforeEl);
        this._renderer.call(this._rendererCtx, this._container, this._beforeEl, value, this._children);
        this._container.insertBefore(this._contentAfterEl, this._beforeEl);
    },

    _update: function(value) {
        this._children.forEach(function(child) {
            child.destroy();
        }, this);
        this._children.length = 0;
        while (this._contentBeforeEl.nextSibling && this._contentBeforeEl.nextSibling !== this._contentAfterEl) {
            this._container.removeChild(this._contentBeforeEl.nextSibling);
        }
        var fantom = this._doc.createElement('div');
        this._container.insertBefore(fantom, this._contentAfterEl);
        this._renderer.call(this._rendererCtx, this._container, fantom, value, this._children);
        this._container.removeChild(fantom);
    }
});
