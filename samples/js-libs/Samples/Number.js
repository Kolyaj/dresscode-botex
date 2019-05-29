Samples.Number = Bricks.inherit(Botex.Widget, {
    params: {
        number: 0
    },

    constructor: function() {
        Samples.Number.superclass.constructor.apply(this, arguments);
        this._tid = null;
    },

    mount: function() {
        Samples.Number.superclass.mount.apply(this, arguments);
        var num = this._getParams().number;
        this._tid = setInterval(function() {
            console.log(num);
        }, 1000);
    },

    unmount: function() {
        Samples.Number.superclass.unmount.apply(this, arguments);
        clearInterval(this._tid);
    },


    _render: function($) {
        return {
            tagName: 'span',
            content: $.number
        };
    }
});
