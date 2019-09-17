(function() {
    //#imports

    describe('Botex.if', function() {
        it('Botex.if-then', function() {
            var result = new Botex.Template({
                content: Botex.if(true, {
                    then: function() {
                        return 'then';
                    },
                    else: function() {
                        return 'else';
                    }
                })
            });
            chai.assert.equal(result, 'then');
        });

        it('Botex.if-else', function() {
            var result = new Botex.Template({
                content: Botex.if(false, {
                    then: function() {
                        return 'then';
                    },
                    else: function() {
                        return 'else';
                    }
                })
            });
            chai.assert.equal(result, 'else');
        });

        it('Botex.if quant', function() {
            var q = new Quantum.Quant(true);
            var Widget = Bricks.inherit(Botex.Widget, {
                _render: function() {
                    return {
                        attrs: {
                            title: Botex.if(q, {
                                then: function() {
                                    return 'then';
                                },
                                else: function() {
                                    return 'else';
                                }
                            })
                        }
                    }
                }
            });
            var widget = new Widget();
            widget.mount(document.body);
            chai.assert.equal(widget.getEl().getValue().getAttribute('title'), 'then');
            q.setValue(false);
            chai.assert.equal(widget.getEl().getValue().getAttribute('title'), 'else');
        });

        it('Botex.ifNot quant', function() {
            var q = new Quantum.Quant(true);
            var Widget = Bricks.inherit(Botex.Widget, {
                _render: function() {
                    return {
                        attrs: {
                            title: Botex.ifNot(q, function() {
                                return 'ok';
                            })
                        }
                    }
                }
            });
            var widget = new Widget();
            widget.mount(document.body);
            chai.assert.equal(widget.getEl().getValue().getAttribute('title'), 'undefined');
            q.setValue(false);
            chai.assert.equal(widget.getEl().getValue().getAttribute('title'), 'ok');
        });
    });
})();
