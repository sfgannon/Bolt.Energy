angular.module("boltprofiles", ["ui.router", "HomeCtrl", "CertCtrl", "CertService"])
 .config(function($stateProvider,$urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider.state('home', {
        url: '/home',
        templateUrl: '/templates/home.html',
        controller: 'HomeController'
    })

    .state('cert', {
        url: '/cert',
        templateUrl: '/templates/certification.html',
        controller: 'CertController'
    })

    .state('cert.detail', {
    	url: '/cert/detail?id=:id',
    	templateUrl: '/templates/certification_detail.html',
    	controller: 'CertDetailController'
    })

    .state('prof', {
        url: '/prof',
        templateUrl: '/templates/profile.html',
        controller: 'ProfileController'
    })

  })
	// .config(function($stateProvider,$urlRouteProvider) {
	// 	$urlRouteProvider.otherwise('/home');

	// 	$stateProvider.state('home', {
	// 		url: "/home",
	// 		templateUrl: "templates/home.html"
	// 	});

	// 	$stateProvider.state('certifications', {
	// 		url: "/certifications",
	// 		templateUrl: "templates/certifications.html"
	// 	});

	// 	$stateProvider.state('profiles', {
	// 		url: "/profiles",
	// 		templateUrl: "templates/profiles.html"
	// 	})
	// });