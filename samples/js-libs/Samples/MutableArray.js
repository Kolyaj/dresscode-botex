Samples.MutableArray = Bricks.inherit(Botex.Widget, {
    params: {
        value: null
    },

    _render: function($) {
        return {
            content: $.value.transform(function(item) {
                if (item % 2) {
                    return new Botex.Widget({
                        tagName: 'b',
                        content: item
                    });
                } else {
                    return Botex.zen('i', item);
                }
            }, this)
        };
    }
});
