Botex.Widget = Bricks.inherit(Botex.Tag, {
    params: {
        hasRoot: true,
        as: ''
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
        this._rootQuant = new Quantum.Quant(null);
        this._winId = String(Math.random());
        this._docId = String(Math.random());
        this._rootId = String(Math.random());
        this._mounted = false;
        this._elemQuants = {};
        this._elemsStore = new Botex.ElemsStore();
        this._elemListeners = [];
        this._children = [];
        this._domEventsController = new Bricks.EventsController();
        this._eventsController = new Bricks.EventsController();
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
        this._elemsStore.addElem(this._winId, this._win);
        this._elemsStore.addElem(this._docId, this._doc);
        var meta = this.getMeta();
        if (this._getParams().hasRoot) {
            this._root = this._createElement(meta, parentEl, beforeEl);
            this._rootQuant.setValue(this._root);
            this._elemsStore.addElem(this._rootId, this._root);
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
                this._rootQuant.setValue(null);
                Bricks.DOM.remove(this._root);
                this._root = null;
            } else {
                Bricks.DOM.remove(this._firstEl);
                Bricks.DOM.remove(this._lastEl);
            }
            this._doc = this._docGhost;
            this._win = this._winGhost;
            this._mounted = false;
        }
    },

    getFirstEl: function() {
        return this._root || this._firstEl;
    },

    getEl: function() {
        return this._rootQuant;
    },

    getAs: function() {
        return this._getParams().as;
    },

    getElemsStore: function() {
        return this._elemsStore;
    },


    _getEl: function(name) {
        if (name) {
            if (!this._elemQuants[name]) {
                var quant = new Quantum.Quant(this._elemsStore.getElems(name)[0] || null);
                new Botex.ElemsObserver({
                    store: this._elemsStore,
                    name: name,
                    onAdd: function(elem) {
                        if (!quant.getValue()) {
                            quant.setValue(elem);
                        }
                    },
                    onRemove: function(elem) {
                        if (quant.getValue() === elem) {
                            quant.setValue(this._elemsStore.getElems(name)[0] || null);
                        }
                    },
                    ctx: this
                });
                this._elemQuants[name] = quant;
            }
            return this._elemQuants[name];
        } else {
            return this._rootQuant;
        }

    },

    _getEls: function(elem) {
        if (elem) {
            return this._elemsStore.getElems(elem);
        } else {
            return [this._root];
        }
    },

    _getElSize: function(name) {
        return this._getEl(name).when(function(el) {
            return el ? Bricks.DOM.getSize(el) : [0, 0];
        });
    },

    _getElPos: function(name) {
        return this._getEl(name).when(function(el) {
            return el ? Bricks.DOM.getPos(el) : [0, 0];
        });
    },

    _on: function(name, events, fn) {
        if (arguments.length < 3) {
            fn = events;
            events = name;
            name = this._rootId;
        }
        if (name === this._win) {
            name = this._winId;
        }
        if (name === this._doc) {
            name = this._docId;
        }
        if (typeof name === 'string') {
            this._splitEventNames(events).forEach(function(event) {
                this._elemListeners.push([name, event, fn, new Botex.ElemsObserver({
                    store: this._elemsStore,
                    name: name,
                    onAdd: function(elem) {
                        this._domEventsController.on(elem, event, fn, this);
                    },
                    onRemove: function(elem) {
                        this._domEventsController.un(elem, event, fn, this);
                    },
                    ctx: this
                })]);
            }, this);
        } else {
            this._eventsController.on(name, events, fn, this);
        }
    },

    _un: function(name, events, fn) {
        if (arguments.length < 3) {
            fn = events;
            events = name;
            name = this._rootId;
        }
        if (name === this._win) {
            name = this._winId;
        }
        if (name === this._doc) {
            name = this._docId;
        }
        if (typeof name === 'string') {
            this._splitEventNames(events).forEach(function(event) {
                for (var i = 0; i < this._elemListeners.length; i++) {
                    var item = this._elemListeners[i];
                    if (item[0] === name && item[1] === event && item[2] === fn) {
                        item[3].destroy();
                        this._elemListeners.splice(i, 1);
                        break;
                    }
                }
            }, this);
        } else {
            this._eventsController.un(name, events, fn, this);
        }
    },

    _splitEventNames: function(events) {
        var result = [];
        if (!Pony.Array.isArray(events)) {
            events = [events];
        }
        events.forEach(function(event) {
            if (typeof event === 'string') {
                [].push.apply(result, event.split(/\s*,\s*/));
            } else {
                result.push(event);
            }
        }, this);
        return result;
    },

    _createElement: function(meta, container, beforeEl) {
        var el = meta.attrs.xmlns ? this._doc.createElementNS(meta.attrs.xmlns, meta.tagName) : this._doc.createElement(meta.tagName);
        var className = this._joinClassNames(meta.className.map(function(cls) {
            if (cls instanceof Quantum.Quant) {
                this._domEventsController.on(cls, 'change', this.$$_onMutableClassNameChange, {
                    el: el,
                    that: this
                });
                return cls.getValue();
            } else {
                return cls;
            }
        }, this));
        Bricks.DOM.setClassName(el, className);
        Pony.Object.keys(meta.style).forEach(function(prop) {
            var value = meta.style[prop];
            if (value instanceof Quantum.Quant) {
                this._domEventsController.on(value, 'change', this.$$_onMutableStyleChange, {
                    el: el,
                    prop: prop
                });
                value = value.getValue();
            }
            Bricks.DOM.setStyleProperty(el, prop, value);
        }, this);
        Pony.Object.keys(meta.attrs).forEach(function(prop) {
            var value = meta.attrs[prop];
            if (value instanceof Quantum.Quant) {
                this._domEventsController.on(value, 'change', this.$$_onMutableAttrChange, {
                    el: el,
                    attr: prop
                });
                value = value.getValue();
            }
            el.setAttribute(prop, value);
        }, this);
        Pony.Object.keys(meta.props).forEach(function(prop) {
            var value = meta.props[prop];
            if (value instanceof Quantum.Quant) {
                this._domEventsController.on(value, 'change', this.$$_onMutablePropChange, {
                    el: el,
                    prop: prop
                });
                value = value.getValue();
            }
            el[prop] = value;
        }, this);
        container.insertBefore(el, beforeEl);
        this._appendContent(el, null, meta.content);
        this._splitClassNames(className).forEach(function(cls) {
            this._elemsStore.addElem(cls, el);
        }, this);
        return el;
    },

    _appendContent: function(container, beforeEl, content) {
        if (beforeEl && typeof beforeEl.insertAdjacentHTML !== 'function') {
            var fantom = this._doc.createElement('div');
            container.insertBefore(fantom, beforeEl);
        }

        if (content instanceof Quantum.Quant) {
            content = new Botex.WidgetMutable({
                mutable: content
            });
        } else if (content instanceof Botex.MutableArray) {
            content = new Botex.WidgetMutableArray({
                mutable: content
            });
        }

        if (Pony.Array.isArray(content)) {
            content.forEach(function(item) {
                this._appendContent(container, fantom || beforeEl, item);
            }, this);
        } else if (content instanceof Botex.Widget) {
            this._registerChild(content);
            content.mount(container, fantom || beforeEl);
        } else if (content instanceof Botex.Tag) {
            this._createElement(content.getMeta(), container, fantom || beforeEl);
        } else if (content && content.ownerDocument === this._doc) {
            container.insertBefore(content, beforeEl);
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

    _registerChild: function(child) {
        this._elemsStore.addChild(child.getElemsStore());
        var widgetAs = child.getAs();
        if (widgetAs) {
            this._elemsStore.addElem(widgetAs, child);
        }
        this._children.push(child);
        this._domEventsController.on(child, 'destroy', this.$$_onChildDestroy, this);
    },

    _destroyContent: function() {
        this._domEventsController.unAll();
        this._children.forEach(function(child) {
            this._elemsStore.removeChild(child.getElemsStore());
            child.unmount();
        }, this);
        this._children.length = 0;
        this._elemsStore.removeAllElems();
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

    _joinClassNames: function(cls) {
        if (Pony.Array.isArray(cls)) {
            return cls.map(this._joinClassNames, this).join(' ');
        } else if (cls === null || cls === undefined) {
            return '';
        } else {
            return String(cls);
        }
    },

    _splitClassNames: function(cls) {
        return cls.split(/\s+/).filter(Boolean);
    },


    $$_onChildDestroy: function(evt) {
        this._elemsStore.removeChild(evt.target.getElemsStore());
        var widgetAs = evt.target.getAs();
        if (widgetAs) {
            this._elemsStore.removeElem(widgetAs, evt.target);
        }
        this._children.splice(this._children.indexOf(evt.target), 1);
        this._domEventsController.un(evt.target, 'destroy', this.$$_onChildDestroy, this);
    },

    $$_onMutableClassNameChange: function(evt) {
        // this не указывает на текущий экземпляр класса
        var prevClassNames = this.that._splitClassNames(this.that._joinClassNames(evt.prevValue));
        var currClassNames = this.that._splitClassNames(this.that._joinClassNames(evt.value));
        prevClassNames.forEach(function(cls) {
            if (currClassNames.indexOf(cls) === -1) {
                this.that._elemsStore.removeElem(cls, this.el);
                Bricks.DOM.removeClassName(this.el, cls);
            }
        }, this);
        currClassNames.forEach(function(cls) {
            if (prevClassNames.indexOf(cls) === -1) {
                this.that._elemsStore.addElem(cls, this.el);
                Bricks.DOM.addClassName(this.el, cls);
            }
        }, this);
    },

    $$_onMutableAttrChange: function(evt) {
        // this не указывает на текущий экземпляр класса
        this.el.setAttribute(this.attr, evt.value);
    },

    $$_onMutablePropChange: function(evt) {
        // this не указывает на текущий экземпляр класса
        this.el[this.prop] = evt.value;
    },

    $$_onMutableStyleChange: function(evt) {
        // this не указывает на текущий экземпляр класса
        Bricks.DOM.setStyleProperty(this.el, this.prop, evt.value);
    }
});
