var mock = require('mock-fs');
var assert = require('assert');
var botex = require('..');
var {DressCode} = require('dresscodejs');

describe('Botex', () => {
    afterEach(() => {
        mock.restore();
    });
    after(() => {
        console.log('Open http://botex.tests/ for run browser tests.');
    });

    describe('CSS compile', () => {
        it('Экспорт CSS из файла без вложенных бандлов', async() => {
            mock({
                '/js-libs': {
                    'Botex': {
                        'index.js': 'var Botex = {};',
                        'CSS.js': 'Botex.CSS = {_items: [], add: function(item) {this._items.push(item);}, clear: function() {this._items.length = 0;}, compile: function() { return this._items.join(","); }};'
                    },
                    'Templates': {
                        'index.js': 'var Templates = {};',
                        'Foo.js': '//#if css\nBotex.CSS.add("foo");\n//#endif\nTemplates.Foo = {};'
                    },
                    '.dresscode': '.',
                    'bundles.js': 'module.exports = {foo: Templates.Foo}'
                }
            });
            var css = await botex.compileCSS(new DressCode(), '/js-libs/bundles.js');
            assert.equal(css, 'foo');
        });

        it('Экспорт CSS из файла с вложенными бандлами', async() => {
            mock({
                '/js-libs': {
                    'Botex': {
                        'index.js': 'var Botex = {};',
                        'CSS.js': 'Botex.CSS = {_items: [], add: function(item) {this._items.push(item);}, clear: function() {this._items.length = 0;}, compile: function() { return this._items.join(","); }};'
                    },
                    'Templates': {
                        'index.js': 'var Templates = {};',
                        'Foo.js': '//#if css\nBotex.CSS.add("foo");\n//#endif\nTemplates.Foo = {};',
                        'Bar.js': '//#if css\nBotex.CSS.add("bar");\n//#endif\nTemplates.Bar = {};'
                    },
                    '.dresscode': '.',
                    'bundles.js': 'module.exports = {foo: Templates.Foo};\n//#label bundle\nmodule.exports.bundle = {bar: Templates.Bar};\n//#endlabel'
                }
            });
            var css = await botex.compileCSS(new DressCode(), '/js-libs/bundles.js');
            assert.equal(css, 'foo');
        });

        it('Экспорт CSS из бандла', async() => {
            mock({
                '/js-libs': {
                    'Botex': {
                        'index.js': 'var Botex = {};',
                        'CSS.js': 'Botex.CSS = {_items: [], add: function(item) {this._items.push(item);}, clear: function() {this._items.length = 0;}, compile: function() { return this._items.join(","); }};'
                    },
                    'Templates': {
                        'index.js': 'var Templates = {};',
                        'Foo.js': '//#if css\nBotex.CSS.add("foo");\n//#endif\nTemplates.Foo = {};',
                        'Bar.js': '//#if css\nBotex.CSS.add("bar");\n//#endif\nTemplates.Bar = {};'
                    },
                    '.dresscode': '.',
                    'bundles.js': 'module.exports = {foo: Templates.Foo};\n//#label bundle\nmodule.exports.bundle = {bar: Templates.Bar};\n//#endlabel'
                }
            });
            var css = await botex.compileCSS(new DressCode(), '/js-libs/bundles.js', 'bundle');
            assert.equal(css, 'bar');
        });
    });
});
