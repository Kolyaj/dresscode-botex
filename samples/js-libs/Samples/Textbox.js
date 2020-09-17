Samples.Textbox = Bricks.inherit(Botex.Widget, {
    constructor: function() {
        Samples.Textbox.superclass.constructor.apply(this, arguments);
        this._value = new Quantum.Quant('Пиши сюда')
        this._on('$$__clear', 'click', this.$$_onClear);
    },

    _render: function() {
        return {
            content: [
                new Botex.Textbox({
                    tagName: 'input',
                    value: this._value
                }),
                new Botex.Textbox({
                    tagName: 'textarea',
                    value: this._value
                }),
                Botex.zen('button.$$__clear', 'Очистить')
            ]
        };
    },

    $$_onClear: function() {
        this._value.setValue('');
    }
});
