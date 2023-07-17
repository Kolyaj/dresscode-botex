(function() {
    //#imports

    describe('Botex.Template', function() {
        it('Simple string', function() {
            chai.assert.equal(new Botex.Template({content: 'Hello'}), 'Hello');
        });

        it('Simple number', function() {
            chai.assert.equal(new Botex.Template({content: 5}), '5');
        });

        it('Array', function() {
            chai.assert.equal(new Botex.Template({content: ['string', 5, true, false]}), 'string5truefalse');
        });

        it('Escaped string', function() {
            chai.assert.equal(new Botex.Template({content: '<div>'}), '&lt;div&gt;')
        });

        it('Not escaped string', function() {
            chai.assert.equal(new Botex.Template({content: new String('<div>')}), '<div>')
        });

        it('Multiple template arguments', function() {
            chai.assert.equal(new Botex.Template({content: 1}, {content: 2}, {content: 3}), '3');
        });

        it('params prototype chain', function() {
            var T1 = Bricks.inherit(Botex.Template, {
                params: {
                    a: 1,
                    b: 2,
                    c: 3
                },
                _render: function($) {
                    return {
                        content: [$.a, '-', $.b, '-', $.c]
                    };
                }
            });
            var T2 = Bricks.inherit(T1, {
                params: {
                    a: 10
                }
            });
            chai.assert.equal(new T2({b: 20}), '10-20-3');
        });

        it('array accumulative param', function() {
            var T1 = Bricks.inherit(Botex.Template, {
                params: {
                    a: 1
                },
                accumParams: {
                    a: 'array'
                },
                _render: function($) {
                    return {
                        content: $.a
                    };
                }
            });
            var T2 = Bricks.inherit(T1, {
                params: {
                    a: 2
                }
            });
            chai.assert.equal(new T2({a: 3}), '123');
        });

        it('object accumulative param', function() {
            var T1 = Bricks.inherit(Botex.Template, {
                params: {
                    o: {a: 1}
                },
                accumParams: {
                    o: 'object'
                },
                _render: function($) {
                    return {
                        content: [$.o.a, $.o.b, $.o.c]
                    };
                }
            });
            var T2 = Bricks.inherit(T1, {
                params: {
                    o: {b: 2}
                }
            });
            chai.assert.equal(new T2({o: {c: 3}}), '123');
        });

        it('custom accumulative param', function() {
            var T1 = Bricks.inherit(Botex.Template, {
                params: {
                    s: 1
                },
                accumParams: {
                    s: function(s, x) {
                        return (s || 0) + x;
                    }
                },
                _render: function($) {
                    return {
                        content: $.s
                    };
                }
            });
            var T2 = Bricks.inherit(T1, {
                params: {
                    s: 2
                },
                _render: function() {
                    return {
                        s: 3
                    };
                }
            });
            chai.assert.equal(new T2({s: 4}), '10');
        });
    });
})();
