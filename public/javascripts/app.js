var App = angular.module('rabbit', ['ngSanitize', 'filters', 'ngRoute', 'ngAnimate']);

App.config(['$routeProvider',
  function ($routeProvider) {
        $routeProvider.
        when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'CommitsController'

        }).
        when('/spotCommit', {
            templateUrl: 'partials/fullscreen-commit.html'
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

App.directive('chosen', function () {
    var linker = function (scope, element, attrs) {
        var list = attrs.chosen;

        scope.$watch(list, function () {
            element.trigger("chosen:updated");
        });

        scope.$watch(attrs['ngModel'], function () {
            element.trigger('chosen:updated');
        });

        element.chosen({
            width: "100%;"
        });
    };

    return {
        restrict: 'A',
        link: linker
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