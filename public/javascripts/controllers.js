App.controller('CommitsController', ['$scope', '$http', '$timeout',
    function CommitsController($scope, $http, $timeout) {

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
        }

        function init() {
            $scope.fetchCommits();
        }
        init();

}]);


App.controller('SpottedCommitController', ['$scope', '$http', '$routeParams',
    function CommitsController($scope, $http, $routeParams) {
        $scope.c = !1;

        $scope.spotCommit = function (project, sha) {
            $http.get(project + '/commits/' + sha).success(function (retorno, status, headers, config) {
                $scope.c = retorno;
            });
        }

        $scope.spotCommit($routeParams.project, $routeParams.sha);
    }
]);