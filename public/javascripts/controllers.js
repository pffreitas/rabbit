App.factory('CommitData', function () {
    return {
        spottedCommit: !1
    };
});

App.controller('CommitsController', ['$scope', '$http', 'CommitData',
    function CommitsController($scope, $http, CommitData) {

        $scope.commitData = CommitData;

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


App.controller('SpottedCommitController', ['$scope', '$http', '$routeParams', 'CommitData',
    function CommitsController($scope, $http, $routeParams, CommitData) {
        $scope.commit = !1;
        $scope.commitPartialInfo = CommitData.spottedCommit;

        $scope.spotCommit = function (project, sha) {
            $http.get(project + '/commits/' + sha).success(function (retorno, status, headers, config) {
                $scope.commit = retorno;
                $scope.commitPartialInfo = $scope.commitPartialInfo || $scope.commit
            });
        }

        $scope.spotCommit($routeParams.project, $routeParams.sha);
    }
]);