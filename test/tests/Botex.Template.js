(function() {
    //#require Botex.Template

    describe('Botex.Template', function() {
        it('Simple string', function() {
            chai.assert.equal(new Botex.Template({content: 'Hello'}), 'Hello');
        });

        it('Simple number', function() {
            chai.assert.equal(new Botex.Template({content: 5}), '5');
        });

        it('Escaped string', function() {
            chai.assert.equal(new Botex.Template({content: '<div>'}), '&lt;div&gt;')
        });

        it('Not escaped string', function() {
            chai.assert.equal(new Botex.Template({content: new String('<div>')}), '<div>')
        });

        it('$if-$then', function() {
            chai.assert.equal(new Botex.Template({content: {$if: true, $then: '$then', $else: '$else'}}), '$then');
        });

        it('$if-$else', function() {
            chai.assert.equal(new Botex.Template({content: {$if: false, $then: '$then', $else: '$else'}}), '$else');
        });

        it('div', function() {
            chai.assert.equal(new Botex.Template({content: {$: ''}}), '<div></div>');
        });

        it('span', function() {
            chai.assert.equal(new Botex.Template({content: {$: 'span'}}), '<span></span>');
        });

        it('img.cls', function() {
            chai.assert.equal(new Botex.Template({content: {$: 'img.cls'}}), '<img class="cls"/>');
        });

        it('img.cls1.cls2', function() {
            chai.assert.equal(new Botex.Template({content: {$: 'img.cls1.cls2'}}), '<img class="cls1 cls2"/>');
        });

        it('img[src=/picture.jpg]', function() {
            chai.assert.equal(new Botex.Template({content: {$: 'img[src=/picture.jpg]'}}), '<img src="/picture.jpg"/>');
        });

        it('img[src=/picture.jpg][alt=Hello]', function() {
            chai.assert.equal(new Botex.Template({content: {$: 'img[src=/picture.jpg][alt=Hello]'}}), '<img src="/picture.jpg" alt="Hello"/>');
        });

        it('img.cls1.cls2[src=/picture.jpg][alt=Hello]', function() {
            chai.assert.equal(new Botex.Template({content: {$: 'img.cls1.cls2[src=/picture.jpg][alt=Hello]'}}), '<img class="cls1 cls2" src="/picture.jpg" alt="Hello"/>');
        });

        it('img[alt=#{alt}]', function() {
            chai.assert.equal(new Botex.Template({content: {$: 'img[alt=#{alt}]', alt: 'Hello'}}), '<img alt="Hello"/>');
        });

        it('tag: span', function() {
            chai.assert.equal(new Botex.Template({content: {$: '', tag: 'span'}}), '<span></span>');
            chai.assert.equal(new Botex.Template({content: {$: 'div', tag: 'span'}}), '<span></span>');
        });

        it('cls: cls', function() {
            chai.assert.equal(new Botex.Template({content: {$: '', cls: 'cls3'}}), '<div class="cls3"></div>');
            chai.assert.equal(new Botex.Template({content: {$: '.cls1', cls: 'cls3'}}), '<div class="cls1 cls3"></div>');
            chai.assert.equal(new Botex.Template({content: {$: '.cls1', cls: ['cls2', 'cls3']}}), '<div class="cls1 cls2 cls3"></div>');
        });

        it('button[disabled]', function() {
            chai.assert.equal(new Botex.Template({content: {$: 'button[disabled]'}}), '<button disabled="disabled"></button>');
        });

        it('tag content', function() {
            chai.assert.equal(new Botex.Template({content: {$: '', _: 'Hello'}}), '<div>Hello</div>');
        });

        it('transform array', function() {
            chai.assert.equal(new Botex.Template({content: ['Hello', 'World']}), 'HelloWorld');
        });

        it('render chain 2 steps', function() {
            var T = Botex.Template.inherit({
                foo: 'Hello',
                _render: function(ctx) {
                    return {content: ctx.foo};
                }
            });
            chai.assert.equal(new T(), 'Hello');
            chai.assert.equal(new T({foo: 'foo'}), 'foo');
        });
    });
})();
