# Botex – шаблонизатор и библиотека для построения UI

Botex написан в методологии DressCodeJS.

## Установка

    npm i -D dresscode-botex
    
Версию в package.json после установки желательно поменять на latest. Зависимости от dresscode-bricks, dresscode-quantum, dresscode-ponyfills заданы плавающими `>=`-версиями сознательно: эти библиотеки поддерживают строгую обратную совместимость. В .dresscode-файлах прописываем путь до библиотеки: 
    
    path-to-local-node_modules/dresscode-botex/lib
    
## Использование шаблонизатора

Шаблон – это класс, наследуемый от `Botex.Template`. У экземпляра класса есть метод `_render`, который возвращает объект со свойством `content`, значение которого и является результатом работы шаблона.

    var Tpl = Bricks.inherit(Botex.Template, {
        _render: function() {
            return {
                content: 'Hello!'
            };
        }
    });
    alert(new Tpl());  // Hello!
    
Шаблон принимает параметры, список которых со значениями по умолчанию описывается в свойстве `params`. Метод `_render` принимает предобработанные параметры в первом аргументе.

    var Tpl = Bricks.inherit(Botex.Template, {
        params: {
            name: 'World'
        },
        
        _render: function($) {
            return {
                content: Botex.format('Hello, #{0}!', $.name)
            };
        }
    });
    alert(new Tpl());  // Hello, World!
    alert(new Tpl({name: 'Ivan'}));  // Hello, Ivan!
     
### Наследование шаблонов
 
При наследовании шаблонов результат работы дочернего шаблона передаётся на вход родительскому шаблону.

    var Tpl1 = Bricks.inherit(Botex.Template, {
        params: {  // этот шаблон принимает два аргумента, эти аргументы мы можем передать из дочернего шаблона. 
            name: 'World',
            age: '14'
        },
        
        _render: function($) {
            return {
                // content на самом деле просто параметр шаблона Botex.Template, родительского для Tpl1
                content: Botex.format('Hello, #{0}! You are #{1}.', $.name, $.age)
            };
        }
    });
    
    var Tpl2 = Bricks.inherit(Tpl1, {
        params: {
            firstName: 'Ivan',
            lastName: 'Ivanov'
        },
        
        _render: function($) {
            return {
                // параметра content у Tpl1 нет, поэтому и передавать его бессмысленно. Мы его могли бы передать на уровень выше, для Botex.Template, но Tpl1 его всё равно переопределит.
                name: Botex.format('#{0} #{1}', $.firstName, $.lastName)
            };
        }        
    });
    alert(new Tpl2({lastName: 'Petrov', age: 26})); // Hello, Ivan Petrov! You are 26.

### Шаблон `Botex.Tag`

Для создания HTML-тегов есть предопределённый шаблон `Botex.Tag`. Он принимает параметры:

- `tagName` – имя тега (по умолчанию `div`);
- `hasRoot` – включать ли корневой тег в результат (по умолчанию `true`; при `false` результатом становится только `content`);
- `className` – класс(ы) тега;
- `attrs` – объект атрибутов тега;
- `props` – объект свойств DOM-элемента: значения назначаются элементу напрямую и в строку HTML не попадают (актуально при рендере в виджете, см. соответствующий раздел);
- `style` – объект CSS-свойств, записывается в атрибут `style`;
- `content` – содержимое тега.

    var tpl = new Botex.Tag({
        tagName: 'span',
        className: 'box',
        attrs: {id: 'foo'},
        style: {color: 'red'},
        content: 'Hello'
    });
    alert(tpl);  // <span id="foo" class="box" style="color:red;">Hello</span>

Пустые элементы (`br`, `col`, `embed`, `hr`, `img`, `input`, `link`, `meta`, `param`, `wbr`) закрываются с косой чертой:

    alert(new Botex.Tag({tagName: 'img', attrs: {src: 'x.png', alt: 'a'}}));
    // <img src="x.png" alt="a"/>

Значение атрибута `true` записывается как `name="name"`, `false` не записывается. `Quantum.Quant`-значения в `attrs`, `style` и `className` подставляются по своему значению на момент рендера.

### Аккумулируемые параметры

По-умолчанию, переопределённые параметры затирают предыдущее значение. Чтобы параметр накапливался по цепочке наследования, описывается свойство `accumParams` класса, в котором для каждого параметра задаётся способ слияния:

- `'array'` – значения со всех уровней цепочки (`params` классов, аргументы конструктора, результаты `_render`) складываются в один массив;
- `'object'` – объекты объединяются, более поздние значения перекрывают ранние;
- функция `function(prev, next)` – собственный способ слияния.

    var Tpl1 = Bricks.inherit(Botex.Tag, {
        params: {className: 'foo'}
    });
    var Tpl2 = Bricks.inherit(Tpl1, {
        params: {className: 'bar'}
    });
    alert(new Tpl2());  // <div class="foo bar"></div>

`Botex.Tag` описывает `className: 'array'`, `attrs: 'object'`, `props: 'object'`, `style: 'object'`, поэтому при наследовании значения всех уровней цепочки объединяются.

### Функция `Botex.zen`

`Botex.zen` создаёт шаблон по CSS-селектору:

    Botex.zen(selector[, params])         // возвращает Botex.Tag
    Botex.zen(ctor, selector[, params])   // возвращает указанный конструктор

Селектор имеет вид `tag.class1.class2[attr=value]`: имя тега необязательно (тогда `div`), классы перечисляются через точку, атрибуты задаются в квадратных скобках. Если `params` не является объектом (например, строка), он считается `content` создаваемого тега.

    alert(Botex.zen('h1.title', 'Hello'));
    // <h1 class="title">Hello</h1>

В селекторе разрешены буквы, цифры и символы `-_`. 

### Вспомогательные функции

- `Botex.format(tpl, ...args)` – подставляет в `tpl` аргументы вместо плейсхолдеров `#{n}`. Если аргумент – функция, она вызывается с «хвостом» плейсхолдера – текстом после номера (`#{0 foo bar baz}` → `arg === 'foo bar baz'`), и возвращается её результат (типовой случай – `Botex.plural`, см. ниже). Буквальный `#{0}` экранируется обратным слэшем: `\\#{0}`. Результат – массив строк и значений, подходящий для `content` шаблона.
- `Botex.if(cond, blocks[, ctx])` – условный блок. `blocks` – объект `{then, else}` с функциями или одна функция (`then`). Если `cond` – `Quantum.Quant`, результат тоже является квантом.
- `Botex.ifNot(cond, fn[, ctx])` – обратное к `Botex.if`.
- `Botex.switch(value, cases[, ctx])` – выбирает и вызывает обработчик `cases[value]`.
- `Botex.join(array, separator)` – вставляет `separator` между всеми элементами массива. Результат – **массив** (подходит для `content`), а не строка: вывести массив виджетов через запятую с `Array.prototype.join` нельзя – она превратит их в строки.
- `Botex.replace(str, search, callback[, ctx])` – как `String.prototype.replace`, только результат собирается в массив фрагментов.
- `Botex.plural(n)` – компаньон `Botex.format`: возвращает функцию для плейсхолдера, которой передаётся текст с формами после номера (`#{0 ошибка|ошибки|ошибок}`); форма выбирается по числу `n`, число выводится перед ней (префикс `!` прячет его).
- `Botex.toString(value)` – преобразует значение в строку с учётом экранирования (см. раздел ниже).

    Botex.format('Hello, #{0}! You are #{1}.', 'Ivan', 26);  // Hello, Ivan! You are 26.
    
    Botex.format('В файле #{0 ошибка|ошибки|ошибок}', Botex.plural(errorCount));  // «В файле 3 ошибки» (неразрывный пробел между числом и формой; префикс `!` в формах прячет число)

Выбор формы реализован в `Bricks.Number` (dresscode-bricks) и компилируется dresscodejs условно: для трёх русских форм в сборке нужен флаг `--set lang_ru` (для двух английских – `--set lang_en`), без флага выбранная форма будет `undefined`.

### Экранирование и «безопасный» HTML

При преобразовании шаблона в строку значение `content` обрабатывается функцией `Botex.toString`:

- обычные строки экранируются (`<` → `&lt;`, `&` → `&amp;`, …);
- строки, обёрнутые в `new String(...)`, считаются «безопасным» HTML и подставляются как есть;
- массивы обрабатываются поэлементно и конкатенируются;
- значения `Quantum.Quant` читаются через `getValue()`.

    Botex.toString('<b>x</b>');                      // &lt;b&gt;x&lt;/b&gt;
    Botex.toString(new String('<b>x</b>'));         // <b>x</b>
    Botex.toString(['a', new String('<b>b</b>')]); // a<b>b</b>

### Виджеты (`Botex.Widget`)

`Botex.Widget` – это шаблон с DOM-жизненным циклом:

    var widget = new Botex.Widget({
        tagName: 'section',
        className: 'panel',
        content: 'Hello'
    });
    
    widget.mount(document.body, beforeEl);  // создаёт элемент и вставляет в DOM
    widget.unmount();      // убирает элемент из DOM (снова смонтировать можно)
    widget.destroy();      // unmount + освобождение всех подписок

Доступ к элементам внутри виджета:

- `getEl()` – `Quantum.Quant`, содержащий корневой элемент (или `null`, если виджет не смонтирован);
- `_getEl(name)` – квант первого элемента, `className` или `as` которого совпадает с `name`;
- `_getEls(name)` – все подходящие элементы.

Магазины элементов дочерних виджетов объединяются с родительским, поэтому родитель находит элементы потомков по имени. Параметр `as` регистрирует сам виджет в магазине родительским по указанному имени.

DOM-события обрабатываются методами `_on([name,] events, fn)` и `_un`: подписка активна только между `mount` и `unmount`. `name` – это `className`/`as` элемента, собственный элемент виджета (если `name` не указан) либо `window`/`document`.

Обработка `content`: `Botex.Widget` в содержимом монтируются вместе с родителем, `Botex.Tag` превращаются в DOM-элементы, DOM-элементы текущего документа вставляются как есть, строки вставляются с экранированием, кванты и массивы – см. раздел про Quantum.

Готовый виджет `Botex.Textbox` реализует двустороннюю привязку поля ввода к `Quantum.Quant`:

    var Tpl = Bricks.inherit(Botex.Widget, {
        constructor: function() {
            Tpl.superclass.constructor.apply(this, arguments);
            this._value = new Quantum.Quant('Пиши сюда');
            this._on('clear', 'click', this._onClear);
        },
        
        _render: function() {
            return {
                content: [
                    new Botex.Textbox({tagName: 'input', value: this._value}),
                    Botex.zen('button.clear', 'Очистить')
                ]
            };
        },
        
        _onClear: function() {
            this._value.setValue('');  // квант обновляет поле
        }
    });
    // изменение содержимого поля обновляет квант

### Интеграция с библиотекой `Quantum`

В параметры шаблона можно передавать объекты `Quantum.Quant` (библиотека dresscode-quantum): при рендере их значения читаются через `getValue()`. При этом сам шаблон не реактивный: после того, как шаблон преобразован в строку, изменение кванта строку не изменит.

Реактивность появляется на уровне виджета (см. раздел выше):

- если `content` виджета – `Quantum.Quant`, содержимое перерисовывается при изменении значения;
- если это `Quantum.Array`, список перерисовывается при добавлении и удалении элементов;
- `Quantum.Quant` в `attrs`, `style`, `props`, `className` при изменении обновляет соответствующий атрибут/свойство элемента (если виджет смонтирован); в `className` отслеживаются кванты **на любой глубине** вложенных массивов.

### Стили

`Botex.CSS` – глобальный аккумулятор стилей. Метод `add(css)` добавляет правило, `compile()` возвращает результирующую CSS-строку. Правило – объект `селектор: {свойство: значение}`:

    Botex.CSS.add({
        '.panel': {
            'padding': 20,          // числа записываются с px
            'color': '#333',
            ':hover': {             // вложенный объект – вложенный селектор
                'background': '#eee'
            }
        }
    });
    Botex.CSS.compile();
    /*

     .panel {
        padding: 20px;
        color: #333;
    }
     .panel:hover {
        background: #eee;
    }
    */

Вложенный объект, начинающийся с `:`, компилируется как селектор псевдокласса, без `:` – как селектор вложенного элемента. Свойства, начинающиеся с `@media`/`@keyframes`, образуют блок каскада вокруг текущего правила.

Порядок работы с `Botex.CSS`: стили записываются в файл с виджетом между тегами `//#layer css` и `//#endlayer`.

    //#layer css
    Botex.CSS.add({
        '.$$': {
            'color': 'red'
        }
    });
    //#endlayer

    My.Widget = Bricks.inherit(Botex.Widget, {
        _render: {
            className: '$$'
        }
    });

Дальше возможны два варианта сборки, не требующие изменения кода виджетов. В рамках одного проекта для разных ситуаций можно использовать оба варианта.

**Вариант 1: всё в одном файле.** Собираем js-файлы с флагом `--layers css`: весь css попадает в js-файл, и при маунте виджета на страницу рендерится и css. Удобно, когда важно упаковать всё в один файл.

**Вариант 2: отдельный css-файл.** js-dev-файл скармливается утилите `botex compile-css`, которая достаёт оттуда весь css, обёрнутый в `//#layer css`, и складывает его в css-файл. Сборка js потом происходит без упоминания css во флагах `--layer`/`--layers` – js-код собирается без css. Для крупных проектов предпочтителен: результат получается компактнее и лучше кэшируется.

    botex compile-css <input> <output> [--private-dict=path/to/dict.json]

Если выводной файл не указан, результат печатается в консоль. В Node доступна та же функция:

    var botex = require('dresscode-botex');
    var {DressCode} = require('dresscodejs');
    
    var dresscode = new DressCode();
    botex.compileCSS(dresscode, 'path/to/file.js').then(function(css) {
        ...
    });

Код слоя `css` компилируется в контексте, где должен быть доступен объект `Botex`: в `.dresscode` проекта должен быть прописан путь до библиотеки (см. раздел «Установка»), иначе компиляция закончится `ReferenceError: Botex is not defined`.

### Готовые шаблоны

- `Botex.Tag` – произвольный HTML-тег;
- `Botex.Widget` – шаблон с DOM-жизненным циклом (mount/unmount, события, доступ к элементам);
- `Botex.Textbox` – поле ввода (`input`/`textarea`) с двусторонней привязкой к кванту;
- `Botex.Doctype` – `<!doctype html>`;
- `Botex.Script` – элемент `<script>` с `src` и `defer`;
- `Botex.InlineScript` – инлайновый скрипт: из функции `fn` и массива аргументов `args` генерируется `(fn).apply(window, JSON);` (последовательность `</script>` в коде безопасно подменяется);
- `Botex.Style` / `Botex.StyleLink` – элементы `<style>` и `<link rel="stylesheet">`.

## Разработка

Браузерные тесты (`test/tests/*.js`, mocha) и примеры использования (`samples/`) запускаются через dev-сервер: в файле `.yaxy` в корне репозитория описана конфигурация компилятора dresscodejs (`-i`), собирающего скрипты на лету. Тесты открываются по адресу `http://botex.tests/`, примеры – по адресу `http://botex.samples/` (сборка с `-debug`, поэтому приватные `$$`-имена в ней не обфусцируются).
