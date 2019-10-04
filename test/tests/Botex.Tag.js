(function() {
    //#imports

    describe('Botex.Tag', function() {
        it('Without arguments', function() {
            chai.assert.equal(new Botex.Tag(), '<div></div>');
        });
        it('span.foo', function() {
            chai.assert.equal(new Botex.Tag({tagName: 'span', className: 'foo'}), '<span class="foo"></span>');
        });
        it('.foo.bar', function() {
            chai.assert.equal(new Botex.Tag({className: ['foo', 'bar']}), '<div class="foo bar"></div>');
        });
        it('accumulative className', function() {
            var T = Bricks.inherit(Botex.Tag, {
                _render: function() {
                    return {
                        className: 'a'
                    };
                }
            });
            chai.assert.equal(new T({className: ['b', 'c']}), '<div class="b c a"></div>');
        });
        it('attrs', function() {
            chai.assert.equal(new Botex.Tag({tagName: 'img', attrs: {src: '#', alt: 'hello'}}), '<img src="#" alt="hello"/>');
        });
        it('style', function() {
            chai.assert.equal(new Botex.Tag({style: {'margin-top': '5px', 'font-size': '2px'}}), '<div style="margin-top:5px;font-size:2px;"></div>')
        });
        it('empty value in style', function() {
            chai.expect(String(new Botex.Tag({style: {'width': null, 'height': undefined}}))).to.equal('<div></div>');
        });
    });
})();
