var App = angular.module('rabbit', ['ngSanitize']);

App.controller('NewsController', ['$scope', '$http', '$timeout',
    function NewsController($scope, $http, $timeout) {

        //TODO think about project sort
        $scope.projects = {
            "synchro-gov-social": {},
            "doc-componentes": {},
            "synchro-oauth-provider": {},
            "synchro-workflow": {},
            "synchro-gui-grails": {},
            "synchro-foundation": {},
            "appref-model": {},
            "appref-view": {},
            "synchro-ctrlusu-grails": {},
            "synchro-integration": {},
            "appref-arquitetura": {},
            "synchro-hd-grails": {}
        };

        $scope.selectedProject = !1;

        $scope.fetchCommits = function () {
            for (p in $scope.projects) {
                $scope.projects[p].name = p;
                $http.get(p + '/commits/list', {
                    project: p
                }).success(
                    function (retorno, status, headers, config) {
                        if (!$scope.selectedProject) $scope.selectedProject = $scope.projects[config.project];
                        $scope.projects[config.project].commits = retorno;
                    }
                );
            }

            //$timeout($scope.fetchCommits, 3000);
        }

        function init() {
            $scope.fetchCommits();
        }
        init();

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