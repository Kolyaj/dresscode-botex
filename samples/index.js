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


var arr = new Botex.MutableArray();
new Samples.MutableArray({value: arr}).mount(document.body);
Bricks.DOM.on(document, 'click', function() {
    arr.push(Math.round(Math.random() * 1e5));
});

new Samples.SVG().mount(document.body);
