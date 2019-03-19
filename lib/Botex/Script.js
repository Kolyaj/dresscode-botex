Botex.Script = Bricks.inherit(Botex.Tag, {
    params: {
        src: '',
        defer: false
    },

    _render: function($) {
        return {
            tagName: 'script',
            attrs: {
                type: 'text/javascript',
                src: $.src,
                defer: $.defer
            }
        };
    }
});
