(function() {
    //#imports

    describe('Botex.if', function() {
        it('Botex.if-then', function() {
            chai.assert.equal(new Botex.Template({content: Botex.if(true, {then: 'then', else: 'else'})}), 'then');
        });

        it('Botex.if-else', function() {
            chai.assert.equal(new Botex.Template({content: Botex.if(false, {then: 'then', else: 'else'})}), 'else');
        });
    });
})();
