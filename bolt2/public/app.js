angular.module("boltprofiles", ["ui.router", "HomeCtrl", "CertCtrl", "CertService", "ProfCtrl", "ProfService", "ProfileModule"])
 .config(function($stateProvider,$urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider.state('home', {
        url: '/home',
        templateUrl: '/templates/home.html',
        controller: 'HomeController'
    })

    .state('cert', {
        url: '/cert',
        templateUrl: '/templates/certification.html'
    })

    .state('cert.list', {
        url: '/cert/list',
        templateUrl: '/templates/certification_list.html',
        controller: 'CertController'
    })

    .state('cert.detail', {
    	url: '/cert/detail/:certid',
    	templateUrl: '/templates/certification_detail.html',
    	controller: 'CertDetailController'
    })
})