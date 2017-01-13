(function(){
  'use strict';
  angular.module('ShingoDocumentationApp', ['ngRoute', 'ngMaterial', 'ngMessages', 'ngSanitize', 'angularTrix'])
  .config(function($routeProvider, $mdThemingProvider){
    $routeProvider
    .when('/',{
      templateUrl: 'templates/home.html'
    })
    .when('/project/:uuid', {
      templateUrl: 'templates/project/view.tmpl.html'
    })
    .when('/document/:uuid', {
      templateUrl: 'templates/document/view.tmpl.html'
    })
    .when('/method/:uuid', {
      templateUrl: 'templates/method/view.tmpl.html'
    })
    .when('/tag', {
      templateUrl: 'templates/tags.html'
    })
    .when('/tag/:uuid', {
      templateUrl: 'templates/tag/view.tmpl.html'
    })
    .when('/search', {
      templateUrl: 'templates/search.html'
    })
    .otherwise({
      redirectTo: '/'
    });

    var shingoRedMap = $mdThemingProvider.extendPalette('red',{
      '500': '#640921'
    });
    var shingoBlueMap = $mdThemingProvider.extendPalette('blue',{
      '500': '#003768'
    })
    $mdThemingProvider.definePalette('shingoBlue', shingoBlueMap);
    $mdThemingProvider.definePalette('shingoRed', shingoRedMap);
    $mdThemingProvider.theme('default')
    .primaryPalette('shingoBlue', {'default':'500'})
    .accentPalette('shingoRed', {'default': '500'});
  })

  angular.module('ShingoDocumentationApp').constant('_',_);
})();
