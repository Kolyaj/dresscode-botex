(function() {
    //#imports

    describe('Botex.join', function() {
        it('Botex.join', function() {
            chai.assert.deepEqual(Botex.join([1, 2, 3], '-'), [1, '-', 2, '-', 3]);
        });
    });
})();
