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
    });
})();
