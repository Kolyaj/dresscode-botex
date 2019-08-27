(function() {
    //#imports

    describe('Botex.replace', function() {
        it('replace full string', function() {
            chai.assert.deepEqual(Botex.replace('a', 'a', 'b'), ['b']);
        });
    });
})();
