# Botex – шаблонизатор и библиотека для построения UI

Botex написан в методологии DressCodeJS.

## Установка

    npm i -D dresscode-botex
    
Версию в package.json после установки желательно поменять на latest. В .dresscode-файлах прописываем путь до библиотеки: 
    
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
    
Шаблон принимает параметры, список которых со значениями по умолчанию описывается в свойстве `params`. Метод `_render` принимает предобработанные параметре в первом аргументе.

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

Для создания HTML-тегов есть предопределённый шаблон `Botex.Tag`

### Аккумулируемые параметры

По-умолчанию, переопределённые параметры затирают предыдущее значение. 

### Функция `Botex.zen`

### Интеграция с библиотекой `Quantum`
