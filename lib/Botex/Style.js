Botex.Style = Bricks.inherit(Botex.Tag, {
    params: {
        css: {}
    },

    accumParams: {
        css: 'array'
    },

    _render: function($) {
        return {
            tagName: 'style',
            attrs: {
                type: 'text/css'
            },
            content: Botex.CSS.compileRules($.css)
        };
    }
});
