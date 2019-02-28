(function() {
    //#imports

    describe('Botex.zen', function() {
        it('div', function() {
            chai.assert.equal(Botex.zen(), '<div></div>');
        });

        it('span', function() {
            chai.assert.equal(Botex.zen('span'), '<span></span>');
        });

        it('img.cls', function() {
            chai.assert.equal(Botex.zen('img.cls'), '<img class="cls"/>');
        });

        it('img.cls1.cls2', function() {
            chai.assert.equal(Botex.zen('img.cls1.cls2'), '<img class="cls1 cls2"/>');
        });

        it('img[src=/picture.jpg]', function() {
            chai.assert.equal(Botex.zen('img[src=/picture.jpg]'), '<img src="/picture.jpg"/>');
        });

        it('img[src=/picture.jpg][alt=Hello]', function() {
            chai.assert.equal(Botex.zen('img[src=/picture.jpg][alt=Hello]'), '<img src="/picture.jpg" alt="Hello"/>');
        });

        it('img.cls1.cls2[src=/picture.jpg][alt=Hello]', function() {
            chai.assert.equal(Botex.zen('img.cls1.cls2[src=/picture.jpg][alt=Hello]'), '<img src="/picture.jpg" alt="Hello" class="cls1 cls2"/>');
        });

        it('button[disabled]', function() {
            chai.assert.equal(Botex.zen('button[disabled]'), '<button disabled="disabled"></button>');
        });

        it('tag content', function() {
            chai.assert.equal(Botex.zen('', 'Hello'), '<div>Hello</div>');
        });

        it('transform array', function() {
            chai.assert.equal(Botex.zen('', ['Hello', 'World']), '<div>HelloWorld</div>');
        });

        it('content is string', function() {
            chai.assert.equal(Botex.zen('.foo', '<bar>'), '<div class="foo">&lt;bar&gt;</div>');
        });

        it('content is object string', function() {
            chai.assert.equal(Botex.zen('.foo', new String('<bar>')), '<div class="foo"><bar></div>');
        });

        it('content is array', function() {
            chai.assert.equal(Botex.zen('.foo', ['bar', 'baz']), '<div class="foo">barbaz</div>');
        });

        it('content is template', function() {
            chai.assert.equal(Botex.zen('.foo', Botex.zen('.bar')), '<div class="foo"><div class="bar"></div></div>');
        });

        it('content is params', function() {
            chai.assert.equal(Botex.zen('span.foo.bar[a=1][b=2][c]', {tagName: 'i', className: 'baz', attrs: {d: 5}, content: 'hello'}), '<i a="1" b="2" c="c" d="5" class="foo bar baz">hello</i>');
        });
    });
})();
