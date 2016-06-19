#States
    Доступы по ролям:
    Dashboard - все
    Login - unauthed
    Admin - Reseller
    LNP - Reseller

# Сервис Авторизации

    testProject\src\client\app\core\authService\authService.js

    Представляет собой провайдер c возможностью конфигурировать точку аутентификации

    Имеет следующий api:

    authenticate - запрос на аутентификацию, после аутентификации кеширует данные пользователя и выпускает соответствующее событие

    getUserData - возвращает закешированные данные о пользователе
 
    getToken - возвращает JWT токен 

    isAuthentificated - возвращает true или false в зависимости от того, зарегистрирован ли пользователь

    isAuthorized - сверяет роль текущего пользователя с массивом переданных в метод ролей

    getRole - возвращает роль текущего пользователя

    logout - чистит localstorage и выпускает соответствующее собыйтие 

    Кнопка logout появляется в верхнем правом углу экрана

# Cache manager
    testProject\src\client\app\core\cacheManager\cacheManager.js

    Позволяет кешировать данные, используя localforage.
    Тут все оказывается довольно просто. 
    api:

    Get - Возвращает значение по ключу, делает reject если значение null
    Set - сохраняет 
    Has - возвращает true если под таким ключом что-либо сохранено (кроме), или делает reject со значением false если нет
    Clear - Очищает весь кеш или элемент в зависимости от переданного параметра

# Tokens and http headers

    testProject\src\client\app\core\authService\authService.module.js

    При работе с тестовым сервером для реализации CRUD операций, необходимо в запросе передавать token, я реализовал это
    не через httpInterceptors (что может и было бы логичней), а с помощью сервиса $http (Это же можно было сделать и через его провайдер $httpProvider)
    через $http.defaults.headers.get (Так как я реализовал получение данных);

    Добавляется Authorization header в двух случаях - 1) если пользователь уже аутонтефицирован
                                                      2) если он аутонтефицировался во время работы

    Убирается он, соответсвенно, если пользователь сделал logout

# Accessing to the states
    testProject\src\client\app\blocks\router\stateWatcher.js

    Настройка модуля router

    Функция позволяет отслеживать события переходов между states и проверяет с помощью myAuth.isAuthorized соответствует ли роль пользователя настройкам допуска state.settings.roles
    если роль не соответствует пользователь отправляется в тот state из которого он пришел,
    если пользователь переходит через адресную строку(То есть предыдущего formState стейта нет), мы отлавливаем это в конструкции try catch и  отправляем на дефолтный   стейт( в моем случае dashboard );

    myAuth.isAuthorized используется так же при фильтрации навигационных ссылок в сайдбаре;

# Base service 
    Обе модели, использующиеся для получения данных (lnpModel и dataservice), я перевел на использование Base сервиса.
    Учитывая, что в этом приложении моделями используется сразу два сервера, мне пришлось внести в BaseService небольшую коррективу:

    Init(apiUrl, modelName, server, isArray, cacheParams, urlPostfix, urlPostfixParams)  третьим параметром указывается сервер, использующийся для данной модели

    сервис $ds соответсвенно ищет в объекте servers, соответсвующий url и формирует api url:

    function WrapUrl(url, server) {
      //Perhaps not the best idea, but i have 2 servers to handle
        return config.servers[server] + url;
    }





# testApp

**Generated from HotTowel Angular**

>*Opinionated Angular style guide for teams by [@john_papa](//twitter.com/john_papa)*

>More details about the styles and patterns used in this app can be found in my [Angular Style Guide](https://github.com/johnpapa/angularjs-styleguide) and my [Angular Patterns: Clean Code](http://jpapa.me/ngclean) course at [Pluralsight](http://pluralsight.com/training/Authors/Details/john-papa) and working in teams.

## Prerequisites

1. Install [Node.js](http://nodejs.org)
 - on OSX use [homebrew](http://brew.sh) `brew install node`
 - on Windows use [chocolatey](https://chocolatey.org/) `choco install nodejs`

2. Install Yeoman `npm install -g yo`

3. Install these NPM packages globally

    ```bash
    npm install -g bower gulp nodemon
    ```

    >Refer to these [instructions on how to not require sudo](https://github.com/sindresorhus/guides/blob/master/npm-global-without-sudo.md)

## Running HotTowel

### Linting
 - Run code analysis using `gulp vet`. This runs jshint, jscs, and plato.

### Tests
 - Run the unit tests using `gulp test` (via karma, mocha, sinon).

### Running in dev mode
 - Run the project with `gulp serve-dev`

 - opens it in a browser and updates the browser with any files changes.

### Building the project
 - Build the optimized project using `gulp build`
 - This create the optimized code for the project and puts it in the build folder

### Running the optimized code
 - Run the optimize project from the build folder with `gulp serve-build`

## Exploring HotTowel
HotTowel Angular starter project

### Structure
The structure also contains a gulpfile.js and a server folder. The server is there just so we can serve the app using node. Feel free to use any server you wish.

	/src
		/client
			/app
			/content

### Installing Packages
When you generate the project it should run these commands, but if you notice missing packages, run these again:

 - `npm install`
 - `bower install`

### The Modules
The app has 4 feature modules and depends on a series of external modules and custom but cross-app modules

```
app --> [
        app.admin --> [
            app.core,
            app.widgets
        ],
        app.dashboard --> [
            app.core,
            app.widgets
        ],
        app.layout --> [
            app.core
        ],
        app.widgets,
		app.core --> [
			ngAnimate,
			ngSanitize,
			ui.router,
			blocks.exception,
			blocks.logger,
			blocks.router
		]
    ]
```

#### core Module
Core modules are ones that are shared throughout the entire application and may be customized for the specific application. Example might be common data services.

This is an aggregator of modules that the application will need. The `core` module takes the blocks, common, and Angular sub-modules as dependencies.

#### blocks Modules
Block modules are reusable blocks of code that can be used across projects simply by including them as dependencies.

##### blocks.logger Module
The `blocks.logger` module handles logging across the Angular app.

##### blocks.exception Module
The `blocks.exception` module handles exceptions across the Angular app.

It depends on the `blocks.logger` module, because the implementation logs the exceptions.

##### blocks.router Module
The `blocks.router` module contains a routing helper module that assists in adding routes to the $routeProvider.

## Gulp Tasks

### Task Listing

- `gulp help`

    Displays all of the available gulp tasks.

### Code Analysis

- `gulp vet`

    Performs static code analysis on all javascript files. Runs jshint and jscs.

- `gulp vet --verbose`

    Displays all files affected and extended information about the code analysis.

- `gulp plato`

    Performs code analysis using plato on all javascript files. Plato generates a report in the reports folder.

### Testing

- `gulp serve-specs`

    Serves and browses to the spec runner html page and runs the unit tests in it. Injects any changes on the fly and re runs the tests. Quick and easy view of tests as an alternative to terminal via `gulp test`.

- `gulp test`

    Runs all unit tests using karma runner, mocha, chai and sinon with phantomjs. Depends on vet task, for code analysis.

- `gulp test --startServers`

    Runs all unit tests and midway tests. Cranks up a second node process to run a server for the midway tests to hit a web api.

- `gulp autotest`

    Runs a watch to run all unit tests.

- `gulp autotest --startServers`

    Runs a watch to run all unit tests and midway tests. Cranks up a second node process to run a server for the midway tests to hit a web api.

### Cleaning Up

- `gulp clean`

    Remove all files from the build and temp folders

- `gulp clean-images`

    Remove all images from the build folder

- `gulp clean-code`

    Remove all javascript and html from the build folder

- `gulp clean-fonts`

    Remove all fonts from the build folder

- `gulp clean-styles`

    Remove all styles from the build folder

### Fonts and Images

- `gulp fonts`

    Copy all fonts from source to the build folder

- `gulp images`

    Copy all images from source to the build folder

### Styles

- `gulp styles`

    Compile less files to CSS, add vendor prefixes, and copy to the build folder

### Bower Files

- `gulp wiredep`

    Looks up all bower components' main files and JavaScript source code, then adds them to the `index.html`.

    The `.bowerrc` file also runs this as a postinstall task whenever `bower install` is run.

### Angular HTML Templates

- `gulp templatecache`

    Create an Angular module that adds all HTML templates to Angular's $templateCache. This pre-fetches all HTML templates saving XHR calls for the HTML.

- `gulp templatecache --verbose`

    Displays all files affected by the task.

### Serving Development Code

- `gulp serve-dev`

    Serves the development code and launches it in a browser. The goal of building for development is to do it as fast as possible, to keep development moving efficiently. This task serves all code from the source folders and compiles less to css in a temp folder.

- `gulp serve-dev --nosync`

    Serves the development code without launching the browser.

- `gulp serve-dev --debug`

    Launch debugger with node-inspector.

- `gulp serve-dev --debug-brk`

    Launch debugger and break on 1st line with node-inspector.

### Building Production Code

- `gulp optimize`

    Optimize all javascript and styles, move to a build folder, and inject them into the new index.html

- `gulp build`

    Copies all fonts, copies images and runs `gulp optimize` to build the production code to the build folder.

### Serving Production Code

- `gulp serve-build`

    Serve the optimized code from the build folder and launch it in a browser.

- `gulp serve-build --nosync`

    Serve the optimized code from the build folder and manually launch the browser.

- `gulp serve-build --debug`

    Launch debugger with node-inspector.

- `gulp serve-build --debug-brk`

    Launch debugger and break on 1st line with node-inspector.

### Bumping Versions

- `gulp bump`

    Bump the minor version using semver.
    --type=patch // default
    --type=minor
    --type=major
    --type=pre
    --ver=1.2.3 // specific version

## License

MIT
