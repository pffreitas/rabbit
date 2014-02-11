var App = angular.module('rabbit', ['ngSanitize', 'filters', 'ngRoute', 'ngAnimate']);

App.config(['$routeProvider',
  function ($routeProvider) {
        $routeProvider.
        when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'CommitsController'

        }).
        when('/spotCommit/:project/:sha', {
            templateUrl: 'partials/fullscreen-commit.html',
            controller: 'SpottedCommitController'
        }).when('/oauth', {
            templateUrl: 'partials/oauth/home.html',
            controller: 'OAuthController'
        }).when('/oauth/token/:donut', {
            templateUrl: 'partials/oauth/token.html',
            controller: 'OAuthController'
        }).
        otherwise({
            redirectTo: '/home'
        });
        }]);

App.directive('time', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            element.text(element.text() + " " + moment(attrs.title).fromNow());
        }
    }
});

App.directive('diff', function () {
    return {
        link: function (scope, element, attrs) {
            var editor = ace.edit(element[0]);
            editor.setTheme("ace/theme/monokai");
            editor.getSession().setMode("ace/mode/diff");
            editor.setReadOnly(true);

            scope.$watch(attrs.diff, function (newVal) {
                editor.setValue(newVal);
                editor.gotoLine(0);
                element.css("height", (editor.getSession().getDocument().getLength() + 1) * 16);
            })
        }
    }
});


App.directive('compile', ['$compile',
    function ($compile) {
        return function (scope, element, attrs) {
            var ensureCompileRunsOnce = scope.$watch(
                function (scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);
                },
                function (value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);

                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);

                    // Use un-watch feature to ensure compilation happens only once.
                    ensureCompileRunsOnce();
                }
            );
        };
}]);



angular.module('filters', []).filter('truncate', function () {
    return function (text, length, end) {
        if (isNaN(length))
            length = 10;

        if (end === undefined)
            end = "...";

        if (text.length <= length || text.length - end.length <= length) {
            return text;
        } else {
            return String(text).substring(0, length - end.length) + end;
        }

    };
});