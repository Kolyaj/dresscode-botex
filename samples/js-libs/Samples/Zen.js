Botex.CSS.add({
    '.$$__foo': {
        'color': 'green'
    },
    '.$$__bar': {
        'text-decoration': 'underline'
    },
    '.$$__baz': {
        'font-weight': 'bold'
    }
});

Samples.Zen = Bricks.inherit(Botex.Widget, {
    _render: function() {
        return {
            content: Botex.zen('.$$__foo', {
                className: '$$__bar',
                content: Botex.zen('.$$__baz', 'content')
            })
        };
    }
});
