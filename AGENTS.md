# Botex (dresscode-botex)

Шаблонизатор + библиотека UI-виджетов в методологии DressCodeJS: глобальные классы (Bricks.inherit), без модулей, собираются dresscodejs.

## Знания

- `lib/Botex/*.js` не имеют `module.exports` — файлы подключаются dresscodejs-компилятором как глобалы; `lib/.dresscode` перечисляет Bricks/Quantum/Ponyfills в двух вариантах путей: `../node_modules` (локальная разработка) и `../../../node_modules` (npm-установка в проект).
- Тесты: node-тесты удалены (2026-09-28, они проверяли снятый `//#if css`-механизм). Браузерные тесты (test/tests/*.js) — mocha-скрипты для браузера: запускаются вручную через .yaxy-сервер (dresscodejs -i) и http://botex.tests/; `mocha test` не рекурсивно входит в test/tests, поэтому их не подхватывает.
- Конвенция экспорта CSS — `//#layer css ... //#endlayer` в шаблонах (dresscodejs 2.x): код регистрирует стили в Botex.CSS и компилируется только при `compileCSS`. Предыдущий механизм `//#if css` + context `{css: true}` заменён в 3381f0f и не поддерживается. Экспорт бандлов (`--bundle`) из CLI упразднён осознанно. В readme конвенция не описана.
- dresscodejs кеширует парсинг по имени виртуального файла (`_parserPromises`/`_internalFiles`): поэтому `compileCSS` даёт виртуальному файлу уникальное имя `${fname}.css`, а не константу (коммит 09987df) — иначе при компиляции нескольких файлов одним DressCode второе имя возвращало бы закэшированный контент первого.
- `Botex.toString` эскейпит только примитивные строки; `new String(...)` — маркер «безопасного» HTML (content в Tag, Botex.Style, InlineScript). В InlineScript замена `</script> → <\/script>` применяется к всей сгенерированной строке, включая JSON-аргументы.
- Quantum.Quant (dresscode-quantum): `setValue`/`_updateScalarValue` срабатывают только при строгом `!==`; зависимость `combine`/`spread`/`when` никогда не снимается — утечка подписок по дизайн-компромисс.
- Botex.Textbox: двусторонняя привязка через замыкание `lastValue` — если `el.value` уже равен значению кванта, callback возвращает предыдущую String-ссылку, change не срабатывает (строгий `===` в setValue) и ввод пользователя не затирается.
- `Botex.Template._getParams()` кешируется на экземпляре: цепочка `_render` (дочерний → родительский) выполняется один раз; `toString()` триггерит полный рендер.
- Botex.Widget: `_elemsStore` локален; дочерние store вешаются через `addChild`, их события re-fire в родительский (наблюдатель верхнего уровня видит все потомков). `_winId`/`_docId`/`_rootId` = `String(Math.random())` — ключи store, с className конфликтовать не могут (в классе нет точек).
- Botex.CSS — глобальный аккумулятор стилей; числовые значения получают `px`; в браузере `<style id="$$__style">` переписывается только в `Widget.mount` (см. todo 20260927-8).
- Botex.MutableArray — предшественник Quantum.Array, @deprecated: оставлен для обратной совместимости, не чинить (включая странность shift()).
- package.json: плавающие `>=`-версии dresscode-bricks / dresscode-quantum / dresscode-ponyfills задуманы — библиотеки разрабатываются со строгой обратной совместимостью, новые версии не ломают существующий код.
- `.yaxy` — конфиг dev-серверов для ручной проверки: botex.tests (браузерные тесты) и botex.samples (samples); команды ссылаются на dresscodejs из `~/node_modules/.bin` и на домашний `~/test`, `~/samples`.
