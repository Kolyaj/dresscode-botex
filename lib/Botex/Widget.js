Botex.Widget = Bricks.inherit(Botex.Tag, {
    params: {
        hasRoot: true
    },

    constructor: function() {
        Botex.Widget.superclass.constructor.apply(this, arguments);
        this._winGhost = {};
        this._docGhost = {};
        this._win = this._winGhost;
        this._doc = this._docGhost;
        this._firstEl = null;
        this._lastEl = null;
        this._root = null;
        this._mounted = false;
        this._elems = {};
        this._children = [];
        this._domEventsController = new Bricks.EventsController();
        this._eventsController = new Bricks.EventsController();
        this._domListeners = {
            parent: null,
            self: {
                $$: [],
                $$_win: [],
                $$_doc: []
            }
        };
    },

    destroy: function() {
        this.unmount();
        this._eventsController.unAll();
        this._fireEvent('destroy');
    },

    mount: function(parentEl, beforeEl) {
        this.unmount();
        parentEl = Bricks.DOM.getEl(parentEl);
        beforeEl = Bricks.DOM.getEl(beforeEl);
        this._doc = parentEl && parentEl.ownerDocument || document;
        this._win = Bricks.DOM.getWindow(this._doc);
        Botex.CSS.mount(this._doc);
        this._domListeners.self.$$_win.forEach(function(listener) {
            this._domEventsController.on(this._win, listener.events, listener.fn, listener.ctx);
        }, this);
        this._domListeners.self.$$_doc.forEach(function(listener) {
            this._domEventsController.on(this._doc, listener.events, listener.fn, listener.ctx);
        }, this);
        var meta = this.getMeta();
        if (this._getParams().hasRoot) {
            this._root = this._createElement(meta);
            this._domListeners.self.$$.forEach(function(listener) {
                this._domEventsController.on(this._root, listener.events, listener.fn, listener.ctx);
            }, this);
            parentEl.insertBefore(this._root, beforeEl);
        } else {
            this._firstEl = this._doc.createComment('');
            this._lastEl = this._doc.createComment('');
            parentEl.insertBefore(this._firstEl, beforeEl);
            parentEl.insertBefore(this._lastEl, beforeEl);
            this._appendContent(parentEl, this._lastEl, meta.content);
        }
        this._mounted = true;
    },

    unmount: function() {
        if (this._mounted) {
            this._destroyContent();
            if (this._root) {
                Bricks.DOM.remove(this._root);
                this._root = null;
            } else {
                Bricks.DOM.remove(this._firstEl);
                Bricks.DOM.remove(this._lastEl);
            }
            this._domListeners.parent = null;
            this._doc = this._docGhost;
            this._win = this._winGhost;
            this._mounted = false;
        }
    },

    getFirstEl: function() {
        return this._root || this._firstEl;
    },

    getEl: function(elem) {
        if (elem) {
            if (this._elems[elem] && this._elems[elem][0]) {
                return this._elems[elem][0];
            }
            for (var i = 0; i < this._children.length; i++) {
                var el = this._children[i].getEl(elem);
                if (el) {
                    return el;
                }
            }
            return null;
        } else {
            return this._root;
        }
    },

    getEls: function(elem) {
        if (elem) {
            var result = this._elems[elem] ? this._elems[elem].slice(0) : [];
            this._children.forEach(function(child) {
                [].push.apply(result, child.getEls());
            }, this);
            return result;
        } else {
            return [this._root];
        }
    },


    getAs: function() {
        return this._getParams().as;
    },

    setParentListeners: function(listeners) {
        this._domListeners.parent = listeners;
    },


    _on: function(cls, events, fn) {
        if (arguments.length < 3) {
            fn = events;
            events = cls;
            cls = '$$';
        }
        if (cls === this._win) {
            cls = '$$_win';
        }
        if (cls === this._doc) {
            cls = '$$_doc';
        }
        if (typeof cls === 'string') {
            if (!this._domListeners.self[cls]) {
                this._domListeners.self[cls] = [];
            }
            this._domListeners.self[cls].push({
                events: events,
                fn: fn,
                ctx: this
            });
        } else {
            this._eventsController.on(cls, events, fn, this);
        }
    },

    _un: function(cls, events, fn) {
        if (arguments.length < 3) {
            fn = events;
            events = cls;
            cls = '$$';
        }
        if (cls === this._win) {
            cls = '$$_win';
        }
        if (cls === this._doc) {
            cls = '$$_doc';
        }
        if (typeof cls === 'string') {
            if (this._domListeners.self[cls]) {
                for (var i = 0; i < this._domListeners.self[cls].length; i++) {
                    if (this._domListeners.self[cls][i].events === events && this._domListeners.self[cls][i].fn === fn) {
                        this._domListeners.self[cls].splice(i, 1);
                        break;
                    }
                }
            }
        } else {
            this._eventsController.un(cls, events, fn, this);
        }
    },

    _createElement: function(meta) {
        var el = this._doc.createElement(meta.tagName);
        var className = meta.className.map(function(cls) {
            if (cls instanceof Quantum.Quant) {
                this._domEventsController.on(cls, 'change', this.$$_onMutableClassNameChange, {
                    el: el,
                    that: this
                });
                return cls.getValue();
            } else {
                return cls;
            }
        }, this).join(' ');
        el.className += ' ' + className;
        this._applyDOMListeners(el.className, el);
        if (meta.style) {
            var style = {};
            Pony.Object.keys(meta.style).forEach(function(prop) {
                if (meta.style[prop] instanceof Quantum.Quant) {
                    this._domEventsController.on(meta.style[prop], 'change', this.$$_onMutableStyleChange, {
                        el: el,
                        prop: prop
                    });
                    style[prop] = meta.style[prop].getValue();
                } else {
                    style[prop] = meta.style[prop];
                }
            }, this);
            Bricks.DOM.setStyle(el, style);
        }
        Pony.Object.keys(meta.attrs).forEach(function(prop) {
            if (meta.attrs[prop] instanceof Quantum.Quant) {
                this._domEventsController.on(meta.attrs[prop], 'change', this.$$_onMutableAttrChange, {
                    el: el,
                    attr: prop
                });
                el.setAttribute(prop, meta.attrs[prop].getValue());
            } else {
                el.setAttribute(prop, meta.attrs[prop]);
            }
        }, this);
        this._appendContent(el, null, meta.content);
        return el;
    },

    _appendContent: function(container, beforeEl, content) {
        if (beforeEl && typeof beforeEl.insertAdjacentHTML !== 'function') {
            var fantom = this._doc.createElement('div');
            container.insertBefore(fantom, beforeEl);
        }

        if (Pony.Array.isArray(content)) {
            content.forEach(function(item) {
                this._appendContent(container, fantom || beforeEl, item);
            }, this);
        } else if (content instanceof Botex.Widget) {
            this._registerChild(content);
            content.mount(container, fantom || beforeEl);
        } else if (content instanceof Botex.Tag) {
            var meta = content.getMeta();
            var el = this._createElement(meta);
            if (meta.as) {
                this._registerElem(meta.as, el);
            }
            container.insertBefore(el, fantom || beforeEl);
        } else if (content instanceof Quantum.Quant) {
            var widgetMutable = new Botex.WidgetMutable({
                mutable: content
            });
            this._registerChild(widgetMutable);
            widgetMutable.mount(container, fantom || beforeEl);
        } else if (content instanceof Botex.MutableArray) {
            var widgetMutableArray = new Botex.WidgetMutableArray({
                mutable: content
            });
            this._registerChild(widgetMutableArray);
            widgetMutableArray.mount(container, fantom || beforeEl);
        } else {
            if (content !== null && content !== undefined) {
                if (typeof content === 'string') {
                    content = Bricks.String.escapeHTML(content);
                }
                if (fantom) {
                    fantom.insertAdjacentHTML('beforebegin', content);
                } else if (beforeEl) {
                    beforeEl.insertAdjacentHTML('beforebegin', content);
                } else {
                    container.insertAdjacentHTML('beforeend', content);
                }
            }
        }

        if (fantom) {
            container.removeChild(fantom);
        }
    },

    _registerElem: function(as, elem) {
        if (this._elems[as]) {
            this._elems[as].push(elem);
        } else {
            this._elems[as] = [elem];
        }
    },

    _registerChild: function(child) {
        child.setParentListeners(this._domListeners);
        var widgetAs = child.getAs();
        if (widgetAs) {
            this._registerElem(widgetAs, child);
            this._applyDOMListeners(widgetAs, child);
        }
        this._children.push(child);
        this._domEventsController.on(child, 'destroy', this.$$_onChildDestroy, this);
    },

    _destroyContent: function() {
        this._domEventsController.unAll();
        this._children.forEach(function(child) {
            child.unmount();
        }, this);
        this._children.length = 0;
        this._elems = {};
        if (this._root) {
            while (this._root.firstChild) {
                this._root.removeChild(this._root.firstChild);
            }
        } else {
            while (this._firstEl.nextSibling && this._firstEl.nextSibling !== this._lastEl) {
                Bricks.DOM.remove(this._firstEl.nextSibling);
            }
        }
    },

    _applyDOMListeners: function(className, el) {
        var classNames = className.split(/\s+/).filter(Boolean);
        var listeners = this._domListeners;
        while (listeners) {
            classNames.forEach(function(cls) {
                if (listeners.self[cls]) {
                    listeners.self[cls].forEach(function(listener) {
                        this._domEventsController.on(el, listener.events, listener.fn, listener.ctx);
                    }, this);
                }
            }, this);
            listeners = listeners.parent;
        }
    },

    _removeDOMListeners: function(className, el) {
        var classNames = className.split(/\s+/).filter(Boolean);
        var listeners = this._domListeners;
        while (listeners) {
            classNames.forEach(function(cls) {
                if (listeners.self[cls]) {
                    listeners.self[cls].forEach(function(listener) {
                        this._domEventsController.un(el, listener.events, listener.fn, listener.ctx);
                    }, this);
                }
            }, this);
            listeners = listeners.parent;
        }
    },


    $$_onChildDestroy: function(evt) {
        var widgetAs = evt.target.getAs();
        if (widgetAs) {
            this._elems[widgetAs].splice(this._elems[widgetAs].indexOf(evt.target), 1);
            this._removeDOMListeners(widgetAs, evt.target);
        }
        this._children.splice(this._children.indexOf(evt.target), 1);
        this._domEventsController.un(evt.target, 'destroy', this.$$_onChildDestroy, this);
    },

    $$_onMutableClassNameChange: function(evt) {
        // this не указывает на текущий экземпляр класса
        var prevClassNames = evt.prevValue.split(/\s+/).filter(Boolean);
        var currClassNames = evt.value.split(/\s+/).filter(Boolean);
        prevClassNames.forEach(function(cls) {
            if (currClassNames.indexOf(cls) === -1) {
                this.that._removeDOMListeners(cls, this.el);
                Bricks.DOM.removeClassName(this.el, cls);
            }
        }, this);
        currClassNames.forEach(function(cls) {
            if (prevClassNames.indexOf(cls) === -1) {
                this.that._applyDOMListeners(cls, this.el);
                Bricks.DOM.addClassName(this.el, cls);
            }
        }, this);
    },

    $$_onMutableAttrChange: function(evt) {
        // this не указывает на текущий экземпляр класса
        this.el[this.attr] = evt.value;
    },

    $$_onMutableStyleChange: function(evt) {
        // this не указывает на текущий экземпляр класса
        var style = {};
        style[this.prop] = evt.value;
        Bricks.DOM.setStyle(this.el, style);
    }
});
