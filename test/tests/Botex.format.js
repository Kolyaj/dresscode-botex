(function() {
    //#imports

    describe('Botex.format', function() {
        it('#{0}', function() {
            chai.assert.deepEqual(Botex.format('#{0}', 5), [5]);
        });
        it('foo #{0} bar', function() {
            chai.assert.deepEqual(Botex.format('foo #{0} bar', 5), ['foo ', 5, ' bar']);
        });
        it('foo #{0} bar #{1} baz', function() {
            chai.assert.deepEqual(Botex.format('foo #{0} bar #{1} baz', 1, 2), ['foo ', 1, ' bar ', 2, ' baz']);
        });
        it('#{0} (#{1})', function() {
            chai.assert.deepEqual(Botex.format('#{0} (#{1})', 1, 2), [1, ' (', 2, ')']);
        });
        it('#{0 arg}', function() {
            chai.assert.deepEqual(Botex.format('#{0 arg}', function(arg) {
                return arg;
            }), ['arg']);
        });
    });
})();
