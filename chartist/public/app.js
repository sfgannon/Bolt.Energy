var thisApp = angular.module("boltchartist", ["angular-chart","ui.router"])
  .config(function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'templates/home.html'
    })

    .state('home.embedded', {
        url: '/embedded',
        templateUrl: '/templates/embedded.html'
    })

    .state('home.generated', {
        url: '/generated',
        templateUrl: '/templates/generated.html',
        controller: 'LineCtrl'
    })

  })
  
]);