Botex.StyleLink = Bricks.inherit(Botex.Tag, {
    params: {
        href: ''
    },

    _render: function($) {
        return {
            tagName: 'link',
            attrs: {
                rel: 'stylesheet',
                type: 'text/css',
                href: $.href
            }
        };
    }
});
