App.factory('CommitModel', function () {
    return {
        //TODO think about project sort
        projects: [
            {
                name: "synchro-gov-social"
            },
            {
                name: "doc-componentes"
            },
            {
                name: "synchro-oauth-provider"
            },
            {
                name: "synchro-workflow"
            },
            {
                name: "synchro-gui-grails"
            },
            {
                name: "synchro-foundation"
            },
            {
                name: "appref-model"
            },
            {
                name: "appref-view"
            },
            {
                name: "synchro-ctrlusu-grails"
            },
            {
                name: "synchro-integration"
            },
            {
                name: "appref-arquitetura"
            },
            {
                name: "synchro-hd-grails"
            }
        ],

        selectedProject: !1,

        spottedCommit: !1
    };
});

App.controller('CommitsController', ['$scope', '$http', 'CommitModel',
    function CommitsController($scope, $http, CommitModel) {

        $scope.CommitModel = CommitModel;
        $scope.projects = selectProjectToFetch();

        $scope.fetchCommits = function () {
            for (p in $scope.projects) {
                $scope.projects[p].lastFetch = !1;

                $http.get($scope.projects[p].name + '/commits/list', {
                    project: $scope.projects[p]
                }).success(
                    function (retorno, status, headers, config) {
                        var project = config.project;
                        if (!CommitModel.selectedProject) CommitModel.selectedProject = project;
                        project.commits = retorno;
                        project.lastFetch = new Date();
                    }
                );
            }
        }

        $scope.markAsReaded = function (project, sha) {
            $http.get(project + '/commits/' + sha + '/comments/markAsReaded').success(function (r, s, h, c) {
                console.log("success", r, s);
            });
        }

        $scope.fetchCommits();

        function selectProjectToFetch() {
            return _.filter(CommitModel.projects, function (i) {
                return _.isUndefined(i.lastFetch) || i.lastFetch === false;
            });
        }
}]);


App.controller('SpottedCommitController', ['$scope', '$http', '$routeParams', 'CommitModel',
    function CommitsController($scope, $http, $routeParams, CommitModel) {
        $scope.commit = !1;
        $scope.commitPartialInfo = CommitModel.spottedCommit;
        $scope.currentView = 'overview';

        $scope.spotCommit = function (project, sha) {
            $http.get(project + '/commits/' + sha).success(function (retorno, status, headers, config) {
                $scope.commit = retorno;
                $scope.commitPartialInfo = $scope.commitPartialInfo || $scope.commit
            });
        }

        $scope.spotCommit($routeParams.project, $routeParams.sha);
    }
]);