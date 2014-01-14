var App = angular.module('rabbit', ['ngSanitize']);

App.controller('NewsController', ['$scope', '$http', function NewsController($scope, $http) {

    $scope.feed = [];
    $scope.projects = [
        { text: "syn-framework"},
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
    ];
    $scope.watched = $scope.projects;
    
    
    
    $http.post('/fetchNews').success(function(retorno) {
        $scope.feed = retorno.feed;
        $scope.fetchNews();
    });

    $scope.fetchNews = function() {
        if ($scope.feed.pushes) {
            $scope.pushes = $scope.feed.pushes.filter(function(e){
                for(var i = 0; i < $scope.watched.length; i++){
                    var prj = $scope.watched[i];
                    if(e.title.indexOf(prj.text) != -1){
                        return true;
                    }
                }
                return false;
            });
        }
    }
    
    $scope.$watch("watched", $scope.fetchNews);
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