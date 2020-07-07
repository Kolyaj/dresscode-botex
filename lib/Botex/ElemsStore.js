Botex.ElemsStore = Bricks.inherit(Bricks.Component, {
    constructor: function() {
        Botex.ElemsStore.superclass.constructor.apply(this, arguments);
        this._elems = {};
        this._childs = [];
    },

    addChild: function(child) {
        this._childs.push(child);
        child.getAllElems().forEach(function(item) {
            this._fireEvent('addelem', {
                name: item.name,
                elem: item.elem
            });
        }, this);
        this._on(child, 'addelem', this.$$_onChildAddElem);
        this._on(child, 'removeelem', this.$$_onChildRemoveElem);
    },

    removeChild: function(child) {
        this._childs.splice(this._childs.indexOf(child), 1);
        this._un(child, 'addelem', this.$$_onChildAddElem);
        this._un(child, 'removeelem', this.$$_onChildRemoveElem);
        child.getAllElems().forEach(function(item) {
            this._fireEvent('removeelem', {
                name: item.name,
                elem: item.elem
            });
        }, this);
    },

    addElem: function(name, elem) {
        if (this._elems[name]) {
            this._elems[name].push(elem);
        } else {
            this._elems[name] = [elem];
        }
        this._fireEvent('addelem', {
            name: name,
            elem: elem
        });
    },

    removeElem: function(name, elem) {
        if (this._elems[name]) {
            this._elems[name].splice(this._elems[name].indexOf(elem), 1);
        }
        this._fireEvent('removeelem', {
            name: name,
            elem: elem
        });
    },

    getElems: function(name) {
        var elems = this._elems[name] ? this._elems[name].slice(0) : [];
        this._childs.forEach(function(child) {
            [].push.apply(elems, child.getElems(name));
        }, this);
        return elems;
    },

    getAllElems: function() {
        var elems = [];
        Pony.Object.keys(this._elems).forEach(function(name) {
            this._elems[name].forEach(function(elem) {
                elems.push({name: name, elem: elem});
            }, this);
        }, this);
        this._childs.forEach(function(child) {
            [].push.apply(elems, child.getAllElems());
        });
        return elems;
    },

    removeAllElems: function() {
        Pony.Object.keys(this._elems).forEach(function(name) {
            var elems = this._elems[name];
            this._elems[name] = [];
            elems.forEach(function(elem) {
                this._fireEvent('removeelem', {
                    name: name,
                    elem: elem
                });
            }, this);
        }, this);
    },


    $$_onChildAddElem: function(evt) {
        this._fireEvent('addelem', {
            name: evt.name,
            elem: evt.elem
        });
    },

    $$_onChildRemoveElem: function(evt) {
        this._fireEvent('removeelem', {
            name: evt.name,
            elem: evt.elem
        });
    }
});
