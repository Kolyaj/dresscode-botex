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
        this._listeners = [{}];
    },

    destroy: function() {
        this._eventsController.unAll();
        if (this._el) {
            Bricks.DOM.remove(this._el);
        }
        this._fireEvent('destroy');
    },

    renderTo: function(parentEl, beforeEl) {
        parentEl = Bricks.DOM.getEl(parentEl);
        beforeEl = Bricks.DOM.getEl(beforeEl);
        this._doc = parentEl && parentEl.ownerDocument || document;
        this._win = Bricks.DOM.getWindow(this._doc);
        Botex.CSS.renderTo(this._doc);
        this._el = this._createElement(this.getMeta());
        if (this._listeners[0]['$$__el']) {
            this._listeners[0]['$$__el'].forEach(function(listener) {
                this._eventsController.on(this._el, listener.events.join(','), listener.fn, listener.ctx);
            }, this);
        }
        if (parentEl) {
            parentEl.insertBefore(this._el, beforeEl);
        }
    },

    getEl: function() {
        return this._el;
    },

    getNames: function() {
        return this._getParams().as;
    },

    setParentListeners: function(listeners) {
        [].push.apply(this._listeners, listeners);
    },


    _getChild: function(name) {
        if (this._children[name] && this._children[name].length > 0) {
            return this._children[name][0];
        }
    },

    _getChildren: function(name) {
        return this._children[name] || [];
    },

    _getEl: function(cls) {
        if (!cls) {
            return this._el;
        } else if (typeof cls === 'string') {
            this.$$_elementsCache = this.$$_elementsCache || {};
            if (!this.$$_elementsCache[cls]) {
                var el = null;
                if (!cls || Bricks.DOM.classNameExists(this._el, cls)) {
                    el = this._el;
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
        var nodeList = this._el.querySelectorAll('.' + cls);
        var result = [];
        for (var i = 0; i < nodeList.length; i++) {
            result.push(nodeList[i]);
        }
        return result;
    },

    _on: function(cls, events, fn) {
        if (arguments.length < 3) {
            fn = events;
            events = cls;
            cls = '$$__el';
        }
        if (typeof cls === 'string') {
            if (!this._listeners[0][cls]) {
                this._listeners[0][cls] = [];
            }
            this._listeners[0][cls].push({
                events: events.split(','),
                fn: fn,
                ctx: this
            });
            if (this._el) {
                if (cls === '$$__el') {
                    this._eventsController.on(this._el, events, fn, this);
                } else {
                    this._getEls(cls).forEach(function(el) {
                        this._eventsController.on(el, events, fn, this);
                    }, this);
                }
            }
        } else {
            this._eventsController.on(cls, events, fn, this);
        }
    },

    _un: function(cls, events, fn) {
        if (arguments.length < 3) {
            fn = events;
            events = cls;
            cls = '$$__el';
            this._eventsController.un(this._el, cls, events, this);
        }
        if (typeof cls === 'string') {
            if (this._listeners[0][cls]) {
                var eventsArr = events.split(',');
                this._listeners[0][cls] = this._listeners[0][cls].filter(function(item) {
                    eventsArr.forEach(function(event) {
                        let eventIndex = item.events.indexOf(event);
                        if (eventIndex > -1 && item.fn === fn && item.ctx === this) {
                            item.events.splice(eventIndex, 1);
                        }
                    }, this);
                    return item.events.length > 0;
                }, this);
            }
            if (this._el) {
                if (cls === '$$__el') {
                    this._eventsController.un(this._el, events, fn, this);
                } else {
                    this._getEls(cls).forEach(function(el) {
                        this._eventsController.un(el, events, fn, this);
                    }, this);
                }
            }
        } else {
            this._eventsController.un(cls, events, fn, this);
        }
    },

    _createElement: function(meta, children) {
        var el = this._doc.createElement(meta.tagName);
        var className = meta.className.map(function(cls) {
            if (cls instanceof Botex.Mutable) {
                var updater = new Botex.DataBinderClassName(cls, el);
                this._on(updater, 'addclass', this.$$_onAddClassName);
                this._on(updater, 'removeclass', this.$$_onRemoveClassName);
                return '';
            } else {
                return cls;
            }
        }, this).join(' ');
        el.className += ' ' + className;
        this._addListeners(el.className, el);
        if (meta.style) {
            var style = {};
            Pony.Object.keys(meta.style).forEach(function(prop) {
                if (meta.style[prop] instanceof Botex.Mutable) {
                    new Botex.DataBinderStyle(meta.style[prop], el, prop);
                } else {
                    style[prop] = meta.style[prop];
                }
            }, this);
            Bricks.DOM.setStyle(el, style);
        }
        Pony.Object.keys(meta.attrs).forEach(function(prop) {
            if (meta.attrs[prop] instanceof Botex.Mutable) {
                new Botex.DataBinderAttr(meta.attrs[prop], el, prop);
            } else {
                el[prop] = meta.attrs[prop];
            }
        }, this);
        this._appendContent(el, null, meta.content, children);
        return el;
    },

    _appendContent: function(el, beforeEl, content, children) {
        if (Pony.Array.isArray(content)) {
            content.forEach(function(item) {
                this._appendContent(el, beforeEl, item, children);
            }, this);
        } else if (content instanceof Botex.Widget) {
            content.setParentListeners(this._listeners);
            this._registerChild(content, true);
            if (children) {
                children.push(content);
            }
            content.renderTo(el, beforeEl);
        } else if (content instanceof Botex.Tag) {
            el.insertBefore(this._createElement(content.getMeta(), children), beforeEl);
        } else if (content instanceof Botex.Mutable) {
            new Botex.DataBinderContent(content, el, beforeEl, this._appendContent, this);
        } else {
            if (content !== null && content !== undefined) {
                if (typeof content === 'string') {
                    content = Bricks.String.escapeHTML(content);
                }
                if (beforeEl) {
                    beforeEl.insertAdjacentHTML('beforebegin', content);
                } else {
                    el.insertAdjacentHTML('beforeend', content);
                }
            }
        }
    },

    _addListeners: function(className, el) {
        className.split(/\s+/).forEach(function(cls) {
            if (cls) {
                this._listeners.forEach(function(listeners) {
                    if (listeners && listeners[cls]) {
                        listeners[cls].forEach(function(listener) {
                            this._eventsController.on(el, listener.events.join(','), listener.fn, listener.ctx);
                        }, this);
                    }
                }, this);
            }
        }, this);
    },

    _removeListeners: function(cls, el) {
        this._listeners.forEach(function(listeners) {
            if (listeners && listeners[cls]) {
                listeners[cls].forEach(function(listener) {
                    this._eventsController.un(el, listener.events.join(','), listener.fn, listener.ctx);
                }, this);
            }
        }, this);
    },

    _registerChild: function(child, addListeners) {
        child.getNames().forEach(function(name) {
            if (this._children[name]) {
                this._children[name].push(child);
            } else {
                this._children[name] = [child];
            }
            if (addListeners) {
                this._addListeners(name, child);
            }
        }, this);
        this._on(child, 'newchild', this.$$_onNewGrandchild);
        this._on(child, 'destroy', this.$$_onDestroyChild);
        this._fireEvent('newchild', {child: child});
    },


    $$_onDestroyChild: function(evt) {
        evt.target.getNames().forEach(function(name) {
            this._children[name] = this._children[name].filter(function(child) {
                return child !== evt.target;
            });
        }, this);
        this._un(evt.target, 'newchild', this.$$_onNewGrandchild);
        this._un(evt.target, 'destroy', this.$$_onDestroyChild);
    },

    $$_onNewGrandchild: function(evt) {
        this._registerChild(evt.child, false);
    },

    $$_onAddClassName: function(evt) {
        this._addListeners(evt.className, evt.el);
    },

    $$_onRemoveClassName: function(evt) {
        this._removeListeners(evt.className, evt.el);
    }
});
