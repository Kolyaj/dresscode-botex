(function() {
    //#imports

    describe('Botex.Widget', function() {
        it('Доступ к дочернему виджету по имени', function() {
            var Child = Bricks.inherit(Botex.Widget);
            var Widget = Bricks.inherit(Botex.Widget, {
                getChild: function() {
                    return this.getEl('child');
                },

                _render: function() {
                    return {
                        content: new Child({
                            as: 'child'
                        })
                    };
                }
            });
            var widget = new Widget();
            widget.mount(document.body);
            chai.assert.instanceOf(widget.getChild(), Child);
        });

        it('Доступ к виджету в дочернем виджете', function() {
            var Child = Bricks.inherit(Botex.Widget);
            var Widget = Bricks.inherit(Botex.Widget, {
                getChild: function() {
                    return this.getEl('child');
                },

                _render: function() {
                    return {
                        content: new Botex.Widget({
                            content: new Child({
                                as: 'child'
                            })
                        })
                    };
                }
            });
            var widget = new Widget();
            widget.mount(document.body);
            chai.assert.instanceOf(widget.getChild(), Child);
        });

        describe('Declarative event listeners', function() {
            function createEventTest(widgetCtor) {
                var callback = sinon.spy();
                var widget = new widgetCtor({
                    callback: callback
                });
                widget.mount(document.body);
                widget.touch();
                chai.assert.isOk(callback.calledOnce);
                widget.destroy();
            }
            it('Событие навешивается на DOM-элемент внутри виджета', function() {
                var Widget = Bricks.inherit(Botex.Widget, {
                    params: {
                        callback: null
                    },

                    constructor: function() {
                        Widget.superclass.constructor.apply(this, arguments);
                        this._on('elem', 'click', this._getParams().callback);
                    },

                    touch: function() {
                        this.getEl('el').click();
                    },

                    _render: function() {
                        return {
                            content: Botex.zen('el:.elem')
                        };
                    }
                });
                createEventTest(Widget);
            });

            it('Событие навешивается на дочерний виджет', function() {
                var Child = Bricks.inherit(Botex.Widget, {
                    touch: function() {
                        this._fireEvent('event');
                    }
                });

                var Widget = Bricks.inherit(Botex.Widget, {
                    params: {
                        callback: null
                    },

                    constructor: function() {
                        Widget.superclass.constructor.apply(this, arguments);
                        this._on('child', 'event', this._getParams().callback);
                    },

                    touch: function() {
                        this.getEl('child').touch();
                    },

                    _render: function() {
                        return {
                            content: new Child({
                                as: 'child'
                            })
                        };
                    }
                });
                createEventTest(Widget);
            });

            it('Событие навешивается на DOM-элемент внутри дочернего виджета', function() {
                var Widget = Bricks.inherit(Botex.Widget, {
                    params: {
                        callback: null
                    },

                    constructor: function() {
                        Widget.superclass.constructor.apply(this, arguments);
                        this._on('elem', 'click', this._getParams().callback);
                    },

                    touch: function() {
                        this.getEl('elem').click();
                    },

                    _render: function() {
                        return {
                            content: new Botex.Widget({
                                content: Botex.zen('elem:.elem')
                            })
                        };
                    }
                });
                createEventTest(Widget);
            });

            it('Событие навешивается на дочерний виджет дочернего виджета', function() {
                var Child = Bricks.inherit(Botex.Widget, {
                    touch: function() {
                        this._fireEvent('event');
                    }
                });

                var Widget = Bricks.inherit(Botex.Widget, {
                    params: {
                        callback: null
                    },

                    constructor: function() {
                        Widget.superclass.constructor.apply(this, arguments);
                        this._on('child', 'event', this._getParams().callback);
                    },

                    touch: function() {
                        this.getEl('child').touch();
                    },

                    _render: function() {
                        return {
                            content: new Botex.Widget({
                                content: new Child({
                                    as: 'child'
                                })
                            })
                        };
                    }
                });
                createEventTest(Widget);
            });

            it('Событие навешивается на дочерний виджет внутри цепочки из двух виджетов', function() {
                var Child = Bricks.inherit(Botex.Widget, {
                    touch: function() {
                        this._fireEvent('event');
                    }
                });

                var Widget = Bricks.inherit(Botex.Widget, {
                    params: {
                        callback: null
                    },

                    constructor: function() {
                        Widget.superclass.constructor.apply(this, arguments);
                        this._on('child', 'event', this._getParams().callback);
                    },

                    touch: function() {
                        this.getEl('child').touch();
                    },

                    _render: function() {
                        return {
                            content: new Botex.Widget({
                                content: new Botex.Widget({
                                    content: new Child({
                                        as: 'child'
                                    })
                                })
                            })
                        };
                    }
                });
                createEventTest(Widget);
            });

            it('Событие навешивается на DOM-элемент, у которого апдейтер поменял класс', function() {
                var Widget = Bricks.inherit(Botex.Widget, {
                    params: {
                        callback: null
                    },

                    constructor: function() {
                        Widget.superclass.constructor.apply(this, arguments);
                        this._touched = new Botex.Mutable(false);
                        this._on('elem', 'click', this._getParams().callback);
                    },

                    touch: function() {
                        this.getEl('el').click();
                        this._touched.setValue(true);
                        this.getEl('el').click();
                    },

                    _render: function() {
                        return {
                            content: new Botex.Tag({
                                as: 'el',
                                className: this._touched.when(function(touched) {
                                    return touched ? 'elem' : '';
                                })
                            })
                        };
                    }
                });
                createEventTest(Widget);
            });

            it('Событие снимается с DOM-элемента, у которого апдейтер поменял класс', function() {
                var Widget = Bricks.inherit(Botex.Widget, {
                    params: {
                        callback: null
                    },

                    constructor: function() {
                        Widget.superclass.constructor.apply(this, arguments);
                        this._touched = new Botex.Mutable(false);
                        this._on('elem', 'click', this._getParams().callback);
                    },

                    touch: function() {
                        this.getEl('el').click();
                        this._touched.setValue(true);
                        this.getEl('el').click();
                    },

                    _render: function() {
                        return {
                            content: new Botex.Tag({
                                as: 'el',
                                className: this._touched.when(function(touched) {
                                    return touched ? '' : 'elem';
                                })
                            })
                        };
                    }
                });
                createEventTest(Widget);
            });

            it('Событие навешивается на корневой элемент', function() {
                var Widget = Bricks.inherit(Botex.Widget, {
                    params: {
                        callback: null
                    },

                    constructor: function() {
                        Widget.superclass.constructor.apply(this, arguments);
                        this._on('click', this._getParams().callback);
                    },

                    touch: function() {
                        this.getEl().click();
                    }
                });
                createEventTest(Widget);
            });

            it('Событие навешивается на корневые элементы двух вложенных виджетов', function() {
                var Child = Bricks.inherit(Botex.Widget, {
                    params: {
                        callback: null
                    },

                    constructor: function() {
                        Child.superclass.constructor.apply(this, arguments);
                        this._on('click', function(evt) {
                            this._getParams().callback();
                            evt.stopPropagation();
                        });
                    }
                });
                var Widget = Bricks.inherit(Botex.Widget, {
                    params: {
                        callback: null
                    },

                    constructor: function() {
                        Widget.superclass.constructor.apply(this, arguments);
                        this._on('click', this._getParams().callback);
                    },

                    touch: function() {
                        this.getEl('child').getEl().click();
                    },

                    _render: function($) {
                        return {
                            content: new Child({
                                as: 'child',
                                callback: $.callback
                            })
                        };
                    }
                });
                createEventTest(Widget);
            });

            it('Событие навешивается на корневой элемент со специфическим классом', function() {
                var Widget = Bricks.inherit(Botex.Widget, {
                    params: {
                        callback: null
                    },

                    constructor: function() {
                        Widget.superclass.constructor.apply(this, arguments);
                        this._on('mod', 'click', this._getParams().callback);
                    },

                    touch: function() {
                        this.getEl().click();
                    },

                    _render: function() {
                        return {
                            className: 'mod'
                        };
                    }
                });
                createEventTest(Widget);
            });

            it('Событие навешивается на корневой элемент при смене класса апдейтером', function() {
                var Widget = Bricks.inherit(Botex.Widget, {
                    params: {
                        callback: null
                    },

                    constructor: function() {
                        Widget.superclass.constructor.apply(this, arguments);
                        this._touched = new Botex.Mutable(false);
                        this._on('mod', 'click', this._getParams().callback);
                    },

                    touch: function() {
                        this.getEl().click();
                        this._touched.setValue(true);
                        this.getEl().click();
                    },

                    _render: function() {
                        return {
                            className: this._touched.when(function(touched) {
                                return touched ? 'mod' : '';
                            })
                        };
                    }
                });
                createEventTest(Widget);
            });

            it('Событие снимается с корневого элемента при смене класса апдейтером', function() {
                var Widget = Bricks.inherit(Botex.Widget, {
                    params: {
                        callback: null
                    },

                    constructor: function() {
                        Widget.superclass.constructor.apply(this, arguments);
                        this._touched = new Botex.Mutable(false);
                        this._on('mod', 'click', this._getParams().callback);
                    },

                    touch: function() {
                        this.getEl().click();
                        this._touched.setValue(true);
                        this.getEl().click();
                    },

                    _render: function() {
                        return {
                            className: this._touched.when(function(touched) {
                                return touched ? '' : 'mod';
                            })
                        };
                    }
                });
                createEventTest(Widget);
            });

            it('Событие навешивается на DOM-элемент, созданный в апдейтере', function() {
                var Widget = Bricks.inherit(Botex.Widget, {
                    params: {
                        callback: null
                    },

                    constructor: function() {
                        Widget.superclass.constructor.apply(this, arguments);
                        this._touched = new Botex.Mutable(false);
                        this._on('elem', 'click', this._getParams().callback);
                    },

                    touch: function() {
                        this._touched.setValue(true);
                        this.getEl('elem').click();
                    },

                    _render: function() {
                        return {
                            content: this._touched.when(function(touched) {
                                return touched ? Botex.zen('elem:.elem') : null;
                            })
                        };
                    }
                });
                createEventTest(Widget);
            });

            it('Событие навешивается на виджет, созданный апдейтером', function() {
                var Child = Bricks.inherit(Botex.Widget, {
                    touch: function() {
                        this._fireEvent('event');
                    }
                });
                var Widget = Bricks.inherit(Botex.Widget, {
                    params: {
                        callback: null
                    },

                    constructor: function() {
                        Widget.superclass.constructor.apply(this, arguments);
                        this._touched = new Botex.Mutable(false);
                        this._on('child', 'event', this._getParams().callback);
                    },

                    touch: function() {
                        this._touched.setValue(true);
                        this.getEl('child').touch();
                    },

                    _render: function() {
                        return {
                            content: this._touched.when(function(touched) {
                                if (touched) {
                                    return new Child({
                                        as: 'child'
                                    });
                                }
                            })
                        };
                    }
                });
                createEventTest(Widget);
            });

            it('Снял обработчик с DOM-элемента внутри виджета до рендеринга', function() {
                var Widget = Bricks.inherit(Botex.Widget, {
                    params: {
                        callback: null
                    },

                    constructor: function() {
                        Widget.superclass.constructor.apply(this, arguments);
                        this._on('elem1', 'click', this._getParams().callback);
                        this._on('elem2', 'click', this._getParams().callback);
                        this._un('elem1', 'click', this._getParams().callback);
                    },

                    touch: function() {
                        this.getEl('elem').click();
                    },

                    _render: function() {
                        return {
                            content: Botex.zen('.elem1', Botex.zen('elem:.elem2'))
                        };
                    }
                });
                createEventTest(Widget);
            });

            it('Вешаем обработчик события на DOM-элемент, созданный в MutableArray', function() {
                var Widget = Bricks.inherit(Botex.Widget, {
                    params: {
                        callback: null
                    },

                    constructor: function() {
                        Widget.superclass.constructor.apply(this, arguments);
                        this._data = new Botex.MutableArray();
                        this._on('elem', 'click', this._getParams().callback);
                    },

                    touch: function() {
                        this._data.push('foo');
                        this.getEl('elem').click();
                    },

                    _render: function() {
                        return {
                            content: this._data.transform(function(item) {
                                return Botex.zen('elem:.elem', item);
                            }, this)
                        };
                    }
                });
                createEventTest(Widget);
            });

            it('Вешаем обработчик события на DOM-элемент внутри DOM-элемента, созданного в MutableArray', function() {
                var Widget = Bricks.inherit(Botex.Widget, {
                    params: {
                        callback: null
                    },

                    constructor: function() {
                        Widget.superclass.constructor.apply(this, arguments);
                        this._data = new Botex.MutableArray();
                        this._on('elem', 'click', this._getParams().callback);
                    },

                    touch: function() {
                        this._data.push('foo');
                        this.getEl('elem').click();
                    },

                    _render: function() {
                        return {
                            content: this._data.transform(function(item) {
                                return Botex.zen('div', Botex.zen('elem:.elem', item));
                            }, this)
                        };
                    }
                });
                createEventTest(Widget);
            });

            it('Вешаем обработчик события на Widget, созданный в MutableArray', function() {
                var Child = Bricks.inherit(Botex.Widget, {
                    touch: function() {
                        this._fireEvent('event');
                    }
                });
                var Widget = Bricks.inherit(Botex.Widget, {
                    params: {
                        callback: null
                    },

                    constructor: function() {
                        Widget.superclass.constructor.apply(this, arguments);
                        this._data = new Botex.MutableArray();
                        this._on('child', 'event', this._getParams().callback);
                    },

                    touch: function() {
                        this._data.push('foo');
                        this.getEl('child').touch();
                    },

                    _render: function() {
                        return {
                            content: this._data.transform(function(item) {
                                return new Child({
                                    as: 'child',
                                    content: item
                                });
                            }, this)
                        };
                    }
                });
                createEventTest(Widget);
            });
        });
    });
})();
