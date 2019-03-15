Botex.CSS.add({
    '.$$': {
        'padding': '20px'
    },
    '.$$__cls1': {
        'background-color': 'red'
    },
    '.$$__cls2': {
        'background-color': 'blue'
    }
});

Samples.DataBinders = Bricks.inherit(Botex.Widget, {
    constructor: function() {
        Samples.DataBinders.superclass.constructor.apply(this, arguments);
        this._counter = 0;
    },

    renderTo: function() {
        Samples.DataBinders.superclass.renderTo.apply(this, arguments);
        this._on('click', this.$$_onClick);
    },


    _render: function() {
        return {
            className: ['$$', this._updater(function() {
                return ['$$__cls1', '$$__cls2'][this._counter % 2];
            })],
            attrs: {
                title: this._updater(function() {
                    return 'Counter: ' + this._counter;
                })
            },
            style: {
                'font-size': this._updater(function() {
                    return this._counter + 'px';
                })
            },
            content: [
                'Counter is ',
                Botex.zen('a[href=#]', this._updater(function() {
                    return this._counter;
                })),
                '.'
            ]
        };
    },


    $$_onClick: function() {
        this._counter++;
        this._update();
    }
});
