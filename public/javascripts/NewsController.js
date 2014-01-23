var App = angular.module('rabbit', ['ngSanitize']);

/*
{ text: "synchro-gov-social" },
        { text: "doc-componentes"  },
        { text: "synchro-oauth-provider"  },
        { text: "synchro-workflow"  },
        { text: "synchro-gui-grails"  },
        { text: "synchro-foundation"  },
        { text: "appref-model"  },
        { text: "appref-view"  },
        { text: "synchro-ctrlusu-grails"  },
        { text: "syn-mule-esb"  },
        { text: "appref-arquitetura"  },
        { text: "synchro-hd-grails"  }
        */

App.controller('NewsController', ['$scope', '$http', '$timeout',  function NewsController($scope, $http, $timeout) {

    $scope.projects = {
         "syn-framework": {}, "appref-arquitetura": {}    
    };
            
    $scope.fetchCommits = function(){
        for(p in $scope.projects){
            $http.get(p + '/commits/list', {project: p}).success(
                function(retorno, status, headers, config) {
                    $scope.projects[config.project].commits = retorno;
                }
            );
        }
        
        //$timeout($scope.fetchCommits, 3000);
    }
    
    function init(){
        $scope.fetchCommits(); 
    }
    init();
    
}]);


App.directive('time', function() {
    
    return {
        restrict:'E',
        link: function (scope,element,attrs) {
            element.text(moment(attrs.title).fromNow());
        }
    }
});

App.directive('chosen', function() {
    var linker = function(scope,element,attrs) {
        var list = attrs.chosen;
         
        scope.$watch(list , function(){
            element.trigger("chosen:updated");
        });
        
        scope.$watch(attrs['ngModel'], function() {
            element.trigger('chosen:updated');
        });

        element.chosen({width: "100%;"});
    };

    return {
        restrict:'A',
        link: linker
    }
});


App.directive('compile', ['$compile', function ($compile) {
      return function(scope, element, attrs) {
          var ensureCompileRunsOnce = scope.$watch(
            function(scope) {
               // watch the 'compile' expression for changes
              return scope.$eval(attrs.compile);
            },
            function(value) {
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