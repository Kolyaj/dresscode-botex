(function() {
    //#imports

    describe('Botex.Widget', function() {
        it('Доступ к дочернему виджету по имени', function() {
            var Child = Bricks.inherit(Botex.Widget);
            var Widget = Bricks.inherit(Botex.Widget, {
                getChild: function() {
                    return this._getChild('child');
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
            widget.renderTo(document.body);
            chai.assert.instanceOf(widget.getChild(), Child);
        });

        it('Доступ к дочернему виджету по одному из имён', function() {
            var Child = Bricks.inherit(Botex.Widget);
            var Widget = Bricks.inherit(Botex.Widget, {
                getChild: function() {
                    return this._getChild('child');
                },

                _render: function() {
                    return {
                        content: new Child({
                            as: ['child', 'another']
                        })
                    };
                }
            });
            var widget = new Widget();
            widget.renderTo(document.body);
            chai.assert.instanceOf(widget.getChild(), Child);
        });

        it('Доступ к виджету в дочернем виджете', function() {
            var Child = Bricks.inherit(Botex.Widget);
            var Widget = Bricks.inherit(Botex.Widget, {
                getChild: function() {
                    return this._getChild('child');
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
            widget.renderTo(document.body);
            chai.assert.instanceOf(widget.getChild(), Child);
        });

        describe('Declarative event listeners', function() {
            function createEventTest(widgetCtor) {
                var callback = sinon.spy();
                var widget = new widgetCtor({
                    callback: callback
                });
                widget.renderTo(document.body);
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
                        this._getEl('elem').click();
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
                        this._getChild('child').touch();
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
                        this._getEl('elem').click();
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
                        this._getChild('child').touch();
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
                        this._getChild('child').touch();
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
                        this._getEl('el').click();
                        this._touched.setValue(true);
                        this._getEl('el').click();
                    },

                    _render: function() {
                        return {
                            content: new Botex.Tag({
                                className: ['el', this._touched.when(function(touched) {
                                    return touched ? 'elem' : '';
                                })]
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
                        this._getEl('el').click();
                        this._touched.setValue(true);
                        this._getEl('el').click();
                    },

                    _render: function() {
                        return {
                            content: new Botex.Tag({
                                className: ['el', this._touched.when(function(touched) {
                                    return touched ? '' : 'elem';
                                })]
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
                        this._getEl().click();
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
                        this._getChild('child').getEl().click();
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
                        this._getEl().click();
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
                        this._getEl().click();
                        this._touched.setValue(true);
                        this._getEl().click();
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
                        this._getEl().click();
                        this._touched.setValue(true);
                        this._getEl().click();
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
                        this._getEl('elem').click();
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
                        this._touched = new Botex.Mutable(false);
                        this._on('child', 'event', this._getParams().callback);
                    },

                    touch: function() {
                        this._touched.setValue(true);
                        this._getChild('child').touch();
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
                        this._getEl('elem2').click();
                    },

                    _render: function() {
                        return {
                            content: Botex.zen('.elem1', Botex.zen('.elem2'))
                        };
                    }
                });
                createEventTest(Widget);
            });

            it('Снял обработчик с DOM-элемента внутри виджета после рендеринга', function() {
                var Widget = Bricks.inherit(Botex.Widget, {
                    params: {
                        callback: null
                    },

                    constructor: function() {
                        Widget.superclass.constructor.apply(this, arguments);
                        this._on('elem1', 'click', this._getParams().callback);
                        this._on('elem2', 'click', this._getParams().callback);
                    },

                    touch: function() {
                        this._un('elem1', 'click', this._getParams().callback);
                        this._getEl('elem2').click();
                    },

                    _render: function() {
                        return {
                            content: Botex.zen('.elem1', Botex.zen('.elem2'))
                        };
                    }
                });
                createEventTest(Widget);
            });

            it('Вешаем событие на уже созданный элемент', function() {
                var Widget = Bricks.inherit(Botex.Widget, {
                    params: {
                        callback: null
                    },

                    touch: function() {
                        this._on('elem', 'click', this._getParams().callback);
                        this._getEl('elem').click();
                    },

                    _render: function() {
                        return {
                            content: Botex.zen('.elem')
                        };
                    }
                });
                createEventTest(Widget);
            });

            it('Вешаем событие на несколько уже созданных элементов с одним классом', function() {
                var Widget = Bricks.inherit(Botex.Widget, {
                    params: {
                        callback: null
                    },

                    touch: function() {
                        this._on('elem', 'click', this._getParams().callback);
                        this._getEl('elem2').click();
                    },

                    _render: function() {
                        return {
                            content: [
                                Botex.zen('.elem.elem1'),
                                Botex.zen('.elem.elem2')
                            ]
                        };
                    }
                });
                createEventTest(Widget);
            });
        });
    });
})();
