Botex.CSS.add({
    '.$$': {
        'padding': '20px',

        'border': '1px solid #000'
    }
});

Samples.PanelWithHelloWorld = Bricks.inherit(Botex.Widget, {
    params: {
        name: ''
    },

    _render: function($) {
        return {
            className: '$$',
            content: new Samples.HelloWorld({
                name: $.name
            })
        };
    }
});
