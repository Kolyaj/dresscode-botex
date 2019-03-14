Botex.Widget = Bricks.inherit(Botex.Tag, {
    params: {
        as: []
    },

    accumParams: {
        as: 'array'
    },

    constructor: function() {
        Botex.Widget.superclass.constructor.apply(this, arguments);
        this._doc = null;
        this._win = null;
        this._el = null;
        this._children = {};
        this._eventsController = new Bricks.EventsController();
    },

    destroy: function() {
        this._eventsController.unAll();
        Bricks.DOM.remove(this._getEl());
        this._fireEvent('destroy');
    },

    renderTo: function(parentEl, beforeEl) {
        parentEl = Bricks.DOM.getEl(parentEl);
        beforeEl = Bricks.DOM.getEl(beforeEl);
        this._doc = parentEl && parentEl.ownerDocument || document;
        this._win = Bricks.DOM.getWindow(this._doc);
        Botex.CSS.renderTo(this._doc);
        this._el = this._createElement(this.getMeta());
        if (parentEl) {
            parentEl.insertBefore(this._el, beforeEl);
        }
    },

    getEl: function() {
        return this._el;
    },

    getNames: function() {
        return this._result.as;
    },


    _getEl: function(cls) {
        if (typeof cls === 'string') {
            this.$$_elementsCache = this.$$_elementsCache || {};
            if (!this.$$_elementsCache[cls]) {
                var el = null;
                if (!cls || Bricks.DOM.classNameExists(this._el, cls)) {
                    el = this._el;
                } else if (this._children[cls]) {
                    el = this._children[cls][0];
                } else {
                    el = this._el.querySelector('.' + cls);
                }
                this.$$_elementsCache[cls] = el;
            }
            return this.$$_elementsCache[cls];
        } else {
            return cls;
        }
    },

    _getEls: function(cls) {
        if (this._children[cls]) {
            return this._children[cls];
        } else {
            var nodeList = this._el.querySelectorAll('.' + cls);
            var result = [];
            for (var i = 0; i < nodeList.length; i++) {
                result.push(nodeList[i]);
            }
            return result;
        }
    },

    _on: function(el, events, fn) {
        this._eventsController.on(this._getEl(el), events, fn, this);
    },

    _un: function(el, events, fn) {
        this._eventsController.un(this._getEl(el), events, fn, this);
    },

    _createElement: function(meta) {
        var el = this._doc.createElement(meta.tagName);
        el.className = meta.className;
        if (meta.style) {
            Bricks.DOM.setStyle(el, meta.style);
        }
        Pony.Object.assign(el, meta.attrs);
        this._appendContent(el, meta.content);
        return el;
    },

    _appendContent: function(el, content) {
        if (Pony.Array.isArray(content)) {
            content.forEach(function(item) {
                this._appendContent(el, item);
            }, this);
        } else if (content instanceof Botex.Widget) {
            content.getNames().forEach(function(name) {
                if (this._children[name]) {
                    this._children[name].push(content);
                } else {
                    this._children[name] = [content];
                }
            }, this);
            content.renderTo(el);
        } else if (content instanceof Botex.Tag) {
            el.appendChild(this._createElement(content.getMeta()));
        } else {
            if (typeof content === 'string') {
                content = Bricks.String.escapeHTML(content);
            }
            content = [content].join('');
            el.insertAdjacentHTML('beforeend', content);
        }
    }
});
