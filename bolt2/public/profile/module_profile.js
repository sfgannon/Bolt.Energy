angular.module("ProfileModule", ["ui.router"])
.config(function($stateProvider,$urlRouterProvider) {
    $stateProvider.state('prof', {
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