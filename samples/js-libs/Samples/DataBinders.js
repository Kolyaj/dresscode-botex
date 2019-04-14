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
        this._mutableCounter = new Botex.Mutable(this._counter);
        this._on('click', this.$$_onClick);
    },


    _render: function() {
        return {
            className: ['$$', this._mutableCounter.when(function(counter) {
                return ['$$__cls1', '$$__cls2'][counter % 2];
            })],
            attrs: {
                title: this._mutableCounter.when(function(counter) {
                    return 'Counter: ' + counter;
                })
            },
            style: {
                'font-size': this._mutableCounter.when(function(counter) {
                    return counter + 'px';
                })
            },
            content: [
                'Counter is ',
                Botex.zen('a[href=#]', this._mutableCounter.when(function(counter) {
                    return new Samples.Number({
                        number: counter
                    });
                })),
                '.'
            ]
        };
    },


    $$_onClick: function() {
        this._counter++;
        this._mutableCounter.setValue(this._counter);
    }
});
