(function() {
    //#imports

    describe('Botex.switch', function() {
        it('quant value', function() {
            var result = Botex.switch(new Quantum.Quant('bar'), {
                foo: function() {
                    return 1;
                },
                bar: function() {
                    return 2;
                },
                baz: function() {
                    return 3;
                }
            });
            chai.assert.equal(result.getValue(), 2);
        });

        it('scalar value', function() {
            var result = Botex.switch('bar', {
                foo: function() {
                    return 1;
                },
                bar: function() {
                    return 2;
                },
                baz: function() {
                    return 3;
                }
            });
            chai.assert.equal(result, 2);
        });
    });
})();
