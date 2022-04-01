new Samples.HelloWorld({
    name: 'Kolyaj'
}).mount(document.body);

new Samples.BoldHelloWorld({
    name: 'BoldKolyaj'
}).mount(document.body);

new Samples.PanelWithHelloWorld({
    name: 'Kolyaj'
}).mount(document.body);

new Samples.Zen().mount(document.body);

new Samples.DataBinders().mount(document.body);


var arr = new Quantum.Array();
new Samples.MutableArray({value: arr}).mount(document.body);
Bricks.DOM.on(document, 'click', function() {
    arr.push(Math.round(Math.random() * 1e5));
});
Bricks.DOM.on(document, 'contextmenu', function(evt) {
    Bricks.Event.stop(evt);
    arr.unshift(Math.round(Math.random() * 1e5));
});
Bricks.DOM.on(document, 'keydown', function(evt) {
    if (evt.keyCode === 83) {
        arr.remove(function(num) {
            return num % 2 === 0;
        })
    }
})


new Samples.Textbox().mount(document.body);


new Samples.SVG().mount(document.body);

var image = new Image();
image.src = 'data:image/gif;base64,R0lGODlhFAAMAKIFAGbMZjNmMwCZMzNmzDOZ/////wAAAAAAACH5BAEAAAUALAAAAAAUAAwAAAMuWLoaHizK8uC89eKnl/gCM4zDBYYLWU6nSJqgOzJADXQKoRP2je88G64A7A2BCQA7';
new Botex.Widget({
    content: image
}).mount(document.body);
