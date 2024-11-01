(function() {
    //#imports

    describe('Botex.Style', function() {
        it('simple rule', function() {
            chai.assert.equal(new Botex.Style({css: {'html': {'margin': '0'}}}).toString().replace(/\s+/g, ' '), '<style type="text/css"> html { margin: 0; } </style>');
        });
        it('cascading', function() {
            var css = {
                '.foo': {
                    'padding': '0',
                    '.bar': {
                        'margin': '0'
                    }
                }
            };
            chai.assert.equal(new Botex.Style({css: css}).toString().replace(/\s+/g, ' '), '<style type="text/css"> .foo { padding: 0; } .foo .bar { margin: 0; } </style>');
        });
    });
})();
