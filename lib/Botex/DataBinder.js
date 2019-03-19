Botex.DataBinder = Bricks.inherit({
    constructor: function(fn, ctx) {
        this._fn = fn;
        this._ctx = ctx;
        this._container = null;
        this._renderer = null;
        this._rendererCtx = null;
        this._contentBeforeEl = null;
        this._contentAfterEl = null;
        this._mode = '';
        this._prop = '';
        this._lastValue = null;
        this._children = [];
    },

    renderClassName: function(container) {
        this._mode = 'cls';
        this._container = container;
        this._lastValue = this._fn.call(this._ctx);
        container.className += ' ' + this._lastValue + ' ';
    },

    renderStyle: function(container, prop) {
        this._mode = 'style';
        this._container = container;
        this._prop = prop;
        this._lastValue = this._fn.call(this._ctx);
        var propValue = Bricks.DOM.normalizeCSSProperty(prop, this._lastValue);
        container.style[propValue[0]] = propValue[1];
    },

    renderAttr: function(container, attr) {
        this._mode = 'attr';
        this._container = container;
        this._prop = attr;
        this._lastValue = this._fn.call(this._ctx);
        container[attr] = this._lastValue;
    },

    renderContent: function(container, beforeEl, renderer, rendererCtx) {
        this._mode = 'content';
        this._container = container;
        this._renderer = renderer;
        this._rendererCtx = rendererCtx;
        var doc = container.ownerDocument;
        this._contentBeforeEl = doc.createComment('');
        this._contentAfterEl = doc.createComment('');
        container.insertBefore(this._contentBeforeEl, beforeEl);
        renderer.call(rendererCtx, container, beforeEl, this._fn.call(this._ctx), this._children);
        container.insertBefore(this._contentAfterEl, beforeEl);
    },

    update: function() {
        var newValue = this._fn.call(this._ctx);
        if (this._mode === 'cls') {
            if (newValue !== this._lastValue) {
                this._container.className = this._container.className.replace(' ' + this._lastValue + ' ', '') + ' ' + newValue + ' ';
            }
        } else if (this._mode === 'style') {
            if (newValue !== this._lastValue) {
                var propValue = Bricks.DOM.normalizeCSSProperty(this._prop, newValue);
                this._container.style[propValue[0]] = propValue[1];
            }
        } else if (this._mode === 'attr') {
            if (newValue !== this._lastValue) {
                this._container[this._prop] = newValue;
            }
        } else if (this._mode === 'content') {
            this._children.forEach(function(child) {
                child.destroy();
            }, this);
            this._children.length = 0;
            while (this._contentBeforeEl.nextSibling && this._contentBeforeEl.nextSibling !== this._contentAfterEl) {
                this._container.removeChild(this._contentBeforeEl.nextSibling);
            }
            var fantom = this._container.ownerDocument.createElement('div');
            this._container.insertBefore(fantom, this._contentAfterEl);
            this._renderer.call(this._rendererCtx, this._container, fantom, newValue, this._children);
            this._container.removeChild(fantom);
        }
        if (this._mode !== 'content') {
            this._lastValue = newValue;
        }
    }
});
