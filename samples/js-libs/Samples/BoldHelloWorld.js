Botex.CSS.add({
    '.$$': {
        'font-weight': 'bold'
    }
});

Samples.BoldHelloWorld = Bricks.inherit(Samples.HelloWorld, {
    _render: function() {
        return {
            className: '$$'
        };
    }
});
