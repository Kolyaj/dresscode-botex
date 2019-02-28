Botex.InlineScript = Bricks.inherit(Botex.Tag, {
    params: {
        fn: function() {},
        args: []
    },

    _render: function() {
        return {
            tagName: 'script',
            attrs: {
                type: 'text/javascript'
            },
            content: new String('(' + this.fn.toString() + ').apply(window, ' + JSON.stringify(this.args) + ');')
        };
    }
});
