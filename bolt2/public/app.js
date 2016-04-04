angular.module("boltprofiles", ["ui.router","ngResource","ProjectModule","ProfileModule"])
 .config(function($stateProvider,$urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider.state('home', {
        url: '/home',
        templateUrl: '/templates/home.html'
    })
})