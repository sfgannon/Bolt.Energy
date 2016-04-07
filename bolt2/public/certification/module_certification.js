angular.module("CertificationModule", ["ui.router","ngResource"])
.config(function($stateProvider,$urlRouterProvider) {
    $stateProvider.state('certification', {
        cache: false,
        url: '/certification',
        templateUrl: '/templates/certification_home.html',
        controller: 'CertificationController'
    })
    .state('certification.detail', {
        url: '/detail/:certificationid',
        templateUrl: '/templates/certification_detail.html',
        controller: 'CertificationDetailController'
    })
})
.factory('CertificationFactory',function($resource){
    return $resource('http://localhost:3002/data/certifications/:id',{id:'@_id'},{
        update: {
            method: 'PUT'
        }
    })
})
.controller('CertificationController', ['$scope', '$http', 'CertificationFactory', function($scope, $http,CertificationFactory) {
    $scope.certifications = CertificationFactory.query();
}])
.controller('CertificationDetailController', ['$scope', '$http', '$state', '$stateParams', 'CertificationFactory', 'ProfileFactory', function($scope,$http,$state,$stateParams,CertificationFactory,ProfileFactory) {
    if ($stateParams.certificationid){
        //This is an existing certification
        var id = $stateParams.certificationid;
        $scope.certification = CertificationFactory.get({ id: id });
    } else {
        //This is a new certification
        $scope.certification = new CertificationFactory();
    };
    $scope.saveCertification = function() {
        if (!$scope.certification._id) {
            $scope.certification.$save(function() {
                alert('Certification successfully saved.');
                $scope.certifications = CertificationFactory.query(function() {
                    $state.go('certification', {}, { reload: true });
                });
            },
                function(error) {
                    alert(error.message);
                });
        } else {
            $scope.certification.$update(function() {
                alert('Certification successfully saved.');
                $state.go('certification', {}, { reload: true });
            },
                function(error) {
                    alert(error.message);
                    $state.go('certification');
                });
        }
    };
    $scope.cancelCertification = function() {
        $state.go('certification');
    };
    $scope.deleteCertification = function() {
        $scope.certification.$remove(
            function() {
                alert('Certification successfully deleted.');
                $scope.certifications = CertificationFactory.query(function() {
                    $state.go('certification', {}, { reload: true });
                })
            },
            function(error) {
                alert(error.message);
                $state.go('certification');
            });
    };
}])