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
        this._updaters = {};
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
        return this._getResult().as;
    },


    _updater: function(name, fn) {
        if (arguments.length < 2) {
            fn = name;
            name = '';
        }
        var updater = new Botex.DataBinder(fn, this);
        if (this._updaters[name]) {
            this._updaters[name].push(updater);
        } else {
            this._updaters[name] = [updater];
        }
        return updater;
    },

    _update: function(name) {
        name = name || '';
        if (this._updaters[name]) {
            this._updaters[name].forEach(function(updater) {
                updater.update();
            }, this);
        }
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
        if (arguments.length < 3) {
            fn = events;
            events = el;
            el = '';
        }
        this._eventsController.on(this._getEl(el), events, fn, this);
    },

    _un: function(el, events, fn) {
        if (arguments.length < 3) {
            fn = events;
            events = el;
            el = '';
        }
        this._eventsController.un(this._getEl(el), events, fn, this);
    },

    _createElement: function(meta) {
        var el = this._doc.createElement(meta.tagName);
        var className = meta.className.map(function(cls) {
            if (cls instanceof Botex.DataBinder) {
                cls.renderClassName(el);
                return '';
            } else {
                return cls;
            }
        }, this).join(' ');
        el.className += ' ' + className;
        if (meta.style) {
            var style = {};
            Pony.Object.keys(meta.style).forEach(function(prop) {
                if (meta.style[prop] instanceof Botex.DataBinder) {
                    meta.style[prop].renderStyle(el, prop);
                } else {
                    style[prop] = meta.style[prop];
                }
            }, this);
            Bricks.DOM.setStyle(el, style);
        }
        Pony.Object.keys(meta.attrs).forEach(function(prop) {
            if (meta.attrs[prop] instanceof Botex.DataBinder) {
                meta.attrs[prop].renderAttr(el, prop);
            } else {
                el[prop] = meta.attrs[prop];
            }
        }, this);
        this._appendContent(el, null, meta.content);
        return el;
    },

    _appendContent: function(el, beforeEl, content) {
        if (Pony.Array.isArray(content)) {
            content.forEach(function(item) {
                this._appendContent(el, beforeEl, item);
            }, this);
        } else if (content instanceof Botex.Widget) {
            content.getNames().forEach(function(name) {
                if (this._children[name]) {
                    this._children[name].push(content);
                } else {
                    this._children[name] = [content];
                }
            }, this);
            content.renderTo(el, beforeEl);
        } else if (content instanceof Botex.Tag) {
            el.insertBefore(this._createElement(content.getMeta()), beforeEl);
        } else if (content instanceof Botex.DataBinder) {
            content.renderContent(el, beforeEl, this._appendContent, this);
        } else {
            if (typeof content === 'string') {
                content = Bricks.String.escapeHTML(content);
            }
            content = [content].join('');
            if (beforeEl) {
                beforeEl.insertAdjacentHTML('beforebegin', content);
            } else {
                el.insertAdjacentHTML('beforeend', content);
            }
        }
    }
});
