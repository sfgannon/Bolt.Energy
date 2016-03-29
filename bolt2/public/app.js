angular.module("boltprofiles", ["ui.router","ngResource","ProjectModule"])
 .config(function($stateProvider,$urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider.state('home', {
        url: '/home',
        templateUrl: '/templates/home.html'
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