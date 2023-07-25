(function() {
    //#imports

    describe('Botex.Widget', function() {
        it('Доступ к дочернему виджету по имени', function() {
            var Child = Bricks.inherit(Botex.Widget);
            var Widget = Bricks.inherit(Botex.Widget, {
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
            chai.assert.instanceOf(widget._getEl('child').getValue(), Child);
        });

        it('Доступ к виджету в дочернем виджете', function() {
            var Child = Bricks.inherit(Botex.Widget);
            var Widget = Bricks.inherit(Botex.Widget, {
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
            chai.assert.instanceOf(widget._getEl('child').getValue(), Child);
        });

        it('Получаем дочерний виджет до рендеринга, а проверяем после', function() {
            var Child = Bricks.inherit(Botex.Widget);
            var Widget = Bricks.inherit(Botex.Widget, {
                _render: function() {
                    return {
                        content: new Child({
                            as: 'child'
                        })
                    };
                }
            });
            var widget = new Widget();
            var child = widget._getEl('child');
            chai.assert.equal(child.getValue(), null);
            widget.mount(document.body);
            chai.assert.instanceOf(child.getValue(), Child);
        });

        it('Получаем виджет в дочернем виджете до рендеринга, а проверяем после', function() {
            var Child = Bricks.inherit(Botex.Widget);
            var Widget = Bricks.inherit(Botex.Widget, {
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
            var child = widget._getEl('child');
            chai.assert.equal(child.getValue(), null);
            widget.mount(document.body);
            chai.assert.instanceOf(child.getValue(), Child);
        });

        it('Элемент в кванте ._getEl() исчезает при исчезании из DOM', function() {
            var touched = new Quantum.Quant(false);
            var Widget = Bricks.inherit(Botex.Widget, {
                _render: function() {
                    return {
                        content: Botex.ifNot(touched, function() {
                            return Botex.zen('.child');
                        })
                    };
                }
            });
            var widget = new Widget();
            widget.mount(document.body);
            var child = widget._getEl('child');
            chai.assert.notEqual(child.getValue(), null);
            touched.setValue(true);
            chai.assert.equal(child.getValue(), null);
            touched.setValue(false);
            chai.assert.notEqual(child.getValue(), null);
        });

        it('Поглубже вложенный элемент в кванте ._getEl() исчезает при исчезании из DOM', function() {
            var touched = new Quantum.Quant(false);
            var Widget = Bricks.inherit(Botex.Widget, {
                _render: function() {
                    return {
                        content: Botex.ifNot(touched, function() {
                            return new Botex.Widget({
                                content: Botex.zen('.child')
                            });
                        })
                    };
                }
            });
            var widget = new Widget();
            widget.mount(document.body);
            var child = widget._getEl('child');
            chai.assert.notEqual(child.getValue(), null);
            touched.setValue(true);
            chai.assert.equal(child.getValue(), null);
            touched.setValue(false);
            chai.assert.notEqual(child.getValue(), null);
        });

        it('className из вложенных массивов', function() {
            var widget = new Botex.Widget({
                className: ['foo', ['bar', 'baz']]
            });
            widget.mount(document.body);
            chai.assert.equal(widget.getEl().getValue().className, ' foo bar baz');
        });

        it('Квант в className возвращает массив', function() {
            var quant = new Quantum.Quant(false);
            var widget = new Botex.Widget({
                className: quant.when(function(value) {
                    return value ? ['foo1', ['foo2', 'foo3']] : ['bar1', ['bar2', 'bar3']];
                })
            });
            widget.mount(document.body);
            chai.assert.equal(widget.getEl().getValue().className, ' bar1 bar2 bar3');
            quant.setValue(true);
            chai.assert.equal(widget.getEl().getValue().className, 'foo1 foo2 foo3');
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
                        this._getEl('elem').getValue().click();
                    },

                    _render: function() {
                        return {
                            content: Botex.zen('.elem')
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
                        this._getEl('child').getValue().touch();
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
                        this._getEl('elem').getValue().click();
                    },

                    _render: function() {
                        return {
                            content: new Botex.Widget({
                                content: Botex.zen('.elem')
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
                        this._getEl('child').getValue().touch();
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
                        this._getEl('child').getValue().touch();
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
                        this._touched = new Quantum.Quant(false);
                        this._on('elem', 'click', this._getParams().callback);
                    },

                    touch: function() {
                        var el = this._getEl('el');
                        el.getValue().click();
                        this._touched.setValue(true);
                        el.getValue().click();
                    },

                    _render: function() {
                        return {
                            content: new Botex.Tag({
                                className: this._touched.when(function(touched) {
                                    return touched ? 'el elem' : 'el';
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
                        this._touched = new Quantum.Quant(false);
                        this._on('elem', 'click', this._getParams().callback);
                    },

                    touch: function() {
                        this._getEl('el').getValue().click();
                        this._touched.setValue(true);
                        this._getEl('el').getValue().click();
                    },

                    _render: function() {
                        return {
                            content: new Botex.Tag({
                                as: 'el',
                                className: this._touched.when(function(touched) {
                                    return touched ? 'el' : 'el elem';
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
                        this.getEl().getValue().click();
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
                        this._getEl('child').getValue().getEl().getValue().click();
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
                        this.getEl().getValue().click();
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
                        this._touched = new Quantum.Quant(false);
                        this._on('mod', 'click', this._getParams().callback);
                    },

                    touch: function() {
                        this.getEl().getValue().click();
                        this._touched.setValue(true);
                        this.getEl().getValue().click();
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
                        this._touched = new Quantum.Quant(false);
                        this._on('mod', 'click', this._getParams().callback);
                    },

                    touch: function() {
                        this.getEl().getValue().click();
                        this._touched.setValue(true);
                        this.getEl().getValue().click();
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
                        this._touched = new Quantum.Quant(false);
                        this._on('elem', 'click', this._getParams().callback);
                    },

                    touch: function() {
                        this._touched.setValue(true);
                        this._getEl('elem').getValue().click();
                    },

                    _render: function() {
                        return {
                            content: this._touched.when(function(touched) {
                                return touched ? Botex.zen('.elem') : null;
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
                        this._touched = new Quantum.Quant(false);
                        this._on('child', 'event', this._getParams().callback);
                    },

                    touch: function() {
                        this._touched.setValue(true);
                        this._getEl('child').getValue().touch();
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
                        this._getEl('elem2').getValue().click();
                    },

                    _render: function() {
                        return {
                            content: Botex.zen('.elem1', Botex.zen('.elem2'))
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
                        this._getEl('elem').getValue().click();
                    },

                    _render: function() {
                        return {
                            content: this._data.transform(function(item) {
                                return Botex.zen('.elem', item);
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
                        this._getEl('elem').getValue().click();
                    },

                    _render: function() {
                        return {
                            content: this._data.transform(function(item) {
                                return Botex.zen('div', Botex.zen('.elem', item));
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
                        this._getEl('child').getValue().touch();
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

            it('Вешаем обработчик на параметр виджета', function() {
                var Widget = Bricks.inherit(Botex.Widget, {
                    params: {
                        object: null,
                        callback: null
                    },

                    _render: function($) {
                        this._on($.object, 'action', $.callback);
                    }
                });

                var o = new Bricks.Observer();
                var callback = sinon.spy();
                var w = new Widget({object: o, callback: callback});
                o._fireEvent('action');
                chai.assert.isOk(callback.notCalled);
                w.mount(document.body);
                o._fireEvent('action');
                chai.assert.isOk(callback.calledOnce);
                w.unmount();
                o._fireEvent('action');
                chai.assert.isOk(callback.calledOnce);
                w.mount(document.body);
                o._fireEvent('action');
                chai.assert.isOk(callback.calledTwice);
                w.destroy();
                o._fireEvent('action');
                chai.assert.isOk(callback.calledTwice);
            });
        });
    });
})();
