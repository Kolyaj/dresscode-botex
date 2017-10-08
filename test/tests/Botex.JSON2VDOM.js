(function() {
    //#require Botex.JSON2VDOM

    describe('Botex.JSON2VDOM', function() {
        var transformer = new Botex.JSON2VDOM();

        it('Simple string', function() {
            chai.assert.equal(transformer.transform('Hello'), 'Hello');
        });

        it('Simple number', function() {
            chai.assert.equal(transformer.transform(5), '5');
        });

        it('Escaped string', function() {
            chai.assert.equal(transformer.transform('<div>'), '&lt;div&gt;')
        });

        it('Not escaped string', function() {
            chai.assert.equal(transformer.transform(new String('<div>')), '<div>')
        });

        it('$if-$then', function() {
            chai.assert.equal(transformer.transform({$if: true, $then: '$then', $else: '$else'}), '$then');
        });

        it('$if-$else', function() {
            chai.assert.equal(transformer.transform({$if: false, $then: '$then', $else: '$else'}), '$else');
        });

        it('div', function() {
            chai.assert.deepEqual(transformer.transform({$: ''}), {tag: 'div', cls: [], attrs: {}});
        });

        it('span', function() {
            chai.assert.deepEqual(transformer.transform({$: 'span'}), {tag: 'span', cls: [], attrs: {}});
        });

        it('img.cls', function() {
            chai.assert.deepEqual(transformer.transform({$: 'img.cls'}), {tag: 'img', cls: ['cls'], attrs: {}});
        });

        it('img.cls1.cls2', function() {
            chai.assert.deepEqual(transformer.transform({$: 'img.cls1.cls2'}), {tag: 'img', cls: ['cls1', 'cls2'], attrs: {}});
        });

        it('img[src=/picture.jpg]', function() {
            chai.assert.deepEqual(transformer.transform({$: 'img[src=/picture.jpg]'}), {tag: 'img', cls: [], attrs: {src: '/picture.jpg'}});
        });

        it('img[src=/picture.jpg][alt=Hello]', function() {
            chai.assert.deepEqual(transformer.transform({$: 'img[src=/picture.jpg][alt=Hello]'}), {tag: 'img', cls: [], attrs: {src: '/picture.jpg', alt: 'Hello'}});
        });

        it('img.cls1.cls2[src=/picture.jpg][alt=Hello]', function() {
            chai.assert.deepEqual(transformer.transform({$: 'img.cls1.cls2[src=/picture.jpg][alt=Hello]'}), {tag: 'img', cls: ['cls1', 'cls2'], attrs: {src: '/picture.jpg', alt: 'Hello'}});
        });

        it('img[alt=#{alt}]', function() {
            chai.assert.deepEqual(transformer.transform({$: 'img[alt=#{alt}]', alt: 'Hello'}), {tag: 'img', cls: [], attrs: {alt: 'Hello'}});
        });

        it('tag: span', function() {
            chai.assert.deepEqual(transformer.transform({$: '', tag: 'span'}), {tag: 'span', cls: [], attrs: {}});
            chai.assert.deepEqual(transformer.transform({$: 'div', tag: 'span'}), {tag: 'span', cls: [], attrs: {}});
        });

        it('cls: cls', function() {
            chai.assert.deepEqual(transformer.transform({$: '', cls: 'cls3'}), {tag: 'div', cls: ['cls3'], attrs: {}});
            chai.assert.deepEqual(transformer.transform({$: '.cls1', cls: 'cls3'}), {tag: 'div', cls: ['cls1', 'cls3'], attrs: {}});
            chai.assert.deepEqual(transformer.transform({$: '.cls1', cls: ['cls2', 'cls3']}), {tag: 'div', cls: ['cls1', 'cls2', 'cls3'], attrs: {}});
        });

        it('button[disabled]', function() {
            chai.assert.deepEqual(transformer.transform({$: 'button[disabled]'}), {tag: 'button', cls: [], attrs: {disabled: 'disabled'}});
        });

        it('tag content', function() {
            chai.assert.deepEqual(transformer.transform({$: '', _: 'Hello'}), {tag: 'div', cls: [], attrs: {}, content: 'Hello'});
        });

        it('invalid selector', function() {
            chai.assert.throws(function() { transformer.transform({$: '[].div'}) }, Error);
        });

        it('transform array', function() {
            chai.assert.deepEqual(transformer.transform(['Hello', 'World']), ['Hello', 'World']);
        });
    });
})();
