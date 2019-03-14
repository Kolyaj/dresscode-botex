Botex.CSS.add({
    '.$$': {
        'color': 'red'
    }
});

Samples.HelloWorld = Bricks.inherit(Botex.Widget, {
    params: {
        name: ''
    },

    _render: function($) {
        return {
            className: '$$',
            content: Bricks.String.format('Hello, ${0}!', $.name)
        };
    }
});
