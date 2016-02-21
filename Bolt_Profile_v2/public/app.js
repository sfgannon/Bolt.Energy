angular.module("boltprofiles", ["ui.router", "HomeCtrl", "CertCtrl", "CertService", "ProfCtrl", "ProfService"])
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

    .state('prof', {
        url: '/prof',
        templateUrl: '/templates/profile.html'
    })

    .state('prof.list', {
        url: '/prof/list',
        templateUrl: '/templates/profile_list.html',
        controller: 'ProfController'
    })

    .state('prof.detail', {
        url: '/prof/detail/:profid',
        templateUrl: '/templates/profile_detail.html',
        controller: 'ProfDetailController'
    })



  })