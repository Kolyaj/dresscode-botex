Samples.Number = Bricks.inherit(Botex.Widget, {
    params: {
        number: 0
    },

    constructor: function() {
        Samples.Number.superclass.constructor.apply(this, arguments);
        this._tid = null;
    },

    renderTo: function() {
        Samples.Number.superclass.renderTo.apply(this, arguments);
        var num = this._getParams().number;
        this._tid = setInterval(function() {
            console.log(num);
        }, 1000);
    },

    destroy: function() {
        clearInterval(this._tid);
        Samples.Number.superclass.destroy.apply(this, arguments);
    },

    _render: function($) {
        return {
            tagName: 'span',
            content: $.number
        };
    }
});
